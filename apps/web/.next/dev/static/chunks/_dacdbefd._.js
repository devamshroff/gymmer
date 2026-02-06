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
    ()=>initWorkoutSession,
    "isSessionMode",
    ()=>isSessionMode,
    "resolveSessionMode",
    ()=>resolveSessionMode,
    "setWorkoutSessionMode",
    ()=>setWorkoutSessionMode
]);
const STORAGE_KEY = 'current_workout_session';
function isSessionMode(value) {
    return value === 'incremental' || value === 'maintenance' || value === 'light';
}
function resolveSessionMode(value, fallback = 'incremental') {
    return isSessionMode(value) ? value : fallback;
}
function initWorkoutSession(workoutName, sessionMode = 'incremental') {
    const session = {
        workoutName,
        startTime: new Date().toISOString(),
        sessionMode,
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
    if (!data) return null;
    const parsed = JSON.parse(data);
    parsed.sessionMode = resolveSessionMode(parsed.sessionMode, 'incremental');
    return parsed;
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
function setWorkoutSessionMode(mode) {
    const session = getWorkoutSession();
    if (!session) return;
    session.sessionMode = mode;
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
"[project]/app/components/Timer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Timer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function Timer({ timerSeconds, onComplete }) {
    // Don't render anything if no timer is needed
    if (!timerSeconds || timerSeconds <= 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TimerContent, {
        timerSeconds: timerSeconds,
        onComplete: onComplete
    }, void 0, false, {
        fileName: "[project]/app/components/Timer.tsx",
        lineNumber: 16,
        columnNumber: 10
    }, this);
}
_c = Timer;
function TimerContent({ timerSeconds, onComplete }) {
    _s();
    const totalSeconds = timerSeconds;
    const [secondsLeft, setSecondsLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(totalSeconds);
    const [isRunning, setIsRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasStarted, setHasStarted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const endTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const didCompleteRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimerContent.useEffect": ()=>{
            // Reset timer when timerSeconds changes
            setSecondsLeft(timerSeconds);
            setIsRunning(false);
            setHasStarted(false);
            endTimeRef.current = null;
            didCompleteRef.current = false;
        }
    }["TimerContent.useEffect"], [
        timerSeconds
    ]);
    const updateRemaining = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TimerContent.useCallback[updateRemaining]": ()=>{
            if (!endTimeRef.current) return;
            const remainingMs = endTimeRef.current - Date.now();
            const nextSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
            setSecondsLeft(nextSeconds);
            if (nextSeconds === 0) {
                setIsRunning(false);
                if (!didCompleteRef.current) {
                    didCompleteRef.current = true;
                    onComplete?.();
                }
            }
        }
    }["TimerContent.useCallback[updateRemaining]"], [
        onComplete
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimerContent.useEffect": ()=>{
            if (!isRunning) return;
            updateRemaining();
            const interval = setInterval(updateRemaining, 250);
            return ({
                "TimerContent.useEffect": ()=>clearInterval(interval)
            })["TimerContent.useEffect"];
        }
    }["TimerContent.useEffect"], [
        isRunning,
        updateRemaining
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimerContent.useEffect": ()=>{
            const handleVisibility = {
                "TimerContent.useEffect.handleVisibility": ()=>{
                    if (document.visibilityState === 'visible') {
                        updateRemaining();
                    }
                }
            }["TimerContent.useEffect.handleVisibility"];
            const handleFocus = {
                "TimerContent.useEffect.handleFocus": ()=>{
                    updateRemaining();
                }
            }["TimerContent.useEffect.handleFocus"];
            document.addEventListener('visibilitychange', handleVisibility);
            window.addEventListener('focus', handleFocus);
            return ({
                "TimerContent.useEffect": ()=>{
                    document.removeEventListener('visibilitychange', handleVisibility);
                    window.removeEventListener('focus', handleFocus);
                }
            })["TimerContent.useEffect"];
        }
    }["TimerContent.useEffect"], [
        updateRemaining
    ]);
    const handleStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TimerContent.useCallback[handleStart]": ()=>{
            const baseSeconds = secondsLeft === 0 ? totalSeconds : secondsLeft;
            if (baseSeconds <= 0) return;
            if (secondsLeft === 0) {
                setSecondsLeft(baseSeconds);
            }
            didCompleteRef.current = false;
            endTimeRef.current = Date.now() + baseSeconds * 1000;
            setIsRunning(true);
            setHasStarted(true);
        }
    }["TimerContent.useCallback[handleStart]"], [
        secondsLeft,
        totalSeconds
    ]);
    const handlePause = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TimerContent.useCallback[handlePause]": ()=>{
            if (endTimeRef.current) {
                const remainingMs = endTimeRef.current - Date.now();
                const nextSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
                setSecondsLeft(nextSeconds);
            }
            endTimeRef.current = null;
            setIsRunning(false);
        }
    }["TimerContent.useCallback[handlePause]"], []);
    const handleReset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TimerContent.useCallback[handleReset]": ()=>{
            setIsRunning(false);
            setSecondsLeft(totalSeconds);
            setHasStarted(false);
            endTimeRef.current = null;
            didCompleteRef.current = false;
        }
    }["TimerContent.useCallback[handleReset]"], [
        totalSeconds
    ]);
    // Format seconds as MM:SS
    const formatTime = (seconds)=>{
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    // Calculate progress percentage
    const progressPercentage = (totalSeconds - secondsLeft) / totalSeconds * 100;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-900 rounded-lg p-4 mb-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `text-5xl font-bold font-mono ${secondsLeft <= 5 && isRunning ? 'text-red-500 animate-pulse' : 'text-white'}`,
                        children: formatTime(secondsLeft)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Timer.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    secondsLeft === 0 && hasStarted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-blue-300 text-lg font-semibold mt-2",
                        children: "Complete!"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Timer.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Timer.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            hasStarted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-2 bg-zinc-700 rounded-full overflow-hidden mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `h-full transition-all duration-1000 ${secondsLeft === 0 ? 'bg-blue-700' : 'bg-blue-500'}`,
                    style: {
                        width: `${progressPercentage}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/app/components/Timer.tsx",
                    lineNumber: 135,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Timer.tsx",
                lineNumber: 134,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-3 justify-center",
                children: [
                    !isRunning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleStart,
                        className: "bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xl",
                                children: "▶"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Timer.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, this),
                            hasStarted && secondsLeft > 0 ? 'Resume' : secondsLeft === 0 ? 'Restart' : 'Start Timer'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Timer.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handlePause,
                        className: "bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xl",
                                children: "⏸"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Timer.tsx",
                                lineNumber: 159,
                                columnNumber: 13
                            }, this),
                            "Pause"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Timer.tsx",
                        lineNumber: 155,
                        columnNumber: 11
                    }, this),
                    hasStarted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleReset,
                        className: "bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors",
                        children: "Reset"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Timer.tsx",
                        lineNumber: 164,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Timer.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Timer.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
}
_s(TimerContent, "hWwkZUrweosZb7epa2omAXLvijo=");
_c1 = TimerContent;
var _c, _c1;
__turbopack_context__.k.register(_c, "Timer");
__turbopack_context__.k.register(_c1, "TimerContent");
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
"[project]/app/components/StretchCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StretchCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Timer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Timer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-media.ts [app-client] (ecmascript)");
'use client';
;
;
;
function StretchCard({ stretch, timerKey = 0, variant = 'pre' }) {
    const borderColor = 'border-blue-800';
    const emoji = variant === 'pre' ? '🏃' : '🧘';
    const tips = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFormTips"])(stretch.tips);
    const videoHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVideoUrl"])(stretch.name, stretch.videoUrl);
    const timerSeconds = stretch.timerSeconds && stretch.timerSeconds > 0 ? stretch.timerSeconds : parseDurationToSeconds(stretch.duration);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `bg-zinc-800 rounded-lg p-8 border-2 ${borderColor} mb-8`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-6xl mb-4",
                        children: emoji
                    }, void 0, false, {
                        fileName: "[project]/app/components/StretchCard.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-3xl font-bold text-white mb-4",
                        children: stretch.name
                    }, void 0, false, {
                        fileName: "[project]/app/components/StretchCard.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xl text-blue-300 font-semibold mb-4",
                        children: stretch.duration
                    }, void 0, false, {
                        fileName: "[project]/app/components/StretchCard.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/StretchCard.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Timer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                timerSeconds: timerSeconds
            }, timerKey, false, {
                fileName: "[project]/app/components/StretchCard.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-zinc-900 rounded-lg p-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-zinc-400 text-sm mb-2",
                        children: "Tips:"
                    }, void 0, false, {
                        fileName: "[project]/app/components/StretchCard.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-zinc-200 text-lg leading-relaxed",
                        children: tips
                    }, void 0, false, {
                        fileName: "[project]/app/components/StretchCard.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/StretchCard.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: videoHref,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "block w-full bg-red-600 hover:bg-red-700 text-white text-center py-3 rounded-lg text-lg font-semibold transition-colors",
                children: "📺 Watch Video"
            }, void 0, false, {
                fileName: "[project]/app/components/StretchCard.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/StretchCard.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_c = StretchCard;
function parseDurationToSeconds(duration) {
    if (!duration) return 0;
    const value = duration.toLowerCase();
    const clockMatch = value.match(/(\d+)\s*:\s*(\d{2})/);
    if (clockMatch) {
        const minutes = Number(clockMatch[1]);
        const seconds = Number(clockMatch[2]);
        if (Number.isFinite(minutes) && Number.isFinite(seconds)) {
            return minutes * 60 + seconds;
        }
    }
    const minutesMatch = value.match(/(\d+)\s*(?:min|mins|minute|minutes)\b/);
    const secondsMatch = value.match(/(\d+)\s*(?:sec|secs|second|seconds)\b/);
    if (!minutesMatch && !secondsMatch) return 0;
    const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;
    const seconds = secondsMatch ? Number(secondsMatch[1]) : 0;
    const total = minutes * 60 + seconds;
    return Number.isFinite(total) ? total : 0;
}
var _c;
__turbopack_context__.k.register(_c, "StretchCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/QuickStretchForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuickStretchForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function QuickStretchForm({ onSubmit, onCancel, defaultType }) {
    _s();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [duration, setDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [type, setType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultType || 'pre_workout');
    const [videoUrl, setVideoUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [tips, setTips] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [muscleGroups, setMuscleGroups] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!name.trim() || !duration.trim() || !type) return;
        const parsedMuscleGroups = muscleGroups.split(',').map((entry)=>entry.trim()).filter(Boolean);
        setSubmitting(true);
        try {
            await onSubmit({
                name: name.trim(),
                duration: duration.trim(),
                type,
                videoUrl: videoUrl.trim() || undefined,
                tips: tips.trim() || undefined,
                muscleGroups: parsedMuscleGroups.length ? parsedMuscleGroups : undefined
            });
        } finally{
            setSubmitting(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-blue-700",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold text-white mb-4",
                    children: "Create New Stretch"
                }, void 0, false, {
                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-300 text-sm font-semibold block mb-2",
                                    children: [
                                        "Stretch Name ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-500",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickStretchForm.tsx",
                                            lineNumber: 61,
                                            columnNumber: 28
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                                    lineNumber: 60,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: name,
                                    onChange: (e)=>setName(e.target.value),
                                    placeholder: "e.g., Hamstring Stretch",
                                    className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600",
                                    required: true,
                                    autoFocus: true
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/QuickStretchForm.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-300 text-sm font-semibold block mb-2",
                                    children: [
                                        "Duration ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-500",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickStretchForm.tsx",
                                            lineNumber: 76,
                                            columnNumber: 24
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: duration,
                                    onChange: (e)=>setDuration(e.target.value),
                                    placeholder: "e.g., 30 seconds",
                                    className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600",
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/QuickStretchForm.tsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this),
                        !defaultType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-300 text-sm font-semibold block mb-2",
                                    children: [
                                        "Stretch Type ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-500",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickStretchForm.tsx",
                                            lineNumber: 91,
                                            columnNumber: 30
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                                    lineNumber: 90,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: type,
                                    onChange: (e)=>setType(e.target.value),
                                    className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer",
                                    style: {
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    },
                                    required: true,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "pre_workout",
                                            children: "Pre-workout"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickStretchForm.tsx",
                                            lineNumber: 106,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "post_workout",
                                            children: "Post-workout"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/QuickStretchForm.tsx",
                                            lineNumber: 107,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                                    lineNumber: 93,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/QuickStretchForm.tsx",
                            lineNumber: 89,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-300 text-sm font-semibold block mb-2",
                                    children: "Muscle Groups"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: muscleGroups,
                                    onChange: (e)=>setMuscleGroups(e.target.value),
                                    placeholder: "e.g., hamstrings, glutes",
                                    className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/QuickStretchForm.tsx",
                            lineNumber: 112,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-300 text-sm font-semibold block mb-2",
                                    children: "Video URL"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                                    lineNumber: 126,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "url",
                                    value: videoUrl,
                                    onChange: (e)=>setVideoUrl(e.target.value),
                                    placeholder: "https://youtube.com/...",
                                    className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/QuickStretchForm.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-300 text-sm font-semibold block mb-2",
                                    children: "Tips"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                                    lineNumber: 139,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: tips,
                                    onChange: (e)=>setTips(e.target.value),
                                    placeholder: "Form tips, cues, etc.",
                                    rows: 3,
                                    className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                                    lineNumber: 142,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/QuickStretchForm.tsx",
                            lineNumber: 138,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3 pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onCancel,
                                    className: "bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: !name.trim() || !duration.trim() || submitting,
                                    className: "bg-blue-700 hover:bg-blue-800 disabled:bg-blue-900 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors",
                                    children: submitting ? 'Creating...' : 'Create & Select'
                                }, void 0, false, {
                                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                                    lineNumber: 159,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/QuickStretchForm.tsx",
                            lineNumber: 151,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/QuickStretchForm.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/QuickStretchForm.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/QuickStretchForm.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_s(QuickStretchForm, "yMTKe5agzbH1enXhPxQv2UPJCJU=");
_c = QuickStretchForm;
var _c;
__turbopack_context__.k.register(_c, "QuickStretchForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/StretchSelector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StretchSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$QuickStretchForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/QuickStretchForm.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function StretchSelector({ onSelect, onCancel, filterType, title }) {
    _s();
    const [stretches, setStretches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showCreateForm, setShowCreateForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StretchSelector.useEffect": ()=>{
            fetchStretches();
        }
    }["StretchSelector.useEffect"], []);
    const fetchStretches = async ()=>{
        try {
            const response = await fetch('/api/stretches');
            const data = await response.json();
            setStretches(data.stretches);
        } catch (error) {
            console.error('Error fetching stretches:', error);
        } finally{
            setLoading(false);
        }
    };
    const handleCreateStretch = async (stretchData)=>{
        try {
            const response = await fetch('/api/stretches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stretchData)
            });
            if (!response.ok) {
                throw new Error('Failed to create stretch');
            }
            const data = await response.json();
            await fetchStretches();
            const muscleGroupsJson = stretchData.muscleGroups?.length ? JSON.stringify(stretchData.muscleGroups) : null;
            const newStretch = {
                id: data.id,
                name: stretchData.name,
                duration: stretchData.duration,
                timer_seconds: 0,
                type: stretchData.type,
                muscle_groups: muscleGroupsJson,
                video_url: stretchData.videoUrl || null,
                tips: stretchData.tips || null,
                is_custom: 1
            };
            setShowCreateForm(false);
            onSelect(newStretch);
        } catch (error) {
            console.error('Error creating stretch:', error);
            alert('Failed to create stretch. Please try again.');
        }
    };
    const getMuscleGroupTags = (muscleGroupsJson)=>{
        if (!muscleGroupsJson) return [];
        try {
            return JSON.parse(muscleGroupsJson);
        } catch  {
            return [];
        }
    };
    const filteredStretches = stretches.filter((s)=>!filterType || s.type === filterType).filter((s)=>{
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const name = s.name.toLowerCase();
        const muscles = getMuscleGroupTags(s.muscle_groups).join(' ').toLowerCase();
        return name.includes(query) || muscles.includes(query);
    });
    if (showCreateForm) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$QuickStretchForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            onSubmit: handleCreateStretch,
            onCancel: ()=>setShowCreateForm(false),
            defaultType: filterType
        }, void 0, false, {
            fileName: "[project]/app/components/StretchSelector.tsx",
            lineNumber: 114,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] flex flex-col border-2 border-blue-800",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold text-white mb-4",
                    children: title || (filterType === 'pre_workout' ? 'Select Pre-Workout Stretch' : filterType === 'post_workout' ? 'Select Post-Workout Stretch' : 'Select Stretch')
                }, void 0, false, {
                    fileName: "[project]/app/components/StretchSelector.tsx",
                    lineNumber: 125,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4 space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: searchQuery,
                            onChange: (e)=>setSearchQuery(e.target.value),
                            placeholder: "Search by name or muscle group...",
                            className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700",
                            autoFocus: true
                        }, void 0, false, {
                            fileName: "[project]/app/components/StretchSelector.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowCreateForm(true),
                            className: "w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-bold transition-colors",
                            children: "+ Create New Stretch"
                        }, void 0, false, {
                            fileName: "[project]/app/components/StretchSelector.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/StretchSelector.tsx",
                    lineNumber: 130,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto mb-4 space-y-2",
                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-zinc-400 py-8",
                        children: "Loading stretches..."
                    }, void 0, false, {
                        fileName: "[project]/app/components/StretchSelector.tsx",
                        lineNumber: 151,
                        columnNumber: 13
                    }, this) : filteredStretches.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-zinc-400 py-8",
                        children: searchQuery ? 'No stretches found' : 'No stretches available'
                    }, void 0, false, {
                        fileName: "[project]/app/components/StretchSelector.tsx",
                        lineNumber: 153,
                        columnNumber: 13
                    }, this) : filteredStretches.map((stretch)=>{
                        const muscleGroups = getMuscleGroupTags(stretch.muscle_groups);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onSelect(stretch),
                            className: "w-full bg-zinc-900 hover:bg-zinc-700 text-left p-4 rounded-lg transition-colors border-2 border-zinc-700 hover:border-blue-600",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-white font-semibold",
                                            children: stretch.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/StretchSelector.tsx",
                                            lineNumber: 167,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-zinc-400 text-sm mt-1",
                                            children: stretch.duration
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/StretchSelector.tsx",
                                            lineNumber: 168,
                                            columnNumber: 23
                                        }, this),
                                        muscleGroups.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-1 mt-2",
                                            children: muscleGroups.map((muscle, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded",
                                                    children: muscle
                                                }, idx, false, {
                                                    fileName: "[project]/app/components/StretchSelector.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 29
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/StretchSelector.tsx",
                                            lineNumber: 170,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/StretchSelector.tsx",
                                    lineNumber: 166,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/StretchSelector.tsx",
                                lineNumber: 165,
                                columnNumber: 19
                            }, this)
                        }, stretch.id, false, {
                            fileName: "[project]/app/components/StretchSelector.tsx",
                            lineNumber: 160,
                            columnNumber: 17
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/app/components/StretchSelector.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onCancel,
                    className: "w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                    children: "Cancel"
                }, void 0, false, {
                    fileName: "[project]/app/components/StretchSelector.tsx",
                    lineNumber: 190,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/StretchSelector.tsx",
            lineNumber: 124,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/StretchSelector.tsx",
        lineNumber: 123,
        columnNumber: 5
    }, this);
}
_s(StretchSelector, "WfiP3L+zK66ZmP0lzu8x4fU8d/A=");
_c = StretchSelector;
var _c;
__turbopack_context__.k.register(_c, "StretchSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/LoadingScreen.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Full-screen loading indicator
 * Used across workout pages for consistent loading UX
 */ __turbopack_context__.s([
    "default",
    ()=>LoadingScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function LoadingScreen() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-900 flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-white text-2xl",
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/app/components/LoadingScreen.tsx",
            lineNumber: 8,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/LoadingScreen.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = LoadingScreen;
var _c;
__turbopack_context__.k.register(_c, "LoadingScreen");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/ErrorScreen.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ErrorScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
;
function ErrorScreen({ message = 'Something went wrong', backUrl = '/', backText = 'Back to home' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-900 flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-white text-2xl mb-4",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/app/components/ErrorScreen.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: backUrl,
                    className: "text-blue-400 hover:text-blue-300",
                    children: backText
                }, void 0, false, {
                    fileName: "[project]/app/components/ErrorScreen.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/ErrorScreen.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/ErrorScreen.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = ErrorScreen;
var _c;
__turbopack_context__.k.register(_c, "ErrorScreen");
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
"[project]/app/stretches/[workoutName]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StretchesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-session.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$WorkoutNavHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/WorkoutNavHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$StretchCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/StretchCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$StretchSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/StretchSelector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LoadingScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/LoadingScreen.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ErrorScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ErrorScreen.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session-workout.ts [app-client] (ecmascript)");
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
function StretchesContent() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const sessionModeParam = searchParams.get('mode');
    const sessionMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveSessionMode"])(sessionModeParam, 'incremental');
    const [workout, setWorkout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showStretchSelector, setShowStretchSelector] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [stretchActionMode, setStretchActionMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showChangeWarning, setShowChangeWarning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pendingChangeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Get routineId from URL params (for public/favorited routines)
    const routineIdParam = searchParams.get('routineId');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StretchesContent.useEffect": ()=>{
            async function fetchWorkout() {
                try {
                    let apiUrl = `/api/workout/${params.workoutName}`;
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
                    // Initialize workout session when workout is loaded
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initWorkoutSession"])(resolvedWorkout.name, sessionMode);
                    // Check for index in URL (for navigation from other sections)
                    const indexParam = searchParams.get('index');
                    if (indexParam) {
                        const idx = parseInt(indexParam, 10);
                        const stretchCount = resolvedWorkout.preWorkoutStretches?.length || 0;
                        if (!isNaN(idx) && idx >= 0 && idx < stretchCount) {
                            setCurrentIndex(idx);
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
    }["StretchesContent.useEffect"], [
        params.workoutName,
        searchParams,
        routineIdParam
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LoadingScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
            lineNumber: 83,
            columnNumber: 12
        }, this);
    }
    if (!workout) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ErrorScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            message: "Workout not found"
        }, void 0, false, {
            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
            lineNumber: 87,
            columnNumber: 12
        }, this);
    }
    const stretches = workout.preWorkoutStretches || [];
    const workoutName = encodeURIComponent(workout.name);
    // Build query string for passing routineId
    const routineQueryParams = new URLSearchParams();
    if (routineIdParam) routineQueryParams.set('routineId', routineIdParam);
    if (sessionModeParam) {
        routineQueryParams.set('mode', sessionModeParam);
    } else {
        routineQueryParams.set('mode', sessionMode);
    }
    const routineQuery = routineQueryParams.toString() ? `?${routineQueryParams.toString()}` : '';
    const runWithChangeWarning = (action)=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasChangeWarningAck"])(workout.name, routineIdParam)) {
            action();
            return;
        }
        pendingChangeRef.current = action;
        setShowChangeWarning(true);
    };
    const handleWarningContinue = ()=>{
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
    const openStretchSelector = (mode)=>{
        runWithChangeWarning(()=>{
            setStretchActionMode(mode);
            setShowStretchSelector(true);
        });
    };
    const handleSelectStretch = (stretch)=>{
        if (!stretchActionMode) return;
        const updatedStretch = {
            name: stretch.name,
            duration: stretch.duration,
            timerSeconds: stretch.timer_seconds ?? 0,
            videoUrl: stretch.video_url || '',
            tips: stretch.tips || ''
        };
        const updatedStretches = [
            ...stretches
        ];
        const insertIndex = Math.min(currentIndex + 1, updatedStretches.length);
        if (stretchActionMode === 'add') {
            updatedStretches.splice(insertIndex, 0, updatedStretch);
        } else {
            updatedStretches[currentIndex] = updatedStretch;
        }
        const updatedWorkout = {
            ...workout,
            preWorkoutStretches: updatedStretches
        };
        setWorkout(updatedWorkout);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2d$workout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveSessionWorkout"])(updatedWorkout, routineIdParam);
        setStretchActionMode(null);
        setShowStretchSelector(false);
    };
    // If no stretches, show message and skip to exercises
    if (stretches.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-white text-2xl mb-4",
                    children: "No pre-workout stretches"
                }, void 0, false, {
                    fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                    lineNumber: 162,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-xs space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>openStretchSelector('add'),
                            className: "w-full bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-base font-semibold transition-colors",
                            children: "+ Add Stretch"
                        }, void 0, false, {
                            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                            lineNumber: 164,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push(`/workout/${workoutName}/active${routineQuery}`),
                            className: "w-full bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-base font-semibold transition-colors",
                            children: "Start Exercises →"
                        }, void 0, false, {
                            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                    lineNumber: 163,
                    columnNumber: 9
                }, this),
                showChangeWarning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 p-6 text-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold mb-2",
                                children: "Session-only change"
                            }, void 0, false, {
                                fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                                lineNumber: 181,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-zinc-300 mb-6",
                                children: "This edit only applies to today's workout. Edit the routine to make a permanent change."
                            }, void 0, false, {
                                fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                                lineNumber: 182,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleWarningCancel,
                                        className: "rounded-lg bg-zinc-700 py-2 text-sm font-semibold text-white hover:bg-zinc-600",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                                        lineNumber: 186,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleWarningContinue,
                                        className: "rounded-lg bg-blue-800 py-2 text-sm font-semibold text-white hover:bg-blue-700",
                                        children: "Continue"
                                    }, void 0, false, {
                                        fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                                        lineNumber: 192,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                                lineNumber: 185,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                        lineNumber: 180,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                    lineNumber: 179,
                    columnNumber: 11
                }, this),
                showStretchSelector && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$StretchSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    title: "Add Stretch",
                    filterType: "pre_workout",
                    onCancel: ()=>{
                        setShowStretchSelector(false);
                        setStretchActionMode(null);
                    },
                    onSelect: handleSelectStretch
                }, void 0, false, {
                    fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                    lineNumber: 204,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
            lineNumber: 161,
            columnNumber: 7
        }, this);
    }
    const currentStretch = stretches[currentIndex];
    // Calculate total workout items for progress
    const postStretchCount = (workout.postWorkoutStretches || []).length;
    const totalItems = stretches.length + workout.exercises.length + 1 + // cardio (always count it for progress)
    postStretchCount;
    const currentProgress = currentIndex + 1;
    const progressPercentage = currentProgress / totalItems * 100;
    const handleNext = ()=>{
        if (currentIndex < stretches.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Move to exercises
            router.push(`/workout/${workoutName}/active${routineQuery}`);
        }
    };
    const handlePrevious = ()=>{
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    // At index 0, previous is disabled (no previous section)
    };
    const handleSkipAll = ()=>{
        router.push(`/workout/${workoutName}/active${routineQuery}`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-900 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-2xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                    lineNumber: 253,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$WorkoutNavHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    exitUrl: `/workout/${workoutName}${routineQuery}`,
                    previousUrl: null,
                    onPrevious: currentIndex > 0 ? handlePrevious : undefined,
                    skipLabel: "Skip All",
                    onSkip: handleSkipAll
                }, void 0, false, {
                    fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                    lineNumber: 255,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-white mb-2",
                            children: "PRE-WORKOUT STRETCH"
                        }, void 0, false, {
                            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                            lineNumber: 265,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-lg",
                            children: [
                                currentIndex + 1,
                                " of ",
                                stretches.length
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                            lineNumber: 266,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                    lineNumber: 264,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-2 bg-zinc-800 rounded-full overflow-hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full bg-blue-700 transition-all duration-300",
                                style: {
                                    width: `${progressPercentage}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                                lineNumber: 274,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                            lineNumber: 273,
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
                            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                            lineNumber: 279,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                    lineNumber: 272,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-3 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>openStretchSelector('add'),
                            className: "bg-blue-900/80 hover:bg-blue-800 text-white py-2 rounded-lg text-sm font-semibold transition-colors",
                            children: "+ Add Stretch"
                        }, void 0, false, {
                            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                            lineNumber: 285,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>openStretchSelector('replace'),
                            className: "bg-blue-900/80 hover:bg-blue-800 text-white py-2 rounded-lg text-sm font-semibold transition-colors",
                            children: "↺ Replace Stretch"
                        }, void 0, false, {
                            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                            lineNumber: 291,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                    lineNumber: 284,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$StretchCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    stretch: currentStretch,
                    timerKey: currentIndex,
                    variant: "pre"
                }, void 0, false, {
                    fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                    lineNumber: 300,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handlePrevious,
                            disabled: currentIndex === 0,
                            className: `py-4 rounded-lg text-lg font-semibold transition-colors ${currentIndex === 0 ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-zinc-700 hover:bg-zinc-600 text-white'}`,
                            children: "← Previous"
                        }, void 0, false, {
                            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                            lineNumber: 308,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleNext,
                            className: "bg-blue-800 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                            children: currentIndex < stretches.length - 1 ? 'Next Stretch →' : 'Start Exercises →'
                        }, void 0, false, {
                            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                            lineNumber: 319,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                    lineNumber: 307,
                    columnNumber: 9
                }, this),
                showChangeWarning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 p-6 text-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold mb-2",
                                children: "Session-only change"
                            }, void 0, false, {
                                fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                                lineNumber: 330,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-zinc-300 mb-6",
                                children: "This edit only applies to today's workout. Edit the routine to make a permanent change."
                            }, void 0, false, {
                                fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                                lineNumber: 331,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleWarningCancel,
                                        className: "rounded-lg bg-zinc-700 py-2 text-sm font-semibold text-white hover:bg-zinc-600",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                                        lineNumber: 335,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleWarningContinue,
                                        className: "rounded-lg bg-blue-800 py-2 text-sm font-semibold text-white hover:bg-blue-700",
                                        children: "Continue"
                                    }, void 0, false, {
                                        fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                                        lineNumber: 341,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                                lineNumber: 334,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                        lineNumber: 329,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                    lineNumber: 328,
                    columnNumber: 11
                }, this),
                showStretchSelector && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$StretchSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    title: stretchActionMode === 'replace' ? 'Replace Stretch' : 'Add Stretch',
                    filterType: "pre_workout",
                    onCancel: ()=>{
                        setShowStretchSelector(false);
                        setStretchActionMode(null);
                    },
                    onSelect: handleSelectStretch
                }, void 0, false, {
                    fileName: "[project]/app/stretches/[workoutName]/page.tsx",
                    lineNumber: 353,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
            lineNumber: 252,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/stretches/[workoutName]/page.tsx",
        lineNumber: 251,
        columnNumber: 5
    }, this);
}
_s(StretchesContent, "Hkq/jVVqZl6eP7s0/9Kk5gb8JjI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = StretchesContent;
function StretchesPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LoadingScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
            lineNumber: 370,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StretchesContent, {}, void 0, false, {
            fileName: "[project]/app/stretches/[workoutName]/page.tsx",
            lineNumber: 371,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/stretches/[workoutName]/page.tsx",
        lineNumber: 370,
        columnNumber: 5
    }, this);
}
_c1 = StretchesPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "StretchesContent");
__turbopack_context__.k.register(_c1, "StretchesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_dacdbefd._.js.map