(function(){
  "use strict";

  /* ============================================================
     CONFIGURAÇÃO
  ============================================================ */
  var STORAGE_KEY = "constancia_data_v1";
  var EVOLUCAO_SCHEMA_VERSION=5;
  var EVOLUCAO_STORAGE_KEY="evolucao_data_v1";
  var WORKOUT_SPLITS={ABC:["A","B","C"],AB:["A","B"],ABCD:["A","B","C","D"],FULL:["FULL"],UL:["UPPER","LOWER"],PPL:["PUSH","PULL","LEGS"],CUSTOM:["X1","X2","X3"]};

  var BASE_MINUTES = [10, 12, 15, 20]; // níveis 1-4, depois +5 por nível até o teto configurável
  var LEVEL_NAMES = { 1:"Primeiro Passo", 2:"Persistente", 3:"Determinado", 4:"Inabalável", 5:"Constante", 6:"Disciplina", 7:"Transformação" };
  var LEVEL_EMOJI = { 1:"🐾", 2:"💪", 3:"🎯", 4:"🗿", 5:"🔥", 6:"🧭", 7:"👑" };
  var GOAL_LABELS = { emagrecer:"Emagrecer", massa:"Ganhar massa muscular" };
  var QUOTES = [
    "Seu corpo. Seus hábitos. Sua evolução.",
    "Hoje só existem 20 minutos.",
    "Você não precisa vencer o mês. Apenas hoje.",
    "Um treino pequeno ainda é um treino.",
    "Seu eu do futuro agradece.",
    "Nunca faça zero.",
    "Evolução vence perfeição.",
    "As pessoas mudam pela repetição, não pela perfeição.",
    "Você não compete com ninguém.",
    "Cada missão é um voto na pessoa que você quer se tornar.",
    "O sucesso é aparecer todos os dias.",
    "Descansar é permitido. Desistir, não.",
    "Ninguém vê o dia 1. Todo mundo vê o dia 100.",
    "Não é sobre motivação. É sobre hábito.",
    "Uma missão de cada vez. Um dia de cada vez."
  ];

  /* Valores médios por porção. Marcas e preparos podem variar. */
  var FOOD_CATALOG = [
    {name:"Maçã",portion:"1 unidade média (130 g)",calories:72,protein:0.3,carbs:19,fat:0.2,keys:"maca fruta"},
    {name:"Banana",portion:"1 unidade média (90 g)",calories:80,protein:1.1,carbs:21,fat:0.2,keys:"banana fruta"},
    {name:"Mamão",portion:"1/2 unidade pequena (150 g)",calories:60,protein:0.8,carbs:15,fat:0.2,keys:"mamao fruta"},
    {name:"Laranja",portion:"1 unidade média (130 g)",calories:62,protein:1.2,carbs:15.4,fat:0.2,keys:"laranja fruta"},
    {name:"Ovo cozido",portion:"1 unidade (50 g)",calories:78,protein:6.3,carbs:0.6,fat:5.3,keys:"ovo cozido"},
    {name:"Ovo frito",portion:"1 unidade (50 g)",calories:105,protein:6.4,carbs:0.4,fat:8.3,keys:"ovo frito"},
    {name:"Ovo mexido",portion:"1 unidade preparada",calories:95,protein:6.5,carbs:0.6,fat:7.3,keys:"ovo mexido"},
    {name:"Café sem açúcar",portion:"1 xícara (100 ml)",calories:2,protein:0.1,carbs:0,fat:0,keys:"cafe preto sem acucar bebida"},
    {name:"Café com açúcar",portion:"1 xícara + 10 g de açúcar",calories:42,protein:0.1,carbs:10,fat:0,keys:"cafe preto com acucar bebida"},
    {name:"Café com leite sem açúcar",portion:"1 xícara (150 ml)",calories:61,protein:3.2,carbs:4.8,fat:3.3,keys:"cafe leite sem acucar bebida"},
    {name:"Leite integral",portion:"1 copo (200 ml)",calories:122,protein:6.4,carbs:9.4,fat:6.6,keys:"leite integral bebida"},
    {name:"Leite desnatado",portion:"1 copo (200 ml)",calories:70,protein:6.8,carbs:10,fat:0.2,keys:"leite desnatado bebida"},
    {name:"Refrigerante comum",portion:"1 copo (200 ml)",calories:84,protein:0,carbs:21,fat:0,keys:"refrigerante normal cola guarana bebida"},
    {name:"Refrigerante zero",portion:"1 copo (200 ml)",calories:0,protein:0,carbs:0,fat:0,keys:"refrigerante diet zero cola guarana bebida"},
    {name:"Arroz branco cozido",portion:"4 colheres de sopa (100 g)",calories:128,protein:2.5,carbs:28.1,fat:0.2,keys:"arroz branco cozido"},
    {name:"Arroz integral cozido",portion:"4 colheres de sopa (100 g)",calories:124,protein:2.6,carbs:25.8,fat:1,keys:"arroz integral cozido"},
    {name:"Feijão carioca cozido",portion:"1 concha média (100 g)",calories:76,protein:4.8,carbs:13.6,fat:0.5,keys:"feijao carioca cozido"},
    {name:"Feijão preto cozido",portion:"1 concha média (100 g)",calories:77,protein:4.5,carbs:14,fat:0.5,keys:"feijao preto cozido"},
    {name:"Macarrão cozido",portion:"1 pegador (100 g)",calories:157,protein:5.8,carbs:30.9,fat:0.9,keys:"macarrao massa cozido"},
    {name:"Batata inglesa cozida",portion:"1 unidade média (100 g)",calories:87,protein:1.9,carbs:20.1,fat:0.1,keys:"batata inglesa cozida"},
    {name:"Pão francês",portion:"1 unidade (50 g)",calories:140,protein:4.5,carbs:28.5,fat:1.5,keys:"pao frances cafe manha"},
    {name:"Peito de frango grelhado",portion:"1 filé (100 g)",calories:165,protein:31,carbs:0,fat:3.6,keys:"frango peito grelhado carne"},
    {name:"Carne bovina grelhada",portion:"1 bife médio (100 g)",calories:219,protein:30,carbs:0,fat:10.5,keys:"carne boi bovina bife grelhado vaca"},
    {name:"Carne moída bovina",portion:"1 porção (100 g)",calories:212,protein:26,carbs:0,fat:11.8,keys:"carne moida boi bovina vaca"},
    {name:"Lombo suíno assado",portion:"1 porção (100 g)",calories:210,protein:29,carbs:0,fat:9.5,keys:"carne porco suina lombo assado"},
    {name:"Bisteca suína grelhada",portion:"1 unidade pequena (100 g)",calories:247,protein:27,carbs:0,fat:15,keys:"carne porco suina bisteca grelhada"},
    {name:"Peixe grelhado",portion:"1 filé (100 g)",calories:128,protein:26,carbs:0,fat:2.7,keys:"peixe tilapia grelhado carne"},
    {name:"Queijo muçarela",portion:"1 fatia (20 g)",calories:64,protein:4.5,carbs:0.6,fat:4.9,keys:"queijo mussarela mucarela"},
    {name:"Aveia em flocos",portion:"2 colheres de sopa (30 g)",calories:118,protein:4.2,carbs:20,fat:2.4,keys:"aveia cereal"},
    {name:"Iogurte natural integral",portion:"1 pote (170 g)",calories:104,protein:6,carbs:8,fat:5.5,keys:"iogurte natural integral leite"}
  ];

  var dowNames = ["dom","seg","ter","qua","qui","sex","sáb"];
  var monthNames = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

  /* ============================================================
     UTIL - DATAS
  ============================================================ */
  function pad(n){ return n < 10 ? "0"+n : ""+n; }
  function dateStr(d){ return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
  function todayStr(){ return dateStr(new Date()); }
  function parseDateStr(s){ var p = s.split("-"); return new Date(parseInt(p[0],10), parseInt(p[1],10)-1, parseInt(p[2],10), 12,0,0); }
  function diffDays(a,b){ return Math.round((parseDateStr(b) - parseDateStr(a)) / 86400000); }

  /* ============================================================
     ESTADO
  ============================================================ */
  var defaultState = {
    onboarded: false, profileComplete:false,
    name: "", age: null, sex: "F", heightCm: null, trainingPriority:"geral",
    goalType: "emagrecer",
    schemaVersion: EVOLUCAO_SCHEMA_VERSION,
    workoutSplit: "ABC",
    customWorkoutDays:["X1","X2","X3"], customPlanNames:{X1:"Dia 1",X2:"Dia 2",X3:"Dia 3"},
    weightStart: null, weightGoal: null, weightCurrent: null,
    weightHistory: [],
    maxMinutesCap: 40,
    waterTargetMl: 2000,
    level: 1, levelDayCount: 0, streak: 0, bestStreak: 0, totalXP: 0,
    totalDaysCompleted: 0, totalMinCaminhada: 0, totalAguaLitros: 0,
    persistenciaUsedInPhase: false,
    milestoneXPAwarded: [],
    lastCompletionDate: null,
    installDate: todayStr(),
    history: {},
    todayChecks: { date: todayStr(), caminhada:false, agua:false, aguaCups:0, persistMode:false },
    lastQuoteIndex: -1,
    seenBreakBanner: null,
    reminderTime: "19:00", reminderEnabled:false, reminderNotifiedDate: null,
    nutritionReminderTime:"13:00", nutritionReminderEnabled:false, nutritionReminderNotifiedDate:null,
    waterReminderTime:"08:00", waterReminderEnabled:false, waterReminderNotifiedDate:null,
    smartReminderIntervalMin:60, quietHoursEnabled:true, quietStart:"22:00", quietEnd:"07:00",
    workoutReminderEnabled:false, workoutReminderTime:"18:00", stepsReminderEnabled:false, stepsReminderTime:"19:30", sleepReminderEnabled:false, sleepReminderTime:"21:30",
    reminderLog:{}, reminderLastValues:{},
    pushEnabled:false, pushLastSync:0,
    weeklyWorkoutTarget:4, weeklyProteinDaysTarget:5, weeklyWeighinsTarget:3,
    smartAlertsEnabled:false, smartAlertTime:"18:30", smartAlertNotifiedDate:null,
    activityLevel: "moderado", proteinTargetG: null, calorieTarget: null, stepsTarget: 8000, sleepTargetH: 8,
    manualNutritionTargets:false, manualCalories:null, manualProtein:null, manualCarbs:null, manualFat:null,
    todayHabits: { date: todayStr(), proteina:false, alimentacao:false, sono:false, treino:false, passos:false, stepsCount:0, sleepHours:0 },
    dailyNutrition: { date: todayStr(), calories:0, protein:0, carbs:0, fat:0 },
    workoutToday: { date: todayStr(), plan:"A", done:[] },
    measurements: [],
    nutritionHistory: {}, mealHistory: {}, workoutLoads: {}, workoutPerformance:{}, workoutHistory: {}, workoutSessions:[], personalRecords:{}, habitHistory:{}
  };

  var state = load();

  function migrateState(data){
    if(window.EvolucaoMigrations&&typeof window.EvolucaoMigrations.migrate==="function"){
      return window.EvolucaoMigrations.migrate(data,EVOLUCAO_SCHEMA_VERSION);
    }
    data=data&&typeof data==="object"?data:{};
    data.schemaVersion=EVOLUCAO_SCHEMA_VERSION;
    return data;
  }

  function hydrateState(parsed){
    parsed=migrateState(parsed);
    for(var k in defaultState){
      if(!(k in parsed)) parsed[k]=JSON.parse(JSON.stringify(defaultState[k]));
    }
    if(parsed.goalType!=="massa"&&parsed.goalType!=="emagrecer") parsed.goalType="emagrecer";
    if(!parsed.profileComplete&&parsed.name&&parsed.age&&parsed.heightCm) parsed.profileComplete=true;
    if(!parsed.trainingPriority) parsed.trainingPriority="geral";
    parsed.todayChecks=Object.assign({},defaultState.todayChecks,parsed.todayChecks||{});
    parsed.todayHabits=Object.assign({},defaultState.todayHabits,parsed.todayHabits||{});
    parsed.workoutPerformance=parsed.workoutPerformance||{};
    parsed.habitHistory=parsed.habitHistory||{};
    parsed.workoutSessions=Array.isArray(parsed.workoutSessions)?parsed.workoutSessions:[];
    parsed.personalRecords=parsed.personalRecords||{};
    parsed.measurements=Array.isArray(parsed.measurements)?parsed.measurements:[];
    parsed.customPlanNames=parsed.customPlanNames||{};
    parsed.customWorkoutDays=Array.isArray(parsed.customWorkoutDays)&&parsed.customWorkoutDays.length?parsed.customWorkoutDays:["X1","X2","X3"];
    if(!parsed.stepsTarget||parsed.stepsTarget<1000) parsed.stepsTarget=parsed.goalType==="massa"?6500:8000;
    if(!parsed.sleepTargetH) parsed.sleepTargetH=8;
    return parsed;
  }

  function load(){
    try{
      var raw=localStorage.getItem(EVOLUCAO_STORAGE_KEY)||localStorage.getItem(STORAGE_KEY);
      if(!raw) return JSON.parse(JSON.stringify(defaultState));
      var parsed=hydrateState(JSON.parse(raw));
      try{
        var payload=JSON.stringify(parsed);
        localStorage.setItem(EVOLUCAO_STORAGE_KEY,payload);
        localStorage.setItem(STORAGE_KEY,payload);
      }catch(_e){}
      return parsed;
    }catch(e){
      return JSON.parse(JSON.stringify(defaultState));
    }
  }
  function save(){ try{ var p=JSON.stringify(state); localStorage.setItem(STORAGE_KEY,p); localStorage.setItem(EVOLUCAO_STORAGE_KEY,p); schedulePushSync(); }catch(e){} }

  /* ============================================================
     LÓGICA DE NEGÓCIO
  ============================================================ */
  function currentTargetMinutes(){
    var lvl = state.level, val;
    if(lvl <= 4) val = BASE_MINUTES[lvl-1];
    else val = 20 + (lvl-4)*5;
    return Math.min(val, state.maxMinutesCap);
  }
  function levelName(lvl){ return LEVEL_NAMES[lvl] || ("Lenda " + (lvl-7)); }
  function levelEmoji(lvl){ return LEVEL_EMOJI[lvl] || "👑"; }

  function calcBodyTargets(){
    var w = Number(state.weightCurrent || state.weightStart || 70);
    var h = Number(state.heightCm || 170);
    var a = Number(state.age || 30);
    var sexAdj = state.sex === "M" ? 5 : (state.sex === "F" ? -161 : -78);
    var bmr = 10*w + 6.25*h - 5*a + sexAdj;
    var factors={sedentario:1.2,leve:1.375,moderado:1.55,alto:1.725};
    var factor = factors[state.activityLevel] || 1.55;
    var maintenance = Math.round(bmr * factor);
    var isMass = state.goalType === "massa";
    var calories = Math.round((maintenance + (isMass ? 200 : -400))/50)*50;
    calories = Math.max(1200, calories);
    var protein = Math.round(w * (isMass ? 1.8 : 1.7));
    var steps = Math.max(1000, Number(state.stepsTarget || (isMass ? 6500 : 8000)));
    state.calorieTarget = calories; state.proteinTargetG = protein;
    var fat=Math.round((calories*0.25)/9);
    var carbs=Math.max(0,Math.round((calories - protein*4 - fat*9)/4));
    if(state.manualNutritionTargets){
      calories=Math.max(1000,Number(state.manualCalories)||calories);
      protein=Math.max(30,Number(state.manualProtein)||protein);
      carbs=Math.max(0,Number(state.manualCarbs)!=null?Number(state.manualCarbs):carbs);
      fat=Math.max(0,Number(state.manualFat)!=null?Number(state.manualFat):fat);
    }
    return {calories:calories, protein:protein, carbs:carbs, fat:fat, steps:steps, sleep:Number(state.sleepTargetH||8), maintenance:maintenance};
  }
  function toggleHabit(key){
    if(isTodayCompleted()) return;
    if(!state.todayHabits || state.todayHabits.date !== todayStr()) state.todayHabits={date:todayStr(),proteina:false,alimentacao:false,sono:false,treino:false,passos:false,stepsCount:0,sleepHours:0};
    state.todayHabits[key]=!state.todayHabits[key]; save(); renderInicio();
  }
  function goalDirection(){ return state.weightGoal >= state.weightStart ? 1 : -1; }
  function journeyPct(){
    var start = state.weightStart, goal = state.weightGoal, cur = state.weightCurrent;
    var span = (goal - start) * goalDirection();
    if(span <= 0) return 100;
    var progressed = (cur - start) * goalDirection();
    return Math.max(0, Math.min(100, Math.round((progressed/span)*100)));
  }
  function remainingToGoal(){
    return Math.round(Math.abs(state.weightGoal - state.weightCurrent) * 10) / 10;
  }
  function weightChangedSoFar(){
    return Math.round(Math.abs(state.weightCurrent - state.weightStart) * 10) / 10;
  }

  function checkForBrokenStreak(){
    var t = todayStr();
    if(!state.lastCompletionDate) return;
    var gap = diffDays(state.lastCompletionDate, t);
    if(gap >= 2){
      state.streak = 0;
      state.levelDayCount = 0;
      state.persistenciaUsedInPhase = false;
      if(state.seenBreakBanner !== t){ pendingBreakBanner = true; state.seenBreakBanner = t; }
      save();
    }
  }
  var pendingBreakBanner = false;

  function ensureTodayChecksFresh(){
    var t = todayStr();
    if(state.todayChecks.date !== t){
      state.todayChecks = { date: t, caminhada:false, agua:false, aguaCups:0, persistMode:false };
      state.todayHabits = { date:t, proteina:false, alimentacao:false, sono:false, treino:false, passos:false, stepsCount:0, sleepHours:0 };
      save();
    }
  }
  function isTodayCompleted(){ var h = state.history[todayStr()]; return !!(h && h.completed); }

  function toggleTask(taskKey){
    if(isTodayCompleted()) return;
    state.todayChecks[taskKey] = !state.todayChecks[taskKey];
    save(); renderInicio();
  }

  var WATER_CUP_ML = 250;
  function waterCupsGoal(){ return Math.max(1, Math.round(state.waterTargetMl / WATER_CUP_ML)); }
  function tapCup(index){
    if(isTodayCompleted()) return;
    var current = state.todayChecks.aguaCups || 0;
    state.todayChecks.aguaCups = (index < current) ? index : index + 1;
    state.todayChecks.agua = state.todayChecks.aguaCups >= waterCupsGoal();
    save(); renderInicio();
  }

  function activatePersistMode(){
    if(state.persistenciaUsedInPhase || isTodayCompleted()) return;
    state.persistenciaUsedInPhase = true;
    state.todayChecks.persistMode = true;
    save(); renderInicio();
    showToast("Modo Persistência ativado — 5 minutos já contam hoje.");
  }

  function allChecked(){
    var c = state.todayChecks, h = state.todayHabits || {};
    if(c.persistMode) return (c.caminhada || h.treino) && c.agua && h.proteina;
    if(state.goalType === "massa") return h.treino && c.agua && h.proteina && h.alimentacao && h.sono;
    return c.caminhada && c.agua && h.proteina && h.alimentacao && h.sono && h.passos;
  }

  function awardXP(amount){ state.totalXP += amount; }

  function completeMission(){
    if(!allChecked() || isTodayCompleted()) return;
    var t = todayStr();
    var checks = state.todayChecks;
    var target = currentTargetMinutes();
    var persistMode = checks.persistMode;
    var activityMin = persistMode ? 5 : target;

    var minCaminhada = checks.caminhada ? activityMin : 0;
    state.totalMinCaminhada += minCaminhada;
    state.totalAguaLitros += state.waterTargetMl / 1000;

    state.history[t] = { completed:true, caminhada:!!checks.caminhada, agua:true, habits:Object.assign({}, state.todayHabits||{}), nutrition:Object.assign({},state.dailyNutrition||{}), score:dailyScore(), goalType:state.goalType, target: target, level: state.level, persistMode: !!persistMode }; state.habitHistory[t]=Object.assign({},state.todayHabits||{});
    state.lastCompletionDate = t;
    state.streak += 1;
    if(state.streak > state.bestStreak) state.bestStreak = state.streak;
    state.levelDayCount += 1;
    state.totalDaysCompleted += 1;

    if(checks.caminhada) awardXP(50);
    awardXP(30); // água
    var hb=state.todayHabits||{}; ["proteina","alimentacao","sono","treino","passos"].forEach(function(k){ if(hb[k]) awardXP(20); });

    [30,60,90,180,365].forEach(function(threshold){
      if(state.streak >= threshold && state.milestoneXPAwarded.indexOf(threshold) === -1){
        state.milestoneXPAwarded.push(threshold);
        awardXP(1000);
      }
    });

    var leveledUp = false, finishedLevel = state.level;
    if(state.levelDayCount >= 7){
      state.level += 1;
      state.levelDayCount = 0;
      state.persistenciaUsedInPhase = false;
      awardXP(500);
      leveledUp = true;
    }
    save();

    fireConfetti();
    fireVibration(leveledUp ? [80,40,80,40,160] : [60,30,60]);
    playSound(leveledUp);

    if(leveledUp) showLevelUpModal(finishedLevel + 1);
    else showToast(pickQuote());

    renderInicio(); renderCalendario(); renderMedalhas(); renderStats();
  }

  function pickQuote(){
    var idx;
    do{ idx = Math.floor(Math.random()*QUOTES.length); } while(idx === state.lastQuoteIndex && QUOTES.length>1);
    state.lastQuoteIndex = idx; save();
    return QUOTES[idx];
  }

  function saveWeight(value){
    var t = todayStr();
    state.weightCurrent = value;
    var idx = -1;
    for(var i=0;i<state.weightHistory.length;i++){ if(state.weightHistory[i].date === t){ idx=i; break; } }
    if(idx >= 0) state.weightHistory[idx].weight = value; else state.weightHistory.push({date:t, weight:value});
    state.weightHistory.sort(function(a,b){ return a.date < b.date ? -1 : 1; });
    save();
    renderInicio(); renderPeso(); renderMedalhas(); renderStats();
    var reachedGoal = (goalDirection()>0 && value >= state.weightGoal) || (goalDirection()<0 && value <= state.weightGoal);
    if(reachedGoal){
      fireConfetti(); fireVibration([100,50,100,50,200]); playSound(true);
      showToast("🏆 Meta alcançada! Você chegou em " + state.weightGoal + " kg.");
    } else {
      showToast("Peso registrado: " + value + " kg");
    }
  }

  var DEFAULT_WORKOUTS = {
    A:[['Supino / máquina','3 x 8–12','a-supino',90],['Remada','3 x 8–12','a-remada',90],['Desenvolvimento','3 x 8–12','a-desenvolvimento',90],['Puxada alta','3 x 8–12','a-puxada',90],['Tríceps','2 x 10–15','a-triceps',60],['Bíceps','2 x 10–15','a-biceps',60]],
    B:[['Agachamento / leg press','3 x 8–12','b-agachamento',120],['Cadeira extensora','3 x 10–15','b-extensora',75],['Mesa flexora','3 x 10–15','b-flexora',75],['Panturrilha','3 x 12–20','b-panturrilha',60],['Abdômen','3 x 12–20','b-abdomen',45]],
    C:[['Supino inclinado','3 x 8–12','c-supino',90],['Remada baixa','3 x 8–12','c-remada',90],['Elevação lateral','3 x 12–15','c-lateral',60],['Leg press','3 x 10–15','c-legpress',120],['Posterior de coxa','3 x 10–15','c-posterior',75],['Prancha','3 x 30–60s','c-prancha',45]],
    D:[['Levantamento terra romeno','3 x 8–12','d-terra',120],['Puxada neutra','3 x 8–12','d-puxada',90],['Desenvolvimento máquina','3 x 8–12','d-desenvolvimento',90],['Afundo','3 x 10–12','d-afundo',90],['Rosca martelo','2 x 10–15','d-rosca',60],['Tríceps corda','2 x 10–15','d-triceps',60]],
    FULL:[['Agachamento / leg press','3 x 8–12','full-agachamento',120],['Supino / máquina','3 x 8–12','full-supino',90],['Remada','3 x 8–12','full-remada',90],['Desenvolvimento','2 x 8–12','full-desenvolvimento',75],['Posterior de coxa','2 x 10–15','full-posterior',75],['Abdômen','2 x 12–20','full-abdomen',45]],
    UPPER:[['Supino / máquina','3 x 8–12','upper-supino',90],['Remada','3 x 8–12','upper-remada',90],['Puxada alta','3 x 8–12','upper-puxada',90],['Desenvolvimento','3 x 8–12','upper-desenvolvimento',90],['Bíceps','2 x 10–15','upper-biceps',60],['Tríceps','2 x 10–15','upper-triceps',60]],
    LOWER:[['Agachamento / leg press','3 x 8–12','lower-agachamento',120],['Cadeira extensora','3 x 10–15','lower-extensora',75],['Mesa flexora','3 x 10–15','lower-flexora',75],['Terra romeno','3 x 8–12','lower-terra',120],['Panturrilha','3 x 12–20','lower-panturrilha',60]],
    PUSH:[['Supino reto','3 x 8–12','push-supino',90],['Supino inclinado','3 x 8–12','push-inclinado',90],['Desenvolvimento','3 x 8–12','push-desenvolvimento',90],['Elevação lateral','3 x 12–15','push-lateral',60],['Tríceps corda','3 x 10–15','push-triceps',60]],
    PULL:[['Puxada alta','3 x 8–12','pull-puxada',90],['Remada baixa','3 x 8–12','pull-remada',90],['Remada unilateral','3 x 10–12','pull-unilateral',90],['Face pull','3 x 12–15','pull-facepull',60],['Rosca direta','3 x 10–15','pull-rosca',60]],
    LEGS:[['Agachamento / leg press','3 x 8–12','legs-agachamento',120],['Cadeira extensora','3 x 10–15','legs-extensora',75],['Mesa flexora','3 x 10–15','legs-flexora',75],['Terra romeno','3 x 8–12','legs-terra',120],['Panturrilha','4 x 12–20','legs-panturrilha',60]],
    X1:[['Exercício 1','3 x 8–12','x1-1',90],['Exercício 2','3 x 8–12','x1-2',90]],
    X2:[['Exercício 1','3 x 8–12','x2-1',90],['Exercício 2','3 x 8–12','x2-2',90]],
    X3:[['Exercício 1','3 x 8–12','x3-1',90],['Exercício 2','3 x 8–12','x3-2',90]]

  };
  var FEMALE_WORKOUT_PRESETS = {
    geral:{
      A:[['Agachamento / leg press','3 x 8–12','f-geral-a1',120],['Hip thrust','4 x 8–12','f-geral-a2',120],['Cadeira extensora','3 x 10–15','f-geral-a3',75],['Mesa flexora','3 x 10–15','f-geral-a4',75],['Abdutora','3 x 12–20','f-geral-a5',60],['Panturrilha','3 x 12–20','f-geral-a6',60]],
      B:[['Puxada alta','3 x 8–12','f-geral-b1',90],['Remada baixa','3 x 8–12','f-geral-b2',90],['Desenvolvimento','3 x 8–12','f-geral-b3',90],['Elevação lateral','3 x 12–15','f-geral-b4',60],['Supino / máquina','2 x 8–12','f-geral-b5',90],['Bíceps','2 x 10–15','f-geral-b6',60],['Tríceps','2 x 10–15','f-geral-b7',60]],
      C:[['Terra romeno','3 x 8–12','f-geral-c1',120],['Afundo','3 x 10–12','f-geral-c2',90],['Hip thrust','3 x 10–12','f-geral-c3',120],['Mesa flexora','3 x 10–15','f-geral-c4',75],['Coice no cabo','3 x 12–15','f-geral-c5',60],['Abdutora','3 x 15–20','f-geral-c6',60],['Abdômen','3 x 12–20','f-geral-c7',45]]
    },
    gluteos:{
      A:[['Hip thrust','4 x 8–12','f-glut-a1',120],['Agachamento / leg press','4 x 8–12','f-glut-a2',120],['Afundo búlgaro','3 x 10–12','f-glut-a3',90],['Cadeira extensora','3 x 12–15','f-glut-a4',75],['Abdutora','4 x 15–20','f-glut-a5',60]],
      B:[['Puxada alta','3 x 8–12','f-glut-b1',90],['Remada','3 x 8–12','f-glut-b2',90],['Desenvolvimento','3 x 8–12','f-glut-b3',90],['Elevação lateral','3 x 12–15','f-glut-b4',60],['Tríceps','2 x 10–15','f-glut-b5',60],['Bíceps','2 x 10–15','f-glut-b6',60]],
      C:[['Terra romeno','4 x 8–12','f-glut-c1',120],['Hip thrust','4 x 8–12','f-glut-c2',120],['Mesa flexora','3 x 10–15','f-glut-c3',75],['Coice no cabo','3 x 12–15','f-glut-c4',60],['Abdutora','4 x 15–20','f-glut-c5',60],['Panturrilha','3 x 12–20','f-glut-c6',60]]
    },
    superiores:{
      A:[['Puxada alta','4 x 8–12','f-sup-a1',90],['Remada baixa','4 x 8–12','f-sup-a2',90],['Desenvolvimento','3 x 8–12','f-sup-a3',90],['Elevação lateral','4 x 12–15','f-sup-a4',60],['Bíceps','3 x 10–15','f-sup-a5',60]],
      B:[['Agachamento / leg press','3 x 8–12','f-sup-b1',120],['Hip thrust','3 x 8–12','f-sup-b2',120],['Mesa flexora','3 x 10–15','f-sup-b3',75],['Abdutora','3 x 15–20','f-sup-b4',60],['Panturrilha','3 x 12–20','f-sup-b5',60]],
      C:[['Supino / máquina','3 x 8–12','f-sup-c1',90],['Remada unilateral','3 x 8–12','f-sup-c2',90],['Desenvolvimento','3 x 8–12','f-sup-c3',90],['Elevação lateral','4 x 12–15','f-sup-c4',60],['Tríceps','3 x 10–15','f-sup-c5',60],['Bíceps','3 x 10–15','f-sup-c6',60]]
    },
    forca:{
      A:[['Agachamento','4 x 5–8','f-forca-a1',150],['Hip thrust','4 x 6–10','f-forca-a2',150],['Leg press','3 x 6–10','f-forca-a3',120],['Mesa flexora','3 x 8–12','f-forca-a4',90]],
      B:[['Puxada alta','4 x 6–10','f-forca-b1',120],['Remada','4 x 6–10','f-forca-b2',120],['Supino / máquina','3 x 6–10','f-forca-b3',120],['Desenvolvimento','3 x 6–10','f-forca-b4',120]],
      C:[['Terra romeno','4 x 6–10','f-forca-c1',150],['Afundo','3 x 8–10','f-forca-c2',120],['Hip thrust','3 x 6–10','f-forca-c3',150],['Abdutora','3 x 12–15','f-forca-c4',75]]
    }
  };
  var NEUTRAL_WORKOUT_PRESETS = {
    geral: DEFAULT_WORKOUTS
  };

  var WORKOUTS = JSON.parse(JSON.stringify(DEFAULT_WORKOUTS));
  function workoutExerciseId(plan,i){ var ex=(WORKOUTS[plan]||[])[i]||[]; return ex[2]||('legacy-'+plan+'-'+i); }
  function workoutPerfKey(plan,i){ return plan+'-'+workoutExerciseId(plan,i); }
  function getWorkoutPerf(plan,i){ var key=workoutPerfKey(plan,i), legacy=plan+'-'+i; return state.workoutPerformance[key]||state.workoutPerformance[legacy]||{}; }
  function cloneWorkoutPreset(src){
    return JSON.parse(JSON.stringify(src||{}));
  }
  function workoutPresetForProfile(){
    if(state.sex==="F"){
      return FEMALE_WORKOUT_PRESETS[state.trainingPriority]||FEMALE_WORKOUT_PRESETS.geral;
    }
    return DEFAULT_WORKOUTS;
  }
  function applyProfileWorkoutPreset(force){
    if(!force && state.workoutPresetApplied)return;
    var preset=workoutPresetForProfile();
    state.customWorkouts=cloneWorkoutPreset(DEFAULT_WORKOUTS);
    Object.keys(preset).forEach(function(k){state.customWorkouts[k]=cloneWorkoutPreset(preset[k]);});
    state.workoutSplit="ABC";
    state.workoutPresetApplied=true;
    state.workoutPresetSignature=(state.sex||"O")+"|"+(state.trainingPriority||"geral");
    WORKOUTS=state.customWorkouts;
  }

  function ensureV1Fresh(){
    var t=todayStr();
    state.nutritionHistory=state.nutritionHistory||{};
    state.mealHistory=state.mealHistory||{};
    state.workoutLoads=state.workoutLoads||{};
    state.workoutPerformance=state.workoutPerformance||{};
    state.workoutHistory=state.workoutHistory||{};
    state.workoutSessions=Array.isArray(state.workoutSessions)?state.workoutSessions:[];
    state.personalRecords=state.personalRecords&&typeof state.personalRecords==="object"?state.personalRecords:{};
    state.workoutSeries=state.workoutSeries||{};
    state.habitHistory=state.habitHistory||{};
    state.workoutSplit=WORKOUT_SPLITS[state.workoutSplit]?state.workoutSplit:"ABC";
    if(!state.customWorkouts) state.customWorkouts=JSON.parse(JSON.stringify(DEFAULT_WORKOUTS));
    Object.keys(DEFAULT_WORKOUTS).forEach(function(pl){
      if(!Array.isArray(state.customWorkouts[pl])) state.customWorkouts[pl]=JSON.parse(JSON.stringify(DEFAULT_WORKOUTS[pl]));
      state.customWorkouts[pl].forEach(function(ex,idx){
        if(!ex[2]) ex[2]='custom-'+pl+'-'+Date.now().toString(36)+'-'+idx+'-'+Math.random().toString(36).slice(2,6);
        if(!ex[3]) ex[3]=90;
      });
    });
    WORKOUTS=state.customWorkouts;
    var active=splitLabels();
    if(!state.dailyNutrition||state.dailyNutrition.date!==t){
      var saved=state.nutritionHistory[t]||{calories:0,protein:0};
      state.dailyNutrition={date:t,calories:saved.calories||0,protein:saved.protein||0,carbs:saved.carbs||0,fat:saved.fat||0};
    }
    if(!Array.isArray(state.mealHistory[t])) state.mealHistory[t]=[];
    if(!state.workoutToday||state.workoutToday.date!==t){
      state.workoutToday={date:t,plan:active[0],doneByPlan:{}};
    }
    state.workoutToday.doneByPlan=state.workoutToday.doneByPlan||{};
    state.workoutToday.finalizedByPlan=state.workoutToday.finalizedByPlan||{};
    active.forEach(function(pl){ if(!Array.isArray(state.workoutToday.doneByPlan[pl])) state.workoutToday.doneByPlan[pl]=[]; });
    if(active.indexOf(state.workoutToday.plan)===-1) state.workoutToday.plan=active[0];
    if(!Array.isArray(state.measurements)) state.measurements=[];
  }
  function saveNutritionDay(){
    ensureV1Fresh(); state.nutritionHistory[todayStr()]={calories:state.dailyNutrition.calories||0,protein:state.dailyNutrition.protein||0,carbs:state.dailyNutrition.carbs||0,fat:state.dailyNutrition.fat||0};
  }
  function updateAutoNutritionHabits(){
    ensureV1Fresh();
    var bt=calcBodyTargets(), cal=Number(state.dailyNutrition.calories||0), pro=Number(state.dailyNutrition.protein||0);
    state.todayHabits.proteina = pro>=bt.protein;
    state.todayHabits.alimentacao = cal>=Math.round(bt.calories*.85) && cal<=Math.round(bt.calories*1.15);
    state.todayHabits.passos = Number(state.todayHabits.stepsCount||0) >= bt.steps;
    state.todayHabits.sono = Number(state.todayHabits.sleepHours||0) >= bt.sleep;
  }
  function isAnyWorkoutCompleteToday(){
    ensureV1Fresh(); var db=state.workoutToday.doneByPlan||{};
    return splitLabels().some(function(pl){return (db[pl]||[]).length>=Math.max(1,(WORKOUTS[pl]||[]).length);});
  }
  function dailyScore(){
    ensureV1Fresh(); updateAutoNutritionHabits();
    var h=state.todayHabits||{}, c=state.todayChecks||{}, plan=state.workoutToday.plan||'A';
    var done=(state.workoutToday.doneByPlan&&state.workoutToday.doneByPlan[plan])||[];
    var workoutDone=h.treino || isAnyWorkoutCompleteToday();
    var points=0;
    if(state.goalType==='massa'){
      if(c.agua) points+=15; if(h.proteina) points+=20; if(h.alimentacao) points+=15; if(h.sono) points+=15; if(workoutDone) points+=35;
    }else{
      if(c.agua) points+=15; if(h.proteina) points+=20; if(h.alimentacao) points+=20; if(h.sono) points+=15; if(h.passos) points+=15; if(c.caminhada||workoutDone) points+=15;
    }
    return Math.min(100,points);
  }
  function renderV1Dashboard(){
    ensureV1Fresh();
    var bt=calcBodyTargets(), score=dailyScore();
    var deg=Math.round(score*3.6);
    document.getElementById('daily-score').textContent=score;
    document.getElementById('score-ring').style.background='conic-gradient(var(--teal) '+deg+'deg, rgba(255,255,255,.06) '+deg+'deg)';
    document.getElementById('score-progress').style.width=score+'%';
    document.getElementById('score-title').textContent=score>=85?'Dia excelente':score>=60?'Boa evolução':score>=30?'Você está construindo o dia':'Comece pelo mais fácil';
    document.getElementById('score-desc').textContent=score>=85?'Você cumpriu quase tudo. Consistência assim gera resultado.':score>=60?'Mais um ou dois hábitos e seu dia fica muito forte.':'Não precisa fazer tudo de uma vez. Some pequenas vitórias.';
    document.getElementById('calories-today').textContent=state.dailyNutrition.calories||0;
    document.getElementById('protein-today').textContent=state.dailyNutrition.protein||0;
    document.getElementById('calories-goal-mini').textContent=bt.calories+' kcal';
    document.getElementById('protein-goal-mini').textContent=bt.protein+' g';
    var si=document.getElementById('steps-input'), sli=document.getElementById('sleep-input');
    if(si && document.activeElement!==si) si.value=state.todayHabits.stepsCount||''; if(sli && document.activeElement!==sli) sli.value=state.todayHabits.sleepHours||'';
    var sgi=document.getElementById('steps-goal-inline'), shg=document.getElementById('sleep-goal-inline'); if(sgi)sgi.textContent=bt.steps; if(shg)shg.textContent=bt.sleep+'h';
    updateAutoNutritionHabits(); renderNutritionSelectedDay(); renderMealHistory(); renderNutritionWeek();
    var hr=document.getElementById('home-remaining'); if(hr) hr.textContent=(remainingToGoal()!=null?remainingToGoal():'--')+' kg';
    var hs=document.getElementById('home-streak'); if(hs) hs.textContent=(state.streak||0)+' '+((state.streak||0)===1?'dia':'dias');
    var ps=document.getElementById('plan-summary'); if(ps) ps.textContent=bt.calories+' kcal · '+bt.protein+' g proteína · '+bt.steps+' passos · '+bt.sleep+' h sono';
    var pf=document.getElementById('plan-focus'); if(pf) pf.textContent=state.goalType==='massa'?'CONSTRUIR':'REDUZIR';
    renderWorkout();
  }
  function workoutSetCount(desc){
    var m=String(desc||'').match(/(\d+)\s*x/i); return m?Math.max(1,parseInt(m[1],10)):3;
  }
  function workoutSeriesFor(plan,i){
    ensureV1Fresh(); var t=todayStr(); state.workoutSeries[t]=state.workoutSeries[t]||{}; state.workoutSeries[t][plan]=state.workoutSeries[t][plan]||{};
    var key=String(i), need=workoutSetCount((WORKOUTS[plan][i]||[])[1]);
    if(!Array.isArray(state.workoutSeries[t][plan][key])){
      var perf=getWorkoutPerf(plan,i), arr=[];
      for(var n=0;n<need;n++) arr.push({load:perf.load!=null?perf.load:'',reps:perf.reps!=null?perf.reps:'',done:false});
      state.workoutSeries[t][plan][key]=arr;
    }
    while(state.workoutSeries[t][plan][key].length<need) state.workoutSeries[t][plan][key].push({load:'',reps:'',done:false});
    return state.workoutSeries[t][plan][key];
  }
  function syncWorkoutCompletion(plan){
    var done=[];
    (WORKOUTS[plan]||[]).forEach(function(ex,i){var a=workoutSeriesFor(plan,i);if(a.length&&a.every(function(x){return !!x.done;}))done.push(i);});
    state.workoutToday.doneByPlan[plan]=done; state.todayHabits.treino=isAnyWorkoutCompleteToday();
    var t=todayStr(); state.workoutHistory[t]=state.workoutHistory[t]||{plans:{}};state.workoutHistory[t].plans=state.workoutHistory[t].plans||{};
    var setsDone=0,totalSets=0,volume=0; (WORKOUTS[plan]||[]).forEach(function(ex,i){workoutSeriesFor(plan,i).forEach(function(x){totalSets++;if(x.done){setsDone++;volume+=(Number(x.load)||0)*(Number(x.reps)||0);}});});
    state.workoutHistory[t].plans[plan]={done:done.length,total:WORKOUTS[plan].length,completed:done.length===WORKOUTS[plan].length,setsDone:setsDone,totalSets:totalSets,volume:Math.round(volume)};
    state.workoutHistory[t].completed=Object.keys(state.workoutHistory[t].plans).some(function(k){return state.workoutHistory[t].plans[k].completed;});
  }
  
  function splitLabels(){ return (WORKOUT_SPLITS[state.workoutSplit]||WORKOUT_SPLITS.ABC).slice(); }
  function planDisplayName(plan){
    var names={A:"Treino A",B:"Treino B",C:"Treino C",D:"Treino D",FULL:"Full Body",UPPER:"Upper",LOWER:"Lower",PUSH:"Push",PULL:"Pull",LEGS:"Legs"};
    return (state.customPlanNames&&state.customPlanNames[plan])||names[plan]||plan;
  }
  function ensureWorkoutSplitData(){
    if(!state.customWorkouts) state.customWorkouts=JSON.parse(JSON.stringify(DEFAULT_WORKOUTS));
    splitLabels().forEach(function(k){
      if(!Array.isArray(state.customWorkouts[k])) state.customWorkouts[k]=JSON.parse(JSON.stringify(DEFAULT_WORKOUTS[k]||[]));
    });
    WORKOUTS=state.customWorkouts;
    if(!state.workoutToday) state.workoutToday={date:todayStr(),plan:splitLabels()[0],doneByPlan:{}};
    if(splitLabels().indexOf(state.workoutToday.plan)===-1) state.workoutToday.plan=splitLabels()[0];
  }
  function renderWorkoutTabs(){
    var box=document.getElementById("workout-tabs"); if(!box)return;
    box.innerHTML="";
    splitLabels().forEach(function(pl){
      var b=document.createElement("button");
      b.className="workout-tab"+(state.workoutToday.plan===pl?" active":"");
      b.type="button"; b.setAttribute("data-workout",pl); b.textContent=planDisplayName(pl);
      b.addEventListener("click",function(){
        ensureV1Fresh(); state.workoutToday.plan=pl; state.todayHabits.treino=isAnyWorkoutCompleteToday();
        save(); renderWorkout(); renderV1Dashboard(); renderInicio();
      });
      box.appendChild(b);
    });
  }
  function setWorkoutSplit(v){
    if(!WORKOUT_SPLITS[v])return;
    state.workoutSplit=v; ensureWorkoutSplitData();
    state.workoutToday.plan=splitLabels()[0];
    save(); renderWorkout(); renderV1Dashboard(); renderInicio();
    showToast("Divisão alterada sem apagar seu histórico.");
  }
  function targetRepRange(desc){
    var s=String(desc||"");
    var m=s.match(/x\s*(\d+)\s*[–-]\s*(\d+)/i);
    if(m)return {min:Number(m[1]),max:Number(m[2])};
    m=s.match(/x\s*(\d+)/i); return m?{min:Number(m[1]),max:Number(m[1])}:null;
  }
  function progressionSuggestion(plan,i){
    var ex=(WORKOUTS[plan]||[])[i];if(!ex)return "";
    var perf=getWorkoutPerf(plan,i),range=targetRepRange(ex[1]);if(!range||!perf||!(Number(perf.load)>0)||!(Number(perf.reps)>0))return "";
    var id=ex[2]||workoutExerciseId(plan,i),recent=[];
    (state.workoutSessions||[]).forEach(function(s){
      (s.details||[]).forEach(function(d){if(d.id===id&&d.best)recent.push({date:s.date,load:Number(d.best.load)||0,reps:Number(d.best.reps)||0});});
    });
    recent.sort(function(a,b){return a.date<b.date?1:-1;});
    var hitTop=recent.slice(0,2).filter(function(r){return r.load===Number(perf.load)&&r.reps>=range.max;}).length;
    if(hitTop>=2){
      var inc=Number(perf.load)>=50?2.5:1;
      return "Você bateu o topo da faixa em 2 sessões. Próxima meta: "+(Math.round((Number(perf.load)+inc)*10)/10)+" kg, mantendo "+range.min+"–"+range.max+" reps.";
    }
    if(Number(perf.reps)>=range.max)return "Repita esta carga mais uma sessão no topo da faixa antes de aumentar.";
    if(Number(perf.reps)<range.min)return "Mantenha ou reduza levemente a carga e recupere pelo menos "+range.min+" reps com boa execução.";
    return "Mantenha a carga e tente avançar até "+range.max+" reps antes de subir.";
  }
  function updatePersonalRecord(exerciseId,name,load,reps){
    load=Number(load)||0; reps=Number(reps)||0; if(load<=0||reps<=0)return false;
    var old=state.personalRecords[exerciseId], score=load*reps;
    if(!old || score>(Number(old.load||0)*Number(old.reps||0)) || load>Number(old.load||0)){
      state.personalRecords[exerciseId]={name:name,load:load,reps:reps,date:todayStr()};
      return true;
    }
    return false;
  }
  function finishWorkoutSession(){
    ensureV1Fresh();
    var plan=state.workoutToday.plan;
    if(state.workoutToday.finalizedByPlan&&state.workoutToday.finalizedByPlan[plan]){
      showToast("Este treino já foi finalizado hoje."); return;
    }
    var exercises=WORKOUTS[plan]||[], setsDone=0,totalSets=0,volume=0,prs=0;
    var details=[];
    exercises.forEach(function(ex,i){
      var sets=workoutSeriesFor(plan,i), exVol=0, best=null;
      sets.forEach(function(s){
        totalSets++;
        if(s.done){
          setsDone++; var load=Number(s.load)||0,reps=Number(s.reps)||0; volume+=load*reps; exVol+=load*reps;
          if(!best || load>best.load || (load===best.load&&reps>best.reps)) best={load:load,reps:reps};
          if(updatePersonalRecord(ex[2]||workoutExerciseId(plan,i),ex[0],load,reps)) prs++;
        }
      });
      details.push({id:ex[2]||workoutExerciseId(plan,i),name:ex[0],sets:sets.filter(function(s){return s.done;}).map(function(s){return {load:Number(s.load)||0,reps:Number(s.reps)||0};}),volume:Math.round(exVol),best:best});
      if(best){
        var p=getWorkoutPerf(plan,i);
        p.previousText=(p.load!=null||p.reps!=null)?((p.load||0)+" kg × "+(p.reps||0)):p.previousText;
        p.load=best.load; p.reps=best.reps; p.lastDate=todayStr();
        state.workoutPerformance[workoutPerfKey(plan,i)]=p;
      }
    });
    if(totalSets===0 || setsDone<totalSets){showToast("Conclua todas as séries antes de finalizar.");return;}
    var now=new Date(), session={
      id:"ws-"+Date.now(),date:todayStr(),time:pad(now.getHours())+":"+pad(now.getMinutes()),
      split:state.workoutSplit,plan:plan,name:planDisplayName(plan),sets:setsDone,exercises:exercises.length,
      volume:Math.round(volume),prs:prs,details:details
    };
    state.workoutSessions.unshift(session); state.workoutSessions=state.workoutSessions.slice(0,120);
    state.workoutToday.finalizedByPlan[plan]=session.id;
    state.workoutHistory[todayStr()]=state.workoutHistory[todayStr()]||{plans:{}};
    state.workoutHistory[todayStr()].completed=true;
    state.workoutHistory[todayStr()].lastSessionId=session.id;
    state.todayHabits.treino=true;
    awardXP(100 + Math.min(100,setsDone*5) + prs*25);
    save(); renderWorkoutHistory(); renderWorkout(); renderV1Dashboard(); renderInicio(); renderStats(); renderMedalhas();
    if(prs>0){fireConfetti();showToast("🏆 Treino salvo · "+prs+" novo"+(prs===1?" recorde":"s recordes")+"!");}
    else showToast("✓ Treino salvo · "+setsDone+" séries · "+Math.round(volume)+" kg de volume");
    fireVibration([60,30,80]);
  }
  function renderWorkoutHistory(){
    var list=document.getElementById("workout-history-list"), prList=document.getElementById("workout-pr-list");
    if(!list)return;
    var sessions=Array.isArray(state.workoutSessions)?state.workoutSessions:[];
    var cnt=document.getElementById("workout-history-count"); if(cnt)cnt.textContent=sessions.length+" "+(sessions.length===1?"sessão":"sessões");
    var last=document.getElementById("last-workout-summary");
    if(last) last.textContent=sessions.length?(sessions[0].name+" · "+sessions[0].sets+" séries · "+sessions[0].volume+" kg"):"Nenhum ainda";
    list.innerHTML="";
    if(!sessions.length) list.innerHTML='<div class="empty-state">Finalize seu primeiro treino para começar o histórico.</div>';
    sessions.slice(0,10).forEach(function(s){
      var row=document.createElement("div"); row.className="workout-history-row";
      row.innerHTML='<div class="whr-main"><b>'+escapeHtml(s.name)+'</b><span>'+s.date.split("-").reverse().join("/")+' · '+escapeHtml(s.time||"")+'</span></div><div class="whr-stats"><b>'+Number(s.volume||0)+' kg</b><span>'+Number(s.sets||0)+' séries'+(s.prs?' · 🏆 '+s.prs:'')+'</span></div>';
      row.setAttribute("role","button");row.tabIndex=0;
      row.addEventListener("click",function(){openWorkoutSessionDetail(s.id);});
      list.appendChild(row);
    });
    var prs=Object.keys(state.personalRecords||{}).map(function(k){return state.personalRecords[k];}).sort(function(a,b){return (b.date||"").localeCompare(a.date||"");});
    var pc=document.getElementById("pr-count"); if(pc)pc.textContent=prs.length;
    if(prList){
      prList.innerHTML="";
      if(!prs.length) prList.innerHTML='<div class="empty-state">Seus recordes aparecerão aqui conforme você treinar.</div>';
      prs.slice(0,12).forEach(function(p){
        var r=document.createElement("div");r.className="workout-pr-row";
        r.innerHTML='<div><b>'+escapeHtml(p.name||"Exercício")+'</b><span>'+String(p.date||"").split("-").reverse().join("/")+'</span></div><strong>'+Number(p.load||0)+' kg × '+Number(p.reps||0)+'</strong>';
        prList.appendChild(r);
      });
    }
  }
function renderWorkout(){
    ensureV1Fresh(); ensureWorkoutSplitData(); renderWorkoutTabs(); var wpNote=document.getElementById('workout-profile-note');if(wpNote){var ptxt=state.sex==='F'?(state.trainingPriority==='gluteos'?'Ênfase atual: glúteos e pernas':state.trainingPriority==='superiores'?'Ênfase atual: superiores':state.trainingPriority==='forca'?'Ênfase atual: força geral':'Treino feminino equilibrado, com boa distribuição entre inferiores e superiores'):'Ficha base geral';wpNote.textContent='Perfil de treino · '+ptxt;} var splitSel=document.getElementById('workout-split');if(splitSel)splitSel.value=state.workoutSplit; var plan=state.workoutToday.plan||splitLabels()[0]; syncWorkoutCompletion(plan);
    var done=state.workoutToday.doneByPlan[plan]||[], totalSets=0,setsDone=0,volume=0;
    var label=document.getElementById('workout-plan-label'); if(label)label.textContent=planDisplayName(plan)+' · personalizada';
    var list=document.getElementById('exercise-list'); if(!list)return; list.innerHTML='';
    (WORKOUTS[plan]||[]).forEach(function(ex,i){
      var sets=workoutSeriesFor(plan,i), complete=sets.every(function(x){return x.done;});
      sets.forEach(function(x){totalSets++;if(x.done){setsDone++;volume+=(Number(x.load)||0)*(Number(x.reps)||0);}});
      var perf=getWorkoutPerf(plan,i), prev=perf.previousText||((perf.load||perf.reps)?((perf.load||0)+' kg × '+(perf.reps||0)):'Sem histórico anterior'), suggestion=progressionSuggestion(plan,i);
      var card=document.createElement('div');card.className='exercise-pro-card'+(complete?' complete':'')+(i===0&&!complete?' open':'');
      var rows=''; sets.forEach(function(st,si){rows+='<div class="set-row" data-set="'+si+'"><div class="set-num">'+(si+1)+'</div><input class="set-load" type="number" step="0.5" min="0" inputmode="decimal" placeholder="kg" value="'+(st.load!==''?st.load:'')+'"><input class="set-reps" type="number" step="1" min="0" max="100" inputmode="numeric" placeholder="reps" value="'+(st.reps!==''?st.reps:'')+'"><button class="set-done'+(st.done?' done':'')+'" type="button">'+(st.done?'✓':'○')+'</button></div>';});
      card.innerHTML='<div class="exercise-pro-head"><div class="exercise-index">'+(complete?'✓':(i+1))+'</div><div class="exercise-pro-title"><b>'+ex[0]+'</b><span>'+ex[1]+' · '+sets.filter(function(x){return x.done;}).length+'/'+sets.length+' séries</span></div><div class="exercise-chevron">⌄</div></div><div class="exercise-pro-body"><div class="last-performance">Última referência: <b>'+prev+'</b></div><div class="sets-header"><span>Série</span><span>kg</span><span>reps</span><span>feito</span></div>'+rows+'<div class="exercise-footer"><small>Registre a execução real</small><button class="exercise-rest" type="button">⏱ Descanso '+Number(ex[3]||90)+'s</button></div></div>';
      card.querySelector('.exercise-pro-head').addEventListener('click',function(){card.classList.toggle('open');});
      card.querySelectorAll('.set-row').forEach(function(r){var si=parseInt(r.getAttribute('data-set'),10),li=r.querySelector('.set-load'),ri=r.querySelector('.set-reps'),bi=r.querySelector('.set-done');function persist(){var v=parseFloat((li.value||'').replace(',','.')),rp=parseInt(ri.value,10);sets[si].load=isNaN(v)?'':Math.round(v*10)/10;sets[si].reps=isNaN(rp)?'':rp;save();}li.addEventListener('change',persist);ri.addEventListener('change',persist);bi.addEventListener('click',function(){persist();sets[si].done=!sets[si].done;if(state.workoutToday.finalizedByPlan) delete state.workoutToday.finalizedByPlan[plan];if(sets[si].done){var p=getWorkoutPerf(plan,i);p.previousText=(p.load!=null||p.reps!=null)?((p.load||0)+' kg × '+(p.reps||0)):p.previousText;if(sets[si].load!=='')p.load=sets[si].load;if(sets[si].reps!=='')p.reps=sets[si].reps;state.workoutPerformance[workoutPerfKey(plan,i)]=p;state.workoutLoads[workoutPerfKey(plan,i)]=p.load||0;}syncWorkoutCompletion(plan);save();renderWorkout();renderV1Dashboard();renderInicio();});});
      card.querySelector('.exercise-rest').addEventListener('click',function(){openTimer(null,Number(ex[3]||90),'Descanso · '+ex[0]);}); list.appendChild(card);
    });
    var exDone=done.length, exTotal=(WORKOUTS[plan]||[]).length, pct=Math.round(setsDone/Math.max(1,totalSets)*100);
    var ed=document.getElementById('workout-ex-done'),sd=document.getElementById('workout-sets-done'),vv=document.getElementById('workout-volume'),pf=document.getElementById('workout-progress-fill');if(ed)ed.textContent=exDone+'/'+exTotal;if(sd)sd.textContent=setsDone+'/'+totalSets;if(vv)vv.textContent=Math.round(volume)+' kg';if(pf)pf.style.width=pct+'%';
    var ws=document.getElementById('workout-status');if(ws)ws.textContent=pct===100?'Concluído':(setsDone?pct+'% feito':'Não iniciado');
    var finish=document.getElementById('btn-finish-workout');if(finish){var finalized=state.workoutToday.finalizedByPlan&&state.workoutToday.finalizedByPlan[plan];finish.disabled=pct<100||!!finalized;finish.textContent=finalized?'✓ Treino salvo':(pct===100?'FINALIZAR TREINO':'Conclua as séries para finalizar');}
  }
  var workoutEditorIndex = null;
  function openWorkoutEditor(){
    ensureV1Fresh(); workoutEditorIndex=null; hideExerciseEditorForm(); renderWorkoutEditor();
    document.getElementById('workout-editor-modal').classList.add('show');
  }
  function closeWorkoutEditor(){ document.getElementById('workout-editor-modal').classList.remove('show'); hideExerciseEditorForm(); }
  function exerciseDesc(sets,reps){ return Math.max(1,parseInt(sets,10)||3)+' x '+(String(reps||'8–12').trim()||'8–12'); }
  function renderWorkoutEditor(){
    ensureV1Fresh(); var plan=state.workoutToday.plan||'A', arr=WORKOUTS[plan]||[], box=document.getElementById('workout-editor-list');
    document.getElementById('editor-plan-badge').textContent='Treino '+plan; box.innerHTML='';
    if(!arr.length){ box.innerHTML='<div class="editor-empty">Esta ficha está vazia. Adicione seu primeiro exercício.</div>'; return; }
    arr.forEach(function(ex,i){
      var row=document.createElement('div'); row.className='editor-ex-row';
      row.innerHTML='<div class="editor-order"><button type="button" data-up>↑</button><button type="button" data-down>↓</button></div><div class="editor-ex-main"><b>'+escapeHtml(ex[0])+'</b><span>'+escapeHtml(ex[1])+' · descanso '+Number(ex[3]||90)+'s</span></div><div class="editor-actions"><button type="button" data-edit>✎</button><button type="button" class="danger" data-del>×</button></div>';
      row.querySelector('[data-up]').disabled=i===0; row.querySelector('[data-down]').disabled=i===arr.length-1;
      row.querySelector('[data-up]').addEventListener('click',function(){ if(i>0){var x=arr.splice(i,1)[0];arr.splice(i-1,0,x);clearTodayPlanSeries(plan);save();renderWorkoutEditor();renderWorkout();} });
      row.querySelector('[data-down]').addEventListener('click',function(){ if(i<arr.length-1){var x=arr.splice(i,1)[0];arr.splice(i+1,0,x);clearTodayPlanSeries(plan);save();renderWorkoutEditor();renderWorkout();} });
      row.querySelector('[data-edit]').addEventListener('click',function(){ showExerciseEditorForm(i); });
      row.querySelector('[data-del]').addEventListener('click',function(){ if(!confirm('Excluir '+ex[0]+' desta ficha?'))return; arr.splice(i,1); clearTodayPlanSeries(plan); save(); renderWorkoutEditor(); renderWorkout(); renderV1Dashboard(); });
      box.appendChild(row);
    });
  }
  function escapeHtml(v){ return String(v==null?'':v).replace(/[&<>\"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function showExerciseEditorForm(index){
    ensureV1Fresh(); workoutEditorIndex=(typeof index==='number'?index:null); var plan=state.workoutToday.plan||'A', ex=workoutEditorIndex!==null?(WORKOUTS[plan][workoutEditorIndex]||[]):[];
    document.getElementById('exercise-editor-form').style.display='block';
    document.getElementById('edit-ex-name').value=ex[0]||'';
    document.getElementById('edit-ex-sets').value=workoutSetCount(ex[1]||'3 x 8–12');
    var m=String(ex[1]||'').match(/\d+\s*x\s*(.+)$/i); document.getElementById('edit-ex-reps').value=m?m[1]:'8–12';
    document.getElementById('edit-ex-rest').value=Number(ex[3]||90);
    setTimeout(function(){document.getElementById('edit-ex-name').focus();},50);
  }
  function hideExerciseEditorForm(){ var f=document.getElementById('exercise-editor-form'); if(f)f.style.display='none'; workoutEditorIndex=null; }
  function clearTodayPlanSeries(plan){
    var t=todayStr(); if(state.workoutSeries&&state.workoutSeries[t]) delete state.workoutSeries[t][plan];
    if(state.workoutToday&&state.workoutToday.doneByPlan) state.workoutToday.doneByPlan[plan]=[];
    if(state.workoutToday&&state.workoutToday.finalizedByPlan) delete state.workoutToday.finalizedByPlan[plan];
  }
  function saveExerciseFromEditor(){
    ensureV1Fresh(); var plan=state.workoutToday.plan||'A', name=document.getElementById('edit-ex-name').value.trim(), sets=parseInt(document.getElementById('edit-ex-sets').value,10), reps=document.getElementById('edit-ex-reps').value.trim(), rest=parseInt(document.getElementById('edit-ex-rest').value,10);
    if(!name){showToast('Digite o nome do exercício');return;} sets=Math.min(10,Math.max(1,sets||3)); rest=Math.min(600,Math.max(15,rest||90)); if(!reps)reps='8–12';
    var isNew=workoutEditorIndex===null, arr=WORKOUTS[plan]; if(isNew){ arr.push([name,exerciseDesc(sets,reps),'custom-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),rest]); } else { var old=arr[workoutEditorIndex]; arr[workoutEditorIndex]=[name,exerciseDesc(sets,reps),old[2]||('custom-'+Date.now().toString(36)),rest]; clearTodayPlanSeries(plan); }
    save(); hideExerciseEditorForm(); renderWorkoutEditor(); renderWorkout(); renderV1Dashboard(); showToast(isNew?'Exercício adicionado':'Exercício atualizado');
  }
  function resetCurrentWorkout(){
    ensureV1Fresh(); var plan=state.workoutToday.plan||'A'; if(!confirm('Restaurar o Treino '+plan+' para a ficha padrão?'))return;
    state.customWorkouts[plan]=JSON.parse(JSON.stringify(DEFAULT_WORKOUTS[plan]||[])); WORKOUTS=state.customWorkouts; clearTodayPlanSeries(plan); save(); renderWorkout(); renderV1Dashboard(); showToast('Treino '+plan+' restaurado');
  }

  var mealEditIndex=null, selectedNutritionDate=todayStr(), selectedCatalogFood=null;
  function normalizeFoodText(value){
    var text=String(value||"").toLowerCase();
    if(text.normalize)text=text.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    return text.trim();
  }
  function foodMatches(food,query){
    if(!query)return true;
    var hay=normalizeFoodText(food.name+" "+food.portion+" "+(food.keys||""));
    return query.split(/\s+/).every(function(word){return hay.indexOf(word)>=0;});
  }
  function foodQuantity(){
    var input=document.getElementById("food-quantity-input");
    var value=parseFloat(String(input&&input.value||"1").replace(",","."));
    return isNaN(value)?1:Math.max(.25,Math.min(20,value));
  }
  function applySelectedFood(){
    if(!selectedCatalogFood)return;
    var quantity=foodQuantity(),round1=function(value){return Math.round(value*10)/10;};
    document.getElementById("meal-name-input").value=selectedCatalogFood.name;
    document.getElementById("meal-cal-input").value=Math.round(selectedCatalogFood.calories*quantity);
    document.getElementById("meal-pro-input").value=round1(selectedCatalogFood.protein*quantity);
    document.getElementById("meal-carb-input").value=round1(selectedCatalogFood.carbs*quantity);
    document.getElementById("meal-fat-input").value=round1(selectedCatalogFood.fat*quantity);
    var portion=document.getElementById("food-selected-portion");
    if(portion)portion.textContent=quantity+" × "+selectedCatalogFood.portion;
  }
  function selectCatalogFood(food){
    selectedCatalogFood=food;
    var box=document.getElementById("food-selected"),name=document.getElementById("food-selected-name"),qty=document.getElementById("food-quantity-input"),search=document.getElementById("food-search-input");
    if(box)box.hidden=false;if(name)name.textContent=food.name;if(qty)qty.value="1";if(search)search.value=food.name;
    applySelectedFood();renderFoodSuggestions(food.name);showToast("Valores preenchidos automaticamente");
  }
  function clearCatalogFood(clearSearch){
    selectedCatalogFood=null;
    var box=document.getElementById("food-selected"),search=document.getElementById("food-search-input"),qty=document.getElementById("food-quantity-input");
    if(box)box.hidden=true;if(qty)qty.value="1";if(clearSearch&&search)search.value="";
    renderFoodSuggestions(clearSearch?"":(search?search.value:""));
  }
  function renderFoodSuggestions(value){
    var box=document.getElementById("food-suggestions");if(!box)return;
    var query=normalizeFoodText(value),matches=FOOD_CATALOG.filter(function(food){return foodMatches(food,query);}).slice(0,10);
    box.innerHTML="";
    if(!matches.length){box.innerHTML='<div class="food-empty">Nenhum alimento encontrado. Você ainda pode preencher manualmente.</div>';return;}
    matches.forEach(function(food){
      var button=document.createElement("button");button.type="button";button.className="food-suggestion"+(selectedCatalogFood===food?" selected":"");
      button.innerHTML="<b>"+escapeHtml(food.name)+"</b><span>"+escapeHtml(food.portion)+" · "+food.calories+" kcal</span>";
      button.addEventListener("click",function(){selectCatalogFood(food);});box.appendChild(button);
    });
  }
  function nutritionPercent(value,target){
    if(!(target>0)) return 0;
    return Math.max(0,Math.min(100,Math.round((Number(value||0)/target)*100)));
  }
  function nutritionDateLabel(date){
    var d=parseDateStr(date), today=todayStr();
    if(date===today)return {title:"Hoje",date:d.toLocaleDateString("pt-BR")};
    var y=new Date();y.setDate(y.getDate()-1);if(date===dateStr(y))return {title:"Ontem",date:d.toLocaleDateString("pt-BR")};
    return {title:dowNames[d.getDay()].toUpperCase(),date:d.toLocaleDateString("pt-BR")};
  }
  function nutritionForDate(date){
    if(date===todayStr()) return Object.assign({calories:0,protein:0,carbs:0,fat:0},state.dailyNutrition||{});
    return Object.assign({calories:0,protein:0,carbs:0,fat:0},(state.nutritionHistory&&state.nutritionHistory[date])||{});
  }
  function recalcNutritionDate(date){
    ensureV1Fresh();
    var total={calories:0,protein:0,carbs:0,fat:0};
    (state.mealHistory[date]||[]).forEach(function(m){
      total.calories+=Number(m.calories)||0; total.protein+=Number(m.protein)||0;
      total.carbs+=Number(m.carbs)||0; total.fat+=Number(m.fat)||0;
    });
    var clean={calories:Math.round(total.calories),protein:Math.round(total.protein*10)/10,carbs:Math.round(total.carbs*10)/10,fat:Math.round(total.fat*10)/10};
    state.nutritionHistory[date]=clean;
    if(date===todayStr()){
      state.dailyNutrition=Object.assign({date:todayStr()},clean);
      updateAutoNutritionHabits(); state.habitHistory[todayStr()]=Object.assign({},state.todayHabits);
    }
    save();
  }
  function recalcDailyNutrition(){ recalcNutritionDate(todayStr()); }
  function clearMealForm(){
    mealEditIndex=null;
    ["meal-name-input","meal-cal-input","meal-pro-input","meal-carb-input","meal-fat-input"].forEach(function(id){var e=document.getElementById(id);if(e)e.value="";});
    var type=document.getElementById("meal-type-input");if(type)type.value="Café da manhã";
    var btn=document.getElementById("btn-add-meal");if(btn)btn.textContent="Adicionar refeição";
    var cancel=document.getElementById("btn-cancel-meal-edit");if(cancel)cancel.style.display="none";
    clearCatalogFood(true);
  }
  function editMeal(index){
    ensureV1Fresh(); var m=(state.mealHistory[selectedNutritionDate]||[])[index]; if(!m)return;
    mealEditIndex=index;
    document.getElementById("meal-name-input").value=m.name||m.label||"";
    document.getElementById("meal-type-input").value=m.type||"Outro";
    document.getElementById("meal-cal-input").value=m.calories||"";
    document.getElementById("meal-pro-input").value=m.protein||"";
    document.getElementById("meal-carb-input").value=m.carbs||"";
    document.getElementById("meal-fat-input").value=m.fat||"";
    document.getElementById("btn-add-meal").textContent="Salvar alterações";
    document.getElementById("btn-cancel-meal-edit").style.display="";
    clearCatalogFood(true);
    document.getElementById("meal-name-input").focus();
    document.getElementById("meal-name-input").scrollIntoView({behavior:"smooth",block:"center"});
  }
  function removeMeal(index){
    ensureV1Fresh(); var arr=state.mealHistory[selectedNutritionDate]||[]; if(!arr[index])return;
    arr.splice(index,1); recalcNutritionDate(selectedNutritionDate); clearMealForm(); renderNutritionSelectedDay(); renderNutritionWeek();
    if(selectedNutritionDate===todayStr()){renderV1Dashboard();renderInicio();}
    showToast("Refeição removida");
  }
  function renderNutritionSelectedDay(){
    ensureV1Fresh(); var bt=calcBodyTargets(), n=nutritionForDate(selectedNutritionDate), lab=nutritionDateLabel(selectedNutritionDate);
    var title=document.getElementById("nutrition-day-title"), day=document.getElementById("nutri-day-label"), date=document.getElementById("nutri-date-label");
    if(title)title.textContent=lab.title; if(day)day.textContent=lab.title; if(date)date.textContent=lab.date;
    var et=document.getElementById("meal-entry-title");if(et)et.textContent="Adicionar refeição · "+lab.title.toLowerCase();
    var ml=document.getElementById("meal-list-title");if(ml)ml.textContent="Refeições · "+lab.title.toLowerCase();
    document.getElementById('nutri-cal').textContent=(n.calories||0)+' / '+bt.calories+' kcal';
    document.getElementById('nutri-pro').textContent=(n.protein||0)+' / '+bt.protein+' g';
    var nc=document.getElementById('nutri-carb'),nf=document.getElementById('nutri-fat');
    if(nc)nc.textContent=(n.carbs||0)+' / '+bt.carbs+' g'; if(nf)nf.textContent=(n.fat||0)+' / '+bt.fat+' g';
    [['nutri-cal-bar',n.calories,bt.calories],['nutri-pro-bar',n.protein,bt.protein],['nutri-carb-bar',n.carbs,bt.carbs],['nutri-fat-bar',n.fat,bt.fat]].forEach(function(x){var e=document.getElementById(x[0]);if(e)e.style.width=nutritionPercent(x[1],x[2])+'%';});
    var low=Math.round(bt.calories*.85),high=Math.round(bt.calories*1.15),cal=Number(n.calories||0),ns=document.getElementById('nutri-status');
    if(ns)ns.textContent=cal===0?'Sem registros':(cal<low?'Abaixo da faixa':(cal<=high?'Dentro da faixa':'Acima da faixa'));
    var next=document.getElementById("nutri-next-day");if(next)next.disabled=selectedNutritionDate>=todayStr();
    var todayBtn=document.getElementById("nutri-go-today");if(todayBtn)todayBtn.style.visibility=selectedNutritionDate===todayStr()?"hidden":"visible";
  }
  function renderMealHistory(){
    ensureV1Fresh(); var box=document.getElementById('meal-history'); if(!box)return;
    var arr=state.mealHistory[selectedNutritionDate]||[]; box.innerHTML='';
    if(!arr.length){box.innerHTML='<div class="empty-state">Nenhuma refeição registrada neste dia.</div>';return;}
    arr.forEach(function(m,index){
      var row=document.createElement('div'); row.className='meal-row meal-row-pro'; var macro=[];
      if(Number(m.protein)>0)macro.push(Number(m.protein)+'g P'); if(Number(m.carbs)>0)macro.push(Number(m.carbs)+'g C'); if(Number(m.fat)>0)macro.push(Number(m.fat)+'g G');
      row.innerHTML='<div class="meal-row-main"><div class="meal-row-title"><b>'+escapeHtml(m.name||m.label||"Refeição")+'</b><span>'+escapeHtml(m.type||"Outro")+' · '+escapeHtml(m.time||"")+'</span></div><div class="meal-row-macros"><strong>'+Number(m.calories||0)+' kcal</strong><span>'+escapeHtml(macro.join(" · ")||"sem macros adicionais")+'</span></div></div><div class="meal-row-actions"><button type="button" data-copy>duplicar</button><button type="button" data-edit>editar</button><button type="button" data-remove>remover</button></div>';
      row.querySelector('[data-copy]').addEventListener('click',function(){
        var copy=Object.assign({},m);copy.time=pad(new Date().getHours())+":"+pad(new Date().getMinutes());
        (state.mealHistory[selectedNutritionDate]||(state.mealHistory[selectedNutritionDate]=[])).push(copy);
        recalcNutritionDate(selectedNutritionDate);renderMealHistory();renderNutritionSelectedDay();renderNutritionWeek();if(selectedNutritionDate===todayStr())renderV1Dashboard();showToast("Refeição duplicada");
      });
      row.querySelector('[data-edit]').addEventListener('click',function(){editMeal(index);}); row.querySelector('[data-remove]').addEventListener('click',function(){removeMeal(index);}); box.appendChild(row);
    });
  }
  function moveNutritionDay(delta){
    var d=parseDateStr(selectedNutritionDate); d.setDate(d.getDate()+delta); var key=dateStr(d); if(key>todayStr())key=todayStr();
    selectedNutritionDate=key; clearMealForm(); renderNutritionSelectedDay(); renderMealHistory();
  }
  function renderNutritionWeek(){
    var box=document.getElementById("nutrition-week-list"); if(!box)return;
    var t=new Date(),entries=[],sumCal=0,sumPro=0,days=0;
    for(var i=6;i>=0;i--){var d=new Date(t);d.setDate(t.getDate()-i);var key=dateStr(d),n=state.nutritionHistory&&state.nutritionHistory[key];var cal=n?Number(n.calories||0):0,pro=n?Number(n.protein||0):0;if(cal>0||pro>0){days++;sumCal+=cal;sumPro+=pro;}entries.push({date:key,cal:cal,pro:pro});}
    document.getElementById("nutri-week-cal").textContent=days?Math.round(sumCal/days)+" kcal":"--";
    document.getElementById("nutri-week-pro").textContent=days?Math.round(sumPro/days)+" g":"--";
    document.getElementById("nutri-week-days").textContent=days+"/7"; box.innerHTML="";
    entries.forEach(function(x){var d=parseDateStr(x.date),r=document.createElement("button");r.type="button";r.className="nutrition-week-row"+(x.date===selectedNutritionDate?" selected":"");r.innerHTML='<span>'+dowNames[d.getDay()]+'</span><div><b>'+(x.cal||0)+' kcal</b><small>'+(x.pro||0)+' g proteína</small></div>';r.addEventListener("click",function(){selectedNutritionDate=x.date;clearMealForm();renderNutritionSelectedDay();renderMealHistory();renderNutritionWeek();});box.appendChild(r);});
  }
  var nutriPrev=document.getElementById("nutri-prev-day"),nutriNext=document.getElementById("nutri-next-day"),nutriToday=document.getElementById("nutri-go-today");
  if(nutriPrev)nutriPrev.addEventListener("click",function(){moveNutritionDay(-1);renderNutritionWeek();});
  if(nutriNext)nutriNext.addEventListener("click",function(){moveNutritionDay(1);renderNutritionWeek();});
  if(nutriToday)nutriToday.addEventListener("click",function(){selectedNutritionDate=todayStr();clearMealForm();renderNutritionSelectedDay();renderMealHistory();renderNutritionWeek();});
  var measureEditDate=null;
  function measureLabel(k){return {waist:"Cintura",abdomen:"Abdômen",chest:"Peito",arm:"Braço",thigh:"Coxa",hip:"Quadril"}[k]||k;}
  function renderMeasureChart(){
    var canvas=document.getElementById("measure-chart");if(!canvas)return;
    var type=(document.getElementById("measure-chart-type")||{}).value||"waist";
    var arr=(state.measurements||[]).filter(function(m){return Number(m[type])>0;}).slice().sort(function(a,b){return a.date<b.date?-1:1;});
    var dpr=window.devicePixelRatio||1,w=canvas.clientWidth||300,h=160;canvas.width=w*dpr;canvas.height=h*dpr;
    var ctx=canvas.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    if(arr.length<1){ctx.fillStyle="#93A0B4";ctx.font="12px system-ui";ctx.textAlign="center";ctx.fillText("Registre medidas para gerar o gráfico",w/2,h/2);return;}
    var vals=arr.map(function(x){return Number(x[type]);}),min=Math.min.apply(null,vals),max=Math.max.apply(null,vals);if(max===min){max+=1;min-=1;}var padX=18,padY=20;
    ctx.strokeStyle="rgba(255,255,255,.10)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(padX,h-padY);ctx.lineTo(w-padX,h-padY);ctx.stroke();
    ctx.strokeStyle="#2DD4BF";ctx.lineWidth=2;ctx.beginPath();
    arr.forEach(function(x,i){var px=padX+(w-padX*2)*(arr.length===1?.5:i/(arr.length-1)),py=padY+(h-padY*2)*(1-(Number(x[type])-min)/(max-min));if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);});
    ctx.stroke();
    ctx.fillStyle="#2DD4BF";arr.forEach(function(x,i){var px=padX+(w-padX*2)*(arr.length===1?.5:i/(arr.length-1)),py=padY+(h-padY*2)*(1-(Number(x[type])-min)/(max-min));ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill();});
    var ch=document.getElementById("measure-chart-change");if(ch){var diff=arr.length>1?Math.round((vals[vals.length-1]-vals[0])*10)/10:0;ch.textContent=arr.length>1?((diff>0?"+":"")+diff+" cm"):"1 registro";}
  }
  function editMeasurement(date){
    var m=(state.measurements||[]).filter(function(x){return x.date===date;})[0];if(!m)return;
    measureEditDate=date;
    var ids={waist:"m-waist",abdomen:"m-abdomen",chest:"m-chest",arm:"m-arm",thigh:"m-thigh",hip:"m-hip"};
    Object.keys(ids).forEach(function(k){document.getElementById(ids[k]).value=m[k]!=null?m[k]:"";});
    var btn=document.getElementById("btn-save-measures");btn.textContent="Salvar alterações";
    btn.scrollIntoView({behavior:"smooth",block:"center"});
  }
  function deleteMeasurement(date){
    if(!confirm("Excluir as medidas de "+date.split("-").reverse().join("/")+"?"))return;
    state.measurements=(state.measurements||[]).filter(function(x){return x.date!==date;});save();renderMeasures();showToast("Medidas excluídas");
  }
  function renderMeasures(){
    var history=document.getElementById("measure-history"),last=document.getElementById("measure-last");
    var arr=(state.measurements||[]).slice().sort(function(a,b){return a.date<b.date?1:-1;});
    history.innerHTML="";
    if(!arr.length){last.textContent="Nenhuma medida registrada ainda.";renderMeasureChart();return;}
    var m=arr[0],parts=[];["waist","abdomen","chest","arm","thigh","hip"].forEach(function(k){if(m[k]!=null)parts.push(measureLabel(k)+" "+m[k]+" cm");});
    last.textContent="Último registro · "+m.date.split("-").reverse().join("/")+" · "+parts.slice(0,3).join(" · ");
    arr.slice(0,12).forEach(function(x){
      var row=document.createElement("div");row.className="measure-history-row";
      var vals=[];["waist","abdomen","chest","arm","thigh","hip"].forEach(function(k){if(x[k]!=null)vals.push(measureLabel(k)+" "+x[k]);});
      row.innerHTML='<div><b>'+x.date.split("-").reverse().join("/")+'</b><span>'+escapeHtml(vals.join(" · "))+'</span></div><div class="measure-row-actions"><button data-edit>editar</button><button data-del>excluir</button></div>';
      row.querySelector("[data-edit]").addEventListener("click",function(){editMeasurement(x.date);});
      row.querySelector("[data-del]").addEventListener("click",function(){deleteMeasurement(x.date);});
      history.appendChild(row);
    });
    renderMeasureChart();
  }

  function startOfCurrentWeek(){
    var now=new Date(),day=now.getDay(),diff=(day===0?6:day-1);
    return new Date(now.getFullYear(),now.getMonth(),now.getDate()-diff,12,0,0);
  }
  function dateInCurrentWeek(dateText){
    if(!dateText)return false;
    var d=parseDateStr(dateText),start=startOfCurrentWeek(),end=new Date(start);end.setDate(start.getDate()+6);
    return d>=start&&d<=end;
  }
  function pctGoal(value,target){target=Math.max(1,Number(target)||1);return Math.max(0,Math.min(100,Math.round(Number(value||0)/target*100)));}
  function currentWeekSnapshot(){
    ensureV1Fresh();
    var start=startOfCurrentWeek(),now=new Date(),elapsed=Math.min(7,Math.max(1,Math.floor((new Date(now.getFullYear(),now.getMonth(),now.getDate(),12)-start)/86400000)+1)),end=new Date(start);end.setDate(start.getDate()+6);
    var workouts=(state.workoutSessions||[]).filter(function(x){return dateInCurrentWeek(x.date);}).length;
    if(!workouts)workouts=Object.keys(state.workoutHistory||{}).filter(function(k){return dateInCurrentWeek(k)&&state.workoutHistory[k]&&state.workoutHistory[k].completed;}).length;
    var bt=calcBodyTargets(),proteinDays=0,nutritionDays=0,proteinSum=0,consistent=0;
    for(var i=0;i<elapsed;i++){
      var d=new Date(start);d.setDate(start.getDate()+i);var key=dateStr(d),n=state.nutritionHistory&&state.nutritionHistory[key],h=state.history&&state.history[key];
      if(n&&(Number(n.calories||0)>0||Number(n.protein||0)>0)){nutritionDays++;proteinSum+=Number(n.protein||0);if(Number(n.protein||0)>=bt.protein)proteinDays++;}
      if(h&&h.completed)consistent++;
    }
    var weigh=(state.weightHistory||[]).filter(function(x){return dateInCurrentWeek(x.date);}),avgW=weigh.length?weigh.reduce(function(a,x){return a+Number(x.weight||0);},0)/weigh.length:null,avgP=nutritionDays?proteinSum/nutritionDays:null;
    var targets={workouts:Math.max(1,Math.min(7,Number(state.weeklyWorkoutTarget)||4)),proteinDays:Math.max(1,Math.min(7,Number(state.weeklyProteinDaysTarget)||5)),weighins:Math.max(1,Math.min(7,Number(state.weeklyWeighinsTarget)||3))};
    var score=Math.round((pctGoal(workouts,targets.workouts)+pctGoal(proteinDays,targets.proteinDays)+pctGoal(weigh.length,targets.weighins))/3);
    return {start:start,end:end,elapsed:elapsed,workouts:workouts,proteinDays:proteinDays,nutritionDays:nutritionDays,avgProtein:avgP,weighins:weigh.length,avgWeight:avgW,consistent:consistent,targets:targets,weekScore:score,proteinTarget:bt.protein};
  }
  function smartWeeklyAlerts(s){
    s=s||currentWeekSnapshot();var a=[],expected=s.targets.workouts*s.elapsed/7;
    if(s.workouts>=s.targets.workouts)a.push({type:"good",icon:"✅",text:"Meta de treinos da semana já foi alcançada."});
    else if(s.workouts+0.45<expected&&s.elapsed>=2){var miss=Math.max(1,Math.ceil(expected-s.workouts));a.push({type:"warn",icon:"🏋️",text:"Seu ritmo está "+miss+" treino"+(miss>1?"s":"")+" abaixo do planejado para este ponto da semana."});}
    else a.push({type:"info",icon:"🏋️",text:"Treinos no ritmo: "+s.workouts+" de "+s.targets.workouts+" nesta semana."});
    if(s.nutritionDays>=2&&s.avgProtein<s.proteinTarget*.85)a.push({type:"warn",icon:"🥩",text:"Proteína média está em "+Math.round(s.avgProtein)+" g. Sua referência diária é "+s.proteinTarget+" g."});
    else if(s.proteinDays>=s.targets.proteinDays)a.push({type:"good",icon:"🥩",text:"Meta semanal de proteína atingida."});
    else if(s.nutritionDays>0)a.push({type:"info",icon:"🥩",text:"Você bateu a proteína em "+s.proteinDays+" de "+s.targets.proteinDays+" dias planejados."});
    else if(s.elapsed>=2)a.push({type:"warn",icon:"🍽️",text:"Ainda não há alimentação registrada nesta semana."});
    if(s.weighins>=s.targets.weighins)a.push({type:"good",icon:"⚖️",text:"Pesagens da semana completas. Use a média, não um peso isolado."});
    else if(s.elapsed>=4&&s.weighins===0)a.push({type:"warn",icon:"⚖️",text:"Ainda não há pesagem nesta semana. Uma média semanal ajuda a enxergar a tendência."});
    if(s.consistent>=Math.min(5,s.elapsed)&&s.elapsed>=4)a.push({type:"good",icon:"🔥",text:"Sua consistência está forte: "+s.consistent+" dias concluídos nesta semana."});
    return a.slice(0,3);
  }
  function renderWeeklyHome(){
    var s=currentWeekSnapshot(),alerts=smartWeeklyAlerts(s),fmt=function(d){return pad(d.getDate())+"/"+pad(d.getMonth()+1);};
    function tx(id,v){var e=document.getElementById(id);if(e)e.textContent=v;}function bar(id,v){var e=document.getElementById(id);if(e)e.style.width=Math.max(0,Math.min(100,v))+"%";}
    tx("week-range-home",fmt(s.start)+" – "+fmt(s.end));tx("week-score-home",s.weekScore+"%");
    tx("home-week-workouts",s.workouts+" de "+s.targets.workouts);tx("home-week-protein-days",s.proteinDays+" de "+s.targets.proteinDays);tx("home-week-weighins",s.weighins+" de "+s.targets.weighins);
    tx("home-week-protein-avg",s.avgProtein!=null?Math.round(s.avgProtein)+" g":"--");tx("home-week-weight-avg",s.avgWeight!=null?(Math.round(s.avgWeight*10)/10)+" kg":"--");tx("home-week-consistent",s.consistent+" / "+s.elapsed);
    bar("home-week-workouts-bar",pctGoal(s.workouts,s.targets.workouts));bar("home-week-protein-bar",pctGoal(s.proteinDays,s.targets.proteinDays));bar("home-week-weighins-bar",pctGoal(s.weighins,s.targets.weighins));
    var box=document.getElementById("smart-alert-list"),count=document.getElementById("smart-alert-count");if(count)count.textContent=alerts.length+" "+(alerts.length===1?"alerta":"alertas");
    if(box){box.innerHTML="";alerts.forEach(function(x){var r=document.createElement("div");r.className="smart-alert-item "+x.type;r.innerHTML='<span class="sai-icon">'+x.icon+'</span><span>'+escapeHtml(x.text)+'</span>';box.appendChild(r);});}
    return s;
  }
  function renderWeekly(){
    var s=renderWeeklyHome(),adh=Math.round(s.consistent/Math.max(1,s.elapsed)*100);
    var ids={week_days:s.consistent+"/"+s.elapsed,week_adherence:adh+"%",week_workouts:s.workouts+" / "+s.targets.workouts};Object.keys(ids).forEach(function(k){var e=document.getElementById(k.replace(/_/g,"-"));if(e)e.textContent=ids[k];});
    var wh=(state.weightHistory||[]).filter(function(x){return dateInCurrentWeek(x.date);}).slice().sort(function(a,b){return a.date<b.date?-1:1;}),delta="--";
    if(wh.length>=2){var dv=Math.round((Number(wh[wh.length-1].weight)-Number(wh[0].weight))*10)/10;delta=(dv>0?"+":"")+dv+" kg";}var we=document.getElementById("week-weight");if(we)we.textContent=delta;
    var grade=s.weekScore>=90?"Excelente":s.weekScore>=70?"Bom":s.weekScore>=45?"Construindo":"Recomeço",g=document.getElementById("weekly-grade");if(g)g.textContent=grade;
    var note=document.getElementById("weekly-note"),alerts=smartWeeklyAlerts(s);if(note)note.textContent=alerts.length?alerts[0].text:"Continue registrando seus dados para gerar orientações.";
  }

  /* ============================================================
     RENDER - SAUDAÇÃO
  ============================================================ */
  function renderGreeting(){
    var h = new Date().getHours();
    var saudacao = h < 12 ? "Bom dia" : (h < 18 ? "Boa tarde" : "Boa noite");
    var el = document.getElementById("greeting");
    var sub = document.getElementById("sub-title");
    if(state.name && state.name.trim()){
      el.textContent = saudacao + ", " + state.name.trim().split(" ")[0];
      sub.textContent = "Seu corpo. Seus hábitos. Sua evolução.";
    } else {
      el.innerHTML = 'EVOLU<span class="dot">Ç</span>ÃO';
      sub.textContent = "Seu corpo. Seus hábitos. Sua evolução.";
    }
  }

  /* ============================================================
     RENDER - INÍCIO
  ============================================================ */
  function renderInicio(){
    document.getElementById("weight-now").innerHTML = (state.weightCurrent!=null ? state.weightCurrent : "--") + " <span>kg</span>";
    document.getElementById("goal-label").textContent = (state.weightGoal!=null ? state.weightGoal : "--") + " kg";
    document.getElementById("streak-num").textContent = state.streak;
    document.getElementById("level-name").textContent = levelName(state.level);
    document.getElementById("weeks-done").textContent = state.level - 1;

    var pct = journeyPct();
    document.getElementById("journey-fill").style.width = pct + "%";
    document.getElementById("journey-pct").textContent = pct + "% da evolução até a meta";

    var target = currentTargetMinutes();
    document.getElementById("phase-num").textContent = state.level;
    document.getElementById("phase-day").textContent = Math.min(state.levelDayCount, 7);
    document.getElementById("level-tag").textContent = "Nível " + state.level;
    var bt = calcBodyTargets();
    var isMass = state.goalType === "massa";
    document.getElementById("phase-badge").textContent = isMass ? "FASE 2 · CONSTRUIR" : "FASE 1 · REDUZIR";
    document.getElementById("calorie-target").textContent = bt.calories + " kcal";
    document.getElementById("protein-target").textContent = bt.protein + " g";
    document.getElementById("steps-target").textContent = bt.steps.toLocaleString("pt-BR");
    document.getElementById("sleep-target").textContent = bt.sleep + " h";
    document.getElementById("phase-note").textContent = isMass ? "Superávit leve para favorecer ganho muscular, com proteína alta e treino de força como prioridade." : "Déficit moderado para reduzir gordura preservando massa muscular. O foco é aderência, proteína, movimento e sono.";
    renderV1Dashboard();
    renderWeeklyHome();
    document.getElementById("mode-cut").classList.toggle("active", !isMass);
    document.getElementById("mode-mass").classList.toggle("active", isMass);

    var completedToday = isTodayCompleted();
    var checks = state.todayChecks;
    var persistMode = checks.persistMode;
    var list = document.getElementById("mission-list");
    list.innerHTML = "";

    var activityMinutes = persistMode ? 5 : target;
    var habits = state.todayHabits || {};
    var tasks = state.goalType === "massa" ? [
      { key:"treino", habit:true, auto:true, icon:"🏋️", name:"Treino de força", desc:(isAnyWorkoutCompleteToday()?"Treino concluído":"Conclua a ficha do treino de hoje") },
      { key:"proteina", habit:true, auto:true, icon:"🥩", name:"Bater proteína", desc:(state.dailyNutrition.protein||0)+" / "+bt.protein+" g" },
      { key:"alimentacao", habit:true, auto:true, icon:"🍽️", name:"Bater alimentação", desc:(state.dailyNutrition.calories||0)+" / "+bt.calories+" kcal" },
      { key:"sono", habit:true, auto:true, icon:"😴", name:"Sono", desc:(habits.sleepHours||0)+" / "+bt.sleep+" h" }
    ] : [
      { key:"caminhada", icon:"🚶", name:"Caminhada / cardio leve", desc: activityMinutes + " minutos" + (persistMode ? " (modo persistência)" : ""), timer: activityMinutes*60 },
      { key:"passos", habit:true, auto:true, icon:"👟", name:"Meta de passos", desc:Number(habits.stepsCount||0).toLocaleString("pt-BR")+" / "+bt.steps.toLocaleString("pt-BR")+" passos" },
      { key:"proteina", habit:true, auto:true, icon:"🥩", name:"Bater proteína", desc:(state.dailyNutrition.protein||0)+" / "+bt.protein+" g" },
      { key:"alimentacao", habit:true, auto:true, icon:"🍽️", name:"Manter déficit", desc:(state.dailyNutrition.calories||0)+" / "+bt.calories+" kcal" },
      { key:"sono", habit:true, auto:true, icon:"😴", name:"Sono", desc:(habits.sleepHours||0)+" / "+bt.sleep+" h" }
    ];
    tasks.forEach(function(task){
      var checked = completedToday ? true : (task.habit ? !!habits[task.key] : !!checks[task.key]);
      var item = document.createElement("div");
      item.className = "mission-item" + (checked ? " checked" : "");
      var timerBtnHtml = (!checked && task.timer) ? '<button class="m-timer-btn" data-key="' + task.key + '" data-seconds="' + task.timer + '" data-name="' + task.name + '">▶ iniciar</button>' : "";
      item.innerHTML = '<div class="check-circle">' + (checked ? "✓" : "") + '</div><div class="m-icon">' + task.icon + '</div><div class="m-text"><div class="m-name">' + task.name + '</div><div class="m-target">' + task.desc + '</div></div>' + timerBtnHtml;
      if(!completedToday && !task.auto) item.addEventListener("click", function(){ task.habit ? toggleHabit(task.key) : toggleTask(task.key); });
      list.appendChild(item);
    });

    var cupsGoal = waterCupsGoal();
    var cupsFilled = completedToday ? cupsGoal : (checks.aguaCups || 0);
    var waterChecked = cupsFilled >= cupsGoal;
    var waterItem = document.createElement("div");
    waterItem.className = "mission-item water-item" + (waterChecked ? " checked" : "");
    var cupsHtml = "";
    for(var c=0;c<cupsGoal;c++){
      cupsHtml += '<div class="water-cup' + (c<cupsFilled ? " filled":"") + '" data-index="' + c + '">' + (c<cupsFilled ? "💧":"") + '</div>';
    }
    waterItem.innerHTML =
      '<div class="check-circle">' + (waterChecked ? "✓" : "") + '</div>' +
      '<div class="m-icon">💧</div>' +
      '<div class="m-text"><div class="m-name">Beber água</div>' +
      '<div class="m-target">' + (cupsFilled*WATER_CUP_ML) + ' / ' + (cupsGoal*WATER_CUP_ML) + ' ml — toque nos copos ao encher</div>' +
      '<div class="water-cups">' + cupsHtml + '</div></div>';
    list.appendChild(waterItem);
    if(!completedToday){
      waterItem.querySelectorAll(".water-cup").forEach(function(cup){
        cup.addEventListener("click", function(ev){ ev.stopPropagation(); tapCup(parseInt(cup.getAttribute("data-index"),10)); });
      });
      list.querySelectorAll(".m-timer-btn").forEach(function(btn){
        btn.addEventListener("click", function(ev){
          ev.stopPropagation();
          openTimer(btn.getAttribute("data-key"), parseInt(btn.getAttribute("data-seconds"),10), btn.getAttribute("data-name"));
        });
      });
    }

    var btn = document.getElementById("btn-complete");
    if(completedToday){ btn.disabled = true; btn.textContent = "✓ Missão concluída hoje"; btn.classList.add("done-today"); }
    else if(allChecked()){ btn.disabled = false; btn.textContent = "CONCLUIR MISSÃO"; btn.classList.remove("done-today"); }
    else { btn.disabled = true; btn.textContent = "Marque os itens acima"; btn.classList.remove("done-today"); }

    var persistBtn = document.getElementById("btn-persist");
    persistBtn.style.display = (!completedToday && !persistMode && !state.persistenciaUsedInPhase && !checks.caminhada) ? "block" : "none";

    var bannerSlot = document.getElementById("banner-slot");
    bannerSlot.innerHTML = "";
    var now = new Date();
    var hour = now.getHours();
    var noneChecked = !checks.caminhada && !checks.agua;

    if(pendingBreakBanner){
      var b = document.createElement("div");
      b.className = "banner gentle";
      b.innerHTML = '<span class="b-icon">🌱</span><span>Sem problemas por perder um dia. A fase continua com a mesma meta — o importante é voltar hoje.</span>';
      bannerSlot.appendChild(b);
      pendingBreakBanner = false;
    } else if(completedToday){
      var b2 = document.createElement("div");
      b2.className = "banner info";
      b2.innerHTML = '<span class="b-icon">🌙</span><span>Descanse. Amanhã tem uma nova missão te esperando.</span>';
      bannerSlot.appendChild(b2);
    } else if(hour >= 20){
      var b3 = document.createElement("div");
      b3.className = "banner gentle";
      b3.innerHTML = '<span class="b-icon">⏳</span><span>Ainda dá tempo hoje. São só ' + activityMinutes + ' minutos — comece agora, mesmo que devagar.</span>';
      bannerSlot.appendChild(b3);
    } else if(hour >= 13 && noneChecked){
      var b4 = document.createElement("div");
      b4.className = "banner info";
      b4.innerHTML = '<span class="b-icon">👋</span><span>Ainda não começou hoje? Marque só um item agora e o resto do dia fica mais leve.</span>';
      bannerSlot.appendChild(b4);
    } else if(noneChecked){
      var b5 = document.createElement("div");
      b5.className = "banner info";
      b5.innerHTML = '<span class="b-icon">☀️</span><span>Comece cedo e o dia todo fica livre depois. Toque em "iniciar" para começar com o cronômetro.</span>';
      bannerSlot.appendChild(b5);
    }
  }

  /* ============================================================
     RENDER - CALENDÁRIO
  ============================================================ */
  var calViewDate = new Date(); calViewDate.setDate(1);
  function renderCalendario(){
    var y = calViewDate.getFullYear(), m = calViewDate.getMonth();
    document.getElementById("cal-title").textContent = monthNames[m] + " " + y;
    var grid = document.getElementById("cal-grid");
    grid.innerHTML = "";
    dowNames.forEach(function(d){ var el=document.createElement("div"); el.className="cal-dow"; el.textContent=d; grid.appendChild(el); });
    var firstDow = new Date(y,m,1).getDay();
    var daysInMonth = new Date(y,m+1,0).getDate();
    var t = todayStr();
    for(var i=0;i<firstDow;i++){ var e=document.createElement("div"); e.className="cal-day empty"; grid.appendChild(e); }
    for(var day=1; day<=daysInMonth; day++){
      var d = new Date(y,m,day,12,0,0);
      var ds = dateStr(d);
      var cell = document.createElement("div");
      var cls = "cal-day";
      if(ds === t) cls += " today";
      if(ds > t) cls += " future";
      else if(state.history[ds] && state.history[ds].completed) cls += " done";
      cell.className = cls;
      cell.textContent = day;
      grid.appendChild(cell);
    }
  }
  document.getElementById("cal-prev").addEventListener("click", function(){ calViewDate.setMonth(calViewDate.getMonth()-1); renderCalendario(); });
  document.getElementById("cal-next").addEventListener("click", function(){ calViewDate.setMonth(calViewDate.getMonth()+1); renderCalendario(); });

  /* ============================================================
     RENDER - PESO
  ============================================================ */
  function weeklyWeightTrend(){
    var arr=(state.weightHistory||[]).slice().sort(function(a,b){return a.date<b.date?-1:1;});
    if(arr.length<2)return null;
    var groups={};
    arr.forEach(function(x){
      var d=parseDateStr(x.date),day=d.getDay(),diff=day===0?6:day-1,mon=new Date(d);mon.setDate(d.getDate()-diff);var k=dateStr(mon);
      (groups[k]||(groups[k]=[])).push(Number(x.weight));
    });
    var keys=Object.keys(groups).sort();
    if(keys.length<2)return null;
    function avg(k){var a=groups[k];return a.reduce(function(s,v){return s+v;},0)/a.length;}
    var a=avg(keys[keys.length-2]),b=avg(keys[keys.length-1]);return Math.round((b-a)*10)/10;
  }

  function renderPeso(){
    document.getElementById("peso-meta").textContent = (state.weightGoal!=null?state.weightGoal:"--") + " kg";
    document.getElementById("peso-atual").textContent = (state.weightCurrent!=null?state.weightCurrent:"--") + " kg";
    document.getElementById("peso-faltam").textContent = remainingToGoal() + " kg";

    var listEl = document.getElementById("hist-list");
    listEl.innerHTML = "";
    var items = state.weightHistory.slice().sort(function(a,b){ return a.date < b.date ? 1 : -1; });
    items.forEach(function(item){
      var row = document.createElement("div");
      row.className = "hist-row";
      row.innerHTML = '<span class="d">' + formatDatePretty(item.date) + '</span><span class="w">' + item.weight + ' kg</span>';
      listEl.appendChild(row);
    });
    var recent=state.weightHistory.slice().sort(function(a,b){return a.date<b.date?1:-1;}).slice(0,7); var avg=recent.length?recent.reduce(function(sum,x){return sum+Number(x.weight||0);},0)/recent.length:null; var avgEl=document.getElementById("weight-avg7"), trEl=document.getElementById("weight-trend"); if(avgEl)avgEl.textContent=avg!=null?(Math.round(avg*10)/10)+" kg":"--"; if(trEl){if(recent.length<2)trEl.textContent="Dados insuficientes";else{var newest=Number(recent[0].weight),oldest=Number(recent[recent.length-1].weight),d=Math.round((newest-oldest)*10)/10;trEl.textContent=(d>0?"+":"")+d+" kg / 7d";}}
    drawChart();
    renderMeasures();
  }
  function formatDatePretty(ds){ var p = ds.split("-"); return p[2] + "/" + p[1]; }

  function drawChart(){
    var canvas = document.getElementById("chart");
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    var w = rect.width || 300, h = 180;
    canvas.width = w*dpr; canvas.height = h*dpr; canvas.style.height = h+"px";
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,w,h);
    var data = state.weightHistory.slice().sort(function(a,b){ return a.date < b.date ? -1 : 1; });
    if(data.length < 1) return;
    var pad2 = { top:14, right:12, bottom:22, left:36 };
    var plotW = w - pad2.left - pad2.right, plotH = h - pad2.top - pad2.bottom;
    var weights = data.map(function(d){ return d.weight; });
    var maxW = Math.max.apply(null, weights.concat([state.weightStart||0, state.weightGoal||0])) + 2;
    var minW = Math.min.apply(null, weights.concat([state.weightStart||0, state.weightGoal||0])) - 2;
    function xFor(i){ return pad2.left + (data.length===1 ? plotW/2 : (i/(data.length-1))*plotW); }
    function yFor(val){ return pad2.top + (1 - (val-minW)/(maxW-minW)) * plotH; }
    ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 1;
    ctx.font = "10px -apple-system, sans-serif"; ctx.fillStyle = "#56637A";
    for(var g=0; g<=3; g++){
      var val = minW + (g/3)*(maxW-minW), yy = yFor(val);
      ctx.beginPath(); ctx.moveTo(pad2.left,yy); ctx.lineTo(w-pad2.right,yy); ctx.stroke();
      ctx.fillText(Math.round(val)+"kg", 2, yy+3);
    }
    if(state.weightGoal != null){
      var goalY = yFor(state.weightGoal);
      ctx.strokeStyle = "rgba(45,212,191,0.5)"; ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(pad2.left,goalY); ctx.lineTo(w-pad2.right,goalY); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.beginPath();
    data.forEach(function(d,i){ var x=xFor(i), y=yFor(d.weight); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
    ctx.strokeStyle = "#6366F1"; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.stroke();
    ctx.lineTo(xFor(data.length-1), pad2.top+plotH); ctx.lineTo(xFor(0), pad2.top+plotH); ctx.closePath();
    var grad = ctx.createLinearGradient(0,pad2.top,0,pad2.top+plotH);
    grad.addColorStop(0,"rgba(99,102,241,0.25)"); grad.addColorStop(1,"rgba(99,102,241,0)");
    ctx.fillStyle = grad; ctx.fill();
    data.forEach(function(d,i){
      var x=xFor(i), y=yFor(d.weight);
      ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fillStyle = "#05070A"; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = "#6366F1"; ctx.stroke();
    });
  }


  /* ============================================================
     RENDER - ESTATÍSTICAS
  ============================================================ */
  function renderStats(){
    var diasTotais = diffDays(state.installDate, todayStr()) + 1;
    var kmCaminhados = Math.round((state.totalMinCaminhada/60*5)*10)/10;
    var workoutCount=(state.workoutSessions&&state.workoutSessions.length)||Object.keys(state.workoutHistory||{}).filter(function(k){return state.workoutHistory[k]&&state.workoutHistory[k].completed;}).length;
    var nutritionDays=Object.keys(state.nutritionHistory||{}).filter(function(k){var n=state.nutritionHistory[k];return n&&(n.calories>0||n.protein>0);}).length;
    var avg7=(state.weightHistory||[]).slice().sort(function(a,b){return a.date<b.date?1:-1;}).slice(0,7); var avgW=avg7.length?Math.round(avg7.reduce(function(a,x){return a+Number(x.weight||0);},0)/avg7.length*10)/10:null;
    var rows = [
      ["Dias concluídos", state.totalDaysCompleted],
      ["Dias desde o início", diasTotais],
      ["Maior sequência", state.bestStreak + " dias"],
      ["Treinos de força", workoutCount],
      ["Dias com alimentação registrada", nutritionDays],
      ["Cardio acumulado", state.totalMinCaminhada + " min (" + kmCaminhados + " km aprox.)"],
      ["Água registrada em missões", (Math.round(state.totalAguaLitros*10)/10) + " L"],
      ["Média de peso 7 dias", avgW!=null?avgW+" kg":"--"],
      [(goalDirection()>0 ? "Peso ganho" : "Peso perdido"), weightChangedSoFar() + " kg"],
      ["XP total", state.totalXP]
    ];
    var list = document.getElementById("stats-list"); list.innerHTML = "";
    rows.forEach(function(r){var row=document.createElement("div");row.className="stats-row";row.innerHTML='<span class="s-label">'+r[0]+'</span><span class="s-value">'+r[1]+'</span>';list.appendChild(row);});
    renderWeekly();
  }

  /* ============================================================
     RENDER - MEDALHAS
  ============================================================ */
  function renderMedalhas(){
    document.getElementById("xp-num").textContent = state.totalXP;
    document.getElementById("lvl-emoji").textContent = levelEmoji(state.level);
    document.getElementById("lvl-name-big").textContent = levelName(state.level);
    document.getElementById("lvl-sub").textContent = "Nível " + state.level;

    var kmCaminhados = state.totalMinCaminhada/60*5;
    var workoutCount=(state.workoutSessions&&state.workoutSessions.length)||Object.keys(state.workoutHistory||{}).filter(function(k){return state.workoutHistory[k]&&state.workoutHistory[k].completed;}).length;
    var nutritionDays=Object.keys(state.nutritionHistory||{}).filter(function(k){var n=state.nutritionHistory[k];return n&&(n.calories>0||n.protein>0);}).length;
    var weeksCompleted = state.level - 1;
    var reachedGoal = state.weightGoal != null && ((goalDirection()>0 && state.weightCurrent >= state.weightGoal) || (goalDirection()<0 && state.weightCurrent <= state.weightGoal));

    var medals = [
      { emoji:"🥇", name:"Primeiro treino", desc:"Complete 1 dia", done: state.totalDaysCompleted >= 1 },
      { emoji:"📅", name:"Primeira semana", desc:"Complete uma fase de 7 dias", done: weeksCompleted >= 1 },
      { emoji:"🗓️", name:"Primeiro mês", desc:"30 dias ativos", done: state.totalDaysCompleted >= 30 },
      { emoji:"🏋️", name:"10 treinos de força", desc:"Complete 10 treinos", done: workoutCount >= 10 },
      { emoji:"🥗", name:"Nutrição consistente", desc:"Registre alimentação em 14 dias", done: nutritionDays >= 14 },
      { emoji:"🔥", name:"30 dias seguidos", desc:"Sequência de 30 dias", done: state.bestStreak >= 30 },
      { emoji:"💎", name:"90 dias seguidos", desc:"Sequência de 90 dias", done: state.bestStreak >= 90 },
      { emoji:"🏆", name:"Meta atingida", desc:"Chegue ao seu peso objetivo", done: reachedGoal }
    ];
    var grid = document.getElementById("medal-grid");
    grid.innerHTML = "";
    medals.forEach(function(medal){
      var div = document.createElement("div");
      div.className = "medal" + (medal.done ? "" : " locked");
      div.innerHTML =
        '<div class="m-emoji">' + (medal.done ? medal.emoji : "🔒") + '</div>' +
        '<div class="m-name">' + medal.name + '</div>' +
        '<div class="m-desc">' + (medal.done ? "Conquistada" : medal.desc) + '</div>';
      grid.appendChild(div);
    });
  }

  /* ============================================================
     NAVEGAÇÃO
  ============================================================ */
  var views = ["inicio","treino","nutricao","peso","mais","calendario","stats","medalhas"];
  document.querySelectorAll(".nav-btn").forEach(function(btn){
    btn.addEventListener("click", function(){
      var v = btn.getAttribute("data-view");
      views.forEach(function(name){ document.getElementById("view-"+name).classList.toggle("active", name===v); });
      document.querySelectorAll(".nav-btn").forEach(function(b){ b.classList.toggle("active", b===btn); });
      if(v==="calendario") renderCalendario();
      if(v==="peso"){ renderPeso(); renderMeasures(); }
      if(v==="treino") renderWorkout();
      if(v==="nutricao") renderV1Dashboard();
      if(v==="stats") renderStats();
      if(v==="medalhas") renderMedalhas();
    });
  });
  document.querySelectorAll('[data-go]').forEach(function(btn){btn.addEventListener('click',function(){var v=btn.getAttribute('data-go');views.forEach(function(name){document.getElementById('view-'+name).classList.toggle('active',name===v);});document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-view')==='mais');});if(v==='calendario')renderCalendario();if(v==='stats')renderStats();if(v==='medalhas')renderMedalhas();});});
  var moreSettings=document.getElementById('more-settings'); if(moreSettings) moreSettings.addEventListener('click',openSettingsModal);

  document.getElementById("btn-complete").addEventListener("click", completeMission);
  document.getElementById("btn-persist").addEventListener("click", activatePersistMode);

  document.getElementById("btn-save-weight").addEventListener("click", function(){
    var input = document.getElementById("weight-input");
    var val = parseFloat((input.value||"").replace(",","."));
    if(isNaN(val) || val<=0 || val>400){ showToast("Digite um peso válido"); return; }
    saveWeight(Math.round(val*10)/10);
    input.value = "";
  });

  var foodSearchInput=document.getElementById("food-search-input"),foodSearchClear=document.getElementById("food-search-clear"),foodQuantityInput=document.getElementById("food-quantity-input");
  if(foodSearchInput)foodSearchInput.addEventListener("input",function(){if(selectedCatalogFood&&normalizeFoodText(this.value)!==normalizeFoodText(selectedCatalogFood.name))selectedCatalogFood=null;var selected=document.getElementById("food-selected");if(selected&&!selectedCatalogFood)selected.hidden=true;renderFoodSuggestions(this.value);});
  if(foodSearchInput)foodSearchInput.addEventListener("focus",function(){renderFoodSuggestions(this.value);});
  if(foodSearchClear)foodSearchClear.addEventListener("click",function(){clearCatalogFood(true);if(foodSearchInput)foodSearchInput.focus();});
  if(foodQuantityInput)foodQuantityInput.addEventListener("input",applySelectedFood);
  renderFoodSuggestions("");

  document.querySelectorAll('[data-cal]').forEach(function(b){b.addEventListener('click',function(){ensureV1Fresh();var add=parseInt(b.getAttribute('data-cal'),10);state.dailyNutrition.calories+=add;var now=new Date();state.mealHistory[todayStr()].push({time:pad(now.getHours())+':'+pad(now.getMinutes()),name:'Ajuste rápido',label:'Ajuste rápido',type:'Outro',calories:add,protein:0,carbs:0,fat:0});updateAutoNutritionHabits();saveNutritionDay();save();renderV1Dashboard();renderInicio();});});
  document.querySelectorAll('[data-pro]').forEach(function(b){b.addEventListener('click',function(){ensureV1Fresh();var add=parseInt(b.getAttribute('data-pro'),10);state.dailyNutrition.protein+=add;var now=new Date();state.mealHistory[todayStr()].push({time:pad(now.getHours())+':'+pad(now.getMinutes()),name:'Ajuste rápido',label:'Ajuste rápido',type:'Outro',calories:0,protein:add,carbs:0,fat:0});updateAutoNutritionHabits();saveNutritionDay();save();renderV1Dashboard();renderInicio();});});
  document.getElementById('cal-reset').addEventListener('click',function(){ensureV1Fresh();state.dailyNutrition.calories=0;(state.mealHistory[todayStr()]||[]).forEach(function(m){m.calories=0;});state.mealHistory[todayStr()]=(state.mealHistory[todayStr()]||[]).filter(function(m){return (m.calories||0)>0||(m.protein||0)>0;});updateAutoNutritionHabits();saveNutritionDay();save();renderV1Dashboard();renderInicio();});
  document.getElementById('pro-reset').addEventListener('click',function(){ensureV1Fresh();state.dailyNutrition.protein=0;(state.mealHistory[todayStr()]||[]).forEach(function(m){m.protein=0;});state.mealHistory[todayStr()]=(state.mealHistory[todayStr()]||[]).filter(function(m){return (m.calories||0)>0||(m.protein||0)>0;});updateAutoNutritionHabits();saveNutritionDay();save();renderV1Dashboard();renderInicio();});
  document.getElementById('btn-add-meal').addEventListener('click',function(){
    ensureV1Fresh();
    var name=document.getElementById('meal-name-input').value.trim();
    var type=document.getElementById('meal-type-input').value||'Outro';
    var c=parseFloat(document.getElementById('meal-cal-input').value)||0;
    var p=parseFloat(document.getElementById('meal-pro-input').value)||0;
    var carb=parseFloat(document.getElementById('meal-carb-input').value)||0;
    var fat=parseFloat(document.getElementById('meal-fat-input').value)||0;
    if(c<=0&&p<=0&&carb<=0&&fat<=0&&!selectedCatalogFood){showToast('Informe pelo menos um valor nutricional');return;}
    if(!name)name=type;
    c=Math.max(0,Math.round(c));p=Math.max(0,Math.round(p*10)/10);carb=Math.max(0,Math.round(carb*10)/10);fat=Math.max(0,Math.round(fat*10)/10);
    var arr=state.mealHistory[selectedNutritionDate]||[];
    if(mealEditIndex!==null && arr[mealEditIndex]){
      var old=arr[mealEditIndex];
      arr[mealEditIndex]={time:old.time||pad(new Date().getHours())+':'+pad(new Date().getMinutes()),name:name,label:name,type:type,calories:c,protein:p,carbs:carb,fat:fat,catalogPortion:selectedCatalogFood?selectedCatalogFood.portion:null,catalogQuantity:selectedCatalogFood?foodQuantity():null};
      showToast('Refeição atualizada');
    }else{
      var now=new Date();
      arr.push({time:pad(now.getHours())+':'+pad(now.getMinutes()),name:name,label:name,type:type,calories:c,protein:p,carbs:carb,fat:fat,catalogPortion:selectedCatalogFood?selectedCatalogFood.portion:null,catalogQuantity:selectedCatalogFood?foodQuantity():null});
      showToast('Refeição adicionada');
    }
    state.mealHistory[selectedNutritionDate]=arr; recalcNutritionDate(selectedNutritionDate); clearMealForm();
    renderNutritionSelectedDay(); renderMealHistory(); renderNutritionWeek();
    if(selectedNutritionDate===todayStr()){renderV1Dashboard();renderInicio();}
  });
  var cancelMealEdit=document.getElementById('btn-cancel-meal-edit');
  if(cancelMealEdit)cancelMealEdit.addEventListener('click',clearMealForm);
  var editWorkoutBtn=document.getElementById('btn-edit-workout'); if(editWorkoutBtn)editWorkoutBtn.addEventListener('click',openWorkoutEditor);
  var resetWorkoutBtn=document.getElementById('btn-reset-workout'); if(resetWorkoutBtn)resetWorkoutBtn.addEventListener('click',resetCurrentWorkout);
  var closeWorkoutEditorBtn=document.getElementById('btn-close-workout-editor'); if(closeWorkoutEditorBtn)closeWorkoutEditorBtn.addEventListener('click',closeWorkoutEditor);
  var editorAddBtn=document.getElementById('btn-editor-add'); if(editorAddBtn)editorAddBtn.addEventListener('click',function(){showExerciseEditorForm(null);});
  var editorCancelBtn=document.getElementById('btn-editor-cancel'); if(editorCancelBtn)editorCancelBtn.addEventListener('click',hideExerciseEditorForm);
  var editorSaveBtn=document.getElementById('btn-editor-save'); if(editorSaveBtn)editorSaveBtn.addEventListener('click',saveExerciseFromEditor);
  var workoutEditorModal=document.getElementById('workout-editor-modal'); if(workoutEditorModal)workoutEditorModal.addEventListener('click',function(ev){if(ev.target===workoutEditorModal)closeWorkoutEditor();});
  var finishWorkoutBtn=document.getElementById('btn-finish-workout'); if(finishWorkoutBtn) finishWorkoutBtn.addEventListener('click',finishWorkoutSession);
  function saveHabitNumbers(kind,quiet){
    ensureV1Fresh();var si=document.getElementById('steps-input'),sl=document.getElementById('sleep-input'),message='';
    if(kind==='steps'){
      if(!si||String(si.value).trim()===''){if(!quiet)showToast('Digite a quantidade de passos');return false;}
      var sv=parseInt(si.value,10);if(isNaN(sv)||sv<0||sv>200000){showToast('Digite uma quantidade válida de passos');return false;}
      state.todayHabits.stepsCount=Math.round(sv);message=state.todayHabits.stepsCount.toLocaleString('pt-BR')+' passos salvos';
    }
    if(kind==='sleep'){
      if(!sl||String(sl.value).trim()===''){if(!quiet)showToast('Digite as horas de sono');return false;}
      var sh=parseFloat(String(sl.value).replace(',','.'));if(isNaN(sh)||sh<0||sh>14){showToast('Informe um sono entre 0 e 14 horas');return false;}
      state.todayHabits.sleepHours=Math.round(sh*10)/10;message=String(state.todayHabits.sleepHours).replace('.',',')+' h de sono salvas';
    }
    updateAutoNutritionHabits();state.habitHistory[todayStr()]=Object.assign({},state.todayHabits);save();renderV1Dashboard();renderInicio();
    var status=document.getElementById('habit-save-status');if(status){status.textContent='✓ '+message;status.classList.add('saved');setTimeout(function(){status.classList.remove('saved');},1800);}
    if(!quiet)showToast(message);return true;
  }
  var stepsInput=document.getElementById('steps-input'),sleepInput=document.getElementById('sleep-input');
  document.querySelectorAll('[data-save-habit]').forEach(function(button){button.addEventListener('click',function(){saveHabitNumbers(button.getAttribute('data-save-habit'),false);});});
  if(stepsInput){stepsInput.addEventListener('change',function(){saveHabitNumbers('steps',true);});stepsInput.addEventListener('keydown',function(event){if(event.key==='Enter'){event.preventDefault();saveHabitNumbers('steps',false);stepsInput.blur();}});}
  if(sleepInput){sleepInput.addEventListener('change',function(){saveHabitNumbers('sleep',true);});sleepInput.addEventListener('keydown',function(event){if(event.key==='Enter'){event.preventDefault();saveHabitNumbers('sleep',false);sleepInput.blur();}});}
  document.getElementById('btn-save-measures').addEventListener('click',function(){
    var ids={waist:'m-waist',abdomen:'m-abdomen',chest:'m-chest',arm:'m-arm',thigh:'m-thigh',hip:'m-hip'},m={date:measureEditDate||todayStr()},any=false;
    Object.keys(ids).forEach(function(k){var v=parseFloat((document.getElementById(ids[k]).value||'').replace(',','.'));if(!isNaN(v)&&v>0){m[k]=Math.round(v*10)/10;any=true;}});
    if(!any){showToast('Preencha pelo menos uma medida');return;}
    state.measurements=state.measurements||[];
    var idx=state.measurements.findIndex(function(x){return x.date===m.date;});
    if(idx>=0)state.measurements[idx]=m;else state.measurements.push(m);
    measureEditDate=null;Object.keys(ids).forEach(function(k){document.getElementById(ids[k]).value='';});
    document.getElementById("btn-save-measures").textContent="Salvar medidas";
    save();renderMeasures();showToast('Medidas salvas');
  });

  document.getElementById('btn-export-data').addEventListener('click',function(){var blob=new Blob([JSON.stringify({app:'EVOLUÇÃO V1',exportedAt:new Date().toISOString(),data:state},null,2)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='evolucao-v1-backup-'+todayStr()+'.json';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},300);showToast('Backup exportado');});
  document.getElementById('btn-import-data').addEventListener('click',function(){document.getElementById('import-file').click();});
  document.getElementById('import-file').addEventListener('change',function(){
    var f=this.files&&this.files[0];if(!f)return;
    var r=new FileReader();
    r.onload=function(){
      try{
        var obj=JSON.parse(r.result),d=obj&&obj.data?obj.data:obj;
        if(!d||typeof d!=="object")throw new Error("invalid");
        d=hydrateState(d);
        var payload=JSON.stringify(d);
        localStorage.setItem(EVOLUCAO_STORAGE_KEY,payload);
        localStorage.setItem(STORAGE_KEY,payload);
        showToast('Backup importado. Recarregando…');
        setTimeout(function(){location.reload();},600);
      }catch(e){showToast('Arquivo de backup inválido');}
    };
    r.readAsText(f);this.value='';
  });

  /* ---------- AÇÃO RÁPIDA MOBILE ---------- */
  var quickFab=document.getElementById('quick-fab');
  var quickOverlay=document.getElementById('quick-sheet-overlay');
  var quickFabLabel=document.getElementById('quick-fab-label');
  function setQuickOpen(open){
    if(!quickFab||!quickOverlay)return;
    quickOverlay.classList.toggle('show',!!open);
    quickOverlay.setAttribute('aria-hidden',open?'false':'true');
    quickFab.classList.toggle('open',!!open);
    quickFab.setAttribute('aria-expanded',open?'true':'false');
    if(quickFabLabel)quickFabLabel.style.display=open?'none':'';
  }
  function goMainView(v){
    var btn=document.querySelector('.nav-btn[data-view="'+v+'"]');
    if(btn){btn.click();return;}
    views.forEach(function(name){var el=document.getElementById('view-'+name);if(el)el.classList.toggle('active',name===v);});
  }
  if(quickFab)quickFab.addEventListener('click',function(){setQuickOpen(!quickOverlay.classList.contains('show'));});
  if(quickOverlay)quickOverlay.addEventListener('click',function(ev){if(ev.target===quickOverlay)setQuickOpen(false);});
  document.querySelectorAll('[data-quick]').forEach(function(btn){btn.addEventListener('click',function(){
    var action=btn.getAttribute('data-quick');setQuickOpen(false);
    if(action==='workout'){goMainView('treino');setTimeout(function(){var el=document.querySelector('#view-treino .workout-card');if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},80);}
    else if(action==='meal'){goMainView('nutricao');setTimeout(function(){var el=document.getElementById('meal-cal-input');if(el){el.focus();el.scrollIntoView({behavior:'smooth',block:'center'});}},100);}
    else if(action==='weight'){goMainView('peso');setTimeout(function(){var el=document.getElementById('weight-input');if(el){el.focus();el.scrollIntoView({behavior:'smooth',block:'center'});}},100);}
    else if(action==='water'){
      ensureTodayChecksFresh();
      if(isTodayCompleted()){showToast('Missão de hoje já concluída');return;}
      var goal=waterCupsGoal(),cur=state.todayChecks.aguaCups||0;
      if(cur>=goal){showToast('Meta de água já concluída 💧');return;}
      tapCup(cur);
      showToast('Água registrada · '+Math.min((cur+1)*WATER_CUP_ML,goal*WATER_CUP_ML)+' / '+(goal*WATER_CUP_ML)+' ml');
      renderQuickActionState();
    }
  });});
  function renderQuickActionState(){
    var w=document.getElementById('quick-water');if(!w)return;
    var done=(state.todayChecks&&state.todayChecks.aguaCups>=waterCupsGoal());w.classList.toggle('water-done',!!done);
    var lbl=w.querySelector('.qa-label');if(lbl)lbl.textContent=done?'Água ✓':'Água';
  }

  /* ============================================================
     TOAST / MODAL / FEEDBACK
  ============================================================ */
  function showToast(msg){
    var c = document.getElementById("toast-container");
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg; c.appendChild(t);
    setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 2800);
  }
  var luModal = document.getElementById("levelup-modal");
  function showLevelUpModal(newLevel){
    document.getElementById("lu-emoji").textContent = levelEmoji(newLevel);
    document.getElementById("lu-title").textContent = "Nível " + newLevel + ": " + levelName(newLevel) + "!";
    var idx = Math.min(newLevel-1, 3);
    var mins = newLevel<=4 ? BASE_MINUTES[newLevel-1] : Math.min(20+(newLevel-4)*5, state.maxMinutesCap);
    document.getElementById("lu-desc").textContent = state.goalType === "massa" ? "Você completou 7 dias e ganhou 500 XP. Continue progredindo no treino, proteína e recuperação." : "Você completou 7 dias e ganhou 500 XP. Nova meta de cardio: " + mins + " minutos, mantendo proteína, passos e sono.";
    luModal.classList.add("show");
  }
  document.getElementById("lu-close").addEventListener("click", function(){ luModal.classList.remove("show"); });

  function fireVibration(pattern){ try{ if(navigator.vibrate) navigator.vibrate(pattern); }catch(e){} }
  var audioCtx = null;
  function playSound(big){
    try{
      if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var notes = big ? [523.25,659.25,783.99,1046.5] : [523.25,659.25,783.99];
      var t0 = audioCtx.currentTime;
      notes.forEach(function(freq,i){
        var osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        osc.type = "sine"; osc.frequency.value = freq;
        var start = t0 + i*0.11;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.22, start+0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start+0.28);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(start); osc.stop(start+0.3);
      });
    }catch(e){}
  }

  document.querySelectorAll(".mode-btn").forEach(function(btn){
    btn.addEventListener("click", function(){
      var mode=btn.getAttribute("data-mode");
      if(mode===state.goalType) return;
      state.goalType=mode; state.stepsTarget = mode==="massa" ? 6500 : 8000;
      if(mode==="emagrecer" && state.weightCurrent!=null && state.weightGoal>=state.weightCurrent) state.weightGoal=Math.max(40, Math.round((state.weightCurrent*0.88)*10)/10);
      if(mode==="massa" && state.weightCurrent!=null && state.weightGoal<=state.weightCurrent) state.weightGoal=Math.round((state.weightCurrent*1.05)*10)/10;
      save(); renderInicio(); renderPeso(); renderStats(); showToast(mode==="massa" ? "Fase de ganho de massa ativada" : "Fase de emagrecimento ativada");
    });
  });

  /* ---------- configurações ---------- */
  var settingsModal = document.getElementById("settings-modal");
  function selectGoalChip(gridId, goal){
    document.querySelectorAll("#"+gridId+" .goal-chip").forEach(function(chip){
      chip.classList.toggle("selected", chip.getAttribute("data-goal")===goal);
    });
  }
  document.querySelectorAll("#cfg-goal-grid .goal-chip").forEach(function(chip){
    chip.addEventListener("click", function(){ selectGoalChip("cfg-goal-grid", chip.getAttribute("data-goal")); });
  });
  function openSettingsModal(){
    document.getElementById("cfg-name").value = state.name || "";
    document.getElementById("cfg-age").value = state.age || "";
    document.getElementById("cfg-height").value = state.heightCm || "";
    document.getElementById("cfg-sex").value = state.sex || "O";
    var ctp=document.getElementById("cfg-training-priority");if(ctp)ctp.value=state.trainingPriority||"geral";
    document.getElementById("cfg-weight-start").value = state.weightStart || "";
    document.getElementById("cfg-weight-goal").value = state.weightGoal || "";
    document.getElementById("cfg-activity").value = state.activityLevel || "moderado"; document.getElementById("cfg-steps").value = state.stepsTarget || 8000; document.getElementById("cfg-sleep").value = state.sleepTargetH || 8;
    document.getElementById("cfg-max-min").value = state.maxMinutesCap;
    document.getElementById("cfg-water").value = state.waterTargetMl;
    document.getElementById("cfg-reminder-time").value = state.reminderTime;
    document.getElementById("cfg-reminder-enabled").checked = !!state.reminderEnabled;
    document.getElementById("cfg-nutrition-reminder-time").value = state.nutritionReminderTime || "13:00";
    document.getElementById("cfg-nutrition-reminder-enabled").checked = !!state.nutritionReminderEnabled;
    document.getElementById("cfg-water-reminder-time").value = state.waterReminderTime || "16:00";
    document.getElementById("cfg-water-reminder-enabled").checked = !!state.waterReminderEnabled;
    document.getElementById("cfg-smart-reminder-interval").value=state.smartReminderIntervalMin||60;
    document.getElementById("cfg-quiet-enabled").checked=state.quietHoursEnabled!==false;
    document.getElementById("cfg-quiet-start").value=state.quietStart||"22:00"; document.getElementById("cfg-quiet-end").value=state.quietEnd||"07:00";
    document.getElementById("cfg-workout-reminder-enabled").checked=!!state.workoutReminderEnabled; document.getElementById("cfg-workout-reminder-time").value=state.workoutReminderTime||"18:00";
    document.getElementById("cfg-steps-reminder-enabled").checked=!!state.stepsReminderEnabled; document.getElementById("cfg-steps-reminder-time").value=state.stepsReminderTime||"19:30";
    document.getElementById("cfg-sleep-reminder-enabled").checked=!!state.sleepReminderEnabled; document.getElementById("cfg-sleep-reminder-time").value=state.sleepReminderTime||"21:30";
    document.getElementById("cfg-weekly-workouts").value=state.weeklyWorkoutTarget||4;
    document.getElementById("cfg-weekly-protein-days").value=state.weeklyProteinDaysTarget||5;
    document.getElementById("cfg-weekly-weighins").value=state.weeklyWeighinsTarget||3;
    document.getElementById("cfg-smart-alert-time").value=state.smartAlertTime||"18:30";
    document.getElementById("cfg-smart-alert-enabled").checked=!!state.smartAlertsEnabled;
    document.getElementById("cfg-manual-nutrition").checked=!!state.manualNutritionTargets;
    document.getElementById("cfg-manual-calories").value=state.manualCalories||"";
    document.getElementById("cfg-manual-protein").value=state.manualProtein||"";
    document.getElementById("cfg-manual-carbs").value=state.manualCarbs!=null?state.manualCarbs:"";
    document.getElementById("cfg-manual-fat").value=state.manualFat!=null?state.manualFat:"";
    selectGoalChip("cfg-goal-grid", state.goalType);
    settingsModal.classList.add("show");
  }
  function closeSettingsModal(){ settingsModal.classList.remove("show"); }
  document.getElementById("btn-settings").addEventListener("click", openSettingsModal);
  document.getElementById("btn-close-settings").addEventListener("click", closeSettingsModal);

  document.getElementById("btn-save-settings").addEventListener("click", function(){
    var name = document.getElementById("cfg-name").value.trim().slice(0,20);
    var age = parseInt(document.getElementById("cfg-age").value,10);
    var height = parseFloat(document.getElementById("cfg-height").value);
    var sex = document.getElementById("cfg-sex").value || "O";
    var trainingPriority=(document.getElementById("cfg-training-priority")||{}).value||"geral";
    var wStart = parseFloat((document.getElementById("cfg-weight-start").value||"").toString().replace(",","."));
    var wGoal = parseFloat((document.getElementById("cfg-weight-goal").value||"").toString().replace(",","."));
    var activity = document.getElementById("cfg-activity").value || "moderado"; var stepsGoal=parseInt(document.getElementById("cfg-steps").value,10); var sleepGoal=parseFloat(document.getElementById("cfg-sleep").value);
    var maxMin = parseInt(document.getElementById("cfg-max-min").value,10);
    var waterMl = parseInt(document.getElementById("cfg-water").value,10);
    var remTime = document.getElementById("cfg-reminder-time").value || "19:00";
    var remEnabled = document.getElementById("cfg-reminder-enabled").checked;
    var nutritionRemTime=document.getElementById("cfg-nutrition-reminder-time").value||"13:00";
    var nutritionRemEnabled=document.getElementById("cfg-nutrition-reminder-enabled").checked;
    var waterRemTime=document.getElementById("cfg-water-reminder-time").value||"16:00";
    var waterRemEnabled=document.getElementById("cfg-water-reminder-enabled").checked;
    var smartReminderIntervalMin=parseInt(document.getElementById("cfg-smart-reminder-interval").value,10)||60,quietHoursEnabled=document.getElementById("cfg-quiet-enabled").checked,quietStart=document.getElementById("cfg-quiet-start").value||"22:00",quietEnd=document.getElementById("cfg-quiet-end").value||"07:00";
    var workoutReminderEnabled=document.getElementById("cfg-workout-reminder-enabled").checked,workoutReminderTime=document.getElementById("cfg-workout-reminder-time").value||"18:00",stepsReminderEnabled=document.getElementById("cfg-steps-reminder-enabled").checked,stepsReminderTime=document.getElementById("cfg-steps-reminder-time").value||"19:30",sleepReminderEnabled=document.getElementById("cfg-sleep-reminder-enabled").checked,sleepReminderTime=document.getElementById("cfg-sleep-reminder-time").value||"21:30";
    var weeklyWorkoutTarget=parseInt(document.getElementById("cfg-weekly-workouts").value,10),weeklyProteinDaysTarget=parseInt(document.getElementById("cfg-weekly-protein-days").value,10),weeklyWeighinsTarget=parseInt(document.getElementById("cfg-weekly-weighins").value,10),smartAlertTime=document.getElementById("cfg-smart-alert-time").value||"18:30",smartAlertsEnabled=document.getElementById("cfg-smart-alert-enabled").checked;
    var manualNutritionTargets=document.getElementById("cfg-manual-nutrition").checked;
    var manualCalories=parseFloat(document.getElementById("cfg-manual-calories").value)||null;
    var manualProtein=parseFloat(document.getElementById("cfg-manual-protein").value)||null;
    var manualCarbs=document.getElementById("cfg-manual-carbs").value===""?null:parseFloat(document.getElementById("cfg-manual-carbs").value);
    var manualFat=document.getElementById("cfg-manual-fat").value===""?null:parseFloat(document.getElementById("cfg-manual-fat").value);
    var selectedChip = document.querySelector("#cfg-goal-grid .goal-chip.selected");
    var goalType = selectedChip ? selectedChip.getAttribute("data-goal") : state.goalType;

    if(name.length<2){showToast("Nome inválido");return;}
    if(isNaN(age)||age<10||age>100){showToast("Idade inválida");return;}
    if(isNaN(height)||height<100||height>250){showToast("Altura inválida");return;}
    if(isNaN(wStart) || wStart<=0 || wStart>400){ showToast("Peso inicial inválido"); return; }
    if(isNaN(wGoal) || wGoal<=0 || wGoal>400){ showToast("Meta inválida"); return; }
    if(goalType==="emagrecer"&&wGoal>=wStart){showToast("No emagrecimento, a meta precisa ser menor que o peso inicial");return;}
    if(goalType==="massa"&&wGoal<=wStart){showToast("No ganho de massa, a meta precisa ser maior que o peso inicial");return;}
    if(isNaN(stepsGoal)||stepsGoal<1000||stepsGoal>30000){showToast("Meta de passos inválida");return;} if(isNaN(sleepGoal)||sleepGoal<5||sleepGoal>12){showToast("Meta de sono inválida");return;}
    if(isNaN(maxMin) || maxMin<15 || maxMin>120){ showToast("Máximo de minutos inválido"); return; }
    if(isNaN(waterMl) || waterMl<500 || waterMl>6000){ showToast("Meta de água inválida"); return; }
    if(isNaN(weeklyWorkoutTarget)||weeklyWorkoutTarget<1||weeklyWorkoutTarget>7){showToast("Meta semanal de treinos inválida");return;}
    if(isNaN(weeklyProteinDaysTarget)||weeklyProteinDaysTarget<1||weeklyProteinDaysTarget>7){showToast("Meta semanal de proteína inválida");return;}
    if(isNaN(weeklyWeighinsTarget)||weeklyWeighinsTarget<1||weeklyWeighinsTarget>7){showToast("Meta semanal de pesagens inválida");return;}

    var onlyDefaultEntry = state.weightHistory.length <= 1;
    state.name = name;
    if(!isNaN(age)) state.age = age;
    if(!isNaN(height)) state.heightCm = height;
    var workoutProfileChanged=(state.sex!==sex)||(state.trainingPriority!==trainingPriority);
    state.sex = sex;state.trainingPriority=trainingPriority;
    if(workoutProfileChanged&&confirm("Aplicar uma nova ficha padrão compatível com seu perfil? Isso substitui a ficha atual, mas mantém o histórico."))applyProfileWorkoutPreset(true);
    state.weightStart = Math.round(wStart*10)/10;
    state.weightGoal = Math.round(wGoal*10)/10;
    state.activityLevel=activity; state.stepsTarget=stepsGoal; state.sleepTargetH=Math.round(sleepGoal*10)/10;
    state.maxMinutesCap = maxMin;
    state.waterTargetMl = waterMl;
    state.reminderTime = remTime;
    state.reminderEnabled = remEnabled;
    state.nutritionReminderTime=nutritionRemTime; state.nutritionReminderEnabled=nutritionRemEnabled;
    state.waterReminderTime=waterRemTime; state.waterReminderEnabled=waterRemEnabled;
    state.smartReminderIntervalMin=smartReminderIntervalMin; state.quietHoursEnabled=quietHoursEnabled; state.quietStart=quietStart; state.quietEnd=quietEnd;
    state.workoutReminderEnabled=workoutReminderEnabled; state.workoutReminderTime=workoutReminderTime; state.stepsReminderEnabled=stepsReminderEnabled; state.stepsReminderTime=stepsReminderTime; state.sleepReminderEnabled=sleepReminderEnabled; state.sleepReminderTime=sleepReminderTime;
    state.weeklyWorkoutTarget=weeklyWorkoutTarget;state.weeklyProteinDaysTarget=weeklyProteinDaysTarget;state.weeklyWeighinsTarget=weeklyWeighinsTarget;state.smartAlertTime=smartAlertTime;state.smartAlertsEnabled=smartAlertsEnabled;
    state.manualNutritionTargets=manualNutritionTargets;state.manualCalories=manualCalories;state.manualProtein=manualProtein;state.manualCarbs=manualCarbs;state.manualFat=manualFat;
    state.goalType = goalType;

    if(onlyDefaultEntry){
      state.weightCurrent = state.weightStart;
      state.weightHistory = [{ date: todayStr(), weight: state.weightStart }];
    }

    if(remEnabled && "Notification" in window && Notification.permission === "default"){ Notification.requestPermission(); }

    save();
    closeSettingsModal();
    renderGreeting(); renderInicio(); renderPeso(); renderStats(); renderMedalhas();
    showToast("Perfil atualizado");
  });


  var restartOnboardingBtn=document.getElementById("btn-restart-onboarding");
  if(restartOnboardingBtn)restartOnboardingBtn.addEventListener("click",function(){
    state.onboarded=false;save();closeSettingsModal();
    document.getElementById("ob-name").value=state.name||"";
    document.getElementById("ob-age").value=state.age||"";
    document.getElementById("ob-height").value=state.heightCm||"";
    document.getElementById("ob-sex").value=state.sex||"O";
    obSelectedGoal=state.goalType||"emagrecer";
    selectGoalChip("ob-goal-grid",obSelectedGoal);
    obShowStep(2);obModal.classList.add("show");
  });
  var resetProfileBtn=document.getElementById("btn-reset-profile");
  if(resetProfileBtn)resetProfileBtn.addEventListener("click",function(){
    if(!confirm("Apagar todo o progresso, treinos, refeições, medidas e perfil deste aparelho?"))return;
    localStorage.removeItem(EVOLUCAO_STORAGE_KEY);localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });


  var renameWorkoutBtn=document.getElementById("btn-rename-workout");
  if(renameWorkoutBtn)renameWorkoutBtn.addEventListener("click",function(){
    ensureV1Fresh();var plan=state.workoutToday.plan;
    if((state.workoutSplit||"ABC")!=="CUSTOM"){showToast("Renomear dias está disponível na divisão Personalizado");return;}
    var current=planDisplayName(plan),name=prompt("Nome deste dia de treino:",current);
    if(name===null)return;name=name.trim().slice(0,24);if(!name){showToast("Nome inválido");return;}
    state.customPlanNames=state.customPlanNames||{};state.customPlanNames[plan]=name;save();renderWorkout();
  });


  var currentWorkoutDetailId=null;
  function openWorkoutSessionDetail(id){
    var s=(state.workoutSessions||[]).filter(function(x){return x.id===id;})[0];if(!s)return;
    currentWorkoutDetailId=id;
    document.getElementById("workout-detail-title").textContent=s.name||"Treino";
    document.getElementById("workout-detail-date").textContent=(s.date||"").split("-").reverse().join("/")+(s.time?" · "+s.time:"");
    var body=document.getElementById("workout-detail-body");body.innerHTML="";
    (s.details||[]).forEach(function(ex){
      var card=document.createElement("div");card.className="workout-detail-ex";
      var sets=(ex.sets||[]).map(function(st,i){return '<span>S'+(i+1)+' · '+Number(st.load||0)+' kg × '+Number(st.reps||0)+'</span>';}).join("");
      card.innerHTML='<div><b>'+escapeHtml(ex.name||"Exercício")+'</b><small>'+Number(ex.volume||0)+' kg de volume</small></div><div class="detail-set-list">'+(sets||'<span>Sem séries registradas</span>')+'</div>';
      body.appendChild(card);
    });
    document.getElementById("workout-detail-modal").classList.add("show");
  }
  document.getElementById("btn-close-workout-detail").addEventListener("click",function(){document.getElementById("workout-detail-modal").classList.remove("show");});
  document.getElementById("btn-delete-workout-session").addEventListener("click",function(){
    if(!currentWorkoutDetailId||!confirm("Excluir esta sessão do histórico?"))return;
    state.workoutSessions=(state.workoutSessions||[]).filter(function(x){return x.id!==currentWorkoutDetailId;});
    Object.keys(state.workoutHistory||{}).forEach(function(k){
      if(state.workoutHistory[k]&&state.workoutHistory[k].lastSessionId===currentWorkoutDetailId){
        delete state.workoutHistory[k].lastSessionId;
      }
    });
    save();document.getElementById("workout-detail-modal").classList.remove("show");renderWorkoutHistory();renderStats();renderWeekly();showToast("Sessão excluída");
  });

  var measureChartType=document.getElementById("measure-chart-type");
  if(measureChartType)measureChartType.addEventListener("change",renderMeasureChart);

  /* ---------- cronômetro embutido ---------- */
  var timerModal = document.getElementById("timer-modal");
  var timerState = { key:null, remaining:0, total:0, paused:false, handle:null };
  function formatClock(sec){ var m=Math.floor(sec/60), s=sec%60; return pad(m)+":"+pad(s); }
  function openTimer(key, seconds, name){
    clearInterval(timerState.handle);
    timerState.key=key; timerState.remaining=seconds; timerState.total=seconds; timerState.paused=false;
    document.getElementById("timer-activity").textContent = name;
    document.getElementById("timer-clock").textContent = formatClock(seconds);
    document.getElementById("timer-pause").textContent = "Pausar";
    timerModal.classList.add("show");
    timerState.handle = setInterval(tickTimer, 1000);
  }
  function tickTimer(){
    if(timerState.paused) return;
    timerState.remaining -= 1;
    document.getElementById("timer-clock").textContent = formatClock(Math.max(timerState.remaining,0));
    if(timerState.remaining <= 0){
      clearInterval(timerState.handle);
      timerModal.classList.remove("show");
      if(timerState.key && !isTodayCompleted()){ state.todayChecks[timerState.key] = true; save(); renderInicio(); }
      fireVibration([120,60,120]); playSound(false);
      showToast("Tempo concluído! ✅");
    }
  }
  document.getElementById("timer-pause").addEventListener("click", function(){
    timerState.paused = !timerState.paused;
    this.textContent = timerState.paused ? "Retomar" : "Pausar";
  });
  document.getElementById("timer-stop").addEventListener("click", function(){
    clearInterval(timerState.handle);
    timerModal.classList.remove("show");
  });

  /* ---------- lembretes inteligentes locais ---------- */
  function minutesNow(d){return d.getHours()*60+d.getMinutes();}
  function hmMinutes(v){var a=(v||"00:00").split(":");return (parseInt(a[0],10)||0)*60+(parseInt(a[1],10)||0);}
  function inQuietHours(now){if(state.quietHoursEnabled===false)return false;var n=minutesNow(now),a=hmMinutes(state.quietStart||"22:00"),b=hmMinutes(state.quietEnd||"07:00");return a===b?false:(a<b?n>=a&&n<b:n>=a||n<b);}
  function reminderKey(kind){return todayStr()+":"+kind;}
  function canRepeatReminder(kind,value){
    state.reminderLog=state.reminderLog||{}; state.reminderLastValues=state.reminderLastValues||{};
    var key=reminderKey(kind),last=Number(state.reminderLog[key]||0),gap=(state.smartReminderIntervalMin||60)*60000,hasValue=Object.prototype.hasOwnProperty.call(state.reminderLastValues,kind),changed=hasValue&&state.reminderLastValues[kind]!==value;
    // Progresso real adia a próxima cobrança em vez de disparar outra imediatamente.
    if(changed){state.reminderLastValues[kind]=value;state.reminderLog[key]=Date.now();save();return false;}
    return !last||(Date.now()-last>=gap);
  }
  function markReminder(kind,value){state.reminderLog=state.reminderLog||{};state.reminderLastValues=state.reminderLastValues||{};state.reminderLog[reminderKey(kind)]=Date.now();state.reminderLastValues[kind]=value;var prefix=todayStr()+":";Object.keys(state.reminderLog).forEach(function(k){if(k.indexOf(prefix)!==0)delete state.reminderLog[k];});save();}
  function sendLocalReminder(title,msg,tag,url,actions){
    if("Notification" in window && Notification.permission==="granted"){
      try{if(navigator.serviceWorker&&navigator.serviceWorker.ready){navigator.serviceWorker.ready.then(function(reg){reg.showNotification(title,{body:msg,icon:"icons/icon-192.png",badge:"icons/icon-192.png",tag:tag,renotify:false,data:{url:url||"./index.html"},actions:actions||[]});}).catch(function(){new Notification(title,{body:msg});});}else new Notification(title,{body:msg});}catch(e){}
    }
    showToast("⏰ "+msg); fireVibration([80,40,80]);
  }
  function smartNotify(kind,title,msg,value,url,actions){if(!canRepeatReminder(kind,value))return false;markReminder(kind,value);sendLocalReminder(title,msg,"evolucao-"+kind,url,actions);return true;}
  function reminderPriority(kind,progressRatio,minutesLate){
    var base={treino:95,passos:80,nutricao:76,sono:72,missao:68,agua:60,semana:45}[kind]||40;
    if(typeof progressRatio==="number")base+=Math.round((1-Math.max(0,Math.min(1,progressRatio)))*25);
    base+=Math.min(20,Math.floor(Math.max(0,minutesLate)/60)*4); return base;
  }
  function checkReminders(){
    var t=todayStr(),now=new Date(),nowHM=pad(now.getHours())+":"+pad(now.getMinutes()); if(inQuietHours(now))return;
    var candidates=[],nowMin=minutesNow(now),meals=(state.mealHistory&&state.mealHistory[t])||[];
    function add(kind,title,msg,value,url,time,ratio,actions){if(nowHM<time)return;candidates.push({kind:kind,title:title,msg:msg,value:value,url:url,time:time,actions:actions||[],score:reminderPriority(kind,ratio,nowMin-hmMinutes(time))});}
    if(state.reminderEnabled&&!isTodayCompleted())add("missao","EVOLUÇÃO","Sua missão de hoje ainda não foi concluída.","pending","./index.html?action=today",state.reminderTime||"19:00",0);
    if(state.nutritionReminderEnabled&&meals.length===0)add("nutricao","EVOLUÇÃO · Nutrição","Você ainda não registrou uma refeição hoje.",0,"./index.html?action=nutrition",state.nutritionReminderTime||"13:00",0,[{action:"nutrition",title:"Registrar refeição"},{action:"later",title:"Lembrar depois"}]);
    var cups=(state.todayChecks&&state.todayChecks.aguaCups)||0,goal=waterCupsGoal(),ml=cups*WATER_CUP_ML,target=goal*WATER_CUP_ML;
    if(state.waterReminderEnabled&&cups<goal)add("agua","EVOLUÇÃO · Água",ml?"Você ainda está em "+ml+" / "+target+" ml. Que tal mais um copo?":"Sua meta é "+target+" ml. Comece com um copo de água.",cups,"./index.html?action=water",state.waterReminderTime||"08:00",goal?cups/goal:0,[{action:"add-water",title:"+250 ml"},{action:"later",title:"Lembrar depois"}]);
    if(state.workoutReminderEnabled&&!state.todayHabits.treino&&!isAnyWorkoutCompleteToday())add("treino","EVOLUÇÃO · Treino","Seu treino de hoje ainda está esperando por você.","pending","./index.html?action=workout",state.workoutReminderTime||"18:00",0,[{action:"workout",title:"Começar treino"},{action:"later",title:"Lembrar depois"}]);
    var steps=(state.todayHabits&&state.todayHabits.stepsCount)||0,stepsGoal=state.stepsTarget||8000;
    if(state.stepsReminderEnabled&&steps<stepsGoal)add("passos","EVOLUÇÃO · Passos","Você está em "+steps.toLocaleString("pt-BR")+" de "+stepsGoal.toLocaleString("pt-BR")+" passos. Faltam "+(stepsGoal-steps).toLocaleString("pt-BR")+".",steps,"./index.html?action=today",state.stepsReminderTime||"19:30",stepsGoal?steps/stepsGoal:0);
    var sleep=(state.todayHabits&&state.todayHabits.sleepHours)||0;
    if(state.sleepReminderEnabled&&sleep<=0)add("sono","EVOLUÇÃO · Sono","Seu registro de sono ainda está pendente. Preparar o descanso também faz parte da evolução.",0,"./index.html?action=today",state.sleepReminderTime||"21:30",0);
    if(state.smartAlertsEnabled&&nowHM>=(state.smartAlertTime||"18:30")){var wa=smartWeeklyAlerts(currentWeekSnapshot()),warn=wa.filter(function(x){return x.type==="warn";})[0];if(warn)add("semana","EVOLUÇÃO · Semana",warn.text,warn.text,"./index.html?action=stats",state.smartAlertTime||"18:30",0);}
    candidates.sort(function(a,b){return b.score-a.score;});
    for(var i=0;i<candidates.length;i++){var c=candidates[i];if(smartNotify(c.kind,c.title,c.msg,c.value,c.url,c.actions))break;}
  }
  setInterval(checkReminders,60000);
  document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible"){checkReminders();syncPushState();}});

  /* ---------- PWA, instalação, notificações e atualização ---------- */
  var swRegistration=null,pwaUpdatePending=false,pwaWaitingWorker=null,deferredInstallPrompt=null;
  function isHostedPWAContext(){return location.protocol==="https:"||location.hostname==="localhost"||location.hostname==="127.0.0.1";}
  function isStandaloneApp(){return window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;}
  function isiOS(){return /iphone|ipad|ipod/i.test(navigator.userAgent||"");}

  /* ============================================================
     WEB PUSH — notificações mesmo com o PWA fechado
     O backend opcional vive em /server. Sem backend, o app mantém
     automaticamente os lembretes locais já existentes.
  ============================================================ */
  var pushSyncTimer=null;
  function pushApi(path,options){return fetch(path,Object.assign({headers:{"Content-Type":"application/json"}},options||{}));}
  function urlBase64ToUint8Array(base64String){var padding="=".repeat((4-base64String.length%4)%4),base64=(base64String+padding).replace(/-/g,"+").replace(/_/g,"/"),raw=atob(base64),out=new Uint8Array(raw.length);for(var i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out;}
  function pushSnapshot(){
    ensureV1Fresh();
    var cups=(state.todayChecks&&state.todayChecks.aguaCups)||0;
    return {date:todayStr(),timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"America/Sao_Paulo",settings:{
      intervalMin:state.smartReminderIntervalMin||60,quietEnabled:state.quietHoursEnabled!==false,quietStart:state.quietStart||"22:00",quietEnd:state.quietEnd||"07:00",
      waterEnabled:!!state.waterReminderEnabled,waterTime:state.waterReminderTime||"08:00",workoutEnabled:!!state.workoutReminderEnabled,workoutTime:state.workoutReminderTime||"18:00",
      nutritionEnabled:!!state.nutritionReminderEnabled,nutritionTime:state.nutritionReminderTime||"13:00",stepsEnabled:!!state.stepsReminderEnabled,stepsTime:state.stepsReminderTime||"19:30",
      sleepEnabled:!!state.sleepReminderEnabled,sleepTime:state.sleepReminderTime||"21:30",missionEnabled:!!state.reminderEnabled,missionTime:state.reminderTime||"19:00"
    },progress:{waterMl:cups*WATER_CUP_ML,waterTargetMl:waterCupsGoal()*WATER_CUP_ML,workoutDone:!!(state.todayHabits&&state.todayHabits.treino)||isAnyWorkoutCompleteToday(),meals:((state.mealHistory&&state.mealHistory[todayStr()])||[]).length,steps:Number((state.todayHabits&&state.todayHabits.stepsCount)||0),stepsTarget:Number(state.stepsTarget||8000),sleep:Number((state.todayHabits&&state.todayHabits.sleepHours)||0),missionDone:isTodayCompleted()}};
  }
  function pushDeviceToken(){
    if(!state.pushDeviceToken){try{var a=new Uint32Array(4);crypto.getRandomValues(a);state.pushDeviceToken=Array.from(a).map(function(n){return n.toString(16).padStart(8,"0");}).join("");}catch(e){state.pushDeviceToken=Date.now().toString(36)+Math.random().toString(36).slice(2);}save();}
    return state.pushDeviceToken;
  }
  function syncPushState(){if(!state.pushEnabled||!("serviceWorker" in navigator))return Promise.resolve(false);return navigator.serviceWorker.ready.then(function(reg){return reg.pushManager.getSubscription();}).then(function(sub){if(!sub){state.pushEnabled=false;save();renderNotificationStatus();return false;}return pushApi("./api/push/sync",{method:"POST",body:JSON.stringify({subscription:sub.toJSON(),snapshot:pushSnapshot(),deviceToken:pushDeviceToken()})}).then(function(r){if(!r.ok)throw new Error("sync");state.pushLastSync=Date.now();save();return true;});}).catch(function(){return false;});}
  function schedulePushSync(){if(!state||!state.pushEnabled)return;clearTimeout(pushSyncTimer);pushSyncTimer=setTimeout(syncPushState,1200);}
  function enableWebPush(){
    if(!("serviceWorker" in navigator)||!("PushManager" in window)){return Promise.resolve(false);}
    return pushApi("./api/push/config").then(function(r){if(!r.ok)throw new Error("backend");return r.json();}).then(function(cfg){if(!cfg.publicKey)throw new Error("key");return navigator.serviceWorker.ready.then(function(reg){return reg.pushManager.getSubscription().then(function(sub){return sub||reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlBase64ToUint8Array(cfg.publicKey)});});});}).then(function(sub){state.pushEnabled=true;save();return pushApi("./api/push/sync",{method:"POST",body:JSON.stringify({subscription:sub.toJSON(),snapshot:pushSnapshot(),deviceToken:pushDeviceToken()})});}).then(function(r){if(!r.ok)throw new Error("sync");renderNotificationStatus();showToast("🔔 Notificações em segundo plano ativadas");return true;}).catch(function(){state.pushEnabled=false;save();renderNotificationStatus();showToast("Notificações locais ativadas. Web Push requer o servidor do app.");return false;});
  }
  function disableWebPush(){
    if(!("serviceWorker" in navigator)){state.pushEnabled=false;save();renderNotificationStatus();return Promise.resolve(true);}
    return navigator.serviceWorker.ready.then(function(reg){return reg.pushManager.getSubscription();}).then(function(sub){if(!sub)return true;var payload={endpoint:sub.endpoint,deviceToken:pushDeviceToken()};return pushApi("./api/push/unsubscribe",{method:"POST",body:JSON.stringify(payload)}).catch(function(){}).then(function(){return sub.unsubscribe();});}).then(function(){state.pushEnabled=false;save();renderNotificationStatus();showToast("🔕 Notificações em segundo plano desativadas");return true;}).catch(function(){showToast("Não foi possível desativar o Push neste aparelho");return false;});
  }

  function renderNotificationStatus(){
    var el=document.getElementById("notification-status"),btn=document.getElementById("btn-enable-notifications");if(!el||!btn)return;
    if(!("Notification" in window)){el.textContent="Não disponível neste navegador";btn.disabled=true;return;}
    var p=Notification.permission;btn.disabled=false;
    if(p==="denied"){el.textContent="Bloqueadas no navegador";btn.textContent="Bloqueadas";btn.disabled=true;return;}
    if(p!=="granted"){el.textContent="Ainda não permitidas";btn.textContent="Permitir";return;}
    el.textContent=state.pushEnabled?"Permitidas · Web Push ativo":"Permitidas · lembretes locais";btn.textContent=state.pushEnabled?"Desativar Push":"Ativar Push";
  }
  function requestNotifications(){
    if(!("Notification" in window)){showToast("Notificações não disponíveis neste navegador");return;}
    if(Notification.permission==="granted"){if(state.pushEnabled)return disableWebPush();return enableWebPush();}
    Notification.requestPermission().then(function(p){renderNotificationStatus();if(p==="granted")return enableWebPush();showToast("Permissão de notificações não concedida");});
  }
  function renderInstallStatus(){
    var el=document.getElementById("pwa-install-status"),btn=document.getElementById("btn-install-app");if(!el||!btn)return;
    if(isStandaloneApp()){el.textContent="Instalado neste aparelho";btn.textContent="Instalado";btn.disabled=true;return;}
    if(!isHostedPWAContext()){el.textContent="Disponível depois de publicar em HTTPS";btn.textContent="Como instalar";btn.disabled=false;return;}
    if(deferredInstallPrompt){el.textContent="Pronto para instalar";btn.textContent="Instalar";btn.disabled=false;return;}
    if(isiOS()){el.textContent="No iPhone: Compartilhar → Adicionar à Tela de Início";btn.textContent="Como instalar";btn.disabled=false;return;}
    el.textContent="O navegador mostrará a instalação quando disponível";btn.textContent="Instalar";btn.disabled=false;
  }
  function installApp(){
    if(isStandaloneApp()){showToast("EVOLUÇÃO já está instalado");return;}
    if(deferredInstallPrompt){deferredInstallPrompt.prompt();deferredInstallPrompt.userChoice.then(function(choice){if(choice.outcome==="accepted")showToast("📲 Instalação iniciada");deferredInstallPrompt=null;renderInstallStatus();});return;}
    if(!isHostedPWAContext()){showToast("Publique o app em HTTPS para poder instalá-lo");return;}
    if(isiOS())showToast("No Safari: toque em Compartilhar e depois Adicionar à Tela de Início");
    else showToast("Abra o menu do navegador e escolha Instalar app / Adicionar à tela inicial");
  }
  window.addEventListener("beforeinstallprompt",function(ev){ev.preventDefault();deferredInstallPrompt=ev;renderInstallStatus();});
  window.addEventListener("appinstalled",function(){deferredInstallPrompt=null;renderInstallStatus();showToast("✓ EVOLUÇÃO instalado");});
  function renderUpdateStatus(text){var e=document.getElementById("pwa-update-status");if(e)e.textContent=text;}
  function showUpdateBanner(worker){
    pwaWaitingWorker=worker||pwaWaitingWorker;
    var box=document.getElementById("pwa-update-banner");
    if(box)box.hidden=false;
    renderUpdateStatus("Nova versão disponível");
  }
  function hideUpdateBanner(){var box=document.getElementById("pwa-update-banner");if(box)box.hidden=true;}
  function applyPendingUpdate(){
    if(!pwaWaitingWorker){showToast("Nenhuma atualização pronta no momento");return;}
    pwaUpdatePending=true;renderUpdateStatus("Atualizando agora…");
    var b=document.getElementById("btn-update-now");if(b){b.disabled=true;b.textContent="Atualizando…";}
    try{pwaWaitingWorker.postMessage({type:"SKIP_WAITING"});}catch(e){pwaUpdatePending=false;showToast("Não foi possível aplicar a atualização");}
  }
  function registerPWA(){
    renderNotificationStatus();renderInstallStatus();
    if(!("serviceWorker" in navigator)||!isHostedPWAContext()){renderUpdateStatus("Modo local · atualização automática requer HTTPS");return;}
    navigator.serviceWorker.register("./service-worker.js",{updateViaCache:"none"}).then(function(reg){
      swRegistration=reg;renderUpdateStatus("Atualizações automáticas ativas · v"+(window.EVOLUCAO_BUILD?window.EVOLUCAO_BUILD.version:"atual"));
      if(reg.waiting&&navigator.serviceWorker.controller)showUpdateBanner(reg.waiting);
      reg.update().catch(function(){});
      reg.addEventListener("updatefound",function(){
        var nw=reg.installing;if(!nw)return;renderUpdateStatus("Baixando nova versão…");
        nw.addEventListener("statechange",function(){
          if(nw.state==="installed"&&navigator.serviceWorker.controller)showUpdateBanner(nw);
          else if(nw.state==="activated"&&!navigator.serviceWorker.controller)renderUpdateStatus("App pronto para uso");
        });
      });
      setInterval(function(){reg.update().catch(function(){});},30*60*1000);
      document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible")reg.update().catch(function(){});});
    }).catch(function(){renderUpdateStatus("Não foi possível ativar atualização automática");});
    navigator.serviceWorker.addEventListener("controllerchange",function(){
      if(pwaUpdatePending){pwaUpdatePending=false;hideUpdateBanner();renderUpdateStatus("Atualizado · reiniciando…");setTimeout(function(){location.reload();},300);}
    });
  }
  function checkForAppUpdate(){
    if(swRegistration){
      renderUpdateStatus("Verificando…");
      swRegistration.update().then(function(){setTimeout(function(){if(swRegistration.waiting)showUpdateBanner(swRegistration.waiting);else if(!pwaWaitingWorker)renderUpdateStatus("Você já está na versão mais recente");},1100);}).catch(function(){renderUpdateStatus("Falha ao verificar atualização");});
    }else if(!isHostedPWAContext())showToast("Atualização automática exige o app publicado em HTTPS");else showToast("Serviço de atualização ainda não está pronto");
  }
  var notifBtn=document.getElementById("btn-enable-notifications");if(notifBtn)notifBtn.addEventListener("click",requestNotifications);
  var updBtn=document.getElementById("btn-check-update");if(updBtn)updBtn.addEventListener("click",checkForAppUpdate);
  var updateNowBtn=document.getElementById("btn-update-now");if(updateNowBtn)updateNowBtn.addEventListener("click",applyPendingUpdate);
  var updateLaterBtn=document.getElementById("btn-update-later");if(updateLaterBtn)updateLaterBtn.addEventListener("click",function(){hideUpdateBanner();renderUpdateStatus("Atualização disponível · toque em Verificar para instalar");});
  var installBtn=document.getElementById("btn-install-app");if(installBtn)installBtn.addEventListener("click",installApp);
  registerPWA();
  function openActionFromUrl(){var params=new URLSearchParams(location.search),a=params.get("action"),quick=parseInt(params.get("quick"),10)||0,map={workout:"treino",nutrition:"nutricao",stats:"stats",water:"inicio",today:"inicio"},v=map[a];if(!v)return;if(a==="water"&&quick>0){var cups=Math.max(1,Math.round(quick/WATER_CUP_ML));state.todayChecks.aguaCups=Math.min(waterCupsGoal(),(state.todayChecks.aguaCups||0)+cups);save();schedulePushSync();showToast("💧 +"+(cups*WATER_CUP_ML)+" ml registrados");}views.forEach(function(name){var el=document.getElementById("view-"+name);if(el)el.classList.toggle("active",name===v);});document.querySelectorAll(".nav-btn").forEach(function(b){b.classList.toggle("active",b.getAttribute("data-view")===v);});if(v==="treino")renderWorkout();if(v==="nutricao")renderV1Dashboard();if(v==="stats")renderStats();if(history.replaceState)history.replaceState({},document.title,location.pathname+location.hash);}
  openActionFromUrl();

  /* ---------- confete ---------- */
  var confettiCanvas = document.getElementById("confetti-canvas");
  var cctx = confettiCanvas.getContext("2d");
  var confettiParticles = [];
  var confettiRunning = false;
  function resizeConfetti(){ confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight; }
  window.addEventListener("resize", resizeConfetti); resizeConfetti();
  function fireConfetti(){
    var colors = ["#2DD4BF","#6366F1","#F5B841","#FFFFFF"];
    var cx = window.innerWidth/2;
    for(var i=0;i<70;i++){
      confettiParticles.push({
        x: cx + (Math.random()-0.5)*80, y: window.innerHeight*0.35,
        vx: (Math.random()-0.5)*9, vy: -Math.random()*9-4,
        size: 4+Math.random()*5, color: colors[Math.floor(Math.random()*colors.length)],
        rot: Math.random()*Math.PI*2, vr: (Math.random()-0.5)*0.3, life:0
      });
    }
    if(!confettiRunning){ confettiRunning = true; requestAnimationFrame(animateConfetti); }
  }
  function animateConfetti(){
    cctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    var alive = [];
    for(var i=0;i<confettiParticles.length;i++){
      var p = confettiParticles[i];
      p.vy += 0.28; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
      if(p.y < confettiCanvas.height+20 && p.life<260){
        alive.push(p);
        cctx.save(); cctx.translate(p.x,p.y); cctx.rotate(p.rot);
        cctx.fillStyle = p.color; cctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.6);
        cctx.restore();
      }
    }
    confettiParticles = alive;
    if(confettiParticles.length>0) requestAnimationFrame(animateConfetti);
    else confettiRunning = false;
  }

  /* ============================================================
     ONBOARDING
  ============================================================ */
  var obModal = document.getElementById("onboarding-modal");
  var obCurrentStep = 1;
  var obSelectedGoal = null;

  function obShowStep(step){
    obCurrentStep = step;
    document.querySelectorAll(".ob-step").forEach(function(s){ s.classList.toggle("active", parseInt(s.getAttribute("data-step"),10)===step); });
    document.querySelectorAll(".ob-progress span").forEach(function(s){ s.classList.toggle("done", parseInt(s.getAttribute("data-step"),10)<=step); });
    if(step === 5) obBuildSummary();
  }
  function validateOnboardingStep(step){
    if(step===1){
      var name=document.getElementById("ob-name").value.trim(),age=parseInt(document.getElementById("ob-age").value,10);
      if(name.length<2){showToast("Informe seu nome");return false;}
      if(isNaN(age)||age<10||age>100){showToast("Informe uma idade válida");return false;}
    }
    if(step===2){
      var sex=document.getElementById("ob-sex").value;
      if(["F","M","O"].indexOf(sex)===-1){showToast("Selecione uma opção válida");return false;}
    }
    if(step===3){
      var ws=parseFloat((document.getElementById("ob-weight-start").value||"").replace(",",".")),
          wg=parseFloat((document.getElementById("ob-weight-goal").value||"").replace(",","."));
      if(isNaN(ws)||ws<30||ws>400){showToast("Informe seu peso atual");return false;}
      if(isNaN(wg)||wg<30||wg>400){showToast("Informe seu peso objetivo");return false;}
      if(Math.abs(ws-wg)<0.5){showToast("Defina uma meta diferente do peso atual");return false;}
    }
    if(step===4){
      if(!obSelectedGoal){showToast("Escolha um objetivo para continuar");return false;}
      var ws2=parseFloat((document.getElementById("ob-weight-start").value||"").replace(",",".")),
          wg2=parseFloat((document.getElementById("ob-weight-goal").value||"").replace(",","."));
      if(obSelectedGoal==="emagrecer"&&wg2>=ws2){showToast("Para emagrecer, escolha uma meta menor que seu peso atual");return false;}
      if(obSelectedGoal==="massa"&&wg2<=ws2){showToast("Para ganhar massa, escolha uma meta maior que seu peso atual");return false;}
    }
    return true;
  }
  document.querySelectorAll("#onboarding-modal [data-next]").forEach(function(btn){
    btn.addEventListener("click",function(){
      if(!validateOnboardingStep(obCurrentStep))return;
      obShowStep(parseInt(btn.getAttribute("data-next"),10));
    });
  });
  document.querySelectorAll("#onboarding-modal [data-back]").forEach(function(btn){
    btn.addEventListener("click", function(){ obShowStep(parseInt(btn.getAttribute("data-back"),10)); });
  });
  document.querySelectorAll("#ob-goal-grid .goal-chip").forEach(function(chip){
    chip.addEventListener("click", function(){
      obSelectedGoal = chip.getAttribute("data-goal");
      document.querySelectorAll("#ob-goal-grid .goal-chip").forEach(function(c){ c.classList.toggle("selected", c===chip); });
    });
  });

  function obBuildSummary(){
    var wStart = parseFloat((document.getElementById("ob-weight-start").value||"").toString().replace(",","."));
    var wGoal = parseFloat((document.getElementById("ob-weight-goal").value||"").toString().replace(",","."));
    var height = parseFloat(document.getElementById("ob-height").value);
    if(isNaN(wStart)||isNaN(wGoal)){showToast("Preencha peso atual e objetivo");return;}
    document.getElementById("ob-goal-hero").innerHTML = wStart + " kg <span>➜</span> " + wGoal + " kg";
    if(!isNaN(height) && height>0){
      var hM = height/100;
      var imc = wStart/(hM*hM);
      var idealMin = Math.round(18.5*hM*hM*10)/10;
      var idealMax = Math.round(24.9*hM*hM*10)/10;
      document.getElementById("ob-imc").textContent = (Math.round(imc*10)/10) + " (referência)";
      document.getElementById("ob-ideal").textContent = idealMin + " a " + idealMax + " kg";
    } else {
      document.getElementById("ob-imc").textContent = "--";
      document.getElementById("ob-ideal").textContent = "--";
    }
    var waterMl = Math.round(wStart*35/250)*250;
    waterMl = Math.max(1500, Math.min(4000, waterMl));
    document.getElementById("ob-water").textContent = (waterMl/1000) + " litros";
    obPendingWater = waterMl;
  }
  var obPendingWater = 2000;

  document.getElementById("ob-finish").addEventListener("click", function(){
    if(!validateOnboardingStep(4))return;
    var name = document.getElementById("ob-name").value.trim().slice(0,20);
    var age = parseInt(document.getElementById("ob-age").value,10);
    var sex = document.getElementById("ob-sex").value;
    var height = parseFloat(document.getElementById("ob-height").value);
    var wStart = parseFloat((document.getElementById("ob-weight-start").value||"").toString().replace(",","."));
    var wGoal = parseFloat((document.getElementById("ob-weight-goal").value||"").toString().replace(",","."));

    state.name = name;
    if(!isNaN(age)) state.age = age;
    state.sex = sex;
    if(!isNaN(height)) state.heightCm = height;
    state.weightStart = Math.round(wStart*10)/10;
    state.weightGoal = Math.round(wGoal*10)/10;
    state.weightCurrent = state.weightStart;
    state.weightHistory = [{ date: todayStr(), weight: state.weightStart }];
    state.goalType = obSelectedGoal || "emagrecer";
    var obPrio=document.getElementById("ob-training-priority");if(obPrio)state.trainingPriority=obPrio.value||"geral";
    applyProfileWorkoutPreset(true);
    state.waterTargetMl = obPendingWater || 2000;
    state.onboarded = true;
    state.profileComplete = true;
    save();

    obModal.classList.remove("show");
    renderGreeting(); renderInicio(); renderCalendario(); renderPeso(); renderStats(); renderMedalhas();
    showToast("Bem-vindo(a) à sua evolução!");
  });


  /* ============================================================
     SPLASH + PERFIL LOCAL
  ============================================================ */
  var splashScreen = document.getElementById("splash-screen");
  var profileGate = document.getElementById("profile-gate");
  var profileEnterBtn = document.getElementById("btn-profile-enter");

  function hideSplash(){ if(splashScreen) splashScreen.classList.add("hide"); }
  function showProfileGate(){
    if(!profileGate) return;
    document.getElementById("login-name").value = state.name || "";
    document.getElementById("login-age").value = state.age || "";
    document.getElementById("login-height").value = state.heightCm || "";
    profileGate.classList.add("show"); profileGate.setAttribute("aria-hidden","false");
  }
  function hideProfileGate(){ if(profileGate){ profileGate.classList.remove("show"); profileGate.setAttribute("aria-hidden","true"); } }

  if(profileEnterBtn) profileEnterBtn.addEventListener("click", function(){
    var name = (document.getElementById("login-name").value||"").trim().slice(0,24);
    var age = parseInt(document.getElementById("login-age").value,10);
    var height = parseFloat((document.getElementById("login-height").value||"").toString().replace(",","."));
    if(name.length < 2){ showToast("Digite seu nome para continuar"); return; }
    if(isNaN(age) || age < 10 || age > 100){ showToast("Informe uma idade válida"); return; }
    if(isNaN(height) || height < 100 || height > 250){ showToast("Informe sua altura em centímetros"); return; }
    state.name=name; state.age=age; state.heightCm=height; state.profileComplete=true; save();
    document.getElementById("ob-name").value=name;
    document.getElementById("ob-age").value=age;
    document.getElementById("ob-height").value=height;
    hideProfileGate(); renderGreeting();
    if(!state.onboarded){
      obShowStep(2);
      setTimeout(function(){ obModal.classList.add("show"); },120);
    } else {
      renderInicio(); renderPeso(); renderStats(); renderMedalhas(); renderV1Dashboard();
      showToast("Bem-vindo(a) de volta, " + name.split(" ")[0] + "!");
    }
  });

  /* ============================================================
     INIT
  ============================================================ */
  function init(){
    ensureTodayChecksFresh();
    ensureV1Fresh();
    if(!state.todayHabits || state.todayHabits.date !== todayStr()) state.todayHabits={date:todayStr(),proteina:false,alimentacao:false,sono:false,treino:false,passos:false,stepsCount:0,sleepHours:0}; if(state.todayHabits.stepsCount==null)state.todayHabits.stepsCount=0;if(state.todayHabits.sleepHours==null)state.todayHabits.sleepHours=0;
    calcBodyTargets(); updateAutoNutritionHabits();
    checkForBrokenStreak();
    document.getElementById("quote-strip").textContent = '"' + QUOTES[(new Date()).getDate() % QUOTES.length] + '"';
    renderGreeting();
    renderInicio();
    renderCalendario();
    renderPeso();
    renderStats();
    renderMedalhas();
    renderV1Dashboard();
    renderQuickActionState();
    renderMeasures();
    renderWeekly();
    checkReminders();
    schedulePushSync();
    setTimeout(function(){
      hideSplash();
      if(!state.profileComplete){
        setTimeout(showProfileGate, 260);
      } else if(!state.onboarded){
        document.getElementById("ob-name").value=state.name||"";
        document.getElementById("ob-age").value=state.age||"";
        document.getElementById("ob-height").value=state.heightCm||"";
        obShowStep(2);
        setTimeout(function(){ obModal.classList.add("show"); },260);
      }
    }, 950);
  }
  init();


  ensureWorkoutSplitData();
  var splitSelect=document.getElementById("workout-split");
  if(splitSelect){splitSelect.value=state.workoutSplit||"ABC";splitSelect.addEventListener("change",function(){setWorkoutSplit(this.value);});}

  renderWorkoutHistory();
})();
