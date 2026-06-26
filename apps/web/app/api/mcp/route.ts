import { createMcpHandler, getPublicOrigin, withMcpAuth } from 'mcp-handler';
import { z } from 'zod';
import {
  createFoodLogEntry,
  createPantryFood,
  getNutritionDay,
  getNutritionRange,
  listCombos,
  listPantryFoods,
  logCombo,
  upsertBodyweightEntry,
} from '@/lib/database';
import {
  createWorkoutSessionFromMcp,
  type CreateMcpWorkoutSessionInput,
} from '@/lib/workout-session-save';
import {
  getMcpExerciseProgress,
  getMcpProgressSummary,
  getMcpRoutinesSnapshot,
  getMcpWorkoutSession,
  listMcpWorkoutSessions,
} from '@/lib/mcp/progress-export';
import { verifyMcpAccessToken } from '@/lib/mcp/oauth';

export const runtime = 'nodejs';
export const maxDuration = 60;

const dateRangeInput = {
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('Inclusive start date in YYYY-MM-DD format. Defaults to 90 days before `to`.'),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('Inclusive end date in YYYY-MM-DD format. Defaults to today.'),
};

const createWorkoutSessionInput = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Workout completion date in YYYY-MM-DD format. Stored at noon UTC for that date.'),
  exercises: z.array(z.object({
    name: z.string().min(1).max(160),
    sets: z.array(z.object({
      weight: z.number().min(0).max(2000).describe('Stored primary metric value. For weight-based exercises, provide pounds (lbs); the Gymmer UI converts kg to stored lbs before saving.'),
      reps: z.number().int().min(1).max(1000),
      isWarmup: z.boolean().optional(),
    })).min(1).max(5).describe('Ordered sets. At most one set may be marked isWarmup; Gymmer stores up to four working sets.'),
  })).min(1).max(60),
  durationMinutes: z.number().int().min(1).max(1440).optional(),
  notes: z.string().min(1).max(4000).optional().describe("Optional session notes, stored in Gymmer's existing workout_report text field."),
});

type ToolArgs = Record<string, unknown>;
type ToolExtra = { authInfo?: { scopes?: string[]; extra?: Record<string, unknown> } };
type ToolResult = ReturnType<typeof jsonContent>;
type RegisterTool = (
  name: string,
  config: {
    title: string;
    description: string;
    inputSchema?: Record<string, z.ZodTypeAny>;
  },
  callback: (args: ToolArgs, extra: ToolExtra) => Promise<ToolResult>
) => void;

function getUserId(extra: { authInfo?: { extra?: Record<string, unknown> } }): string {
  const userId = extra.authInfo?.extra?.userId;
  if (typeof userId !== 'string' || userId.length === 0) {
    throw new Error('Missing authenticated Temple user');
  }
  return userId;
}

function requireWriteScope(extra: ToolExtra): void {
  if (!extra.authInfo?.scopes?.includes('gymmer:write')) {
    throw new Error('Missing gymmer:write scope');
  }
}

