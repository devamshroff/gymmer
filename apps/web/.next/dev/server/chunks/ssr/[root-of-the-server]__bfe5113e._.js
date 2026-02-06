module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

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
"[project]/lib/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/lib/workout-session.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addCardioToSession",
    ()=>addCardioToSession,
    "addExerciseToSession",
    ()=>addExerciseToSession,
    "clearWorkoutSession",
    ()=>clearWorkoutSession,
    "ensureWorkoutSession",
    ()=>ensureWorkoutSession,
    "getWorkoutSession",
    ()=>getWorkoutSession,
    "initWorkoutSession",
    ()=>initWorkoutSession,
    "isSessionMode",
    ()=>isSessionMode,
    "resolveSessionMode",
    ()=>resolveSessionMode,
    "setWorkoutSessionId",
    ()=>setWorkoutSessionId
]);
// lib/workout-session.ts
// Client-side storage for current workout session
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-ssr] (ecmascript)");
;
const STORAGE_KEY = 'current_workout_session';
function isSessionMode(value) {
    return value === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SESSION_MODES"].progress || value === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SESSION_MODES"].maintenance || value === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SESSION_MODES"].light;
}
function resolveSessionMode(value, fallback = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SESSION_MODES"].progress) {
    return isSessionMode(value) ? value : fallback;
}
function initWorkoutSession(workoutName, routineId) {
    const session = {
        workoutName,
        routineId: routineId ?? null,
        sessionId: null,
        startTime: new Date().toISOString(),
        exercises: []
    };
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function ensureWorkoutSession(workoutName, routineId) {
    const existing = getWorkoutSession();
    const normalizedRoutineId = routineId ?? null;
    if (!existing) {
        initWorkoutSession(workoutName, normalizedRoutineId);
        return;
    }
    if (existing.workoutName !== workoutName || (existing.routineId ?? null) !== normalizedRoutineId) {
        initWorkoutSession(workoutName, normalizedRoutineId);
    }
}
function getWorkoutSession() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const data = undefined;
    const parsed = undefined;
    const rawRoutineId = undefined;
    const nextRoutineId = undefined;
    const rawSessionId = undefined;
    const nextSessionId = undefined;
}
function setWorkoutSessionId(sessionId) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const session = undefined;
}
function addExerciseToSession(exercise) {
    const session = getWorkoutSession();
    if (!session) return;
    session.exercises.push(exercise);
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function addCardioToSession(cardio) {
    const session = getWorkoutSession();
    if (!session) return;
    session.cardio = cardio;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function clearWorkoutSession() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
}),
"[project]/lib/workout-autosave.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "autosaveWorkout",
    ()=>autosaveWorkout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-session.ts [app-ssr] (ecmascript)");
