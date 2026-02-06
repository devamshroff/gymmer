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
"[project]/app/components/ExerciseHistoryModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ExerciseHistoryModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
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
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return Math.round(value).toString();
}
function buildLinePath(points) {
    if (points.length === 0) return '';
    return points.map((point, index)=>`${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}
function LineChart({ points, weightMode, mode, targetValue }) {
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
    const primaryValues = points.map((point)=>{
        if (mode === 'reps') {
            return weightMode === 'max' ? point.reps_max : point.reps_avg;
        }
        return weightMode === 'max' ? point.weight_max : point.weight_avg;
    }).filter((value)=>value !== null);
    const hasTargetValue = Number.isFinite(targetValue) && targetValue > 0;
    if (hasTargetValue) {
        primaryValues.push(targetValue);
    }
    const secondaryValues = points.map((point)=>mode === 'reps' ? point.reps_total : point.volume).filter((value)=>value !== null);
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
    const primaryRange = primaryMax - primaryMin || 1;
    const secondaryRange = secondaryMax - secondaryMin || 1;
    const stepX = points.length > 1 ? plotWidth / (points.length - 1) : 0;
    const basePoints = points.map((point, index)=>{
        const primaryValue = mode === 'reps' ? weightMode === 'max' ? point.reps_max : point.reps_avg : weightMode === 'max' ? point.weight_max : point.weight_avg;
        const secondaryValue = mode === 'reps' ? point.reps_total : point.volume;
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
    const primaryLabel = mode === 'reps' ? 'Reps' : 'Weight';
    const secondaryLabel = mode === 'reps' ? 'Total Reps' : 'Volume';
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
    const targetY = hasTargetValue ? margin.top + plotHeight - (targetValue - primaryMin) / primaryRange * plotHeight : null;
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
                    lineNumber: 167,
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
                            lineNumber: 172,
                            columnNumber: 20
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 169,
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
                            lineNumber: 178,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: width - margin.right - 6,
                            y: Math.max(margin.top + 12, targetY - 6),
                            fill: "#f59e0b",
                            fontSize: "12",
                            textAnchor: "end",
                            children: [
                                "Target ",
                                formatNumber(targetValue)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 187,
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
                            children: formatNumber(primaryMax)
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 200,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: margin.left - 12,
                            y: margin.top + plotHeight,
                            textAnchor: "end",
                            children: formatNumber(primaryMin)
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 203,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: width - margin.right + 12,
                            y: margin.top + 10,
                            textAnchor: "start",
                            children: formatNumber(secondaryMax)
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 206,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: width - margin.right + 12,
                            y: margin.top + plotHeight,
                            textAnchor: "start",
                            children: formatNumber(secondaryMin)
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 199,
                    columnNumber: 9
                }, this),
                primaryPath && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: primaryPath,
                    fill: "none",
                    stroke: "#38bdf8",
                    strokeWidth: 3
                }, void 0, false, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 215,
                    columnNumber: 11
                }, this),
                secondaryPath && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: secondaryPath,
                    fill: "none",
                    stroke: "#22c55e",
                    strokeWidth: 3
                }, void 0, false, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 218,
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
                            lineNumber: 223,
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
                            lineNumber: 233,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 222,
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
                                        label: `${primaryLabel}: ${formatNumber(point.value)}`
                                    }),
                                onMouseMove: ()=>setTooltip({
                                        x: point.x,
                                        y: point.y,
                                        label: `${primaryLabel}: ${formatNumber(point.value)}`
                                    }),
                                onMouseLeave: ()=>setTooltip(null)
                            }, `w-${index}`, false, {
                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                lineNumber: 246,
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
                                        label: `${secondaryLabel}: ${formatNumber(point.value)}`
                                    }),
                                onMouseMove: ()=>setTooltip({
                                        x: point.x,
                                        y: point.y,
                                        label: `${secondaryLabel}: ${formatNumber(point.value)}`
                                    }),
                                onMouseLeave: ()=>setTooltip(null)
                            }, `v-${index}`, false, {
                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                lineNumber: 258,
                                columnNumber: 13
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 244,
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
                            lineNumber: 276,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 271,
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
                            lineNumber: 284,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: width - margin.right,
                            y: height - 4,
                            textAnchor: "end",
                            children: secondaryLabel
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 287,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 283,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
            lineNumber: 166,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
        lineNumber: 165,
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
                lineNumber: 299,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-40 bg-zinc-900 rounded-lg border border-zinc-700"
            }, void 0, false, {
                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                lineNumber: 300,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 flex justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-3 w-16 bg-zinc-700 rounded"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                        lineNumber: 302,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-3 w-16 bg-zinc-700 rounded"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                        lineNumber: 303,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                lineNumber: 301,
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
                lineNumber: 305,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
        lineNumber: 298,
        columnNumber: 5
    }, this);
}
_c1 = LoadingCard;
function ExerciseHistoryModal({ open, onClose, exerciseNames, title = 'Exercise History', targets }) {
    _s1();
    const [range, setRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('month');
    const [weightMode, setWeightMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('max');
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
                                    lineNumber: 379,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-zinc-400 text-sm",
                                    children: "Weight or reps trends"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                    lineNumber: 380,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 378,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg",
                            children: "Close"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 382,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 377,
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
                                            lineNumber: 394,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                    lineNumber: 392,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        'max',
                                        'avg'
                                    ].map((value)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setWeightMode(value),
                                            className: `px-3 py-2 rounded-lg text-sm font-semibold border ${weightMode === value ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'}`,
                                            children: value === 'max' ? 'Max' : 'Avg'
                                        }, value, false, {
                                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                            lineNumber: 409,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                    lineNumber: 407,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 391,
                            columnNumber: 11
                        }, this),
                        loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm",
                            children: "Loading history..."
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 425,
                            columnNumber: 13
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-red-400 text-sm",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 428,
                            columnNumber: 13
                        }, this),
                        !loading && !error && exerciseNames.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-500 text-sm",
                            children: "No exercise selected."
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                            lineNumber: 432,
                            columnNumber: 13
                        }, this),
                        loading && exerciseNames.map((name)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingCard, {
                                name: name
                            }, `loading-${name}`, false, {
                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                lineNumber: 436,
                                columnNumber: 13
                            }, this)),
                        !loading && !error && exerciseNames.map((name)=>{
                            const series = history[name];
                            const points = series?.points || [];
                            const explicitMode = series?.display_mode;
                            const hasWeight = points.some((point)=>(point.weight_max ?? 0) > 0 || (point.weight_avg ?? 0) > 0 || (point.volume ?? 0) > 0);
                            const hasReps = points.some((point)=>(point.reps_max ?? 0) > 0 || (point.reps_avg ?? 0) > 0 || (point.reps_total ?? 0) > 0);
                            const inferredMode = !explicitMode && !hasWeight && hasReps ? 'reps' : 'weight';
                            const mode = explicitMode || inferredMode;
                            const targetEntry = targets?.[name];
                            const rawTargetValue = mode === 'reps' ? targetEntry?.reps : targetEntry?.weight;
                            const targetValue = Number.isFinite(rawTargetValue) && rawTargetValue > 0 ? rawTargetValue : null;
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
                                                lineNumber: 459,
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
                                                                lineNumber: 462,
                                                                columnNumber: 23
                                                            }, this),
                                                            mode === 'reps' ? 'Reps' : 'Weight'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                                        lineNumber: 461,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "h-2 w-2 rounded-full bg-green-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                                                lineNumber: 466,
                                                                columnNumber: 23
                                                            }, this),
                                                            mode === 'reps' ? 'Total Reps' : 'Volume'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                                        lineNumber: 465,
                                                        columnNumber: 21
                                                    }, this),
                                                    targetValue !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "h-[2px] w-4 border-t border-dashed border-amber-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                                                lineNumber: 471,
                                                                columnNumber: 25
                                                            }, this),
                                                            "Target"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                                        lineNumber: 470,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                                lineNumber: 460,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                        lineNumber: 458,
                                        columnNumber: 17
                                    }, this),
                                    points.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-400",
                                        children: "No history yet. Finish a workout with this exercise to populate the graph."
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                        lineNumber: 478,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LineChart, {
                                        points: points,
                                        weightMode: weightMode,
                                        mode: mode,
                                        targetValue: targetValue
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                        lineNumber: 482,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, name, true, {
                                fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                                lineNumber: 457,
                                columnNumber: 15
                            }, this);
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
                    lineNumber: 390,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
            lineNumber: 373,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/ExerciseHistoryModal.tsx",
        lineNumber: 369,
        columnNumber: 5
    }, this);
}
_s1(ExerciseHistoryModal, "8/HzBNRYdEzQvohlhzB909FNeps=");
_c2 = ExerciseHistoryModal;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "LineChart");
__turbopack_context__.k.register(_c1, "LoadingCard");
__turbopack_context__.k.register(_c2, "ExerciseHistoryModal");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workout-session.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/SharedUi.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExerciseHistoryModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ExerciseHistoryModal.tsx [app-client] (ecmascript)");
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
function WorkoutDetailPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const isPreview = searchParams.get('preview') === '1';
    const sessionModeParam = searchParams.get('mode');
    const sessionMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSessionMode"])(sessionModeParam) ? sessionModeParam : null;
    const startMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveSessionMode"])(sessionModeParam, 'incremental');
    const [workout, setWorkout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [routineId, setRoutineId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isPublicRoutine, setIsPublicRoutine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDeleteModal, setShowDeleteModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deleting, setDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showHistory, setShowHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [historyExerciseNames, setHistoryExerciseNames] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [goalsText, setGoalsText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [targets, setTargets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [targetsLoading, setTargetsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [targetsError, setTargetsError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const baseHistoryTargets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WorkoutDetailPage.useMemo[baseHistoryTargets]": ()=>{
            if (!workout) return {};
            const next = {};
            for (const exercise of workout.exercises){
                if (exercise.type === 'single') {
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkoutDetailPage.useEffect": ()=>{
            async function fetchWorkout() {
                try {
                    // Check for routineId in query params (for public/favorited routines)
                    const routineIdParam = searchParams.get('routineId');
                    // Build API URL with routineId if present
                    let apiUrl = `/api/workout/${params.name}`;
                    if (routineIdParam) {
                        apiUrl += `?routineId=${routineIdParam}`;
                        setRoutineId(parseInt(routineIdParam));
                        setIsPublicRoutine(true);
                    }
                    const response = await fetch(apiUrl);
                    if (!response.ok) {
                        throw new Error('Workout not found');
                    }
                    const data = await response.json();
                    setWorkout(data.workout);
                    // Only fetch routine ID from user's routines if not a public routine
                    if (!routineIdParam) {
                        const routinesResponse = await fetch('/api/routines');
                        const routinesData = await routinesResponse.json();
                        const decodedName = decodeURIComponent(params.name);
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
                    const exercisePayload = [];
                    for (const exercise of workout.exercises){
                        if (exercise.type === 'single') {
                            exercisePayload.push({
                                name: exercise.name,
                                type: 'single',
                                sets: exercise.sets,
                                targetWeight: exercise.targetWeight,
                                targetReps: exercise.targetReps,
                                warmupWeight: exercise.warmupWeight,
                                isBodyweight: exercise.isBodyweight
                            });
                        } else {
                            const [ex1, ex2] = exercise.exercises;
                            exercisePayload.push({
                                name: ex1.name,
                                type: 'b2b',
                                sets: ex1.sets,
                                targetWeight: ex1.targetWeight,
                                targetReps: ex1.targetReps,
                                warmupWeight: ex1.warmupWeight,
                                isBodyweight: ex1.isBodyweight
                            });
                            exercisePayload.push({
                                name: ex2.name,
                                type: 'b2b',
                                sets: ex2.sets,
                                targetWeight: ex2.targetWeight,
                                targetReps: ex2.targetReps,
                                warmupWeight: ex2.warmupWeight,
                                isBodyweight: ex2.isBodyweight
                            });
                        }
                    }
                    try {
                        const [goalsResponse, targetsResponse] = await Promise.all([
                            fetch('/api/goals', {
                                signal: controller.signal
                            }),
                            fetch('/api/workout-targets', {
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
                            })
                        ]);
                        let nextGoalsText = null;
                        if (goalsResponse.ok) {
                            const goalsData = await goalsResponse.json();
                            nextGoalsText = (goalsData?.goals || '').trim() || null;
                        }
                        if (!isActive) return;
                        setGoalsText(nextGoalsText);
                        if (!targetsResponse.ok) {
                            throw new Error('Failed to load targets');
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
                        setTargets(nextTargets);
                        setTargetsLoading(false);
                    } catch (error) {
                        if (!isActive) return;
                        setTargetsError(error.message || 'Failed to load targets');
                        setTargetsLoading(false);
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
            // Redirect to home
            router.push('/');
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
                lineNumber: 289,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/page.tsx",
            lineNumber: 288,
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
                        lineNumber: 298,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "text-blue-400 hover:text-blue-300",
                        children: "Back to home"
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 299,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 297,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/page.tsx",
            lineNumber: 296,
            columnNumber: 7
        }, this);
    }
    if (isPreview && !sessionMode) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 311,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 bg-zinc-800 border border-zinc-700 rounded-lg p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-sm mb-2",
                                children: "Before you preview"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 313,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold text-white mb-3",
                                children: "How are you feeling today?"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 314,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-zinc-400 mb-6",
                                children: "Pick the vibe for this session. Light workouts will not show up in your history graphs."
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 315,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleModeSelect('incremental'),
                                        className: "w-full text-left bg-emerald-700/80 hover:bg-emerald-600 text-white px-4 py-4 rounded-lg font-semibold transition-colors",
                                        children: [
                                            "Incremental progress",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-emerald-200 text-sm font-normal",
                                                children: "Push for small wins today."
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 324,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 319,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleModeSelect('maintenance'),
                                        className: "w-full text-left bg-blue-700/70 hover:bg-blue-600 text-white px-4 py-4 rounded-lg font-semibold transition-colors",
                                        children: [
                                            "Maintenance",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-blue-200 text-sm font-normal",
                                                children: "Hold steady and keep the groove."
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 331,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 326,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleModeSelect('light'),
                                        className: "w-full text-left bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-4 rounded-lg font-semibold transition-colors",
                                        children: [
                                            "Light session",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-300 text-sm font-normal",
                                                children: "Deload or just move a bit."
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 338,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 333,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 318,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 312,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 310,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/workout/[name]/page.tsx",
            lineNumber: 309,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-900 p-4 pb-32",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 350,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/",
                                        className: "text-blue-400 hover:text-blue-300",
                                        children: "← Back to workouts"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 354,
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
                                                lineNumber: 359,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleDeleteClick,
                                                className: "bg-red-900/50 hover:bg-red-900 text-red-300 hover:text-red-100 px-4 py-2 rounded text-sm font-semibold transition-colors",
                                                children: "Delete Routine"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 365,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 358,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 353,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-4xl font-bold text-white",
                                children: workout.name
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 374,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 352,
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
                                                children: "Session Mode"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 382,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-white text-lg font-semibold",
                                                children: [
                                                    startMode === 'incremental' && 'Incremental progress',
                                                    startMode === 'maintenance' && 'Maintenance',
                                                    startMode === 'light' && 'Light session'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 383,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-400 text-sm mt-1",
                                                children: [
                                                    startMode === 'incremental' && 'Push for small, steady improvements.',
                                                    startMode === 'maintenance' && 'Hold steady and focus on form.',
                                                    startMode === 'light' && 'Easy effort today. This session will not appear in history graphs.'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 388,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 381,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleModeReset,
                                        className: "text-xs text-emerald-300 hover:text-emerald-200 bg-zinc-900 px-3 py-2 rounded",
                                        children: "Change"
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 395,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 380,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 379,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 378,
                        columnNumber: 11
                    }, this),
                    isPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeader"], {
                                icon: "🎯",
                                iconClassName: "text-amber-400",
                                label: "Workout Goals",
                                className: "text-2xl"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 408,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                paddingClassName: "p-5",
                                borderClassName: "border-amber-600",
                                children: goalsText ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-zinc-200 leading-relaxed",
                                    children: goalsText
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 416,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-zinc-400",
                                            children: "Set your goals to personalize targets and reports."
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 419,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/goals",
                                            className: "bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold",
                                            children: "Add Goals"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 420,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 418,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 414,
                                columnNumber: 13
                            }, this),
                            targetsLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-500 text-sm mt-3",
                                children: "Loading trainer targets..."
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 430,
                                columnNumber: 15
                            }, this),
                            targetsError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-red-400 text-sm mt-3",
                                children: "Targets unavailable right now."
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 433,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 407,
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
                                lineNumber: 440,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-sm mb-4",
                                children: "Dynamic stretches · 5-8 minutes"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 446,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: workout.preWorkoutStretches.map((stretch, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StretchCard, {
                                        stretch: stretch,
                                        index: index
                                    }, index, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 449,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 447,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 439,
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
                                lineNumber: 456,
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
                                lineNumber: 462,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: workout.exercises.map((exercise, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ExerciseCard, {
                                        exercise: exercise,
                                        index: index,
                                        onShowHistory: openHistory,
                                        targets: targets,
                                        showTargets: isPreview
                                    }, index, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 465,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 463,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 455,
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
                                lineNumber: 480,
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
                                                    lineNumber: 489,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-blue-400 text-lg mb-1",
                                                    children: workout.cardio.duration
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                                    lineNumber: 490,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-zinc-400 text-sm",
                                                    children: workout.cardio.intensity
                                                }, void 0, false, {
                                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                                    lineNumber: 491,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 488,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 487,
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
                                                lineNumber: 495,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-300 text-sm",
                                                children: workout.cardio.tips
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 496,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 494,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 486,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 479,
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
                                lineNumber: 504,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-400 text-sm mb-4",
                                children: "Static stretches · 8-10 minutes"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 510,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: workout.postWorkoutStretches.map((stretch, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StretchCard, {
                                        stretch: stretch,
                                        index: index
                                    }, index, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 513,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 511,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 503,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SharedUi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BottomActionBar"], {
                        maxWidthClassName: "max-w-2xl",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                const query = new URLSearchParams();
                                if (routineId) query.set('routineId', String(routineId));
                                if (startMode) query.set('mode', startMode);
                                const queryString = query.toString();
                                const url = `/stretches/${encodeURIComponent(workout.name)}${queryString ? `?${queryString}` : ''}`;
                                router.push(url);
                            },
                            className: "w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold transition-colors",
                            children: "Start Workout"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 520,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 519,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 349,
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
                            lineNumber: 540,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-zinc-300 mb-6",
                            children: "This will permanently delete this routine. Are you sure you want to proceed?"
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 541,
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
                                    lineNumber: 546,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleConfirmDelete,
                                    disabled: deleting,
                                    className: "bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors",
                                    children: deleting ? 'Deleting...' : 'Delete'
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 553,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 545,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/page.tsx",
                    lineNumber: 539,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 538,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExerciseHistoryModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: showHistory,
                onClose: closeHistory,
                exerciseNames: historyExerciseNames,
                title: "Exercise History",
                targets: historyTargets
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 565,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/workout/[name]/page.tsx",
        lineNumber: 348,
        columnNumber: 5
    }, this);
}
_s(WorkoutDetailPage, "aQvCzrP59LlfLkZ5Os/7wljqwtY=", false, function() {
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
                lineNumber: 582,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-sm font-semibold text-white mb-1",
                children: stretch.name
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 583,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-blue-400 text-xs mb-2",
                children: stretch.duration
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 584,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-zinc-400 text-xs mb-2 leading-relaxed",
                children: tips
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 585,
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
                lineNumber: 586,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/workout/[name]/page.tsx",
        lineNumber: 581,
        columnNumber: 5
    }, this);
}
_c1 = StretchCard;
function TargetCard({ baseWeight, baseReps, suggestion, isBodyweight }) {
    const targetWeight = suggestion?.suggestedWeight ?? baseWeight;
    const targetReps = suggestion?.suggestedReps ?? baseReps;
    const weightDelta = suggestion?.suggestedWeight != null ? suggestion.suggestedWeight - baseWeight : null;
    const repsDelta = suggestion?.suggestedReps != null ? suggestion.suggestedReps - baseReps : null;
    const showWeight = !isBodyweight;
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
                lineNumber: 620,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `grid ${showWeight ? 'grid-cols-2' : 'grid-cols-1'} gap-3`,
                children: [
                    showWeight && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-500 text-xs mb-1",
                                children: "Weight"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 624,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-white font-semibold text-lg",
                                children: [
                                    targetWeight,
                                    " lbs",
                                    weightDelta !== null && weightDelta !== 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `ml-2 text-sm ${deltaClass(weightDelta)}`,
                                        children: [
                                            "(",
                                            formatDelta(weightDelta),
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 628,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 625,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 623,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-zinc-500 text-xs mb-1",
                                children: "Reps"
                            }, void 0, false, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 634,
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
                                        lineNumber: 638,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 635,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 633,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 621,
                columnNumber: 7
            }, this),
            suggestion?.rationale && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-zinc-400 text-xs mt-2",
                children: suggestion.rationale
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 644,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/workout/[name]/page.tsx",
        lineNumber: 619,
        columnNumber: 5
    }, this);
}
_c2 = TargetCard;
function ExerciseCard({ exercise, index, onShowHistory, targets, showTargets }) {
    if (exercise.type === 'single') {
        const tips = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFormTips"])(exercise.tips);
        const videoHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVideoUrl"])(exercise.name, exercise.videoUrl);
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
                                    lineNumber: 671,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-bold text-white mb-2",
                                    children: exercise.name
                                }, void 0, false, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 672,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 670,
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
                                    lineNumber: 675,
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
                                    lineNumber: 683,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 674,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/page.tsx",
                    lineNumber: 669,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2 mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-green-950 border border-green-800 rounded p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-green-400 text-xs mb-1",
                                            children: "Warmup Weight"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 696,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-green-300 font-bold text-2xl",
                                            children: [
                                                exercise.warmupWeight,
                                                " lbs"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 697,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 695,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-orange-950 border border-orange-800 rounded p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-orange-400 text-xs mb-1",
                                            children: "Working Weight"
                                        }, void 0, false, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 700,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-orange-300 font-bold text-2xl",
                                            children: [
                                                exercise.targetWeight,
                                                " lbs"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/workout/[name]/page.tsx",
                                            lineNumber: 701,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 699,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 694,
                            columnNumber: 11
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
                                            lineNumber: 708,
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
                                            lineNumber: 709,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 707,
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
                                            lineNumber: 712,
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
                                            lineNumber: 713,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/workout/[name]/page.tsx",
                                    lineNumber: 711,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 706,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/page.tsx",
                    lineNumber: 692,
                    columnNumber: 9
                }, this),
                showTargets && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TargetCard, {
                    baseWeight: exercise.targetWeight,
                    baseReps: exercise.targetReps,
                    suggestion: targets[exercise.name],
                    isBodyweight: exercise.isBodyweight
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/page.tsx",
                    lineNumber: 721,
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
                            lineNumber: 730,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-zinc-300 text-sm",
                            children: tips
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 731,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/workout/[name]/page.tsx",
                    lineNumber: 729,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/workout/[name]/page.tsx",
            lineNumber: 668,
            columnNumber: 7
        }, this);
    }
    // B2B Exercise
    const [ex1, ex2] = exercise.exercises;
    const ex1Tips = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFormTips"])(ex1.tips);
    const ex2Tips = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFormTips"])(ex2.tips);
    const ex1VideoHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVideoUrl"])(ex1.name, ex1.videoUrl);
    const ex2VideoHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workout$2d$media$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVideoUrl"])(ex2.name, ex2.videoUrl);
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
                        lineNumber: 747,
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
                        lineNumber: 750,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 746,
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
                                        lineNumber: 762,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-bold text-white mb-2",
                                        children: ex1.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 763,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 761,
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
                                lineNumber: 765,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 760,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-green-950 border border-green-800 rounded p-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-green-400 text-xs mb-1",
                                                children: "Warmup"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 779,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-green-300 font-bold text-xl",
                                                children: [
                                                    ex1.warmupWeight,
                                                    " lbs"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 780,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 778,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-orange-950 border border-orange-800 rounded p-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-orange-400 text-xs mb-1",
                                                children: "Working"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 783,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-orange-300 font-bold text-xl",
                                                children: [
                                                    ex1.targetWeight,
                                                    " lbs"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 784,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 782,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 777,
                                columnNumber: 11
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
                                                lineNumber: 791,
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
                                                lineNumber: 792,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 790,
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
                                                lineNumber: 797,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-400 text-xs",
                                                children: ex1Tips
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 798,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 796,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 789,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 775,
                        columnNumber: 9
                    }, this),
                    showTargets && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TargetCard, {
                            baseWeight: ex1.targetWeight,
                            baseReps: ex1.targetReps,
                            suggestion: targets[ex1.name],
                            isBodyweight: ex1.isBodyweight
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 805,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 804,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 759,
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
                                lineNumber: 819,
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
                                lineNumber: 820,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 818,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/workout/[name]/page.tsx",
                    lineNumber: 817,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 816,
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
                                        lineNumber: 829,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-bold text-white mb-2",
                                        children: ex2.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 830,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 828,
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
                                lineNumber: 832,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 827,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-green-950 border border-green-800 rounded p-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-green-400 text-xs mb-1",
                                                children: "Warmup"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 846,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-green-300 font-bold text-xl",
                                                children: [
                                                    ex2.warmupWeight,
                                                    " lbs"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 847,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 845,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-orange-950 border border-orange-800 rounded p-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-orange-400 text-xs mb-1",
                                                children: "Working"
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 850,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-orange-300 font-bold text-xl",
                                                children: [
                                                    ex2.targetWeight,
                                                    " lbs"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 851,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 849,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 844,
                                columnNumber: 11
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
                                                lineNumber: 858,
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
                                                lineNumber: 859,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 857,
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
                                                lineNumber: 864,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-400 text-xs",
                                                children: ex2Tips
                                            }, void 0, false, {
                                                fileName: "[project]/app/workout/[name]/page.tsx",
                                                lineNumber: 865,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/workout/[name]/page.tsx",
                                        lineNumber: 863,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/workout/[name]/page.tsx",
                                lineNumber: 856,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 842,
                        columnNumber: 9
                    }, this),
                    showTargets && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TargetCard, {
                            baseWeight: ex2.targetWeight,
                            baseReps: ex2.targetReps,
                            suggestion: targets[ex2.name],
                            isBodyweight: ex2.isBodyweight
                        }, void 0, false, {
                            fileName: "[project]/app/workout/[name]/page.tsx",
                            lineNumber: 872,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/workout/[name]/page.tsx",
                        lineNumber: 871,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/workout/[name]/page.tsx",
                lineNumber: 826,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/workout/[name]/page.tsx",
        lineNumber: 745,
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

//# sourceMappingURL=_bc18679e._.js.map