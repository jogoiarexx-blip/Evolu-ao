const fs=require("fs");
const path=require("path");
const root=path.resolve(__dirname,"..");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const js=fs.readFileSync(path.join(root,"js/app.js"),"utf8");
const required=[
  "checkReminders();",
  "meal-cal-input",
  "EVOLUCAO_STORAGE_KEY",
  "hydrateState",
  "workout-detail-modal",
  "measure-chart",
  "cfg-sex",
  "cfg-manual-nutrition","cfg-sex","cfg-training-priority","applyProfileWorkoutPreset"
];
let failed=[];
for(const item of required){
  if(!html.includes(item)&&!js.includes(item))failed.push(item);
}
if(js.includes("checkReminder();"))failed.push("legacy checkReminder()");
if(js.includes("parseFloat(document.getElementById('meal-name-input').value)"))failed.push("nutrition calories reads name");
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
const dup=ids.filter((x,i)=>ids.indexOf(x)!==i);
if(dup.length)failed.push("duplicate ids: "+[...new Set(dup)].join(","));
if(failed.length){console.error("SMOKE FAIL",failed);process.exit(1);}
console.log("SMOKE OK");
