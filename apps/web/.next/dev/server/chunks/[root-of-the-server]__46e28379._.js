module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/database.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "addExerciseToRoutine",
    ()=>addExerciseToRoutine,
    "addFavorite",
    ()=>addFavorite,
    "addStretchToRoutine",
    ()=>addStretchToRoutine,
    "cloneRoutine",
    ()=>cloneRoutine,
    "closeDatabase",
    ()=>closeDatabase,
    "createExercise",
    ()=>createExercise,
    "createRoutine",
    ()=>createRoutine,
    "createStretch",
    ()=>createStretch,
    "createWorkoutSession",
    ()=>createWorkoutSession,
    "deleteRoutine",
    ()=>deleteRoutine,
    "getAllExercises",
    ()=>getAllExercises,
    "getAllRoutines",
    ()=>getAllRoutines,
    "getAllStretches",
    ()=>getAllStretches,
    "getDatabase",
    ()=>getDatabase,
    "getExerciseById",
    ()=>getExerciseById,
    "getExerciseHistory",
    ()=>getExerciseHistory,
    "getFavoritedRoutines",
    ()=>getFavoritedRoutines,
    "getLastExerciseLog",
    ()=>getLastExerciseLog,
    "getPublicRoutines",
    ()=>getPublicRoutines,
    "getRecentExerciseLogs",
    ()=>getRecentExerciseLogs,
    "getRoutineById",
    ()=>getRoutineById,
    "getRoutineByName",
    ()=>getRoutineByName,
    "getRoutineExercises",
    ()=>getRoutineExercises,
    "getRoutineStretches",
    ()=>getRoutineStretches,
    "getStretchById",
    ()=>getStretchById,
    "getUserByEmail",
    ()=>getUserByEmail,
    "getUserById",
    ()=>getUserById,
    "getUserGoals",
    ()=>getUserGoals,
    "getUserSettings",
    ()=>getUserSettings,
    "getUserWithUsername",
    ()=>getUserWithUsername,
    "getUsernameExists",
    ()=>getUsernameExists,
    "getWorkoutSession",
    ()=>getWorkoutSession,
    "isFavorited",
    ()=>isFavorited,
    "logCardio",
    ()=>logCardio,
    "logExercise",
    ()=>logExercise,
    "removeExerciseFromRoutine",
    ()=>removeExerciseFromRoutine,
    "removeFavorite",
    ()=>removeFavorite,
    "removeStretchFromRoutine",
    ()=>removeStretchFromRoutine,
    "reorderRoutineExercises",
    ()=>reorderRoutineExercises,
    "reorderRoutineStretches",
    ()=>reorderRoutineStretches,
    "searchExercises",
    ()=>searchExercises,
    "setRoutinePublic",
    ()=>setRoutinePublic,
    "setUsername",
    ()=>setUsername,
    "updateRoutineName",
    ()=>updateRoutineName,
    "updateRoutineNotes",
    ()=>updateRoutineNotes,
    "upsertUser",
    ()=>upsertUser,
    "upsertUserGoals",
    ()=>upsertUserGoals,
    "upsertUserSettings",
    ()=>upsertUserSettings
]);
// lib/database.ts
var __TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$libsql$2f$client$29$__ = __turbopack_context__.i("[externals]/@libsql/client [external] (@libsql/client, esm_import, [project]/node_modules/@libsql/client)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$libsql$2f$client$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$libsql$2f$client$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
// Initialize database connection
let db = null;
let workoutSessionModeColumnReady = null;
const DEFAULT_REST_TIME_SECONDS = 60;
const DEFAULT_SUPERSET_REST_TIME_SECONDS = 15;
function getDatabase() {
    if (!db) {
        const url = process.env.TURSO_DATABASE_URL;
        const authToken = process.env.TURSO_AUTH_TOKEN;
        if (!url) {
            throw new Error('Missing TURSO_DATABASE_URL');
        }
        const isFile = url.startsWith('file:');
        if (!isFile && !authToken) {
            throw new Error('Missing TURSO_AUTH_TOKEN');
        }
        db = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$libsql$2f$client$29$__["createClient"])({
            url,
            ...isFile ? {} : {
                authToken
            }
        });
    }
    return db;
}
async function upsertUser(data) {
    const db = getDatabase();
    await db.execute({
        sql: `
      INSERT INTO users (id, email, name, image, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        email = excluded.email,
        name = excluded.name,
        image = excluded.image,
        updated_at = datetime('now')
    `,
        args: [
            data.id,
            data.email,
            data.name || null,
            data.image || null
        ]
    });
}
async function getUserById(id) {
    const db = getDatabase();
    const result = await db.execute({
        sql: 'SELECT * FROM users WHERE id = ?',
        args: [
            id
        ]
    });
    return result.rows[0] || null;
}
async function getUserByEmail(email) {
    const db = getDatabase();
    const result = await db.execute({
        sql: 'SELECT * FROM users WHERE email = ?',
        args: [
            email
        ]
    });
    return result.rows[0] || null;
}
async function hasWorkoutSessionModeColumn() {
    if (workoutSessionModeColumnReady !== null) return workoutSessionModeColumnReady;
    const db = getDatabase();
    try {
        const result = await db.execute({
            sql: 'PRAGMA table_info(workout_sessions)'
        });
        workoutSessionModeColumnReady = result.rows.some((row)=>row.name === 'session_mode');
    } catch (error) {
        console.warn('Failed to inspect workout_sessions schema:', error);
        workoutSessionModeColumnReady = false;
    }
    return workoutSessionModeColumnReady;
}
async function getUserGoals(userId) {
    const db = getDatabase();
    const result = await db.execute({
        sql: 'SELECT goals_text FROM users WHERE id = ?',
        args: [
            userId
        ]
    });
    const row = result.rows[0];
    return row?.goals_text ?? null;
}
async function upsertUserGoals(userId, goalsText) {
    const db = getDatabase();
    await db.execute({
        sql: `UPDATE users SET goals_text = ?, updated_at = datetime('now') WHERE id = ?`,
        args: [
            goalsText,
            userId
        ]
    });
}
async function ensureUserSettingsTable() {
    const db = getDatabase();
    await db.execute({
        sql: `
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id TEXT PRIMARY KEY,
        rest_time_seconds INTEGER DEFAULT 60,
        superset_rest_seconds INTEGER DEFAULT 15,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `
    });
}
async function getUserSettings(userId) {
    await ensureUserSettingsTable();
    const db = getDatabase();
    const result = await db.execute({
        sql: 'SELECT rest_time_seconds, superset_rest_seconds FROM user_settings WHERE user_id = ?',
        args: [
            userId
        ]
    });
    const row = result.rows[0];
    const restTimeSeconds = Number(row?.rest_time_seconds);
    const supersetRestSeconds = Number(row?.superset_rest_seconds);
    return {
        restTimeSeconds: Number.isFinite(restTimeSeconds) ? restTimeSeconds : DEFAULT_REST_TIME_SECONDS,
        supersetRestSeconds: Number.isFinite(supersetRestSeconds) ? supersetRestSeconds : DEFAULT_SUPERSET_REST_TIME_SECONDS
    };
}
async function upsertUserSettings(userId, data) {
    await ensureUserSettingsTable();
    const db = getDatabase();
    await db.execute({
        sql: `
      INSERT INTO user_settings (user_id, rest_time_seconds, superset_rest_seconds, updated_at)
      VALUES (?, ?, ?, datetime('now'))
      ON CONFLICT(user_id) DO UPDATE SET
        rest_time_seconds = excluded.rest_time_seconds,
        superset_rest_seconds = excluded.superset_rest_seconds,
        updated_at = datetime('now')
    `,
        args: [
            userId,
            data.restTimeSeconds,
            data.supersetRestSeconds
        ]
    });
}
async function createWorkoutSession(data) {
    const db = getDatabase();
    const result = await db.execute({
        sql: `
      INSERT INTO workout_sessions (user_id, workout_plan_name, date_completed, total_duration_minutes, total_strain, session_mode)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
        args: [
            data.user_id,
            data.workout_plan_name,
            data.date_completed,
            data.total_duration_minutes || null,
            data.total_strain || null,
            data.session_mode || null
        ]
    });
    return Number(result.lastInsertRowid);
}
async function logExercise(data) {
    const db = getDatabase();
    const result = await db.execute({
        sql: `
      INSERT INTO workout_exercise_logs (
        session_id, exercise_name, exercise_type,
        warmup_weight, warmup_reps,
        set1_weight, set1_reps,
        set2_weight, set2_reps,
        set3_weight, set3_reps,
        set4_weight, set4_reps,
        b2b_partner_name,
        b2b_warmup_weight, b2b_warmup_reps,
        b2b_set1_weight, b2b_set1_reps,
        b2b_set2_weight, b2b_set2_reps,
        b2b_set3_weight, b2b_set3_reps,
        b2b_set4_weight, b2b_set4_reps
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        args: [
            data.session_id,
            data.exercise_name,
            data.exercise_type,
            data.warmup_weight ?? null,
            data.warmup_reps ?? null,
            data.set1_weight ?? null,
            data.set1_reps ?? null,
            data.set2_weight ?? null,
            data.set2_reps ?? null,
            data.set3_weight ?? null,
            data.set3_reps ?? null,
            data.set4_weight ?? null,
            data.set4_reps ?? null,
            data.b2b_partner_name ?? null,
            data.b2b_warmup_weight ?? null,
            data.b2b_warmup_reps ?? null,
            data.b2b_set1_weight ?? null,
            data.b2b_set1_reps ?? null,
            data.b2b_set2_weight ?? null,
            data.b2b_set2_reps ?? null,
            data.b2b_set3_weight ?? null,
            data.b2b_set3_reps ?? null,
            data.b2b_set4_weight ?? null,
            data.b2b_set4_reps ?? null
        ]
    });
    return Number(result.lastInsertRowid);
}
async function logCardio(data) {
    const db = getDatabase();
    const result = await db.execute({
        sql: `
      INSERT INTO workout_cardio_logs (session_id, cardio_type, time, speed, incline)
      VALUES (?, ?, ?, ?, ?)
    `,
        args: [
            data.session_id,
            data.cardio_type,
            data.time,
            data.speed ?? null,
            data.incline ?? null
        ]
    });
    return Number(result.lastInsertRowid);
}
async function getWorkoutSession(sessionId) {
    const db = getDatabase();
    const sessionResult = await db.execute({
        sql: `SELECT * FROM workout_sessions WHERE id = ?`,
        args: [
            sessionId
        ]
    });
    if (sessionResult.rows.length === 0) return null;
    const session = sessionResult.rows[0];
    const exercisesResult = await db.execute({
        sql: `SELECT * FROM workout_exercise_logs WHERE session_id = ?`,
        args: [
            sessionId
        ]
    });
    const cardioResult = await db.execute({
        sql: `SELECT * FROM workout_cardio_logs WHERE session_id = ?`,
        args: [
            sessionId
        ]
    });
    const exercises = exercisesResult.rows;
    const cardio = cardioResult.rows;
    return {
        ...session,
        exercises,
        cardio
    };
}
async function getLastExerciseLog(exerciseName, userId) {
    const db = getDatabase();
    const sql = userId ? `
      SELECT el.*,
        ws.date_completed as completed_at,
        CASE
          WHEN el.exercise_name = ? THEN 'primary'
          WHEN el.b2b_partner_name = ? THEN 'partner'
        END AS matched_role
      FROM workout_exercise_logs el
      JOIN workout_sessions ws ON el.session_id = ws.id
      WHERE ws.user_id = ? AND (el.exercise_name = ? OR el.b2b_partner_name = ?)
      ORDER BY ws.date_completed DESC
      LIMIT 1
    ` : `
      SELECT el.*,
        ws.date_completed as completed_at,
        CASE
          WHEN el.exercise_name = ? THEN 'primary'
          WHEN el.b2b_partner_name = ? THEN 'partner'
        END AS matched_role
      FROM workout_exercise_logs el
      JOIN workout_sessions ws ON el.session_id = ws.id
      WHERE el.exercise_name = ? OR el.b2b_partner_name = ?
      ORDER BY ws.date_completed DESC
      LIMIT 1
    `;
    const args = userId ? [
        exerciseName,
        exerciseName,
        userId,
        exerciseName,
        exerciseName
    ] : [
        exerciseName,
        exerciseName,
        exerciseName,
        exerciseName
    ];
    const result = await db.execute({
        sql,
        args
    });
    const row = result.rows[0];
    if (!row) return null;
    if (row.matched_role === 'partner') {
        return {
            ...row,
            exercise_name: exerciseName,
            warmup_weight: row.b2b_warmup_weight,
            warmup_reps: row.b2b_warmup_reps,
            set1_weight: row.b2b_set1_weight,
            set1_reps: row.b2b_set1_reps,
            set2_weight: row.b2b_set2_weight,
            set2_reps: row.b2b_set2_reps,
            set3_weight: row.b2b_set3_weight,
            set3_reps: row.b2b_set3_reps,
            set4_weight: row.b2b_set4_weight,
            set4_reps: row.b2b_set4_reps
        };
    }
    return row;
}
async function getRecentExerciseLogs(exerciseName, userId, limit = 5, options) {
    const db = getDatabase();
    const excludeMode = options?.excludeSessionMode;
    const hasSessionMode = excludeMode ? await hasWorkoutSessionModeColumn() : false;
    const modeClause = excludeMode && hasSessionMode ? 'AND (ws.session_mode IS NULL OR ws.session_mode != ?)' : '';
    const result = await db.execute({
        sql: `
      SELECT el.*,
        ws.date_completed as completed_at,
        CASE
          WHEN el.exercise_name = ? THEN 'primary'
          WHEN el.b2b_partner_name = ? THEN 'partner'
        END AS matched_role
      FROM workout_exercise_logs el
      JOIN workout_sessions ws ON el.session_id = ws.id
      WHERE ws.user_id = ? AND (el.exercise_name = ? OR el.b2b_partner_name = ?)
      ${modeClause}
      ORDER BY ws.date_completed DESC
      LIMIT ?
    `,
        args: excludeMode && hasSessionMode ? [
            exerciseName,
            exerciseName,
            userId,
            exerciseName,
            exerciseName,
            excludeMode,
            limit
        ] : [
            exerciseName,
            exerciseName,
            userId,
            exerciseName,
            exerciseName,
            limit
        ]
    });
    return result.rows;
}
async function getExerciseHistory(userId, exerciseName, range) {
    const db = getDatabase();
    const daysBack = range === 'week' ? 7 : range === 'month' ? 30 : null;
    const cutoff = daysBack ? new Date(Date.now() - (daysBack - 1) * 86400000).toISOString() : null;
    const rangeClause = cutoff ? 'AND ws.date_completed >= ?' : '';
    const hasSessionMode = await hasWorkoutSessionModeColumn();
    const modeClause = hasSessionMode ? 'AND (ws.session_mode IS NULL OR ws.session_mode != ?)' : '';
    const sql = `
    WITH matched AS (
      SELECT
        ws.date_completed as date_completed,
        date(ws.date_completed) as day,
        CASE
          WHEN el.exercise_name = ? THEN el.set1_weight
          WHEN el.b2b_partner_name = ? THEN el.b2b_set1_weight
        END as set1_weight,
        CASE
          WHEN el.exercise_name = ? THEN el.set1_reps
          WHEN el.b2b_partner_name = ? THEN el.b2b_set1_reps
        END as set1_reps,
        CASE
          WHEN el.exercise_name = ? THEN el.set2_weight
          WHEN el.b2b_partner_name = ? THEN el.b2b_set2_weight
        END as set2_weight,
        CASE
          WHEN el.exercise_name = ? THEN el.set2_reps
          WHEN el.b2b_partner_name = ? THEN el.b2b_set2_reps
        END as set2_reps,
        CASE
          WHEN el.exercise_name = ? THEN el.set3_weight
          WHEN el.b2b_partner_name = ? THEN el.b2b_set3_weight
        END as set3_weight,
        CASE
          WHEN el.exercise_name = ? THEN el.set3_reps
          WHEN el.b2b_partner_name = ? THEN el.b2b_set3_reps
        END as set3_reps,
        CASE
          WHEN el.exercise_name = ? THEN el.set4_weight
          WHEN el.b2b_partner_name = ? THEN el.b2b_set4_weight
        END as set4_weight,
        CASE
          WHEN el.exercise_name = ? THEN el.set4_reps
          WHEN el.b2b_partner_name = ? THEN el.b2b_set4_reps
        END as set4_reps
      FROM workout_exercise_logs el
      JOIN workout_sessions ws ON el.session_id = ws.id
      WHERE ws.user_id = ? AND (el.exercise_name = ? OR el.b2b_partner_name = ?)
      ${modeClause}
      ${rangeClause}
    ),
    scored AS (
      SELECT
        *,
        CASE WHEN set1_weight IS NOT NULL AND set1_reps IS NOT NULL THEN 1 ELSE 0 END as s1,
        CASE WHEN set2_weight IS NOT NULL AND set2_reps IS NOT NULL THEN 1 ELSE 0 END as s2,
        CASE WHEN set3_weight IS NOT NULL AND set3_reps IS NOT NULL THEN 1 ELSE 0 END as s3,
        CASE WHEN set4_weight IS NOT NULL AND set4_reps IS NOT NULL THEN 1 ELSE 0 END as s4
      FROM matched
    ),
    metrics AS (
      SELECT
        day,
        date_completed,
        (s1 + s2 + s3 + s4) as set_count,
        max(
          CASE WHEN s1 = 1 THEN set1_weight ELSE -1 END,
          CASE WHEN s2 = 1 THEN set2_weight ELSE -1 END,
          CASE WHEN s3 = 1 THEN set3_weight ELSE -1 END,
          CASE WHEN s4 = 1 THEN set4_weight ELSE -1 END
        ) as raw_max,
        (CASE WHEN s1 = 1 THEN set1_weight ELSE 0 END
          + CASE WHEN s2 = 1 THEN set2_weight ELSE 0 END
          + CASE WHEN s3 = 1 THEN set3_weight ELSE 0 END
          + CASE WHEN s4 = 1 THEN set4_weight ELSE 0 END) as weight_sum,
        max(
          CASE WHEN s1 = 1 THEN set1_reps ELSE -1 END,
          CASE WHEN s2 = 1 THEN set2_reps ELSE -1 END,
          CASE WHEN s3 = 1 THEN set3_reps ELSE -1 END,
          CASE WHEN s4 = 1 THEN set4_reps ELSE -1 END
        ) as reps_max_raw,
        (CASE WHEN s1 = 1 THEN set1_reps ELSE 0 END
          + CASE WHEN s2 = 1 THEN set2_reps ELSE 0 END
          + CASE WHEN s3 = 1 THEN set3_reps ELSE 0 END
          + CASE WHEN s4 = 1 THEN set4_reps ELSE 0 END) as reps_sum,
        (CASE WHEN s1 = 1 THEN set1_weight * set1_reps ELSE 0 END
          + CASE WHEN s2 = 1 THEN set2_weight * set2_reps ELSE 0 END
          + CASE WHEN s3 = 1 THEN set3_weight * set3_reps ELSE 0 END
          + CASE WHEN s4 = 1 THEN set4_weight * set4_reps ELSE 0 END) as volume
      FROM scored
    ),
    ranked AS (
      SELECT
        day,
        date_completed,
        CASE WHEN set_count > 0 THEN NULLIF(raw_max, -1) ELSE NULL END as weight_max,
        CASE WHEN set_count > 0 THEN weight_sum / set_count ELSE NULL END as weight_avg,
        CASE WHEN set_count > 0 THEN NULLIF(reps_max_raw, -1) ELSE NULL END as reps_max,
        CASE WHEN set_count > 0 THEN reps_sum / set_count ELSE NULL END as reps_avg,
        CASE WHEN set_count > 0 THEN reps_sum ELSE NULL END as reps_total,
        CASE WHEN set_count > 0 THEN volume ELSE NULL END as volume,
        ROW_NUMBER() OVER (PARTITION BY day ORDER BY date_completed DESC) as rn
      FROM metrics
    )
    SELECT day, weight_max, weight_avg, volume, reps_max, reps_avg, reps_total
    FROM ranked
    WHERE rn = 1
    ORDER BY day ASC
  `;
    const args = [
        exerciseName,
        exerciseName,
        exerciseName,
        exerciseName,
        exerciseName,
        exerciseName,
        exerciseName,
        exerciseName,
        exerciseName,
        exerciseName,
        exerciseName,
        exerciseName,
        exerciseName,
        exerciseName,
        exerciseName,
        exerciseName,
        userId,
        exerciseName,
        exerciseName
    ];
    if (hasSessionMode) {
        args.push('light');
    }
    if (cutoff) {
        args.push(cutoff);
    }
    const result = await db.execute({
        sql,
        args
    });
    const points = result.rows.map((row)=>({
            day: String(row.day),
            weight_max: row.weight_max ?? null,
            weight_avg: row.weight_avg ?? null,
            volume: row.volume ?? null,
            reps_max: row.reps_max ?? null,
            reps_avg: row.reps_avg ?? null,
            reps_total: row.reps_total ?? null
        }));
    const equipmentResult = await db.execute({
        sql: 'SELECT equipment FROM exercises WHERE name = ? LIMIT 1',
        args: [
            exerciseName
        ]
    });
    const equipment = equipmentResult.rows[0]?.equipment || '';
    const displayMode = equipment.toLowerCase() === 'bodyweight' ? 'reps' : undefined;
    return {
        display_mode: displayMode,
        points
    };
}
async function createExercise(data) {
    const db = getDatabase();
    const result = await db.execute({
        sql: `
      INSERT INTO exercises (name, video_url, tips, muscle_groups, equipment, difficulty)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
        args: [
            data.name,
            data.videoUrl || null,
            data.tips || null,
            data.muscleGroups ? JSON.stringify(data.muscleGroups) : null,
            data.equipment || null,
            data.difficulty || null
        ]
    });
    return Number(result.lastInsertRowid);
}
async function getAllExercises() {
    const db = getDatabase();
    const result = await db.execute('SELECT * FROM exercises ORDER BY name');
    return result.rows;
}
async function searchExercises(query) {
    const db = getDatabase();
    const result = await db.execute({
        sql: 'SELECT * FROM exercises WHERE name LIKE ? ORDER BY name',
        args: [
            `%${query}%`
        ]
    });
    return result.rows;
}
async function getExerciseById(id) {
    const db = getDatabase();
    const result = await db.execute({
        sql: 'SELECT * FROM exercises WHERE id = ?',
        args: [
            id
        ]
    });
    return result.rows[0] || null;
}
async function createRoutine(name, userId, isPublic = true) {
    const db = getDatabase();
    const result = await db.execute({
        sql: 'INSERT INTO routines (name, user_id, is_public) VALUES (?, ?, ?)',
        args: [
            name,
            userId,
            isPublic ? 1 : 0
        ]
    });
    return Number(result.lastInsertRowid);
}
async function getAllRoutines(userId) {
    const db = getDatabase();
    const result = await db.execute({
        sql: `
      SELECT r.*, MAX(ws.date_completed) as last_workout_date
      FROM routines r
      LEFT JOIN workout_sessions ws
        ON ws.workout_plan_name = r.name AND ws.user_id = ?
      WHERE r.user_id = ?
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `,
        args: [
            userId,
            userId
        ]
    });
    return result.rows;
}
async function getRoutineById(id, userId) {
    const db = getDatabase();
    // If userId provided, verify ownership
    const sql = userId ? 'SELECT * FROM routines WHERE id = ? AND user_id = ?' : 'SELECT * FROM routines WHERE id = ?';
    const args = userId ? [
        id,
        userId
    ] : [
        id
    ];
    const result = await db.execute({
        sql,
        args
    });
    return result.rows[0] || null;
}
async function getRoutineByName(name, userId) {
    const db = getDatabase();
    const result = await db.execute({
        sql: 'SELECT * FROM routines WHERE name = ? AND user_id = ?',
        args: [
            name,
            userId
        ]
    });
    return result.rows[0] || null;
}
async function deleteRoutine(id, userId) {
    const db = getDatabase();
    // Only delete if the routine belongs to the user
    await db.execute({
        sql: 'DELETE FROM routines WHERE id = ? AND user_id = ?',
        args: [
            id,
            userId
        ]
    });
}
async function updateRoutineName(id, newName, userId) {
    const db = getDatabase();
    // Get the old name first (verify ownership)
    const oldRoutine = await db.execute({
        sql: 'SELECT name FROM routines WHERE id = ? AND user_id = ?',
        args: [
            id,
            userId
        ]
    });
    if (oldRoutine.rows.length === 0) {
        throw new Error('Routine not found or you do not have permission');
    }
    const oldName = oldRoutine.rows[0].name;
    // Update the routine name
    await db.execute({
        sql: 'UPDATE routines SET name = ?, updated_at = datetime(\'now\') WHERE id = ? AND user_id = ?',
        args: [
            newName,
            id,
            userId
        ]
    });
    // Update workout history to use the new name (only for this user)
    await db.execute({
        sql: 'UPDATE workout_sessions SET workout_plan_name = ? WHERE workout_plan_name = ? AND user_id = ?',
        args: [
            newName,
            oldName,
            userId
        ]
    });
}
async function updateRoutineNotes(id, notes, userId) {
    const db = getDatabase();
    await db.execute({
        sql: 'UPDATE routines SET notes = ?, updated_at = datetime(\'now\') WHERE id = ? AND user_id = ?',
        args: [
            notes,
            id,
            userId
        ]
    });
}
async function addExerciseToRoutine(data) {
    const db = getDatabase();
    const result = await db.execute({
        sql: `
      INSERT INTO routine_exercises (
        routine_id, exercise_id, order_index, exercise_type,
        sets, target_reps, target_weight, warmup_weight, rest_time,
        b2b_partner_id, b2b_sets, b2b_target_reps, b2b_target_weight, b2b_warmup_weight
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        args: [
            data.routineId,
            data.exerciseId,
            data.orderIndex,
            data.exerciseType,
            data.sets ?? null,
            data.targetReps ?? null,
            data.targetWeight ?? null,
            data.warmupWeight ?? null,
            data.restTime ?? null,
            data.b2bPartnerId ?? null,
            data.b2bSets ?? null,
            data.b2bTargetReps ?? null,
            data.b2bTargetWeight ?? null,
            data.b2bWarmupWeight ?? null
        ]
    });
    return Number(result.lastInsertRowid);
}
async function getRoutineExercises(routineId) {
    const db = getDatabase();
    const result = await db.execute({
        sql: `
      SELECT re.*, e.name as exercise_name, e.video_url, e.tips,
             e.equipment as exercise_equipment,
             e2.name as b2b_partner_name, e2.video_url as b2b_video_url, e2.tips as b2b_tips,
             e2.equipment as b2b_partner_equipment
      FROM routine_exercises re
      JOIN exercises e ON re.exercise_id = e.id
      LEFT JOIN exercises e2 ON re.b2b_partner_id = e2.id
      WHERE re.routine_id = ?
      ORDER BY re.order_index
    `,
        args: [
            routineId
        ]
    });
    return result.rows;
}
async function removeExerciseFromRoutine(routineExerciseId) {
    const db = getDatabase();
    await db.execute({
        sql: 'DELETE FROM routine_exercises WHERE id = ?',
        args: [
            routineExerciseId
        ]
    });
}
async function createStretch(data) {
    const db = getDatabase();
    const result = await db.execute({
        sql: `
      INSERT INTO stretches (name, duration, type, video_url, tips, muscle_groups)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
        args: [
            data.name,
            data.duration,
            data.type,
            data.videoUrl || null,
            data.tips || null,
            data.muscleGroups ? JSON.stringify(data.muscleGroups) : null
        ]
    });
    return Number(result.lastInsertRowid);
}
async function getAllStretches(type) {
    const db = getDatabase();
    if (type) {
        const result = await db.execute({
            sql: 'SELECT * FROM stretches WHERE type = ? ORDER BY name',
            args: [
                type
            ]
        });
        return result.rows;
    } else {
        const result = await db.execute('SELECT * FROM stretches ORDER BY name');
        return result.rows;
    }
}
async function getStretchById(id) {
    const db = getDatabase();
    const result = await db.execute({
        sql: 'SELECT * FROM stretches WHERE id = ?',
        args: [
            id
        ]
    });
    return result.rows[0] || null;
}
async function addStretchToRoutine(routineId, stretchId, type, orderIndex) {
    const db = getDatabase();
    const tableName = type === 'pre' ? 'routine_pre_stretches' : 'routine_post_stretches';
    const result = await db.execute({
        sql: `INSERT INTO ${tableName} (routine_id, stretch_id, order_index) VALUES (?, ?, ?)`,
        args: [
            routineId,
            stretchId,
            orderIndex
        ]
    });
    return Number(result.lastInsertRowid);
}
async function removeStretchFromRoutine(routineId, stretchId, type) {
    const db = getDatabase();
    const tableName = type === 'pre' ? 'routine_pre_stretches' : 'routine_post_stretches';
    await db.execute({
        sql: `DELETE FROM ${tableName} WHERE routine_id = ? AND stretch_id = ?`,
        args: [
            routineId,
            stretchId
        ]
    });
}
async function getRoutineStretches(routineId, type) {
    const db = getDatabase();
    const tableName = type === 'pre' ? 'routine_pre_stretches' : 'routine_post_stretches';
    const result = await db.execute({
        sql: `
      SELECT rs.*, s.name, s.duration, s.video_url, s.tips, s.muscle_groups
      FROM ${tableName} rs
      JOIN stretches s ON rs.stretch_id = s.id
      WHERE rs.routine_id = ?
      ORDER BY rs.order_index
    `,
        args: [
            routineId
        ]
    });
    return result.rows;
}
async function reorderRoutineExercises(routineId, exerciseOrder// Array of routine_exercise IDs in new order
) {
    const db = getDatabase();
    for(let i = 0; i < exerciseOrder.length; i++){
        await db.execute({
            sql: 'UPDATE routine_exercises SET order_index = ? WHERE id = ? AND routine_id = ?',
            args: [
                i,
                exerciseOrder[i],
                routineId
            ]
        });
    }
}
async function reorderRoutineStretches(routineId, type, stretchOrder// Array of stretch IDs in new order
) {
    const db = getDatabase();
    const tableName = type === 'pre' ? 'routine_pre_stretches' : 'routine_post_stretches';
    // Delete existing and re-insert in new order
    await db.execute({
        sql: `DELETE FROM ${tableName} WHERE routine_id = ?`,
        args: [
            routineId
        ]
    });
    for(let i = 0; i < stretchOrder.length; i++){
        await db.execute({
            sql: `INSERT INTO ${tableName} (routine_id, stretch_id, order_index) VALUES (?, ?, ?)`,
            args: [
                routineId,
                stretchOrder[i],
                i
            ]
        });
    }
}
async function closeDatabase() {
    if (db) {
        await db.close();
        db = null;
    }
}
async function setUsername(userId, username) {
    const db = getDatabase();
    await db.execute({
        sql: `UPDATE users SET username = ?, updated_at = datetime('now') WHERE id = ?`,
        args: [
            username,
            userId
        ]
    });
}
async function getUsernameExists(username) {
    const db = getDatabase();
    const result = await db.execute({
        sql: 'SELECT 1 FROM users WHERE username = ?',
        args: [
            username
        ]
    });
    return result.rows.length > 0;
}
async function getUserWithUsername(userId) {
    const db = getDatabase();
    const result = await db.execute({
        sql: 'SELECT id, email, username, name, image FROM users WHERE id = ?',
        args: [
            userId
        ]
    });
    return result.rows[0] || null;
}
async function getPublicRoutines(excludeUserId) {
    const db = getDatabase();
    const sql = excludeUserId ? `SELECT r.*, u.username as creator_username, u.name as creator_name,
         MAX(ws.date_completed) as last_workout_date
       FROM routines r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN workout_sessions ws
         ON ws.workout_plan_name = r.name AND ws.user_id = ?
       WHERE r.is_public = 1 AND r.user_id != ?
       GROUP BY r.id
       ORDER BY r.created_at DESC` : `SELECT r.*, u.username as creator_username, u.name as creator_name,
         NULL as last_workout_date
       FROM routines r
       JOIN users u ON r.user_id = u.id
       WHERE r.is_public = 1
       ORDER BY r.created_at DESC`;
    const args = excludeUserId ? [
        excludeUserId,
        excludeUserId
    ] : [];
    const result = await db.execute({
        sql,
        args
    });
    return result.rows;
}
async function addFavorite(userId, routineId) {
    const db = getDatabase();
    await db.execute({
        sql: `INSERT OR IGNORE INTO routine_favorites (user_id, routine_id) VALUES (?, ?)`,
        args: [
            userId,
            routineId
        ]
    });
}
async function removeFavorite(userId, routineId) {
    const db = getDatabase();
    await db.execute({
        sql: `DELETE FROM routine_favorites WHERE user_id = ? AND routine_id = ?`,
        args: [
            userId,
            routineId
        ]
    });
}
async function isFavorited(userId, routineId) {
    const db = getDatabase();
    const result = await db.execute({
        sql: 'SELECT 1 FROM routine_favorites WHERE user_id = ? AND routine_id = ?',
        args: [
            userId,
            routineId
        ]
    });
    return result.rows.length > 0;
}
async function getFavoritedRoutines(userId) {
    const db = getDatabase();
    const result = await db.execute({
        sql: `SELECT r.*, u.username as creator_username, u.name as creator_name, 1 as is_favorited,
            MAX(ws.date_completed) as last_workout_date
          FROM routine_favorites rf
          JOIN routines r ON rf.routine_id = r.id
          JOIN users u ON r.user_id = u.id
          LEFT JOIN workout_sessions ws
            ON ws.workout_plan_name = r.name AND ws.user_id = ?
          WHERE rf.user_id = ?
          GROUP BY r.id
          ORDER BY rf.created_at DESC`,
        args: [
            userId,
            userId
        ]
    });
    return result.rows;
}
async function cloneRoutine(routineId, newUserId, newName) {
    const db = getDatabase();
    // Get the original routine
    const original = await db.execute({
        sql: 'SELECT * FROM routines WHERE id = ?',
        args: [
            routineId
        ]
    });
    if (original.rows.length === 0) {
        throw new Error('Routine not found');
    }
    const routine = original.rows[0];
    let baseName = newName || routine.name;
    // Find a unique name for this user
    let clonedName = baseName;
    let suffix = 1;
    while(true){
        const existing = await db.execute({
            sql: 'SELECT id FROM routines WHERE name = ? AND user_id = ?',
            args: [
                clonedName,
                newUserId
            ]
        });
        if (existing.rows.length === 0) break;
        suffix++;
        clonedName = `${baseName} (${suffix})`;
    }
    // Create the new routine
    const newRoutineResult = await db.execute({
        sql: `INSERT INTO routines (user_id, name, description, is_public, created_at, updated_at)
          VALUES (?, ?, ?, 0, datetime('now'), datetime('now'))`,
        args: [
            newUserId,
            clonedName,
            routine.description
        ]
    });
    const newRoutineId = Number(newRoutineResult.lastInsertRowid);
    // Clone exercises
    const exercises = await db.execute({
        sql: 'SELECT * FROM routine_exercises WHERE routine_id = ?',
        args: [
            routineId
        ]
    });
    for (const ex of exercises.rows){
        const e = ex;
        await db.execute({
            sql: `INSERT INTO routine_exercises (
        routine_id, exercise_id, order_index, exercise_type,
        sets, target_reps, target_weight, warmup_weight, rest_time,
        b2b_partner_id, b2b_sets, b2b_target_reps, b2b_target_weight, b2b_warmup_weight
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                newRoutineId,
                e.exercise_id,
                e.order_index,
                e.exercise_type,
                e.sets,
                e.target_reps,
                e.target_weight,
                e.warmup_weight,
                e.rest_time,
                e.b2b_partner_id,
                e.b2b_sets,
                e.b2b_target_reps,
                e.b2b_target_weight,
                e.b2b_warmup_weight
            ]
        });
    }
    // Clone pre-workout stretches
    const preStretches = await db.execute({
        sql: 'SELECT * FROM routine_pre_stretches WHERE routine_id = ?',
        args: [
            routineId
        ]
    });
    for (const s of preStretches.rows){
        const stretch = s;
        await db.execute({
            sql: 'INSERT INTO routine_pre_stretches (routine_id, stretch_id, order_index) VALUES (?, ?, ?)',
            args: [
                newRoutineId,
                stretch.stretch_id,
                stretch.order_index
            ]
        });
    }
    // Clone post-workout stretches
    const postStretches = await db.execute({
        sql: 'SELECT * FROM routine_post_stretches WHERE routine_id = ?',
        args: [
            routineId
        ]
    });
    for (const s of postStretches.rows){
        const stretch = s;
        await db.execute({
            sql: 'INSERT INTO routine_post_stretches (routine_id, stretch_id, order_index) VALUES (?, ?, ?)',
            args: [
                newRoutineId,
                stretch.stretch_id,
                stretch.order_index
            ]
        });
    }
    // Clone cardio
    const cardio = await db.execute({
        sql: 'SELECT * FROM routine_cardio WHERE routine_id = ?',
        args: [
            routineId
        ]
    });
    if (cardio.rows.length > 0) {
        const c = cardio.rows[0];
        await db.execute({
            sql: `INSERT INTO routine_cardio (routine_id, cardio_type, duration, intensity, tips)
            VALUES (?, ?, ?, ?, ?)`,
            args: [
                newRoutineId,
                c.cardio_type,
                c.duration,
                c.intensity,
                c.tips
            ]
        });
    }
    return newRoutineId;
}
async function setRoutinePublic(routineId, userId, isPublic) {
    const db = getDatabase();
    await db.execute({
        sql: `UPDATE routines SET is_public = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?`,
        args: [
            isPublic ? 1 : 0,
            routineId,
            userId
        ]
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "handlers",
    ()=>handlers,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/providers/google.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth/core/providers/google.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/database.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const { handlers, signIn, signOut, auth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])({
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    pages: {
        signIn: "/login",
        error: "/login"
    },
    callbacks: {
        async signIn ({ user }) {
            // Check if user's email is in the whitelist
            const allowedEmails = process.env.ALLOWED_EMAILS?.split(",").map((e)=>e.trim()) || [];
            if (!user.email) {
                return false;
            }
            if (!allowedEmails.includes(user.email)) {
                // Return URL with error for unauthorized users
                return "/login?error=AccessDenied";
            }
            // Create or update user record in our database
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upsertUser"])({
                    id: user.email,
                    email: user.email,
                    name: user.name || null,
                    image: user.image || null
                });
            } catch (error) {
                console.error("Error upserting user:", error);
            // Don't block sign-in if DB fails
            }
            return true;
        },
        async jwt ({ token, user }) {
            // Add user ID (email) to token on first sign in
            if (user?.email) {
                token.userId = user.email;
            }
            return token;
        },
        async session ({ session, token }) {
            // Add user ID to session for use in API routes
            if (token.userId) {
                session.user.id = token.userId;
            }
            return session;
        }
    }
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/auth-utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getCurrentUser",
    ()=>getCurrentUser,
    "requireAuth",
    ()=>requireAuth
]);
// lib/auth-utils.ts
// Helper utilities for authentication in API routes
var __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function getCurrentUser() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
    if (!session?.user?.email) {
        return null;
    }
    return {
        id: session.user.email,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image
    };
}
async function requireAuth() {
    if (process.env.E2E_TEST === "1") {
        return {
            user: {
                id: "e2e@test.local",
                email: "e2e@test.local",
                name: "E2E User"
            }
        };
    }
    const user = await getCurrentUser();
    if (!user) {
        return {
            error: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            })
        };
    }
    return {
        user
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/routines/import/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
// app/api/routines/import/route.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/database.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-utils.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function POST(request) {
    const authResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAuth"])();
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;
    try {
        const body = await request.json();
        const { workoutPlan, fileName } = body;
        if (!workoutPlan || !workoutPlan.name || !workoutPlan.exercises) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid workout plan format'
            }, {
                status: 400
            });
        }
        const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
        const goalsText = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserGoals"])(user.id);
        // Check if routine already exists for this user
        const existing = await db.execute({
            sql: 'SELECT id FROM routines WHERE name = ? AND user_id = ?',
            args: [
                workoutPlan.name,
                user.id
            ]
        });
        if (existing.rows.length > 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `A routine named "${workoutPlan.name}" already exists`
            }, {
                status: 409
            });
        }
        // Create routine for this user
        const routineResult = await db.execute({
            sql: `INSERT INTO routines (name, user_id, description)
            VALUES (?, ?, ?)`,
            args: [
                workoutPlan.name,
                user.id,
                workoutPlan.description || null
            ]
        });
        const routineId = Number(routineResult.lastInsertRowid);
        const exerciseIndex = await buildNameIndex(db, 'exercises');
        const stretchIndex = await buildNameIndex(db, 'stretches');
        // Import exercises
        for(let i = 0; i < workoutPlan.exercises.length; i++){
            const exercise = workoutPlan.exercises[i];
            if (exercise.type === 'single' && exercise.name) {
                const exerciseId = await getOrCreateExercise(db, exerciseIndex, exercise.name, goalsText);
                await db.execute({
                    sql: `INSERT INTO routine_exercises (
            routine_id, exercise_id, order_index, exercise_type,
            sets, target_reps, target_weight, warmup_weight, rest_time
          ) VALUES (?, ?, ?, 'single', ?, ?, ?, ?, ?)`,
                    args: [
                        routineId,
                        exerciseId,
                        i,
                        exercise.sets || null,
                        exercise.targetReps || null,
                        exercise.targetWeight || null,
                        exercise.warmupWeight || null,
                        exercise.restTime || null
                    ]
                });
            } else if (exercise.type === 'b2b' && exercise.exercises && exercise.exercises.length >= 2) {
                const ex1 = exercise.exercises[0];
                const ex2 = exercise.exercises[1];
                const exerciseId1 = await getOrCreateExercise(db, exerciseIndex, ex1.name, goalsText);
                const exerciseId2 = await getOrCreateExercise(db, exerciseIndex, ex2.name, goalsText);
                await db.execute({
                    sql: `INSERT INTO routine_exercises (
            routine_id, exercise_id, order_index, exercise_type,
            sets, target_reps, target_weight, warmup_weight,
            b2b_partner_id, b2b_sets, b2b_target_reps, b2b_target_weight, b2b_warmup_weight
          ) VALUES (?, ?, ?, 'b2b', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        routineId,
                        exerciseId1,
                        i,
                        ex1.sets || null,
                        ex1.targetReps || null,
                        ex1.targetWeight || null,
                        ex1.warmupWeight || null,
                        exerciseId2,
                        ex2.sets || null,
                        ex2.targetReps || null,
                        ex2.targetWeight || null,
                        ex2.warmupWeight || null
                    ]
                });
            }
        }
        // Import stretches
        if (workoutPlan.preWorkoutStretches) {
            for(let i = 0; i < workoutPlan.preWorkoutStretches.length; i++){
                const stretch = workoutPlan.preWorkoutStretches[i];
                const stretchId = await getOrCreateStretch(db, stretchIndex, stretch, 'pre_workout', goalsText);
                await db.execute({
                    sql: 'INSERT INTO routine_pre_stretches (routine_id, stretch_id, order_index) VALUES (?, ?, ?)',
                    args: [
                        routineId,
                        stretchId,
                        i
                    ]
                });
            }
        }
        if (workoutPlan.postWorkoutStretches) {
            for(let i = 0; i < workoutPlan.postWorkoutStretches.length; i++){
                const stretch = workoutPlan.postWorkoutStretches[i];
                const stretchId = await getOrCreateStretch(db, stretchIndex, stretch, 'post_workout', goalsText);
                await db.execute({
                    sql: 'INSERT INTO routine_post_stretches (routine_id, stretch_id, order_index) VALUES (?, ?, ?)',
                    args: [
                        routineId,
                        stretchId,
                        i
                    ]
                });
            }
        }
        // Import cardio
        if (workoutPlan.cardio) {
            await db.execute({
                sql: `INSERT INTO routine_cardio (routine_id, cardio_type, duration, intensity, tips)
              VALUES (?, ?, ?, ?, ?)`,
                args: [
                    routineId,
                    workoutPlan.cardio.type,
                    workoutPlan.cardio.duration,
                    workoutPlan.cardio.intensity || null,
                    workoutPlan.cardio.tips || null
                ]
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            id: routineId,
            name: workoutPlan.name,
            success: true
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Error importing routine:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Failed to import routine'
        }, {
            status: 500
        });
    }
}
async function buildNameIndex(db, table) {
    const rows = await db.execute({
        sql: `SELECT id, name FROM ${table}`
    });
    const exactLower = new Map();
    const normalized = new Map();
    const idToName = new Map();
    for (const row of rows.rows){
        const lower = row.name.toLowerCase();
        exactLower.set(lower, row.id);
        const normalizedName = normalizeName(row.name);
        if (!normalized.has(normalizedName)) {
            normalized.set(normalizedName, row.id);
        }
        idToName.set(row.id, row.name);
    }
    return {
        exactLower,
        normalized,
        idToName
    };
}
function normalizeName(value) {
    return value.toLowerCase().replace(/[_-]+/g, ' ').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}
async function getOrCreateExercise(db, index, name, goalsText) {
    const lowerName = name.toLowerCase();
    const normalizedName = normalizeName(name);
    const exactMatch = index.exactLower.get(lowerName);
    if (exactMatch) return exactMatch;
    const normalizedMatch = index.normalized.get(normalizedName);
    if (normalizedMatch) return normalizedMatch;
    const fuzzyMatch = await resolveFuzzyMatch(name, index, goalsText);
    if (fuzzyMatch) return fuzzyMatch;
    const result = await db.execute({
        sql: 'INSERT INTO exercises (name) VALUES (?)',
        args: [
            name
        ]
    });
    const newId = Number(result.lastInsertRowid);
    index.exactLower.set(lowerName, newId);
    index.normalized.set(normalizedName, newId);
    index.idToName.set(newId, name);
    return newId;
}
async function getOrCreateStretch(db, index, stretch, type, goalsText) {
    const lowerName = String(stretch.name || '').toLowerCase();
    const normalizedName = normalizeName(String(stretch.name || ''));
    const exactMatch = index.exactLower.get(lowerName);
    if (exactMatch) return exactMatch;
    const normalizedMatch = index.normalized.get(normalizedName);
    if (normalizedMatch) return normalizedMatch;
    const fuzzyMatch = await resolveFuzzyMatch(String(stretch.name || ''), index, goalsText);
    if (fuzzyMatch) return fuzzyMatch;
    const result = await db.execute({
        sql: `INSERT INTO stretches (name, duration, type, video_url, tips)
          VALUES (?, ?, ?, ?, ?)`,
        args: [
            stretch.name,
            stretch.duration,
            type,
            stretch.videoUrl || null,
            stretch.tips || null
        ]
    });
    const newId = Number(result.lastInsertRowid);
    index.exactLower.set(lowerName, newId);
    index.normalized.set(normalizedName, newId);
    index.idToName.set(newId, stretch.name);
    return newId;
}
async function resolveFuzzyMatch(name, index, goalsText) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;
    const options = Array.from(index.idToName.entries()).map(([id, label])=>({
            id,
            label
        }));
    if (options.length === 0) return null;
    const payload = {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: [
                    'You are a gym trainer helping users make consistent, incremental progress.',
                    'You match exercise/stretch names to existing options.',
                    'Return ONLY a JSON object: {"matchId": number|null}.',
                    'Return null if there is no close match.',
                    'Prefer exact or near-exact semantic matches; avoid loose matches.',
                    goalsText ? `User goals: ${goalsText}` : 'User goals: (not provided)'
                ].join(' ')
            },
            {
                role: 'user',
                content: JSON.stringify({
                    query: name,
                    options: options.map((opt)=>({
                            id: opt.id,
                            label: opt.label
                        }))
                })
            }
        ],
        temperature: 0.2
    };
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) return null;
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim();
        if (!content) return null;
        const jsonText = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1] ?? content;
        const parsed = JSON.parse(jsonText);
        const matchId = parsed?.matchId;
        if (typeof matchId === 'number' && index.idToName.has(matchId)) {
            return matchId;
        }
    } catch (error) {
        console.error('Fuzzy match error:', error);
    }
    return null;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__46e28379._.js.map