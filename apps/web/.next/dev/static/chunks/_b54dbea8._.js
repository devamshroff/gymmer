(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/workout-media.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/stretch-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatStretchTimer",
    ()=>formatStretchTimer
]);
function formatStretchTimer(timerSeconds) {
    if (!timerSeconds || timerSeconds <= 0) {
        return 'Timer not set';
    }
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    if (minutes > 0 && seconds === 0) {
        return `${minutes} min`;
    }
    if (minutes > 0) {
        return `${minutes} min ${seconds} sec`;
    }
    return `${timerSeconds} sec`;
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
"[project]/app/components/SharedUi.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BottomActionBar",
    ()=>BottomActionBar,
    "Card",
    ()=>Card,
    "EmptyState",
    ()=>EmptyState,
    "SectionHeader",
    ()=>SectionHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function Card({ children, className = '', paddingClassName, borderClassName = 'border-zinc-700', borderWidthClassName = 'border-2' }) {
    const padding = paddingClassName || 'p-4';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `bg-zinc-800 rounded-lg ${borderWidthClassName} ${borderClassName} ${padding} ${className}`.trim(),
        children: children
    }, void 0, false, {
        fileName: "[project]/app/components/SharedUi.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = Card;
function EmptyState({ message, description, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg ${className}`.trim(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: message
            }, void 0, false, {
                fileName: "[project]/app/components/SharedUi.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-zinc-600 text-sm mt-1",
                children: description
            }, void 0, false, {
                fileName: "[project]/app/components/SharedUi.tsx",
                lineNumber: 38,
                columnNumber: 23
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/SharedUi.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c1 = EmptyState;
function BottomActionBar({ children, maxWidthClassName = 'max-w-2xl', className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `fixed bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800 ${className}`.trim(),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `${maxWidthClassName} mx-auto`,
            children: children
        }, void 0, false, {
            fileName: "[project]/app/components/SharedUi.tsx",
            lineNumber: 56,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/SharedUi.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_c2 = BottomActionBar;
function SectionHeader({ icon, label, iconClassName = 'text-zinc-400', className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
        className: `text-xl font-bold text-white mb-4 flex items-center gap-2 ${className}`.trim(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: iconClassName,
                children: icon
            }, void 0, false, {
                fileName: "[project]/app/components/SharedUi.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            label
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/SharedUi.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
_c3 = SectionHeader;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "EmptyState");
__turbopack_context__.k.register(_c2, "BottomActionBar");
__turbopack_context__.k.register(_c3, "SectionHeader");
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
function assertPrimaryMetric(value) {
    if (!isPrimaryMetric(value)) {
        throw new Error('primaryMetric is required');
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
"[project]/app/components/ExerciseHistoryModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ExerciseHistoryModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/units.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/metric-utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
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
    _s();
    const [tooltip, setTooltip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
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
    const isRepsPrimary = mode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].reps || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRepsOnlyMetric"])(primaryMetric);
    const isWeightPrimary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWeightMetric"])(primaryMetric);
    const isMachineWeight = !!isMachine && isWeightPrimary;
    const resolvedUnit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveMetricUnit"])(primaryMetric, metricUnit, weightUnit, heightUnit);
    const secondaryUnit = resolvedUnit ?? weightUnit;
    const unitSuffix = resolvedUnit ? ` ${resolvedUnit}` : '';
    const convertPrimaryValue = (value)=>value === null ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertMetricFromStorage"])(value, primaryMetric, weightUnit, heightUnit);
    const useVolume = !isRepsPrimary && isWeightPrimary;
    const primaryValues = points.map((point)=>{
        if (isRepsPrimary) {
            return weightMode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_AGGREGATION_MODES"].max ? point.reps_max : point.reps_avg;
        }
        const rawValue = weightMode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_AGGREGATION_MODES"].max ? point.weight_max : point.weight_avg;
        return convertPrimaryValue(rawValue);
    }).filter((value)=>value !== null);
    const displayTargetValue = targetValue == null ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertMetricFromStorage"])(targetValue, primaryMetric, weightUnit, heightUnit);
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
        const primaryValue = isRepsPrimary ? weightMode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_AGGREGATION_MODES"].max ? point.reps_max : point.reps_avg : convertPrimaryValue(weightMode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_AGGREGATION_MODES"].max ? point.weight_max : point.weight_avg);
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
    const primaryLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMetricLabel"])(primaryMetric, metricUnit, weightUnit, heightUnit, isMachineWeight);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full overflow-x-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: `0 0 ${width} ${height}`,
            className: "w-full min-w-[520px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    stroke: "#1f2937",
                    strokeWidth: 1,
                    children: [
                        0,
                        0.5,
                        1
                    ].map((ratio)=>{
                        const y = margin.top + plotHeight - ratio * plotHeight;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
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
                hasTargetValue && targetY !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    fill: "#94a3b8",
                    fontSize: "12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: margin.left - 12,
                            y: margin.top + 10,
                            textAnchor: "end",
                            children: formatPrimaryValue(primaryMax)
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 281,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: margin.left - 12,
                            y: margin.top + plotHeight,
                            textAnchor: "end",
                            children: formatPrimaryValue(primaryMin)
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 284,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: width - margin.right + 12,
                            y: margin.top + 10,
                            textAnchor: "start",
                            children: formatNumber(secondaryMax)
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 287,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
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
                primaryPath && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: primaryPath,
                    fill: "none",
                    stroke: "#38bdf8",
                    strokeWidth: 3
                }, void 0, false, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 296,
                    columnNumber: 11
                }, this),
                secondaryPath && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: secondaryPath,
                    fill: "none",
                    stroke: "#22c55e",
                    strokeWidth: 3
                }, void 0, false, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 299,
                    columnNumber: 11
                }, this),
                tooltip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    fill: "#e2e8f0",
                    children: [
                        primaryPoints.map((point, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
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
                        secondaryPoints.map((point, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    fill: "#94a3b8",
                    fontSize: "12",
                    children: labelIndexesUnique.map((index)=>{
                        const x = margin.left + index * stepX;
                        const label = formatDayLabel(points[index].day);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    fill: "#94a3b8",
                    fontSize: "12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: margin.left,
                            y: height - 4,
                            textAnchor: "start",
                            children: primaryLabel
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 365,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
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
_s(LineChart, "XaDrOWOd0VLN4F3dKO6gAHepmT8=");
_c = LineChart;
function LoadingCard({ name }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-800 rounded-xl p-4 border border-zinc-700 animate-pulse",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-5 w-40 bg-zinc-700 rounded mb-4"
            }, void 0, false, {
                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                lineNumber: 380,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-40 bg-zinc-900 rounded-lg border border-zinc-700"
            }, void 0, false, {
                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                lineNumber: 381,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 flex justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-3 w-16 bg-zinc-700 rounded"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                        lineNumber: 383,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_c1 = LoadingCard;
function ExerciseHistoryModal({ open, onClose, exerciseNames, title = 'Exercise History', targets, weightUnit, heightUnit }) {
    _s1();
    const resolvedWeightUnit = weightUnit ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_WEIGHT_UNIT"];
    const resolvedHeightUnit = heightUnit ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_HEIGHT_UNIT"];
    const [range, setRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('month');
    const [weightMode, setWeightMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_AGGREGATION_MODES"].max);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const namesKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ExerciseHistoryModal.useMemo[namesKey]": ()=>exerciseNames.join('|')
    }["ExerciseHistoryModal.useMemo[namesKey]"], [
        exerciseNames
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ExerciseHistoryModal.useEffect": ()=>{
            if (!open) return;
            const controller = new AbortController();
            const fetchHistory = {
                "ExerciseHistoryModal.useEffect.fetchHistory": async ()=>{
                    setLoading(true);
                    setError(null);
                    try {
                        const params = new URLSearchParams({
                            range
                        });
                        exerciseNames.forEach({
                            "ExerciseHistoryModal.useEffect.fetchHistory": (name)=>params.append('name', name)
                        }["ExerciseHistoryModal.useEffect.fetchHistory"]);
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
                }
            }["ExerciseHistoryModal.useEffect.fetchHistory"];
            fetchHistory();
            return ({
                "ExerciseHistoryModal.useEffect": ()=>controller.abort()
            })["ExerciseHistoryModal.useEffect"];
        }
    }["ExerciseHistoryModal.useEffect"], [
        open,
        range,
        namesKey,
        exerciseNames
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ExerciseHistoryModal.useEffect": ()=>{
            if (!open) return;
            const handleKeyDown = {
                "ExerciseHistoryModal.useEffect.handleKeyDown": (event)=>{
                    if (event.key === 'Escape') {
                        onClose();
                    }
                }
            }["ExerciseHistoryModal.useEffect.handleKeyDown"];
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "ExerciseHistoryModal.useEffect": ()=>window.removeEventListener('keydown', handleKeyDown)
            })["ExerciseHistoryModal.useEffect"];
        }
    }["ExerciseHistoryModal.useEffect"], [
        open,
        onClose
    ]);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-900 border border-zinc-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto",
            onClick: (event)=>event.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 border-b border-zinc-800 flex items-start justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-2xl font-bold text-white",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                    lineNumber: 464,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap items-center justify-between gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        'week',
                                        'month',
                                        'all'
                                    ].map((value)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_AGGREGATION_MODES"]).map((value)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setWeightMode(value),
                                            className: `px-3 py-2 rounded-lg text-sm font-semibold border ${weightMode === value ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'}`,
                                            children: value === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_AGGREGATION_MODES"].max ? 'Max' : 'Avg'
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
                        loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm",
                            children: "Loading history..."
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 510,
                            columnNumber: 13
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-red-400 text-sm",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 513,
                            columnNumber: 13
                        }, this),
                        !loading && !error && exerciseNames.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-500 text-sm",
                            children: "No exercise selected."
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 517,
                            columnNumber: 13
                        }, this),
                        loading && exerciseNames.map((name)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingCard, {
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
                            const mode = explicitMode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].reps ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].reps : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].weight;
                            const primaryMetric = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolvePrimaryMetric"])(series?.primary_metric, mode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].reps);
                            const metricUnit = typeof series?.metric_unit === 'string' ? series.metric_unit : null;
                            const isMachine = !!series?.is_machine && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWeightMetric"])(primaryMetric);
                            const primaryLegendLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMetricLabel"])(primaryMetric, metricUnit, resolvedWeightUnit, resolvedHeightUnit, isMachine);
                            const targetEntry = targets?.[name];
                            const rawTargetValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRepsOnlyMetric"])(primaryMetric) || mode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].reps ? targetEntry?.reps : targetEntry?.weight;
                            const targetValue = Number.isFinite(rawTargetValue) && rawTargetValue > 0 ? rawTargetValue : null;
                            const resolvedUnit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveMetricUnit"])(primaryMetric, metricUnit, resolvedWeightUnit, resolvedHeightUnit);
                            const secondaryLegendLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRepsOnlyMetric"])(primaryMetric) || mode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_HISTORY_DISPLAY_MODES"].reps ? 'Total Reps' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWeightMetric"])(primaryMetric) ? `Volume (${resolvedUnit ?? resolvedWeightUnit})` : 'Total Reps';
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-zinc-800 rounded-xl p-4 border border-zinc-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center justify-between mb-4 gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-white text-lg font-semibold",
                                                children: name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                                lineNumber: 551,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 text-xs text-zinc-400",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                    targetValue !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                    points.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-400",
                                        children: "No history yet. Finish a workout with this exercise to populate the graph."
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                        lineNumber: 570,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LineChart, {
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
_s1(ExerciseHistoryModal, "kHmOLpHjlpd52fZKtrSeGtofm5Y=");
_c2 = ExerciseHistoryModal;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "LineChart");
__turbopack_context__.k.register(_c1, "LoadingCard");
__turbopack_context__.k.register(_c2, "ExerciseHistoryModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/lib/workout-bootstrap.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bumpRoutineEditVersion",
    ()=>bumpRoutineEditVersion,
    "clearWorkoutBootstrapCache",
    ()=>clearWorkoutBootstrapCache,
    "invalidateWorkoutBootstrapCache",
    ()=>invalidateWorkoutBootstrapCache,
    "loadWorkoutBootstrapCache",
    ()=>loadWorkoutBootstrapCache,
    "saveWorkoutBootstrapCache",
    ()=>saveWorkoutBootstrapCache
]);
const BOOTSTRAP_PREFIX = 'workout_bootstrap';
const EDIT_PREFIX = 'routine_edit_version';
function buildCacheKey(workoutName, routineId) {
    const safeName = encodeURIComponent(workoutName);
    const safeRoutine = routineId ? encodeURIComponent(routineId) : 'default';
    return `${BOOTSTRAP_PREFIX}:${safeName}:${safeRoutine}`;
}
function buildEditKey(scope) {
    return `${EDIT_PREFIX}:${scope}`;
}
function getEditVersionById(routineId) {
    if (("TURBOPACK compile-time value", "object") === 'undefined' || routineId === null || routineId === undefined) return null;
    const key = buildEditKey(`id:${routineId}`);
    return localStorage.getItem(key) ?? '0';
}
function getEditVersionByName(workoutName) {
    if (("TURBOPACK compile-time value", "object") === 'undefined' || !workoutName) return null;
    const key = buildEditKey(`name:${encodeURIComponent(workoutName)}`);
    return localStorage.getItem(key) ?? '0';
}
function isCacheEntryValid(entry, workoutName, routineId) {
    const currentIdVersion = getEditVersionById(routineId);
    if (entry.editVersionId && currentIdVersion && entry.editVersionId !== currentIdVersion) {
        return false;
    }
    const currentNameVersion = getEditVersionByName(workoutName);
    if (entry.editVersionName && currentNameVersion && entry.editVersionName !== currentNameVersion) {
        return false;
    }
    return true;
}
function loadWorkoutBootstrapCache(params) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const { workoutName, routineId } = params;
    const keys = [
        buildCacheKey(workoutName, routineId)
    ];
    if (routineId) {
        keys.push(buildCacheKey(workoutName, null));
    }
    for (const key of keys){
        const stored = sessionStorage.getItem(key);
        if (!stored) continue;
        try {
            const entry = JSON.parse(stored);
            if (!isCacheEntryValid(entry, workoutName, routineId)) {
                sessionStorage.removeItem(key);
                continue;
            }
            return entry;
        } catch (error) {
            console.error('Failed to parse workout bootstrap cache:', error);
            sessionStorage.removeItem(key);
        }
    }
    return null;
}
function saveWorkoutBootstrapCache(params) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const { workoutName, routineId, payload } = params;
    const entry = {
        ...payload,
        cachedAt: new Date().toISOString(),
        editVersionId: getEditVersionById(routineId),
        editVersionName: getEditVersionByName(workoutName)
    };
    const serialized = JSON.stringify(entry);
    sessionStorage.setItem(buildCacheKey(workoutName, routineId), serialized);
    if (routineId) {
        sessionStorage.setItem(buildCacheKey(workoutName, null), serialized);
    }
}
function clearWorkoutBootstrapCache(params) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const { workoutName, routineId } = params;
    sessionStorage.removeItem(buildCacheKey(workoutName, routineId));
    if (routineId) {
        sessionStorage.removeItem(buildCacheKey(workoutName, null));
    }
}
function bumpRoutineEditVersion(params) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const stamp = String(Date.now());
    if (params.routineId !== null && params.routineId !== undefined) {
        localStorage.setItem(buildEditKey(`id:${params.routineId}`), stamp);
    }
    if (params.routineName) {
        localStorage.setItem(buildEditKey(`name:${encodeURIComponent(params.routineName)}`), stamp);
    }
}
function invalidateWorkoutBootstrapCache(params) {
    bumpRoutineEditVersion(params);
    if (!params.routineName) return;
    clearWorkoutBootstrapCache({
        workoutName: params.routineName,
        routineId: params.routineId ? String(params.routineId) : null
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/workout/[name]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorkoutDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-media.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stretch$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/stretch-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-session.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/SharedUi.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExerciseHistoryModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ExerciseHistoryModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-workout.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/units.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/metric-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$bootstrap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-bootstrap.ts [app-client] (ecmascript)");
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
;
;
;
;
;
function getLogSetValue(log, setNum, field) {
    const key = `set${setNum}_${field}`;
    return log[key];
}
const WEIGHT_INCREMENT = 2.5;
function roundUpToIncrement(value, increment) {
    if (!Number.isFinite(value)) return 0;
    return Math.ceil(value / increment) * increment;
}
function roundUpWhole(value) {
    if (!Number.isFinite(value)) return 0;
    return Math.ceil(value);
}
function getMaxesFromLastLog(log) {
    if (!log) {
        return {
            maxWeight: null,
            repsAtMax: null,
            maxReps: null
        };
    }
    let maxWeight = null;
    let repsAtMax = null;
    let maxReps = null;
    for (const i of [
        1,
        2,
        3,
        4
    ]){
        const weight = getLogSetValue(log, i, 'weight');
        const reps = getLogSetValue(log, i, 'reps');
        if (typeof reps === 'number' && Number.isFinite(reps)) {
            maxReps = maxReps === null ? reps : Math.max(maxReps, reps);
        }
        if (typeof weight !== 'number' || !Number.isFinite(weight)) continue;
        if (maxWeight === null || weight > maxWeight) {
            maxWeight = weight;
            repsAtMax = typeof reps === 'number' && Number.isFinite(reps) ? reps : null;
        } else if (weight === maxWeight && typeof reps === 'number' && Number.isFinite(reps)) {
            repsAtMax = repsAtMax === null ? reps : Math.max(repsAtMax, reps);
        }
    }
    return {
        maxWeight,
        repsAtMax,
        maxReps
    };
}
function getSessionFactors(mode) {
    if (mode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODES"].maintenance) return {
        weight: 0.85,
        reps: 0.85
    };
    if (mode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODES"].light) return {
        weight: 0.6,
        reps: 0.6
    };
    return {
        weight: 1.05,
        reps: 1.05
    };
}
function normalizeNarrativeField(value) {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}
function computeLastSessionMaxes(summaries) {
    const lastMaxes = {};
    for (const [name, log] of Object.entries(summaries)){
        const { maxWeight, maxReps } = getMaxesFromLastLog(log);
        lastMaxes[name] = {
            weight: maxWeight,
            reps: maxReps
        };
    }
    return lastMaxes;
}
function buildFallbackNarrative(sessionMode, workoutName, exerciseNames, trendCounts) {
    const encouragement = sessionMode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODES"].progress ? 'Targets are set. Push for a clean win today.' : sessionMode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODES"].maintenance ? 'Targets are set. Keep it steady and controlled today.' : 'Targets are set. Keep it light and focus on smooth reps today.';
    const focusNames = exerciseNames.slice(0, 3);
    const focusText = focusNames.length > 0 ? ` Focus lifts: ${focusNames.join(', ')}.` : '';
    const sessionLabel = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODE_LABELS"][sessionMode] ?? 'Training';
    const workoutLabel = workoutName || 'today';
    const goalSummary = `Goal today: ${sessionLabel} session for ${workoutLabel}.${focusText}`.trim();
    const trendParts = [];
    if (trendCounts.up) trendParts.push(`${trendCounts.up} trending up`);
    if (trendCounts.flat) trendParts.push(`${trendCounts.flat} steady`);
    if (trendCounts.down) trendParts.push(`${trendCounts.down} trending down`);
    if (trendCounts.newData) trendParts.push(`${trendCounts.newData} without recent data`);
    const trendSummary = trendParts.length > 0 ? `Recent sessions: ${trendParts.join(', ')}.` : 'Recent sessions: not enough history yet.';
    return {
        encouragement,
        goalSummary,
        trendSummary
    };
}
function resolveTargetNumber(value, fallback) {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}
function applyTargetsToWorkout(plan, targets) {
    return {
        ...plan,
        exercises: plan.exercises.map((exercise)=>{
            if (exercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single) {
                const suggestion = targets[exercise.name];
                if (!suggestion) return exercise;
                return {
                    ...exercise,
                    targetWeight: resolveTargetNumber(suggestion.suggestedWeight, exercise.targetWeight),
                    targetReps: resolveTargetNumber(suggestion.suggestedReps, exercise.targetReps)
                };
            }
            const [ex1, ex2] = exercise.exercises;
            const nextEx1 = (()=>{
                const suggestion = targets[ex1.name];
                if (!suggestion) return ex1;
                return {
                    ...ex1,
                    targetWeight: resolveTargetNumber(suggestion.suggestedWeight, ex1.targetWeight),
                    targetReps: resolveTargetNumber(suggestion.suggestedReps, ex1.targetReps)
                };
            })();
            const nextEx2 = (()=>{
                const suggestion = targets[ex2.name];
                if (!suggestion) return ex2;
                return {
                    ...ex2,
                    targetWeight: resolveTargetNumber(suggestion.suggestedWeight, ex2.targetWeight),
                    targetReps: resolveTargetNumber(suggestion.suggestedReps, ex2.targetReps)
                };
            })();
            return {
                ...exercise,
                exercises: [
                    nextEx1,
                    nextEx2
                ]
            };
        })
    };
}
function WorkoutDetailPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const isPreview = searchParams.get('preview') === '1';
    const sessionModeParam = searchParams.get('mode');
    const routineIdParam = searchParams.get('routineId');
    const sessionMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSessionMode"])(sessionModeParam) ? sessionModeParam : null;
    const startMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveSessionMode"])(sessionModeParam);
    const [workout, setWorkout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [routineId, setRoutineId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isPublicRoutine, setIsPublicRoutine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDeleteModal, setShowDeleteModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deleting, setDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showHistory, setShowHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [historyExerciseNames, setHistoryExerciseNames] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [targets, setTargets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [targetsLoading, setTargetsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [targetsError, setTargetsError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [targetsNarrative, setTargetsNarrative] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        encouragement: null,
        goalSummary: null,
        trendSummary: null
    });
    const [targetsSource, setTargetsSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastSetSummaries, setLastSetSummaries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [lastSessionMaxes, setLastSessionMaxes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [lastWorkoutReport, setLastWorkoutReport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showLastWorkoutReport, setShowLastWorkoutReport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loadingDots, setLoadingDots] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('...');
    const [weightUnit, setWeightUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_WEIGHT_UNIT"]);
    const [heightUnit, setHeightUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_HEIGHT_UNIT"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkoutDetailPage.useEffect": ()=>{
            setLastSessionMaxes(computeLastSessionMaxes(lastSetSummaries));
        }
    }["WorkoutDetailPage.useEffect"], [
        lastSetSummaries
    ]);
    const cacheTargetsForSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WorkoutDetailPage.useCallback[cacheTargetsForSession]": (nextTargets)=>{
            if (!workout) return;
            const updatedWorkout = applyTargetsToWorkout(workout, nextTargets);
            const sessionRoutineId = routineIdParam ?? (routineId !== null ? String(routineId) : null);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveSessionWorkout"])(updatedWorkout, sessionRoutineId);
        }
    }["WorkoutDetailPage.useCallback[cacheTargetsForSession]"], [
        routineId,
        routineIdParam,
        workout
    ]);
    const baseHistoryTargets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WorkoutDetailPage.useMemo[baseHistoryTargets]": ()=>{
            if (!workout) return {};
            const next = {};
            for (const exercise of workout.exercises){
                if (exercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single) {
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
        }
    }["WorkoutDetailPage.useMemo[baseHistoryTargets]"], [
        workout
    ]);
    const historyTargets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WorkoutDetailPage.useMemo[historyTargets]": ()=>{
            const next = {
                ...baseHistoryTargets
            };
            if (isPreview) {
                for (const [name, suggestion] of Object.entries(targets)){
                    const current = next[name] || {};
                    next[name] = {
                        weight: suggestion.suggestedWeight ?? current.weight ?? null,
                        reps: suggestion.suggestedReps ?? current.reps ?? null
                    };
                }
            }
            return next;
        }
    }["WorkoutDetailPage.useMemo[historyTargets]"], [
        baseHistoryTargets,
        isPreview,
        targets
    ]);
    const allExerciseNames = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WorkoutDetailPage.useMemo[allExerciseNames]": ()=>{
            if (!workout) return [];
            const names = [];
            for (const exercise of workout.exercises){
                if (exercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single) {
                    names.push(exercise.name);
                } else {
                    const [ex1, ex2] = exercise.exercises;
                    names.push(ex1.name, ex2.name);
                }
            }
            return names;
        }
    }["WorkoutDetailPage.useMemo[allExerciseNames]"], [
        workout
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkoutDetailPage.useEffect": ()=>{
            async function fetchWorkout() {
                try {
                    const routineIdParam = searchParams.get('routineId');
                    const decodedName = decodeURIComponent(params.name);
                    const cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$bootstrap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadWorkoutBootstrapCache"])({
                        workoutName: decodedName,
                        routineId: routineIdParam
                    });
                    if (cached) {
                        setWorkout(cached.workout);
                        setLastSetSummaries(cached.lastSetSummaries || {});
                        setLastSessionMaxes(computeLastSessionMaxes(cached.lastSetSummaries || {}));
                        setLastWorkoutReport(cached.lastWorkoutReport ?? null);
                        setWeightUnit((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWeightUnit"])(cached.settings?.weightUnit));
                        setHeightUnit((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeHeightUnit"])(cached.settings?.heightUnit));
                        if (routineIdParam) {
                            setRoutineId(parseInt(routineIdParam));
                            setIsPublicRoutine(true);
                        } else if (cached.routineMeta?.id) {
                            setRoutineId(cached.routineMeta.id ?? null);
                        }
                        setLoading(false);
                        return;
                    }
                    let apiUrl = `/api/workout/${params.name}?bootstrap=1`;
                    if (routineIdParam) {
                        apiUrl += `&routineId=${routineIdParam}`;
                        setRoutineId(parseInt(routineIdParam));
                        setIsPublicRoutine(true);
                    }
                    const response = await fetch(apiUrl);
                    if (!response.ok) {
                        throw new Error('Workout not found');
                    }
                    const data = await response.json();
                    const payload = {
                        workout: data.workout,
                        settings: data.settings,
                        lastSetSummaries: data.lastSetSummaries || {},
                        lastWorkoutReport: data.lastWorkoutReport || null,
                        routineMeta: data.routineMeta
                    };
                    setWorkout(payload.workout);
                    setLastSetSummaries(payload.lastSetSummaries);
                    setLastSessionMaxes(computeLastSessionMaxes(payload.lastSetSummaries));
                    setLastWorkoutReport(payload.lastWorkoutReport);
                    setWeightUnit((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWeightUnit"])(payload.settings?.weightUnit));
                    setHeightUnit((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeHeightUnit"])(payload.settings?.heightUnit));
                    if (!routineIdParam && payload.routineMeta?.id) {
                        setRoutineId(payload.routineMeta.id ?? null);
                    }
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$bootstrap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveWorkoutBootstrapCache"])({
                        workoutName: decodedName,
                        routineId: routineIdParam ?? (payload.routineMeta?.id ? String(payload.routineMeta.id) : null),
                        payload
                    });
                    if (!routineIdParam && !payload.routineMeta?.id) {
                        const routinesResponse = await fetch('/api/routines');
                        const routinesData = await routinesResponse.json();
                        const routine = routinesData.routines.find({
                            "WorkoutDetailPage.useEffect.fetchWorkout.routine": (r)=>r.name === decodedName
                        }["WorkoutDetailPage.useEffect.fetchWorkout.routine"]);
                        if (routine) {
                            setRoutineId(routine.id);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching workout:', error);
                } finally{
                    setLoading(false);
                }
            }
            fetchWorkout();
        }
    }["WorkoutDetailPage.useEffect"], [
        params.name,
        searchParams
    ]);
    const computeFallbackTargets = async ()=>{
        if (!workout) {
            return {
                targets: {},
                narrative: {
                    encouragement: null,
                    goalSummary: null,
                    trendSummary: null
                }
            };
        }
        const fallback = {};
        const { weight: weightFactor, reps: repsFactor } = getSessionFactors(sessionMode);
        const trendCounts = {
            up: 0,
            down: 0,
            flat: 0,
            newData: 0
        };
        const updateTrendCounts = (exercise)=>{
            const log = lastSetSummaries[exercise.name];
            if (!log) {
                trendCounts.newData += 1;
                return;
            }
            trendCounts.flat += 1;
        };
        const buildTarget = (exercise)=>{
            const log = lastSetSummaries[exercise.name];
            const { maxWeight, repsAtMax, maxReps } = getMaxesFromLastLog(log);
            const baseWeight = exercise.targetWeight;
            const baseReps = exercise.targetReps;
            const isBodyweight = !!exercise.isBodyweight;
            const isMachine = !!exercise.isMachine;
            const usesHistory = !!log && (maxWeight !== null || maxReps !== null);
            let suggestedWeight = null;
            let suggestedReps = null;
            let rationale = null;
            if (isBodyweight) {
                const sourceReps = maxReps ?? baseReps;
                const scaledReps = roundUpWhole(sourceReps * repsFactor);
                suggestedReps = Math.max(1, scaledReps);
                rationale = usesHistory ? `Default target uses ${Math.round(repsFactor * 100)}% of your latest session max reps.` : 'Default target uses your routine baseline until more history is logged.';
            } else {
                const sourceWeight = maxWeight ?? baseWeight;
                const sourceReps = repsAtMax ?? maxReps ?? baseReps;
                const scaledWeight = roundUpToIncrement(sourceWeight * weightFactor, WEIGHT_INCREMENT);
                const repFactorForMode = sessionMode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODES"].progress ? 1 : repsFactor;
                const scaledReps = roundUpWhole(sourceReps * repFactorForMode);
                const hasAddedWeight = isMachine ? maxWeight !== null && maxWeight > 0 : true;
                suggestedWeight = hasAddedWeight ? Math.max(0, scaledWeight) : null;
                suggestedReps = Math.max(1, scaledReps);
                const repNote = sessionMode === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODES"].progress ? 'max reps at your max weight' : `${Math.round(repsFactor * 100)}% of your max reps`;
                if (usesHistory) {
                    rationale = hasAddedWeight ? `Default target uses ${Math.round(weightFactor * 100)}% of your latest session max weight and ${repNote}.` : `Default target uses ${repNote}; add weight when you feel ready.`;
                } else {
                    rationale = 'Default target uses your routine baseline until more history is logged.';
                }
            }
            fallback[exercise.name] = {
                suggestedWeight,
                suggestedReps,
                rationale
            };
        };
        for (const entry of workout.exercises){
            if (entry.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single) {
                buildTarget(entry);
                updateTrendCounts(entry);
            } else {
                const [ex1, ex2] = entry.exercises;
                buildTarget(ex1);
                buildTarget(ex2);
                updateTrendCounts(ex1);
                updateTrendCounts(ex2);
            }
        }
        const narrative = buildFallbackNarrative(sessionMode, workout.name, allExerciseNames, trendCounts);
        return {
            targets: fallback,
            narrative
        };
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkoutDetailPage.useEffect": ()=>{
            if (!targetsLoading) {
                setLoadingDots('...');
                return;
            }
            const frames = [
                '.',
                '..',
                '...'
            ];
            let index = 0;
            setLoadingDots(frames[index]);
            const interval = window.setInterval({
                "WorkoutDetailPage.useEffect.interval": ()=>{
                    index = (index + 1) % frames.length;
                    setLoadingDots(frames[index]);
                }
            }["WorkoutDetailPage.useEffect.interval"], 500);
            return ({
                "WorkoutDetailPage.useEffect": ()=>window.clearInterval(interval)
            })["WorkoutDetailPage.useEffect"];
        }
    }["WorkoutDetailPage.useEffect"], [
        targetsLoading
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkoutDetailPage.useEffect": ()=>{
            setShowLastWorkoutReport(false);
        }
    }["WorkoutDetailPage.useEffect"], [
        workout?.name
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkoutDetailPage.useEffect": ()=>{
            if (!isPreview || !workout) return;
            if (Object.keys(targets).length === 0) return;
            cacheTargetsForSession(targets);
        }
    }["WorkoutDetailPage.useEffect"], [
        cacheTargetsForSession,
        isPreview,
        targets,
        workout
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkoutDetailPage.useEffect": ()=>{
            if (!workout || !isPreview || !sessionMode) return;
            let isActive = true;
            const controller = new AbortController();
            const fetchTargets = {
                "WorkoutDetailPage.useEffect.fetchTargets": async ()=>{
                    setTargetsLoading(true);
                    setTargetsError(null);
                    setTargets({});
                    setTargetsNarrative({
                        encouragement: null,
                        goalSummary: null,
                        trendSummary: null
                    });
                    setTargetsSource(null);
                    const sessionRoutineId = routineIdParam ?? (routineId !== null ? String(routineId) : null);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveSessionTargetsMeta"])(workout.name, sessionRoutineId, null);
                    const exercisePayload = [];
                    for (const exercise of workout.exercises){
                        if (exercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single) {
                            exercisePayload.push({
                                name: exercise.name,
                                type: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single,
                                sets: exercise.sets,
                                targetWeight: exercise.targetWeight,
                                targetReps: exercise.targetReps,
                                warmupWeight: exercise.warmupWeight,
                                isBodyweight: exercise.isBodyweight,
                                isMachine: exercise.isMachine
                            });
                        } else {
                            const [ex1, ex2] = exercise.exercises;
                            exercisePayload.push({
                                name: ex1.name,
                                type: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].b2b,
                                sets: ex1.sets,
                                targetWeight: ex1.targetWeight,
                                targetReps: ex1.targetReps,
                                warmupWeight: ex1.warmupWeight,
                                isBodyweight: ex1.isBodyweight,
                                isMachine: ex1.isMachine
                            });
                            exercisePayload.push({
                                name: ex2.name,
                                type: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].b2b,
                                sets: ex2.sets,
                                targetWeight: ex2.targetWeight,
                                targetReps: ex2.targetReps,
                                warmupWeight: ex2.warmupWeight,
                                isBodyweight: ex2.isBodyweight,
                                isMachine: ex2.isMachine
                            });
                        }
                    }
                    try {
                        const targetsResponse = await fetch('/api/workout-targets', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                workoutName: workout.name,
                                sessionMode,
                                exercises: exercisePayload
                            }),
                            signal: controller.signal
                        });
                        if (!isActive) return;
                        if (!targetsResponse.ok) {
                            const errorText = await targetsResponse.text();
                            throw new Error(errorText || 'Failed to load targets');
                        }
                        const targetsData = await targetsResponse.json();
                        const nextTargets = {};
                        for (const target of targetsData?.targets || []){
                            if (target?.name) {
                                nextTargets[target.name] = {
                                    suggestedWeight: target.suggestedWeight ?? null,
                                    suggestedReps: target.suggestedReps ?? null,
                                    rationale: target.rationale ?? null
                                };
                            }
                        }
                        if (Object.keys(nextTargets).length === 0) {
                            throw new Error('No targets returned');
                        }
                        setTargets(nextTargets);
                        const narrative = {
                            encouragement: normalizeNarrativeField(targetsData?.encouragement),
                            goalSummary: normalizeNarrativeField(targetsData?.goalSummary),
                            trendSummary: normalizeNarrativeField(targetsData?.trendSummary)
                        };
                        const finalNarrative = !narrative.encouragement && !narrative.goalSummary && !narrative.trendSummary ? buildFallbackNarrative(sessionMode, workout.name, allExerciseNames, {
                            up: 0,
                            down: 0,
                            flat: 0,
                            newData: allExerciseNames.length
                        }) : narrative;
                        setTargetsNarrative(finalNarrative);
                        setTargetsSource('ai');
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveSessionTargetsMeta"])(workout.name, sessionRoutineId, {
                            encouragement: finalNarrative.encouragement,
                            goalSummary: finalNarrative.goalSummary,
                            trendSummary: finalNarrative.trendSummary,
                            source: 'ai',
                            sessionMode
                        });
                        setTargetsLoading(false);
                    } catch (error) {
                        if (!isActive) return;
                        console.error('AI-trainer targets failed:', error);
                        const aiErrorMessage = error instanceof Error ? error.message : 'AI-trainer request failed.';
                        try {
                            const fallbackResult = await computeFallbackTargets();
                            if (!isActive) return;
                            setTargets(fallbackResult.targets);
                            setTargetsNarrative(fallbackResult.narrative);
                            setTargetsSource('fallback');
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveSessionTargetsMeta"])(workout.name, sessionRoutineId, {
                                encouragement: fallbackResult.narrative.encouragement,
                                goalSummary: fallbackResult.narrative.goalSummary,
                                trendSummary: fallbackResult.narrative.trendSummary,
                                source: 'fallback',
                                sessionMode
                            });
                            setTargetsError(`AI-trainer error: ${aiErrorMessage}. Using default targets for now; we should root-cause this.`);
                        } catch (fallbackError) {
                            if (!isActive) return;
                            setTargetsSource('fallback');
                            setTargetsError(`AI-trainer error: ${aiErrorMessage}. Fallback targets also failed; we should root-cause this.`);
                        } finally{
                            setTargetsLoading(false);
                        }
                    }
                }
            }["WorkoutDetailPage.useEffect.fetchTargets"];
            fetchTargets();
            return ({
                "WorkoutDetailPage.useEffect": ()=>{
                    isActive = false;
                    controller.abort();
                }
            })["WorkoutDetailPage.useEffect"];
        }
    }["WorkoutDetailPage.useEffect"], [
        workout,
        isPreview,
        sessionMode
    ]);
    const handleDeleteClick = ()=>{
        setShowDeleteModal(true);
    };
    const handleConfirmDelete = async ()=>{
        if (!routineId) return;
        setDeleting(true);
        try {
            const response = await fetch(`/api/routines/${routineId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete routine');
            }
            // Redirect to routines
            router.push('/routines');
        } catch (error) {
            console.error('Error deleting routine:', error);
            alert('Failed to delete routine. Please try again.');
            setDeleting(false);
        }
    };
    const handleCancelDelete = ()=>{
        setShowDeleteModal(false);
    };
    const openHistory = (names)=>{
        setHistoryExerciseNames(names);
        setShowHistory(true);
    };
    const closeHistory = ()=>{
        setShowHistory(false);
        setHistoryExerciseNames([]);
    };
    const handleModeSelect = (mode)=>{
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.set('preview', '1');
        nextParams.set('mode', mode);
        router.replace(`/workout/${encodeURIComponent(params.name)}?${nextParams.toString()}`);
    };
    const handleModeReset = ()=>{
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.delete('mode');
        nextParams.set('preview', '1');
        router.replace(`/workout/${encodeURIComponent(params.name)}?${nextParams.toString()}`);
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white text-2xl",
                children: "Loading workout..."
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 739,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/page.tsx",
            lineNumber: 738,
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
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 748,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/routines",
                        className: "text-blue-400 hover:text-blue-300",
                        children: "Back to routines"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 749,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 747,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/page.tsx",
            lineNumber: 746,
            columnNumber: 7
        }, this);
    }
    if (isPreview && !sessionMode) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-xl mx-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-8 bg-zinc-800 border border-zinc-700 rounded-lg p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm mb-2",
                            children: "Before you preview"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 762,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold text-white mb-3",
                            children: "How are you feeling today?"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 763,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-zinc-400 mb-6",
                            children: "Pick the vibe for this session so we can set targets for today."
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 764,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleModeSelect(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODES"].progress),
                                    className: "w-full text-left bg-emerald-700/80 hover:bg-emerald-600 text-white px-4 py-4 rounded-lg font-semibold transition-colors",
                                    children: [
                                        "Progress",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-emerald-200 text-sm font-normal",
                                            children: "Push for some wins today."
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 773,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 768,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleModeSelect(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODES"].maintenance),
                                    className: "w-full text-left bg-blue-700/70 hover:bg-blue-600 text-white px-4 py-4 rounded-lg font-semibold transition-colors",
                                    children: [
                                        "Maintenance",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-blue-200 text-sm font-normal",
                                            children: "Hold steady and keep the groove."
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 780,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 775,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleModeSelect(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODES"].light),
                                    className: "w-full text-left bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-4 rounded-lg font-semibold transition-colors",
                                    children: [
                                        "Light",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-zinc-300 text-sm font-normal",
                                            children: "Deload or just move a bit."
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 787,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 782,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 767,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/page.tsx",
                    lineNumber: 761,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 760,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/page.tsx",
            lineNumber: 759,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-900 p-4 pb-32",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/routines",
                                        className: "text-blue-400 hover:text-blue-300",
                                        children: "← Back to routines"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 802,
                                        columnNumber: 13
                                    }, this),
                                    routineId && !isPublicRoutine && !isPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/routines/${routineId}/edit`,
                                                className: "bg-blue-900/50 hover:bg-blue-900 text-blue-300 hover:text-blue-100 px-4 py-2 rounded text-sm font-semibold transition-colors",
                                                children: "Edit Routine"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 807,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleDeleteClick,
                                                className: "bg-red-900/50 hover:bg-red-900 text-red-300 hover:text-red-100 px-4 py-2 rounded text-sm font-semibold transition-colors",
                                                children: "Delete Routine"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 813,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 806,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 801,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-4xl font-bold text-white",
                                children: workout.name
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 822,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 800,
                        columnNumber: 9
                    }, this),
                    isPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mb-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            paddingClassName: "p-5",
                            borderClassName: "border-emerald-600",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-emerald-400 text-xs mb-1",
                                                children: "Session Type"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 830,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-white text-lg font-semibold",
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODE_LABELS"][startMode]
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 831,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-400 text-sm mt-1",
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_MODE_DESCRIPTIONS"][startMode]
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 834,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 829,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleModeReset,
                                        className: "text-xs text-emerald-300 hover:text-emerald-200 bg-zinc-900 px-3 py-2 rounded",
                                        children: "Change"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 838,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 828,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 827,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 826,
                        columnNumber: 11
                    }, this),
                    isPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                                icon: "🎯",
                                iconClassName: "text-amber-400",
                                label: "AI-Trainer Targets",
                                className: "text-2xl"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 851,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                paddingClassName: "p-5",
                                borderClassName: "border-amber-600",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-200 font-semibold",
                                                children: targetsLoading ? `Loading AI-trainer targets${loadingDots}` : targetsSource === 'fallback' ? 'AI-trainer unavailable. Using formula-based targets for this session.' : 'AI-trainer targets ready.'
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 859,
                                                columnNumber: 17
                                            }, this),
                                            targetsLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-amber-300 bg-zinc-900 px-3 py-2 rounded",
                                                children: "Building your session plan"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 867,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 858,
                                        columnNumber: 15
                                    }, this),
                                    !targetsLoading && (targetsNarrative.encouragement || targetsNarrative.goalSummary || targetsNarrative.trendSummary) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 space-y-2 text-sm text-zinc-300 leading-relaxed",
                                        children: [
                                            targetsNarrative.encouragement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: targetsNarrative.encouragement
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 875,
                                                columnNumber: 56
                                            }, this),
                                            targetsNarrative.goalSummary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: targetsNarrative.goalSummary
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 876,
                                                columnNumber: 54
                                            }, this),
                                            targetsNarrative.trendSummary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: targetsNarrative.trendSummary
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 877,
                                                columnNumber: 55
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 874,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 857,
                                columnNumber: 13
                            }, this),
                            !targetsLoading && lastWorkoutReport && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setShowLastWorkoutReport((prev)=>!prev),
                                        className: "text-xs text-amber-300 hover:text-amber-200 bg-zinc-900 px-3 py-2 rounded",
                                        children: showLastWorkoutReport ? 'Hide last session report' : 'View last session report'
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 884,
                                        columnNumber: 17
                                    }, this),
                                    showLastWorkoutReport && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 bg-zinc-900 rounded p-3 text-zinc-300 text-sm whitespace-pre-line border border-amber-700/40",
                                        children: lastWorkoutReport
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 892,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 883,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-zinc-400 text-sm mt-3",
                                children: [
                                    "Targets are generated with your",
                                    ' ',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/profile",
                                        className: "text-amber-300 hover:text-amber-200 underline",
                                        children: "background and fitness goals"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 900,
                                        columnNumber: 15
                                    }, this),
                                    ' ',
                                    "and your",
                                    ' ',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>openHistory(allExerciseNames),
                                        className: "text-amber-300 hover:text-amber-200 underline",
                                        children: "exercise history"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 904,
                                        columnNumber: 15
                                    }, this),
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 898,
                                columnNumber: 13
                            }, this),
                            targetsError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-red-400 text-sm mt-3",
                                children: targetsError
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 914,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 850,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                                icon: "🟢",
                                iconClassName: "text-green-500",
                                label: "Pre-Workout Stretches",
                                className: "text-2xl"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 921,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-sm mb-4",
                                children: "Dynamic stretches · 5-8 minutes"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 927,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: workout.preWorkoutStretches.map((stretch, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StretchCard, {
                                        stretch: stretch,
                                        index: index
                                    }, index, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 930,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 928,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 920,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                                icon: "🔥",
                                iconClassName: "text-orange-500",
                                label: "Exercises",
                                className: "text-2xl"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 937,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-sm mb-4",
                                children: [
                                    workout.exercises.length,
                                    " exercises"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 943,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: workout.exercises.map((exercise, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ExerciseCard, {
                                        exercise: exercise,
                                        index: index,
                                        onShowHistory: openHistory,
                                        targets: targets,
                                        showTargets: isPreview,
                                        lastSessionMaxes: lastSessionMaxes,
                                        weightUnit: weightUnit,
                                        heightUnit: heightUnit
                                    }, index, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 946,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 944,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 936,
                        columnNumber: 9
                    }, this),
                    workout.cardio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                                icon: "❤️",
                                iconClassName: "text-red-500",
                                label: "Cardio (Optional)",
                                className: "text-2xl"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 964,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                paddingClassName: "p-5",
                                borderClassName: "border-red-600",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between mb-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-xl font-bold text-white mb-2",
                                                    children: workout.cardio.type
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                                    lineNumber: 973,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-blue-400 text-lg mb-1",
                                                    children: workout.cardio.duration
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                                    lineNumber: 974,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-zinc-400 text-sm",
                                                    children: workout.cardio.intensity
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                                    lineNumber: 975,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 972,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 971,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 rounded p-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs mb-1",
                                                children: "Tips"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 979,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-300 text-sm",
                                                children: workout.cardio.tips
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 980,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 978,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 970,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 963,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                                icon: "🔵",
                                iconClassName: "text-blue-500",
                                label: "Post-Workout Stretches",
                                className: "text-2xl"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 988,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-sm mb-4",
                                children: "Static stretches · 8-10 minutes"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 994,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: workout.postWorkoutStretches.map((stretch, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StretchCard, {
                                        stretch: stretch,
                                        index: index
                                    }, index, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 997,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 995,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 987,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BottomActionBar"], {
                        maxWidthClassName: "max-w-2xl",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                const query = new URLSearchParams();
                                if (routineId) query.set('routineId', String(routineId));
                                const queryString = query.toString();
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initWorkoutSession"])(workout.name, routineId);
                                const url = `/stretches/${encodeURIComponent(workout.name)}${queryString ? `?${queryString}` : ''}`;
                                router.push(url);
                            },
                            className: "w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors",
                            children: "Start Workout"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 1004,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 1003,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 798,
                columnNumber: 7
            }, this),
            showDeleteModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-red-600",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-white mb-4",
                            children: "Delete Routine"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 1024,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-zinc-300 mb-6",
                            children: "This will permanently delete this routine. Are you sure you want to proceed?"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 1025,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCancelDelete,
                                    disabled: deleting,
                                    className: "bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 1030,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleConfirmDelete,
                                    disabled: deleting,
                                    className: "bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors",
                                    children: deleting ? 'Deleting...' : 'Delete'
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 1037,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 1029,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/page.tsx",
                    lineNumber: 1023,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 1022,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExerciseHistoryModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: showHistory,
                onClose: closeHistory,
                exerciseNames: historyExerciseNames,
                title: "Exercise History",
                targets: historyTargets,
                weightUnit: weightUnit,
                heightUnit: heightUnit
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 1049,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/workout/[name]/page.tsx",
        lineNumber: 797,
        columnNumber: 5
    }, this);
}
_s(WorkoutDetailPage, "A3NuqXlYl/hyheApArC5NVaCyw0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = WorkoutDetailPage;
function StretchCard({ stretch, index }) {
    const tips = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFormTips"])(stretch.tips);
    const videoHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVideoUrl"])(stretch.name, stretch.videoUrl);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-800 rounded-lg p-3 border border-zinc-700",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-zinc-500 text-xs mb-1",
                children: [
                    "#",
                    index + 1
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 1068,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-sm font-semibold text-white mb-1",
                children: stretch.name
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 1069,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-blue-400 text-xs mb-2",
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stretch$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatStretchTimer"])(stretch.timerSeconds)
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 1070,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-zinc-400 text-xs mb-2 leading-relaxed",
                children: tips
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 1073,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: videoHref,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-red-500 hover:text-red-400 text-xs font-medium px-2 py-1 bg-zinc-900 rounded inline-block",
                children: "📺 Video"
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 1074,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/workout/[name]/page.tsx",
        lineNumber: 1067,
        columnNumber: 5
    }, this);
}
_c1 = StretchCard;
function TargetCard({ baseWeight, baseReps, suggestion, isBodyweight, isMachine, primaryMetric, metricUnit, weightUnit, heightUnit, lastSession }) {
    const metricInfo = {
        primaryMetric: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolvePrimaryMetric"])(primaryMetric, isBodyweight),
        metricUnit: metricUnit ?? null
    };
    const targetWeight = suggestion?.suggestedWeight ?? baseWeight;
    const targetReps = suggestion?.suggestedReps ?? baseReps;
    const lastWeight = lastSession?.weight ?? null;
    const lastReps = lastSession?.reps ?? null;
    const weightDelta = lastWeight !== null ? targetWeight - lastWeight : null;
    const repsDelta = lastReps !== null ? targetReps - lastReps : null;
    const showMetric = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRepsOnlyMetric"])(metricInfo.primaryMetric);
    const weightLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMetricLabel"])(metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine);
    const lastSummaryParts = [];
    if (showMetric) {
        if (lastWeight !== null) {
            lastSummaryParts.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMetricDisplay"])(lastWeight, metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine));
        }
        if (lastReps !== null) lastSummaryParts.push(`${lastReps} reps`);
    } else {
        if (lastReps !== null) lastSummaryParts.push(`${lastReps} reps`);
        else if (lastWeight !== null) {
            lastSummaryParts.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMetricDisplay"])(lastWeight, metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine));
        }
    }
    const lastSummary = lastSummaryParts.join(' · ');
    const formatDelta = (delta)=>`${delta > 0 ? '+' : ''}${delta}`;
    const deltaClass = (delta)=>delta > 0 ? 'text-emerald-300' : 'text-amber-300';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-900 rounded p-3 border border-emerald-800",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-emerald-400 text-xs mb-2",
                children: "Today's target"
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 1164,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `grid ${showMetric ? 'grid-cols-2' : 'grid-cols-1'} gap-3`,
                children: [
                    showMetric && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-500 text-xs mb-1",
                                children: weightLabel
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 1168,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white font-semibold text-lg",
                                children: [
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMetricDisplay"])(targetWeight, metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine),
                                    weightDelta !== null && weightDelta !== 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `ml-2 text-sm ${deltaClass(weightDelta)}`,
                                        children: [
                                            "(",
                                            formatDelta(weightDelta),
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 1179,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 1169,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 1167,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-500 text-xs mb-1",
                                children: "Reps"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 1185,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white font-semibold text-lg",
                                children: [
                                    targetReps,
                                    repsDelta !== null && repsDelta !== 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `ml-2 text-sm ${deltaClass(repsDelta)}`,
                                        children: [
                                            "(",
                                            formatDelta(repsDelta),
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 1189,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 1186,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 1184,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 1165,
                columnNumber: 7
            }, this),
            lastSummary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-zinc-500 text-xs mt-2",
                children: [
                    "Last time max: ",
                    lastSummary
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 1195,
                columnNumber: 9
            }, this),
            suggestion?.rationale && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-zinc-400 text-xs mt-2",
                children: suggestion.rationale
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 1200,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/workout/[name]/page.tsx",
        lineNumber: 1163,
        columnNumber: 5
    }, this);
}
_c2 = TargetCard;
function ExerciseCard({ exercise, index, onShowHistory, targets, showTargets, lastSessionMaxes, weightUnit, heightUnit }) {
    if (exercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single) {
        const tips = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFormTips"])(exercise.tips);
        const videoHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVideoUrl"])(exercise.name, exercise.videoUrl);
        const metricInfo = {
            primaryMetric: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolvePrimaryMetric"])(exercise.primaryMetric, exercise.isBodyweight),
            metricUnit: exercise.metricUnit ?? null
        };
        const showMetric = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRepsOnlyMetric"])(metricInfo.primaryMetric);
        const isMachine = !!exercise.isMachine;
        const metricLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMetricLabel"])(metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine);
        const showWarmup = showMetric && metricInfo.primaryMetric === 'weight' && (exercise.hasWarmup ?? !exercise.isBodyweight);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-800 rounded-lg p-5 border-2 border-zinc-700",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-500 text-sm mb-1",
                                    children: [
                                        "Exercise #",
                                        index + 1
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 1249,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-bold text-white mb-2",
                                    children: exercise.name
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 1250,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 1248,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: videoHref,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded text-center",
                                    children: "📺 Video"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 1253,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onShowHistory([
                                            exercise.name
                                        ]),
                                    className: "text-blue-300 hover:text-blue-200 text-sm font-medium px-3 py-2 bg-zinc-900 rounded",
                                    children: "📈 History"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 1261,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 1252,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/page.tsx",
                    lineNumber: 1247,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2 mb-3",
                    children: [
                        showMetric && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `grid ${showWarmup ? 'grid-cols-2' : 'grid-cols-1'} gap-3`,
                            children: [
                                showWarmup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-green-950 border border-green-800 rounded p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-green-400 text-xs mb-1",
                                            children: [
                                                "Warmup ",
                                                metricLabel
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 1275,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-green-300 font-bold text-2xl",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMetricDisplay"])(exercise.warmupWeight, metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine)
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 1276,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 1274,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-orange-950 border border-orange-800 rounded p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-orange-400 text-xs mb-1",
                                            children: [
                                                "Target ",
                                                metricLabel
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 1289,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-orange-300 font-bold text-2xl",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMetricDisplay"])(exercise.targetWeight, metricInfo.primaryMetric, metricInfo.metricUnit, weightUnit, heightUnit, isMachine)
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 1290,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 1288,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 1272,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-zinc-900 rounded p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-zinc-500 text-xs mb-1",
                                            children: "Rest Time"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 1307,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-white font-semibold text-2xl",
                                            children: [
                                                exercise.restTime,
                                                "s"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 1308,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 1306,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-zinc-900 rounded p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-zinc-500 text-xs mb-1",
                                            children: "Sets × Reps"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 1311,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-white font-semibold text-2xl",
                                            children: [
                                                exercise.sets,
                                                " × ",
                                                exercise.targetReps
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 1312,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 1310,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 1305,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/page.tsx",
                    lineNumber: 1270,
                    columnNumber: 9
                }, this),
                showTargets && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TargetCard, {
                    baseWeight: exercise.targetWeight,
                    baseReps: exercise.targetReps,
                    suggestion: targets[exercise.name],
                    isBodyweight: exercise.isBodyweight,
                    isMachine: exercise.isMachine,
                    primaryMetric: exercise.primaryMetric,
                    metricUnit: exercise.metricUnit,
                    weightUnit: weightUnit,
                    heightUnit: heightUnit,
                    lastSession: lastSessionMaxes[exercise.name]
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/page.tsx",
                    lineNumber: 1320,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-900 rounded p-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-500 text-xs mb-1",
                            children: "Form Tips"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 1335,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-zinc-300 text-sm",
                            children: tips
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 1336,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/page.tsx",
                    lineNumber: 1334,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/workout/[name]/page.tsx",
            lineNumber: 1246,
            columnNumber: 7
        }, this);
    }
    // B2B Exercise
    const [ex1, ex2] = exercise.exercises;
    const ex1Tips = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFormTips"])(ex1.tips);
    const ex2Tips = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFormTips"])(ex2.tips);
    const ex1VideoHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVideoUrl"])(ex1.name, ex1.videoUrl);
    const ex2VideoHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVideoUrl"])(ex2.name, ex2.videoUrl);
    const ex1MetricInfo = {
        primaryMetric: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolvePrimaryMetric"])(ex1.primaryMetric, ex1.isBodyweight),
        metricUnit: ex1.metricUnit ?? null
    };
    const ex2MetricInfo = {
        primaryMetric: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolvePrimaryMetric"])(ex2.primaryMetric, ex2.isBodyweight),
        metricUnit: ex2.metricUnit ?? null
    };
    const ex1ShowMetric = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRepsOnlyMetric"])(ex1MetricInfo.primaryMetric);
    const ex2ShowMetric = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRepsOnlyMetric"])(ex2MetricInfo.primaryMetric);
    const ex1Machine = !!ex1.isMachine;
    const ex2Machine = !!ex2.isMachine;
    const ex1MetricLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMetricLabel"])(ex1MetricInfo.primaryMetric, ex1MetricInfo.metricUnit, weightUnit, heightUnit, ex1Machine);
    const ex2MetricLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMetricLabel"])(ex2MetricInfo.primaryMetric, ex2MetricInfo.metricUnit, weightUnit, heightUnit, ex2Machine);
    const ex1ShowWarmup = ex1ShowMetric && ex1MetricInfo.primaryMetric === 'weight' && (ex1.hasWarmup ?? !ex1.isBodyweight);
    const ex2ShowWarmup = ex2ShowMetric && ex2MetricInfo.primaryMetric === 'weight' && (ex2.hasWarmup ?? !ex2.isBodyweight);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-800 rounded-lg p-5 border-2 border-purple-700",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-purple-400 text-sm font-bold",
                        children: [
                            "🔄 B2B SUPERSET · Exercise #",
                            index + 1
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 1384,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onShowHistory([
                                ex1.name,
                                ex2.name
                            ]),
                        className: "text-blue-300 hover:text-blue-200 text-xs font-semibold px-3 py-2 bg-zinc-900 rounded",
                        children: "📈 History"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 1387,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 1383,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-zinc-500 text-xs mb-1",
                                        children: "Exercise 1 of 2"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 1399,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-bold text-white mb-2",
                                        children: ex1.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 1400,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 1398,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: ex1VideoHref,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded",
                                children: "📺 Video"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 1402,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 1397,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            ex1ShowMetric && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `grid ${ex1ShowWarmup ? 'grid-cols-2' : 'grid-cols-1'} gap-2`,
                                children: [
                                    ex1ShowWarmup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-green-950 border border-green-800 rounded p-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-green-400 text-xs mb-1",
                                                children: [
                                                    "Warmup ",
                                                    ex1MetricLabel
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1417,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-green-300 font-bold text-xl",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMetricDisplay"])(ex1.warmupWeight, ex1MetricInfo.primaryMetric, ex1MetricInfo.metricUnit, weightUnit, heightUnit, ex1Machine)
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1418,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 1416,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-orange-950 border border-orange-800 rounded p-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-orange-400 text-xs mb-1",
                                                children: [
                                                    "Target ",
                                                    ex1MetricLabel
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1431,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-orange-300 font-bold text-xl",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMetricDisplay"])(ex1.targetWeight, ex1MetricInfo.primaryMetric, ex1MetricInfo.metricUnit, weightUnit, heightUnit, ex1Machine)
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1432,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 1430,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 1414,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 rounded p-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs mb-1",
                                                children: "Sets × Reps"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1449,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-white font-semibold text-xl",
                                                children: [
                                                    ex1.sets,
                                                    " × ",
                                                    ex1.targetReps
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1450,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 1448,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 rounded p-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs mb-1",
                                                children: "Form Tips"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1455,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-400 text-xs",
                                                children: ex1Tips
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1456,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 1454,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 1447,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 1412,
                        columnNumber: 9
                    }, this),
                    showTargets && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TargetCard, {
                            baseWeight: ex1.targetWeight,
                            baseReps: ex1.targetReps,
                            suggestion: targets[ex1.name],
                            isBodyweight: ex1.isBodyweight,
                            isMachine: ex1.isMachine,
                            primaryMetric: ex1.primaryMetric,
                            metricUnit: ex1.metricUnit,
                            weightUnit: weightUnit,
                            heightUnit: heightUnit,
                            lastSession: lastSessionMaxes[ex1.name]
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 1463,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 1462,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 1396,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "my-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-purple-950 border-2 border-purple-700 rounded-lg p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-purple-400 text-sm mb-1",
                                children: "Rest Between Exercises"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 1483,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-purple-300 font-bold text-3xl",
                                children: [
                                    exercise.restTime,
                                    "s"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 1484,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 1482,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/page.tsx",
                    lineNumber: 1481,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 1480,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-zinc-500 text-xs mb-1",
                                        children: "Exercise 2 of 2"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 1493,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-bold text-white mb-2",
                                        children: ex2.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 1494,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 1492,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: ex2VideoHref,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded",
                                children: "📺 Video"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 1496,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 1491,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            ex2ShowMetric && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `grid ${ex2ShowWarmup ? 'grid-cols-2' : 'grid-cols-1'} gap-2`,
                                children: [
                                    ex2ShowWarmup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-green-950 border border-green-800 rounded p-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-green-400 text-xs mb-1",
                                                children: [
                                                    "Warmup ",
                                                    ex2MetricLabel
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1511,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-green-300 font-bold text-xl",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMetricDisplay"])(ex2.warmupWeight, ex2MetricInfo.primaryMetric, ex2MetricInfo.metricUnit, weightUnit, heightUnit, ex2Machine)
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1512,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 1510,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-orange-950 border border-orange-800 rounded p-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-orange-400 text-xs mb-1",
                                                children: [
                                                    "Target ",
                                                    ex2MetricLabel
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1525,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-orange-300 font-bold text-xl",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metric$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMetricDisplay"])(ex2.targetWeight, ex2MetricInfo.primaryMetric, ex2MetricInfo.metricUnit, weightUnit, heightUnit, ex2Machine)
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1526,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 1524,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 1508,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 rounded p-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs mb-1",
                                                children: "Sets × Reps"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1543,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-white font-semibold text-xl",
                                                children: [
                                                    ex2.sets,
                                                    " × ",
                                                    ex2.targetReps
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1544,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 1542,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 rounded p-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs mb-1",
                                                children: "Form Tips"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1549,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-400 text-xs",
                                                children: ex2Tips
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 1550,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 1548,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 1541,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 1506,
                        columnNumber: 9
                    }, this),
                    showTargets && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TargetCard, {
                            baseWeight: ex2.targetWeight,
                            baseReps: ex2.targetReps,
                            suggestion: targets[ex2.name],
                            isBodyweight: ex2.isBodyweight,
                            isMachine: ex2.isMachine,
                            primaryMetric: ex2.primaryMetric,
                            metricUnit: ex2.metricUnit,
                            weightUnit: weightUnit,
                            heightUnit: heightUnit,
                            lastSession: lastSessionMaxes[ex2.name]
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 1557,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 1556,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 1490,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/workout/[name]/page.tsx",
        lineNumber: 1382,
        columnNumber: 5
    }, this);
}
_c3 = ExerciseCard;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "WorkoutDetailPage");
__turbopack_context__.k.register(_c1, "StretchCard");
__turbopack_context__.k.register(_c2, "TargetCard");
__turbopack_context__.k.register(_c3, "ExerciseCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_b54dbea8._.js.map