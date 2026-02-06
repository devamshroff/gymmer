(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/workout-session.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/workout-session.ts
// Client-side storage for current workout session
__turbopack_context__.s([
    "addCardioToSession",
    ()=>addCardioToSession,
    "addExerciseToSession",
    ()=>addExerciseToSession,
    "clearWorkoutSession",
    ()=>clearWorkoutSession,
    "getWorkoutSession",
    ()=>getWorkoutSession,
    "initWorkoutSession",
    ()=>initWorkoutSession
]);
const STORAGE_KEY = 'current_workout_session';
function initWorkoutSession(workoutName) {
    const session = {
        workoutName,
        startTime: new Date().toISOString(),
        exercises: []
    };
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
}
function getWorkoutSession() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
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
"[project]/lib/session-workout.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "acknowledgeChangeWarning",
    ()=>acknowledgeChangeWarning,
    "clearSessionWorkout",
    ()=>clearSessionWorkout,
    "hasChangeWarningAck",
    ()=>hasChangeWarningAck,
    "loadSessionWorkout",
    ()=>loadSessionWorkout,
    "saveSessionWorkout",
    ()=>saveSessionWorkout
]);
const SESSION_PREFIX = 'session_workout_override';
const WARNING_PREFIX = 'session_workout_change_ack';
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
"[project]/app/components/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
'use client';
;
;
function Header() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: "/",
        className: "block text-center mb-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-2xl font-bold text-emerald-700",
            children: "GYMMER"
        }, void 0, false, {
            fileName: "[project]/app/components/Header.tsx",
            lineNumber: 8,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/Header.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/WorkoutNavHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorkoutNavHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function WorkoutNavHeader({ exitUrl, previousUrl, onPrevious, skipUrl, skipLabel = 'Skip', onSkip, nextLabel = 'Next', onNext }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex justify-between items-center mb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: exitUrl,
                        className: "text-red-400 hover:text-red-300 font-medium",
                        children: "Exit"
                    }, void 0, false, {
                        fileName: "[project]/app/components/WorkoutNavHeader.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            showNext ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            }, this) : showSkip ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_s(WorkoutNavHeader, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = WorkoutNavHeader;
var _c;
__turbopack_context__.k.register(_c, "WorkoutNavHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/workout/[name]/active/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ActiveWorkoutPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-session.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-media.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-workout.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$WorkoutNavHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/WorkoutNavHeader.tsx [app-client] (ecmascript)");
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
function ActiveWorkoutContent() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [workout, setWorkout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [currentExerciseIndex, setCurrentExerciseIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [initialIndexSet, setInitialIndexSet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentSetIndex, setCurrentSetIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isResting, setIsResting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [restTimeRemaining, setRestTimeRemaining] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Single exercise state
    const [setData, setSetData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        weight: 0,
        reps: 0
    });
    const [completedSets, setCompletedSets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // B2B/Superset state
    const [currentExerciseInPair, setCurrentExerciseInPair] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0); // 0 or 1
    const [setData1, setSetData1] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        weight: 0,
        reps: 0
    });
    const [setData2, setSetData2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        weight: 0,
        reps: 0
    });
    const [completedPairs, setCompletedPairs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isTransitioning, setIsTransitioning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [transitionTimeRemaining, setTransitionTimeRemaining] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(60);
    const [showExitConfirm, setShowExitConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showExerciseTypePicker, setShowExerciseTypePicker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showExerciseSelector, setShowExerciseSelector] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSupersetSelector, setShowSupersetSelector] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [exerciseActionMode, setExerciseActionMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showChangeWarning, setShowChangeWarning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pendingChangeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Last exercise log from database
    const [lastExerciseLog, setLastExerciseLog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastPartnerExerciseLog, setLastPartnerExerciseLog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [completedExercisesCache, setCompletedExercisesCache] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [viewingExerciseIndex, setViewingExerciseIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0); // Which exercise we're viewing (can be past/current)
    // Get routineId from URL params (for public/favorited routines)
    const routineIdParam = searchParams.get('routineId');
    const routineQuery = routineIdParam ? `?routineId=${routineIdParam}` : '';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ActiveWorkoutContent.useEffect": ()=>{
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
                    const sessionWorkout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadSessionWorkout"])(baseWorkout.name, routineIdParam);
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
                    if (exercise.type === 'single') {
                        // Check if warmup is needed
                        const needsWarmup = exercise.warmupWeight !== exercise.targetWeight;
                        setSetData({
                            weight: needsWarmup ? exercise.warmupWeight : exercise.targetWeight,
                            reps: exercise.targetReps
                        });
                        // If no warmup needed, start at set 1 instead of set 0
                        if (!needsWarmup) {
                            setCurrentSetIndex(1);
                        }
                    } else {
                        // B2B exercise - no warmups, start at set 1
                        const b2bEx = exercise;
                        setSetData1({
                            weight: b2bEx.exercises[0].targetWeight,
                            reps: b2bEx.exercises[0].targetReps
                        });
                        setSetData2({
                            weight: b2bEx.exercises[1].targetWeight,
                            reps: b2bEx.exercises[1].targetReps
                        });
                        setCurrentSetIndex(1);
                        setCurrentExerciseInPair(0); // Start with first exercise
                    }
                } catch (error) {
                    console.error('Error fetching workout:', error);
                } finally{
                    setLoading(false);
                }
            }
            fetchWorkout();
        }
    }["ActiveWorkoutContent.useEffect"], [
        params.name,
        searchParams,
        routineIdParam,
        initialIndexSet
    ]);
    // Rest timer countdown
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ActiveWorkoutContent.useEffect": ()=>{
            if (isResting && restTimeRemaining > 0) {
                const timer = setTimeout({
                    "ActiveWorkoutContent.useEffect.timer": ()=>{
                        setRestTimeRemaining(restTimeRemaining - 1);
                    }
                }["ActiveWorkoutContent.useEffect.timer"], 1000);
                return ({
                    "ActiveWorkoutContent.useEffect": ()=>clearTimeout(timer)
                })["ActiveWorkoutContent.useEffect"];
            } else if (isResting && restTimeRemaining === 0) {
                // Vibrate when rest is complete
                if ('vibrate' in navigator) {
                    navigator.vibrate(500);
                }
            }
        }
    }["ActiveWorkoutContent.useEffect"], [
        isResting,
        restTimeRemaining
    ]);
    // Transition timer countdown
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ActiveWorkoutContent.useEffect": ()=>{
            if (isTransitioning && transitionTimeRemaining > 0) {
                const timer = setTimeout({
                    "ActiveWorkoutContent.useEffect.timer": ()=>{
                        setTransitionTimeRemaining(transitionTimeRemaining - 1);
                    }
                }["ActiveWorkoutContent.useEffect.timer"], 1000);
                return ({
                    "ActiveWorkoutContent.useEffect": ()=>clearTimeout(timer)
                })["ActiveWorkoutContent.useEffect"];
            } else if (isTransitioning && transitionTimeRemaining === 0 && workout) {
                // Transition complete - move to next exercise
                const nextExerciseIndex = currentExerciseIndex + 1;
                setIsTransitioning(false);
                setCurrentExerciseIndex(nextExerciseIndex);
                setViewingExerciseIndex(nextExerciseIndex); // Keep viewing in sync with active exercise
                setCompletedSets([]);
                // Initialize next exercise
                const nextExercise = workout.exercises[nextExerciseIndex];
                if (nextExercise.type === 'single') {
                    // Check if warmup is needed
                    const needsWarmup = nextExercise.warmupWeight !== nextExercise.targetWeight;
                    setSetData({
                        weight: needsWarmup ? nextExercise.warmupWeight : nextExercise.targetWeight,
                        reps: nextExercise.targetReps
                    });
                    setCurrentSetIndex(needsWarmup ? 0 : 1);
                } else {
                    // B2B exercise - no warmups, start at set 1
                    const b2bEx = nextExercise;
                    setSetData1({
                        weight: b2bEx.exercises[0].targetWeight,
                        reps: b2bEx.exercises[0].targetReps
                    });
                    setSetData2({
                        weight: b2bEx.exercises[1].targetWeight,
                        reps: b2bEx.exercises[1].targetReps
                    });
                    setCurrentSetIndex(1);
                    setCurrentExerciseInPair(0);
                    setCompletedPairs([]);
                }
            }
        }
    }["ActiveWorkoutContent.useEffect"], [
        isTransitioning,
        transitionTimeRemaining,
        workout,
        currentExerciseIndex
    ]);
    // Fetch last exercise log(s) from database when exercise changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ActiveWorkoutContent.useEffect": ()=>{
            async function fetchLastExerciseLog() {
                if (!workout) return;
                const currentExercise = workout.exercises[currentExerciseIndex];
                const fetchLog = {
                    "ActiveWorkoutContent.useEffect.fetchLastExerciseLog.fetchLog": async (exerciseName)=>{
                        try {
                            const response = await fetch(`/api/last-exercise?exerciseName=${encodeURIComponent(exerciseName)}`);
                            if (!response.ok) return null;
                            const data = await response.json();
                            return data.lastLog;
                        } catch (error) {
                            console.error('Error fetching last exercise log:', error);
                            return null;
                        }
                    }
                }["ActiveWorkoutContent.useEffect.fetchLastExerciseLog.fetchLog"];
                if (currentExercise.type === 'single') {
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
        }
    }["ActiveWorkoutContent.useEffect"], [
        workout,
        currentExerciseIndex
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white text-2xl",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 266,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 265,
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
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 275,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "text-blue-400 hover:text-blue-300",
                        children: "Back to home"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 276,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 274,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 273,
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
            setCompletedPairs(newCompletedPairs);
            if (newCompletedPairs.length < totalSets) {
                // More sets to go - no rest, immediately continue to next set
                setCurrentSetIndex(currentSetIndex + 1);
                setCurrentExerciseInPair(0); // Reset to first exercise for next round
            } else {
                // All sets complete - save to session and show transition to next exercise
                console.log('Finishing B2B exercise');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addExerciseToSession"])({
                    name: b2bExercise.exercises[0].name,
                    type: 'b2b',
                    sets: newCompletedPairs.map((pair)=>pair.ex1),
                    b2bPartner: {
                        name: b2bExercise.exercises[1].name,
                        sets: newCompletedPairs.map((pair)=>pair.ex2)
                    }
                });
                // Cache completed B2B exercise for review
                setCompletedExercisesCache([
                    ...completedExercisesCache,
                    {
                        exerciseIndex: currentExerciseIndex,
                        exerciseName: b2bExercise.exercises[0].name,
                        type: 'b2b',
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
        if (currentSetIndex <= exercise.sets) {
            // More sets to go - start rest timer
            setIsResting(true);
            setRestTimeRemaining(exercise.restTime);
            setCurrentSetIndex(currentSetIndex + 1);
            // Auto-update weight for next set (if it was warmup, switch to working weight)
            if (currentSetIndex === 0) {
                setSetData({
                    weight: exercise.targetWeight,
                    reps: exercise.targetReps
                });
            }
        } else {
            // Exercise complete - save to session
            const hasWarmup = exercise.warmupWeight !== exercise.targetWeight;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addExerciseToSession"])({
                name: exercise.name,
                type: 'single',
                warmup: hasWarmup ? newCompletedSets[0] : undefined,
                sets: hasWarmup ? newCompletedSets.slice(1) : newCompletedSets
            });
            // Cache completed exercise for review
            setCompletedExercisesCache([
                ...completedExercisesCache,
                {
                    exerciseIndex: currentExerciseIndex,
                    exerciseName: exercise.name,
                    type: 'single',
                    completedSets: newCompletedSets
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
    const handleSkipWarmup = ()=>{
        const exercise = currentExercise;
        // Move to set 1 (first working set)
        setCurrentSetIndex(1);
        setSetData({
            weight: exercise.targetWeight,
            reps: exercise.targetReps
        });
    };
    const handleAddTime = ()=>{
        setRestTimeRemaining(restTimeRemaining + 15);
    };
    const handleSkipTransition = ()=>{
        setTransitionTimeRemaining(0);
    };
    const handleEndExercise = ()=>{
        console.log('handleEndExercise called', {
            exerciseType: currentExercise.type,
            currentExerciseIndex,
            totalExercises: workout.exercises.length
        });
        // Save completed sets and move to next exercise
        if (currentExercise.type === 'single') {
            const exercise = currentExercise;
            const hasWarmup = exercise.warmupWeight !== exercise.targetWeight;
            if (completedSets.length > 0) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addExerciseToSession"])({
                    name: exercise.name,
                    type: 'single',
                    warmup: hasWarmup ? completedSets[0] : undefined,
                    sets: hasWarmup ? completedSets.slice(1) : completedSets
                });
                // Cache for review
                setCompletedExercisesCache([
                    ...completedExercisesCache,
                    {
                        exerciseIndex: currentExerciseIndex,
                        exerciseName: exercise.name,
                        type: 'single',
                        completedSets: completedSets
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
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addExerciseToSession"])({
                    name: b2bExercise.exercises[0].name,
                    type: 'b2b',
                    sets: completedPairs.map((pair)=>pair.ex1),
                    b2bPartner: {
                        name: b2bExercise.exercises[1].name,
                        sets: completedPairs.map((pair)=>pair.ex2)
                    }
                });
                // Cache for review
                setCompletedExercisesCache([
                    ...completedExercisesCache,
                    {
                        exerciseIndex: currentExerciseIndex,
                        exerciseName: b2bExercise.exercises[0].name,
                        type: 'b2b',
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
                router.push(`/stretches/${encodeURIComponent(workout.name)}?index=${preStretchCount - 1}${routineIdParam ? `&routineId=${routineIdParam}` : ''}`);
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
                router.push(`/stretches/${encodeURIComponent(workout.name)}?index=${preStretchCount - 1}${routineIdParam ? `&routineId=${routineIdParam}` : ''}`);
            }
        }
    };
    const handleForwardClick = ()=>{
        // Can only go forward if there are completed exercises ahead
        if (viewingExerciseIndex < currentExerciseIndex) {
            setViewingExerciseIndex(viewingExerciseIndex + 1);
        }
    };
    const buildSingleExercise = (exercise)=>({
            type: 'single',
            name: exercise.name,
            sets: 3,
            targetReps: 10,
            targetWeight: 0,
            warmupWeight: 0,
            restTime: 60,
            videoUrl: exercise.video_url || '',
            tips: exercise.tips || ''
        });
    const buildSupersetExercise = (exercise1, exercise2)=>({
            type: 'b2b',
            restTime: 30,
            exercises: [
                {
                    name: exercise1.name,
                    sets: 3,
                    targetReps: 10,
                    targetWeight: 0,
                    warmupWeight: 0,
                    videoUrl: exercise1.video_url || '',
                    tips: exercise1.tips || ''
                },
                {
                    name: exercise2.name,
                    sets: 3,
                    targetReps: 10,
                    targetWeight: 0,
                    warmupWeight: 0,
                    videoUrl: exercise2.video_url || '',
                    tips: exercise2.tips || ''
                }
            ]
        });
    const applyWorkoutUpdate = (updatedWorkout)=>{
        setWorkout(updatedWorkout);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveSessionWorkout"])(updatedWorkout, routineIdParam);
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
        if (exercise.type === 'single') {
            const needsWarmup = exercise.warmupWeight !== exercise.targetWeight;
            setSetData({
                weight: needsWarmup ? exercise.warmupWeight : exercise.targetWeight,
                reps: exercise.targetReps
            });
            setCurrentSetIndex(needsWarmup ? 0 : 1);
        } else {
            const b2bExercise = exercise;
            setSetData1({
                weight: b2bExercise.exercises[0].targetWeight,
                reps: b2bExercise.exercises[0].targetReps
            });
            setSetData2({
                weight: b2bExercise.exercises[1].targetWeight,
                reps: b2bExercise.exercises[1].targetReps
            });
            setCurrentSetIndex(1);
        }
        setViewingExerciseIndex(currentExerciseIndex);
    };
    const runWithChangeWarning = (action)=>{
        if (!workout) return;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasChangeWarningAck"])(workout.name, routineIdParam)) {
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["acknowledgeChangeWarning"])(workout.name, routineIdParam);
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
        const insertIndex = currentExerciseIndex + 1;
        if (exerciseActionMode === 'add') {
            updatedExercises.splice(insertIndex, 0, nextExercise);
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
        const insertIndex = currentExerciseIndex + 1;
        if (exerciseActionMode === 'add') {
            updatedExercises.splice(insertIndex, 0, nextExercise);
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
    const exerciseModifyControls = !isReviewMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-2 gap-3 mb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>openExerciseTypePicker('add'),
                className: "bg-emerald-600/80 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-semibold transition-colors",
                children: "+ Add Exercise"
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 704,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>openExerciseTypePicker('replace'),
                className: "bg-orange-600/80 hover:bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold transition-colors",
                children: "↺ Replace Exercise"
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 710,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/workout/[name]/active/page.tsx",
        lineNumber: 703,
        columnNumber: 5
    }, this) : null;
    // Handle B2B/Superset exercises
    if (exerciseToDisplay.type === 'b2b') {
        const b2bExercise = exerciseToDisplay;
        const ex1 = b2bExercise.exercises[0];
        const ex2 = b2bExercise.exercises[1];
        // In review mode, show cached completed pairs
        const displayCompletedPairs = isReviewMode && viewingCachedData ? viewingCachedData.completedPairs || [] : completedPairs;
        // Transition Screen (for B2B)
        if (isTransitioning) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-zinc-900 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-2xl mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400",
                                children: [
                                    "Exercise ",
                                    currentExerciseIndex + 1,
                                    "/",
                                    workout.exercises.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 737,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 736,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-white text-center mb-2",
                            children: ex1.name
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 741,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-purple-400 text-center text-lg mb-8",
                            children: [
                                "+ ",
                                ex2.name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 742,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-green-500 text-6xl mb-2",
                                    children: "✓"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 746,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-white text-2xl font-semibold",
                                    children: "EXERCISE COMPLETE"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 747,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 745,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 ${transitionTimeRemaining === 0 ? 'border-zinc-700' : 'border-orange-600'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `text-xl mb-4 ${transitionTimeRemaining === 0 ? 'text-zinc-400' : 'text-orange-400'}`,
                                    children: "Chilll Outtt"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 752,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `text-8xl font-bold mb-2 ${transitionTimeRemaining === 0 ? 'text-orange-400' : 'text-white'}`,
                                    children: transitionTimeRemaining
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 753,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-400 text-lg",
                                    children: "seconds"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 756,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 751,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setTransitionTimeRemaining(0),
                                    className: "w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-lg font-bold transition-colors",
                                    children: "Skip Timer →"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 761,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setTransitionTimeRemaining(Math.max(0, transitionTimeRemaining - 15)),
                                            className: "bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-colors",
                                            children: "-15s"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 768,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setTransitionTimeRemaining(transitionTimeRemaining + 15),
                                            className: "bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-colors",
                                            children: "+15s"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 774,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 767,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 760,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 734,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 733,
                columnNumber: 9
            }, this);
        }
        // Rest Timer Screen (for B2B)
        if (isResting) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-zinc-900 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-2xl mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400",
                                children: [
                                    "Exercise ",
                                    currentExerciseIndex + 1,
                                    "/",
                                    workout.exercises.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 794,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 793,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-white text-center mb-2",
                            children: ex1.name
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 798,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-purple-400 text-center text-lg mb-8",
                            children: [
                                "+ ",
                                ex2.name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 799,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-green-500 text-6xl mb-2",
                                    children: "✓"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 803,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-white text-2xl font-semibold",
                                    children: [
                                        "SET ",
                                        completedPairs.length,
                                        " COMPLETE"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 804,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 802,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 ${restTimeRemaining === 0 ? 'border-zinc-700' : 'border-purple-600'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `text-xl mb-4 ${restTimeRemaining === 0 ? 'text-zinc-400' : 'text-purple-400'}`,
                                    children: "REST TIME"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 811,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `text-8xl font-bold mb-2 ${restTimeRemaining === 0 ? 'text-purple-400' : 'text-white'}`,
                                    children: restTimeRemaining
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 812,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-400 text-lg",
                                    children: "seconds"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 815,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 810,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-4 mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleAddTime,
                                    className: "bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                    children: "+ Add 15s"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 820,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSkipRest,
                                    className: "bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                    children: restTimeRemaining === 0 ? 'Continue Workout' : 'Skip Rest'
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 826,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 819,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-zinc-800 rounded-lg p-4 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-400 text-sm mb-2",
                                    children: "Next up:"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 836,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-white text-xl font-semibold",
                                    children: [
                                        "Set ",
                                        currentSetIndex
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 837,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-300 text-base",
                                    children: [
                                        ex1.name,
                                        " → ",
                                        ex2.name
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 840,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 835,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 791,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 790,
                columnNumber: 9
            }, this);
        }
        // B2B Exercise Tracking Screen
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 p-4 pb-32",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 853,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$WorkoutNavHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        exitUrl: `/workout/${encodeURIComponent(workout.name)}${routineQuery}`,
                        previousUrl: null,
                        onPrevious: handlePreviousSection,
                        onNext: isReviewMode ? ()=>setViewingExerciseIndex(viewingExerciseIndex + 1) : undefined
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 855,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-zinc-400 text-right mb-4 -mt-4",
                        children: [
                            "Exercise ",
                            viewingExerciseIndex + 1,
                            "/",
                            workout.exercises.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 861,
                        columnNumber: 11
                    }, this),
                    isReviewMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-yellow-900 border border-yellow-600 rounded-lg p-3 mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-yellow-200 text-sm font-semibold text-center",
                            children: "📖 READ ONLY - Cannot edit completed sets"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 866,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 865,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-2 bg-zinc-800 rounded-full overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full bg-purple-500 transition-all duration-300",
                                    style: {
                                        width: `${progressPercentage}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 875,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 874,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-500 text-sm text-center mt-2",
                                children: [
                                    "Overall Progress: ",
                                    currentProgress,
                                    " / ",
                                    totalItems
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 880,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 873,
                        columnNumber: 11
                    }, this),
                    exerciseModifyControls,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-purple-400 text-sm font-bold mb-2",
                                children: "🔄 SUPERSET"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 889,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white text-lg font-semibold mb-1",
                                children: [
                                    "SET ",
                                    currentSetIndex,
                                    " of ",
                                    ex1.sets
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 890,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 888,
                        columnNumber: 11
                    }, this),
                    (lastExerciseLog || lastPartnerExerciseLog) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-sm mb-3",
                                children: "LAST TIME"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 898,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-purple-400 text-xs font-semibold mb-1",
                                                children: ex1.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 902,
                                                columnNumber: 19
                                            }, this),
                                            lastExerciseLog ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-zinc-500 text-xs mb-2",
                                                        children: formatLocalDate(lastExerciseDate)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 905,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-zinc-300 text-xs",
                                                                    children: [
                                                                        "Set ",
                                                                        setNum,
                                                                        ": ",
                                                                        weight,
                                                                        " × ",
                                                                        reps
                                                                    ]
                                                                }, setNum, true, {
                                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                                    lineNumber: 914,
                                                                    columnNumber: 31
                                                                }, this);
                                                            }
                                                            return null;
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 908,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs",
                                                children: "No history yet"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 924,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 901,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-purple-400 text-xs font-semibold mb-1",
                                                children: ex2.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 929,
                                                columnNumber: 19
                                            }, this),
                                            lastPartnerExerciseLog ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-zinc-500 text-xs mb-2",
                                                        children: formatLocalDate(lastPartnerExerciseDate)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 932,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-zinc-300 text-xs",
                                                                    children: [
                                                                        "Set ",
                                                                        setNum,
                                                                        ": ",
                                                                        weight,
                                                                        " × ",
                                                                        reps
                                                                    ]
                                                                }, setNum, true, {
                                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                                    lineNumber: 941,
                                                                    columnNumber: 31
                                                                }, this);
                                                            }
                                                            return null;
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 935,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs",
                                                children: "No history yet"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 951,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 928,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 899,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 897,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `bg-zinc-800 rounded-lg p-5 mb-4 transition-all ${currentExerciseInPair === 0 ? 'border-2 border-purple-600' : 'border border-zinc-700 opacity-60'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs mb-1",
                                                children: [
                                                    "Exercise 1 of 2 ",
                                                    currentExerciseInPair === 0 ? '(ACTIVE)' : completedPairs.length >= currentSetIndex ? '(Done)' : '(Next)'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 964,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-bold text-white mb-2",
                                                children: ex1.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 967,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 963,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVideoUrl"])(ex1.name, ex1.videoUrl),
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded",
                                        children: "📺 Video"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 969,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 962,
                                columnNumber: 13
                            }, this),
                            !isReviewMode && currentExerciseInPair === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-zinc-900 rounded-lg p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-zinc-400 text-xs block mb-1",
                                                        children: "Weight (lbs)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 984,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        inputMode: "decimal",
                                                        value: setData1.weight ?? '',
                                                        onChange: (e)=>{
                                                            const val = e.target.value;
                                                            if (val === '') {
                                                                setSetData1({
                                                                    ...setData1,
                                                                    weight: 0
                                                                });
                                                            } else {
                                                                const num = parseFloat(val);
                                                                if (!isNaN(num)) {
                                                                    setSetData1({
                                                                        ...setData1,
                                                                        weight: num
                                                                    });
                                                                }
                                                            }
                                                        },
                                                        className: "w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 985,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 983,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-zinc-900 rounded-lg p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-zinc-400 text-xs block mb-1",
                                                        children: "Reps"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1004,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                        lineNumber: 1005,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1003,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 982,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 rounded p-3 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs mb-1",
                                                children: "Form Tips"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1016,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-300 text-sm",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFormTips"])(ex1.tips)
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1017,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1015,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCompleteB2BExercise,
                                        className: "w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-bold transition-colors",
                                        children: "✓ Complete Exercise 1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1020,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-zinc-900 rounded p-3 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-zinc-500 text-xs mb-1",
                                                    children: "Weight"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1032,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-white text-xl font-semibold",
                                                    children: [
                                                        setData1.weight,
                                                        " lbs"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1033,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1031,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-zinc-900 rounded p-3 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-zinc-500 text-xs mb-1",
                                                    children: "Reps"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1038,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-white text-xl font-semibold",
                                                    children: setData1.reps
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1039,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1037,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1030,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 959,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `bg-zinc-800 rounded-lg p-5 mb-6 transition-all ${currentExerciseInPair === 1 ? 'border-2 border-purple-600' : 'border border-zinc-700 opacity-60'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs mb-1",
                                                children: [
                                                    "Exercise 2 of 2 ",
                                                    currentExerciseInPair === 1 ? '(ACTIVE)' : currentExerciseInPair === 0 ? '(Next)' : '(Done)'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1054,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-bold text-white mb-2",
                                                children: ex2.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1057,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1053,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVideoUrl"])(ex2.name, ex2.videoUrl),
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded",
                                        children: "📺 Video"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1059,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1052,
                                columnNumber: 13
                            }, this),
                            !isReviewMode && currentExerciseInPair === 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-zinc-900 rounded-lg p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-zinc-400 text-xs block mb-1",
                                                        children: "Weight (lbs)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1074,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        inputMode: "decimal",
                                                        value: setData2.weight ?? '',
                                                        onChange: (e)=>{
                                                            const val = e.target.value;
                                                            if (val === '') {
                                                                setSetData2({
                                                                    ...setData2,
                                                                    weight: 0
                                                                });
                                                            } else {
                                                                const num = parseFloat(val);
                                                                if (!isNaN(num)) {
                                                                    setSetData2({
                                                                        ...setData2,
                                                                        weight: num
                                                                    });
                                                                }
                                                            }
                                                        },
                                                        className: "w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1075,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1073,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-zinc-900 rounded-lg p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-zinc-400 text-xs block mb-1",
                                                        children: "Reps"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 1094,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                        lineNumber: 1095,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1093,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1072,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 rounded p-3 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs mb-1",
                                                children: "Form Tips"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1106,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-300 text-sm",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFormTips"])(ex2.tips)
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1107,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1105,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleCompleteB2BExercise,
                                                className: "w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-bold transition-colors",
                                                children: "✓ Complete Exercise 2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1111,
                                                columnNumber: 19
                                            }, this),
                                            completedPairs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleEndExercise,
                                                className: "w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition-colors",
                                                children: "End Exercise & Continue"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 1118,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 1110,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-zinc-900 rounded p-3 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-zinc-500 text-xs mb-1",
                                                    children: "Weight"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1132,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-white text-xl font-semibold",
                                                    children: [
                                                        setData2.weight,
                                                        " lbs"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1133,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1131,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-zinc-900 rounded p-3 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-zinc-500 text-xs mb-1",
                                                    children: "Reps"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1138,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-white text-xl font-semibold",
                                                    children: setData2.reps
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 1139,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1137,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1130,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1049,
                        columnNumber: 11
                    }, this),
                    displayCompletedPairs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-zinc-800 rounded-lg p-4 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-sm mb-2",
                                children: "COMPLETED SETS"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1151,
                                columnNumber: 15
                            }, this),
                            displayCompletedPairs.map((pair, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-green-400 text-sm font-semibold mb-1",
                                            children: [
                                                "Set ",
                                                index + 1,
                                                ":"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1154,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-zinc-300 text-xs ml-2",
                                            children: [
                                                "✓ ",
                                                ex1.name,
                                                ": ",
                                                pair.ex1.weight,
                                                " lbs × ",
                                                pair.ex1.reps,
                                                " reps"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1155,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-zinc-300 text-xs ml-2",
                                            children: [
                                                "✓ ",
                                                ex2.name,
                                                ": ",
                                                pair.ex2.weight,
                                                " lbs × ",
                                                pair.ex2.reps,
                                                " reps"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1158,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, index, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1153,
                                    columnNumber: 17
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1150,
                        columnNumber: 13
                    }, this),
                    !isReviewMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            if (currentExerciseIndex < workout.exercises.length - 1) {
                                const nextExerciseIndex = currentExerciseIndex + 1;
                                setCurrentExerciseIndex(nextExerciseIndex);
                                setViewingExerciseIndex(nextExerciseIndex);
                                setCompletedPairs([]);
                                // Initialize next exercise
                                const nextExercise = workout.exercises[nextExerciseIndex];
                                if (nextExercise.type === 'single') {
                                    const needsWarmup = nextExercise.warmupWeight !== nextExercise.targetWeight;
                                    setSetData({
                                        weight: needsWarmup ? nextExercise.warmupWeight : nextExercise.targetWeight,
                                        reps: nextExercise.targetReps
                                    });
                                    setCurrentSetIndex(needsWarmup ? 0 : 1);
                                } else {
                                    const b2bEx = nextExercise;
                                    setSetData1({
                                        weight: b2bEx.exercises[0].targetWeight,
                                        reps: b2bEx.exercises[0].targetReps
                                    });
                                    setSetData2({
                                        weight: b2bEx.exercises[1].targetWeight,
                                        reps: b2bEx.exercises[1].targetReps
                                    });
                                    setCurrentSetIndex(1);
                                    setCurrentExerciseInPair(0);
                                }
                            } else {
                                // Always go to cardio (optional)
                                router.push(`/workout/${encodeURIComponent(workout.name)}/cardio${routineQuery}`);
                            }
                        },
                        className: "w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                        children: "Skip Exercise"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1168,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 852,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 851,
            columnNumber: 7
        }, this);
    }
    const exercise = exerciseToDisplay;
    const isWarmupSet = currentSetIndex === 0;
    // In review mode, show cached completed sets
    const displayCompletedSets = isReviewMode && viewingCachedData ? viewingCachedData.completedSets || [] : completedSets;
    // Transition Screen (between exercises)
    if (isTransitioning) {
        const nextExercise = workout.exercises[currentExerciseIndex + 1];
        const nextExerciseName = nextExercise.type === 'single' ? nextExercise.name : `${nextExercise.exercises[0].name} / ${nextExercise.exercises[1].name}`;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto flex flex-col items-center justify-center min-h-screen",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full mb-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-2 bg-zinc-800 rounded-full overflow-hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full bg-orange-500 transition-all duration-300",
                                style: {
                                    width: `${progressPercentage}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1234,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1233,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1232,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-zinc-400 text-xl mb-4",
                        children: "Next Exercise"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1242,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-bold text-white text-center mb-12 px-4",
                        children: nextExerciseName
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1245,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `bg-zinc-800 rounded-lg p-16 mb-12 text-center border-4 ${transitionTimeRemaining === 0 ? 'border-zinc-700' : 'border-blue-600'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `text-xl mb-4 ${transitionTimeRemaining === 0 ? 'text-zinc-400' : 'text-blue-400'}`,
                                children: "Chilll Outtt"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1251,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `text-9xl font-bold mb-2 ${transitionTimeRemaining === 0 ? 'text-blue-400' : 'text-white'}`,
                                children: transitionTimeRemaining
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1252,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-lg",
                                children: "seconds"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1255,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1250,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSkipTransition,
                        className: "bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-lg text-2xl font-bold transition-colors",
                        children: "I'm Ready →"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1259,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1230,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 1229,
            columnNumber: 7
        }, this);
    }
    // Rest Timer Screen
    if (isResting) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400",
                            children: [
                                "Exercise ",
                                currentExerciseIndex + 1,
                                "/",
                                workout.exercises.length
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1277,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1276,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold text-white text-center mb-8",
                        children: exercise.name
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1281,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-green-500 text-6xl mb-2",
                                children: "✓"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1285,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white text-2xl font-semibold",
                                children: [
                                    exercise.warmupWeight !== exercise.targetWeight && completedSets.length === 1 ? 'WARMUP SET' : `SET ${exercise.warmupWeight !== exercise.targetWeight ? completedSets.length - 1 : completedSets.length}`,
                                    " COMPLETE"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1286,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1284,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 ${restTimeRemaining === 0 ? 'border-zinc-700' : 'border-orange-600'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `text-xl mb-4 ${restTimeRemaining === 0 ? 'text-zinc-400' : 'text-orange-400'}`,
                                children: "REST TIME"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1295,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `text-8xl font-bold mb-2 ${restTimeRemaining === 0 ? 'text-orange-400' : 'text-white'}`,
                                children: restTimeRemaining
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1296,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-lg",
                                children: "seconds"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1299,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1294,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-4 mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleAddTime,
                                className: "bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                children: "+ Add 15s"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1304,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSkipRest,
                                className: "bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                children: restTimeRemaining === 0 ? 'Continue Workout' : 'Skip Rest'
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1310,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1303,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-zinc-800 rounded-lg p-4 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-sm mb-2",
                                children: "Next up:"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1320,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white text-xl font-semibold",
                                children: [
                                    "Set ",
                                    currentSetIndex,
                                    " (Working)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1321,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-300 text-lg",
                                children: [
                                    exercise.targetWeight,
                                    " lbs × ",
                                    exercise.targetReps,
                                    " reps"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1324,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1319,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1274,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 1273,
            columnNumber: 7
        }, this);
    }
    // Exit Confirmation Modal
    if (showExitConfirm) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md w-full bg-zinc-800 rounded-lg p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-white text-2xl font-bold mb-4",
                        children: "Exit Routine?"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1338,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-zinc-300 mb-6",
                        children: "You will lose your current routine progress. Completed exercises have been saved to the database."
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1339,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowExitConfirm(false),
                                className: "bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                                children: "Continue"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1343,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors text-center",
                                children: "Exit Routine"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1349,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1342,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1337,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 1336,
            columnNumber: 7
        }, this);
    }
    // Exercise Tracking Screen
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-900 p-4 pb-32",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-2xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1365,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$WorkoutNavHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    exitUrl: `/workout/${encodeURIComponent(workout.name)}${routineQuery}`,
                    previousUrl: null,
                    onPrevious: handlePreviousSection,
                    onNext: isReviewMode ? ()=>setViewingExerciseIndex(viewingExerciseIndex + 1) : undefined
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1367,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-zinc-400 text-right mb-4 -mt-4",
                    children: [
                        "Exercise ",
                        viewingExerciseIndex + 1,
                        "/",
                        workout.exercises.length
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1373,
                    columnNumber: 9
                }, this),
                isReviewMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-yellow-900 border border-yellow-600 rounded-lg p-3 mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-yellow-200 text-sm font-semibold text-center",
                        children: "📖 READ ONLY - Cannot edit completed sets"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1378,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1377,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-2 bg-zinc-800 rounded-full overflow-hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full bg-orange-500 transition-all duration-300",
                                style: {
                                    width: `${progressPercentage}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1387,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1386,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-500 text-sm text-center mt-2",
                            children: [
                                "Overall Progress: ",
                                currentProgress,
                                " / ",
                                totalItems
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1392,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1385,
                    columnNumber: 9
                }, this),
                exerciseModifyControls,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-white mb-6",
                    children: exercise.name
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1400,
                    columnNumber: 9
                }, this),
                lastExerciseLog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm mb-2",
                            children: [
                                "LAST TIME (",
                                formatLocalDate(lastExerciseDate),
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1405,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: [
                                lastExerciseLog.warmup_weight !== null && lastExerciseLog.warmup_reps !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-300 text-sm",
                                    children: [
                                        "Warmup: ",
                                        lastExerciseLog.warmup_weight,
                                        " lbs × ",
                                        lastExerciseLog.warmup_reps,
                                        " reps"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1410,
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
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-zinc-300 text-sm",
                                            children: [
                                                "Set ",
                                                setNum,
                                                ": ",
                                                weight,
                                                " lbs × ",
                                                reps,
                                                " reps"
                                            ]
                                        }, setNum, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1419,
                                            columnNumber: 21
                                        }, this);
                                    }
                                    return null;
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1408,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1404,
                    columnNumber: 11
                }, this),
                !isReviewMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-6 mb-6 border-2 border-orange-600",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-orange-400 text-lg font-semibold mb-2",
                                children: isWarmupSet ? 'WARMUP SET' : `SET ${currentSetIndex} (WORKING)`
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1434,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1433,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-4 mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-zinc-900 rounded-lg p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-zinc-400 text-sm block mb-2",
                                            children: "Weight (lbs)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1442,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            inputMode: "decimal",
                                            value: setData.weight ?? '',
                                            onChange: (e)=>{
                                                const val = e.target.value;
                                                if (val === '') {
                                                    setSetData({
                                                        ...setData,
                                                        weight: 0
                                                    });
                                                } else {
                                                    const num = parseFloat(val);
                                                    if (!isNaN(num)) {
                                                        setSetData({
                                                            ...setData,
                                                            weight: num
                                                        });
                                                    }
                                                }
                                            },
                                            className: "w-full bg-zinc-800 text-white text-3xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1443,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1441,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-zinc-900 rounded-lg p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-zinc-400 text-sm block mb-2",
                                            children: "Reps"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1462,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            inputMode: "numeric",
                                            value: setData.reps ?? '',
                                            onChange: (e)=>setSetData({
                                                    ...setData,
                                                    reps: parseInt(e.target.value) || 0
                                                }),
                                            className: "w-full bg-zinc-800 text-white text-3xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1463,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1461,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1440,
                            columnNumber: 11
                        }, this),
                        isWarmupSet ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSkipWarmup,
                                    className: "bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                    children: "Skip Warmup"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1476,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCompleteSet,
                                    className: "bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-lg font-bold transition-colors",
                                    children: "✓ Complete Warmup"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1482,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1475,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCompleteSet,
                                    className: "w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors",
                                    children: [
                                        "✓ Complete Set ",
                                        currentSetIndex
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1491,
                                    columnNumber: 15
                                }, this),
                                completedSets.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleEndExercise,
                                    className: "w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition-colors",
                                    children: "End Exercise & Continue"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1498,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1490,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1432,
                    columnNumber: 9
                }, this),
                displayCompletedSets.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-4 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm mb-2",
                            children: "COMPLETED SETS"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1513,
                            columnNumber: 13
                        }, this),
                        displayCompletedSets.map((set, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-green-400 text-sm mb-1",
                                children: [
                                    "✓ ",
                                    index === 0 ? 'Warmup' : `Set ${index}`,
                                    ": ",
                                    set.weight,
                                    " lbs × ",
                                    set.reps,
                                    " reps"
                                ]
                            }, index, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1515,
                                columnNumber: 15
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1512,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-4 mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm mb-2",
                            children: "FORM TIPS"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1524,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-zinc-200 text-base leading-relaxed",
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFormTips"])(exercise.tips)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1525,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1523,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: isReviewMode ? '' : 'grid grid-cols-2 gap-4',
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVideoUrl"])(exercise.name, exercise.videoUrl),
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "block bg-red-600 hover:bg-red-700 text-white text-center py-3 rounded-lg font-semibold transition-colors",
                            children: "📺 Watch Video"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1530,
                            columnNumber: 11
                        }, this),
                        !isReviewMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                if (currentExerciseIndex < workout.exercises.length - 1) {
                                    const nextExerciseIndex = currentExerciseIndex + 1;
                                    setCurrentExerciseIndex(nextExerciseIndex);
                                    setViewingExerciseIndex(nextExerciseIndex);
                                    setCompletedSets([]);
                                    // Initialize next exercise
                                    const nextExercise = workout.exercises[nextExerciseIndex];
                                    if (nextExercise.type === 'single') {
                                        const needsWarmup = nextExercise.warmupWeight !== nextExercise.targetWeight;
                                        setSetData({
                                            weight: needsWarmup ? nextExercise.warmupWeight : nextExercise.targetWeight,
                                            reps: nextExercise.targetReps
                                        });
                                        setCurrentSetIndex(needsWarmup ? 0 : 1);
                                    } else {
                                        const b2bEx = nextExercise;
                                        setSetData1({
                                            weight: b2bEx.exercises[0].targetWeight,
                                            reps: b2bEx.exercises[0].targetReps
                                        });
                                        setSetData2({
                                            weight: b2bEx.exercises[1].targetWeight,
                                            reps: b2bEx.exercises[1].targetReps
                                        });
                                        setCurrentSetIndex(1);
                                        setCurrentExerciseInPair(0);
                                        setCompletedPairs([]);
                                    }
                                } else {
                                    // Always go to cardio (optional)
                                    router.push(`/workout/${encodeURIComponent(workout.name)}/cardio${routineQuery}`);
                                }
                            },
                            className: "bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                            children: "Skip Exercise"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1539,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1529,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 1364,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/workout/[name]/active/page.tsx",
        lineNumber: 1363,
        columnNumber: 5
    }, this);
}
_s(ActiveWorkoutContent, "/z8JUmZMLn4p+JB3EfWE1p/2F9g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = ActiveWorkoutContent;
function ActiveWorkoutPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white text-2xl",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1590,
                columnNumber: 9
            }, void 0)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 1589,
            columnNumber: 7
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActiveWorkoutContent, {}, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 1593,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/workout/[name]/active/page.tsx",
        lineNumber: 1588,
        columnNumber: 5
    }, this);
}
_c1 = ActiveWorkoutPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "ActiveWorkoutContent");
__turbopack_context__.k.register(_c1, "ActiveWorkoutPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_4d15e01e._.js.map