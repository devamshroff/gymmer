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
"[externals]/bun:sqlite [external] (bun:sqlite, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("bun:sqlite", () => require("bun:sqlite"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/lib/database.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "closeDatabase",
    ()=>closeDatabase,
    "createWorkoutSession",
    ()=>createWorkoutSession,
    "getDatabase",
    ()=>getDatabase,
    "getLastExerciseLog",
    ()=>getLastExerciseLog,
    "getLastWorkoutDate",
    ()=>getLastWorkoutDate,
    "getWorkoutSession",
    ()=>getWorkoutSession,
    "logCardio",
    ()=>logCardio,
    "logExercise",
    ()=>logExercise
]);
// lib/database.ts
var __TURBOPACK__imported__module__$5b$externals$5d2f$bun$3a$sqlite__$5b$external$5d$__$28$bun$3a$sqlite$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/bun:sqlite [external] (bun:sqlite, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
;
;
;
// Database path
const DB_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'data');
const DB_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DB_DIR, 'gymmer.db');
// Ensure data directory exists
if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(DB_DIR)) {
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(DB_DIR, {
        recursive: true
    });
}
// Initialize database
let db = null;
function getDatabase() {
    if (!db) {
        db = new __TURBOPACK__imported__module__$5b$externals$5d2f$bun$3a$sqlite__$5b$external$5d$__$28$bun$3a$sqlite$2c$__cjs$29$__["Database"](DB_PATH);
        initializeDatabase(db);
    }
    return db;
}
function initializeDatabase(database) {
    const schemaPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'lib', 'db-schema.sql');
    const schema = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(schemaPath, 'utf-8');
    // Execute schema
    database.exec(schema);
}
function getLastWorkoutDate(workoutPlanName) {
    const db = getDatabase();
    const result = db.query(`
    SELECT date_completed
    FROM workout_sessions
    WHERE workout_plan_name = ?
    ORDER BY date_completed DESC
    LIMIT 1
  `).get(workoutPlanName);
    return result?.date_completed || null;
}
function createWorkoutSession(data) {
    const db = getDatabase();
    const stmt = db.prepare(`
    INSERT INTO workout_sessions (workout_plan_name, date_completed, total_duration_minutes, total_strain)
    VALUES (?, ?, ?, ?)
  `);
    stmt.run(data.workout_plan_name, data.date_completed, data.total_duration_minutes || null, data.total_strain || null);
    return db.query('SELECT last_insert_rowid() as id').get();
}
function logExercise(data) {
    const db = getDatabase();
    const stmt = db.prepare(`
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
  `);
    stmt.run(data.session_id, data.exercise_name, data.exercise_type, data.warmup_weight ?? null, data.warmup_reps ?? null, data.set1_weight ?? null, data.set1_reps ?? null, data.set2_weight ?? null, data.set2_reps ?? null, data.set3_weight ?? null, data.set3_reps ?? null, data.set4_weight ?? null, data.set4_reps ?? null, data.b2b_partner_name ?? null, data.b2b_warmup_weight ?? null, data.b2b_warmup_reps ?? null, data.b2b_set1_weight ?? null, data.b2b_set1_reps ?? null, data.b2b_set2_weight ?? null, data.b2b_set2_reps ?? null, data.b2b_set3_weight ?? null, data.b2b_set3_reps ?? null, data.b2b_set4_weight ?? null, data.b2b_set4_reps ?? null);
    return db.query('SELECT last_insert_rowid() as id').get();
}
function logCardio(data) {
    const db = getDatabase();
    const stmt = db.prepare(`
    INSERT INTO workout_cardio_logs (session_id, cardio_type, time)
    VALUES (?, ?, ?)
  `);
    stmt.run(data.session_id, data.cardio_type, data.time);
    return db.query('SELECT last_insert_rowid() as id').get();
}
function getWorkoutSession(sessionId) {
    const db = getDatabase();
    const session = db.query(`
    SELECT * FROM workout_sessions WHERE id = ?
  `).get(sessionId);
    if (!session) return null;
    const exercises = db.query(`
    SELECT * FROM workout_exercise_logs WHERE session_id = ?
  `).all(sessionId);
    const cardio = db.query(`
    SELECT * FROM workout_cardio_logs WHERE session_id = ?
  `).all(sessionId);
    return {
        ...session,
        exercises,
        cardio
    };
}
function getLastExerciseLog(workoutPlanName, exerciseName) {
    const db = getDatabase();
    const result = db.query(`
    SELECT el.*
    FROM workout_exercise_logs el
    JOIN workout_sessions ws ON el.session_id = ws.id
    WHERE ws.workout_plan_name = ? AND el.exercise_name = ?
    ORDER BY ws.date_completed DESC
    LIMIT 1
  `).get(workoutPlanName, exerciseName);
    return result;
}
function closeDatabase() {
    if (db) {
        db.close();
        db = null;
    }
}
}),
"[project]/app/api/save-workout/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
// app/api/save-workout/route.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/database.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const sessionData = await request.json();
        // Calculate total duration in minutes
        const startTime = new Date(sessionData.startTime);
        const endTime = new Date();
        const totalDurationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
        // Calculate total strain (sum of all volume)
        let totalStrain = 0;
        for (const exercise of sessionData.exercises){
            if (exercise.warmup) {
                totalStrain += exercise.warmup.weight * exercise.warmup.reps;
            }
            for (const set of exercise.sets){
                totalStrain += set.weight * set.reps;
            }
            if (exercise.b2bPartner) {
                if (exercise.b2bPartner.warmup) {
                    totalStrain += exercise.b2bPartner.warmup.weight * exercise.b2bPartner.warmup.reps;
                }
                for (const set of exercise.b2bPartner.sets){
                    totalStrain += set.weight * set.reps;
                }
            }
        }
        // Create workout session
        const sessionId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createWorkoutSession"])({
            workout_plan_name: sessionData.workoutName,
            date_completed: endTime.toISOString(),
            total_duration_minutes: totalDurationMinutes,
            total_strain: Math.round(totalStrain)
        });
        // Log all exercises
        for (const exercise of sessionData.exercises){
            const exerciseLog = {
                session_id: sessionId,
                exercise_name: exercise.name,
                exercise_type: exercise.type
            };
            // Add warmup if present
            if (exercise.warmup) {
                exerciseLog.warmup_weight = exercise.warmup.weight;
                exerciseLog.warmup_reps = exercise.warmup.reps;
            }
            // Add working sets (up to 4)
            exercise.sets.forEach((set, index)=>{
                if (index < 4) {
                    exerciseLog[`set${index + 1}_weight`] = set.weight;
                    exerciseLog[`set${index + 1}_reps`] = set.reps;
                }
            });
            // Add B2B partner data if present
            if (exercise.b2bPartner) {
                exerciseLog.b2b_partner_name = exercise.b2bPartner.name;
                if (exercise.b2bPartner.warmup) {
                    exerciseLog.b2b_warmup_weight = exercise.b2bPartner.warmup.weight;
                    exerciseLog.b2b_warmup_reps = exercise.b2bPartner.warmup.reps;
                }
                exercise.b2bPartner.sets.forEach((set, index)=>{
                    if (index < 4) {
                        exerciseLog[`b2b_set${index + 1}_weight`] = set.weight;
                        exerciseLog[`b2b_set${index + 1}_reps`] = set.reps;
                    }
                });
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logExercise"])(exerciseLog);
        }
        // Log cardio if present
        if (sessionData.cardio) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logCardio"])({
                session_id: sessionId,
                cardio_type: sessionData.cardio.type,
                time: sessionData.cardio.time
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            sessionId,
            totalDurationMinutes,
            totalStrain: Math.round(totalStrain)
        });
    } catch (error) {
        console.error('Error saving workout session:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to save workout session'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b4474a81._.js.map