function jsonContent(data: unknown) {
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

function optionalString(args: ToolArgs, key: string): string | undefined {
  const value = args[key];
  return typeof value === 'string' ? value : undefined;
}

function optionalNumber(args: ToolArgs, key: string): number | undefined {
  const value = args[key];
  return typeof value === 'number' ? value : undefined;
}

function optionalNullableNumber(args: ToolArgs, key: string): number | null {
  const value = args[key];
  return typeof value === 'number' ? value : null;
}

const mcpHandler = createMcpHandler(
  (server) => {
    const registerTool = server.registerTool.bind(server) as unknown as RegisterTool;

    registerTool(
      'get_progress_summary',
      {
        title: 'Get Gymmer progress summary',
        description: 'Summarize Gymmer workout frequency, streaks, exercise leaders, cardio, recent sessions, and recent workout reports for the authenticated Temple user.',
        inputSchema: dateRangeInput,
      },
      async (args, extra) => {
        const data = await getMcpProgressSummary(getUserId(extra), {
          from: optionalString(args, 'from'),
          to: optionalString(args, 'to'),
        });
        return jsonContent(data);
      }
    );

    registerTool(
      'list_workout_sessions',
      {
        title: 'List Gymmer workout sessions',
        description: 'List completed Gymmer workout sessions for the authenticated Temple user within a date range. Results are paginated with a cursor.',
        inputSchema: {
          ...dateRangeInput,
          limit: z.number().int().min(1).max(50).optional(),
          cursor: z.string().optional().describe('Pagination cursor returned by the previous call.'),
        },
      },
      async (args, extra) => {
        const data = await listMcpWorkoutSessions(getUserId(extra), {
          from: optionalString(args, 'from'),
          to: optionalString(args, 'to'),
          limit: optionalNumber(args, 'limit'),
          cursor: optionalString(args, 'cursor'),
        });
        return jsonContent(data);
      }
    );

    registerTool(
      'get_workout_session',
      {
        title: 'Get Gymmer workout session',
        description: 'Fetch full exercise and cardio detail for one completed Gymmer workout session owned by the authenticated Temple user.',
        inputSchema: {
          sessionId: z.number().int().positive(),
        },
      },
      async (args, extra) => {
        const sessionId = optionalNumber(args, 'sessionId');
        if (typeof sessionId !== 'number') throw new Error('sessionId is required');
        const data = await getMcpWorkoutSession(getUserId(extra), sessionId);
        return jsonContent(data);
      }
    );

    registerTool(
      'get_exercise_progress',
      {
        title: 'Get Gymmer exercise progress',
        description: 'Fetch session-by-session set history for a specific exercise within a date range.',
        inputSchema: {
          ...dateRangeInput,
          exerciseName: z.string().min(1),
        },
      },
      async (args, extra) => {
        const exerciseName = optionalString(args, 'exerciseName');
        if (!exerciseName) throw new Error('exerciseName is required');
        const data = await getMcpExerciseProgress(getUserId(extra), {
          from: optionalString(args, 'from'),
          to: optionalString(args, 'to'),
          exerciseName,
        });
        return jsonContent(data);
      }
    );

    registerTool(
      'get_routines_snapshot',
      {
        title: 'Get Gymmer routines snapshot',
        description: 'Fetch the authenticated Temple user’s Gymmer routines with exercises, stretches, and cardio setup.',
        inputSchema: {},
      },
      async (_args, extra) => {
        const data = await getMcpRoutinesSnapshot(getUserId(extra));
        return jsonContent(data);
      }
    );

    registerTool(
      'create_workout_session',
      {
        title: 'Create Gymmer workout session',
        description: "Create a completed Gymmer free-workout session for the authenticated Temple user. Uses the same save helper as /api/save-workout, stores exercise rows in order, maps one isWarmup set to the warmup columns, stores up to four working sets as set1..set4, and computes strain with Gymmer's existing weight-primary logic. Weight values are stored in pounds (lbs), which is Gymmer's database storage unit behind UI kg/lbs conversion. Exact case-insensitive exercise catalog matches are canonicalized to the catalog name; unmatched names are stored exactly like a custom app session exercise. Requires gymmer:write.",
        inputSchema: createWorkoutSessionInput.shape,
      },
      async (args, extra) => {
        requireWriteScope(extra);
        const input = createWorkoutSessionInput.parse(args) as CreateMcpWorkoutSessionInput;
        const data = await createWorkoutSessionFromMcp(getUserId(extra), input);
        return jsonContent(data);
      }
    );

    registerTool(
      'list_pantry_foods',
      {
        title: 'List Nommer pantry foods',
        description: 'List the authenticated Temple user’s personal pantry foods and per-serving macros.',
        inputSchema: {},
      },
      async (_args, extra) => {
        const data = await listPantryFoods(getUserId(extra));
        return jsonContent(data);
      }
    );

    registerTool(
      'get_nutrition_day',
      {
        title: 'Get Nommer nutrition day',
        description: 'Fetch food log entries, totals, targets, and bodyweight for one nutrition day.',
        inputSchema: {
          date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        },
      },
      async (args, extra) => {
        const date = optionalString(args, 'date');
        if (!date) throw new Error('date is required');
        const data = await getNutritionDay(getUserId(extra), date);
        return jsonContent(data);
      }
    );

    registerTool(
      'get_nutrition_range',
      {
        title: 'Get Nommer nutrition range',
        description: 'Fetch daily calorie/protein totals and bodyweight across an inclusive date range.',
        inputSchema: {
          from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        },
      },
      async (args, extra) => {
        const from = optionalString(args, 'from');
        const to = optionalString(args, 'to');
        if (!from || !to) throw new Error('from and to are required');
        const data = await getNutritionRange(getUserId(extra), from, to);
        return jsonContent(data);
      }
    );

    registerTool(
      'log_food',
      {
        title: 'Log Nommer food',
        description: 'Create a food log entry for the authenticated Temple user. If pantry_food_id is omitted, the entry is a one-off food.',
        inputSchema: {
          date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          name: z.string().min(1).max(120),
          calories: z.number().int().min(0).max(10000),
          protein_g: z.number().min(0).max(1000),
          carbs_g: z.number().min(0).max(1000).optional(),
          fat_g: z.number().min(0).max(1000).optional(),
          quantity: z.number().min(0.01).max(100).optional(),
          pantry_food_id: z.number().int().positive().optional(),
        },
      },
      async (args, extra) => {
        requireWriteScope(extra);
        const date = optionalString(args, 'date');
        const name = optionalString(args, 'name');
        const calories = optionalNumber(args, 'calories');
        const proteinG = optionalNumber(args, 'protein_g');
        if (!date || !name || calories === undefined || proteinG === undefined) {
          throw new Error('date, name, calories, and protein_g are required');
        }
        const data = await createFoodLogEntry({
          userId: getUserId(extra),
          date,
          name,
          calories,
          proteinG,
          carbsG: optionalNullableNumber(args, 'carbs_g'),
          fatG: optionalNullableNumber(args, 'fat_g'),
          quantity: optionalNumber(args, 'quantity') ?? 1,
          pantryFoodId: optionalNumber(args, 'pantry_food_id') ?? null,
        });
        return jsonContent(data);
      }
    );

    registerTool(
      'create_pantry_food',
      {
        title: 'Create Nommer pantry food',
        description: 'Create a per-serving pantry food for the authenticated Temple user.',
        inputSchema: {
          name: z.string().min(1).max(120),
          serving_description: z.string().min(1).max(80),
          calories: z.number().int().min(0).max(10000),
          protein_g: z.number().min(0).max(1000),
          carbs_g: z.number().min(0).max(1000).optional(),
          fat_g: z.number().min(0).max(1000).optional(),
        },
      },
      async (args, extra) => {
        requireWriteScope(extra);
        const name = optionalString(args, 'name');
        const servingDescription = optionalString(args, 'serving_description');
        const calories = optionalNumber(args, 'calories');
        const proteinG = optionalNumber(args, 'protein_g');
        if (!name || !servingDescription || calories === undefined || proteinG === undefined) {
          throw new Error('name, serving_description, calories, and protein_g are required');
        }
        const data = await createPantryFood({
          userId: getUserId(extra),
          name,
          servingDescription,
          calories,
          proteinG,
          carbsG: optionalNullableNumber(args, 'carbs_g'),
          fatG: optionalNullableNumber(args, 'fat_g'),
        });
        return jsonContent(data);
      }
    );

    registerTool(
      'log_bodyweight',
      {
        title: 'Log Nommer bodyweight',
        description: 'Create or update the authenticated Temple user’s bodyweight entry for a day.',
        inputSchema: {
          date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          weight_lbs: z.number().min(20).max(1000),
        },
      },
      async (args, extra) => {
        requireWriteScope(extra);
        const date = optionalString(args, 'date');
        const weightLbs = optionalNumber(args, 'weight_lbs');
        if (!date || weightLbs === undefined) throw new Error('date and weight_lbs are required');
        const data = await upsertBodyweightEntry({
          userId: getUserId(extra),
          date,
          weightLbs,
        });
        return jsonContent(data);
      }
    );

    registerTool(
      'list_combos',
      {
        title: 'List Nommer combos',
        description: 'List saved nutrition combos that expand into pantry food log entries.',
        inputSchema: {},
      },
      async (_args, extra) => {
        const data = await listCombos(getUserId(extra));
        return jsonContent(data);
      }
    );

    registerTool(
      'log_combo',
      {
        title: 'Log Nommer combo',
        description: 'Expand a saved combo into individual food log entries for the authenticated Temple user.',
        inputSchema: {
          date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          combo_id: z.number().int().positive(),
          overrides: z.array(z.object({
            pantry_food_id: z.number().int().positive(),
            quantity: z.number().min(0.01).max(100),
          })).optional(),
        },
      },
      async (args, extra) => {
        requireWriteScope(extra);
        const date = optionalString(args, 'date');
        const comboId = optionalNumber(args, 'combo_id');
        if (!date || comboId === undefined) throw new Error('date and combo_id are required');
        const rawOverrides = Array.isArray(args.overrides) ? args.overrides : [];
        const overrides = rawOverrides.map((override) => {
          const item = override as Record<string, unknown>;
          return {
            pantryFoodId: Number(item.pantry_food_id),
            quantity: Number(item.quantity),
          };
        });
        const data = await logCombo({
          userId: getUserId(extra),
          date,
          comboId,
          overrides,
        });
        return jsonContent(data);
      }
    );
  },
  {
    serverInfo: {
      name: 'gymmer-mcp',
      version: '0.1.0',
    },
  },
  {
    basePath: '/api',
    disableSse: true,
    maxDuration: 60,
  }
);

const authenticatedMcpHandler = withMcpAuth(
  mcpHandler,
  async (request, bearerToken) => {
    if (!bearerToken) return undefined;
    return verifyMcpAccessToken(bearerToken, `${getPublicOrigin(request)}/api/mcp`);
  },
  {
    required: true,
    requiredScopes: ['gymmer:read'],
    resourceMetadataPath: '/.well-known/oauth-protected-resource',
  }
);

export { authenticatedMcpHandler as GET, authenticatedMcpHandler as POST };
