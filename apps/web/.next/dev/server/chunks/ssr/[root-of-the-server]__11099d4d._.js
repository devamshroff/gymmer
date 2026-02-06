module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
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
"[project]/lib/workout-session.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function getWorkoutSession() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const data = undefined;
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
"[project]/app/components/Header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
'use client';
;
;
function Header() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: "/",
        className: "block text-center mb-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
}),
"[project]/app/workout/[name]/active/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-session.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Header.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
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
    // Single exercise state
    const [setData, setSetData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        weight: 0,
        reps: 0
    });
    const [completedSets, setCompletedSets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
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
    const [isTransitioning, setIsTransitioning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [transitionTimeRemaining, setTransitionTimeRemaining] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(60);
    const [showExitConfirm, setShowExitConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Last exercise log from database
    const [lastExerciseLog, setLastExerciseLog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [completedExercisesCache, setCompletedExercisesCache] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [viewingExerciseIndex, setViewingExerciseIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0); // Which exercise we're viewing (can be past/current)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function fetchWorkout() {
            try {
                const response = await fetch(`/api/workout/${params.name}`);
                if (!response.ok) {
                    throw new Error('Workout not found');
                }
                const data = await response.json();
                setWorkout(data.workout);
                // Check for index in URL (for navigation from other sections)
                const indexParam = searchParams.get('index');
                let startIndex = 0;
                if (indexParam && !initialIndexSet) {
                    const idx = parseInt(indexParam, 10);
                    if (!isNaN(idx) && idx >= 0 && idx < data.workout.exercises.length) {
                        startIndex = idx;
                        setCurrentExerciseIndex(idx);
                        setViewingExerciseIndex(idx);
                    }
                    setInitialIndexSet(true);
                }
                // Initialize exercise at startIndex
                const exercise = data.workout.exercises[startIndex];
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
    }, [
        params.name,
        searchParams,
        initialIndexSet
    ]);
    // Rest timer countdown
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isResting && restTimeRemaining > 0) {
            const timer = setTimeout(()=>{
                setRestTimeRemaining(restTimeRemaining - 1);
            }, 1000);
            return ()=>clearTimeout(timer);
        } else if (isResting && restTimeRemaining === 0) {
            // Vibrate when rest is complete
            if ('vibrate' in navigator) {
                navigator.vibrate(500);
            }
        }
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
    }, [
        isTransitioning,
        transitionTimeRemaining,
        workout,
        currentExerciseIndex
    ]);
    // Fetch last exercise log from database when exercise changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function fetchLastExerciseLog() {
            if (!workout) return;
            const currentExercise = workout.exercises[currentExerciseIndex];
            let exerciseName = '';
            if (currentExercise.type === 'single') {
                exerciseName = currentExercise.name;
            } else {
                // For B2B, use the first exercise name
                exerciseName = currentExercise.exercises[0].name;
            }
            try {
                const response = await fetch(`/api/last-exercise?workoutName=${encodeURIComponent(workout.name)}&exerciseName=${encodeURIComponent(exerciseName)}`);
                if (response.ok) {
                    const data = await response.json();
                    setLastExerciseLog(data.lastLog);
                }
            } catch (error) {
                console.error('Error fetching last exercise log:', error);
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
                lineNumber: 208,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 207,
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
                        lineNumber: 217,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "text-blue-400 hover:text-blue-300",
                        children: "Back to home"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 216,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 215,
            columnNumber: 7
        }, this);
    }
    const currentExercise = workout.exercises[currentExerciseIndex];
    // Review mode: determine if viewing a previous exercise
    const isReviewMode = viewingExerciseIndex < currentExerciseIndex;
    const viewingExercise = workout.exercises[viewingExerciseIndex];
    const viewingCachedData = completedExercisesCache.find((cache)=>cache.exerciseIndex === viewingExerciseIndex);
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
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addExerciseToSession"])({
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
                    router.push(`/workout/${encodeURIComponent(workout.name)}/cardio`);
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
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addExerciseToSession"])({
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
                router.push(`/workout/${encodeURIComponent(workout.name)}/cardio`);
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
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addExerciseToSession"])({
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
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addExerciseToSession"])({
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
            router.push(`/workout/${encodeURIComponent(workout.name)}/cardio`);
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
                router.push(`/stretches/${encodeURIComponent(workout.name)}?index=${preStretchCount - 1}`);
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
                router.push(`/stretches/${encodeURIComponent(workout.name)}?index=${preStretchCount - 1}`);
            }
        }
    };
    const handleForwardClick = ()=>{
        // Can only go forward if there are completed exercises ahead
        if (viewingExerciseIndex < currentExerciseIndex) {
            setViewingExerciseIndex(viewingExerciseIndex + 1);
        }
    };
    // Handle B2B/Superset exercises
    if (currentExercise.type === 'b2b') {
        const b2bExercise = isReviewMode ? viewingExercise : currentExercise;
        const ex1 = b2bExercise.exercises[0];
        const ex2 = b2bExercise.exercises[1];
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
                                lineNumber: 507,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 506,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-white text-center mb-2",
                            children: ex1.name
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 511,
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
                            lineNumber: 512,
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
                                    lineNumber: 516,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-white text-2xl font-semibold",
                                    children: "EXERCISE COMPLETE"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 517,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 515,
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
                                    lineNumber: 522,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `text-8xl font-bold mb-2 ${transitionTimeRemaining === 0 ? 'text-orange-400' : 'text-white'}`,
                                    children: transitionTimeRemaining
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 523,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-400 text-lg",
                                    children: "seconds"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 526,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 521,
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
                                    lineNumber: 531,
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
                                            lineNumber: 538,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setTransitionTimeRemaining(transitionTimeRemaining + 15),
                                            className: "bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-colors",
                                            children: "+15s"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 544,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 537,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 530,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 504,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 503,
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
                                lineNumber: 564,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 563,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-white text-center mb-2",
                            children: ex1.name
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 568,
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
                            lineNumber: 569,
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
                                    lineNumber: 573,
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
                                    lineNumber: 574,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 572,
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
                                    lineNumber: 581,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `text-8xl font-bold mb-2 ${restTimeRemaining === 0 ? 'text-purple-400' : 'text-white'}`,
                                    children: restTimeRemaining
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 582,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-400 text-lg",
                                    children: "seconds"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 585,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 580,
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
                                    lineNumber: 590,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSkipRest,
                                    className: "bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                    children: restTimeRemaining === 0 ? 'Continue Workout' : 'Skip Rest'
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 596,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 589,
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
                                    lineNumber: 606,
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
                                    lineNumber: 607,
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
                                    lineNumber: 610,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 605,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 561,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 560,
                columnNumber: 9
            }, this);
        }
        // B2B Exercise Tracking Screen
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 p-4 pb-32",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 623,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-6",
                        children: [
                            isReviewMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleBackClick,
                                        disabled: viewingExerciseIndex === 0,
                                        className: `${viewingExerciseIndex === 0 ? 'text-zinc-600' : 'text-blue-400 hover:text-blue-300'}`,
                                        children: "← Previous"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 628,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleForwardClick,
                                        className: "text-blue-400 hover:text-blue-300",
                                        children: "Next →"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 635,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 627,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleBackClick,
                                className: "text-red-400 hover:text-red-300",
                                children: "Exit Routine"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 643,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400",
                                children: [
                                    "Exercise ",
                                    viewingExerciseIndex + 1,
                                    "/",
                                    workout.exercises.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 647,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 625,
                        columnNumber: 11
                    }, this),
                    isReviewMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-yellow-900 border border-yellow-600 rounded-lg p-3 mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-yellow-200 text-sm font-semibold text-center",
                            children: "📖 READ ONLY - Cannot edit completed sets"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 653,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 652,
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
                                    lineNumber: 662,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 661,
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
                                lineNumber: 667,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 660,
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
                                lineNumber: 674,
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
                                lineNumber: 675,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 673,
                        columnNumber: 11
                    }, this),
                    lastExerciseLog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-sm mb-3",
                                children: [
                                    "LAST TIME (",
                                    new Date(lastExerciseLog.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }),
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 683,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-purple-400 text-xs font-semibold mb-2",
                                                children: ex1.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 689,
                                                columnNumber: 19
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
                                                            lineNumber: 696,
                                                            columnNumber: 27
                                                        }, this);
                                                    }
                                                    return null;
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 690,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 688,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-purple-400 text-xs font-semibold mb-2",
                                                children: ex2.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 707,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    1,
                                                    2,
                                                    3,
                                                    4
                                                ].map((setNum)=>{
                                                    const weight = lastExerciseLog[`b2b_set${setNum}_weight`];
                                                    const reps = lastExerciseLog[`b2b_set${setNum}_reps`];
                                                    if (weight !== null && reps !== null) {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                            lineNumber: 714,
                                                            columnNumber: 27
                                                        }, this);
                                                    }
                                                    return null;
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 708,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 706,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 686,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 682,
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
                                                lineNumber: 733,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-bold text-white mb-2",
                                                children: ex1.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 736,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 732,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: ex1.videoUrl,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded",
                                        children: "📺 Video"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 738,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 731,
                                columnNumber: 13
                            }, this),
                            !isReviewMode && currentExerciseInPair === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-zinc-900 rounded-lg p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-zinc-400 text-xs block mb-1",
                                                        children: "Weight (lbs)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 753,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                        lineNumber: 754,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 752,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-zinc-900 rounded-lg p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-zinc-400 text-xs block mb-1",
                                                        children: "Reps"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 773,
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
                                                        lineNumber: 774,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 772,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 751,
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
                                                lineNumber: 785,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-300 text-sm",
                                                children: ex1.tips
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 786,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 784,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCompleteB2BExercise,
                                        className: "w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-bold transition-colors",
                                        children: "✓ Complete Exercise 1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 789,
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
                                                    children: "Weight"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 801,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-white text-xl font-semibold",
                                                    children: [
                                                        setData1.weight,
                                                        " lbs"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 802,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 800,
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
                                                    lineNumber: 807,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-white text-xl font-semibold",
                                                    children: setData1.reps
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 808,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 806,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 799,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 728,
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
                                                lineNumber: 823,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-bold text-white mb-2",
                                                children: ex2.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 826,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 822,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: ex2.videoUrl,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded",
                                        children: "📺 Video"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 828,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 821,
                                columnNumber: 13
                            }, this),
                            !isReviewMode && currentExerciseInPair === 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-zinc-900 rounded-lg p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-zinc-400 text-xs block mb-1",
                                                        children: "Weight (lbs)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 843,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                        lineNumber: 844,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 842,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-zinc-900 rounded-lg p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-zinc-400 text-xs block mb-1",
                                                        children: "Reps"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 863,
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
                                                        lineNumber: 864,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 862,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 841,
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
                                                lineNumber: 875,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-300 text-sm",
                                                children: ex2.tips
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 876,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 874,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleCompleteB2BExercise,
                                                className: "w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-bold transition-colors",
                                                children: "✓ Complete Exercise 2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 880,
                                                columnNumber: 19
                                            }, this),
                                            completedPairs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleEndExercise,
                                                className: "w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition-colors",
                                                children: "End Exercise & Continue"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 887,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 879,
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
                                                    children: "Weight"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 901,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-white text-xl font-semibold",
                                                    children: [
                                                        setData2.weight,
                                                        " lbs"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 902,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 900,
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
                                                    lineNumber: 907,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-white text-xl font-semibold",
                                                    children: setData2.reps
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                    lineNumber: 908,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 906,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 899,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 818,
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
                                lineNumber: 920,
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
                                            lineNumber: 923,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            lineNumber: 924,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            lineNumber: 927,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, index, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 922,
                                    columnNumber: 17
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 919,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            if (currentExerciseIndex < workout.exercises.length - 1) {
                                const nextExerciseIndex = currentExerciseIndex + 1;
                                setCurrentExerciseIndex(nextExerciseIndex);
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
                                router.push(`/workout/${encodeURIComponent(workout.name)}/cardio`);
                            }
                        },
                        className: "w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                        children: "Skip Exercise"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 936,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 622,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 621,
            columnNumber: 7
        }, this);
    }
    const exercise = isReviewMode ? viewingExercise : currentExercise;
    const isWarmupSet = currentSetIndex === 0;
    // In review mode, show cached completed sets
    const displayCompletedSets = isReviewMode && viewingCachedData ? viewingCachedData.completedSets || [] : completedSets;
    // Transition Screen (between exercises)
    if (isTransitioning) {
        const nextExercise = workout.exercises[currentExerciseIndex + 1];
        const nextExerciseName = nextExercise.type === 'single' ? nextExercise.name : `${nextExercise.exercises[0].name} / ${nextExercise.exercises[1].name}`;
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
                                className: "h-full bg-orange-500 transition-all duration-300",
                                style: {
                                    width: `${progressPercentage}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1000,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 999,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 998,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-zinc-400 text-xl mb-4",
                        children: "Next Exercise"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1008,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-bold text-white text-center mb-12 px-4",
                        children: nextExerciseName
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1011,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `bg-zinc-800 rounded-lg p-16 mb-12 text-center border-4 ${transitionTimeRemaining === 0 ? 'border-zinc-700' : 'border-blue-600'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `text-xl mb-4 ${transitionTimeRemaining === 0 ? 'text-zinc-400' : 'text-blue-400'}`,
                                children: "Chilll Outtt"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1017,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `text-9xl font-bold mb-2 ${transitionTimeRemaining === 0 ? 'text-blue-400' : 'text-white'}`,
                                children: transitionTimeRemaining
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1018,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-lg",
                                children: "seconds"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1021,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1016,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSkipTransition,
                        className: "bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-lg text-2xl font-bold transition-colors",
                        children: "I'm Ready →"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1025,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 996,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 995,
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
                            lineNumber: 1043,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1042,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold text-white text-center mb-8",
                        children: exercise.name
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1047,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-green-500 text-6xl mb-2",
                                children: "✓"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1051,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white text-2xl font-semibold",
                                children: [
                                    exercise.warmupWeight !== exercise.targetWeight && completedSets.length === 1 ? 'WARMUP SET' : `SET ${exercise.warmupWeight !== exercise.targetWeight ? completedSets.length - 1 : completedSets.length}`,
                                    " COMPLETE"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1052,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1050,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 ${restTimeRemaining === 0 ? 'border-zinc-700' : 'border-orange-600'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `text-xl mb-4 ${restTimeRemaining === 0 ? 'text-zinc-400' : 'text-orange-400'}`,
                                children: "REST TIME"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1061,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `text-8xl font-bold mb-2 ${restTimeRemaining === 0 ? 'text-orange-400' : 'text-white'}`,
                                children: restTimeRemaining
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1062,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-lg",
                                children: "seconds"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1065,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1060,
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
                                lineNumber: 1070,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSkipRest,
                                className: "bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                children: restTimeRemaining === 0 ? 'Continue Workout' : 'Skip Rest'
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1076,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1069,
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
                                lineNumber: 1086,
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
                                lineNumber: 1087,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-300 text-lg",
                                children: [
                                    exercise.targetWeight,
                                    " lbs × ",
                                    exercise.targetReps,
                                    " reps"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1090,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1085,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1040,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 1039,
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
                        lineNumber: 1104,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-zinc-300 mb-6",
                        children: "You will lose your current routine progress. Completed exercises have been saved to the database."
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1105,
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
                                lineNumber: 1109,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors text-center",
                                children: "Exit Routine"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1115,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1108,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 1103,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 1102,
            columnNumber: 7
        }, this);
    }
    // Exercise Tracking Screen
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-900 p-4 pb-32",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-2xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1131,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center mb-6",
                    children: [
                        isReviewMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleBackClick,
                                    disabled: viewingExerciseIndex === 0,
                                    className: `${viewingExerciseIndex === 0 ? 'text-zinc-600' : 'text-blue-400 hover:text-blue-300'}`,
                                    children: "← Previous"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1136,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleForwardClick,
                                    className: "text-blue-400 hover:text-blue-300",
                                    children: "Next →"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1143,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1135,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleBackClick,
                            className: "text-red-400 hover:text-red-300",
                            children: "Exit Routine"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1151,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400",
                            children: [
                                "Exercise ",
                                viewingExerciseIndex + 1,
                                "/",
                                workout.exercises.length
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1155,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1133,
                    columnNumber: 9
                }, this),
                isReviewMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-yellow-900 border border-yellow-600 rounded-lg p-3 mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-yellow-200 text-sm font-semibold text-center",
                        children: "📖 READ ONLY - Cannot edit completed sets"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 1161,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1160,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-2 bg-zinc-800 rounded-full overflow-hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full bg-orange-500 transition-all duration-300",
                                style: {
                                    width: `${progressPercentage}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1170,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1169,
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
                            lineNumber: 1175,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1168,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-white mb-6",
                    children: exercise.name
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1181,
                    columnNumber: 9
                }, this),
                lastExerciseLog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm mb-2",
                            children: [
                                "LAST TIME (",
                                new Date(lastExerciseLog.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                }),
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1186,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: [
                                lastExerciseLog.warmup_weight !== null && lastExerciseLog.warmup_reps !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                    lineNumber: 1191,
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
                                            lineNumber: 1200,
                                            columnNumber: 21
                                        }, this);
                                    }
                                    return null;
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1189,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1185,
                    columnNumber: 11
                }, this),
                !isReviewMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-6 mb-6 border-2 border-orange-600",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-orange-400 text-lg font-semibold mb-2",
                                children: isWarmupSet ? 'WARMUP SET' : `SET ${currentSetIndex} (WORKING)`
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 1215,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1214,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-4 mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-zinc-900 rounded-lg p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-zinc-400 text-sm block mb-2",
                                            children: "Weight (lbs)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1223,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                            lineNumber: 1224,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1222,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-zinc-900 rounded-lg p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-zinc-400 text-sm block mb-2",
                                            children: "Reps"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 1243,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                            lineNumber: 1244,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1242,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1221,
                            columnNumber: 11
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
                                    lineNumber: 1257,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCompleteSet,
                                    className: "bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-lg font-bold transition-colors",
                                    children: "✓ Complete Warmup"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1263,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1256,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCompleteSet,
                                    className: "w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors",
                                    children: [
                                        "✓ Complete Set ",
                                        currentSetIndex
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1272,
                                    columnNumber: 15
                                }, this),
                                completedSets.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleEndExercise,
                                    className: "w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition-colors",
                                    children: "End Exercise & Continue"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 1279,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1271,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1213,
                    columnNumber: 9
                }, this),
                displayCompletedSets.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-4 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm mb-2",
                            children: "COMPLETED SETS"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1294,
                            columnNumber: 13
                        }, this),
                        displayCompletedSets.map((set, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                lineNumber: 1296,
                                columnNumber: 15
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1293,
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
                            lineNumber: 1305,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-zinc-200 text-base leading-relaxed",
                            children: exercise.tips
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1306,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1304,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: exercise.videoUrl,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "block bg-red-600 hover:bg-red-700 text-white text-center py-3 rounded-lg font-semibold transition-colors",
                            children: "📺 Video"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1311,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                if (currentExerciseIndex < workout.exercises.length - 1) {
                                    const nextExerciseIndex = currentExerciseIndex + 1;
                                    setCurrentExerciseIndex(nextExerciseIndex);
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
                                    router.push(`/workout/${encodeURIComponent(workout.name)}/cardio`);
                                }
                            },
                            className: "bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                            children: "Skip Exercise"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 1319,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 1310,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 1130,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/workout/[name]/active/page.tsx",
        lineNumber: 1129,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__11099d4d._.js.map