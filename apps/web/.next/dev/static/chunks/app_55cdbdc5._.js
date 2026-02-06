(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/app/components/RoutineEditParts.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddButton",
    ()=>AddButton,
    "CardioForm",
    ()=>CardioForm,
    "CardioItem",
    ()=>CardioItem,
    "ExerciseAddRow",
    ()=>ExerciseAddRow,
    "ExerciseItem",
    ()=>ExerciseItem,
    "StretchItem",
    ()=>StretchItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function AddButton({ onClick, label, color }) {
    const colorClasses = {
        green: 'bg-green-900/50 hover:bg-green-800/50',
        blue: 'bg-blue-900/50 hover:bg-blue-800/50',
        orange: 'bg-orange-900/50 hover:bg-orange-800/50'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: `w-full py-2 text-sm rounded ${colorClasses[color]} text-white transition-colors mb-2`,
        children: [
            "+ ",
            label
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/RoutineEditParts.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = AddButton;
function ExerciseAddRow({ onAddExercise, onAddSuperset }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-2 mb-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onAddExercise,
                className: "flex-1 py-2 text-sm rounded bg-orange-900/60 text-white hover:bg-orange-800/60 transition-colors",
                children: "+ Exercise"
            }, void 0, false, {
                fileName: "[project]/app/components/RoutineEditParts.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onAddSuperset,
                className: "flex-1 py-2 text-sm rounded bg-purple-900/60 text-white hover:bg-purple-800/60 transition-colors",
                children: "+ Superset"
            }, void 0, false, {
                fileName: "[project]/app/components/RoutineEditParts.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/RoutineEditParts.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c1 = ExerciseAddRow;
function StretchItem({ stretch, onDelete }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-800 rounded-lg p-4 border-2 border-zinc-700 mb-2 flex items-center justify-between",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-white font-semibold",
                        children: stretch.name
                    }, void 0, false, {
                        fileName: "[project]/app/components/RoutineEditParts.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    stretch.duration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-zinc-400 text-sm",
                        children: stretch.duration
                    }, void 0, false, {
                        fileName: "[project]/app/components/RoutineEditParts.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/RoutineEditParts.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onDelete,
                className: "text-red-500 hover:text-red-400 p-2",
                title: "Delete",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    }, void 0, false, {
                        fileName: "[project]/app/components/RoutineEditParts.tsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/RoutineEditParts.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/RoutineEditParts.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_c2 = StretchItem;
function ExerciseItem({ exercise, onDelete }) {
    const isSuperset = exercise.exercise_type === 'b2b';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `bg-zinc-800 rounded-lg p-4 border-2 ${isSuperset ? 'border-purple-700' : 'border-zinc-700'} mb-2`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1",
                    children: [
                        isSuperset && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-purple-400 text-xs font-bold mb-2",
                            children: "SUPERSET"
                        }, void 0, false, {
                            fileName: "[project]/app/components/RoutineEditParts.tsx",
                            lineNumber: 97,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-white font-semibold",
                            children: exercise.exercise_name
                        }, void 0, false, {
                            fileName: "[project]/app/components/RoutineEditParts.tsx",
                            lineNumber: 99,
                            columnNumber: 11
                        }, this),
                        isSuperset && exercise.b2b_partner_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-purple-400 text-sm my-1",
                                    children: "+"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                                    lineNumber: 102,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-white font-semibold",
                                    children: exercise.b2b_partner_name
                                }, void 0, false, {
                                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                                    lineNumber: 103,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onDelete,
                    className: "text-red-500 hover:text-red-400 p-2",
                    title: "Delete",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-5 w-5",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        }, void 0, false, {
                            fileName: "[project]/app/components/RoutineEditParts.tsx",
                            lineNumber: 113,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/RoutineEditParts.tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                    lineNumber: 107,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/RoutineEditParts.tsx",
            lineNumber: 94,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/RoutineEditParts.tsx",
        lineNumber: 93,
        columnNumber: 5
    }, this);
}
_c3 = ExerciseItem;
function CardioItem({ cardio, onDelete }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-800 rounded-lg p-4 border-2 border-red-900 mb-2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-white font-semibold text-lg",
                            children: cardio.type
                        }, void 0, false, {
                            fileName: "[project]/app/components/RoutineEditParts.tsx",
                            lineNumber: 132,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-400 text-sm",
                            children: cardio.duration
                        }, void 0, false, {
                            fileName: "[project]/app/components/RoutineEditParts.tsx",
                            lineNumber: 133,
                            columnNumber: 11
                        }, this),
                        cardio.intensity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-500 text-sm",
                            children: cardio.intensity
                        }, void 0, false, {
                            fileName: "[project]/app/components/RoutineEditParts.tsx",
                            lineNumber: 135,
                            columnNumber: 13
                        }, this),
                        cardio.tips && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-500 text-xs mt-1",
                            children: cardio.tips
                        }, void 0, false, {
                            fileName: "[project]/app/components/RoutineEditParts.tsx",
                            lineNumber: 138,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                    lineNumber: 131,
                    columnNumber: 9
                }, this),
                onDelete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onDelete,
                    className: "text-red-500 hover:text-red-400 p-2",
                    title: "Delete",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-5 w-5",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        }, void 0, false, {
                            fileName: "[project]/app/components/RoutineEditParts.tsx",
                            lineNumber: 148,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/RoutineEditParts.tsx",
                        lineNumber: 147,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                    lineNumber: 142,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/RoutineEditParts.tsx",
            lineNumber: 130,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/RoutineEditParts.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
