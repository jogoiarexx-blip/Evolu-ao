(function(global){
  "use strict";
  function migrate(data,targetVersion){
    var d=data&&typeof data==="object"?data:{};
    var v=Number(d.schemaVersion||1);
    if(v<2){
      if(d.goalType!=="massa"&&d.goalType!=="emagrecer") d.goalType="emagrecer";
      if(!d.workoutSplit) d.workoutSplit="ABC";
      v=2;
    }
    if(v<3){
      d.workoutSessions=Array.isArray(d.workoutSessions)?d.workoutSessions:[];
      d.personalRecords=d.personalRecords&&typeof d.personalRecords==="object"?d.personalRecords:{};
      d.measurements=Array.isArray(d.measurements)?d.measurements:[];
      d.profileComplete=!!(d.profileComplete||(d.name&&d.age&&d.heightCm));
      v=3;
    }
    if(v<4){
      d.customPlanNames=d.customPlanNames&&typeof d.customPlanNames==="object"?d.customPlanNames:{};
      d.customWorkoutDays=Array.isArray(d.customWorkoutDays)&&d.customWorkoutDays.length?d.customWorkoutDays:["X1","X2","X3"];
      d.manualNutritionTargets=!!d.manualNutritionTargets;
      d.manualCalories=Number(d.manualCalories)||null;
      d.manualProtein=Number(d.manualProtein)||null;
      d.manualCarbs=d.manualCarbs==null?null:Number(d.manualCarbs);
      d.manualFat=d.manualFat==null?null:Number(d.manualFat);
      v=4;
    }
    d.schemaVersion=targetVersion||v;
    return d;
  }
  global.EvolucaoMigrations={migrate:migrate};
})(window);
