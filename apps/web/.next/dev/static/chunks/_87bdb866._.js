(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/session-workout.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const key = buildKey(SESSION_PREFIX, workoutName, routineId);
    const stored = sessionStorage.getItem(key);
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch (error) {
        console.error('Failed to parse session workout override:', error);
        return null;
    }
}
function saveSessionWorkout(plan, routineId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const key = buildKey(SESSION_PREFIX, plan.name, routineId);
    sessionStorage.setItem(key, JSON.stringify(plan));
}
function clearSessionWorkout(workoutName, routineId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const key = buildKey(SESSION_PREFIX, workoutName, routineId);
    sessionStorage.removeItem(key);
}
function loadSessionTargetsMeta(workoutName, routineId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const key = buildKey(TARGETS_META_PREFIX, workoutName, routineId);
    const stored = sessionStorage.getItem(key);
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch (error) {
        console.error('Failed to parse session targets meta:', error);
        return null;
    }
}
function saveSessionTargetsMeta(workoutName, routineId, meta) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const key = buildKey(TARGETS_META_PREFIX, workoutName, routineId);
    if (!meta) {
        sessionStorage.removeItem(key);
        return;
    }
    sessionStorage.setItem(key, JSON.stringify(meta));
}
function clearSessionTargetsMeta(workoutName, routineId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const key = buildKey(TARGETS_META_PREFIX, workoutName, routineId);
    sessionStorage.removeItem(key);
}
function hasChangeWarningAck(workoutName, routineId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const key = buildKey(WARNING_PREFIX, workoutName, routineId);
    return sessionStorage.getItem(key) === '1';
}
function acknowledgeChangeWarning(workoutName, routineId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const key = buildKey(WARNING_PREFIX, workoutName, routineId);
    sessionStorage.setItem(key, '1');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/workout-session.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-client] (ecmascript)");
;
const STORAGE_KEY = 'current_workout_session';
function isSessionMode(value) {
    return value === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODES"].progress || value === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODES"].maintenance || value === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODES"].light;
}
function resolveSessionMode(value, fallback = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODES"].progress) {
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
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    const rawRoutineId = parsed.routineId;
    const nextRoutineId = typeof rawRoutineId === 'number' ? rawRoutineId : Number(rawRoutineId);
    parsed.routineId = Number.isFinite(nextRoutineId) ? nextRoutineId : null;
    const rawSessionId = parsed.sessionId;
    const nextSessionId = typeof rawSessionId === 'number' ? rawSessionId : Number(rawSessionId);
    parsed.sessionId = Number.isFinite(nextSessionId) ? nextSessionId : null;
    return parsed;
}
function setWorkoutSessionId(sessionId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const session = getWorkoutSession();
    if (!session) return;
    if (session.sessionId === sessionId) return;
    session.sessionId = sessionId;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}
