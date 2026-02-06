module.exports=[56704,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},36313,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored.contexts.HooksClientContext},18341,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored.contexts.ServerInsertedHtml},4655,a=>{"use strict";var b=a.i(87924);function c({children:a,className:c="",paddingClassName:d,borderClassName:e="border-zinc-700",borderWidthClassName:f="border-2"}){return(0,b.jsx)("div",{className:`bg-zinc-800 rounded-lg ${f} ${e} ${d||"p-4"} ${c}`.trim(),children:a})}function d({message:a,description:c,className:d=""}){return(0,b.jsxs)("div",{className:`text-zinc-500 text-center py-4 bg-zinc-800 rounded-lg ${d}`.trim(),children:[(0,b.jsx)("div",{children:a}),c&&(0,b.jsx)("div",{className:"text-zinc-600 text-sm mt-1",children:c})]})}function e({children:a,maxWidthClassName:c="max-w-2xl",className:d=""}){return(0,b.jsx)("div",{className:`fixed bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800 ${d}`.trim(),children:(0,b.jsx)("div",{className:`${c} mx-auto`,children:a})})}function f({icon:a,label:c,iconClassName:d="text-zinc-400",className:e=""}){return(0,b.jsxs)("h2",{className:`text-xl font-bold text-white mb-4 flex items-center gap-2 ${e}`.trim(),children:[(0,b.jsx)("span",{className:d,children:a}),c]})}a.s(["BottomActionBar",()=>e,"Card",()=>c,"EmptyState",()=>d,"SectionHeader",()=>f])},89994,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(50944),e=a.i(4655);function f(){let a=(0,d.useRouter)(),[f,g]=(0,c.useState)(!1),[h,i]=(0,c.useState)(null),[j,k]=(0,c.useState)(null),l=async b=>{let c=b.target.files?.[0];if(c){g(!0),i(null),k(null);try{let b=await c.text(),d=JSON.parse(b);if(!d.name||!d.exercises)throw Error('Invalid workout plan format. Must include "name" and "exercises" fields.');let e=await fetch("/api/routines/import",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({workoutPlan:d,fileName:c.name})});if(!e.ok){let a=await e.json();throw Error(a.error||"Failed to import routine")}await e.json(),k(`Successfully imported "${d.name}"!`),setTimeout(()=>{a.push("/routines")},2e3)}catch(a){console.error("Error importing routine:",a),i(a.message||"Failed to import routine. Please check the file format.")}finally{g(!1)}}};return(0,b.jsx)("div",{className:"min-h-screen bg-zinc-900 p-4",children:(0,b.jsxs)("div",{className:"max-w-2xl mx-auto py-8",children:[(0,b.jsx)("h1",{className:"text-3xl font-bold text-white mb-2",children:"Import Routine from JSON"}),(0,b.jsx)("p",{className:"text-zinc-400 mb-6",children:"Upload a workout plan JSON file to import it into your routines. Tell your LLM! This is the JSON format the importer expects."}),(0,b.jsxs)(e.Card,{paddingClassName:"p-6",borderClassName:"border-blue-600",className:"mb-6",children:[(0,b.jsxs)("label",{htmlFor:"file-upload",className:"block w-full cursor-pointer",children:[(0,b.jsxs)("div",{className:"border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors",children:[(0,b.jsx)("div",{className:"text-4xl mb-4",children:"📁"}),(0,b.jsx)("div",{className:"text-white font-semibold mb-2",children:"Click to select JSON file"}),(0,b.jsx)("div",{className:"text-zinc-400 text-sm",children:"Or drag and drop your workout plan JSON file here"})]}),(0,b.jsx)("input",{id:"file-upload",type:"file",accept:".json,application/json",onChange:l,disabled:f,className:"hidden"})]}),f&&(0,b.jsx)("div",{className:"mt-4 text-center text-blue-400",children:"Importing routine..."}),h&&(0,b.jsx)("div",{className:"mt-4 bg-red-900/50 border-2 border-red-500 text-red-200 px-4 py-3 rounded-lg",children:h}),j&&(0,b.jsx)("div",{className:"mt-4 bg-green-900/50 border-2 border-green-500 text-green-200 px-4 py-3 rounded-lg",children:j})]}),(0,b.jsxs)(e.Card,{paddingClassName:"p-6",className:"mb-6",children:[(0,b.jsx)("h2",{className:"text-xl font-bold text-white mb-3",children:"Expected JSON Format"}),(0,b.jsx)("div",{className:"text-zinc-400 text-sm mb-3",children:"This format is current for the database-backed importer. Your JSON file should follow this structure (optional fields are supported):"}),(0,b.jsx)("pre",{className:"bg-zinc-900 p-4 rounded-lg text-xs text-zinc-300 overflow-x-auto",children:`{
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
}`}),(0,b.jsx)("div",{className:"text-zinc-500 text-xs mt-3",children:'Exercise and stretch names are matched case-insensitively and ignore punctuation (e.g. "Pull-Ups" and "pull ups" map to the same exercise).'})]}),(0,b.jsx)("button",{onClick:()=>a.push("/routines"),className:"w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors",children:"Back to Routines"})]})})}a.s(["default",()=>f])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__ef611924._.js.map