(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/muscle-tags.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MUSCLE_GROUP_ORDER",
    ()=>MUSCLE_GROUP_ORDER,
    "MUSCLE_GROUP_TAGS",
    ()=>MUSCLE_GROUP_TAGS,
    "STRETCH_MUSCLE_ORDER",
    ()=>STRETCH_MUSCLE_ORDER,
    "STRETCH_MUSCLE_TAGS",
    ()=>STRETCH_MUSCLE_TAGS,
    "formatTypeLabel",
    ()=>formatTypeLabel,
    "normalizeTypeList",
    ()=>normalizeTypeList,
    "parseTagJson",
    ()=>parseTagJson
]);
const MUSCLE_GROUP_TAGS = [
    'lower body compound',
    'upper body compound',
    'full body compound',
    'chest',
    'back',
    'shoulders',
    'biceps',
    'triceps',
    'forearms',
    'core',
    'lower back',
    'glutes',
    'quads',
    'hamstrings',
    'calves',
    'hip flexors',
    'adductors',
    'abductors',
    'unknown'
];
const STRETCH_MUSCLE_TAGS = [
    ...MUSCLE_GROUP_TAGS
];
const MUSCLE_GROUP_ORDER = [
    ...MUSCLE_GROUP_TAGS
];
const STRETCH_MUSCLE_ORDER = [
    ...STRETCH_MUSCLE_TAGS
];
function normalizeTypeList(value, allowed, maxItems = 2) {
    const entries = Array.isArray(value) ? value : typeof value === 'string' ? [
        value
    ] : [];
    if (entries.length === 0) return [];
    const cleaned = entries.map((item)=>typeof item === 'string' ? item.trim().toLowerCase() : '').filter(Boolean);
    const filtered = allowed ? cleaned.filter((tag)=>allowed.includes(tag)) : cleaned;
    const unique = [];
    for (const tag of filtered){
        if (!unique.includes(tag)) {
            unique.push(tag);
        }
        if (unique.length >= maxItems) break;
    }
    return unique;
}
function parseTagJson(value, allowed, maxItems = 2) {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        return normalizeTypeList(parsed, allowed, maxItems);
    } catch  {
        return [];
    }
}
function formatTypeLabel(value) {
    return value.split(' ').map((word)=>word ? word[0].toUpperCase() + word.slice(1) : word).join(' ');
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
"[project]/app/routines/[id]/stretches/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RoutineStretchesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$muscle$2d$tags$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/muscle-tags.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stretch$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/stretch-utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function RoutineStretchesPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const routineId = params.id;
    const [allStretches, setAllStretches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedPreStretches, setSelectedPreStretches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedPostStretches, setSelectedPostStretches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('pre');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [recommendedPreIds, setRecommendedPreIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recommendedPostIds, setRecommendedPostIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recommending, setRecommending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [recommendError, setRecommendError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RoutineStretchesPage.useEffect": ()=>{
            fetchStretches();
        }
    }["RoutineStretchesPage.useEffect"], []);
    const fetchStretches = async ()=>{
        try {
            const response = await fetch('/api/stretches');
            const data = await response.json();
            setAllStretches(data.stretches);
            fetchRecommendations(data.stretches);
        } catch (error) {
            console.error('Error fetching stretches:', error);
        } finally{
            setLoading(false);
        }
    };
    const fetchRecommendations = async (currentStretches)=>{
        setRecommending(true);
        setRecommendError(null);
        try {
            const response = await fetch(`/api/routines/${routineId}/stretch-recommendations`, {
                method: 'POST'
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.error || 'Failed to generate recommendations');
            }
            const data = await response.json();
            const createdStretches = data.createdStretches || [];
            if (createdStretches.length > 0) {
                const existingIds = new Set(currentStretches.map((stretch)=>stretch.id));
                const newOnes = createdStretches.filter((stretch)=>!existingIds.has(stretch.id));
                if (newOnes.length > 0) {
                    setAllStretches([
                        ...currentStretches,
                        ...newOnes
                    ]);
                }
            }
            setRecommendedPreIds(data.recommendedPreIds || []);
            setRecommendedPostIds(data.recommendedPostIds || []);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setRecommendError(error.message || 'Failed to load recommendations');
        } finally{
            setRecommending(false);
        }
    };
    const filteredStretches = allStretches.filter((stretch)=>{
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const name = stretch.name.toLowerCase();
        const muscleGroups = getMuscleGroups(stretch).join(' ').toLowerCase();
        return name.includes(query) || muscleGroups.includes(query);
    });
    const recommendedIds = activeTab === 'pre' ? recommendedPreIds : recommendedPostIds;
    const recommendedSet = new Set(recommendedIds);
    const orderedStretches = [
        ...filteredStretches.filter((stretch)=>recommendedSet.has(stretch.id)),
        ...filteredStretches.filter((stretch)=>!recommendedSet.has(stretch.id))
    ];
    const toggleStretch = (stretchId)=>{
        if (activeTab === 'pre') {
            if (selectedPreStretches.includes(stretchId)) {
                setSelectedPreStretches(selectedPreStretches.filter((id)=>id !== stretchId));
            } else {
                setSelectedPreStretches([
                    ...selectedPreStretches,
                    stretchId
                ]);
            }
        } else {
            if (selectedPostStretches.includes(stretchId)) {
                setSelectedPostStretches(selectedPostStretches.filter((id)=>id !== stretchId));
            } else {
                setSelectedPostStretches([
                    ...selectedPostStretches,
                    stretchId
                ]);
            }
        }
    };
    const isSelected = (stretchId)=>{
        return activeTab === 'pre' ? selectedPreStretches.includes(stretchId) : selectedPostStretches.includes(stretchId);
    };
    const handleSaveAndFinish = async ()=>{
        setSaving(true);
        try {
            // Save pre-workout stretches
            for(let i = 0; i < selectedPreStretches.length; i++){
                await fetch(`/api/routines/${routineId}/stretches`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        stretchId: selectedPreStretches[i],
                        type: 'pre',
                        orderIndex: i
                    })
                });
            }
            // Save post-workout stretches
            for(let i = 0; i < selectedPostStretches.length; i++){
                await fetch(`/api/routines/${routineId}/stretches`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        stretchId: selectedPostStretches[i],
                        type: 'post',
                        orderIndex: i
                    })
                });
            }
            // Redirect to routines
            router.push('/routines');
        } catch (error) {
            console.error('Error saving stretches:', error);
            alert('Failed to save stretches. Please try again.');
        } finally{
            setSaving(false);
        }
    };
    function getMuscleGroups(stretch) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$muscle$2d$tags$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseTagJson"])(stretch.muscle_groups, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$muscle$2d$tags$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STRETCH_MUSCLE_TAGS"]);
    }
    // Get all types covered by selected stretches for the current tab
    const getCoveredGroups = ()=>{
        const selectedIds = activeTab === 'pre' ? selectedPreStretches : selectedPostStretches;
        const groupSet = new Set();
        selectedIds.forEach((stretchId)=>{
            const stretch = allStretches.find((s)=>s.id === stretchId);
            if (stretch) {
                const muscleGroups = getMuscleGroups(stretch);
                muscleGroups.forEach((tag)=>groupSet.add(tag));
            }
        });
        return Array.from(groupSet).sort();
    };
    const coveredGroups = getCoveredGroups();
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-900 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white text-xl",
                children: "Loading stretches..."
            }, void 0, false, {
                fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                lineNumber: 184,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/routines/[id]/stretches/page.tsx",
            lineNumber: 183,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-900 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-white mb-2",
                    children: "Select Stretches"
                }, void 0, false, {
                    fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                    lineNumber: 192,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-zinc-400 mb-6",
                    children: "Choose stretches for your routine. You can select multiple."
                }, void 0, false, {
                    fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                    lineNumber: 193,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab('pre'),
                            className: `flex-1 py-3 rounded-lg font-bold transition-colors ${activeTab === 'pre' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`,
                            children: [
                                "Pre-Workout (",
                                selectedPreStretches.length,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                            lineNumber: 199,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab('post'),
                            className: `flex-1 py-3 rounded-lg font-bold transition-colors ${activeTab === 'post' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`,
                            children: [
                                "Post-Workout (",
                                selectedPostStretches.length,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                    lineNumber: 198,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `rounded-lg p-4 mb-6 border-2 ${activeTab === 'pre' ? 'bg-blue-900/20 border-blue-700' : 'bg-purple-900/20 border-purple-700'}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-semibold text-zinc-300 mb-2",
                            children: [
                                "Muscle Groups Covered (",
                                coveredGroups.length,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                            lineNumber: 225,
                            columnNumber: 11
                        }, this),
                        coveredGroups.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-zinc-500 text-sm",
                            children: "Select stretches to see muscle coverage"
                        }, void 0, false, {
                            fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                            lineNumber: 229,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: coveredGroups.map((muscle, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `text-sm px-3 py-1 rounded-full ${activeTab === 'pre' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}`,
                                    children: muscle
                                }, idx, false, {
                                    fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                                    lineNumber: 233,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                            lineNumber: 231,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                    lineNumber: 222,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: searchQuery,
                    onChange: (e)=>setSearchQuery(e.target.value),
                    placeholder: "Search by name or muscle group...",
                    className: "w-full bg-zinc-800 text-white px-4 py-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                }, void 0, false, {
                    fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                    lineNumber: 249,
                    columnNumber: 9
                }, this),
                (recommending || recommendError) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        recommending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm text-zinc-400",
                            children: "Finding recommended stretches for this workout..."
                        }, void 0, false, {
                            fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                            lineNumber: 260,
                            columnNumber: 15
                        }, this),
                        recommendError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm text-red-300",
                            children: recommendError
                        }, void 0, false, {
                            fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                            lineNumber: 265,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                    lineNumber: 258,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3 mb-6",
                    children: orderedStretches.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-zinc-400 py-8",
                        children: "No stretches found"
                    }, void 0, false, {
                        fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                        lineNumber: 275,
                        columnNumber: 13
                    }, this) : orderedStretches.map((stretch)=>{
                        const muscleGroups = getMuscleGroups(stretch);
                        const selected = isSelected(stretch.id);
                        const isRecommended = recommendedSet.has(stretch.id);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>toggleStretch(stretch.id),
                            className: `w-full text-left p-4 rounded-lg transition-all border-2 ${selected ? activeTab === 'pre' ? 'bg-blue-900/30 border-blue-500' : 'bg-purple-900/30 border-purple-500' : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 mb-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-white font-semibold",
                                                    children: stretch.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                                                    lineNumber: 299,
                                                    columnNumber: 25
                                                }, this),
                                                isRecommended && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-emerald-200 bg-emerald-900/60 px-2 py-1 rounded",
                                                    children: "* recommended for this workout"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                                                    lineNumber: 301,
                                                    columnNumber: 27
                                                }, this),
                                                selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `text-xs px-2 py-1 rounded ${activeTab === 'pre' ? 'bg-blue-600' : 'bg-purple-600'} text-white`,
                                                    children: "✓ Selected"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                                                    lineNumber: 306,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                                            lineNumber: 298,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-zinc-400 text-sm mb-2",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stretch$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatStretchTimer"])(stretch.timer_seconds)
                                        }, void 0, false, {
                                            fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                                            lineNumber: 313,
                                            columnNumber: 23
                                        }, this),
                                        muscleGroups.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2",
                                            children: muscleGroups.map((muscle, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded",
                                                    children: muscle
                                                }, idx, false, {
                                                    fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                                                    lineNumber: 319,
                                                    columnNumber: 29
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                                            lineNumber: 317,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                                    lineNumber: 297,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                                lineNumber: 296,
                                columnNumber: 19
                            }, this)
                        }, stretch.id, false, {
                            fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                            lineNumber: 285,
                            columnNumber: 17
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                    lineNumber: 273,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "sticky bottom-4 bg-zinc-900 pt-4 space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSaveAndFinish,
                            disabled: saving,
                            className: "w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white py-4 rounded-lg text-lg font-bold transition-colors",
                            children: saving ? 'Saving...' : 'Save & Finish Routine'
                        }, void 0, false, {
                            fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                            lineNumber: 338,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push(`/routines/builder?id=${routineId}`),
                            className: "w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",
                            children: "Back to Exercises"
                        }, void 0, false, {
                            fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                            lineNumber: 346,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/routines/[id]/stretches/page.tsx",
                    lineNumber: 337,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/routines/[id]/stretches/page.tsx",
            lineNumber: 191,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/routines/[id]/stretches/page.tsx",
        lineNumber: 190,
        columnNumber: 5
    }, this);
}
_s(RoutineStretchesPage, "9YT2XmyOK5DJYJ0irnbJvwAVndY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = RoutineStretchesPage;
var _c;
__turbopack_context__.k.register(_c, "RoutineStretchesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_b1625bb4._.js.map