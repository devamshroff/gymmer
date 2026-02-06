(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function ActiveWorkoutPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [workout, setWorkout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [currentExerciseIndex, setCurrentExerciseIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ActiveWorkoutPage.useEffect": ()=>{
            async function fetchWorkout() {
                try {
                    const response = await fetch(`/api/workout/${params.name}`);
                    if (!response.ok) {
                        throw new Error('Workout not found');
                    }
                    const data = await response.json();
                    setWorkout(data.workout);
                    // Initialize first exercise weight/reps
                    const firstExercise = data.workout.exercises[0];
                    if (firstExercise.type === 'single') {
                        // Check if warmup is needed
                        const needsWarmup = firstExercise.warmupWeight !== firstExercise.targetWeight;
                        setSetData({
                            weight: needsWarmup ? firstExercise.warmupWeight : firstExercise.targetWeight,
                            reps: firstExercise.targetReps
                        });
                        // If no warmup needed, start at set 1 instead of set 0
                        if (!needsWarmup) {
                            setCurrentSetIndex(1);
                        }
                    } else {
                        // B2B exercise - no warmups, start at set 1
                        const b2bEx = firstExercise;
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
    }["ActiveWorkoutPage.useEffect"], [
        params.name
    ]);
    // Rest timer countdown
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ActiveWorkoutPage.useEffect": ()=>{
            if (isResting && restTimeRemaining > 0) {
                const timer = setTimeout({
                    "ActiveWorkoutPage.useEffect.timer": ()=>{
                        setRestTimeRemaining(restTimeRemaining - 1);
                    }
                }["ActiveWorkoutPage.useEffect.timer"], 1000);
                return ({
                    "ActiveWorkoutPage.useEffect": ()=>clearTimeout(timer)
                })["ActiveWorkoutPage.useEffect"];
            } else if (isResting && restTimeRemaining === 0) {
                // Vibrate when rest is complete
                if ('vibrate' in navigator) {
                    navigator.vibrate(500);
                }
            }
        }
    }["ActiveWorkoutPage.useEffect"], [
        isResting,
        restTimeRemaining
    ]);
    // Transition timer countdown
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ActiveWorkoutPage.useEffect": ()=>{
            if (isTransitioning && transitionTimeRemaining > 0) {
                const timer = setTimeout({
                    "ActiveWorkoutPage.useEffect.timer": ()=>{
                        setTransitionTimeRemaining(transitionTimeRemaining - 1);
                    }
                }["ActiveWorkoutPage.useEffect.timer"], 1000);
                return ({
                    "ActiveWorkoutPage.useEffect": ()=>clearTimeout(timer)
                })["ActiveWorkoutPage.useEffect"];
            } else if (isTransitioning && transitionTimeRemaining === 0 && workout) {
                // Transition complete - move to next exercise
                const nextExerciseIndex = currentExerciseIndex + 1;
                setIsTransitioning(false);
                setCurrentExerciseIndex(nextExerciseIndex);
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
    }["ActiveWorkoutPage.useEffect"], [
        isTransitioning,
        transitionTimeRemaining,
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
                lineNumber: 144,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 143,
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
                        lineNumber: 153,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "text-blue-400 hover:text-blue-300",
                        children: "Back to home"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 152,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 151,
            columnNumber: 7
        }, this);
    }
    const currentExercise = workout.exercises[currentExerciseIndex];
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
            setCompletedPairs([
                ...completedPairs,
                {
                    ex1: setData1,
                    ex2: setData2
                }
            ]);
            if (currentSetIndex < b2bExercise.exercises[0].sets) {
                // More sets to go - start rest timer
                setIsResting(true);
                setRestTimeRemaining(b2bExercise.restTime);
                setCurrentSetIndex(currentSetIndex + 1);
                setCurrentExerciseInPair(0); // Reset to first exercise for next round
            } else {
                // All sets complete - show transition to next exercise
                if (currentExerciseIndex < workout.exercises.length - 1) {
                    setIsResting(false);
                    setIsTransitioning(true);
                    setTransitionTimeRemaining(60);
                } else {
                    // All exercises done - go to cardio or post-workout stretches
                    if (workout.cardio) {
                        router.push(`/workout/${encodeURIComponent(workout.name)}/cardio`);
                    } else {
                        router.push(`/workout/${encodeURIComponent(workout.name)}/post-stretches`);
                    }
                }
            }
        }
    };
    // Single Exercise Handlers
    const handleCompleteSet = ()=>{
        setCompletedSets([
            ...completedSets,
            setData
        ]);
        const exercise = currentExercise;
        if (currentSetIndex < exercise.sets) {
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
            // Exercise complete - show transition to next exercise
            if (currentExerciseIndex < workout.exercises.length - 1) {
                setIsResting(false);
                setIsTransitioning(true);
                setTransitionTimeRemaining(60);
            } else {
                // All exercises done - go to cardio or post-workout stretches
                if (workout.cardio) {
                    router.push(`/workout/${encodeURIComponent(workout.name)}/cardio`);
                } else {
                    router.push(`/workout/${encodeURIComponent(workout.name)}/post-stretches`);
                }
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
    // Handle B2B/Superset exercises
    if (currentExercise.type === 'b2b') {
        const b2bExercise = currentExercise;
        const ex1 = b2bExercise.exercises[0];
        const ex2 = b2bExercise.exercises[1];
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
                                lineNumber: 280,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 279,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-white text-center mb-2",
                            children: ex1.name
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 284,
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
                            lineNumber: 285,
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
                                    lineNumber: 289,
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
                                    lineNumber: 290,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 288,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 border-purple-600",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-purple-400 text-xl mb-4",
                                    children: "REST TIME"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 297,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-white text-8xl font-bold mb-2",
                                    children: restTimeRemaining
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 298,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-400 text-lg",
                                    children: "seconds"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 301,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 296,
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
                                    lineNumber: 306,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSkipRest,
                                    className: "bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                    children: restTimeRemaining === 0 ? 'Continue Workout' : 'Skip Rest'
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 312,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 305,
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
                                    lineNumber: 322,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-white text-xl font-semibold",
                                    children: [
                                        "Set ",
                                        currentSetIndex + 1
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 323,
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
                                    lineNumber: 326,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 321,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 277,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 276,
                columnNumber: 9
            }, this);
        }
        // B2B Exercise Tracking Screen
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 p-4 pb-32",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/workout/${encodeURIComponent(workout.name)}`,
                                className: "text-blue-400 hover:text-blue-300",
                                children: "← Back"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 341,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400",
                                children: [
                                    "Exercise ",
                                    currentExerciseIndex + 1,
                                    "/",
                                    workout.exercises.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 344,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 340,
                        columnNumber: 11
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
                                    lineNumber: 350,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 349,
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
                                lineNumber: 355,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 348,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-purple-400 text-sm font-bold mb-2",
                                children: "🔄 SUPERSET"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 362,
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
                                lineNumber: 363,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 361,
                        columnNumber: 11
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
                                                lineNumber: 374,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-bold text-white mb-2",
                                                children: ex1.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 377,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 373,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: ex1.videoUrl,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded",
                                        children: "📺 Video"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 379,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 372,
                                columnNumber: 13
                            }, this),
                            currentExerciseInPair === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
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
                                                        lineNumber: 394,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: setData1.weight,
                                                        onChange: (e)=>setSetData1({
                                                                ...setData1,
                                                                weight: parseFloat(e.target.value) || 0
                                                            }),
                                                        className: "w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 395,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 393,
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
                                                        lineNumber: 403,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: setData1.reps,
                                                        onChange: (e)=>setSetData1({
                                                                ...setData1,
                                                                reps: parseInt(e.target.value) || 0
                                                            }),
                                                        className: "w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 404,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 402,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 392,
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
                                                lineNumber: 414,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-300 text-sm",
                                                children: ex1.tips
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 415,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 413,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCompleteB2BExercise,
                                        className: "w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-bold transition-colors",
                                        children: "✓ Complete Exercise 1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 418,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                        lineNumber: 430,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-white text-xl font-semibold",
                                                        children: [
                                                            completedPairs.length >= currentSetIndex ? setData1.weight : ex1.targetWeight,
                                                            " lbs"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 431,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 429,
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
                                                        lineNumber: 436,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-white text-xl font-semibold",
                                                        children: completedPairs.length >= currentSetIndex ? setData1.reps : ex1.targetReps
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 437,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 435,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 428,
                                        columnNumber: 17
                                    }, this),
                                    completedPairs.length >= currentSetIndex && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-green-400 text-sm text-center",
                                        children: "✓ Completed"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 443,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 369,
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
                                                lineNumber: 455,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-bold text-white mb-2",
                                                children: ex2.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 458,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 454,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: ex2.videoUrl,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "text-red-500 hover:text-red-400 text-sm font-medium px-3 py-2 bg-zinc-900 rounded",
                                        children: "📺 Video"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 460,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 453,
                                columnNumber: 13
                            }, this),
                            currentExerciseInPair === 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
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
                                                        lineNumber: 475,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: setData2.weight,
                                                        onChange: (e)=>setSetData2({
                                                                ...setData2,
                                                                weight: parseFloat(e.target.value) || 0
                                                            }),
                                                        className: "w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 476,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 474,
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
                                                        lineNumber: 484,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: setData2.reps,
                                                        onChange: (e)=>setSetData2({
                                                                ...setData2,
                                                                reps: parseInt(e.target.value) || 0
                                                            }),
                                                        className: "w-full bg-zinc-800 text-white text-2xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 485,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 483,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 473,
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
                                                lineNumber: 495,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-300 text-sm",
                                                children: ex2.tips
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 496,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 494,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCompleteB2BExercise,
                                        className: "w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg font-bold transition-colors",
                                        children: "✓ Complete Exercise 2"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 499,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                        lineNumber: 511,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-white text-xl font-semibold",
                                                        children: [
                                                            completedPairs.length >= currentSetIndex ? setData2.weight : ex2.targetWeight,
                                                            " lbs"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 512,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 510,
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
                                                        lineNumber: 517,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-white text-xl font-semibold",
                                                        children: completedPairs.length >= currentSetIndex ? setData2.reps : ex2.targetReps
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                        lineNumber: 518,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                                lineNumber: 516,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 509,
                                        columnNumber: 17
                                    }, this),
                                    completedPairs.length >= currentSetIndex && currentExerciseInPair === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-green-400 text-sm text-center",
                                        children: "✓ Completed"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                                        lineNumber: 524,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 450,
                        columnNumber: 11
                    }, this),
                    completedPairs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-zinc-800 rounded-lg p-4 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-sm mb-2",
                                children: "COMPLETED SETS"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 533,
                                columnNumber: 15
                            }, this),
                            completedPairs.map((pair, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            lineNumber: 536,
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
                                            lineNumber: 537,
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
                                            lineNumber: 540,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, index, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 535,
                                    columnNumber: 17
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 532,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                if (workout.cardio) {
                                    router.push(`/workout/${encodeURIComponent(workout.name)}/cardio`);
                                } else {
                                    router.push(`/workout/${encodeURIComponent(workout.name)}/post-stretches`);
                                }
                            }
                        },
                        className: "w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                        children: "Skip Exercise"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 549,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 338,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 337,
            columnNumber: 7
        }, this);
    }
    const exercise = currentExercise;
    const isWarmupSet = currentSetIndex === 0;
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
                                lineNumber: 611,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 610,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 609,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-zinc-400 text-xl mb-4",
                        children: "Next Exercise"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 619,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-bold text-white text-center mb-12 px-4",
                        children: nextExerciseName
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 622,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-zinc-800 rounded-lg p-16 mb-12 text-center border-4 border-blue-600",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-blue-400 text-xl mb-4",
                                children: "Chilll Outtt"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 628,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white text-9xl font-bold mb-2",
                                children: transitionTimeRemaining
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 629,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-lg",
                                children: "seconds"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 632,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 627,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSkipTransition,
                        className: "bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-lg text-2xl font-bold transition-colors",
                        children: "I'm Ready →"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 636,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 607,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 606,
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
                            lineNumber: 654,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 653,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold text-white text-center mb-8",
                        children: exercise.name
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 658,
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
                                lineNumber: 662,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white text-2xl font-semibold",
                                children: [
                                    completedSets.length === 1 ? 'WARMUP SET' : `SET ${completedSets.length - 1}`,
                                    " COMPLETE"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 663,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 661,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-zinc-800 rounded-lg p-12 mb-8 text-center border-4 border-orange-600",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-orange-400 text-xl mb-4",
                                children: "REST TIME"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 670,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white text-8xl font-bold mb-2",
                                children: restTimeRemaining
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 671,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-lg",
                                children: "seconds"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 674,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 669,
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
                                lineNumber: 679,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSkipRest,
                                className: "bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors",
                                children: restTimeRemaining === 0 ? 'Continue Workout' : 'Skip Rest'
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 685,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 678,
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
                                lineNumber: 695,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white text-xl font-semibold",
                                children: currentSetIndex === 0 ? 'Set 1 (Working)' : `Set ${currentSetIndex + 1} (Working)`
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 696,
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
                                lineNumber: 699,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/active/page.tsx",
                        lineNumber: 694,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/active/page.tsx",
                lineNumber: 651,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 650,
            columnNumber: 7
        }, this);
    }
    // Exercise Tracking Screen
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-900 p-4 pb-32",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-2xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/workout/${encodeURIComponent(workout.name)}`,
                            className: "text-blue-400 hover:text-blue-300",
                            children: "← Back"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 714,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400",
                            children: [
                                "Exercise ",
                                currentExerciseIndex + 1,
                                "/",
                                workout.exercises.length
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 717,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 713,
                    columnNumber: 9
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
                                lineNumber: 723,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 722,
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
                            lineNumber: 728,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 721,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-white mb-6",
                    children: exercise.name
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 734,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm mb-2",
                            children: "LAST TIME (Dec 15, 2024)"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 738,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-300 text-sm",
                                    children: "Set 1: 10 lbs × 8 reps"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 740,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-300 text-sm",
                                    children: "Set 2: 15 lbs × 8 reps"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 741,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-300 text-sm",
                                    children: "Set 3: 15 lbs × 7 reps"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 742,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 739,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 737,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-6 mb-6 border-2 border-orange-600",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-orange-400 text-lg font-semibold mb-2",
                                children: isWarmupSet ? 'WARMUP SET' : `SET ${currentSetIndex} (WORKING)`
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/active/page.tsx",
                                lineNumber: 749,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 748,
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
                                            lineNumber: 757,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            value: setData.weight,
                                            onChange: (e)=>setSetData({
                                                    ...setData,
                                                    weight: parseFloat(e.target.value) || 0
                                                }),
                                            className: "w-full bg-zinc-800 text-white text-3xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 758,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 756,
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
                                            lineNumber: 766,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            value: setData.reps,
                                            onChange: (e)=>setSetData({
                                                    ...setData,
                                                    reps: parseInt(e.target.value) || 0
                                                }),
                                            className: "w-full bg-zinc-800 text-white text-3xl font-bold text-center rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                                            lineNumber: 767,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 765,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 755,
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
                                    lineNumber: 779,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCompleteSet,
                                    className: "bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-lg font-bold transition-colors",
                                    children: "✓ Complete Warmup"
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                                    lineNumber: 785,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 778,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleCompleteSet,
                            className: "w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors",
                            children: [
                                "✓ Complete Set ",
                                currentSetIndex
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 793,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 747,
                    columnNumber: 9
                }, this),
                completedSets.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-4 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm mb-2",
                            children: "COMPLETED SETS"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 805,
                            columnNumber: 13
                        }, this),
                        completedSets.map((set, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                lineNumber: 807,
                                columnNumber: 15
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 804,
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
                            lineNumber: 816,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-zinc-200 text-base leading-relaxed",
                            children: exercise.tips
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 817,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 815,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: exercise.videoUrl,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "block bg-red-600 hover:bg-red-700 text-white text-center py-3 rounded-lg font-semibold transition-colors",
                            children: "📺 Video"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 822,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                    if (workout.cardio) {
                                        router.push(`/workout/${encodeURIComponent(workout.name)}/cardio`);
                                    } else {
                                        router.push(`/workout/${encodeURIComponent(workout.name)}/post-stretches`);
                                    }
                                }
                            },
                            className: "bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                            children: "Skip Exercise"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/active/page.tsx",
                            lineNumber: 830,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/active/page.tsx",
                    lineNumber: 821,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/workout/[name]/active/page.tsx",
            lineNumber: 711,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/workout/[name]/active/page.tsx",
        lineNumber: 710,
        columnNumber: 5
    }, this);
}
_s(ActiveWorkoutPage, "Oj+zLRcJlMm9sDCaHOGbrKuTVfw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ActiveWorkoutPage;
var _c;
__turbopack_context__.k.register(_c, "ActiveWorkoutPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_workout_%5Bname%5D_active_page_tsx_0e032ba9._.js.map