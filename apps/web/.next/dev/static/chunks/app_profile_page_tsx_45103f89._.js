(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/profile/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProfilePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function ProfilePage() {
    _s();
    const [userInfo, setUserInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [restTimeSeconds, setRestTimeSeconds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('60');
    const [supersetRestSeconds, setSupersetRestSeconds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('15');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saveStatus, setSaveStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [loadError, setLoadError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [validationError, setValidationError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [goalsText, setGoalsText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [goalsSaving, setGoalsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [goalsStatus, setGoalsStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [goalsLoadError, setGoalsLoadError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProfilePage.useEffect": ()=>{
            async function fetchProfile() {
                try {
                    const [userResponse, settingsResponse, goalsResponse] = await Promise.all([
                        fetch('/api/user'),
                        fetch('/api/user/settings'),
                        fetch('/api/goals')
                    ]);
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        setUserInfo({
                            username: userData.username || null,
                            name: userData.name || null,
                            email: userData.email || null
                        });
                    }
                    if (settingsResponse.ok) {
                        const settingsData = await settingsResponse.json();
                        if (settingsData?.restTimeSeconds !== undefined) {
                            setRestTimeSeconds(String(settingsData.restTimeSeconds));
                        }
                        if (settingsData?.supersetRestSeconds !== undefined) {
                            setSupersetRestSeconds(String(settingsData.supersetRestSeconds));
                        }
                    }
                    if (goalsResponse.ok) {
                        const goalsData = await goalsResponse.json();
                        setGoalsText(goalsData.goals || '');
                    } else {
                        setGoalsLoadError(true);
                    }
                } catch (error) {
                    console.error('Error loading profile settings:', error);
                    setLoadError(true);
                    setGoalsLoadError(true);
                } finally{
                    setLoading(false);
                }
            }
            fetchProfile();
        }
    }["ProfilePage.useEffect"], []);
    const displayName = userInfo?.username ? `@${userInfo.username}` : userInfo?.name || userInfo?.email || 'Profile';
    const handleSave = async ()=>{
        setSaving(true);
        setSaveStatus('idle');
        setValidationError(null);
        const restSeconds = Number(restTimeSeconds);
        const supersetSeconds = Number(supersetRestSeconds);
        if (!Number.isFinite(restSeconds) || restSeconds < 0) {
            setValidationError('Rest time must be a non-negative number.');
            setSaving(false);
            return;
        }
        if (!Number.isFinite(supersetSeconds) || supersetSeconds < 0) {
            setValidationError('Superset rest time must be a non-negative number.');
            setSaving(false);
            return;
        }
        try {
            const response = await fetch('/api/user/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    restTimeSeconds: restSeconds,
                    supersetRestSeconds: supersetSeconds
                })
            });
            if (!response.ok) {
                throw new Error('Failed to save');
            }
            setSaveStatus('saved');
        } catch (error) {
            console.error('Error saving profile settings:', error);
            setSaveStatus('error');
        } finally{
            setSaving(false);
        }
    };
    const handleGoalsSave = async ()=>{
        setGoalsSaving(true);
        setGoalsStatus('idle');
        try {
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    goals: goalsText
                })
            });
            if (!response.ok) {
                throw new Error('Failed to save');
            }
            setGoalsStatus('saved');
        } catch (error) {
            console.error('Error saving goals:', error);
            setGoalsStatus('error');
        } finally{
            setGoalsSaving(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-900 p-4 text-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-2xl",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-zinc-700 bg-zinc-800 p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold mb-2",
                        children: displayName
                    }, void 0, false, {
                        fileName: "[project]/app/profile/page.tsx",
                        lineNumber: 146,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-zinc-300 mb-6",
                        children: "Set your default rest timers. Set a value to 0 seconds to skip the timer between sets."
                    }, void 0, false, {
                        fileName: "[project]/app/profile/page.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this),
                    loadError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3 text-sm text-red-400",
                        children: "Could not load profile settings."
                    }, void 0, false, {
                        fileName: "[project]/app/profile/page.tsx",
                        lineNumber: 152,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-8 border-b border-zinc-700 pb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold mb-2",
                                children: "Fitness Goals and Background"
                            }, void 0, false, {
                                fileName: "[project]/app/profile/page.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-zinc-300 mb-4",
                                children: "What are your fitness goals? Share goals like strength, hypertrophy, rehab focus, equipment limits, or weekly targets. Also please share any relevant background about you! Age, Gender, Sports you are into.. We'll use this for AI-assisted routines and post-workout reports."
                            }, void 0, false, {
                                fileName: "[project]/app/profile/page.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this),
                            goalsLoadError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 text-sm text-red-400",
                                children: "Could not load goals."
                            }, void 0, false, {
                                fileName: "[project]/app/profile/page.tsx",
                                lineNumber: 163,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "goals",
                                className: "text-sm font-semibold text-zinc-200",
                                children: "Goals & preferences"
                            }, void 0, false, {
                                fileName: "[project]/app/profile/page.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                id: "goals",
                                rows: 8,
                                value: goalsText,
                                onChange: (event)=>setGoalsText(event.target.value),
                                disabled: loading || goalsSaving,
                                placeholder: "Example: Build strength in squat/bench, avoid knee-heavy plyometrics, 4 days/week, focus on upper body hypertrophy.",
                                className: "mt-2 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            }, void 0, false, {
                                fileName: "[project]/app/profile/page.tsx",
                                lineNumber: 169,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleGoalsSave,
                                        disabled: loading || goalsSaving,
                                        className: "rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:opacity-70",
                                        children: goalsSaving ? 'Saving...' : 'Save Goals'
                                    }, void 0, false, {
                                        fileName: "[project]/app/profile/page.tsx",
                                        lineNumber: 180,
                                        columnNumber: 15
                                    }, this),
                                    goalsStatus === 'saved' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-emerald-400",
                                        children: "Saved"
                                    }, void 0, false, {
                                        fileName: "[project]/app/profile/page.tsx",
                                        lineNumber: 188,
                                        columnNumber: 17
                                    }, this),
                                    goalsStatus === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-red-400",
                                        children: "Could not save goals."
                                    }, void 0, false, {
                                        fileName: "[project]/app/profile/page.tsx",
                                        lineNumber: 191,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/profile/page.tsx",
                                lineNumber: 179,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/profile/page.tsx",
                        lineNumber: 155,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "rest-time",
                                        className: "text-sm font-semibold text-zinc-200",
                                        children: "Rest time between sets (seconds)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/profile/page.tsx",
                                        lineNumber: 198,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "rest-time",
                                        type: "number",
                                        min: "0",
                                        value: restTimeSeconds,
                                        onChange: (event)=>setRestTimeSeconds(event.target.value),
                                        disabled: loading || saving,
                                        className: "mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                    }, void 0, false, {
                                        fileName: "[project]/app/profile/page.tsx",
                                        lineNumber: 201,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/profile/page.tsx",
                                lineNumber: 197,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "superset-rest-time",
                                        className: "text-sm font-semibold text-zinc-200",
                                        children: "Rest time between superset rounds (seconds)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/profile/page.tsx",
                                        lineNumber: 213,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "superset-rest-time",
                                        type: "number",
                                        min: "0",
                                        value: supersetRestSeconds,
                                        onChange: (event)=>setSupersetRestSeconds(event.target.value),
                                        disabled: loading || saving,
                                        className: "mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                    }, void 0, false, {
                                        fileName: "[project]/app/profile/page.tsx",
                                        lineNumber: 216,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/profile/page.tsx",
                                lineNumber: 212,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/profile/page.tsx",
                        lineNumber: 196,
                        columnNumber: 11
                    }, this),
                    validationError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 text-sm text-red-400",
                        children: validationError
                    }, void 0, false, {
                        fileName: "[project]/app/profile/page.tsx",
                        lineNumber: 229,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSave,
                                disabled: saving || loading,
                                className: "rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:opacity-70",
                                children: saving ? 'Saving...' : 'Save Settings'
                            }, void 0, false, {
                                fileName: "[project]/app/profile/page.tsx",
                                lineNumber: 233,
                                columnNumber: 13
                            }, this),
                            saveStatus === 'saved' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-emerald-400",
                                children: "Saved"
                            }, void 0, false, {
                                fileName: "[project]/app/profile/page.tsx",
                                lineNumber: 241,
                                columnNumber: 15
                            }, this),
                            saveStatus === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-red-400",
                                children: "Could not save settings."
                            }, void 0, false, {
                                fileName: "[project]/app/profile/page.tsx",
                                lineNumber: 244,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/profile/page.tsx",
                        lineNumber: 232,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/profile/page.tsx",
                lineNumber: 145,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/profile/page.tsx",
            lineNumber: 144,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/profile/page.tsx",
        lineNumber: 143,
        columnNumber: 5
    }, this);
}
_s(ProfilePage, "r2Rjo+V7jMxyRSAdM2wm9eGFs+s=");
_c = ProfilePage;
var _c;
__turbopack_context__.k.register(_c, "ProfilePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_profile_page_tsx_45103f89._.js.map