;
function emitAutosave(status, eventType) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
async function autosaveWorkout(event) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const session = undefined;
}
}),
"[project]/app/components/QuickExerciseForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuickExerciseForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function QuickExerciseForm({ onSubmit, onCancel }) {
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [videoUrl, setVideoUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [tips, setTips] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [equipment, setEquipment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [primaryMetric, setPrimaryMetric] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight);
    const [metricUnit, setMetricUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('sec');
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!name.trim()) return;
        setSubmitting(true);
        try {
            await onSubmit({
                name: name.trim(),
                videoUrl: videoUrl.trim() || undefined,
                tips: tips.trim() || undefined,
                equipment: equipment || undefined,
                primaryMetric,
                metricUnit: primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].time || primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].distance ? metricUnit.trim() : undefined
            });
        } finally{
            setSubmitting(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-green-600",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold text-white mb-4",
                    children: "Create New Exercise"
                }, void 0, false, {
                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-300 text-sm font-semibold block mb-2",
                                    children: [
                                        "Exercise Name ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-500",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                            lineNumber: 60,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: name,
                                    onChange: (e)=>setName(e.target.value),
                                    placeholder: "e.g., Barbell Bench Press",
                                    className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500",
                                    required: true,
                                    autoFocus: true
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-300 text-sm font-semibold block mb-2",
                                    children: "Equipment"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: equipment,
                                    onChange: (e)=>setEquipment(e.target.value),
                                    className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer",
                                    style: {
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Select equipment (optional)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                            lineNumber: 90,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Barbell",
                                            children: "Barbell"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                            lineNumber: 91,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Dumbbells",
                                            children: "Dumbbells"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                            lineNumber: 92,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Bodyweight",
                                            children: "Bodyweight"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                            lineNumber: 93,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Machine",
                                            children: "Machine"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                            lineNumber: 94,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Cable",
                                            children: "Cable"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                            lineNumber: 95,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Bands",
                                            children: "Bands"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                            lineNumber: 96,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Other",
                                            children: "Other"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                            lineNumber: 97,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-300 text-sm font-semibold block mb-2",
                                    children: "Tracking Metric"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: primaryMetric,
                                    onChange: (e)=>{
                                        const nextMetric = e.target.value;
                                        setPrimaryMetric(nextMetric);
                                        if (nextMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].time) {
                                            setMetricUnit('sec');
                                        } else if (nextMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].distance) {
                                            setMetricUnit('m');
                                        }
                                    },
                                    className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer",
                                    style: {
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight,
                                            children: "Weight"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                            lineNumber: 126,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].height,
                                            children: "Height"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                            lineNumber: 127,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].time,
                                            children: "Time"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                            lineNumber: 128,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].distance,
                                            children: "Distance"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                            lineNumber: 129,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].repsOnly,
                                            children: "Reps only"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                            lineNumber: 130,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this),
                                primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].height && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-zinc-500 text-xs mt-2",
                                    children: "Uses your profile height unit (in or cm)."
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 133,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this),
                        (primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].time || primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].distance) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-300 text-sm font-semibold block mb-2",
                                    children: "Unit"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 142,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: metricUnit,
                                    onChange: (e)=>setMetricUnit(e.target.value),
                                    className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer",
                                    style: {
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    },
                                    children: primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].time ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "sec",
                                                children: "sec"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                                lineNumber: 159,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "min",
                                                children: "min"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                                lineNumber: 160,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "m",
                                                children: "m"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                                lineNumber: 164,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "km",
                                                children: "km"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                                lineNumber: 165,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "yd",
                                                children: "yd"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                                lineNumber: 166,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "mi",
                                                children: "mi"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                                lineNumber: 167,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 145,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                            lineNumber: 141,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-300 text-sm font-semibold block mb-2",
                                    children: "Video URL"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 176,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-zinc-500 text-xs mb-2",
                                    children: [
                                        'If left empty, will default to YouTube search for "',
                                        name || 'exercise name',
                                        '"'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 179,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "url",
                                    value: videoUrl,
                                    onChange: (e)=>setVideoUrl(e.target.value),
                                    placeholder: "https://youtube.com/...",
                                    className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 182,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-300 text-sm font-semibold block mb-2",
                                    children: "Tips"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 193,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: tips,
                                    onChange: (e)=>setTips(e.target.value),
                                    placeholder: "Form tips, cues, etc.",
                                    rows: 3,
                                    className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 196,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                            lineNumber: 192,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3 pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onCancel,
                                    className: "bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 207,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: !name.trim() || submitting,
                                    className: "bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors",
                                    children: submitting ? 'Creating...' : 'Create & Select'
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/QuickExerciseForm.tsx",
                            lineNumber: 206,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/QuickExerciseForm.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/QuickExerciseForm.tsx",
            lineNumber: 53,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/QuickExerciseForm.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/muscle-tags.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MUSCLE_GROUP_ORDER",
    ()=>MUSCLE_GROUP_ORDER,
    "MUSCLE_GROUP_TAGS",
    ()=>MUSCLE_GROUP_TAGS,
    "STRETCH_MUSCLE_ORDER",
    ()=>STRETCH_MUSCLE_ORDER,
    "STRETCH_MUSCLE_TAGS",
    ()=>STRETCH_MUSCLE_TAGS,
    "formatTypeLabel",
    ()=>formatTypeLabel,
    "normalizeTypeList",
    ()=>normalizeTypeList,
    "parseTagJson",
    ()=>parseTagJson
]);
const MUSCLE_GROUP_TAGS = [
    'lower body compound',
    'upper body compound',
    'full body compound',
    'chest',
    'back',
    'shoulders',
    'biceps',
    'triceps',
    'forearms',
    'core',
    'lower back',
    'glutes',
    'quads',
    'hamstrings',
    'calves',
    'hip flexors',
    'adductors',
    'abductors',
    'unknown'
];
const STRETCH_MUSCLE_TAGS = [
    ...MUSCLE_GROUP_TAGS
];
const MUSCLE_GROUP_ORDER = [
    ...MUSCLE_GROUP_TAGS
];
const STRETCH_MUSCLE_ORDER = [
    ...STRETCH_MUSCLE_TAGS
];
function normalizeTypeList(value, allowed, maxItems = 2) {
    const entries = Array.isArray(value) ? value : typeof value === 'string' ? [
        value
    ] : [];
    if (entries.length === 0) return [];
    const cleaned = entries.map((item)=>typeof item === 'string' ? item.trim().toLowerCase() : '').filter(Boolean);
    const filtered = allowed ? cleaned.filter((tag)=>allowed.includes(tag)) : cleaned;
    const unique = [];
    for (const tag of filtered){
        if (!unique.includes(tag)) {
            unique.push(tag);
        }
        if (unique.length >= maxItems) break;
    }
    return unique;
}
function parseTagJson(value, allowed, maxItems = 2) {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        return normalizeTypeList(parsed, allowed, maxItems);
    } catch  {
        return [];
    }
}
function formatTypeLabel(value) {
    return value.split(' ').map((word)=>word ? word[0].toUpperCase() + word.slice(1) : word).join(' ');
}
}),
"[project]/app/components/ExerciseSelector.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ExerciseSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$QuickExerciseForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/QuickExerciseForm.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$muscle$2d$tags$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/muscle-tags.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const FALLBACK_GROUP = 'other';
function getMuscleGroups(exercise) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$muscle$2d$tags$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseTagJson"])(exercise.muscle_groups, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$muscle$2d$tags$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MUSCLE_GROUP_TAGS"]);
}
function groupExercisesByType(items) {
    const grouped = new Map();
    const sorted = [
        ...items
    ].sort((a, b)=>a.name.localeCompare(b.name));
    for (const exercise of sorted){
        const tags = getMuscleGroups(exercise);
        const keys = tags.length > 0 ? tags : [
            FALLBACK_GROUP
        ];
        for (const key of keys){
            const list = grouped.get(key);
            if (list) {
                list.push(exercise);
            } else {
                grouped.set(key, [
                    exercise
                ]);
            }
        }
    }
    const order = [
        ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$muscle$2d$tags$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MUSCLE_GROUP_ORDER"],
        FALLBACK_GROUP
    ];
    const keys = Array.from(grouped.keys()).sort((a, b)=>{
        const aIndex = order.indexOf(a);
        const bIndex = order.indexOf(b);
        if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
    });
    return keys.map((key)=>({
            type: key,
            exercises: grouped.get(key) || []
        }));
}
function ExerciseSelector({ onSelect, onCancel, title }) {
    const [exercises, setExercises] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showCreateForm, setShowCreateForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchExercises();
    }, []);
    const fetchExercises = async ()=>{
        try {
            const response = await fetch('/api/exercises');
            const data = await response.json();
            setExercises(data.exercises);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        } finally{
            setLoading(false);
        }
    };
    const handleCreateExercise = async (exerciseData)=>{
        try {
            const response = await fetch('/api/exercises', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(exerciseData)
            });
            if (!response.ok) {
                throw new Error('Failed to create exercise');
            }
            const data = await response.json();
            // Fetch updated list
            await fetchExercises();
            // Find the newly created exercise and select it
            const newExercise = exercises.find((e)=>e.id === data.id) || {
                id: data.id,
                name: exerciseData.name,
                video_url: exerciseData.videoUrl || null,
                tips: exerciseData.tips || null,
                equipment: exerciseData.equipment || null,
                is_bodyweight: typeof data.is_bodyweight === 'number' ? data.is_bodyweight : null,
                primary_metric: typeof data.primary_metric === 'string' ? data.primary_metric : null,
                metric_unit: typeof data.metric_unit === 'string' ? data.metric_unit : null
            };
            onSelect(newExercise);
        } catch (error) {
            console.error('Error creating exercise:', error);
            alert('Failed to create exercise. Please try again.');
        }
    };
    const filteredExercises = exercises.filter((exercise)=>{
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const tagText = getMuscleGroups(exercise).join(' ').toLowerCase();
        return exercise.name.toLowerCase().includes(query) || tagText.includes(query);
    });
    const groupedExercises = groupExercisesByType(filteredExercises);
    if (showCreateForm) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$QuickExerciseForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            onSubmit: handleCreateExercise,
            onCancel: ()=>setShowCreateForm(false)
        }, void 0, false, {
            fileName: "[project]/app/components/ExerciseSelector.tsx",
            lineNumber: 130,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] flex flex-col border-2 border-blue-600",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold text-white mb-4",
                    children: title || 'Select Exercise'
                }, void 0, false, {
                    fileName: "[project]/app/components/ExerciseSelector.tsx",
                    lineNumber: 140,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4 space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: searchQuery,
                            onChange: (e)=>setSearchQuery(e.target.value),
                            placeholder: "Search exercises or muscle groups...",
                            className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                            autoFocus: true
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseSelector.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowCreateForm(true),
                            className: "w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-colors",
                            children: "+ Create New Exercise"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseSelector.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExerciseSelector.tsx",
                    lineNumber: 143,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto mb-4 space-y-2",
                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-zinc-400 py-8",
                        children: "Loading exercises..."
                    }, void 0, false, {
                        fileName: "[project]/app/components/ExerciseSelector.tsx",
                        lineNumber: 164,
                        columnNumber: 13
                    }, this) : groupedExercises.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-zinc-400 py-8",
                        children: searchQuery ? 'No exercises found' : 'No exercises available'
                    }, void 0, false, {
                        fileName: "[project]/app/components/ExerciseSelector.tsx",
                        lineNumber: 166,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: groupedExercises.map(({ type, exercises: groupExercises })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs uppercase tracking-wide text-zinc-400",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$muscle$2d$tags$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTypeLabel"])(type)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ExerciseSelector.tsx",
                                        lineNumber: 173,
                                        columnNumber: 19
                                    }, this),
                                    groupExercises.map((exercise)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onSelect(exercise),
                                            className: "w-full bg-zinc-900 hover:bg-zinc-700 text-left p-4 rounded-lg transition-colors border-2 border-zinc-700 hover:border-blue-500",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-white font-semibold",
                                                        children: exercise.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/ExerciseSelector.tsx",
                                                        lineNumber: 183,
                                                        columnNumber: 25
                                                    }, this),
                                                    exercise.equipment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-zinc-400 text-sm mt-1",
                                                        children: exercise.equipment
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/ExerciseSelector.tsx",
                                                        lineNumber: 185,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/ExerciseSelector.tsx",
                                                lineNumber: 182,
                                                columnNumber: 23
                                            }, this)
                                        }, exercise.id, false, {
                                            fileName: "[project]/app/components/ExerciseSelector.tsx",
                                            lineNumber: 177,
                                            columnNumber: 21
                                        }, this))
                                ]
                            }, type, true, {
                                fileName: "[project]/app/components/ExerciseSelector.tsx",
                                lineNumber: 172,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/ExerciseSelector.tsx",
                        lineNumber: 170,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/ExerciseSelector.tsx",
                    lineNumber: 162,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onCancel,
                    className: "w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                    children: "Cancel"
                }, void 0, false, {
                    fileName: "[project]/app/components/ExerciseSelector.tsx",
                    lineNumber: 197,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/ExerciseSelector.tsx",
            lineNumber: 139,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/ExerciseSelector.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/components/SupersetSelector.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SupersetSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$QuickExerciseForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/QuickExerciseForm.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$muscle$2d$tags$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/muscle-tags.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const FALLBACK_GROUP = 'other';
function getMuscleGroups(exercise) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$muscle$2d$tags$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseTagJson"])(exercise.muscle_groups, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$muscle$2d$tags$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MUSCLE_GROUP_TAGS"]);
}
function groupExercisesByType(items) {
    const grouped = new Map();
    const sorted = [
        ...items
    ].sort((a, b)=>a.name.localeCompare(b.name));
    for (const exercise of sorted){
        const tags = getMuscleGroups(exercise);
        const keys = tags.length > 0 ? tags : [
            FALLBACK_GROUP
        ];
        for (const key of keys){
            const list = grouped.get(key);
            if (list) {
                list.push(exercise);
            } else {
                grouped.set(key, [
                    exercise
                ]);
            }
        }
    }
    const order = [
        ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$muscle$2d$tags$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MUSCLE_GROUP_ORDER"],
        FALLBACK_GROUP
    ];
    const keys = Array.from(grouped.keys()).sort((a, b)=>{
        const aIndex = order.indexOf(a);
        const bIndex = order.indexOf(b);
        if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
    });
    return keys.map((key)=>({
            type: key,
            exercises: grouped.get(key) || []
        }));
}
function SupersetSelector({ onSelect, onCancel }) {
    const [exercises, setExercises] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchQuery1, setSearchQuery1] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [searchQuery2, setSearchQuery2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [exercise1, setExercise1] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [exercise2, setExercise2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showCreateForm, setShowCreateForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [createTarget, setCreateTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchExercises();
    }, []);
    const fetchExercises = async ()=>{
        try {
            const response = await fetch('/api/exercises');
            const data = await response.json();
            setExercises(data.exercises);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        } finally{
            setLoading(false);
        }
    };
    const handleCreateExercise = async (exerciseData)=>{
        try {
            const response = await fetch('/api/exercises', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(exerciseData)
            });
            if (!response.ok) {
                throw new Error('Failed to create exercise');
            }
            const data = await response.json();
            await fetchExercises();
            const newExercise = {
                id: data.id,
                name: exerciseData.name,
                video_url: exerciseData.videoUrl || null,
                tips: exerciseData.tips || null,
                equipment: exerciseData.equipment || null,
                primary_metric: typeof data.primary_metric === 'string' ? data.primary_metric : null,
                metric_unit: typeof data.metric_unit === 'string' ? data.metric_unit : null
            };
            if (createTarget === 'exercise1') {
                setExercise1(newExercise);
                setSearchQuery1('');
            } else if (createTarget === 'exercise2') {
                setExercise2(newExercise);
                setSearchQuery2('');
            }
            setShowCreateForm(false);
            setCreateTarget(null);
        } catch (error) {
            console.error('Error creating exercise:', error);
            alert('Failed to create exercise. Please try again.');
        }
    };
    const filteredExercises1 = exercises.filter((exercise)=>{
        if (!searchQuery1) return true;
        const query = searchQuery1.toLowerCase();
        const tagText = getMuscleGroups(exercise).join(' ').toLowerCase();
        return exercise.name.toLowerCase().includes(query) || tagText.includes(query);
    });
    const filteredExercises2 = exercises.filter((exercise)=>{
        if (!searchQuery2) return true;
        const query = searchQuery2.toLowerCase();
        const tagText = getMuscleGroups(exercise).join(' ').toLowerCase();
        return exercise.name.toLowerCase().includes(query) || tagText.includes(query);
    });
    const groupedExercises1 = groupExercisesByType(filteredExercises1);
    const groupedExercises2 = groupExercisesByType(filteredExercises2);
    const handleConfirm = ()=>{
        if (exercise1 && exercise2) {
            onSelect(exercise1, exercise2);
        }
    };
    if (showCreateForm) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$QuickExerciseForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            onSubmit: handleCreateExercise,
            onCancel: ()=>{
                setShowCreateForm(false);
                setCreateTarget(null);
            }
        }, void 0, false, {
            fileName: "[project]/app/components/SupersetSelector.tsx",
            lineNumber: 153,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] flex flex-col border-2 border-purple-600",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold text-white mb-4",
                    children: "Create Superset"
                }, void 0, false, {
                    fileName: "[project]/app/components/SupersetSelector.tsx",
                    lineNumber: 166,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-zinc-400 text-sm mb-4",
                    children: "Select two exercises to pair together"
                }, void 0, false, {
                    fileName: "[project]/app/components/SupersetSelector.tsx",
                    lineNumber: 167,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-hidden flex gap-4 mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 flex flex-col min-h-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-purple-400 text-sm font-bold mb-2",
                                            children: "Exercise 1"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/SupersetSelector.tsx",
                                            lineNumber: 173,
                                            columnNumber: 15
                                        }, this),
                                        exercise1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-purple-900/30 border-2 border-purple-500 rounded-lg p-3 flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white font-semibold",
                                                    children: exercise1.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setExercise1(null),
                                                    className: "text-purple-300 hover:text-white text-sm",
                                                    children: "Change"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/SupersetSelector.tsx",
                                            lineNumber: 175,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: searchQuery1,
                                                    onChange: (e)=>setSearchQuery1(e.target.value),
                                                    placeholder: "Search exercises or muscle groups...",
                                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                                                    autoFocus: true
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        setCreateTarget('exercise1');
                                                        setShowCreateForm(true);
                                                    },
                                                    className: "w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors",
                                                    children: "+ Create New Exercise"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                                    lineNumber: 194,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/SupersetSelector.tsx",
                                            lineNumber: 185,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                    lineNumber: 172,
                                    columnNumber: 13
                                }, this),
                                !exercise1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 overflow-y-auto space-y-2",
                                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center text-zinc-400 py-4",
                                        children: "Loading..."
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/SupersetSelector.tsx",
                                        lineNumber: 210,
                                        columnNumber: 19
                                    }, this) : groupedExercises1.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center text-zinc-400 py-4",
                                        children: "No exercises found"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/SupersetSelector.tsx",
                                        lineNumber: 212,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: groupedExercises1.map(({ type, exercises: groupExercises })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-[10px] uppercase tracking-wide text-zinc-400",
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$muscle$2d$tags$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTypeLabel"])(type)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/SupersetSelector.tsx",
                                                        lineNumber: 217,
                                                        columnNumber: 25
                                                    }, this),
                                                    groupExercises.map((exercise)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setExercise1(exercise),
                                                            className: "w-full bg-zinc-900 hover:bg-zinc-700 text-left p-3 rounded-lg transition-colors border border-zinc-700 hover:border-purple-500",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-white text-sm font-semibold",
                                                                    children: exercise.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                                                    lineNumber: 226,
                                                                    columnNumber: 29
                                                                }, this),
                                                                exercise.equipment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-zinc-400 text-xs mt-1",
                                                                    children: exercise.equipment
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                                                    lineNumber: 228,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, exercise.id, true, {
                                                            fileName: "[project]/app/components/SupersetSelector.tsx",
                                                            lineNumber: 221,
                                                            columnNumber: 27
                                                        }, this))
                                                ]
                                            }, type, true, {
                                                fileName: "[project]/app/components/SupersetSelector.tsx",
                                                lineNumber: 216,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/SupersetSelector.tsx",
                                        lineNumber: 214,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                    lineNumber: 208,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/SupersetSelector.tsx",
                            lineNumber: 171,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-purple-400 text-2xl font-bold",
                                children: "+"
                            }, void 0, false, {
                                fileName: "[project]/app/components/SupersetSelector.tsx",
                                lineNumber: 242,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/SupersetSelector.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 flex flex-col min-h-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-purple-400 text-sm font-bold mb-2",
                                            children: "Exercise 2"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/SupersetSelector.tsx",
                                            lineNumber: 248,
                                            columnNumber: 15
                                        }, this),
                                        exercise2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-purple-900/30 border-2 border-purple-500 rounded-lg p-3 flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white font-semibold",
                                                    children: exercise2.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                                    lineNumber: 251,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setExercise2(null),
                                                    className: "text-purple-300 hover:text-white text-sm",
                                                    children: "Change"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                                    lineNumber: 252,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/SupersetSelector.tsx",
                                            lineNumber: 250,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: searchQuery2,
                                                    onChange: (e)=>setSearchQuery2(e.target.value),
                                                    placeholder: "Search exercises or muscle groups...",
                                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                                    lineNumber: 261,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        setCreateTarget('exercise2');
                                                        setShowCreateForm(true);
                                                    },
                                                    className: "w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors",
                                                    children: "+ Create New Exercise"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/SupersetSelector.tsx",
                                            lineNumber: 260,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                    lineNumber: 247,
                                    columnNumber: 13
                                }, this),
                                !exercise2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 overflow-y-auto space-y-2",
                                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center text-zinc-400 py-4",
                                        children: "Loading..."
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/SupersetSelector.tsx",
                                        lineNumber: 284,
                                        columnNumber: 19
                                    }, this) : groupedExercises2.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center text-zinc-400 py-4",
                                        children: "No exercises found"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/SupersetSelector.tsx",
                                        lineNumber: 286,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: groupedExercises2.map(({ type, exercises: groupExercises })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-[10px] uppercase tracking-wide text-zinc-400",
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$muscle$2d$tags$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTypeLabel"])(type)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/SupersetSelector.tsx",
                                                        lineNumber: 291,
                                                        columnNumber: 25
                                                    }, this),
                                                    groupExercises.map((exercise)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setExercise2(exercise),
                                                            className: "w-full bg-zinc-900 hover:bg-zinc-700 text-left p-3 rounded-lg transition-colors border border-zinc-700 hover:border-purple-500",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-white text-sm font-semibold",
                                                                    children: exercise.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                                                    lineNumber: 300,
                                                                    columnNumber: 29
                                                                }, this),
                                                                exercise.equipment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-zinc-400 text-xs mt-1",
                                                                    children: exercise.equipment
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                                                    lineNumber: 302,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, exercise.id, true, {
                                                            fileName: "[project]/app/components/SupersetSelector.tsx",
                                                            lineNumber: 295,
                                                            columnNumber: 27
                                                        }, this))
                                                ]
                                            }, type, true, {
                                                fileName: "[project]/app/components/SupersetSelector.tsx",
                                                lineNumber: 290,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/SupersetSelector.tsx",
                                        lineNumber: 288,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/SupersetSelector.tsx",
                                    lineNumber: 282,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/SupersetSelector.tsx",
                            lineNumber: 246,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/SupersetSelector.tsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onCancel,
                            className: "flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/app/components/SupersetSelector.tsx",
                            lineNumber: 317,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleConfirm,
                            disabled: !exercise1 || !exercise2,
                            className: "flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors",
                            children: "Add Superset"
                        }, void 0, false, {
                            fileName: "[project]/app/components/SupersetSelector.tsx",
                            lineNumber: 323,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/SupersetSelector.tsx",
                    lineNumber: 316,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/SupersetSelector.tsx",
            lineNumber: 165,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/SupersetSelector.tsx",
        lineNumber: 164,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/workout-media.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFormTips",
    ()=>getFormTips,
    "getVideoUrl",
    ()=>getVideoUrl
]);
const FALLBACK_FORM_TIPS = 'No form tips yet.';
function getFormTips(tips) {
    if (typeof tips !== 'string') {
        return FALLBACK_FORM_TIPS;
    }
    const trimmed = tips.trim();
    return trimmed.length > 0 ? trimmed : FALLBACK_FORM_TIPS;
}
function getVideoUrl(name, videoUrl) {
    if (typeof videoUrl === 'string' && videoUrl.trim().length > 0) {
        return videoUrl.trim();
    }
    const baseName = typeof name === 'string' && name.trim().length > 0 ? name.trim() : 'exercise';
    const query = `${baseName} form`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
}),
"[project]/lib/session-workout.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "acknowledgeChangeWarning",
    ()=>acknowledgeChangeWarning,
    "clearSessionTargetsMeta",
    ()=>clearSessionTargetsMeta,
    "clearSessionWorkout",
    ()=>clearSessionWorkout,
    "hasChangeWarningAck",
    ()=>hasChangeWarningAck,
    "loadSessionTargetsMeta",
    ()=>loadSessionTargetsMeta,
    "loadSessionWorkout",
    ()=>loadSessionWorkout,
    "saveSessionTargetsMeta",
    ()=>saveSessionTargetsMeta,
    "saveSessionWorkout",
    ()=>saveSessionWorkout
]);
const SESSION_PREFIX = 'session_workout_override';
const WARNING_PREFIX = 'session_workout_change_ack';
const TARGETS_META_PREFIX = 'session_workout_targets_meta';
function buildKey(prefix, workoutName, routineId) {
    const safeName = encodeURIComponent(workoutName);
    const safeRoutine = routineId ? encodeURIComponent(routineId) : 'default';
    return `${prefix}:${safeName}:${safeRoutine}`;
}
function loadSessionWorkout(workoutName, routineId) {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const key = undefined;
    const stored = undefined;
}
function saveSessionWorkout(plan, routineId) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const key = undefined;
}
function clearSessionWorkout(workoutName, routineId) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const key = undefined;
}
function loadSessionTargetsMeta(workoutName, routineId) {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const key = undefined;
    const stored = undefined;
}
function saveSessionTargetsMeta(workoutName, routineId, meta) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const key = undefined;
}
function clearSessionTargetsMeta(workoutName, routineId) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const key = undefined;
}
function hasChangeWarningAck(workoutName, routineId) {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
    const key = undefined;
}
function acknowledgeChangeWarning(workoutName, routineId) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const key = undefined;
}
}),
"[project]/app/components/WorkoutNavHeader.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorkoutNavHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
'use client';
;
;
;
function WorkoutNavHeader({ exitUrl, previousUrl, onPrevious, skipUrl, skipLabel = 'Skip', onSkip, nextLabel = 'Next', onNext }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const handlePrevious = ()=>{
        if (onPrevious) {
            // Use callback for internal navigation (within same page)
            onPrevious();
        } else if (previousUrl) {
            // Navigate to previous URL
            router.push(previousUrl);
        }
    };
    const handleSkip = ()=>{
        if (onSkip) {
            onSkip();
        } else if (skipUrl) {
            router.push(skipUrl);
        }
    };
    const canGoPrevious = !!previousUrl || !!onPrevious;
    const showSkip = skipUrl || onSkip;
    const showNext = !!onNext;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex justify-between items-center mb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: exitUrl,
                        className: "text-red-400 hover:text-red-300 font-medium",
                        children: "Exit"
                    }, void 0, false, {
                        fileName: "[project]/app/components/WorkoutNavHeader.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handlePrevious,
                        disabled: !canGoPrevious,
                        className: `font-medium ${canGoPrevious ? 'text-blue-400 hover:text-blue-300' : 'text-zinc-600 cursor-not-allowed'}`,
                        children: "← Previous"
                    }, void 0, false, {
                        fileName: "[project]/app/components/WorkoutNavHeader.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/WorkoutNavHeader.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            showNext ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onNext,
                className: "text-blue-400 hover:text-blue-300 font-medium",
                children: [
                    nextLabel,
                    " →"
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/WorkoutNavHeader.tsx",
                lineNumber: 81,
                columnNumber: 9
            }, this) : showSkip ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleSkip,
                className: "text-zinc-400 hover:text-zinc-300",
                children: [
                    skipLabel,
                    " →"
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/WorkoutNavHeader.tsx",
                lineNumber: 88,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/WorkoutNavHeader.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/units.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/lib/metric-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertPrimaryMetric",
    ()=>assertPrimaryMetric,
    "convertMetricFromStorage",
    ()=>convertMetricFromStorage,
    "convertMetricToStorage",
    ()=>convertMetricToStorage,
    "formatMetricDisplay",
    ()=>formatMetricDisplay,
    "formatMetricInputValue",
    ()=>formatMetricInputValue,
    "getDefaultMetricUnit",
    ()=>getDefaultMetricUnit,
    "getMetricLabel",
    ()=>getMetricLabel,
    "isPrimaryMetric",
    ()=>isPrimaryMetric,
    "isRepsOnlyMetric",
    ()=>isRepsOnlyMetric,
    "isWeightMetric",
    ()=>isWeightMetric,
    "parseMetricInput",
    ()=>parseMetricInput,
    "resolveMetricUnit",
    ()=>resolveMetricUnit,
    "resolvePrimaryMetric",
    ()=>resolvePrimaryMetric
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/units.ts [app-ssr] (ecmascript)");
;
;
function isPrimaryMetric(value) {
    return Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"]).includes(value);
}
function resolvePrimaryMetric(primaryMetric, isBodyweight) {
    if (isPrimaryMetric(primaryMetric)) return primaryMetric;
    if (isBodyweight) return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].repsOnly;
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight;
}
function resolveMetricUnit(primaryMetric, metricUnit, weightUnit, heightUnit) {
    switch(primaryMetric){
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight:
            return weightUnit;
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].height:
            return heightUnit;
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].time:
            return metricUnit || 'sec';
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].distance:
            return metricUnit || 'm';
        default:
            return null;
    }
}
function getDefaultMetricUnit(primaryMetric) {
    switch(primaryMetric){
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight:
            return 'lbs';
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].height:
            return 'in';
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].time:
            return 'sec';
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].distance:
            return 'm';
        default:
            return null;
    }
}
function assertPrimaryMetric(value) {
    if (!isPrimaryMetric(value)) {
        throw new Error('primaryMetric is required');
    }
}
function getMetricLabel(primaryMetric, metricUnit, weightUnit, heightUnit, isMachine) {
    const resolvedUnit = resolveMetricUnit(primaryMetric, metricUnit, weightUnit, heightUnit);
    switch(primaryMetric){
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight:
            return isMachine ? `Added Weight (${resolvedUnit})` : `Weight (${resolvedUnit})`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].height:
            return `Height (${resolvedUnit})`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].time:
            return `Time (${resolvedUnit})`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].distance:
            return `Distance (${resolvedUnit})`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].repsOnly:
            return 'Reps';
        default:
            return 'Value';
    }
}
function convertMetricFromStorage(value, primaryMetric, weightUnit, heightUnit) {
    if (!Number.isFinite(value)) return 0;
    if (primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["convertWeightFromStorage"])(value, weightUnit);
    }
    if (primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].height) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["convertHeightFromStorage"])(value, heightUnit);
    }
    return value;
}
function convertMetricToStorage(value, primaryMetric, weightUnit, heightUnit) {
    if (!Number.isFinite(value)) return 0;
    if (primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["convertWeightToStorage"])(value, weightUnit);
    }
    if (primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].height) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["convertHeightToStorage"])(value, heightUnit);
    }
    return value;
}
function formatMetricDisplay(value, primaryMetric, metricUnit, weightUnit, heightUnit, isMachine) {
    if (primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatWeightDisplay"])(value, weightUnit, isMachine);
    }
    const resolvedUnit = resolveMetricUnit(primaryMetric, metricUnit, weightUnit, heightUnit);
    const displayValue = convertMetricFromStorage(value, primaryMetric, weightUnit, heightUnit);
    return resolvedUnit ? `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDisplayNumber"])(displayValue)} ${resolvedUnit}` : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDisplayNumber"])(displayValue);
}
function formatMetricInputValue(value, primaryMetric, weightUnit, heightUnit, allowBlank = false) {
    if (allowBlank && value === 0) return '';
    const displayValue = convertMetricFromStorage(value, primaryMetric, weightUnit, heightUnit);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDisplayNumber"])(displayValue);
}
function parseMetricInput(value, primaryMetric, weightUnit, heightUnit) {
    if (value === '') return 0;
    const num = parseFloat(value);
    if (!Number.isFinite(num)) return null;
    return convertMetricToStorage(num, primaryMetric, weightUnit, heightUnit);
}
function isRepsOnlyMetric(primaryMetric) {
    return primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].repsOnly;
}
function isWeightMetric(primaryMetric) {
    return primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight;
}
}),
"[project]/app/components/ExerciseHistoryModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ExerciseHistoryModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/units.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/metric-utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const RANGE_LABELS = {
    week: '1W',
    month: '1M',
    all: 'All'
};
function formatDayLabel(day) {
    const date = new Date(`${day}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return day;
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}
function formatNumber(value) {
    const rounded = Math.round(value * 10) / 10;
    if (rounded >= 1000000) return `${(rounded / 1000000).toFixed(1)}M`;
    if (rounded >= 1000) return `${(rounded / 1000).toFixed(1)}k`;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1);
}
function buildLinePath(points) {
    if (points.length === 0) return '';
    return points.map((point, index)=>`${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}
function LineChart({ points, weightMode, mode, primaryMetric, metricUnit, targetValue, isMachine, weightUnit, heightUnit }) {
    const [tooltip, setTooltip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const width = 720;
    const height = 280;
    const margin = {
        top: 16,
        right: 64,
        bottom: 40,
        left: 64
    };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const isRepsPrimary = mode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].reps || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRepsOnlyMetric"])(primaryMetric);
    const isWeightPrimary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isWeightMetric"])(primaryMetric);
    const isMachineWeight = !!isMachine && isWeightPrimary;
    const resolvedUnit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveMetricUnit"])(primaryMetric, metricUnit, weightUnit, heightUnit);
    const secondaryUnit = resolvedUnit ?? weightUnit;
    const unitSuffix = resolvedUnit ? ` ${resolvedUnit}` : '';
    const convertPrimaryValue = (value)=>value === null ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["convertMetricFromStorage"])(value, primaryMetric, weightUnit, heightUnit);
    const useVolume = !isRepsPrimary && isWeightPrimary;
    const primaryValues = points.map((point)=>{
        if (isRepsPrimary) {
            return weightMode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_AGGREGATION_MODES"].max ? point.reps_max : point.reps_avg;
        }
        const rawValue = weightMode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_AGGREGATION_MODES"].max ? point.weight_max : point.weight_avg;
        return convertPrimaryValue(rawValue);
    }).filter((value)=>value !== null);
    const displayTargetValue = targetValue == null ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["convertMetricFromStorage"])(targetValue, primaryMetric, weightUnit, heightUnit);
    const hasTargetValue = displayTargetValue !== null && Number.isFinite(displayTargetValue) && displayTargetValue > 0;
    if (hasTargetValue) {
        primaryValues.push(displayTargetValue);
    }
    const secondaryValues = points.map((point)=>{
        if (isRepsPrimary || !useVolume) {
            return point.reps_total;
        }
        return convertPrimaryValue(point.volume);
    }).filter((value)=>value !== null);
    let primaryMin = primaryValues.length ? Math.min(...primaryValues) : 0;
    let primaryMax = primaryValues.length ? Math.max(...primaryValues) : 1;
    let secondaryMin = secondaryValues.length ? Math.min(...secondaryValues) : 0;
    let secondaryMax = secondaryValues.length ? Math.max(...secondaryValues) : 1;
    if (primaryMax === primaryMin) {
        const pad = Math.max(1, Math.abs(primaryMax) * 0.2);
        primaryMin -= pad;
        primaryMax += pad;
    }
    if (secondaryMax === secondaryMin) {
        const pad = Math.max(1, Math.abs(secondaryMax) * 0.2);
        secondaryMin -= pad;
        secondaryMax += pad;
    }
    if (isMachineWeight) {
        primaryMin = 0;
        if (primaryMax <= primaryMin) {
            primaryMax = primaryMin + 1;
        }
    }
    const primaryRange = primaryMax - primaryMin || 1;
    const secondaryRange = secondaryMax - secondaryMin || 1;
    const stepX = points.length > 1 ? plotWidth / (points.length - 1) : 0;
    const basePoints = points.map((point, index)=>{
        const primaryValue = isRepsPrimary ? weightMode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_AGGREGATION_MODES"].max ? point.reps_max : point.reps_avg : convertPrimaryValue(weightMode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_AGGREGATION_MODES"].max ? point.weight_max : point.weight_avg);
        const secondaryValue = isRepsPrimary || !useVolume ? point.reps_total : convertPrimaryValue(point.volume);
        const baseX = margin.left + index * stepX;
        const hasPrimary = primaryValue !== null;
        const hasSecondary = secondaryValue !== null;
        const offset = hasPrimary && hasSecondary ? 6 : 0;
        return {
            baseX,
            primaryValue,
            secondaryValue,
            primaryX: baseX - offset,
            secondaryX: baseX + offset
        };
    });
    const primaryPoints = basePoints.map((point)=>{
        if (point.primaryValue === null) return null;
        const y = margin.top + plotHeight - (point.primaryValue - primaryMin) / primaryRange * plotHeight;
        return {
            x: point.primaryX,
            y,
            value: point.primaryValue
        };
    }).filter((point)=>point !== null);
    const secondaryPoints = basePoints.map((point)=>{
        if (point.secondaryValue === null) return null;
        const y = margin.top + plotHeight - (point.secondaryValue - secondaryMin) / secondaryRange * plotHeight;
        return {
            x: point.secondaryX,
            y,
            value: point.secondaryValue
        };
    }).filter((point)=>point !== null);
    const primaryPath = buildLinePath(primaryPoints.map(({ x, y })=>({
            x,
            y
        })));
    const secondaryPath = buildLinePath(secondaryPoints.map(({ x, y })=>({
            x,
            y
        })));
    const primaryLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMetricLabel"])(primaryMetric, metricUnit, weightUnit, heightUnit, isMachineWeight);
    const secondaryLabel = isRepsPrimary ? 'Total Reps' : useVolume ? `Volume (${secondaryUnit})` : 'Total Reps';
    const formatPrimaryValue = (value)=>{
        if (isRepsPrimary) return formatNumber(value);
        if (!isMachineWeight) return `${formatNumber(value)}${unitSuffix}`;
        return value === 0 ? 'Machine' : `+${formatNumber(value)}${unitSuffix}`;
    };
    const formatSecondaryValue = (value)=>isRepsPrimary || !useVolume ? formatNumber(value) : `${formatNumber(value)}${unitSuffix}`;
    const labelIndexes = points.length <= 1 ? [
        0
    ] : [
        0,
        Math.floor((points.length - 1) / 2),
        points.length - 1
    ];
    const labelIndexesUnique = Array.from(new Set(labelIndexes)).filter((idx)=>points[idx]);
    const tooltipLabel = tooltip?.label || '';
    const tooltipWidth = Math.min(width - 16, Math.max(56, tooltipLabel.length * 7 + 18));
    const tooltipHeight = 24;
    const tooltipX = tooltip ? Math.min(Math.max(tooltip.x + 10, 8), width - tooltipWidth - 8) : 0;
    const tooltipY = tooltip ? Math.max(8, tooltip.y - tooltipHeight - 10) : 0;
    const targetY = hasTargetValue ? margin.top + plotHeight - (displayTargetValue - primaryMin) / primaryRange * plotHeight : null;
    const targetLabel = hasTargetValue ? isMachineWeight ? `Target +${formatNumber(displayTargetValue)}${unitSuffix}` : `Target ${formatNumber(displayTargetValue)}${unitSuffix}` : '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full overflow-x-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: `0 0 ${width} ${height}`,
            className: "w-full min-w-[520px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    rx: 16,
                    fill: "#0f172a"
                }, void 0, false, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 248,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    stroke: "#1f2937",
                    strokeWidth: 1,
                    children: [
                        0,
                        0.5,
                        1
                    ].map((ratio)=>{
                        const y = margin.top + plotHeight - ratio * plotHeight;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: margin.left,
                            y1: y,
                            x2: width - margin.right,
                            y2: y
                        }, ratio, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 253,
                            columnNumber: 20
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 250,
                    columnNumber: 9
                }, this),
                hasTargetValue && targetY !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: margin.left,
                            y1: targetY,
                            x2: width - margin.right,
                            y2: targetY,
                            stroke: "#f59e0b",
                            strokeWidth: 2,
                            strokeDasharray: "6 6"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 259,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: width - margin.right - 6,
                            y: Math.max(margin.top + 12, targetY - 6),
                            fill: "#f59e0b",
                            fontSize: "12",
                            textAnchor: "end",
                            children: targetLabel
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 268,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    fill: "#94a3b8",
                    fontSize: "12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: margin.left - 12,
                            y: margin.top + 10,
                            textAnchor: "end",
                            children: formatPrimaryValue(primaryMax)
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 281,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: margin.left - 12,
                            y: margin.top + plotHeight,
                            textAnchor: "end",
                            children: formatPrimaryValue(primaryMin)
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 284,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: width - margin.right + 12,
                            y: margin.top + 10,
                            textAnchor: "start",
                            children: formatNumber(secondaryMax)
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 287,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: width - margin.right + 12,
                            y: margin.top + plotHeight,
                            textAnchor: "start",
                            children: formatNumber(secondaryMin)
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 290,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 280,
                    columnNumber: 9
                }, this),
                primaryPath && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: primaryPath,
                    fill: "none",
                    stroke: "#38bdf8",
                    strokeWidth: 3
                }, void 0, false, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 296,
                    columnNumber: 11
                }, this),
                secondaryPath && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: secondaryPath,
                    fill: "none",
                    stroke: "#22c55e",
                    strokeWidth: 3
                }, void 0, false, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 299,
                    columnNumber: 11
                }, this),
                tooltip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                            x: tooltipX,
                            y: tooltipY,
                            width: tooltipWidth,
                            height: tooltipHeight,
                            rx: 6,
                            fill: "#111827",
                            stroke: "#374151",
                            strokeWidth: 1
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 304,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: tooltipX + 9,
                            y: tooltipY + 16,
                            fill: "#e2e8f0",
                            fontSize: "12",
                            children: tooltipLabel
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 314,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 303,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    fill: "#e2e8f0",
                    children: [
                        primaryPoints.map((point, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: point.x,
                                cy: point.y,
                                r: 4,
                                fill: "#38bdf8",
                                onMouseEnter: ()=>setTooltip({
                                        x: point.x,
                                        y: point.y,
                                        label: `${primaryLabel}: ${formatPrimaryValue(point.value)}`
                                    }),
                                onMouseMove: ()=>setTooltip({
                                        x: point.x,
                                        y: point.y,
                                        label: `${primaryLabel}: ${formatPrimaryValue(point.value)}`
                                    }),
                                onMouseLeave: ()=>setTooltip(null)
                            }, `w-${index}`, false, {
                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                lineNumber: 327,
                                columnNumber: 13
                            }, this)),
                        secondaryPoints.map((point, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: point.x,
                                cy: point.y,
                                r: 4,
                                fill: "#22c55e",
                                onMouseEnter: ()=>setTooltip({
                                        x: point.x,
                                        y: point.y,
                                        label: `${secondaryLabel}: ${formatSecondaryValue(point.value)}`
                                    }),
                                onMouseMove: ()=>setTooltip({
                                        x: point.x,
                                        y: point.y,
                                        label: `${secondaryLabel}: ${formatSecondaryValue(point.value)}`
                                    }),
                                onMouseLeave: ()=>setTooltip(null)
                            }, `v-${index}`, false, {
                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                lineNumber: 339,
                                columnNumber: 13
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 325,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    fill: "#94a3b8",
                    fontSize: "12",
                    children: labelIndexesUnique.map((index)=>{
                        const x = margin.left + index * stepX;
                        const label = formatDayLabel(points[index].day);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: x,
                            y: height - 12,
                            textAnchor: "middle",
                            children: label
                        }, index, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 357,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 352,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    fill: "#94a3b8",
                    fontSize: "12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: margin.left,
                            y: height - 4,
                            textAnchor: "start",
                            children: primaryLabel
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 365,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: width - margin.right,
                            y: height - 4,
                            textAnchor: "end",
                            children: secondaryLabel
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 368,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 364,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
            lineNumber: 247,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
        lineNumber: 246,
        columnNumber: 5
    }, this);
}
function LoadingCard({ name }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-800 rounded-xl p-4 border border-zinc-700 animate-pulse",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-5 w-40 bg-zinc-700 rounded mb-4"
            }, void 0, false, {
                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                lineNumber: 380,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-40 bg-zinc-900 rounded-lg border border-zinc-700"
            }, void 0, false, {
                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                lineNumber: 381,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 flex justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-3 w-16 bg-zinc-700 rounded"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                        lineNumber: 383,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-3 w-16 bg-zinc-700 rounded"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                        lineNumber: 384,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                lineNumber: 382,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 text-xs text-zinc-500",
                children: [
                    "Loading ",
                    name,
                    "..."
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                lineNumber: 386,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
        lineNumber: 379,
        columnNumber: 5
    }, this);
}
function ExerciseHistoryModal({ open, onClose, exerciseNames, title = 'Exercise History', targets, weightUnit, heightUnit }) {
    const resolvedWeightUnit = weightUnit ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_WEIGHT_UNIT"];
    const resolvedHeightUnit = heightUnit ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HEIGHT_UNIT"];
    const [range, setRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('month');
    const [weightMode, setWeightMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_AGGREGATION_MODES"].max);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const namesKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>exerciseNames.join('|'), [
        exerciseNames
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) return;
        const controller = new AbortController();
        const fetchHistory = async ()=>{
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({
                    range
                });
                exerciseNames.forEach((name)=>params.append('name', name));
                const response = await fetch(`/api/exercise-history?${params.toString()}`, {
                    signal: controller.signal
                });
                if (!response.ok) {
                    throw new Error('Failed to load exercise history');
                }
                const data = await response.json();
                setHistory(data.history || {});
            } catch (err) {
                if (err?.name === 'AbortError') return;
                setError(err?.message || 'Failed to load history');
            } finally{
                setLoading(false);
            }
        };
        fetchHistory();
        return ()=>controller.abort();
    }, [
        open,
        range,
        namesKey,
        exerciseNames
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) return;
        const handleKeyDown = (event)=>{
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return ()=>window.removeEventListener('keydown', handleKeyDown);
    }, [
        open,
        onClose
    ]);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-900 border border-zinc-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto",
            onClick: (event)=>event.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 border-b border-zinc-800 flex items-start justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-2xl font-bold text-white",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                    lineNumber: 464,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-400 text-sm",
                                    children: "Primary metric trends"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                    lineNumber: 465,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 463,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg",
                            children: "Close"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 467,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 462,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap items-center justify-between gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        'week',
                                        'month',
                                        'all'
                                    ].map((value)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setRange(value),
                                            className: `px-3 py-2 rounded-lg text-sm font-semibold border ${range === value ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'}`,
                                            children: RANGE_LABELS[value]
                                        }, value, false, {
                                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                            lineNumber: 479,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                    lineNumber: 477,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_AGGREGATION_MODES"]).map((value)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setWeightMode(value),
                                            className: `px-3 py-2 rounded-lg text-sm font-semibold border ${weightMode === value ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'}`,
                                            children: value === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_AGGREGATION_MODES"].max ? 'Max' : 'Avg'
                                        }, value, false, {
                                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                            lineNumber: 494,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                    lineNumber: 492,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 476,
                            columnNumber: 11
                        }, this),
                        loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm",
                            children: "Loading history..."
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 510,
                            columnNumber: 13
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-red-400 text-sm",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 513,
                            columnNumber: 13
                        }, this),
                        !loading && !error && exerciseNames.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-500 text-sm",
                            children: "No exercise selected."
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 517,
                            columnNumber: 13
                        }, this),
                        loading && exerciseNames.map((name)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingCard, {
                                name: name
                            }, `loading-${name}`, false, {
                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                lineNumber: 521,
                                columnNumber: 13
                            }, this)),
                        !loading && !error && exerciseNames.map((name)=>{
                            const series = history[name];
                            const points = series?.points || [];
                            const explicitMode = series?.display_mode;
                            const mode = explicitMode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].reps ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].reps : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].weight;
                            const primaryMetric = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolvePrimaryMetric"])(series?.primary_metric, mode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].reps);
                            const metricUnit = typeof series?.metric_unit === 'string' ? series.metric_unit : null;
                            const isMachine = !!series?.is_machine && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isWeightMetric"])(primaryMetric);
                            const primaryLegendLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMetricLabel"])(primaryMetric, metricUnit, resolvedWeightUnit, resolvedHeightUnit, isMachine);
                            const targetEntry = targets?.[name];
                            const rawTargetValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRepsOnlyMetric"])(primaryMetric) || mode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].reps ? targetEntry?.reps : targetEntry?.weight;
                            const targetValue = Number.isFinite(rawTargetValue) && rawTargetValue > 0 ? rawTargetValue : null;
                            const resolvedUnit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveMetricUnit"])(primaryMetric, metricUnit, resolvedWeightUnit, resolvedHeightUnit);
                            const secondaryLegendLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRepsOnlyMetric"])(primaryMetric) || mode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].reps ? 'Total Reps' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isWeightMetric"])(primaryMetric) ? `Volume (${resolvedUnit ?? resolvedWeightUnit})` : 'Total Reps';
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-zinc-800 rounded-xl p-4 border border-zinc-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center justify-between mb-4 gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-white text-lg font-semibold",
                                                children: name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                                lineNumber: 551,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 text-xs text-zinc-400",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "h-2 w-2 rounded-full bg-sky-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                                                lineNumber: 554,
                                                                columnNumber: 23
                                                            }, this),
                                                            primaryLegendLabel
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                                        lineNumber: 553,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "h-2 w-2 rounded-full bg-green-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                                                lineNumber: 558,
                                                                columnNumber: 23
                                                            }, this),
                                                            secondaryLegendLabel
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                                        lineNumber: 557,
                                                        columnNumber: 21
                                                    }, this),
                                                    targetValue !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "h-[2px] w-4 border-t border-dashed border-amber-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                                                lineNumber: 563,
                                                                columnNumber: 25
                                                            }, this),
                                                            "Target"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                                        lineNumber: 562,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                                lineNumber: 552,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                        lineNumber: 550,
                                        columnNumber: 17
                                    }, this),
                                    points.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-400",
                                        children: "No history yet. Finish a workout with this exercise to populate the graph."
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                        lineNumber: 570,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LineChart, {
                                        points: points,
                                        weightMode: weightMode,
                                        mode: mode,
                                        primaryMetric: primaryMetric,
                                        metricUnit: metricUnit,
                                        targetValue: targetValue,
                                        isMachine: isMachine,
                                        weightUnit: resolvedWeightUnit,
                                        heightUnit: resolvedHeightUnit
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                        lineNumber: 574,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, name, true, {
                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                lineNumber: 549,
                                columnNumber: 15
                            }, this);
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 475,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
            lineNumber: 458,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
        lineNumber: 454,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/components/AutosaveBadge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AutosaveBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function AutosaveBadge({ className = '' }) {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        status: 'idle'
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handler = (event)=>{
            const detail = event.detail;
            if (!detail) return;
            setState({
                ...detail
            });
        };
        window.addEventListener('workout-autosave', handler);
        return ()=>window.removeEventListener('workout-autosave', handler);
    }, []);
    const timeLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!state.at) return '';
        return new Date(state.at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    }, [
        state.at
    ]);
    const { label, badgeClass } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        switch(state.status){
            case 'saving':
                return {
                    label: 'Autosave: saving…',
                    badgeClass: 'text-amber-300 border-amber-500/40'
                };
            case 'success':
                return {
                    label: `Autosave: saved ${timeLabel}`,
                    badgeClass: 'text-emerald-300 border-emerald-500/40'
                };
            case 'error':
                return {
                    label: `Autosave: failed ${timeLabel}`,
                    badgeClass: 'text-red-300 border-red-500/40'
                };
            default:
                return {
                    label: 'Autosave: idle',
                    badgeClass: 'text-zinc-400 border-zinc-600/40'
                };
        }
    }, [
        state.status,
        timeLabel
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass} ${className}`,
        "aria-live": "polite",
        children: label
    }, void 0, false, {
        fileName: "[project]/app/components/AutosaveBadge.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/workout/[name]/active/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ActiveWorkoutPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-session.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$autosave$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-autosave.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExerciseSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ExerciseSelector.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SupersetSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/SupersetSelector.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-media.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-workout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$WorkoutNavHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/WorkoutNavHeader.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExerciseHistoryModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ExerciseHistoryModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$AutosaveBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/AutosaveBadge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/units.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/metric-utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function normalizeDateString(value) {
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(value)) {
        return `${value.replace(' ', 'T')}Z`;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return `${value}T00:00:00Z`;
    }
    return value;
}
function formatLocalDate(value) {
    if (!value) return 'Unknown date';
    const date = new Date(normalizeDateString(value));
    if (Number.isNaN(date.getTime())) return 'Unknown date';
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
function resolveHasWarmup(exercise) {
    const primaryMetric = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolvePrimaryMetric"])(exercise.primaryMetric, exercise.isBodyweight);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isWeightMetric"])(primaryMetric)) {
        return false;
    }
    if (typeof exercise.hasWarmup === 'boolean') {
        return exercise.hasWarmup;
    }
    if (exercise.isBodyweight) {
        return false;
    }
    return true;
}
function ActiveWorkoutContent() {
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [workout, setWorkout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [currentExerciseIndex, setCurrentExerciseIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [initialIndexSet, setInitialIndexSet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentSetIndex, setCurrentSetIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isResting, setIsResting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [restTimeRemaining, setRestTimeRemaining] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [restTimeSeconds, setRestTimeSeconds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(60);
    const [supersetRestSeconds, setSupersetRestSeconds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(15);
    const [weightUnit, setWeightUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_WEIGHT_UNIT"]);
    const [heightUnit, setHeightUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_HEIGHT_UNIT"]);
    // Single exercise state
    const [setData, setSetData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        weight: 0,
        reps: 0
    });
    const [completedSets, setCompletedSets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [warmupCompleted, setWarmupCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [warmupDecision, setWarmupDecision] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('pending');
    const [machineOnly, setMachineOnly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [machineOnlyHoldWeight, setMachineOnlyHoldWeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    // B2B/Superset state
    const [currentExerciseInPair, setCurrentExerciseInPair] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0); // 0 or 1
    const [setData1, setSetData1] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        weight: 0,
        reps: 0
    });
    const [setData2, setSetData2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        weight: 0,
        reps: 0
    });
    const [completedPairs, setCompletedPairs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [machineOnly1, setMachineOnly1] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [machineOnly2, setMachineOnly2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [machineOnlyHoldWeight1, setMachineOnlyHoldWeight1] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [machineOnlyHoldWeight2, setMachineOnlyHoldWeight2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isTransitioning, setIsTransitioning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [transitionTimeRemaining, setTransitionTimeRemaining] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(60);
    const [showExitConfirm, setShowExitConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showExerciseTypePicker, setShowExerciseTypePicker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showExerciseSelector, setShowExerciseSelector] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSupersetSelector, setShowSupersetSelector] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [exerciseActionMode, setExerciseActionMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showChangeWarning, setShowChangeWarning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const pendingChangeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const getMetricInfo = (exercise)=>({
            primaryMetric: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolvePrimaryMetric"])(exercise.primaryMetric, exercise.isBodyweight),
            metricUnit: exercise.metricUnit ?? null
        });
    const isExerciseWeightMetric = (exercise)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isWeightMetric"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolvePrimaryMetric"])(exercise.primaryMetric, exercise.isBodyweight));
    const formatMetric = (value, metricInfo, isMachine)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatMetricDisplay"])(value, metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine);
    const getMetricLabelText = (metricInfo, isMachine)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMetricLabel"])(metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine);
    const parseMetricValueInput = (value, metricInfo)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseMetricInput"])(value, metricInfo.primaryMetric, weightUnit, heightUnit);
    const formatMetricValueInput = (value, metricInfo, allowBlank = false)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatMetricInputValue"])(value, metricInfo.primaryMetric, weightUnit, heightUnit, allowBlank);
    const historyTargets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!workout) return {};
        const next = {};
        for (const exercise of workout.exercises){
            if (exercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single) {
                next[exercise.name] = {
                    weight: exercise.targetWeight,
                    reps: exercise.targetReps
                };
            } else {
                const [ex1, ex2] = exercise.exercises;
                next[ex1.name] = {
                    weight: ex1.targetWeight,
                    reps: ex1.targetReps
                };
                next[ex2.name] = {
                    weight: ex2.targetWeight,
                    reps: ex2.targetReps
                };
            }
        }
        return next;
    }, [
        workout
    ]);
    const [showHistory, setShowHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [historyExerciseNames, setHistoryExerciseNames] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // Last exercise log from database
    const [lastExerciseLog, setLastExerciseLog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastPartnerExerciseLog, setLastPartnerExerciseLog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [completedExercisesCache, setCompletedExercisesCache] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [viewingExerciseIndex, setViewingExerciseIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0); // Which exercise we're viewing (can be past/current)
    const initSingleExerciseState = (exercise)=>{
        const hasWarmup = resolveHasWarmup(exercise);
        const defaultMachineOnly = !!exercise.isMachine && isExerciseWeightMetric(exercise) && exercise.targetWeight <= 0;
        setWarmupCompleted(false);
        setMachineOnly(defaultMachineOnly);
        setMachineOnlyHoldWeight(exercise.targetWeight);
        if (!hasWarmup) {
            setWarmupDecision('skip');
            setCurrentSetIndex(1);
            setSetData({
                weight: defaultMachineOnly ? 0 : exercise.targetWeight,
                reps: exercise.targetReps
            });
            return;
        }
        setWarmupDecision('pending');
        setCurrentSetIndex(1);
        setSetData({
            weight: defaultMachineOnly ? 0 : exercise.targetWeight,
            reps: exercise.targetReps
        });
    };
    // Get routineId from URL params (for public/favorited routines)
    const routineIdParam = searchParams.get('routineId');
    const routineQueryParams = new URLSearchParams();
    if (routineIdParam) routineQueryParams.set('routineId', routineIdParam);
    const routineQuery = routineQueryParams.toString() ? `?${routineQueryParams.toString()}` : '';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function fetchWorkout() {
            try {
                let apiUrl = `/api/workout/${params.name}`;
                if (routineIdParam) {
                    apiUrl += `?routineId=${routineIdParam}`;
                }
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Workout not found');
                }
                const data = await response.json();
                const baseWorkout = data.workout;
                const sessionWorkout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadSessionWorkout"])(baseWorkout.name, routineIdParam);
                const resolvedWorkout = sessionWorkout || baseWorkout;
                setWorkout(resolvedWorkout);
                // Check for index in URL (for navigation from other sections)
                const indexParam = searchParams.get('index');
                let startIndex = 0;
                if (indexParam && !initialIndexSet) {
                    const idx = parseInt(indexParam, 10);
                    if (!isNaN(idx) && idx >= 0 && idx < resolvedWorkout.exercises.length) {
                        startIndex = idx;
                        setCurrentExerciseIndex(idx);
                        setViewingExerciseIndex(idx);
                    }
                    setInitialIndexSet(true);
                }
                // Initialize exercise at startIndex
                const exercise = resolvedWorkout.exercises[startIndex];
                if (exercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single) {
                    initSingleExerciseState(exercise);
                } else {
                    // B2B exercise - no warmups, start at set 1
                    const b2bEx = exercise;
                    const defaultMachineOnly1 = !!b2bEx.exercises[0].isMachine && isExerciseWeightMetric(b2bEx.exercises[0]) && b2bEx.exercises[0].targetWeight <= 0;
                    const defaultMachineOnly2 = !!b2bEx.exercises[1].isMachine && isExerciseWeightMetric(b2bEx.exercises[1]) && b2bEx.exercises[1].targetWeight <= 0;
                    setSetData1({
                        weight: defaultMachineOnly1 ? 0 : b2bEx.exercises[0].targetWeight,
                        reps: b2bEx.exercises[0].targetReps
                    });
                    setSetData2({
                        weight: defaultMachineOnly2 ? 0 : b2bEx.exercises[1].targetWeight,
                        reps: b2bEx.exercises[1].targetReps
                    });
                    setMachineOnly1(defaultMachineOnly1);
                    setMachineOnly2(defaultMachineOnly2);
                    setMachineOnlyHoldWeight1(b2bEx.exercises[0].targetWeight);
                    setMachineOnlyHoldWeight2(b2bEx.exercises[1].targetWeight);
                    setCurrentSetIndex(1);
                    setCurrentExerciseInPair(0); // Start with first exercise
                    setWarmupDecision('skip');
                    setWarmupCompleted(false);
                }
            } catch (error) {
                console.error('Error fetching workout:', error);
            } finally{
                setLoading(false);
            }
        }
        fetchWorkout();
    }, [
        params.name,
        searchParams,
        routineIdParam,
        initialIndexSet
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let isMounted = true;
        async function fetchUserSettings() {
            try {
                const response = await fetch('/api/user/settings');
                if (!response.ok) return;
                const data = await response.json();
                if (!isMounted) return;
                const restSeconds = Number(data?.restTimeSeconds);
                const supersetSeconds = Number(data?.supersetRestSeconds);
                setRestTimeSeconds(Number.isFinite(restSeconds) ? restSeconds : 60);
                setSupersetRestSeconds(Number.isFinite(supersetSeconds) ? supersetSeconds : 15);
                setWeightUnit((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWeightUnit"])(data?.weightUnit));
                setHeightUnit((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeHeightUnit"])(data?.heightUnit));
            } catch (error) {
                console.error('Error fetching user settings:', error);
            }
        }
        fetchUserSettings();
        return ()=>{
            isMounted = false;
        };
    }, []);
    // Rest timer countdown
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isResting) return;
        if (restTimeRemaining > 0) {
            const timer = setTimeout(()=>{
                setRestTimeRemaining(restTimeRemaining - 1);
            }, 1000);
            return ()=>clearTimeout(timer);
        }
        // Rest complete: vibrate and auto-advance to next set
        if ('vibrate' in navigator) {
            navigator.vibrate(500);
        }
        setIsResting(false);
    }, [
        isResting,
        restTimeRemaining
    ]);
    // Transition timer countdown
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isTransitioning && transitionTimeRemaining > 0) {
            const timer = setTimeout(()=>{
                setTransitionTimeRemaining(transitionTimeRemaining - 1);
            }, 1000);
            return ()=>clearTimeout(timer);
        } else if (isTransitioning && transitionTimeRemaining === 0 && workout) {
            // Transition complete - move to next exercise
            const nextExerciseIndex = currentExerciseIndex + 1;
            setIsTransitioning(false);
            setCurrentExerciseIndex(nextExerciseIndex);
            setViewingExerciseIndex(nextExerciseIndex); // Keep viewing in sync with active exercise
            setCompletedSets([]);
            // Initialize next exercise
            const nextExercise = workout.exercises[nextExerciseIndex];
            if (nextExercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single) {
                initSingleExerciseState(nextExercise);
            } else {
                // B2B exercise - no warmups, start at set 1
                const b2bEx = nextExercise;
                const defaultMachineOnly1 = !!b2bEx.exercises[0].isMachine && isExerciseWeightMetric(b2bEx.exercises[0]) && b2bEx.exercises[0].targetWeight <= 0;
                const defaultMachineOnly2 = !!b2bEx.exercises[1].isMachine && isExerciseWeightMetric(b2bEx.exercises[1]) && b2bEx.exercises[1].targetWeight <= 0;
                setSetData1({
                    weight: defaultMachineOnly1 ? 0 : b2bEx.exercises[0].targetWeight,
                    reps: b2bEx.exercises[0].targetReps
                });
                setSetData2({
                    weight: defaultMachineOnly2 ? 0 : b2bEx.exercises[1].targetWeight,
                    reps: b2bEx.exercises[1].targetReps
                });
                setMachineOnly1(defaultMachineOnly1);
                setMachineOnly2(defaultMachineOnly2);
                setMachineOnlyHoldWeight1(b2bEx.exercises[0].targetWeight);
                setMachineOnlyHoldWeight2(b2bEx.exercises[1].targetWeight);
                setCurrentSetIndex(1);
                setCurrentExerciseInPair(0);
                setCompletedPairs([]);
                setWarmupDecision('skip');
                setWarmupCompleted(false);
            }
        }
    }, [
        isTransitioning,
        transitionTimeRemaining,
        workout,
        currentExerciseIndex
    ]);
    // Fetch last exercise log(s) from database when exercise changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function fetchLastExerciseLog() {
            if (!workout) return;
            const currentExercise = workout.exercises[currentExerciseIndex];
            const fetchLog = async (exerciseName)=>{
                try {
                    const response = await fetch(`/api/last-exercise?exerciseName=${encodeURIComponent(exerciseName)}`);
                    if (!response.ok) return null;
                    const data = await response.json();
                    return data.lastLog;
                } catch (error) {
                    console.error('Error fetching last exercise log:', error);
                    return null;
                }
            };
            if (currentExercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single) {
                const log = await fetchLog(currentExercise.name);
                setLastExerciseLog(log);
                setLastPartnerExerciseLog(null);
            } else {
                const b2bExercise = currentExercise;
                const [log1, log2] = await Promise.all([
                    fetchLog(b2bExercise.exercises[0].name),
                    fetchLog(b2bExercise.exercises[1].name)
                ]);
                setLastExerciseLog(log1);
                setLastPartnerExerciseLog(log2);
            }
        }
        fetchLastExerciseLog();
    }, [
        workout,
        currentExerciseIndex
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white text-2xl",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 440,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 439,
            columnNumber: 7
        }, this);
    }
    if (!workout) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-white text-2xl mb-4",
                        children: "Workout not found"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 449,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/routines",
                        className: "text-blue-400 hover:text-blue-300",
                        children: "Back to routines"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 450,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 448,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 447,
            columnNumber: 7
        }, this);
    }
    const currentExercise = workout.exercises[currentExerciseIndex];
    // Review mode: determine if viewing a previous exercise
    const isReviewMode = viewingExerciseIndex < currentExerciseIndex;
    const viewingExercise = workout.exercises[viewingExerciseIndex];
    const viewingCachedData = completedExercisesCache.find((cache)=>cache.exerciseIndex === viewingExerciseIndex);
    const lastExerciseDate = lastExerciseLog?.completed_at || lastExerciseLog?.created_at;
    const lastPartnerExerciseDate = lastPartnerExerciseLog?.completed_at || lastPartnerExerciseLog?.created_at;
    // Calculate total workout items for progress
    const totalItems = workout.preWorkoutStretches.length + workout.exercises.length + (workout.cardio ? 1 : 0) + workout.postWorkoutStretches.length;
    const currentProgress = workout.preWorkoutStretches.length + currentExerciseIndex + 1;
    const progressPercentage = currentProgress / totalItems * 100;
    // B2B Exercise Handlers
    const handleCompleteB2BExercise = ()=>{
        const b2bExercise = currentExercise;
        const b2bRestSeconds = Math.max(0, supersetRestSeconds);
        if (currentExerciseInPair === 0) {
            // Just completed first exercise, immediately move to second
            setCurrentExerciseInPair(1);
        } else {
            // Completed both exercises in the pair
            const newCompletedPairs = [
                ...completedPairs,
                {
                    ex1: setData1,
                    ex2: setData2
                }
            ];
            const totalSets = b2bExercise.exercises[0].sets;
            console.log('B2B Completion Check:', {
                newCompletedPairsLength: newCompletedPairs.length,
                totalSets,
                shouldContinue: newCompletedPairs.length < totalSets
            });
            // Guard: Don't allow completing more sets than total
            if (newCompletedPairs.length > totalSets) {
                console.log('Already completed all sets, ignoring duplicate click');
                return;
            }
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$autosave$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["autosaveWorkout"])({
                type: 'b2b_set',
                exerciseName: b2bExercise.exercises[0].name,
                partnerName: b2bExercise.exercises[1].name,
                setIndex: currentSetIndex,
                weight: setData1.weight,
                reps: setData1.reps,
                partnerWeight: setData2.weight,
                partnerReps: setData2.reps
            });
            setCompletedPairs(newCompletedPairs);
            if (newCompletedPairs.length < totalSets) {
                // More sets to go - rest briefly before next set
                setCurrentSetIndex(currentSetIndex + 1);
                setCurrentExerciseInPair(0); // Reset to first exercise for next round
                if (b2bRestSeconds > 0) {
                    setIsResting(true);
                    setRestTimeRemaining(b2bRestSeconds);
                } else {
                    setIsResting(false);
                    setRestTimeRemaining(0);
                }
            } else {
                // All sets complete - save to session and show transition to next exercise
                console.log('Finishing B2B exercise');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addExerciseToSession"])({
                    name: b2bExercise.exercises[0].name,
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].b2b,
                    isMachine: b2bExercise.exercises[0].isMachine,
                    primaryMetric: b2bExercise.exercises[0].primaryMetric,
                    metricUnit: b2bExercise.exercises[0].metricUnit ?? null,
                    sets: newCompletedPairs.map((pair)=>pair.ex1),
                    b2bPartner: {
                        name: b2bExercise.exercises[1].name,
                        isMachine: b2bExercise.exercises[1].isMachine,
                        primaryMetric: b2bExercise.exercises[1].primaryMetric,
                        metricUnit: b2bExercise.exercises[1].metricUnit ?? null,
                        sets: newCompletedPairs.map((pair)=>pair.ex2)
                    }
                });
                // Cache completed B2B exercise for review
                setCompletedExercisesCache([
                    ...completedExercisesCache,
                    {
                        exerciseIndex: currentExerciseIndex,
                        exerciseName: b2bExercise.exercises[0].name,
                        type: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].b2b,
                        completedPairs: newCompletedPairs
                    }
                ]);
                if (currentExerciseIndex < workout.exercises.length - 1) {
                    setIsResting(false);
                    setIsTransitioning(true);
                    setTransitionTimeRemaining(60);
                } else {
                    // All exercises done - always go to cardio (optional)
                    router.push(`/workout/${encodeURIComponent(workout.name)}/cardio${routineQuery}`);
                }
            }
        }
    };
    // Single Exercise Handlers
    const handleCompleteSet = ()=>{
        const newCompletedSets = [
            ...completedSets,
            setData
        ];
        setCompletedSets(newCompletedSets);
        const exercise = currentExercise;
        const hasWarmup = resolveHasWarmup(exercise);
        const restSeconds = Math.max(0, restTimeSeconds);
        const isWarmupSet = hasWarmup && warmupDecision === 'include' && currentSetIndex === 0;
        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$autosave$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["autosaveWorkout"])({
            type: 'single_set',
            exerciseName: exercise.name,
            setIndex: currentSetIndex,
            weight: setData.weight,
            reps: setData.reps,
            isWarmup: isWarmupSet
        });
        if (currentSetIndex === 0 && hasWarmup) {
            setWarmupCompleted(true);
        }
        if (currentSetIndex < exercise.sets) {
            // More sets to go - start rest timer
            setCurrentSetIndex(currentSetIndex + 1);
            if (restSeconds > 0) {
                setIsResting(true);
                setRestTimeRemaining(restSeconds);
            } else {
                setIsResting(false);
                setRestTimeRemaining(0);
            }
            // Auto-update weight for next set (if it was warmup, switch to working weight)
            if (currentSetIndex === 0) {
                setSetData({
                    weight: exercise.isMachine && machineOnly ? 0 : exercise.targetWeight,
                    reps: exercise.targetReps
                });
            }
        } else {
            // Exercise complete - save to session
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addExerciseToSession"])({
                name: exercise.name,
                type: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single,
                isMachine: exercise.isMachine,
                primaryMetric: exercise.primaryMetric,
                metricUnit: exercise.metricUnit ?? null,
                warmup: hasWarmup && warmupCompleted ? newCompletedSets[0] : undefined,
                sets: hasWarmup && warmupCompleted ? newCompletedSets.slice(1) : newCompletedSets
            });
            // Cache completed exercise for review
            setCompletedExercisesCache([
                ...completedExercisesCache,
                {
                    exerciseIndex: currentExerciseIndex,
                    exerciseName: exercise.name,
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single,
                    completedSets: newCompletedSets,
                    warmupCompleted
                }
            ]);
            // Show transition to next exercise
            if (currentExerciseIndex < workout.exercises.length - 1) {
                setIsResting(false);
                setIsTransitioning(true);
                setTransitionTimeRemaining(60);
            } else {
                // All exercises done - always go to cardio (optional)
                router.push(`/workout/${encodeURIComponent(workout.name)}/cardio${routineQuery}`);
            }
        }
    };
    const handleSkipRest = ()=>{
        setIsResting(false);
        setRestTimeRemaining(0);
    };
    const handleStartWarmup = ()=>{
        const exercise = currentExercise;
        const suggestedWeight = exercise.isMachine && machineOnly ? 0 : exercise.warmupWeight > 0 ? exercise.warmupWeight : 0;
        setWarmupDecision('include');
        setWarmupCompleted(false);
        setCurrentSetIndex(0);
        setSetData({
            weight: suggestedWeight,
            reps: exercise.targetReps
        });
    };
    const handleSkipWarmup = ()=>{
        const exercise = currentExercise;
        // Move to set 1 (first working set)
        setWarmupDecision('skip');
        setCurrentSetIndex(1);
        setSetData({
            weight: exercise.isMachine && machineOnly ? 0 : exercise.targetWeight,
            reps: exercise.targetReps
        });
        setWarmupCompleted(false);
    };
    const handleAddTime = ()=>{
        setRestTimeRemaining(restTimeRemaining + 15);
    };
    const handleSkipTransition = ()=>{
        setTransitionTimeRemaining(0);
    };
    const openHistory = (names)=>{
        setHistoryExerciseNames(names);
        setShowHistory(true);
    };
    const closeHistory = ()=>{
        setShowHistory(false);
        setHistoryExerciseNames([]);
    };
    const handleEndExercise = ()=>{
        console.log('handleEndExercise called', {
            exerciseType: currentExercise.type,
            currentExerciseIndex,
            totalExercises: workout.exercises.length
        });
        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$autosave$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["autosaveWorkout"])({
            type: 'exercise_end'
        });
        // Save completed sets and move to next exercise
        if (currentExercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single) {
            const exercise = currentExercise;
            const hasWarmup = resolveHasWarmup(exercise);
            if (completedSets.length > 0) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addExerciseToSession"])({
                    name: exercise.name,
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single,
                    isMachine: exercise.isMachine,
                    primaryMetric: exercise.primaryMetric,
                    metricUnit: exercise.metricUnit ?? null,
                    warmup: hasWarmup && warmupCompleted ? completedSets[0] : undefined,
                    sets: hasWarmup && warmupCompleted ? completedSets.slice(1) : completedSets
                });
                // Cache for review
                setCompletedExercisesCache([
                    ...completedExercisesCache,
                    {
                        exerciseIndex: currentExerciseIndex,
                        exerciseName: exercise.name,
                        type: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single,
                        completedSets: completedSets,
                        warmupCompleted
                    }
                ]);
            }
        } else {
            // B2B exercise
            const b2bExercise = currentExercise;
            console.log('Ending B2B exercise early', {
                completedPairsLength: completedPairs.length
            });
            if (completedPairs.length > 0) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addExerciseToSession"])({
                    name: b2bExercise.exercises[0].name,
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].b2b,
                    isMachine: b2bExercise.exercises[0].isMachine,
                    primaryMetric: b2bExercise.exercises[0].primaryMetric,
                    metricUnit: b2bExercise.exercises[0].metricUnit ?? null,
                    sets: completedPairs.map((pair)=>pair.ex1),
                    b2bPartner: {
                        name: b2bExercise.exercises[1].name,
                        isMachine: b2bExercise.exercises[1].isMachine,
                        primaryMetric: b2bExercise.exercises[1].primaryMetric,
                        metricUnit: b2bExercise.exercises[1].metricUnit ?? null,
                        sets: completedPairs.map((pair)=>pair.ex2)
                    }
                });
                // Cache for review
                setCompletedExercisesCache([
                    ...completedExercisesCache,
                    {
                        exerciseIndex: currentExerciseIndex,
                        exerciseName: b2bExercise.exercises[0].name,
                        type: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].b2b,
                        completedPairs: completedPairs
                    }
                ]);
            }
        }
        // Move to next exercise or finish
        if (currentExerciseIndex < workout.exercises.length - 1) {
            console.log('Moving to next exercise');
            setIsResting(false);
            setIsTransitioning(true);
            setTransitionTimeRemaining(60);
            // Keep viewing index synced so next exercise isn't in read-only mode
            setViewingExerciseIndex(currentExerciseIndex);
        } else {
            console.log('All exercises done, going to cardio');
            // All exercises done - always go to cardio (optional)
            router.push(`/workout/${encodeURIComponent(workout.name)}/cardio${routineQuery}`);
        }
    };
    const handleBackClick = (e)=>{
        e.preventDefault();
        // If viewing a previous exercise, go back one more
        if (viewingExerciseIndex > 0) {
            setViewingExerciseIndex(viewingExerciseIndex - 1);
        } else if (workout) {
            // At the first exercise, go back to pre-stretches (if any) or exit
            const preStretchCount = workout.preWorkoutStretches?.length || 0;
            if (preStretchCount > 0) {
                const stretchParams = new URLSearchParams(routineQueryParams.toString());
                stretchParams.set('index', String(preStretchCount - 1));
                router.push(`/stretches/${encodeURIComponent(workout.name)}?${stretchParams.toString()}`);
            } else {
                setShowExitConfirm(true);
            }
        }
    };
    // Handle going to previous section (for WorkoutNavHeader)
    const handlePreviousSection = ()=>{
        if (!workout) return;
        if (viewingExerciseIndex > 0) {
            setViewingExerciseIndex(viewingExerciseIndex - 1);
        } else {
            // Go to last pre-stretch
            const preStretchCount = workout.preWorkoutStretches?.length || 0;
            if (preStretchCount > 0) {
                const stretchParams = new URLSearchParams(routineQueryParams.toString());
                stretchParams.set('index', String(preStretchCount - 1));
                router.push(`/stretches/${encodeURIComponent(workout.name)}?${stretchParams.toString()}`);
            }
        }
    };
    const handleForwardClick = ()=>{
        // Can only go forward if there are completed exercises ahead
        if (viewingExerciseIndex < currentExerciseIndex) {
            setViewingExerciseIndex(viewingExerciseIndex + 1);
        }
    };
    const buildSingleExercise = (exercise)=>{
        const isBodyweight = typeof exercise.is_bodyweight === 'number' ? exercise.is_bodyweight === 1 : false;
        const isMachine = typeof exercise.is_machine === 'number' ? exercise.is_machine === 1 : false;
        return {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single,
            name: exercise.name,
            sets: 3,
            targetReps: 10,
            targetWeight: 0,
            warmupWeight: 0,
            hasWarmup: !isBodyweight,
            restTime: 60,
            videoUrl: exercise.video_url || '',
            tips: exercise.tips || '',
            isBodyweight,
            isMachine
        };
    };
    const buildSupersetExercise = (exercise1, exercise2)=>{
        const isBodyweight1 = typeof exercise1.is_bodyweight === 'number' ? exercise1.is_bodyweight === 1 : false;
        const isBodyweight2 = typeof exercise2.is_bodyweight === 'number' ? exercise2.is_bodyweight === 1 : false;
        const isMachine1 = typeof exercise1.is_machine === 'number' ? exercise1.is_machine === 1 : false;
        const isMachine2 = typeof exercise2.is_machine === 'number' ? exercise2.is_machine === 1 : false;
        return {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].b2b,
            restTime: 30,
            exercises: [
                {
                    name: exercise1.name,
                    sets: 3,
                    targetReps: 10,
                    targetWeight: 0,
                    warmupWeight: 0,
                    hasWarmup: false,
                    videoUrl: exercise1.video_url || '',
                    tips: exercise1.tips || '',
                    isBodyweight: isBodyweight1,
                    isMachine: isMachine1
                },
                {
                    name: exercise2.name,
                    sets: 3,
                    targetReps: 10,
                    targetWeight: 0,
                    warmupWeight: 0,
                    hasWarmup: false,
                    videoUrl: exercise2.video_url || '',
                    tips: exercise2.tips || '',
                    isBodyweight: isBodyweight2,
                    isMachine: isMachine2
                }
            ]
        };
    };
    const applyWorkoutUpdate = (updatedWorkout)=>{
        setWorkout(updatedWorkout);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveSessionWorkout"])(updatedWorkout, routineIdParam);
    };
    const resetExerciseStateFor = (exercise)=>{
        setIsResting(false);
        setRestTimeRemaining(0);
        setIsTransitioning(false);
        setTransitionTimeRemaining(60);
        setCompletedSets([]);
        setCompletedPairs([]);
        setCurrentExerciseInPair(0);
        setLastExerciseLog(null);
        setLastPartnerExerciseLog(null);
        if (exercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single) {
            initSingleExerciseState(exercise);
        } else {
            const b2bExercise = exercise;
            const defaultMachineOnly1 = !!b2bExercise.exercises[0].isMachine && isExerciseWeightMetric(b2bExercise.exercises[0]) && b2bExercise.exercises[0].targetWeight <= 0;
            const defaultMachineOnly2 = !!b2bExercise.exercises[1].isMachine && isExerciseWeightMetric(b2bExercise.exercises[1]) && b2bExercise.exercises[1].targetWeight <= 0;
            setSetData1({
                weight: defaultMachineOnly1 ? 0 : b2bExercise.exercises[0].targetWeight,
                reps: b2bExercise.exercises[0].targetReps
            });
            setSetData2({
                weight: defaultMachineOnly2 ? 0 : b2bExercise.exercises[1].targetWeight,
                reps: b2bExercise.exercises[1].targetReps
            });
            setMachineOnly1(defaultMachineOnly1);
            setMachineOnly2(defaultMachineOnly2);
            setMachineOnlyHoldWeight1(b2bExercise.exercises[0].targetWeight);
            setMachineOnlyHoldWeight2(b2bExercise.exercises[1].targetWeight);
            setCurrentSetIndex(1);
            setWarmupDecision('skip');
            setWarmupCompleted(false);
        }
        setViewingExerciseIndex(currentExerciseIndex);
    };
    const runWithChangeWarning = (action)=>{
        if (!workout) return;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasChangeWarningAck"])(workout.name, routineIdParam)) {
            action();
            return;
        }
        pendingChangeRef.current = action;
        setShowChangeWarning(true);
    };
    const handleWarningContinue = ()=>{
        if (!workout) {
            setShowChangeWarning(false);
            return;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["acknowledgeChangeWarning"])(workout.name, routineIdParam);
        setShowChangeWarning(false);
        const action = pendingChangeRef.current;
        pendingChangeRef.current = null;
        action?.();
    };
    const handleWarningCancel = ()=>{
        pendingChangeRef.current = null;
        setShowChangeWarning(false);
    };
    const openExerciseTypePicker = (mode)=>{
        runWithChangeWarning(()=>{
            setExerciseActionMode(mode);
            setShowExerciseTypePicker(true);
        });
    };
    const handleSelectSingleExercise = (exercise)=>{
        if (!workout || !exerciseActionMode) return;
        const nextExercise = buildSingleExercise(exercise);
        const updatedExercises = [
            ...workout.exercises
        ];
        const insertIndex = currentExerciseIndex;
        if (exerciseActionMode === 'add') {
            updatedExercises.splice(insertIndex, 0, nextExercise);
            resetExerciseStateFor(nextExercise);
        } else {
            updatedExercises[currentExerciseIndex] = nextExercise;
            resetExerciseStateFor(nextExercise);
        }
        applyWorkoutUpdate({
            ...workout,
            exercises: updatedExercises
        });
        setExerciseActionMode(null);
        setShowExerciseSelector(false);
    };
    const handleSelectSuperset = (exercise1, exercise2)=>{
        if (!workout || !exerciseActionMode) return;
        const nextExercise = buildSupersetExercise(exercise1, exercise2);
        const updatedExercises = [
            ...workout.exercises
        ];
        const insertIndex = currentExerciseIndex;
        if (exerciseActionMode === 'add') {
            updatedExercises.splice(insertIndex, 0, nextExercise);
            resetExerciseStateFor(nextExercise);
        } else {
            updatedExercises[currentExerciseIndex] = nextExercise;
            resetExerciseStateFor(nextExercise);
        }
        applyWorkoutUpdate({
            ...workout,
            exercises: updatedExercises
        });
        setExerciseActionMode(null);
        setShowSupersetSelector(false);
    };
    const handleExerciseTypeCancel = ()=>{
        setShowExerciseTypePicker(false);
        setExerciseActionMode(null);
    };
    // Determine which exercise to display (for review mode vs active mode)
    const exerciseToDisplay = isReviewMode ? viewingExercise : currentExercise;
    const modifyAccentClasses = exerciseToDisplay.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].b2b ? 'bg-purple-600 hover:bg-purple-500' : 'bg-rose-800 hover:bg-rose-700';
    const hasExerciseStarted = currentExercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].b2b ? completedPairs.length > 0 || currentExerciseInPair !== 0 : completedSets.length > 0;
    const canModifyExercise = !isReviewMode && !hasExerciseStarted;
    const exerciseModifyControls = canModifyExercise ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>openExerciseTypePicker('add'),
                className: `inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-white transition-colors ${modifyAccentClasses}`,
                children: "+ Add Exercise"
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1018,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>openExerciseTypePicker('replace'),
                className: `inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-white transition-colors ${modifyAccentClasses}`,
                children: "↺ Replace"
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1024,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/workout/[name]/active/page.tsx",
        lineNumber: 1017,
        columnNumber: 5
    }, this) : null;
    const exerciseModals = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            showChangeWarning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 p-6 text-white",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold mb-2",
                            children: "Session-only change"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1037,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-zinc-300 mb-6",
                            children: "This edit only applies to today's workout. Edit the routine to make a permanent change."
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1038,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleWarningCancel,
                                    className: "rounded-lg bg-zinc-700 py-2 text-sm font-semibold text-white hover:bg-zinc-600",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1042,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleWarningContinue,
                                    className: "rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-500",
                                    children: "Continue"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1048,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1041,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1036,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1035,
                columnNumber: 9
            }, this),
            showExerciseTypePicker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-900 p-5 text-white",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold mb-4",
                            children: "Choose exercise type"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1062,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowExerciseTypePicker(false);
                                        setShowExerciseSelector(true);
                                    },
                                    className: "w-full rounded-lg bg-rose-800 py-2 text-sm font-semibold text-white hover:bg-rose-700",
                                    children: "Single exercise"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1064,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowExerciseTypePicker(false);
                                        setShowSupersetSelector(true);
                                    },
                                    className: "w-full rounded-lg bg-purple-600 py-2 text-sm font-semibold text-white hover:bg-purple-500",
                                    children: "Superset"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1073,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleExerciseTypeCancel,
                                    className: "w-full rounded-lg bg-zinc-700 py-2 text-sm font-semibold text-white hover:bg-zinc-600",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1082,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1063,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1061,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1060,
                columnNumber: 9
            }, this),
            showExerciseSelector && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExerciseSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                title: exerciseActionMode === 'replace' ? 'Replace Exercise' : 'Add Exercise',
                onCancel: ()=>{
                    setShowExerciseSelector(false);
                    setExerciseActionMode(null);
                },
                onSelect: handleSelectSingleExercise
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1094,
                columnNumber: 9
            }, this),
            showSupersetSelector && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SupersetSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                onCancel: ()=>{
                    setShowSupersetSelector(false);
                    setExerciseActionMode(null);
                },
                onSelect: handleSelectSuperset
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1105,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExerciseHistoryModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                open: showHistory,
                onClose: closeHistory,
                exerciseNames: historyExerciseNames,
                title: "Exercise History",
                targets: historyTargets,
                weightUnit: weightUnit,
                heightUnit: heightUnit
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1114,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
    // Handle B2B/Superset exercises
    if (exerciseToDisplay.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].b2b) {
        const b2bExercise = exerciseToDisplay;
        const ex1 = b2bExercise.exercises[0];
        const ex2 = b2bExercise.exercises[1];
        const ex1MetricInfo = getMetricInfo(ex1);
        const ex2MetricInfo = getMetricInfo(ex2);
        const ex1RepsOnly = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRepsOnlyMetric"])(ex1MetricInfo.primaryMetric);
        const ex2RepsOnly = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRepsOnlyMetric"])(ex2MetricInfo.primaryMetric);
        const ex1IsWeightMetric = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isWeightMetric"])(ex1MetricInfo.primaryMetric);
        const ex2IsWeightMetric = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isWeightMetric"])(ex2MetricInfo.primaryMetric);
        const ex1Machine = !!ex1.isMachine && ex1IsWeightMetric;
        const ex2Machine = !!ex2.isMachine && ex2IsWeightMetric;
        const showMachineToggle1 = ex1Machine && !ex1RepsOnly;
        const showMachineToggle2 = ex2Machine && !ex2RepsOnly;
        const showMetricInput1 = !ex1RepsOnly && !(ex1Machine && machineOnly1);
        const showMetricInput2 = !ex2RepsOnly && !(ex2Machine && machineOnly2);
        // In review mode, show cached completed pairs
        const displayCompletedPairs = isReviewMode && viewingCachedData ? viewingCachedData.completedPairs || [] : completedPairs;
        // Transition Screen (for B2B)
        if (isTransitioning) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-zinc-900 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-2xl mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400",
                                children: [
                                    "Exercise ",
                                    currentExerciseIndex + 1,
                                    "/",
                                    workout.exercises.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1156,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1155,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-white text-center mb-2",
                            children: ex1.name
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1160,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-purple-400 text-center text-lg mb-8",
                            children: [
                                "+ ",
                                ex2.name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1161,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-green-500 text-6xl mb-2",
                                    children: "✓"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1165,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-white text-2xl font-semibold",
                                    children: "EXERCISE COMPLETE"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1166,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1164,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 ${transitionTimeRemaining === 0 ? 'border-zinc-700' : 'border-orange-600'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `text-xl mb-4 ${transitionTimeRemaining === 0 ? 'text-zinc-400' : 'text-orange-400'}`,
                                    children: "Chilll Outtt"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1171,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `text-8xl font-bold mb-2 ${transitionTimeRemaining === 0 ? 'text-orange-400' : 'text-white'}`,
                                    children: transitionTimeRemaining
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1172,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-400 text-lg",
                                    children: "seconds"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1175,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1170,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setTransitionTimeRemaining(0),
                                    className: "w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-lg font-bold transition-colors",
                                    children: "Skip Timer →"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1180,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setTransitionTimeRemaining(Math.max(0, transitionTimeRemaining - 15)),
                                            className: "bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-colors",
                                            children: "-15s"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1187,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setTransitionTimeRemaining(transitionTimeRemaining + 15),
                                            className: "bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-colors",
                                            children: "+15s"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1193,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1186,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1179,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1153,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1152,
                columnNumber: 9
            }, this);
        }
        // Rest Timer Screen (for B2B)
        if (isResting) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-zinc-900 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-2xl mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400",
                                children: [
                                    "Exercise ",
                                    currentExerciseIndex + 1,
                                    "/",
                                    workout.exercises.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1213,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1212,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-white text-center mb-2",
                            children: ex1.name
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1217,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-purple-400 text-center text-lg mb-8",
                            children: [
                                "+ ",
                                ex2.name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1218,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-green-500 text-6xl mb-2",
                                    children: "✓"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1222,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-white text-2xl font-semibold",
                                    children: [
                                        "SET ",
                                        completedPairs.length,
                                        " COMPLETE"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1223,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1221,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 ${restTimeRemaining === 0 ? 'border-zinc-700' : 'border-purple-600'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `text-xl mb-4 ${restTimeRemaining === 0 ? 'text-zinc-400' : 'text-purple-400'}`,
                                    children: "REST TIME"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1230,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `text-8xl font-bold mb-2 ${restTimeRemaining === 0 ? 'text-purple-400' : 'text-white'}`,
                                    children: restTimeRemaining
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1231,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-400 text-lg",
                                    children: "seconds"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1234,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1229,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-4 mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleAddTime,
                                    className: "bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                    children: "+ Add 15s"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1239,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSkipRest,
                                    className: "bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                    children: restTimeRemaining === 0 ? 'Continue Workout' : 'Skip Rest'
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1245,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1238,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-zinc-800 rounded-lg p-4 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-400 text-sm mb-2",
                                    children: "Next up:"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1255,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-white text-xl font-semibold",
                                    children: [
                                        "Set ",
                                        currentSetIndex
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1256,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-300 text-base",
                                    children: [
                                        ex1.name,
                                        " → ",
                                        ex2.name
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1259,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1254,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1210,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1209,
                columnNumber: 9
            }, this);
        }
        // B2B Exercise Tracking Screen
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 p-4 pb-32",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$WorkoutNavHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        exitUrl: `/workout/${encodeURIComponent(workout.name)}${routineQuery}`,
                        previousUrl: null,
                        onPrevious: handlePreviousSection,
                        onNext: isReviewMode ? ()=>setViewingExerciseIndex(viewingExerciseIndex + 1) : undefined
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1273,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end mb-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$AutosaveBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1280,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1279,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-zinc-400 text-right mb-4 -mt-4",
                        children: [
                            "Exercise ",
                            viewingExerciseIndex + 1,
                            "/",
                            workout.exercises.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1282,
                        columnNumber: 11
                    }, this),
                    isReviewMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-yellow-900 border border-yellow-600 rounded-lg p-3 mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-yellow-200 text-sm font-semibold text-center",
                            children: "📖 READ ONLY - Cannot edit completed sets"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1287,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1286,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-2 bg-zinc-800 rounded-full overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full bg-purple-500 transition-all duration-300",
                                    style: {
                                        width: `${progressPercentage}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1296,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1295,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-500 text-sm text-center mt-2",
                                children: [
                                    "Overall Progress: ",
                                    currentProgress,
                                    " / ",
                                    totalItems
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1301,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1294,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 mb-4",
                        children: [
                            exerciseModifyControls,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>openHistory([
                                        ex1.name,
                                        ex2.name
                                    ]),
                                className: "ml-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                                children: "📈 History"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1308,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1306,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-purple-400 text-sm font-bold mb-2",
                                children: "🔄 SUPERSET"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1318,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white text-lg font-semibold mb-1",
                                children: [
                                    "SET ",
                                    currentSetIndex,
                                    " of ",
                                    ex1.sets
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1319,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1317,
                        columnNumber: 11
                    }, this),
                    (lastExerciseLog || lastPartnerExerciseLog) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-sm mb-3",
                                children: "LAST TIME"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1327,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-purple-400 text-xs font-semibold mb-1",
                                                children: ex1.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1331,
                                                columnNumber: 19
                                            }, this),
                                            lastExerciseLog ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-zinc-500 text-xs mb-2",
                                                        children: formatLocalDate(lastExerciseDate)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1334,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1",
                                                        children: [
                                                            1,
                                                            2,
                                                            3,
                                                            4
                                                        ].map((setNum)=>{
                                                            const weight = lastExerciseLog[`set${setNum}_weight`];
                                                            const reps = lastExerciseLog[`set${setNum}_reps`];
                                                            if (weight !== null && reps !== null) {
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-zinc-300 text-xs",
                                                                    children: ex1RepsOnly ? `Set ${setNum}: ${reps} reps` : `Set ${setNum}: ${formatMetric(weight, ex1MetricInfo, ex1Machine)} × ${reps}`
                                                                }, setNum, false, {
                                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                                    lineNumber: 1343,
                                                                    columnNumber: 31
                                                                }, this);
                                                            }
                                                            return null;
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1337,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs",
                                                children: "No history yet"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1355,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1330,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-purple-400 text-xs font-semibold mb-1",
                                                children: ex2.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1360,
                                                columnNumber: 19
                                            }, this),
                                            lastPartnerExerciseLog ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-zinc-500 text-xs mb-2",
                                                        children: formatLocalDate(lastPartnerExerciseDate)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1363,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1",
                                                        children: [
                                                            1,
                                                            2,
                                                            3,
                                                            4
                                                        ].map((setNum)=>{
                                                            const weight = lastPartnerExerciseLog[`set${setNum}_weight`];
                                                            const reps = lastPartnerExerciseLog[`set${setNum}_reps`];
                                                            if (weight !== null && reps !== null) {
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-zinc-300 text-xs",
                                                                    children: ex2RepsOnly ? `Set ${setNum}: ${reps} reps` : `Set ${setNum}: ${formatMetric(weight, ex2MetricInfo, ex2Machine)} × ${reps}`
                                                                }, setNum, false, {
                                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                                    lineNumber: 1372,
                                                                    columnNumber: 31
                                                                }, this);
                                                            }
                                                            return null;
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1366,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs",
                                                children: "No history yet"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1384,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1359,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1328,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1326,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `bg-zinc-800 rounded-lg p-5 mb-4 transition-all ${currentExerciseInPair === 0 ? 'border-2 border-purple-600' : 'border border-zinc-700 opacity-60'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs mb-1",
                                                children: [
                                                    "Exercise 1 of 2 ",
                                                    currentExerciseInPair === 0 ? '(ACTIVE)' : completedPairs.length >= currentSetIndex ? '(Done)' : '(Next)'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1397,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-bold text-white mb-2",
                                                children: ex1.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1400,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1396,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getVideoUrl"])(ex1.name, ex1.videoUrl),
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded",
                                        children: "📺 Video"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1402,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1395,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-zinc-900 rounded p-3 mb-3 border border-purple-700/50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-purple-300 text-xs mb-2",
                                        children: "Today's target"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1413,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `grid ${ex1RepsOnly ? 'grid-cols-1' : 'grid-cols-2'} gap-3`,
                                        children: [
                                            !ex1RepsOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-zinc-500 text-xs mb-1",
                                                        children: getMetricLabelText(ex1MetricInfo, ex1Machine)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1417,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-white text-lg font-semibold",
                                                        children: formatMetric(ex1.targetWeight, ex1MetricInfo, ex1Machine)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1420,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1416,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-zinc-500 text-xs mb-1",
                                                        children: "Reps"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1426,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-white text-lg font-semibold",
                                                        children: ex1.targetReps
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1427,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1425,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1414,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1412,
                                columnNumber: 13
                            }, this),
                            !isReviewMode && currentExerciseInPair === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    showMachineToggle1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-2 text-xs text-zinc-400 mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: machineOnly1,
                                                onChange: (e)=>{
                                                    const checked = e.target.checked;
                                                    setMachineOnly1(checked);
                                                    setSetData1((prev)=>{
                                                        if (checked) {
                                                            setMachineOnlyHoldWeight1(prev.weight);
                                                            return {
                                                                ...prev,
                                                                weight: 0
                                                            };
                                                        }
                                                        const restore = Number.isFinite(machineOnlyHoldWeight1) ? machineOnlyHoldWeight1 : ex1.targetWeight;
                                                        return {
                                                            ...prev,
                                                            weight: restore
                                                        };
                                                    });
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1439,
                                                columnNumber: 21
                                            }, this),
                                            "Machine weight only"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1438,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `grid ${showMetricInput1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-3`,
                                        children: [
                                            showMetricInput1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-zinc-900 rounded-lg p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-zinc-400 text-xs block mb-1",
                                                        children: getMetricLabelText(ex1MetricInfo, ex1Machine)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1463,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        inputMode: "decimal",
                                                        value: formatMetricValueInput(setData1.weight, ex1MetricInfo),
                                                        onChange: (e)=>{
                                                            const val = e.target.value;
                                                            const nextValue = parseMetricValueInput(val, ex1MetricInfo);
                                                            if (nextValue !== null) {
                                                                setSetData1({
                                                                    ...setData1,
                                                                    weight: nextValue
                                                                });
                                                            }
                                                        },
                                                        className: "w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1466,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1462,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-zinc-900 rounded-lg p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-zinc-400 text-xs block mb-1",
                                                        children: "Reps"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1482,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        inputMode: "numeric",
                                                        value: setData1.reps ?? '',
                                                        onChange: (e)=>setSetData1({
                                                                ...setData1,
                                                                reps: parseInt(e.target.value) || 0
                                                            }),
                                                        className: "w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1483,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1481,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1460,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 rounded p-3 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs mb-1",
                                                children: "Form Tips"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1494,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-300 text-sm",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFormTips"])(ex1.tips)
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1495,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1493,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCompleteB2BExercise,
                                        className: "w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-bold transition-colors",
                                        children: "✓ Complete Exercise 1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1498,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-zinc-900 rounded p-3 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-zinc-500 text-xs mb-1",
                                                    children: getMetricLabelText(ex1MetricInfo, ex1Machine)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1510,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-white text-xl font-semibold",
                                                    children: formatMetric(setData1.weight, ex1MetricInfo, ex1Machine)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1513,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1509,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-zinc-900 rounded p-3 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-zinc-500 text-xs mb-1",
                                                    children: "Reps"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1518,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-white text-xl font-semibold",
                                                    children: setData1.reps
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1519,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1517,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1508,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1392,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `bg-zinc-800 rounded-lg p-5 mb-6 transition-all ${currentExerciseInPair === 1 ? 'border-2 border-purple-600' : 'border border-zinc-700 opacity-60'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs mb-1",
                                                children: [
                                                    "Exercise 2 of 2 ",
                                                    currentExerciseInPair === 1 ? '(ACTIVE)' : currentExerciseInPair === 0 ? '(Next)' : '(Done)'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1534,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-bold text-white mb-2",
                                                children: ex2.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1537,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1533,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getVideoUrl"])(ex2.name, ex2.videoUrl),
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded",
                                        children: "📺 Video"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1539,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1532,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-zinc-900 rounded p-3 mb-3 border border-purple-700/50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-purple-300 text-xs mb-2",
                                        children: "Today's target"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1550,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `grid ${ex2RepsOnly ? 'grid-cols-1' : 'grid-cols-2'} gap-3`,
                                        children: [
                                            !ex2RepsOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-zinc-500 text-xs mb-1",
                                                        children: getMetricLabelText(ex2MetricInfo, ex2Machine)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1554,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-white text-lg font-semibold",
                                                        children: formatMetric(ex2.targetWeight, ex2MetricInfo, ex2Machine)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1557,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1553,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-zinc-500 text-xs mb-1",
                                                        children: "Reps"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1563,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-white text-lg font-semibold",
                                                        children: ex2.targetReps
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1564,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1562,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1551,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1549,
                                columnNumber: 13
                            }, this),
                            !isReviewMode && currentExerciseInPair === 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    showMachineToggle2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-2 text-xs text-zinc-400 mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: machineOnly2,
                                                onChange: (e)=>{
                                                    const checked = e.target.checked;
                                                    setMachineOnly2(checked);
                                                    setSetData2((prev)=>{
                                                        if (checked) {
                                                            setMachineOnlyHoldWeight2(prev.weight);
                                                            return {
                                                                ...prev,
                                                                weight: 0
                                                            };
                                                        }
                                                        const restore = Number.isFinite(machineOnlyHoldWeight2) ? machineOnlyHoldWeight2 : ex2.targetWeight;
                                                        return {
                                                            ...prev,
                                                            weight: restore
                                                        };
                                                    });
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1576,
                                                columnNumber: 21
                                            }, this),
                                            "Machine weight only"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1575,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `grid ${showMetricInput2 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-3`,
                                        children: [
                                            showMetricInput2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-zinc-900 rounded-lg p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-zinc-400 text-xs block mb-1",
                                                        children: getMetricLabelText(ex2MetricInfo, ex2Machine)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1600,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        inputMode: "decimal",
                                                        value: formatMetricValueInput(setData2.weight, ex2MetricInfo),
                                                        onChange: (e)=>{
                                                            const val = e.target.value;
                                                            const nextValue = parseMetricValueInput(val, ex2MetricInfo);
                                                            if (nextValue !== null) {
                                                                setSetData2({
                                                                    ...setData2,
                                                                    weight: nextValue
                                                                });
                                                            }
                                                        },
                                                        className: "w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1603,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1599,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-zinc-900 rounded-lg p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-zinc-400 text-xs block mb-1",
                                                        children: "Reps"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1619,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        inputMode: "numeric",
                                                        value: setData2.reps ?? '',
                                                        onChange: (e)=>setSetData2({
                                                                ...setData2,
                                                                reps: parseInt(e.target.value) || 0
                                                            }),
                                                        className: "w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1620,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1618,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1597,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 rounded p-3 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs mb-1",
                                                children: "Form Tips"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1631,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-300 text-sm",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFormTips"])(ex2.tips)
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1632,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1630,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleCompleteB2BExercise,
                                            className: "w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-bold transition-colors",
                                            children: "✓ Complete Exercise 2"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1636,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1635,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-zinc-900 rounded p-3 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-zinc-500 text-xs mb-1",
                                                    children: getMetricLabelText(ex2MetricInfo, ex2Machine)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1649,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-white text-xl font-semibold",
                                                    children: formatMetric(setData2.weight, ex2MetricInfo, ex2Machine)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1652,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1648,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-zinc-900 rounded p-3 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-zinc-500 text-xs mb-1",
                                                    children: "Reps"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1657,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-white text-xl font-semibold",
                                                    children: setData2.reps
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1658,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1656,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1647,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1529,
                        columnNumber: 11
                    }, this),
                    displayCompletedPairs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-zinc-800 rounded-lg p-4 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-sm mb-2",
                                children: "COMPLETED SETS"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1670,
                                columnNumber: 15
                            }, this),
                            displayCompletedPairs.map((pair, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-green-400 text-sm font-semibold mb-1",
                                            children: [
                                                "Set ",
                                                index + 1,
                                                ":"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1673,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-zinc-300 text-xs ml-2",
                                            children: [
                                                "✓ ",
                                                ex1.name,
                                                ": ",
                                                formatMetric(pair.ex1.weight, ex1MetricInfo, ex1Machine),
                                                " × ",
                                                pair.ex1.reps,
                                                " reps"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1674,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-zinc-300 text-xs ml-2",
                                            children: [
                                                "✓ ",
                                                ex2.name,
                                                ": ",
                                                formatMetric(pair.ex2.weight, ex2MetricInfo, ex2Machine),
                                                " × ",
                                                pair.ex2.reps,
                                                " reps"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1677,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, index, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1672,
                                    columnNumber: 17
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1669,
                        columnNumber: 13
                    }, this),
                    !isReviewMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            if (completedPairs.length > 0) {
                                handleEndExercise();
                                return;
                            }
                            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$autosave$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["autosaveWorkout"])({
                                type: 'exercise_skip'
                            });
                            if (currentExerciseIndex < workout.exercises.length - 1) {
                                const nextExerciseIndex = currentExerciseIndex + 1;
                                setCurrentExerciseIndex(nextExerciseIndex);
                                setViewingExerciseIndex(nextExerciseIndex);
                                setCompletedPairs([]);
                                // Initialize next exercise
                                const nextExercise = workout.exercises[nextExerciseIndex];
                                if (nextExercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single) {
                                    initSingleExerciseState(nextExercise);
                                } else {
                                    const b2bEx = nextExercise;
                                    const defaultMachineOnly1 = !!b2bEx.exercises[0].isMachine && isExerciseWeightMetric(b2bEx.exercises[0]) && b2bEx.exercises[0].targetWeight <= 0;
                                    const defaultMachineOnly2 = !!b2bEx.exercises[1].isMachine && isExerciseWeightMetric(b2bEx.exercises[1]) && b2bEx.exercises[1].targetWeight <= 0;
                                    setSetData1({
                                        weight: defaultMachineOnly1 ? 0 : b2bEx.exercises[0].targetWeight,
                                        reps: b2bEx.exercises[0].targetReps
                                    });
                                    setSetData2({
                                        weight: defaultMachineOnly2 ? 0 : b2bEx.exercises[1].targetWeight,
                                        reps: b2bEx.exercises[1].targetReps
                                    });
                                    setMachineOnly1(defaultMachineOnly1);
                                    setMachineOnly2(defaultMachineOnly2);
                                    setMachineOnlyHoldWeight1(b2bEx.exercises[0].targetWeight);
                                    setMachineOnlyHoldWeight2(b2bEx.exercises[1].targetWeight);
                                    setCurrentSetIndex(1);
                                    setCurrentExerciseInPair(0);
                                    setWarmupDecision('skip');
                                    setWarmupCompleted(false);
                                }
                            } else {
                                // Always go to cardio (optional)
                                router.push(`/workout/${encodeURIComponent(workout.name)}/cardio${routineQuery}`);
                            }
                        },
                        className: "w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                        children: completedPairs.length > 0 ? 'End Exercise' : 'Skip Exercise'
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1687,
                        columnNumber: 13
                    }, this),
                    exerciseModals
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1271,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 1270,
            columnNumber: 7
        }, this);
    }
    const exercise = exerciseToDisplay;
    const metricInfo = getMetricInfo(exercise);
    const hasWarmup = resolveHasWarmup(exercise);
    const isWarmupSet = hasWarmup && warmupDecision === 'include' && currentSetIndex === 0;
    const isRepsOnly = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRepsOnlyMetric"])(metricInfo.primaryMetric);
    const isMachine = !!exercise.isMachine && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isWeightMetric"])(metricInfo.primaryMetric);
    const showMachineToggle = isMachine && !isRepsOnly;
    const showMetricInput = !isRepsOnly && !(isMachine && machineOnly);
    // In review mode, show cached completed sets
    const displayCompletedSets = isReviewMode && viewingCachedData ? viewingCachedData.completedSets || [] : completedSets;
    const displayWarmupCompleted = hasWarmup && (isReviewMode ? !!viewingCachedData?.warmupCompleted : warmupCompleted);
    const showWarmupPrompt = !isReviewMode && hasWarmup && warmupDecision === 'pending';
    const warmupSuggestionWeight = hasWarmup && exercise.warmupWeight > 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isWeightMetric"])(metricInfo.primaryMetric) ? exercise.warmupWeight : null;
    const weightInputValue = isWarmupSet && warmupSuggestionWeight === null && showMetricInput && setData.weight === 0 ? '' : formatMetricValueInput(setData.weight, metricInfo);
    // Transition Screen (between exercises)
    if (isTransitioning) {
        const nextExercise = workout.exercises[currentExerciseIndex + 1];
        const nextExerciseName = nextExercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single ? nextExercise.name : `${nextExercise.exercises[0].name} / ${nextExercise.exercises[1].name}`;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto flex flex-col items-center justify-center min-h-screen",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full mb-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-2 bg-zinc-800 rounded-full overflow-hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full bg-rose-600 transition-all duration-300",
                                style: {
                                    width: `${progressPercentage}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1783,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1782,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1781,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-zinc-400 text-xl mb-4",
                        children: "Next Exercise"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1791,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-bold text-white text-center mb-12 px-4",
                        children: nextExerciseName
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1794,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `bg-zinc-800 rounded-lg p-16 mb-12 text-center border-4 ${transitionTimeRemaining === 0 ? 'border-zinc-700' : 'border-rose-700'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `text-xl mb-4 ${transitionTimeRemaining === 0 ? 'text-zinc-400' : 'text-rose-300'}`,
                                children: "Chilll Outtt"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1800,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `text-9xl font-bold mb-2 ${transitionTimeRemaining === 0 ? 'text-rose-300' : 'text-white'}`,
                                children: transitionTimeRemaining
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1801,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-lg",
                                children: "seconds"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1804,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1799,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSkipTransition,
                        className: "bg-rose-700 hover:bg-rose-600 text-white px-12 py-5 rounded-lg text-2xl font-bold transition-colors",
                        children: "I'm Ready →"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1808,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1779,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 1778,
            columnNumber: 7
        }, this);
    }
    // Rest Timer Screen
    if (isResting) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400",
                            children: [
                                "Exercise ",
                                currentExerciseIndex + 1,
                                "/",
                                workout.exercises.length
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1826,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1825,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold text-white text-center mb-8",
                        children: exercise.name
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1830,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-rose-400 text-6xl mb-2",
                                children: "✓"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1834,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white text-2xl font-semibold",
                                children: [
                                    hasWarmup && warmupCompleted && completedSets.length === 1 ? 'WARMUP SET' : `SET ${hasWarmup && warmupCompleted ? completedSets.length - 1 : completedSets.length}`,
                                    " COMPLETE"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1835,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1833,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 ${restTimeRemaining === 0 ? 'border-zinc-700' : 'border-rose-700'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `text-xl mb-4 ${restTimeRemaining === 0 ? 'text-zinc-400' : 'text-rose-300'}`,
                                children: "REST TIME"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1844,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `text-8xl font-bold mb-2 ${restTimeRemaining === 0 ? 'text-rose-300' : 'text-white'}`,
                                children: restTimeRemaining
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1845,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-lg",
                                children: "seconds"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1848,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1843,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-4 mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleAddTime,
                                className: "bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                children: "+ Add 15s"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1853,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSkipRest,
                                className: "bg-rose-700 hover:bg-rose-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                children: restTimeRemaining === 0 ? 'Continue Workout' : 'Skip Rest'
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1859,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1852,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-zinc-800 rounded-lg p-4 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-sm mb-2",
                                children: "Next up:"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1869,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white text-xl font-semibold",
                                children: [
                                    "Set ",
                                    currentSetIndex,
                                    " (Working)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1870,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-300 text-lg",
                                children: [
                                    formatMetric(exercise.targetWeight, metricInfo, isMachine),
                                    " × ",
                                    exercise.targetReps,
                                    " reps"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1873,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1868,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1823,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 1822,
            columnNumber: 7
        }, this);
    }
    // Exit Confirmation Modal
    if (showExitConfirm) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md w-full bg-zinc-800 rounded-lg p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-white text-2xl font-bold mb-4",
                        children: "Exit Routine?"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1887,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-zinc-300 mb-6",
                        children: "You will lose your current routine progress. Completed exercises have been saved to the database."
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1888,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowExitConfirm(false),
                                className: "bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                                children: "Continue"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1892,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/routines",
                                className: "bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors text-center",
                                children: "Exit Routine"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1898,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1891,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1886,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 1885,
            columnNumber: 7
        }, this);
    }
    // Exercise Tracking Screen
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-900 p-4 pb-32",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-2xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$WorkoutNavHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    exitUrl: `/workout/${encodeURIComponent(workout.name)}${routineQuery}`,
                    previousUrl: null,
                    onPrevious: handlePreviousSection,
                    onNext: isReviewMode ? ()=>setViewingExerciseIndex(viewingExerciseIndex + 1) : undefined
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1915,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end mb-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$AutosaveBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1922,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1921,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-zinc-400 text-right mb-4 -mt-4",
                    children: [
                        "Exercise ",
                        viewingExerciseIndex + 1,
                        "/",
                        workout.exercises.length
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1924,
                    columnNumber: 9
                }, this),
                isReviewMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-yellow-900 border border-yellow-600 rounded-lg p-3 mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-yellow-200 text-sm font-semibold text-center",
                        children: "📖 READ ONLY - Cannot edit completed sets"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1929,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1928,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-2 bg-zinc-800 rounded-full overflow-hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full bg-rose-600 transition-all duration-300",
                                style: {
                                    width: `${progressPercentage}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1938,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1937,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-500 text-sm text-center mt-2",
                            children: [
                                "Overall Progress: ",
                                currentProgress,
                                " / ",
                                totalItems
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1943,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1936,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3 mb-3",
                    children: [
                        exerciseModifyControls,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>openHistory([
                                    exercise.name
                                ]),
                            className: "ml-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                            children: "📈 History"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1950,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1948,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-white mb-6",
                    children: exercise.name
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1957,
                    columnNumber: 9
                }, this),
                lastExerciseLog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm mb-2",
                            children: [
                                "LAST TIME (",
                                formatLocalDate(lastExerciseDate),
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1962,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: [
                                lastExerciseLog.warmup_weight !== null && lastExerciseLog.warmup_reps !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-300 text-sm",
                                    children: isRepsOnly ? `Warmup: ${lastExerciseLog.warmup_reps} reps` : `Warmup: ${formatMetric(lastExerciseLog.warmup_weight, metricInfo, isMachine)} × ${lastExerciseLog.warmup_reps} reps`
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1967,
                                    columnNumber: 17
                                }, this),
                                [
                                    1,
                                    2,
                                    3,
                                    4
                                ].map((setNum)=>{
                                    const weight = lastExerciseLog[`set${setNum}_weight`];
                                    const reps = lastExerciseLog[`set${setNum}_reps`];
                                    if (weight !== null && reps !== null) {
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-zinc-300 text-sm",
                                            children: isRepsOnly ? `Set ${setNum}: ${reps} reps` : `Set ${setNum}: ${formatMetric(weight, metricInfo, isMachine)} × ${reps} reps`
                                        }, setNum, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1978,
                                            columnNumber: 21
                                        }, this);
                                    }
                                    return null;
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1965,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1961,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-4 mb-6 border border-emerald-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-emerald-400 text-xs mb-2",
                            children: "TODAY'S TARGET"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1992,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `grid ${isRepsOnly ? 'grid-cols-1' : 'grid-cols-2'} gap-4`,
                            children: [
                                !isRepsOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-zinc-900 rounded p-3 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-zinc-500 text-xs mb-1",
                                            children: getMetricLabelText(metricInfo, isMachine)
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1996,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-white text-xl font-semibold",
                                            children: formatMetric(exercise.targetWeight, metricInfo, isMachine)
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1999,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1995,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-zinc-900 rounded p-3 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-zinc-500 text-xs mb-1",
                                            children: "Reps"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 2005,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-white text-xl font-semibold",
                                            children: exercise.targetReps
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 2006,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 2004,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1993,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1991,
                    columnNumber: 9
                }, this),
                !isReviewMode && showWarmupPrompt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-6 mb-6 border-2 border-rose-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-rose-300 text-lg font-semibold mb-2",
                                    children: "Warm up?"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 2017,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-400 text-sm",
                                    children: "Optional warmup set before working sets."
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 2018,
                                    columnNumber: 15
                                }, this),
                                warmupSuggestionWeight !== null && !isRepsOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-300 text-sm mt-2",
                                    children: [
                                        "Suggested warmup: ",
                                        formatMetric(warmupSuggestionWeight, metricInfo, isMachine)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 2020,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 2016,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleStartWarmup,
                                    className: "bg-rose-700 hover:bg-rose-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                    children: "Warm up"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 2026,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSkipWarmup,
                                    className: "bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                    children: "Start Set 1"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 2032,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 2025,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 2015,
                    columnNumber: 11
                }, this),
                !isReviewMode && !showWarmupPrompt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-6 mb-6 border-2 border-rose-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-rose-300 text-lg font-semibold mb-2",
                                children: isWarmupSet ? 'WARMUP SET' : `SET ${currentSetIndex} (WORKING)`
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 2046,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 2045,
                            columnNumber: 13
                        }, this),
                        showMachineToggle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "flex items-center gap-2 text-xs text-zinc-400 mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    checked: machineOnly,
                                    onChange: (e)=>{
                                        const checked = e.target.checked;
                                        setMachineOnly(checked);
                                        setSetData((prev)=>{
                                            if (checked) {
                                                setMachineOnlyHoldWeight(prev.weight);
                                                return {
                                                    ...prev,
                                                    weight: 0
                                                };
                                            }
                                            const restore = Number.isFinite(machineOnlyHoldWeight) ? machineOnlyHoldWeight : exercise.targetWeight;
                                            return {
                                                ...prev,
                                                weight: restore
                                            };
                                        });
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 2054,
                                    columnNumber: 17
                                }, this),
                                "Machine weight only"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 2053,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `grid ${showMetricInput ? 'grid-cols-2' : 'grid-cols-1'} gap-4 mb-4`,
                            children: [
                                showMetricInput && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-zinc-900 rounded-lg p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-zinc-400 text-sm block mb-2",
                                            children: getMetricLabelText(metricInfo, isMachine)
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 2078,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            inputMode: "decimal",
                                            value: weightInputValue,
                                            onChange: (e)=>{
                                                const val = e.target.value;
                                                const nextValue = parseMetricValueInput(val, metricInfo);
                                                if (nextValue !== null) {
                                                    setSetData({
                                                        ...setData,
                                                        weight: nextValue
                                                    });
                                                }
                                            },
                                            className: "w-full bg-zinc-800 text-white text-3xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-rose-600"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 2081,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 2077,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-zinc-900 rounded-lg p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-zinc-400 text-sm block mb-2",
                                            children: "Reps"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 2097,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            inputMode: "numeric",
                                            value: setData.reps ?? '',
                                            onChange: (e)=>setSetData({
                                                    ...setData,
                                                    reps: parseInt(e.target.value) || 0
                                                }),
                                            className: "w-full bg-zinc-800 text-white text-3xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-rose-600"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 2098,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 2096,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 2075,
                            columnNumber: 13
                        }, this),
                        isWarmupSet ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSkipWarmup,
                                    className: "bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                    children: "Skip Warmup"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 2111,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCompleteSet,
                                    className: "bg-rose-700 hover:bg-rose-600 text-white py-4 rounded-lg text-lg font-bold transition-colors",
                                    children: "✓ Complete Warmup"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 2117,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 2110,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleCompleteSet,
                                className: "w-full bg-rose-700 hover:bg-rose-600 text-white py-4 rounded-lg text-xl font-bold transition-colors",
                                children: [
                                    "✓ Complete Set ",
                                    currentSetIndex
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 2126,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 2125,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 2044,
                    columnNumber: 11
                }, this),
                displayCompletedSets.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-4 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm mb-2",
                            children: "COMPLETED SETS"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 2140,
                            columnNumber: 13
                        }, this),
                        displayCompletedSets.map((set, index)=>{
                            const label = displayWarmupCompleted ? index === 0 ? 'Warmup' : `Set ${index}` : `Set ${index + 1}`;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-rose-300 text-sm mb-1",
                                children: [
                                    "✓ ",
                                    label,
                                    ": ",
                                    formatMetric(set.weight, metricInfo, isMachine),
                                    " × ",
                                    set.reps,
                                    " reps"
                                ]
                            }, index, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 2146,
                                columnNumber: 17
                            }, this);
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 2139,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-4 mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm mb-2",
                            children: "FORM TIPS"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 2156,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-zinc-200 text-base leading-relaxed",
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFormTips"])(exercise.tips)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 2157,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 2155,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: isReviewMode ? '' : 'grid grid-cols-2 gap-4',
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getVideoUrl"])(exercise.name, exercise.videoUrl),
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "block bg-red-600 hover:bg-red-700 text-white text-center py-3 rounded-lg font-semibold transition-colors",
                            children: "📺 Watch Video"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 2162,
                            columnNumber: 11
                        }, this),
                        !isReviewMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                if (completedSets.length > 0) {
                                    handleEndExercise();
                                    return;
                                }
                                void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$autosave$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["autosaveWorkout"])({
                                    type: 'exercise_skip'
                                });
                                if (currentExerciseIndex < workout.exercises.length - 1) {
                                    const nextExerciseIndex = currentExerciseIndex + 1;
                                    setCurrentExerciseIndex(nextExerciseIndex);
                                    setViewingExerciseIndex(nextExerciseIndex);
                                    setCompletedSets([]);
                                    // Initialize next exercise
                                    const nextExercise = workout.exercises[nextExerciseIndex];
                                    if (nextExercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single) {
                                        initSingleExerciseState(nextExercise);
                                    } else {
                                        const b2bEx = nextExercise;
                                        const defaultMachineOnly1 = !!b2bEx.exercises[0].isMachine && isExerciseWeightMetric(b2bEx.exercises[0]) && b2bEx.exercises[0].targetWeight <= 0;
                                        const defaultMachineOnly2 = !!b2bEx.exercises[1].isMachine && isExerciseWeightMetric(b2bEx.exercises[1]) && b2bEx.exercises[1].targetWeight <= 0;
                                        setSetData1({
                                            weight: defaultMachineOnly1 ? 0 : b2bEx.exercises[0].targetWeight,
                                            reps: b2bEx.exercises[0].targetReps
                                        });
                                        setSetData2({
                                            weight: defaultMachineOnly2 ? 0 : b2bEx.exercises[1].targetWeight,
                                            reps: b2bEx.exercises[1].targetReps
                                        });
                                        setMachineOnly1(defaultMachineOnly1);
                                        setMachineOnly2(defaultMachineOnly2);
                                        setMachineOnlyHoldWeight1(b2bEx.exercises[0].targetWeight);
                                        setMachineOnlyHoldWeight2(b2bEx.exercises[1].targetWeight);
                                        setCurrentSetIndex(1);
                                        setCurrentExerciseInPair(0);
                                        setCompletedPairs([]);
                                        setWarmupDecision('skip');
                                        setWarmupCompleted(false);
                                    }
                                } else {
                                    // Always go to cardio (optional)
                                    router.push(`/workout/${encodeURIComponent(workout.name)}/cardio${routineQuery}`);
                                }
                            },
                            className: "bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                            children: completedSets.length > 0 ? 'End Exercise' : 'Skip Exercise'
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 2171,
                            columnNumber: 13
                        }, this),
                        exerciseModals
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 2161,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 1913,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/workout/[name]/active/page.tsx",
        lineNumber: 1912,
        columnNumber: 5
    }, this);
}
function ActiveWorkoutPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white text-2xl",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 2236,
                columnNumber: 9
            }, void 0)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 2235,
            columnNumber: 7
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActiveWorkoutContent, {}, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 2239,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/workout/[name]/active/page.tsx",
        lineNumber: 2234,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bfe5113e._.js.map