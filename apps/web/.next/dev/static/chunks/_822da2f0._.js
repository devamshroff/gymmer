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
    ()=>setWorkoutSessionId,
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
function initWorkoutSession(workoutName, sessionMode = 'incremental', routineId) {
    const session = {
        workoutName,
        routineId: routineId ?? null,
        sessionId: null,
        startTime: new Date().toISOString(),
        sessionMode,
        exercises: []
    };
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
}
function ensureWorkoutSession(workoutName, sessionMode = 'incremental', routineId) {
    const existing = getWorkoutSession();
    const normalizedRoutineId = routineId ?? null;
    if (!existing) {
        initWorkoutSession(workoutName, sessionMode, normalizedRoutineId);
        return;
    }
    if (existing.workoutName !== workoutName || (existing.routineId ?? null) !== normalizedRoutineId) {
        initWorkoutSession(workoutName, sessionMode, normalizedRoutineId);
        return;
    }
    if (existing.sessionMode !== sessionMode) {
        setWorkoutSessionMode(sessionMode);
    }
}
function getWorkoutSession() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    parsed.sessionMode = resolveSessionMode(parsed.sessionMode, 'incremental');
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
"[project]/lib/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/constants.ts
// Exercise type identifiers used across workouts, routines, and storage.
__turbopack_context__.s([
    "EXERCISE_HISTORY_AGGREGATION_MODES",
    ()=>EXERCISE_HISTORY_AGGREGATION_MODES,
    "EXERCISE_HISTORY_DISPLAY_MODES",
    ()=>EXERCISE_HISTORY_DISPLAY_MODES,
    "EXERCISE_TYPES",
    ()=>EXERCISE_TYPES
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-session.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
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
    // Prevent double-save in React Strict Mode / re-renders
    const hasSavedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const hasReportedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
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
            // Calculate total volume
            let volume = 0;
            for (const exercise of session.exercises){
                if (exercise.warmup) {
                    volume += exercise.warmup.weight * exercise.warmup.reps;
                }
                for (const set of exercise.sets){
                    volume += set.weight * set.reps;
                }
                if (exercise.b2bPartner) {
                    if (exercise.b2bPartner.warmup) {
                        volume += exercise.b2bPartner.warmup.weight * exercise.b2bPartner.warmup.reps;
                    }
                    for (const set of exercise.b2bPartner.sets){
                        volume += set.weight * set.reps;
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
    }["SummaryPage.useEffect"], []);
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
            const routineId = routineIdParam ? Number(routineIdParam) : null;
            if (routineIdParam && Number.isNaN(routineId)) {
                return;
            }
            const generateReport = {
                "SummaryPage.useEffect.generateReport": async ()=>{
                    setReportLoading(true);
                    hasReportedRef.current = true;
                    try {
                        const response = await fetch('/api/workout-report', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                sessionData,
                                routineId: routineId || null
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
                lineNumber: 197,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/summary/page.tsx",
            lineNumber: 196,
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
                        lineNumber: 206,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/routines",
                        className: "text-blue-400 hover:text-blue-300",
                        children: "Back to routines"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/summary/page.tsx",
                        lineNumber: 207,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/summary/page.tsx",
                lineNumber: 205,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/summary/page.tsx",
            lineNumber: 204,
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
                            lineNumber: 220,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl font-bold text-white mb-2",
                            children: "Workout Complete!"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 221,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-xl mb-2",
                            children: workout.name
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 222,
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
                            lineNumber: 223,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                    lineNumber: 219,
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
                                lineNumber: 237,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white text-4xl font-bold mb-1",
                                children: [
                                    totalVolume.toLocaleString(),
                                    " lbs"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                lineNumber: 238,
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
                                lineNumber: 241,
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
                                        lineNumber: 247,
                                        columnNumber: 28
                                    }, this),
                                    saved && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-green-400",
                                        children: "✓ Workout saved"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                        lineNumber: 248,
                                        columnNumber: 27
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                lineNumber: 246,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/summary/page.tsx",
                        lineNumber: 236,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-zinc-400",
                        children: "Loading session data..."
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/summary/page.tsx",
                        lineNumber: 252,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                    lineNumber: 234,
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
                            lineNumber: 258,
                            columnNumber: 13
                        }, this),
                        reportLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm",
                            children: "Generating your report..."
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 260,
                            columnNumber: 15
                        }, this),
                        report && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-200 text-sm whitespace-pre-line",
                            children: report
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 263,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                    lineNumber: 257,
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
                            lineNumber: 271,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: sessionData.exercises.map((exercise, index)=>{
                                const exerciseVolume = (exercise.warmup ? exercise.warmup.weight * exercise.warmup.reps : 0) + exercise.sets.reduce((sum, set)=>sum + set.weight * set.reps, 0) + (exercise.b2bPartner ? (exercise.b2bPartner.warmup ? exercise.b2bPartner.warmup.weight * exercise.b2bPartner.warmup.reps : 0) + exercise.b2bPartner.sets.reduce((sum, set)=>sum + set.weight * set.reps, 0) : 0);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-l-4 border-green-500 pl-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-white font-semibold mb-1",
                                            children: exercise.type === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXERCISE_TYPES"].single ? exercise.name : `B2B: ${exercise.name} / ${exercise.b2bPartner?.name}`
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                            lineNumber: 290,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-zinc-400 text-sm mb-2",
                                            children: [
                                                exercise.sets.length,
                                                " sets •",
                                                ' ',
                                                Math.round(exerciseVolume).toLocaleString(),
                                                " lbs volume"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                            lineNumber: 295,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1 text-xs",
                                            children: [
                                                exercise.warmup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-zinc-500",
                                                    children: [
                                                        "Warmup: ",
                                                        exercise.warmup.weight,
                                                        " lbs ×",
                                                        ' ',
                                                        exercise.warmup.reps,
                                                        " reps"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                                    lineNumber: 301,
                                                    columnNumber: 25
                                                }, this),
                                                exercise.sets.map((set, setIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-zinc-300",
                                                        children: [
                                                            "Set ",
                                                            setIndex + 1,
                                                            ": ",
                                                            set.weight,
                                                            " lbs × ",
                                                            set.reps,
                                                            " reps",
                                                            exercise.b2bPartner && exercise.b2bPartner.sets[setIndex] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-purple-400",
                                                                children: [
                                                                    ' + ',
                                                                    exercise.b2bPartner.sets[setIndex].weight,
                                                                    " lbs ×",
                                                                    ' ',
                                                                    exercise.b2bPartner.sets[setIndex].reps,
                                                                    " reps"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                                                lineNumber: 311,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, setIndex, true, {
                                                        fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                                        lineNumber: 307,
                                                        columnNumber: 25
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                            lineNumber: 299,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, index, true, {
                                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                                    lineNumber: 289,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 272,
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
                                    lineNumber: 327,
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
                                    lineNumber: 330,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/summary/page.tsx",
                            lineNumber: 326,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                    lineNumber: 270,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleCompleteWorkout,
                    className: "w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors mb-4",
                    children: "✅ Finish & Go Home"
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/summary/page.tsx",
                    lineNumber: 342,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/workout/[name]/summary/page.tsx",
            lineNumber: 217,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/workout/[name]/summary/page.tsx",
        lineNumber: 216,
        columnNumber: 5
    }, this);
}
_s(SummaryPage, "yuFWK18BffoWtagmjeNqcPGACs4=", false, function() {
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

//# sourceMappingURL=_822da2f0._.js.map