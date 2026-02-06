(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/app/routines/browse/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BrowseRoutinesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/SharedUi.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-session.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
    if (!value) return 'Never';
    const date = new Date(normalizeDateString(value));
    if (Number.isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
function BrowseRoutinesPage() {
    _s();
    const [routines, setRoutines] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [favoritedIds, setFavoritedIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [actionInProgress, setActionInProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Auto-dismiss toast after 3 seconds
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BrowseRoutinesPage.useEffect": ()=>{
            if (toast) {
                const timer = setTimeout({
                    "BrowseRoutinesPage.useEffect.timer": ()=>setToast(null)
                }["BrowseRoutinesPage.useEffect.timer"], 3000);
                return ({
                    "BrowseRoutinesPage.useEffect": ()=>clearTimeout(timer)
                })["BrowseRoutinesPage.useEffect"];
            }
        }
    }["BrowseRoutinesPage.useEffect"], [
        toast
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BrowseRoutinesPage.useEffect": ()=>{
            fetchPublicRoutines();
        }
    }["BrowseRoutinesPage.useEffect"], []);
    async function fetchPublicRoutines() {
        try {
            const response = await fetch('/api/routines/public');
            if (response.ok) {
                const data = await response.json();
                const publicRoutines = data.routines || [];
                setRoutines(publicRoutines);
                // Check which ones are already favorited
                const favResponse = await fetch('/api/routines/favorites');
                if (favResponse.ok) {
                    const favData = await favResponse.json();
                    const favIds = new Set((favData.routines || []).map((r)=>r.id));
                    setFavoritedIds(favIds);
                }
            }
        } catch (error) {
            console.error('Error fetching public routines:', error);
        } finally{
            setLoading(false);
        }
    }
    async function toggleFavorite(routineId) {
        setActionInProgress(routineId);
        const isFavorited = favoritedIds.has(routineId);
        try {
            const response = await fetch(`/api/routines/${routineId}/favorite`, {
                method: isFavorited ? 'DELETE' : 'POST'
            });
            if (response.ok) {
                const newFavorites = new Set(favoritedIds);
                if (isFavorited) {
                    newFavorites.delete(routineId);
                } else {
                    newFavorites.add(routineId);
                }
                setFavoritedIds(newFavorites);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally{
            setActionInProgress(null);
        }
    }
    async function cloneRoutine(routineId, routineName) {
        setActionInProgress(routineId);
        try {
            const response = await fetch(`/api/routines/${routineId}/clone`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: `${routineName} (Copy)`
                })
            });
            if (response.ok) {
                setToast({
                    message: 'Saved to your routines!',
                    type: 'success'
                });
            } else {
                const data = await response.json();
                setToast({
                    message: data.error || 'Failed to clone routine',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error cloning routine:', error);
            setToast({
                message: 'Failed to clone routine',
                type: 'error'
            });
        } finally{
            setActionInProgress(null);
        }
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white text-2xl",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/app/routines/browse/page.tsx",
                lineNumber: 135,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/routines/browse/page.tsx",
            lineNumber: 134,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-900 p-4",
        children: [
            toast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`,
                    children: [
                        toast.type === 'success' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-5 w-5",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M5 13l4 4L19 7"
                            }, void 0, false, {
                                fileName: "[project]/app/routines/browse/page.tsx",
                                lineNumber: 152,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/routines/browse/page.tsx",
                            lineNumber: 151,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-5 w-5",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M6 18L18 6M6 6l12 12"
                            }, void 0, false, {
                                fileName: "[project]/app/routines/browse/page.tsx",
                                lineNumber: 156,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/routines/browse/page.tsx",
                            lineNumber: 155,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-medium",
                            children: toast.message
                        }, void 0, false, {
                            fileName: "[project]/app/routines/browse/page.tsx",
                            lineNumber: 159,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/routines/browse/page.tsx",
                    lineNumber: 145,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/routines/browse/page.tsx",
                lineNumber: 144,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-2xl mx-auto py-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4 mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/routines",
                                className: "text-zinc-400 hover:text-white transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    className: "h-6 w-6",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M15 19l-7-7 7-7"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/browse/page.tsx",
                                        lineNumber: 171,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/browse/page.tsx",
                                    lineNumber: 170,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/routines/browse/page.tsx",
                                lineNumber: 166,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold text-white",
                                children: "Browse Public Routines"
                            }, void 0, false, {
                                fileName: "[project]/app/routines/browse/page.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/routines/browse/page.tsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-zinc-400 mb-6",
                        children: "Discover routines shared by other users. Favorite them to use directly, or clone to customize."
                    }, void 0, false, {
                        fileName: "[project]/app/routines/browse/page.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    routines.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-zinc-500 text-lg py-12",
                        children: "No public routines available yet."
                    }, void 0, false, {
                        fileName: "[project]/app/routines/browse/page.tsx",
                        lineNumber: 182,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: routines.map((routine)=>{
                            const isFavorited = favoritedIds.has(routine.id);
                            const isProcessing = actionInProgress === routine.id;
                            const lastDate = routine.last_workout_date || null;
                            const formattedDate = formatLocalDate(lastDate);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                paddingClassName: "p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-xl font-semibold text-white mb-1",
                                                        children: routine.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/routines/browse/page.tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-zinc-400",
                                                        children: [
                                                            "by",
                                                            ' ',
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-purple-400",
                                                                children: [
                                                                    "@",
                                                                    routine.creator_username || routine.creator_name || 'Anonymous'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/routines/browse/page.tsx",
                                                                lineNumber: 202,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/routines/browse/page.tsx",
                                                        lineNumber: 200,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/routines/browse/page.tsx",
                                                lineNumber: 196,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-zinc-500 whitespace-nowrap shrink-0",
                                                children: [
                                                    "Last:",
                                                    ' ',
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: lastDate ? 'text-blue-400' : 'text-zinc-600',
                                                        children: formattedDate
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/routines/browse/page.tsx",
                                                        lineNumber: 209,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/routines/browse/page.tsx",
                                                lineNumber: 207,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/routines/browse/page.tsx",
                                        lineNumber: 195,
                                        columnNumber: 19
                                    }, this),
                                    routine.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-zinc-400 text-sm mb-4",
                                        children: routine.description
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/browse/page.tsx",
                                        lineNumber: 216,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>toggleFavorite(routine.id),
                                                disabled: isProcessing,
                                                className: `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isFavorited ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'} disabled:opacity-50`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        className: "h-5 w-5",
                                                        fill: isFavorited ? 'currentColor' : 'none',
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        strokeWidth: isFavorited ? 0 : 2,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/routines/browse/page.tsx",
                                                            lineNumber: 238,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/routines/browse/page.tsx",
                                                        lineNumber: 230,
                                                        columnNumber: 23
                                                    }, this),
                                                    isFavorited ? 'Favorited' : 'Favorite'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/routines/browse/page.tsx",
                                                lineNumber: 221,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/workout/${encodeURIComponent(routine.name)}?routineId=${routine.id}`,
                                                className: "flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        className: "h-5 w-5",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/routines/browse/page.tsx",
                                                                lineNumber: 249,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/routines/browse/page.tsx",
                                                                lineNumber: 250,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/routines/browse/page.tsx",
                                                        lineNumber: 248,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Preview"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/routines/browse/page.tsx",
                                                lineNumber: 244,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/stretches/${encodeURIComponent(routine.name)}?routineId=${routine.id}`,
                                                onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initWorkoutSession"])(routine.name, routine.id),
                                                className: "flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        className: "h-5 w-5",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/routines/browse/page.tsx",
                                                                lineNumber: 262,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/routines/browse/page.tsx",
                                                                lineNumber: 263,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/routines/browse/page.tsx",
                                                        lineNumber: 261,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Start"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/routines/browse/page.tsx",
                                                lineNumber: 256,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>cloneRoutine(routine.id, routine.name),
                                                disabled: isProcessing,
                                                className: "flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        className: "h-5 w-5",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/routines/browse/page.tsx",
                                                            lineNumber: 275,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/routines/browse/page.tsx",
                                                        lineNumber: 274,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Clone"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/routines/browse/page.tsx",
                                                lineNumber: 269,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/routines/browse/page.tsx",
                                        lineNumber: 219,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, routine.id, true, {
                                fileName: "[project]/app/routines/browse/page.tsx",
                                lineNumber: 194,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/routines/browse/page.tsx",
                        lineNumber: 186,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/routines/browse/page.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/routines/browse/page.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, this);
}
_s(BrowseRoutinesPage, "JsBizTKgh7cwMnPKArB7E1UEkeo=");
_c = BrowseRoutinesPage;
var _c;
__turbopack_context__.k.register(_c, "BrowseRoutinesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_f2d9c0bc._.js.map