_c4 = CardioItem;
function CardioForm({ onSave, onCancel }) {
    _s();
    const [type, setType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [duration, setDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [intensity, setIntensity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [tips, setTips] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleSubmit = ()=>{
        if (!type.trim() || !duration.trim()) return;
        onSave({
            type: type.trim(),
            duration: duration.trim(),
            intensity: intensity.trim(),
            tips: tips.trim()
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-red-600",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold text-white mb-4",
                    children: "Add Cardio"
                }, void 0, false, {
                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                    lineNumber: 177,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-400 text-sm block mb-1",
                                    children: "Type *"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: type,
                                    onChange: (e)=>setType(e.target.value),
                                    placeholder: "e.g., Incline Walk, Bike, Stairmaster",
                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500",
                                    autoFocus: true
                                }, void 0, false, {
                                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                                    lineNumber: 182,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/RoutineEditParts.tsx",
                            lineNumber: 180,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-400 text-sm block mb-1",
                                    children: "Duration *"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                                    lineNumber: 193,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: duration,
                                    onChange: (e)=>setDuration(e.target.value),
                                    placeholder: "e.g., 15 min, 20 min",
                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                                    lineNumber: 194,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/RoutineEditParts.tsx",
                            lineNumber: 192,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-400 text-sm block mb-1",
                                    children: "Intensity"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                                    lineNumber: 204,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: intensity,
                                    onChange: (e)=>setIntensity(e.target.value),
                                    placeholder: "e.g., 12% incline, 3.0 mph",
                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                                    lineNumber: 205,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/RoutineEditParts.tsx",
                            lineNumber: 203,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-zinc-400 text-sm block mb-1",
                                    children: "Tips"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                                    lineNumber: 215,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: tips,
                                    onChange: (e)=>setTips(e.target.value),
                                    placeholder: "Optional tips...",
                                    rows: 2,
                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                                    lineNumber: 216,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/RoutineEditParts.tsx",
                            lineNumber: 214,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onCancel,
                            className: "flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/app/components/RoutineEditParts.tsx",
                            lineNumber: 227,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSubmit,
                            disabled: !type.trim() || !duration.trim(),
                            className: "flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors",
                            children: "Add Cardio"
                        }, void 0, false, {
                            fileName: "[project]/app/components/RoutineEditParts.tsx",
                            lineNumber: 233,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/RoutineEditParts.tsx",
                    lineNumber: 226,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/RoutineEditParts.tsx",
            lineNumber: 176,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/RoutineEditParts.tsx",
        lineNumber: 175,
        columnNumber: 5
    }, this);
}
_s(CardioForm, "6Yz8/4Yfr8puwVURVZFLb6YmJw4=");
_c5 = CardioForm;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "AddButton");
__turbopack_context__.k.register(_c1, "ExerciseAddRow");
__turbopack_context__.k.register(_c2, "StretchItem");
__turbopack_context__.k.register(_c3, "ExerciseItem");
__turbopack_context__.k.register(_c4, "CardioItem");
__turbopack_context__.k.register(_c5, "CardioForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/routines/ai/preview/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AiRoutinePreviewPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RoutineEditParts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/RoutineEditParts.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const STORAGE_KEY = 'ai_routine_draft';
function buildPreview(plan) {
    return {
        name: plan?.name || 'Untitled',
        description: plan?.description || '',
        exercises: Array.isArray(plan?.exercises) ? plan.exercises.length : 0,
        preStretches: Array.isArray(plan?.preWorkoutStretches) ? plan.preWorkoutStretches.length : 0,
        postStretches: Array.isArray(plan?.postWorkoutStretches) ? plan.postWorkoutStretches.length : 0,
        hasCardio: !!plan?.cardio
    };
}
function StretchPreviewItem({ stretch }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-800 rounded-lg p-4 border-2 border-zinc-700 mb-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white font-semibold",
                children: stretch.name
            }, void 0, false, {
                fileName: "[project]/app/routines/ai/preview/page.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            stretch.duration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-zinc-400 text-sm",
                children: stretch.duration
            }, void 0, false, {
                fileName: "[project]/app/routines/ai/preview/page.tsx",
                lineNumber: 79,
                columnNumber: 9
            }, this),
            stretch.tips && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-zinc-500 text-xs mt-1",
                children: stretch.tips
            }, void 0, false, {
                fileName: "[project]/app/routines/ai/preview/page.tsx",
                lineNumber: 82,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/routines/ai/preview/page.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c = StretchPreviewItem;
function ExercisePreviewItem({ exercise }) {
    if (exercise.type === 'b2b') {
        const [ex1, ex2] = exercise.exercises || [];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-800 rounded-lg p-4 border-2 border-purple-700 mb-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-purple-400 text-xs font-bold mb-2",
                    children: "SUPERSET"
                }, void 0, false, {
                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-white font-semibold",
                    children: ex1?.name || 'Exercise 1'
                }, void 0, false, {
                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-zinc-500 text-xs mt-1",
                    children: [
                        "Sets: ",
                        ex1?.sets ?? 'N/A',
                        " • Reps: ",
                        ex1?.targetReps ?? 'N/A',
                        " • Weight: ",
                        ex1?.targetWeight ?? 'N/A'
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-purple-400 text-sm my-1",
                    children: "+"
                }, void 0, false, {
                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-white font-semibold",
                    children: ex2?.name || 'Exercise 2'
                }, void 0, false, {
                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                    lineNumber: 99,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-zinc-500 text-xs mt-1",
                    children: [
                        "Sets: ",
                        ex2?.sets ?? 'N/A',
                        " • Reps: ",
                        ex2?.targetReps ?? 'N/A',
                        " • Weight: ",
                        ex2?.targetWeight ?? 'N/A'
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/routines/ai/preview/page.tsx",
            lineNumber: 92,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-800 rounded-lg p-4 border-2 border-zinc-700 mb-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white font-semibold",
                children: exercise.name
            }, void 0, false, {
                fileName: "[project]/app/routines/ai/preview/page.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-zinc-500 text-xs mt-1",
                children: [
                    "Sets: ",
                    exercise.sets ?? 'N/A',
                    " • Reps: ",
                    exercise.targetReps ?? 'N/A',
                    " • Weight: ",
                    exercise.targetWeight ?? 'N/A'
                ]
            }, void 0, true, {
                fileName: "[project]/app/routines/ai/preview/page.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            typeof exercise.restTime === 'number' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-zinc-500 text-xs mt-1",
                children: [
                    "Rest: ",
                    exercise.restTime,
                    "s"
                ]
            }, void 0, true, {
                fileName: "[project]/app/routines/ai/preview/page.tsx",
                lineNumber: 114,
                columnNumber: 9
            }, this),
            typeof exercise.warmupWeight === 'number' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-zinc-500 text-xs mt-1",
                children: [
                    "Warmup: ",
                    exercise.warmupWeight
                ]
            }, void 0, true, {
                fileName: "[project]/app/routines/ai/preview/page.tsx",
                lineNumber: 117,
                columnNumber: 9
            }, this),
            exercise.tips && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-zinc-500 text-xs mt-1",
                children: exercise.tips
            }, void 0, false, {
                fileName: "[project]/app/routines/ai/preview/page.tsx",
                lineNumber: 120,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/routines/ai/preview/page.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
_c1 = ExercisePreviewItem;
function AiRoutinePreviewPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [planText, setPlanText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('preview');
    const [showPreStretchSelector, setShowPreStretchSelector] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPostStretchSelector, setShowPostStretchSelector] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showExerciseSelector, setShowExerciseSelector] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSupersetSelector, setShowSupersetSelector] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCardioForm, setShowCardioForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [insertPreStretchAt, setInsertPreStretchAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [insertPostStretchAt, setInsertPostStretchAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [insertExerciseAt, setInsertExerciseAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AiRoutinePreviewPage.useEffect": ()=>{
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setPlanText(stored);
            }
        }
    }["AiRoutinePreviewPage.useEffect"], []);
    const parsedPlan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AiRoutinePreviewPage.useMemo[parsedPlan]": ()=>{
            if (!planText.trim()) return null;
            try {
                return JSON.parse(planText);
            } catch  {
                return null;
            }
        }
    }["AiRoutinePreviewPage.useMemo[parsedPlan]"], [
        planText
    ]);
    const preview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AiRoutinePreviewPage.useMemo[preview]": ()=>buildPreview(parsedPlan)
    }["AiRoutinePreviewPage.useMemo[preview]"], [
        parsedPlan
    ]);
    const updatePlan = (updater)=>{
        if (!planText.trim()) return;
        try {
            const parsed = JSON.parse(planText);
            const updated = updater(parsed);
            setPlanText(JSON.stringify(updated, null, 2));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated, null, 2));
        } catch  {
            setError('JSON is invalid. Please fix it before editing.');
        }
    };
    const handleDeleteExercise = (index)=>{
        updatePlan((plan)=>{
            const exercises = Array.isArray(plan.exercises) ? [
                ...plan.exercises
            ] : [];
            exercises.splice(index, 1);
            return {
                ...plan,
                exercises
            };
        });
    };
    const handleDeleteStretch = (index, type)=>{
        updatePlan((plan)=>{
            if (type === 'pre') {
                const pre = Array.isArray(plan.preWorkoutStretches) ? [
                    ...plan.preWorkoutStretches
                ] : [];
                pre.splice(index, 1);
                return {
                    ...plan,
                    preWorkoutStretches: pre
                };
            }
            const post = Array.isArray(plan.postWorkoutStretches) ? [
                ...plan.postWorkoutStretches
            ] : [];
            post.splice(index, 1);
            return {
                ...plan,
                postWorkoutStretches: post
            };
        });
    };
    const handleSelectPreStretch = (stretch)=>{
        setShowPreStretchSelector(false);
        updatePlan((plan)=>{
            const pre = Array.isArray(plan.preWorkoutStretches) ? [
                ...plan.preWorkoutStretches
            ] : [];
            const insertAt = insertPreStretchAt ?? pre.length;
            pre.splice(insertAt, 0, {
                name: stretch.name,
                duration: stretch.duration,
                tips: stretch.tips || undefined
            });
            return {
                ...plan,
                preWorkoutStretches: pre
            };
        });
        setInsertPreStretchAt(null);
    };
    const handleSelectPostStretch = (stretch)=>{
        setShowPostStretchSelector(false);
        updatePlan((plan)=>{
            const post = Array.isArray(plan.postWorkoutStretches) ? [
                ...plan.postWorkoutStretches
            ] : [];
            const insertAt = insertPostStretchAt ?? post.length;
            post.splice(insertAt, 0, {
                name: stretch.name,
                duration: stretch.duration,
                tips: stretch.tips || undefined
            });
            return {
                ...plan,
                postWorkoutStretches: post
            };
        });
        setInsertPostStretchAt(null);
    };
    const handleSelectExercise = (exercise)=>{
        setShowExerciseSelector(false);
        updatePlan((plan)=>{
            const exercises = Array.isArray(plan.exercises) ? [
                ...plan.exercises
            ] : [];
            const insertAt = insertExerciseAt ?? exercises.length;
            exercises.splice(insertAt, 0, {
                type: 'single',
                name: exercise.name,
                sets: 3,
                targetReps: 10,
                targetWeight: 0,
                warmupWeight: 0,
                restTime: 60,
                tips: exercise.tips || undefined
            });
            return {
                ...plan,
                exercises
            };
        });
        setInsertExerciseAt(null);
    };
    const handleSelectSuperset = (exercise1, exercise2)=>{
        setShowSupersetSelector(false);
        updatePlan((plan)=>{
            const exercises = Array.isArray(plan.exercises) ? [
                ...plan.exercises
            ] : [];
            const insertAt = insertExerciseAt ?? exercises.length;
            exercises.splice(insertAt, 0, {
                type: 'b2b',
                exercises: [
                    {
                        name: exercise1.name,
                        sets: 3,
                        targetReps: 10,
                        targetWeight: 0,
                        warmupWeight: 0,
                        tips: exercise1.tips || undefined
                    },
                    {
                        name: exercise2.name,
                        sets: 3,
                        targetReps: 10,
                        targetWeight: 0,
                        warmupWeight: 0,
                        tips: exercise2.tips || undefined
                    }
                ]
            });
            return {
                ...plan,
                exercises
            };
        });
        setInsertExerciseAt(null);
    };
    const handleSaveCardio = (cardioData)=>{
        updatePlan((plan)=>({
                ...plan,
                cardio: cardioData
            }));
        setShowCardioForm(false);
    };
    const handleDeleteCardio = ()=>{
        updatePlan((plan)=>{
            const next = {
                ...plan
            };
            delete next.cardio;
            return next;
        });
    };
    const handleSave = async ()=>{
        if (!planText.trim()) return;
        let workoutPlan;
        try {
            workoutPlan = JSON.parse(planText);
        } catch  {
            setError('JSON is invalid. Please fix it before saving.');
            return;
        }
        setSaving(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch('/api/routines/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    workoutPlan
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.error || 'Failed to save routine');
            }
            localStorage.removeItem(STORAGE_KEY);
            setSuccess(`Saved "${workoutPlan.name}" to your routines.`);
            setTimeout(()=>router.push('/'), 1500);
        } catch (err) {
            setError(err.message || 'Failed to save routine');
        } finally{
            setSaving(false);
        }
    };
    if (!planText.trim()) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-3xl mx-auto py-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                        lineNumber: 326,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-zinc-800 border border-zinc-700 rounded-lg p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-white mb-2",
                                children: "No routine to preview"
                            }, void 0, false, {
                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                lineNumber: 328,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-zinc-400 mb-4",
                                children: "Generate a routine first, then click “View Workout”."
                            }, void 0, false, {
                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                lineNumber: 329,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push('/routines/ai'),
                                className: "bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold",
                                children: "Back to AI Builder"
                            }, void 0, false, {
                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                lineNumber: 332,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                        lineNumber: 327,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/routines/ai/preview/page.tsx",
                lineNumber: 325,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/routines/ai/preview/page.tsx",
            lineNumber: 324,
            columnNumber: 7
        }, this);
    }
    const exercises = parsedPlan?.exercises || [];
    const preStretches = parsedPlan?.preWorkoutStretches || [];
    const postStretches = parsedPlan?.postWorkoutStretches || [];
    const cardio = parsedPlan?.cardio;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-900 p-4 pb-32",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-4xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                        lineNumber: 352,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-3xl font-bold text-white",
                                        children: "Routine Preview"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 355,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-zinc-400 text-sm",
                                        children: "Review, edit, and save your AI workout."
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 356,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                lineNumber: 354,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setMode('preview'),
                                        className: `text-sm font-semibold ${mode === 'preview' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`,
                                        children: "Preview"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 359,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setMode('edit'),
                                        className: `text-sm font-semibold ${mode === 'edit' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`,
                                        children: "Edit"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 367,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push('/routines/ai'),
                                        className: "text-zinc-400 hover:text-zinc-200 text-sm font-semibold",
                                        children: "Back to AI Builder"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 375,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                lineNumber: 358,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                        lineNumber: 353,
                        columnNumber: 9
                    }, this),
                    mode === 'preview' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-zinc-800 rounded-lg p-6 border-2 border-zinc-700 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-white",
                                        children: preview.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 387,
                                        columnNumber: 15
                                    }, this),
                                    preview.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-zinc-400 mt-2",
                                        children: preview.description
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 389,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                lineNumber: 386,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-green-500",
                                                children: "🟢"
                                            }, void 0, false, {
                                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                lineNumber: 396,
                                                columnNumber: 17
                                            }, this),
                                            " Pre-Workout Stretches"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 395,
                                        columnNumber: 15
                                    }, this),
                                    preStretches.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2",
                                        children: "No pre-workout stretches"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 399,
                                        columnNumber: 17
                                    }, this) : preStretches.map((stretch, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StretchPreviewItem, {
                                            stretch: stretch
                                        }, `pre-${index}`, false, {
                                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                                            lineNumber: 404,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                lineNumber: 394,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-orange-500",
                                                children: "🔥"
                                            }, void 0, false, {
                                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                lineNumber: 412,
                                                columnNumber: 17
                                            }, this),
                                            " Exercises"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 411,
                                        columnNumber: 15
                                    }, this),
                                    exercises.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2",
                                        children: "No exercises"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 415,
                                        columnNumber: 17
                                    }, this) : exercises.map((exercise, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ExercisePreviewItem, {
                                            exercise: exercise
                                        }, `ex-${index}`, false, {
                                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                                            lineNumber: 420,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                lineNumber: 410,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-red-500",
                                                children: "❤️"
                                            }, void 0, false, {
                                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                lineNumber: 428,
                                                columnNumber: 17
                                            }, this),
                                            " Cardio (Optional)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 427,
                                        columnNumber: 15
                                    }, this),
                                    cardio ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RoutineEditParts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardioItem"], {
                                        cardio: {
                                            type: cardio.type || 'Cardio',
                                            duration: cardio.duration || '',
                                            intensity: cardio.intensity,
                                            tips: cardio.tips
                                        },
                                        onDelete: handleDeleteCardio
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 431,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowCardioForm(true),
                                        className: "w-full py-3 text-sm rounded bg-red-900/50 text-white hover:bg-red-800/50 transition-colors",
                                        children: "+ Add Cardio"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 441,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                lineNumber: 426,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-blue-500",
                                                children: "🔵"
                                            }, void 0, false, {
                                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                lineNumber: 453,
                                                columnNumber: 17
                                            }, this),
                                            " Post-Workout Stretches"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 452,
                                        columnNumber: 15
                                    }, this),
                                    postStretches.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2",
                                        children: "No post-workout stretches"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 456,
                                        columnNumber: 17
                                    }, this) : postStretches.map((stretch, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StretchPreviewItem, {
                                            stretch: stretch
                                        }, `post-${index}`, false, {
                                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                                            lineNumber: 461,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                lineNumber: 451,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-zinc-800 rounded-lg p-6 border-2 border-zinc-700 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-zinc-400 text-sm block mb-2",
                                        children: "Routine Name"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 469,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: parsedPlan?.name || '',
                                        onChange: (e)=>{
                                            const name = e.target.value;
                                            updatePlan((plan)=>({
                                                    ...plan,
                                                    name
                                                }));
                                        },
                                        className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 470,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-zinc-400 text-sm block mb-2",
                                        children: "Description"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 478,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: parsedPlan?.description || '',
                                        onChange: (e)=>{
                                            const description = e.target.value;
                                            updatePlan((plan)=>({
                                                    ...plan,
                                                    description
                                                }));
                                        },
                                        className: "w-full bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 479,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                lineNumber: 468,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-green-500",
                                                children: "🟢"
                                            }, void 0, false, {
                                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                lineNumber: 492,
                                                columnNumber: 17
                                            }, this),
                                            " Pre-Workout Stretches"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 491,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RoutineEditParts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AddButton"], {
                                        onClick: ()=>{
                                            setInsertPreStretchAt(0);
                                            setShowPreStretchSelector(true);
                                        },
                                        label: "Add Pre-Stretch",
                                        color: "green"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 494,
                                        columnNumber: 15
                                    }, this),
                                    preStretches.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2",
                                        children: "No pre-workout stretches"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 501,
                                        columnNumber: 17
                                    }, this) : preStretches.map((stretch, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RoutineEditParts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StretchItem"], {
                                                    stretch: {
                                                        name: stretch.name,
                                                        duration: stretch.duration
                                                    },
                                                    onDelete: ()=>handleDeleteStretch(index, 'pre')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                    lineNumber: 507,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RoutineEditParts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AddButton"], {
                                                    onClick: ()=>{
                                                        setInsertPreStretchAt(index + 1);
                                                        setShowPreStretchSelector(true);
                                                    },
                                                    label: "Add Pre-Stretch",
                                                    color: "green"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                    lineNumber: 511,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, `pre-${index}`, true, {
                                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                                            lineNumber: 506,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                lineNumber: 490,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-orange-500",
                                                children: "🔥"
                                            }, void 0, false, {
                                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                lineNumber: 524,
                                                columnNumber: 17
                                            }, this),
                                            " Exercises"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 523,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RoutineEditParts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExerciseAddRow"], {
                                        onAddExercise: ()=>{
                                            setInsertExerciseAt(0);
                                            setShowExerciseSelector(true);
                                        },
                                        onAddSuperset: ()=>{
                                            setInsertExerciseAt(0);
                                            setShowSupersetSelector(true);
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 526,
                                        columnNumber: 15
                                    }, this),
                                    exercises.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2",
                                        children: "No exercises"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 532,
                                        columnNumber: 17
                                    }, this) : exercises.map((exercise, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RoutineEditParts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExerciseItem"], {
                                                    exercise: exercise.type === 'b2b' ? {
                                                        exercise_name: exercise.exercises?.[0]?.name || 'Exercise 1',
                                                        exercise_type: 'b2b',
                                                        b2b_partner_name: exercise.exercises?.[1]?.name || 'Exercise 2'
                                                    } : {
                                                        exercise_name: exercise.name,
                                                        exercise_type: 'single',
                                                        b2b_partner_name: null
                                                    },
                                                    onDelete: ()=>handleDeleteExercise(index)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                    lineNumber: 538,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RoutineEditParts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExerciseAddRow"], {
                                                    onAddExercise: ()=>{
                                                        setInsertExerciseAt(index + 1);
                                                        setShowExerciseSelector(true);
                                                    },
                                                    onAddSuperset: ()=>{
                                                        setInsertExerciseAt(index + 1);
                                                        setShowSupersetSelector(true);
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                    lineNumber: 554,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, `ex-${index}`, true, {
                                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                                            lineNumber: 537,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                lineNumber: 522,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-red-500",
                                                children: "❤️"
                                            }, void 0, false, {
                                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                lineNumber: 566,
                                                columnNumber: 17
                                            }, this),
                                            " Cardio (Optional)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 565,
                                        columnNumber: 15
                                    }, this),
                                    cardio ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-800 rounded-lg p-4 border-2 border-red-900 mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-white font-semibold text-lg",
                                                children: cardio.type || 'Cardio'
                                            }, void 0, false, {
                                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                lineNumber: 570,
                                                columnNumber: 19
                                            }, this),
                                            cardio.duration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-400 text-sm",
                                                children: cardio.duration
                                            }, void 0, false, {
                                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                lineNumber: 572,
                                                columnNumber: 21
                                            }, this),
                                            cardio.intensity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-sm",
                                                children: cardio.intensity
                                            }, void 0, false, {
                                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                lineNumber: 575,
                                                columnNumber: 21
                                            }, this),
                                            cardio.tips && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-zinc-500 text-xs mt-1",
                                                children: cardio.tips
                                            }, void 0, false, {
                                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                lineNumber: 578,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 569,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2",
                                        children: "No cardio"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 582,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                lineNumber: 564,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-white mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-blue-500",
                                                children: "🔵"
                                            }, void 0, false, {
                                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                lineNumber: 591,
                                                columnNumber: 17
                                            }, this),
                                            " Post-Workout Stretches"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 590,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RoutineEditParts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AddButton"], {
                                        onClick: ()=>{
                                            setInsertPostStretchAt(0);
                                            setShowPostStretchSelector(true);
                                        },
                                        label: "Add Post-Stretch",
                                        color: "blue"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 593,
                                        columnNumber: 15
                                    }, this),
                                    postStretches.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg mb-2",
                                        children: "No post-workout stretches"
                                    }, void 0, false, {
                                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                                        lineNumber: 600,
                                        columnNumber: 17
                                    }, this) : postStretches.map((stretch, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RoutineEditParts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StretchItem"], {
                                                    stretch: {
                                                        name: stretch.name,
                                                        duration: stretch.duration
                                                    },
                                                    onDelete: ()=>handleDeleteStretch(index, 'post')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                    lineNumber: 606,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RoutineEditParts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AddButton"], {
                                                    onClick: ()=>{
                                                        setInsertPostStretchAt(index + 1);
                                                        setShowPostStretchSelector(true);
                                                    },
                                                    label: "Add Post-Stretch",
                                                    color: "blue"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                    lineNumber: 610,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, `post-${index}`, true, {
                                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                                            lineNumber: 605,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/routines/ai/preview/page.tsx",
                                lineNumber: 589,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                        lineNumber: 623,
                        columnNumber: 11
                    }, this),
                    success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 bg-emerald-900/50 border border-emerald-600 text-emerald-200 px-4 py-3 rounded-lg",
                        children: success
                    }, void 0, false, {
                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                        lineNumber: 628,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/routines/ai/preview/page.tsx",
                lineNumber: 351,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-4xl mx-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSave,
                        disabled: !planText.trim() || saving,
                        className: "w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white py-4 rounded-lg text-xl font-bold transition-colors",
                        children: saving ? 'Saving...' : 'Save & Exit'
                    }, void 0, false, {
                        fileName: "[project]/app/routines/ai/preview/page.tsx",
                        lineNumber: 636,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                    lineNumber: 635,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/routines/ai/preview/page.tsx",
                lineNumber: 634,
                columnNumber: 7
            }, this),
            showPreStretchForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-green-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold text-white mb-4",
                            children: "Add Pre-Stretch"
                        }, void 0, false, {
                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                            lineNumber: 649,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3 mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: stretchForm.name || '',
                                    onChange: (e)=>setStretchForm({
                                            ...stretchForm,
                                            name: e.target.value
                                        }),
                                    placeholder: "Stretch name",
                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 651,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: stretchForm.duration || '',
                                    onChange: (e)=>setStretchForm({
                                            ...stretchForm,
                                            duration: e.target.value
                                        }),
                                    placeholder: "Duration (e.g., 30 seconds)",
                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 657,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: stretchForm.tips || '',
                                    onChange: (e)=>setStretchForm({
                                            ...stretchForm,
                                            tips: e.target.value
                                        }),
                                    placeholder: "Tips (optional)",
                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 663,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                            lineNumber: 650,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleAddStretch('pre'),
                                    className: "flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded",
                                    children: "Add"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 671,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowPreStretchForm(false);
                                        setInsertPreStretchAt(null);
                                    },
                                    className: "flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 677,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                            lineNumber: 670,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                    lineNumber: 648,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/routines/ai/preview/page.tsx",
                lineNumber: 647,
                columnNumber: 9
            }, this),
            showPostStretchForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-blue-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold text-white mb-4",
                            children: "Add Post-Stretch"
                        }, void 0, false, {
                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                            lineNumber: 691,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3 mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: stretchForm.name || '',
                                    onChange: (e)=>setStretchForm({
                                            ...stretchForm,
                                            name: e.target.value
                                        }),
                                    placeholder: "Stretch name",
                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 693,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: stretchForm.duration || '',
                                    onChange: (e)=>setStretchForm({
                                            ...stretchForm,
                                            duration: e.target.value
                                        }),
                                    placeholder: "Duration (e.g., 45 seconds)",
                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 699,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: stretchForm.tips || '',
                                    onChange: (e)=>setStretchForm({
                                            ...stretchForm,
                                            tips: e.target.value
                                        }),
                                    placeholder: "Tips (optional)",
                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 705,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                            lineNumber: 692,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleAddStretch('post'),
                                    className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded",
                                    children: "Add"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 713,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowPostStretchForm(false);
                                        setInsertPostStretchAt(null);
                                    },
                                    className: "flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 719,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                            lineNumber: 712,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                    lineNumber: 690,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/routines/ai/preview/page.tsx",
                lineNumber: 689,
                columnNumber: 9
            }, this),
            showExerciseForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-orange-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold text-white mb-4",
                            children: "Add Exercise"
                        }, void 0, false, {
                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                            lineNumber: 733,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3 mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: exerciseForm.name || '',
                                    onChange: (e)=>setExerciseForm({
                                            ...exerciseForm,
                                            name: e.target.value
                                        }),
                                    placeholder: "Exercise name",
                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 735,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            value: exerciseForm.sets ?? 3,
                                            onChange: (e)=>setExerciseForm({
                                                    ...exerciseForm,
                                                    sets: Number(e.target.value)
                                                }),
                                            placeholder: "Sets",
                                            className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                                            lineNumber: 742,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            value: exerciseForm.targetReps ?? 10,
                                            onChange: (e)=>setExerciseForm({
                                                    ...exerciseForm,
                                                    targetReps: Number(e.target.value)
                                                }),
                                            placeholder: "Reps",
                                            className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                                            lineNumber: 749,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            value: exerciseForm.targetWeight ?? 0,
                                            onChange: (e)=>setExerciseForm({
                                                    ...exerciseForm,
                                                    targetWeight: Number(e.target.value)
                                                }),
                                            placeholder: "Weight",
                                            className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                                            lineNumber: 756,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            value: exerciseForm.warmupWeight ?? 0,
                                            onChange: (e)=>setExerciseForm({
                                                    ...exerciseForm,
                                                    warmupWeight: Number(e.target.value)
                                                }),
                                            placeholder: "Warmup",
                                            className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                                            lineNumber: 763,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            value: exerciseForm.restTime ?? 60,
                                            onChange: (e)=>setExerciseForm({
                                                    ...exerciseForm,
                                                    restTime: Number(e.target.value)
                                                }),
                                            placeholder: "Rest (s)",
                                            className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                                            lineNumber: 770,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 741,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: exerciseForm.tips || '',
                                    onChange: (e)=>setExerciseForm({
                                            ...exerciseForm,
                                            tips: e.target.value
                                        }),
                                    placeholder: "Tips (optional)",
                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 778,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                            lineNumber: 734,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleAddExercise,
                                    className: "flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded",
                                    children: "Add"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 786,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowExerciseForm(false);
                                        setInsertExerciseAt(null);
                                    },
                                    className: "flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 792,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                            lineNumber: 785,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                    lineNumber: 732,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/routines/ai/preview/page.tsx",
                lineNumber: 731,
                columnNumber: 9
            }, this),
            showSupersetForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-800 rounded-lg p-6 max-w-md w-full border-2 border-purple-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold text-white mb-4",
                            children: "Add Superset"
                        }, void 0, false, {
                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                            lineNumber: 806,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4 mb-4",
                            children: supersetForm.exercises.map((exercise, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-purple-300 text-xs font-semibold",
                                            children: [
                                                "Exercise ",
                                                idx + 1
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                                            lineNumber: 810,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: exercise.name || '',
                                            onChange: (e)=>{
                                                const next = [
                                                    ...supersetForm.exercises
                                                ];
                                                next[idx] = {
                                                    ...next[idx],
                                                    name: e.target.value
                                                };
                                                setSupersetForm({
                                                    ...supersetForm,
                                                    exercises: next
                                                });
                                            },
                                            placeholder: "Exercise name",
                                            className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                                            lineNumber: 813,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: exercise.sets ?? 3,
                                                    onChange: (e)=>{
                                                        const next = [
                                                            ...supersetForm.exercises
                                                        ];
                                                        next[idx] = {
                                                            ...next[idx],
                                                            sets: Number(e.target.value)
                                                        };
                                                        setSupersetForm({
                                                            ...supersetForm,
                                                            exercises: next
                                                        });
                                                    },
                                                    placeholder: "Sets",
                                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                    lineNumber: 824,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: exercise.targetReps ?? 10,
                                                    onChange: (e)=>{
                                                        const next = [
                                                            ...supersetForm.exercises
                                                        ];
                                                        next[idx] = {
                                                            ...next[idx],
                                                            targetReps: Number(e.target.value)
                                                        };
                                                        setSupersetForm({
                                                            ...supersetForm,
                                                            exercises: next
                                                        });
                                                    },
                                                    placeholder: "Reps",
                                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                    lineNumber: 835,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: exercise.targetWeight ?? 0,
                                                    onChange: (e)=>{
                                                        const next = [
                                                            ...supersetForm.exercises
                                                        ];
                                                        next[idx] = {
                                                            ...next[idx],
                                                            targetWeight: Number(e.target.value)
                                                        };
                                                        setSupersetForm({
                                                            ...supersetForm,
                                                            exercises: next
                                                        });
                                                    },
                                                    placeholder: "Weight",
                                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                    lineNumber: 846,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: exercise.warmupWeight ?? 0,
                                                    onChange: (e)=>{
                                                        const next = [
                                                            ...supersetForm.exercises
                                                        ];
                                                        next[idx] = {
                                                            ...next[idx],
                                                            warmupWeight: Number(e.target.value)
                                                        };
                                                        setSupersetForm({
                                                            ...supersetForm,
                                                            exercises: next
                                                        });
                                                    },
                                                    placeholder: "Warmup",
                                                    className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                                    lineNumber: 857,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                                            lineNumber: 823,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: exercise.tips || '',
                                            onChange: (e)=>{
                                                const next = [
                                                    ...supersetForm.exercises
                                                ];
                                                next[idx] = {
                                                    ...next[idx],
                                                    tips: e.target.value
                                                };
                                                setSupersetForm({
                                                    ...supersetForm,
                                                    exercises: next
                                                });
                                            },
                                            placeholder: "Tips (optional)",
                                            className: "w-full bg-zinc-900 text-white px-3 py-2 rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                                            lineNumber: 869,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, `superset-${idx}`, true, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 809,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                            lineNumber: 807,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleAddSuperset,
                                    className: "flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded",
                                    children: "Add"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 883,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowSupersetForm(false);
                                        setInsertExerciseAt(null);
                                    },
                                    className: "flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                                    lineNumber: 889,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/routines/ai/preview/page.tsx",
                            lineNumber: 882,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/routines/ai/preview/page.tsx",
                    lineNumber: 805,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/routines/ai/preview/page.tsx",
                lineNumber: 804,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/routines/ai/preview/page.tsx",
        lineNumber: 350,
        columnNumber: 5
    }, this);
}
_s(AiRoutinePreviewPage, "52aYX4BtLipAe2awr8kA2b2DJwg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c2 = AiRoutinePreviewPage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "StretchPreviewItem");
__turbopack_context__.k.register(_c1, "ExercisePreviewItem");
__turbopack_context__.k.register(_c2, "AiRoutinePreviewPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_55cdbdc5._.js.map