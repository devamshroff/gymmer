(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,18566,(e,t,i)=>{t.exports=e.r(76562)},49448,e=>{"use strict";var t=e.i(43476);function i({children:e,className:i="",paddingClassName:r,borderClassName:s="border-zinc-700",borderWidthClassName:o="border-2"}){return(0,t.jsx)("div",{className:`bg-zinc-800 rounded-lg ${o} ${s} ${r||"p-4"} ${i}`.trim(),children:e})}function r({message:e,description:i,className:r=""}){return(0,t.jsxs)("div",{className:`text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg ${r}`.trim(),children:[(0,t.jsx)("div",{children:e}),i&&(0,t.jsx)("div",{className:"text-zinc-600 text-sm mt-1",children:i})]})}function s({children:e,maxWidthClassName:i="max-w-2xl",className:r=""}){return(0,t.jsx)("div",{className:`fixed bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800 ${r}`.trim(),children:(0,t.jsx)("div",{className:`${i} mx-auto`,children:e})})}function o({icon:e,label:i,iconClassName:r="text-zinc-400",className:s=""}){return(0,t.jsxs)("h2",{className:`text-xl font-bold text-white mb-4 flex items-center gap-2 ${s}`.trim(),children:[(0,t.jsx)("span",{className:r,children:e}),i]})}e.s(["BottomActionBar",()=>s,"Card",()=>i,"EmptyState",()=>r,"SectionHeader",()=>o])},76475,e=>{"use strict";var t=e.i(43476),i=e.i(71645),r=e.i(18566),s=e.i(49448);function o(){let e=(0,r.useRouter)(),[o,n]=(0,i.useState)(!1),[l,a]=(0,i.useState)(null),[c,d]=(0,i.useState)(null),m=async t=>{let i=t.target.files?.[0];if(i){n(!0),a(null),d(null);try{let t=await i.text(),r=JSON.parse(t);if(!r.name||!r.exercises)throw Error('Invalid workout plan format. Must include "name" and "exercises" fields.');let s=await fetch("/api/routines/import",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({workoutPlan:r,fileName:i.name})});if(!s.ok){let e=await s.json();throw Error(e.error||"Failed to import routine")}await s.json(),d(`Successfully imported "${r.name}"!`),setTimeout(()=>{e.push("/routines")},2e3)}catch(e){console.error("Error importing routine:",e),a(e.message||"Failed to import routine. Please check the file format.")}finally{n(!1)}}};return(0,t.jsx)("div",{className:"min-h-screen bg-zinc-900 p-4",children:(0,t.jsxs)("div",{className:"max-w-2xl mx-auto py-8",children:[(0,t.jsx)("h1",{className:"text-3xl font-bold text-white mb-2",children:"Import Routine from JSON"}),(0,t.jsx)("p",{className:"text-zinc-400 mb-6",children:"Upload a workout plan JSON file to import it into your routines. Tell your LLM! This is the JSON format the importer expects."}),(0,t.jsxs)(s.Card,{paddingClassName:"p-6",borderClassName:"border-blue-600",className:"mb-6",children:[(0,t.jsxs)("label",{htmlFor:"file-upload",className:"block w-full cursor-pointer",children:[(0,t.jsxs)("div",{className:"border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors",children:[(0,t.jsx)("div",{className:"text-4xl mb-4",children:"📁"}),(0,t.jsx)("div",{className:"text-white font-semibold mb-2",children:"Click to select JSON file"}),(0,t.jsx)("div",{className:"text-zinc-400 text-sm",children:"Or drag and drop your workout plan JSON file here"})]}),(0,t.jsx)("input",{id:"file-upload",type:"file",accept:".json,application/json",onChange:m,disabled:o,className:"hidden"})]}),o&&(0,t.jsx)("div",{className:"mt-4 text-center text-blue-400",children:"Importing routine..."}),l&&(0,t.jsx)("div",{className:"mt-4 bg-red-900/50 border-2 border-red-500 text-red-200 px-4 py-3 rounded-lg",children:l}),c&&(0,t.jsx)("div",{className:"mt-4 bg-green-900/50 border-2 border-green-500 text-green-200 px-4 py-3 rounded-lg",children:c})]}),(0,t.jsxs)(s.Card,{paddingClassName:"p-6",className:"mb-6",children:[(0,t.jsx)("h2",{className:"text-xl font-bold text-white mb-3",children:"Expected JSON Format"}),(0,t.jsx)("div",{className:"text-zinc-400 text-sm mb-3",children:"This format is current for the database-backed importer. Your JSON file should follow this structure (optional fields are supported):"}),(0,t.jsx)("pre",{className:"bg-zinc-900 p-4 rounded-lg text-xs text-zinc-300 overflow-x-auto",children:`{
  "name": "My Workout Routine",
  "description": "Optional description",
  "exercises": [
    {
      "type": "single",
      "name": "Bench Press",
      "videoUrl": "https://example.com/video",
      "tips": "Optional form cue"
    },
    {
      "type": "b2b",
      "exercises": [
        {
          "name": "Pull-ups",
          "videoUrl": "https://example.com/video",
          "tips": "Optional form cue"
        },
        {
          "name": "Push-ups",
          "videoUrl": "https://example.com/video",
          "tips": "Optional form cue"
        }
      ]
    }
  ],
  "preWorkoutStretches": [
    {
      "name": "Arm Circles",
      "timerSeconds": 30,
      "videoUrl": "https://example.com/video",
      "tips": "Optional cue"
    }
  ],
  "postWorkoutStretches": [
    {
      "name": "Standing Quad Stretch",
      "timerSeconds": 45,
      "videoUrl": "https://example.com/video",
      "tips": "Optional cue"
    }
  ],
  "cardio": {
    "type": "Treadmill",
    "duration": "10 minutes",
    "intensity": "Light",
    "tips": "Optional cue"
  }
}`}),(0,t.jsx)("div",{className:"text-zinc-500 text-xs mt-3",children:'Exercise and stretch names are matched case-insensitively and ignore punctuation (e.g. "Pull-Ups" and "pull ups" map to the same exercise).'})]}),(0,t.jsx)("button",{onClick:()=>e.push("/routines"),className:"w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",children:"Back to Routines"})]})})}e.s(["default",()=>o])}]);