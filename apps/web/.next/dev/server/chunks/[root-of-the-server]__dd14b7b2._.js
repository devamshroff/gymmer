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
"[project]/lib/constants.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/constants.ts
// Exercise type identifiers used across workouts, routines, and storage.
__turbopack_context__.s([
    "EXERCISE_HISTORY_AGGREGATION_MODES",
    ()=>EXERCISE_HISTORY_AGGREGATION_MODES,
    "EXERCISE_HISTORY_DISPLAY_MODES",
    ()=>EXERCISE_HISTORY_DISPLAY_MODES,
    "EXERCISE_PRIMARY_METRICS",
    ()=>EXERCISE_PRIMARY_METRICS,
    "EXERCISE_TYPES",
    ()=>EXERCISE_TYPES,
    "SESSION_MODES",
    ()=>SESSION_MODES,
    "SESSION_MODE_DESCRIPTIONS",
    ()=>SESSION_MODE_DESCRIPTIONS,
    "SESSION_MODE_LABELS",
    ()=>SESSION_MODE_LABELS
]);
const EXERCISE_TYPES = {
    single: 'single',
    b2b: 'b2b',
    circuit: 'circuit'
};
const EXERCISE_HISTORY_DISPLAY_MODES = {
    weight: 'weight',
    reps: 'reps'
};
const EXERCISE_HISTORY_AGGREGATION_MODES = {
    max: 'max',
    avg: 'avg'
};
const EXERCISE_PRIMARY_METRICS = {
    weight: 'weight',
    height: 'height',
    time: 'time',
    distance: 'distance',
    repsOnly: 'reps_only'
};
const SESSION_MODES = {
    progress: 'progress',
    maintenance: 'maintenance',
    light: 'light'
};
const SESSION_MODE_LABELS = {
    [SESSION_MODES.progress]: 'Progress',
    [SESSION_MODES.maintenance]: 'Maintenance',
    [SESSION_MODES.light]: 'Light'
};
const SESSION_MODE_DESCRIPTIONS = {
    [SESSION_MODES.progress]: 'Push for small, steady improvements.',
    [SESSION_MODES.maintenance]: 'Hold steady and focus on form.',
    [SESSION_MODES.light]: 'Easy effort today.'
};
}),
"[project]/lib/units.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_HEIGHT_UNIT",
    ()=>DEFAULT_HEIGHT_UNIT,
    "DEFAULT_WEIGHT_UNIT",
    ()=>DEFAULT_WEIGHT_UNIT,
    "HEIGHT_UNITS",
    ()=>HEIGHT_UNITS,
    "WEIGHT_UNITS",
    ()=>WEIGHT_UNITS,
    "convertHeightFromStorage",
    ()=>convertHeightFromStorage,
    "convertHeightToStorage",
    ()=>convertHeightToStorage,
    "convertWeightFromStorage",
    ()=>convertWeightFromStorage,
    "convertWeightToStorage",
    ()=>convertWeightToStorage,
    "formatDisplayNumber",
    ()=>formatDisplayNumber,
    "formatWeightDisplay",
    ()=>formatWeightDisplay,
    "formatWeightValue",
    ()=>formatWeightValue,
    "isHeightUnit",
    ()=>isHeightUnit,
    "isWeightUnit",
    ()=>isWeightUnit,
    "normalizeHeightUnit",
    ()=>normalizeHeightUnit,
    "normalizeWeightUnit",
    ()=>normalizeWeightUnit
]);
const WEIGHT_UNITS = {
    lbs: 'lbs',
    kg: 'kg'
};
const HEIGHT_UNITS = {
    in: 'in',
    cm: 'cm'
};
const DEFAULT_WEIGHT_UNIT = WEIGHT_UNITS.lbs;
const DEFAULT_HEIGHT_UNIT = HEIGHT_UNITS.in;
const KG_PER_LB = 0.45359237;
const CM_PER_IN = 2.54;
function isWeightUnit(value) {
    return value === WEIGHT_UNITS.lbs || value === WEIGHT_UNITS.kg;
}
function isHeightUnit(value) {
    return value === HEIGHT_UNITS.in || value === HEIGHT_UNITS.cm;
}
function normalizeWeightUnit(value) {
    return isWeightUnit(value) ? value : DEFAULT_WEIGHT_UNIT;
}
function normalizeHeightUnit(value) {
    return isHeightUnit(value) ? value : DEFAULT_HEIGHT_UNIT;
}
function convertWeightFromStorage(weight, unit) {
    if (!Number.isFinite(weight)) return 0;
    return unit === WEIGHT_UNITS.kg ? weight * KG_PER_LB : weight;
}
function convertWeightToStorage(weight, unit) {
    if (!Number.isFinite(weight)) return 0;
    return unit === WEIGHT_UNITS.kg ? weight / KG_PER_LB : weight;
}
function convertHeightFromStorage(height, unit) {
    if (!Number.isFinite(height)) return 0;
    return unit === HEIGHT_UNITS.cm ? height * CM_PER_IN : height;
}
function convertHeightToStorage(height, unit) {
    if (!Number.isFinite(height)) return 0;
    return unit === HEIGHT_UNITS.cm ? height / CM_PER_IN : height;
}
function formatDisplayNumber(value) {
    if (!Number.isFinite(value)) return '0';
    const rounded = Math.round(value * 10) / 10;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1);
}
function formatWeightValue(weight, unit) {
    return formatDisplayNumber(convertWeightFromStorage(weight, unit));
}
function formatWeightDisplay(weight, unit, isMachine) {
    if (isMachine) {
        if (weight <= 0) return 'Machine';
        return `+${formatWeightValue(weight, unit)} ${unit}`;
    }
    return `${formatWeightValue(weight, unit)} ${unit}`;
}
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
    "bumpStretchVersion",
    ()=>bumpStretchVersion,
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
    "getLatestWorkoutReportForWorkoutName",
    ()=>getLatestWorkoutReportForWorkoutName,
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
    "getRoutineStretchRecommendationCache",
    ()=>getRoutineStretchRecommendationCache,
    "getRoutineStretches",
    ()=>getRoutineStretches,
    "getStretchById",
    ()=>getStretchById,
    "getStretchVersion",
    ()=>getStretchVersion,
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
    "getWorkoutSessionById",
    ()=>getWorkoutSessionById,
    "getWorkoutSessionByKey",
    ()=>getWorkoutSessionByKey,
    "getWorkoutSessionReportById",
    ()=>getWorkoutSessionReportById,
    "getWorkoutSessionReportByKey",
    ()=>getWorkoutSessionReportByKey,
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
    "touchWorkoutSession",
    ()=>touchWorkoutSession,
    "updateRoutineName",
    ()=>updateRoutineName,
    "updateRoutineNotes",
    ()=>updateRoutineNotes,
    "updateWorkoutSession",
    ()=>updateWorkoutSession,
    "updateWorkoutSessionReport",
    ()=>updateWorkoutSessionReport,
    "upsertRoutineStretchRecommendationCache",
    ()=>upsertRoutineStretchRecommendationCache,
    "upsertUser",
    ()=>upsertUser,
    "upsertUserGoals",
    ()=>upsertUserGoals,
    "upsertUserSettings",
    ()=>upsertUserSettings,
    "upsertWorkoutExerciseLog",
    ()=>upsertWorkoutExerciseLog
]);
// lib/database.ts
var __TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$libsql$2f$client$29$__ = __turbopack_context__.i("[externals]/@libsql/client [external] (@libsql/client, esm_import, [project]/node_modules/@libsql/client)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/units.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$libsql$2f$client$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$libsql$2f$client$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
// Initialize database connection
let db = null;
let workoutSessionRoutineIdColumnReady = null;
let workoutSessionKeyColumnReady = null;
let workoutSessionReportColumnReady = null;
let routineStretchTablesReady = null;
let stretchRecommendationCacheReady = null;
let stretchVersionTableReady = null;
let exerciseColumnsReady = null;
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
async function hasWorkoutSessionRoutineIdColumn() {
    if (workoutSessionRoutineIdColumnReady !== null) return workoutSessionRoutineIdColumnReady;
    const db = getDatabase();
    try {
        const result = await db.execute({
            sql: 'PRAGMA table_info(workout_sessions)'
        });
        workoutSessionRoutineIdColumnReady = result.rows.some((row)=>row.name === 'routine_id');
    } catch (error) {
        console.warn('Failed to inspect workout_sessions routine_id schema:', error);
        workoutSessionRoutineIdColumnReady = false;
    }
    return workoutSessionRoutineIdColumnReady;
}
async function hasWorkoutSessionKeyColumn() {
    if (workoutSessionKeyColumnReady !== null) return workoutSessionKeyColumnReady;
    const db = getDatabase();
    try {
        const result = await db.execute({
            sql: 'PRAGMA table_info(workout_sessions)'
        });
        workoutSessionKeyColumnReady = result.rows.some((row)=>row.name === 'session_key');
    } catch (error) {
        console.warn('Failed to inspect workout_sessions session_key schema:', error);
        workoutSessionKeyColumnReady = false;
    }
    return workoutSessionKeyColumnReady;
}
async function hasWorkoutSessionReportColumn() {
    if (workoutSessionReportColumnReady !== null) return workoutSessionReportColumnReady;
    const db = getDatabase();
    try {
        const result = await db.execute({
            sql: 'PRAGMA table_info(workout_sessions)'
        });
        workoutSessionReportColumnReady = result.rows.some((row)=>row.name === 'workout_report');
    } catch (error) {
        console.warn('Failed to inspect workout_sessions workout_report schema:', error);
        workoutSessionReportColumnReady = false;
    }
    return workoutSessionReportColumnReady;
}
async function ensureWorkoutSessionKeyColumn() {
    const hasColumn = await hasWorkoutSessionKeyColumn();
    if (hasColumn) return true;
    const db = getDatabase();
    try {
        await db.execute({
            sql: 'ALTER TABLE workout_sessions ADD COLUMN session_key TEXT'
        });
        workoutSessionKeyColumnReady = true;
    } catch (error) {
        const message = String(error?.message || error);
        if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('already exists')) {
            workoutSessionKeyColumnReady = true;
        } else {
            console.warn('Failed to add session_key column to workout_sessions:', error);
            workoutSessionKeyColumnReady = false;
            return false;
        }
    }
    try {
        await db.execute({
            sql: 'CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_user_key ON workout_sessions(user_id, session_key)'
        });
    } catch (error) {
        console.warn('Failed to create session_key index:', error);
    }
    return workoutSessionKeyColumnReady === true;
}
async function ensureWorkoutSessionReportColumn() {
    const hasColumn = await hasWorkoutSessionReportColumn();
    if (hasColumn) return true;
    const db = getDatabase();
    try {
        await db.execute({
            sql: 'ALTER TABLE workout_sessions ADD COLUMN workout_report TEXT'
        });
        workoutSessionReportColumnReady = true;
        return true;
    } catch (error) {
        const message = String(error?.message || error);
        if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('already exists')) {
            workoutSessionReportColumnReady = true;
            return true;
        }
        console.warn('Failed to add workout_report column to workout_sessions:', error);
        workoutSessionReportColumnReady = false;
        return false;
    }
}
async function ensureWorkoutSessionRoutineIdColumn() {
    const hasColumn = await hasWorkoutSessionRoutineIdColumn();
    if (hasColumn) return true;
    const db = getDatabase();
    try {
        await db.execute({
            sql: 'ALTER TABLE workout_sessions ADD COLUMN routine_id INTEGER'
        });
        workoutSessionRoutineIdColumnReady = true;
        return true;
    } catch (error) {
        const message = String(error?.message || error);
        if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('already exists')) {
            workoutSessionRoutineIdColumnReady = true;
            return true;
        }
        console.warn('Failed to add routine_id column to workout_sessions:', error);
        workoutSessionRoutineIdColumnReady = false;
        return false;
    }
}
async function backfillWorkoutSessionRoutineIds(userId) {
    const hasColumn = await ensureWorkoutSessionRoutineIdColumn();
    if (!hasColumn) return;
    const db = getDatabase();
    await db.execute({
        sql: `
      UPDATE workout_sessions
      SET routine_id = (
        SELECT r.id
        FROM routines r
        WHERE r.user_id = workout_sessions.user_id
          AND r.name = workout_sessions.workout_plan_name
        LIMIT 1
      )
      WHERE routine_id IS NULL AND user_id = ?
    `,
        args: [
            userId
        ]
    });
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
        weight_unit TEXT DEFAULT 'lbs',
        height_unit TEXT DEFAULT 'in',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `
    });
    await ensureUserSettingsColumns();
}
async function ensureUserSettingsColumns() {
    const db = getDatabase();
    try {
        const result = await db.execute({
            sql: 'PRAGMA table_info(user_settings)'
        });
        const columns = new Set(result.rows.map((row)=>row.name));
        if (!columns.has('weight_unit')) {
            await db.execute("ALTER TABLE user_settings ADD COLUMN weight_unit TEXT DEFAULT 'lbs'");
        }
        if (!columns.has('height_unit')) {
            await db.execute("ALTER TABLE user_settings ADD COLUMN height_unit TEXT DEFAULT 'in'");
        }
    } catch (error) {
        console.warn('Failed to inspect user_settings schema:', error);
    }
}
async function ensureExerciseColumns() {
    if (exerciseColumnsReady) return;
    const db = getDatabase();
    try {
        const result = await db.execute({
            sql: 'PRAGMA table_info(exercises)'
        });
        const columns = new Set(result.rows.map((row)=>row.name));
        if (!columns.has('primary_metric')) {
            await db.execute("ALTER TABLE exercises ADD COLUMN primary_metric TEXT DEFAULT 'weight'");
        }
        if (!columns.has('metric_unit')) {
            await db.execute('ALTER TABLE exercises ADD COLUMN metric_unit TEXT');
        }
        exerciseColumnsReady = true;
    } catch (error) {
        console.warn('Failed to inspect exercises schema:', error);
        exerciseColumnsReady = false;
    }
}
async function ensureRoutineStretchTables() {
    if (routineStretchTablesReady) return;
    const db = getDatabase();
    const tableExists = async (tableName)=>{
        const result = await db.execute({
            sql: "SELECT name FROM sqlite_master WHERE type='table' AND name = ?",
            args: [
                tableName
            ]
        });
        return result.rows.length > 0;
    };
    const hasLegacyStretchFk = async (tableName)=>{
        if (!await tableExists(tableName)) return false;
        const result = await db.execute(`PRAGMA foreign_key_list(${tableName})`);
        return result.rows.some((row)=>row?.table === 'stretches_old');
    };
    const rebuildRoutineStretchTable = async (tableName)=>{
        const exists = await tableExists(tableName);
        const oldName = `${tableName}_old`;
        if (exists) {
            await db.execute(`ALTER TABLE ${tableName} RENAME TO ${oldName}`);
        }
        await db.execute(`
      CREATE TABLE ${tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        routine_id INTEGER NOT NULL,
        stretch_id INTEGER NOT NULL,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
        FOREIGN KEY (stretch_id) REFERENCES stretches(id) ON DELETE CASCADE
      )
    `);
        if (exists) {
            await db.execute(`INSERT INTO ${tableName} SELECT * FROM ${oldName}`);
            await db.execute(`DROP TABLE ${oldName}`);
        }
    };
    const needsPreFix = await hasLegacyStretchFk('routine_pre_stretches');
    const needsPostFix = await hasLegacyStretchFk('routine_post_stretches');
    if (needsPreFix) {
        await rebuildRoutineStretchTable('routine_pre_stretches');
    } else if (!await tableExists('routine_pre_stretches')) {
        await rebuildRoutineStretchTable('routine_pre_stretches');
    }
    if (needsPostFix) {
        await rebuildRoutineStretchTable('routine_post_stretches');
    } else if (!await tableExists('routine_post_stretches')) {
        await rebuildRoutineStretchTable('routine_post_stretches');
    }
    routineStretchTablesReady = true;
}
async function ensureStretchVersionTable() {
    if (stretchVersionTableReady) return;
    const db = getDatabase();
    await db.execute({
        sql: `
      CREATE TABLE IF NOT EXISTS stretch_version (
        id INTEGER PRIMARY KEY,
        version INTEGER NOT NULL,
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `
    });
    stretchVersionTableReady = true;
}
async function ensureStretchRecommendationCacheTable() {
    if (stretchRecommendationCacheReady) return;
    const db = getDatabase();
    await db.execute({
        sql: `
      CREATE TABLE IF NOT EXISTS routine_stretch_recommendation_cache (
        routine_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        signature TEXT NOT NULL,
        recommended_pre_ids TEXT NOT NULL,
        recommended_post_ids TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        PRIMARY KEY (routine_id, user_id, signature)
      )
    `
    });
    stretchRecommendationCacheReady = true;
}
async function getUserSettings(userId) {
    await ensureUserSettingsTable();
    const db = getDatabase();
    const result = await db.execute({
        sql: 'SELECT rest_time_seconds, superset_rest_seconds, weight_unit, height_unit FROM user_settings WHERE user_id = ?',
        args: [
            userId
        ]
    });
    const row = result.rows[0];
    const restTimeSeconds = Number(row?.rest_time_seconds);
    const supersetRestSeconds = Number(row?.superset_rest_seconds);
    const weightUnit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeWeightUnit"])(row?.weight_unit);
    const heightUnit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeHeightUnit"])(row?.height_unit);
    return {
        restTimeSeconds: Number.isFinite(restTimeSeconds) ? restTimeSeconds : DEFAULT_REST_TIME_SECONDS,
        supersetRestSeconds: Number.isFinite(supersetRestSeconds) ? supersetRestSeconds : DEFAULT_SUPERSET_REST_TIME_SECONDS,
        weightUnit,
        heightUnit
    };
}
async function upsertUserSettings(userId, data) {
    await ensureUserSettingsTable();
    const db = getDatabase();
    await db.execute({
        sql: `
      INSERT INTO user_settings (user_id, rest_time_seconds, superset_rest_seconds, weight_unit, height_unit, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(user_id) DO UPDATE SET
        rest_time_seconds = excluded.rest_time_seconds,
        superset_rest_seconds = excluded.superset_rest_seconds,
        weight_unit = excluded.weight_unit,
        height_unit = excluded.height_unit,
        updated_at = datetime('now')
    `,
        args: [
            userId,
            data.restTimeSeconds,
            data.supersetRestSeconds,
            data.weightUnit,
            data.heightUnit
        ]
    });
}
async function createWorkoutSession(data) {
    const db = getDatabase();
    const hasRoutineIdColumn = await ensureWorkoutSessionRoutineIdColumn();
    const includeSessionKey = data.session_key !== undefined ? await ensureWorkoutSessionKeyColumn() : await hasWorkoutSessionKeyColumn();
    const routineIdValue = data.routine_id ?? null;
    const sessionKeyValue = data.session_key ?? null;
    const columns = [
        'user_id'
    ];
    const args = [
        data.user_id
    ];
    if (hasRoutineIdColumn) {
        columns.push('routine_id');
        args.push(routineIdValue);
    }
    if (includeSessionKey) {
        columns.push('session_key');
        args.push(sessionKeyValue);
    }
    columns.push('workout_plan_name', 'date_completed', 'total_duration_minutes', 'total_strain');
    args.push(data.workout_plan_name, data.date_completed, data.total_duration_minutes || null, data.total_strain || null);
    const result = await db.execute({
        sql: `
      INSERT INTO workout_sessions (${columns.join(', ')})
      VALUES (${columns.map(()=>'?').join(', ')})
    `,
        args
    });
    return Number(result.lastInsertRowid);
}
async function getWorkoutSessionById(id, userId) {
    const db = getDatabase();
    const result = await db.execute({
        sql: 'SELECT * FROM workout_sessions WHERE id = ? AND user_id = ?',
        args: [
            id,
            userId
        ]
    });
    return result.rows[0] || null;
}
async function getWorkoutSessionByKey(userId, sessionKey) {
    const db = getDatabase();
    const hasKeyColumn = await hasWorkoutSessionKeyColumn();
    if (!hasKeyColumn) return null;
    const result = await db.execute({
        sql: 'SELECT * FROM workout_sessions WHERE user_id = ? AND session_key = ? LIMIT 1',
        args: [
            userId,
            sessionKey
        ]
    });
    return result.rows[0] || null;
}
async function touchWorkoutSession(id, userId, data) {
    const db = getDatabase();
    const updates = [
        'date_completed = ?'
    ];
    const args = [
        new Date().toISOString()
    ];
    if (data.routine_id !== undefined) {
        updates.push('routine_id = ?');
        args.push(data.routine_id);
    }
    if (data.workout_plan_name) {
        updates.push('workout_plan_name = ?');
        args.push(data.workout_plan_name);
    }
    args.push(id, userId);
    await db.execute({
        sql: `UPDATE workout_sessions SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
        args
    });
}
async function updateWorkoutSession(id, userId, data) {
    const db = getDatabase();
    const updates = [];
    const args = [];
    if (data.routine_id !== undefined) {
        updates.push('routine_id = ?');
        args.push(data.routine_id);
    }
    if (data.workout_plan_name) {
        updates.push('workout_plan_name = ?');
        args.push(data.workout_plan_name);
    }
    if (data.date_completed) {
        updates.push('date_completed = ?');
        args.push(data.date_completed);
    }
    if (data.total_duration_minutes !== undefined) {
        updates.push('total_duration_minutes = ?');
        args.push(data.total_duration_minutes);
    }
    if (data.total_strain !== undefined) {
        updates.push('total_strain = ?');
        args.push(data.total_strain);
    }
    if (updates.length === 0) return;
    args.push(id, userId);
    await db.execute({
        sql: `UPDATE workout_sessions SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
        args
    });
}
async function updateWorkoutSessionReport(data) {
    const hasReportColumn = await ensureWorkoutSessionReportColumn();
    if (!hasReportColumn) return;
    const db = getDatabase();
    if (typeof data.sessionId === 'number') {
        await db.execute({
            sql: 'UPDATE workout_sessions SET workout_report = ? WHERE id = ? AND user_id = ?',
            args: [
                data.report,
                data.sessionId,
                data.userId
            ]
        });
        return;
    }
    if (data.sessionKey) {
        const hasKeyColumn = await hasWorkoutSessionKeyColumn();
        if (!hasKeyColumn) {
            console.warn('Missing session_key column; cannot save workout report by key.');
            return;
        }
        await db.execute({
            sql: 'UPDATE workout_sessions SET workout_report = ? WHERE session_key = ? AND user_id = ?',
            args: [
                data.report,
                data.sessionKey,
                data.userId
            ]
        });
        return;
    }
    console.warn('Missing session id/key; workout report not saved.');
}
async function getWorkoutSessionReportById(userId, sessionId) {
    const hasReportColumn = await ensureWorkoutSessionReportColumn();
    if (!hasReportColumn) return null;
    const db = getDatabase();
    const result = await db.execute({
        sql: 'SELECT workout_report FROM workout_sessions WHERE id = ? AND user_id = ? LIMIT 1',
        args: [
            sessionId,
            userId
        ]
    });
    const row = result.rows[0];
    return row?.workout_report ?? null;
}
async function getWorkoutSessionReportByKey(userId, sessionKey) {
    const hasReportColumn = await ensureWorkoutSessionReportColumn();
    if (!hasReportColumn) return null;
    const hasKeyColumn = await hasWorkoutSessionKeyColumn();
    if (!hasKeyColumn) return null;
    const db = getDatabase();
    const result = await db.execute({
        sql: 'SELECT workout_report FROM workout_sessions WHERE session_key = ? AND user_id = ? LIMIT 1',
        args: [
            sessionKey,
            userId
        ]
    });
    const row = result.rows[0];
    return row?.workout_report ?? null;
}
async function getLatestWorkoutReportForWorkoutName(userId, workoutName) {
    const hasReportColumn = await ensureWorkoutSessionReportColumn();
    if (!hasReportColumn) return null;
    const db = getDatabase();
    const result = await db.execute({
        sql: `
      SELECT workout_report
      FROM workout_sessions
      WHERE user_id = ? AND workout_plan_name = ? AND workout_report IS NOT NULL
      ORDER BY date_completed DESC
      LIMIT 1
    `,
        args: [
            userId,
            workoutName
        ]
    });
    const row = result.rows[0];
    return row?.workout_report ?? null;
}
async function logExercise(data) {
    return upsertWorkoutExerciseLog(data);
}
async function upsertWorkoutExerciseLog(data) {
    const db = getDatabase();
    const partnerName = data.b2b_partner_name ?? null;
    const existing = await db.execute({
        sql: `
      SELECT id FROM workout_exercise_logs
      WHERE session_id = ? AND exercise_name = ?
        AND (b2b_partner_name IS ? OR b2b_partner_name = ?)
      LIMIT 1
    `,
        args: [
            data.session_id,
            data.exercise_name,
            partnerName,
            partnerName
        ]
    });
    const updateFields = [];
    const columns = [
        'exercise_type',
        'warmup_weight',
        'warmup_reps',
        'set1_weight',
        'set1_reps',
        'set2_weight',
        'set2_reps',
        'set3_weight',
        'set3_reps',
        'set4_weight',
        'set4_reps',
        'b2b_partner_name',
        'b2b_warmup_weight',
        'b2b_warmup_reps',
        'b2b_set1_weight',
        'b2b_set1_reps',
        'b2b_set2_weight',
        'b2b_set2_reps',
        'b2b_set3_weight',
        'b2b_set3_reps',
        'b2b_set4_weight',
        'b2b_set4_reps'
    ];
    for (const column of columns){
        if (data[column] !== undefined) {
            updateFields.push([
                column,
                data[column]
            ]);
        }
    }
    if (existing.rows.length > 0) {
        if (updateFields.length === 0) {
            return Number(existing.rows[0].id);
        }
        const assignments = updateFields.map(([column])=>`${column} = ?`).join(', ');
        const args = updateFields.map(([, value])=>value);
        args.push(existing.rows[0].id);
        await db.execute({
            sql: `UPDATE workout_exercise_logs SET ${assignments} WHERE id = ?`,
            args
        });
        return Number(existing.rows[0].id);
    }
    const insertColumns = [
        'session_id',
        'exercise_name',
        ...updateFields.map(([column])=>column)
    ];
    const insertArgs = [
        data.session_id,
        data.exercise_name,
        ...updateFields.map(([, value])=>value)
    ];
    const result = await db.execute({
        sql: `
      INSERT INTO workout_exercise_logs (${insertColumns.join(', ')})
      VALUES (${insertColumns.map(()=>'?').join(', ')})
    `,
        args: insertArgs
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
async function getRecentExerciseLogs(exerciseName, userId, limit = 5) {
    const db = getDatabase();
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
      ORDER BY ws.date_completed DESC
      LIMIT ?
    `,
        args: [
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
    await ensureExerciseColumns();
    const db = getDatabase();
    const daysBack = range === 'week' ? 7 : range === 'month' ? 30 : null;
    const cutoff = daysBack ? new Date(Date.now() - (daysBack - 1) * 86400000).toISOString() : null;
    const rangeClause = cutoff ? 'AND ws.date_completed >= ?' : '';
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
        sql: 'SELECT equipment, is_bodyweight, is_machine, primary_metric, metric_unit FROM exercises WHERE name = ? LIMIT 1',
        args: [
            exerciseName
        ]
    });
    const row = equipmentResult.rows[0];
    const isBodyweight = row?.is_bodyweight === 1;
    const isMachine = row?.is_machine === 1;
    const primaryMetric = typeof row?.primary_metric === 'string' ? row.primary_metric : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight;
    const metricUnit = typeof row?.metric_unit === 'string' ? row.metric_unit : null;
    const displayMode = primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].repsOnly || isBodyweight ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].reps : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].weight;
    const normalizedPoints = primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight ? points : points.map((point)=>({
            ...point,
            volume: null
        }));
    return {
        display_mode: displayMode,
        is_machine: isMachine,
        primary_metric: primaryMetric,
        metric_unit: metricUnit,
        points: normalizedPoints
    };
}
async function createExercise(data) {
    await ensureExerciseColumns();
    const db = getDatabase();
    const result = await db.execute({
        sql: `
      INSERT INTO exercises (
        name,
        video_url,
        tips,
        muscle_groups,
        equipment,
        is_bodyweight,
        is_machine,
        difficulty,
        primary_metric,
        metric_unit
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        args: [
            data.name,
            data.videoUrl || null,
            data.tips || null,
            data.muscleGroups ? JSON.stringify(data.muscleGroups) : null,
            data.equipment || null,
            typeof data.isBodyweight === 'boolean' ? data.isBodyweight ? 1 : 0 : null,
            typeof data.isMachine === 'boolean' ? data.isMachine ? 1 : 0 : null,
            data.difficulty || null,
            data.primaryMetric || 'weight',
            data.metricUnit || null
        ]
    });
    return Number(result.lastInsertRowid);
}
async function getAllExercises() {
    await ensureExerciseColumns();
    const db = getDatabase();
    const result = await db.execute('SELECT * FROM exercises ORDER BY name');
    return result.rows;
}
async function searchExercises(query) {
    await ensureExerciseColumns();
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
    await ensureExerciseColumns();
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
    await backfillWorkoutSessionRoutineIds(userId);
    const result = await db.execute({
        sql: `
      SELECT r.*, MAX(ws.date_completed) as last_workout_date
      FROM routines r
      LEFT JOIN workout_sessions ws
        ON ws.user_id = ? AND ws.routine_id = r.id
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
    // Update the routine name
    await db.execute({
        sql: 'UPDATE routines SET name = ?, updated_at = datetime(\'now\') WHERE id = ? AND user_id = ?',
        args: [
            newName,
            id,
            userId
        ]
    });
    await backfillWorkoutSessionRoutineIds(userId);
    // Update workout history to use the new name (only for this user)
    await db.execute({
        sql: 'UPDATE workout_sessions SET workout_plan_name = ? WHERE routine_id = ? AND user_id = ?',
        args: [
            newName,
            id,
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
        routine_id, exercise_id1, exercise_id2, order_index
      ) VALUES (?, ?, ?, ?)
    `,
        args: [
            data.routineId,
            data.exerciseId1,
            data.exerciseId2 ?? null,
            data.orderIndex
        ]
    });
    return Number(result.lastInsertRowid);
}
async function getRoutineExercises(routineId) {
    await ensureExerciseColumns();
    const db = getDatabase();
    const result = await db.execute({
        sql: `
      SELECT re.*,
             e1.name as exercise_name, e1.video_url, e1.tips,
             e1.equipment as exercise_equipment,
             e1.is_bodyweight as exercise_is_bodyweight,
             e1.is_machine as exercise_is_machine,
             e1.primary_metric as exercise_primary_metric,
             e1.metric_unit as exercise_metric_unit,
             e2.name as exercise2_name, e2.video_url as exercise2_video_url, e2.tips as exercise2_tips,
             e2.equipment as exercise2_equipment,
             e2.is_bodyweight as exercise2_is_bodyweight,
             e2.is_machine as exercise2_is_machine,
             e2.primary_metric as exercise2_primary_metric,
             e2.metric_unit as exercise2_metric_unit
      FROM routine_exercises re
      JOIN exercises e1 ON re.exercise_id1 = e1.id
      LEFT JOIN exercises e2 ON re.exercise_id2 = e2.id
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
      INSERT INTO stretches (name, timer_seconds, video_url, tips, muscle_groups)
      VALUES (?, ?, ?, ?, ?)
    `,
        args: [
            data.name,
            typeof data.timerSeconds === 'number' ? data.timerSeconds : 0,
            data.videoUrl || null,
            data.tips || null,
            data.muscleGroups ? JSON.stringify(data.muscleGroups) : null
        ]
    });
    const id = Number(result.lastInsertRowid);
    try {
        await bumpStretchVersion();
    } catch (error) {
        console.warn('Failed to bump stretch version:', error);
    }
    return id;
}
async function getAllStretches() {
    const db = getDatabase();
    const result = await db.execute('SELECT * FROM stretches ORDER BY name');
    return result.rows;
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
function parseIdList(value) {
    if (typeof value !== 'string' || !value) return [];
    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) return [];
        return parsed.map((item)=>Number(item)).filter((item)=>Number.isFinite(item));
    } catch  {
        return [];
    }
}
async function getStretchVersion() {
    await ensureStretchVersionTable();
    const db = getDatabase();
    await db.execute({
        sql: 'INSERT OR IGNORE INTO stretch_version (id, version) VALUES (1, 0)'
    });
    const result = await db.execute({
        sql: 'SELECT version FROM stretch_version WHERE id = 1'
    });
    return Number(result.rows[0]?.version ?? 0);
}
async function bumpStretchVersion() {
    await ensureStretchVersionTable();
    const db = getDatabase();
    await db.execute({
        sql: `
      INSERT INTO stretch_version (id, version, updated_at)
      VALUES (1, 1, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        version = version + 1,
        updated_at = datetime('now')
    `
    });
}
async function getRoutineStretchRecommendationCache(params) {
    await ensureStretchRecommendationCacheTable();
    const db = getDatabase();
    const result = await db.execute({
        sql: `
      SELECT recommended_pre_ids, recommended_post_ids
      FROM routine_stretch_recommendation_cache
      WHERE routine_id = ? AND user_id = ? AND signature = ?
    `,
        args: [
            params.routineId,
            params.userId,
            params.signature
        ]
    });
    const row = result.rows[0];
    if (!row) return null;
    return {
        recommendedPreIds: parseIdList(row.recommended_pre_ids),
        recommendedPostIds: parseIdList(row.recommended_post_ids)
    };
}
async function upsertRoutineStretchRecommendationCache(params) {
    await ensureStretchRecommendationCacheTable();
    const db = getDatabase();
    await db.execute({
        sql: `
      INSERT INTO routine_stretch_recommendation_cache (
        routine_id,
        user_id,
        signature,
        recommended_pre_ids,
        recommended_post_ids,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      ON CONFLICT(routine_id, user_id, signature) DO UPDATE SET
        recommended_pre_ids = excluded.recommended_pre_ids,
        recommended_post_ids = excluded.recommended_post_ids,
        updated_at = datetime('now')
    `,
        args: [
            params.routineId,
            params.userId,
            params.signature,
            JSON.stringify(params.recommendedPreIds),
            JSON.stringify(params.recommendedPostIds)
        ]
    });
}
async function addStretchToRoutine(routineId, stretchId, type, orderIndex) {
    await ensureRoutineStretchTables();
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
    await ensureRoutineStretchTables();
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
      SELECT rs.*, s.name, s.timer_seconds, s.video_url, s.tips, s.muscle_groups
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
    await ensureRoutineStretchTables();
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
    if (excludeUserId) {
        await backfillWorkoutSessionRoutineIds(excludeUserId);
    }
    const sql = excludeUserId ? `SELECT r.*, u.username as creator_username, u.name as creator_name,
         MAX(ws.date_completed) as last_workout_date
       FROM routines r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN workout_sessions ws
         ON ws.user_id = ? AND ws.routine_id = r.id
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
    await backfillWorkoutSessionRoutineIds(userId);
    const result = await db.execute({
        sql: `SELECT r.*, u.username as creator_username, u.name as creator_name, 1 as is_favorited,
            MAX(ws.date_completed) as last_workout_date
          FROM routine_favorites rf
          JOIN routines r ON rf.routine_id = r.id
          JOIN users u ON r.user_id = u.id
          LEFT JOIN workout_sessions ws
            ON ws.user_id = ? AND ws.routine_id = r.id
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
        routine_id, exercise_id1, exercise_id2, order_index
      ) VALUES (?, ?, ?, ?)`,
            args: [
                newRoutineId,
                e.exercise_id1 ?? e.exercise_id,
                e.exercise_id2 ?? e.b2b_partner_id ?? null,
                e.order_index
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
"[project]/app/api/exercise-history/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
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
function normalizeRange(value) {
    if (value === 'week' || value === 'month' || value === 'all') {
        return value;
    }
    return 'month';
}
async function GET(request) {
    const authResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAuth"])();
    if ('error' in authResult) return authResult.error;
    const { user } = authResult;
    try {
        const searchParams = request.nextUrl.searchParams;
        const names = searchParams.getAll('name').map((name)=>name.trim()).filter(Boolean);
        if (names.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'At least one exercise name is required'
            }, {
                status: 400
            });
        }
        const range = normalizeRange(searchParams.get('range'));
        const entries = await Promise.all(names.map(async (name)=>[
                name,
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getExerciseHistory"])(user.id, name, range)
            ]));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            history: Object.fromEntries(entries)
        });
    } catch (error) {
        console.error('Error fetching exercise history:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch exercise history'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dd14b7b2._.js.map