function addExerciseToSession(exercise) {
    const session = getWorkoutSession();
    if (!session) return;
    session.exercises.push(exercise);
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
}
function addCardioToSession(cardio) {
    const session = getWorkoutSession();
    if (!session) return;
    session.cardio = cardio;
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
}
function clearWorkoutSession() {
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.removeItem(STORAGE_KEY);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/units.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/metric-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/units.ts [app-client] (ecmascript)");
;
;
function isPrimaryMetric(value) {
    return Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"]).includes(value);
}
function resolvePrimaryMetric(primaryMetric, isBodyweight) {
    if (isPrimaryMetric(primaryMetric)) return primaryMetric;
    if (isBodyweight) return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].repsOnly;
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight;
}
function resolveMetricUnit(primaryMetric, metricUnit, weightUnit, heightUnit) {
    switch(primaryMetric){
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight:
            return weightUnit;
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].height:
            return heightUnit;
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].time:
            return metricUnit || 'sec';
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].distance:
            return metricUnit || 'm';
        default:
            return null;
    }
}
function getDefaultMetricUnit(primaryMetric) {
    switch(primaryMetric){
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight:
            return 'lbs';
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].height:
            return 'in';
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].time:
            return 'sec';
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].distance:
            return 'm';
        default:
            return null;
    }
}
function getMetricLabel(primaryMetric, metricUnit, weightUnit, heightUnit, isMachine) {
    const resolvedUnit = resolveMetricUnit(primaryMetric, metricUnit, weightUnit, heightUnit);
    switch(primaryMetric){
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight:
            return isMachine ? `Added Weight (${resolvedUnit})` : `Weight (${resolvedUnit})`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].height:
            return `Height (${resolvedUnit})`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].time:
            return `Time (${resolvedUnit})`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].distance:
            return `Distance (${resolvedUnit})`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].repsOnly:
            return 'Reps';
        default:
            return 'Value';
    }
}
function convertMetricFromStorage(value, primaryMetric, weightUnit, heightUnit) {
    if (!Number.isFinite(value)) return 0;
    if (primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertWeightFromStorage"])(value, weightUnit);
    }
    if (primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].height) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertHeightFromStorage"])(value, heightUnit);
    }
    return value;
}
function convertMetricToStorage(value, primaryMetric, weightUnit, heightUnit) {
    if (!Number.isFinite(value)) return 0;
    if (primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertWeightToStorage"])(value, weightUnit);
    }
    if (primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].height) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertHeightToStorage"])(value, heightUnit);
    }
    return value;
}
function formatMetricDisplay(value, primaryMetric, metricUnit, weightUnit, heightUnit, isMachine) {
    if (primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatWeightDisplay"])(value, weightUnit, isMachine);
    }
    const resolvedUnit = resolveMetricUnit(primaryMetric, metricUnit, weightUnit, heightUnit);
    const displayValue = convertMetricFromStorage(value, primaryMetric, weightUnit, heightUnit);
    return resolvedUnit ? `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDisplayNumber"])(displayValue)} ${resolvedUnit}` : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDisplayNumber"])(displayValue);
}
function formatMetricInputValue(value, primaryMetric, weightUnit, heightUnit, allowBlank = false) {
    if (allowBlank && value === 0) return '';
    const displayValue = convertMetricFromStorage(value, primaryMetric, weightUnit, heightUnit);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDisplayNumber"])(displayValue);
}
function parseMetricInput(value, primaryMetric, weightUnit, heightUnit) {
    if (value === '') return 0;
    const num = parseFloat(value);
    if (!Number.isFinite(num)) return null;
    return convertMetricToStorage(num, primaryMetric, weightUnit, heightUnit);
}
function isRepsOnlyMetric(primaryMetric) {
    return primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].repsOnly;
}
function isWeightMetric(primaryMetric) {
    return primaryMetric === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_PRIMARY_METRICS"].weight;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/workout/[name]/summary/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SummaryPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-workout.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-session.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/units.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/metric-utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function extractReportTargets(plan) {
    if (!plan) return [];
    const targets = [];
    for (const exercise of plan.exercises){
        if (exercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single) {
            targets.push({
                name: exercise.name,
                targetWeight: Number.isFinite(exercise.targetWeight) ? exercise.targetWeight : null,
                targetReps: Number.isFinite(exercise.targetReps) ? exercise.targetReps : null,
                isBodyweight: exercise.isBodyweight ?? false,
                isMachine: exercise.isMachine ?? false,
                primaryMetric: exercise.primaryMetric,
                metricUnit: exercise.metricUnit ?? null
            });
        } else {
            const [ex1, ex2] = exercise.exercises;
            targets.push({
                name: ex1.name,
                targetWeight: Number.isFinite(ex1.targetWeight) ? ex1.targetWeight : null,
                targetReps: Number.isFinite(ex1.targetReps) ? ex1.targetReps : null,
                isBodyweight: ex1.isBodyweight ?? false,
                isMachine: ex1.isMachine ?? false,
                primaryMetric: ex1.primaryMetric,
                metricUnit: ex1.metricUnit ?? null
            });
            targets.push({
                name: ex2.name,
                targetWeight: Number.isFinite(ex2.targetWeight) ? ex2.targetWeight : null,
                targetReps: Number.isFinite(ex2.targetReps) ? ex2.targetReps : null,
                isBodyweight: ex2.isBodyweight ?? false,
                isMachine: ex2.isMachine ?? false,
                primaryMetric: ex2.primaryMetric,
                metricUnit: ex2.metricUnit ?? null
            });
        }
    }
    return targets;
}
function SummaryPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [workout, setWorkout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [sessionData, setSessionData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saved, setSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [totalVolume, setTotalVolume] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [totalDuration, setTotalDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [report, setReport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [reportLoading, setReportLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [weightUnit, setWeightUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_WEIGHT_UNIT"]);
    const [heightUnit, setHeightUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_HEIGHT_UNIT"]);
    const getMetricInfo = (entry)=>({
            primaryMetric: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolvePrimaryMetric"])(entry.primaryMetric, entry.isBodyweight),
            metricUnit: entry.metricUnit ?? null
        });
    const formatMetric = (value, entry, isMachine)=>{
        const metricInfo = getMetricInfo(entry);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMetricDisplay"])(value, metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine);
    };
    const formatVolume = (volume)=>Math.round((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertWeightFromStorage"])(volume, weightUnit)).toLocaleString();
    const reportTargets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SummaryPage.useMemo[reportTargets]": ()=>extractReportTargets(workout)
    }["SummaryPage.useMemo[reportTargets]"], [
        workout
    ]);
    const reportTargetsByName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SummaryPage.useMemo[reportTargetsByName]": ()=>{
            const map = new Map();
            for (const target of reportTargets){
                map.set(target.name, target);
            }
            return map;
        }
    }["SummaryPage.useMemo[reportTargetsByName]"], [
        reportTargets
    ]);
    // Prevent double-save in React Strict Mode / re-renders
    const hasSavedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const hasReportedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SummaryPage.useEffect": ()=>{
            let isMounted = true;
            async function fetchUserSettings() {
                try {
                    const response = await fetch('/api/user/settings');
                    if (!response.ok) return;
                    const data = await response.json();
                    if (!isMounted) return;
                    setWeightUnit((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWeightUnit"])(data?.weightUnit));
                    setHeightUnit((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeHeightUnit"])(data?.heightUnit));
                } catch (error) {
                    console.error('Error fetching user settings:', error);
                }
            }
            fetchUserSettings();
            return ({
                "SummaryPage.useEffect": ()=>{
                    isMounted = false;
                }
            })["SummaryPage.useEffect"];
        }
    }["SummaryPage.useEffect"], []);
    // Get routineId from URL params (for public/favorited routines)
    const routineIdParam = searchParams.get('routineId');
    // ---------------------------
    // Fetch workout
    // ---------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SummaryPage.useEffect": ()=>{
            async function fetchWorkout() {
                try {
                    let apiUrl = `/api/workout/${params.name}`;
                    if (routineIdParam) {
                        apiUrl += `?routineId=${routineIdParam}`;
                    }
                    const response = await fetch(apiUrl);
                    if (!response.ok) throw new Error('Workout not found');
                    const data = await response.json();
                    setWorkout(data.workout);
                } catch (error) {
                    console.error('Error fetching workout:', error);
                } finally{
                    setLoading(false);
                }
            }
            fetchWorkout();
        }
    }["SummaryPage.useEffect"], [
        params.name,
        routineIdParam
    ]);
    // ---------------------------
    // Load session + compute stats
    // ---------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SummaryPage.useEffect": ()=>{
            const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkoutSession"])();
            if (!session) {
                console.error('No session data found');
                return;
            }
            setSessionData(session);
            // Calculate total volume (weight-based only)
            let volume = 0;
            for (const exercise of session.exercises){
                const meta = reportTargetsByName.get(exercise.name);
                const metricInfo = getMetricInfo({
                    primaryMetric: exercise.primaryMetric ?? meta?.primaryMetric,
                    metricUnit: exercise.metricUnit ?? meta?.metricUnit,
                    isBodyweight: meta?.isBodyweight
                });
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWeightMetric"])(metricInfo.primaryMetric)) {
                    if (exercise.warmup) {
                        volume += exercise.warmup.weight * exercise.warmup.reps;
                    }
                    for (const set of exercise.sets){
                        volume += set.weight * set.reps;
                    }
                }
                if (exercise.b2bPartner) {
                    const partnerMeta = reportTargetsByName.get(exercise.b2bPartner.name);
                    const partnerMetricInfo = getMetricInfo({
                        primaryMetric: exercise.b2bPartner.primaryMetric ?? partnerMeta?.primaryMetric,
                        metricUnit: exercise.b2bPartner.metricUnit ?? partnerMeta?.metricUnit,
                        isBodyweight: partnerMeta?.isBodyweight
                    });
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWeightMetric"])(partnerMetricInfo.primaryMetric)) {
                        if (exercise.b2bPartner.warmup) {
                            volume += exercise.b2bPartner.warmup.weight * exercise.b2bPartner.warmup.reps;
                        }
                        for (const set of exercise.b2bPartner.sets){
                            volume += set.weight * set.reps;
                        }
                    }
                }
            }
            setTotalVolume(Math.round(volume));
            // Calculate duration
            const startTime = new Date(session.startTime);
            const endTime = new Date();
            const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
            setTotalDuration(durationMinutes);
        }
    }["SummaryPage.useEffect"], [
        reportTargetsByName
    ]);
    // ---------------------------
    // AUTO-SAVE WORKOUT (with duplicate protection)
    // ---------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SummaryPage.useEffect": ()=>{
            if (!sessionData) return;
            if (hasSavedRef.current) return; // React Strict Mode protection
            const sessionKey = `workout-saved-${sessionData.startTime}`;
            // Prevent saving same session twice (refresh / navigation)
            if (localStorage.getItem(sessionKey)) {
                console.log('⚠️ Workout already saved, skipping');
                hasSavedRef.current = true;
                setSaved(true);
                return;
            }
            const saveWorkout = {
                "SummaryPage.useEffect.saveWorkout": async ()=>{
                    setSaving(true);
                    hasSavedRef.current = true;
                    try {
                        const response = await fetch('/api/save-workout', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(sessionData)
                        });
                        if (!response.ok) {
                            throw new Error('Failed to save workout');
                        }
                        // Mark as saved in localStorage
                        localStorage.setItem(sessionKey, 'true');
                        setSaved(true);
                        console.log('✅ Workout auto-saved');
                    } catch (error) {
                        console.error('❌ Error saving workout:', error);
                        hasSavedRef.current = false; // allow retry if needed
                    } finally{
                        setSaving(false);
                    }
                }
            }["SummaryPage.useEffect.saveWorkout"];
            saveWorkout();
        }
    }["SummaryPage.useEffect"], [
        sessionData
    ]);
    // ---------------------------
    // Generate workout report
    // ---------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SummaryPage.useEffect": ()=>{
            if (!sessionData) return;
            if (hasReportedRef.current) return;
            const generateReport = {
                "SummaryPage.useEffect.generateReport": async ()=>{
                    setReportLoading(true);
                    hasReportedRef.current = true;
                    try {
                        const sessionRoutineId = routineIdParam ?? (typeof sessionData.routineId === 'number' ? String(sessionData.routineId) : null);
                        const sessionTargetsPlan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadSessionWorkout"])(sessionData.workoutName, sessionRoutineId);
                        const reportTargets = extractReportTargets(sessionTargetsPlan);
                        const targetsMeta = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadSessionTargetsMeta"])(sessionData.workoutName, sessionRoutineId);
                        const preWorkoutTargets = targetsMeta || reportTargets.length > 0 ? {
                            sessionMode: targetsMeta?.sessionMode ?? null,
                            source: targetsMeta?.source ?? null,
                            encouragement: targetsMeta?.encouragement ?? null,
                            goalSummary: targetsMeta?.goalSummary ?? null,
                            trendSummary: targetsMeta?.trendSummary ?? null,
                            targets: reportTargets
                        } : null;
                        const query = new URLSearchParams();
                        if (typeof sessionData.sessionId === 'number') {
                            query.set('sessionId', String(sessionData.sessionId));
                        }
                        if (sessionData.startTime) {
                            query.set('sessionKey', sessionData.startTime);
                        }
                        const checkResponse = await fetch(`/api/workout-report?${query.toString()}`);
                        if (checkResponse.ok) {
                            const existing = await checkResponse.json();
                            if (existing?.report) {
                                setReport(existing.report);
                                return;
                            }
                        }
                        const response = await fetch('/api/workout-report', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                sessionData,
                                preWorkoutTargets
                            })
                        });
                        if (!response.ok) {
                            throw new Error('Failed to generate report');
                        }
                        const data = await response.json();
                        setReport(data.report || null);
                    } catch (error) {
                        console.error('Error generating report:', error);
                        hasReportedRef.current = false;
                    } finally{
                        setReportLoading(false);
                    }
                }
            }["SummaryPage.useEffect.generateReport"];
            generateReport();
        }
    }["SummaryPage.useEffect"], [
        sessionData,
        routineIdParam
    ]);
    // ---------------------------
    // Complete workout = just go to routines
    // ---------------------------
    const handleCompleteWorkout = ()=>{
        router.push('/routines');
    };
    // ---------------------------
    // UI STATES
    // ---------------------------
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white text-2xl",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/summary/page.tsx",
                lineNumber: 357,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/summary/page.tsx",
            lineNumber: 356,
            columnNumber: 7
        }, this);
    }
    if (!workout) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-white text-2xl mb-4",
                        children: "Workout not found"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/summary/page.tsx",
                        lineNumber: 366,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/routines",
                        className: "text-blue-400 hover:text-blue-300",
                        children: "Back to routines"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/summary/page.tsx",
                        lineNumber: 367,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/summary/page.tsx",
                lineNumber: 365,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/summary/page.tsx",
            lineNumber: 364,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-900 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-2xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-8xl mb-4",
                            children: "🎉"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 380,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl font-bold text-white mb-2",
                            children: "Workout Complete!"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 381,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-xl mb-2",
                            children: workout.name
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 382,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-500",
                            children: new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 383,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                    lineNumber: 379,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-6 mb-8 border-2 border-green-600",
                    children: sessionData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-sm mb-2",
                                children: "Total Volume"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                lineNumber: 397,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white text-4xl font-bold mb-1",
                                children: [
                                    formatVolume(totalVolume),
                                    " ",
                                    weightUnit
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                lineNumber: 398,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-500 text-sm mt-2",
                                children: [
                                    "Duration: ",
                                    totalDuration,
                                    " minutes"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                lineNumber: 401,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs mt-2",
                                children: [
                                    saving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-yellow-400",
                                        children: "Saving workout..."
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                        lineNumber: 407,
                                        columnNumber: 28
                                    }, this),
                                    saved && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-green-400",
                                        children: "✓ Workout saved"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                        lineNumber: 408,
                                        columnNumber: 27
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                lineNumber: 406,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/summary/page.tsx",
                        lineNumber: 396,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-zinc-400",
                        children: "Loading session data..."
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/summary/page.tsx",
                        lineNumber: 412,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                    lineNumber: 394,
                    columnNumber: 9
                }, this),
                (reportLoading || report) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-6 mb-8 border border-zinc-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-300 text-sm font-semibold mb-3",
                            children: "Workout Report"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 418,
                            columnNumber: 13
                        }, this),
                        reportLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm",
                            children: "Generating your report..."
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 420,
                            columnNumber: 15
                        }, this),
                        report && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-200 text-sm whitespace-pre-line",
                            children: report
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 423,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                    lineNumber: 417,
                    columnNumber: 11
                }, this),
                sessionData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-6 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold text-white mb-4",
                            children: "EXERCISES COMPLETED"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 431,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: sessionData.exercises.map((exercise, index)=>{
                                const targetMeta = reportTargetsByName.get(exercise.name);
                                const metricInfo = getMetricInfo({
                                    primaryMetric: exercise.primaryMetric ?? targetMeta?.primaryMetric,
                                    metricUnit: exercise.metricUnit ?? targetMeta?.metricUnit,
                                    isBodyweight: targetMeta?.isBodyweight
                                });
                                const partnerMeta = exercise.b2bPartner?.name ? reportTargetsByName.get(exercise.b2bPartner.name) : undefined;
                                const partnerMetricInfo = getMetricInfo({
                                    primaryMetric: exercise.b2bPartner?.primaryMetric ?? partnerMeta?.primaryMetric,
                                    metricUnit: exercise.b2bPartner?.metricUnit ?? partnerMeta?.metricUnit,
                                    isBodyweight: partnerMeta?.isBodyweight
                                });
                                const isMachine = !!exercise.isMachine && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWeightMetric"])(metricInfo.primaryMetric);
                                const isPartnerMachine = !!exercise.b2bPartner?.isMachine && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWeightMetric"])(partnerMetricInfo.primaryMetric);
                                const hasWeightVolume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWeightMetric"])(metricInfo.primaryMetric) || exercise.b2bPartner && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWeightMetric"])(partnerMetricInfo.primaryMetric);
                                let exerciseVolume = 0;
                                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWeightMetric"])(metricInfo.primaryMetric)) {
                                    exerciseVolume += (exercise.warmup ? exercise.warmup.weight * exercise.warmup.reps : 0) + exercise.sets.reduce((sum, set)=>sum + set.weight * set.reps, 0);
                                }
                                if (exercise.b2bPartner && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWeightMetric"])(partnerMetricInfo.primaryMetric)) {
                                    exerciseVolume += (exercise.b2bPartner.warmup ? exercise.b2bPartner.warmup.weight * exercise.b2bPartner.warmup.reps : 0) + exercise.b2bPartner.sets.reduce((sum, set)=>sum + set.weight * set.reps, 0);
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-l-4 border-green-500 pl-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-white font-semibold mb-1",
                                            children: exercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single ? exercise.name : `B2B: ${exercise.name} / ${exercise.b2bPartner?.name}`
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                            lineNumber: 470,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-zinc-400 text-sm mb-2",
                                            children: [
                                                exercise.sets.length,
                                                " sets",
                                                hasWeightVolume && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        " • ",
                                                        formatVolume(exerciseVolume),
                                                        " ",
                                                        weightUnit,
                                                        " volume"
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                            lineNumber: 475,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1 text-xs",
                                            children: [
                                                exercise.warmup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-zinc-500",
                                                    children: [
                                                        "Warmup: ",
                                                        formatMetric(exercise.warmup.weight, {
                                                            primaryMetric: metricInfo.primaryMetric,
                                                            metricUnit: metricInfo.metricUnit,
                                                            isBodyweight: targetMeta?.isBodyweight
                                                        }, isMachine),
                                                        " ×",
                                                        ' ',
                                                        exercise.warmup.reps,
                                                        " reps"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                                    lineNumber: 483,
                                                    columnNumber: 25
                                                }, this),
                                                exercise.sets.map((set, setIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-zinc-300",
                                                        children: [
                                                            "Set ",
                                                            setIndex + 1,
                                                            ": ",
                                                            formatMetric(set.weight, {
                                                                primaryMetric: metricInfo.primaryMetric,
                                                                metricUnit: metricInfo.metricUnit,
                                                                isBodyweight: targetMeta?.isBodyweight
                                                            }, isMachine),
                                                            " × ",
                                                            set.reps,
                                                            " reps",
                                                            exercise.b2bPartner && exercise.b2bPartner.sets[setIndex] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-purple-400",
                                                                children: [
                                                                    ' + ',
                                                                    formatMetric(exercise.b2bPartner.sets[setIndex].weight, {
                                                                        primaryMetric: partnerMetricInfo.primaryMetric,
                                                                        metricUnit: partnerMetricInfo.metricUnit,
                                                                        isBodyweight: partnerMeta?.isBodyweight
                                                                    }, isPartnerMachine),
                                                                    " ×",
                                                                    ' ',
                                                                    exercise.b2bPartner.sets[setIndex].reps,
                                                                    " reps"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                                                lineNumber: 501,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, setIndex, true, {
                                                        fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                                        lineNumber: 493,
                                                        columnNumber: 25
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                            lineNumber: 481,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, index, true, {
                                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                    lineNumber: 469,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 432,
                            columnNumber: 13
                        }, this),
                        sessionData.cardio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 pt-4 border-t border-zinc-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-white font-semibold mb-1",
                                    children: [
                                        "Cardio: ",
                                        sessionData.cardio.type
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                    lineNumber: 521,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-400 text-sm",
                                    children: [
                                        sessionData.cardio.time,
                                        " min",
                                        sessionData.cardio.speed && ` • ${sessionData.cardio.speed} mph`,
                                        sessionData.cardio.incline && ` • ${sessionData.cardio.incline}% incline`
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                    lineNumber: 524,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 520,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                    lineNumber: 430,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleCompleteWorkout,
                    className: "w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors mb-4",
                    children: "✅ Finish & Go Home"
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                    lineNumber: 536,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/workout/[name]/summary/page.tsx",
            lineNumber: 377,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/workout/[name]/summary/page.tsx",
        lineNumber: 376,
        columnNumber: 5
    }, this);
}
_s(SummaryPage, "okRlOM9YD47XBHgJsnSbmBy+Rws=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = SummaryPage;
var _c;
__turbopack_context__.k.register(_c, "SummaryPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_87bdb866._.js.map