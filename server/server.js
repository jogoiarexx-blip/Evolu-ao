const express=require('express');
const webpush=require('web-push');
const path=require('path');
const fs=require('fs');
const crypto=require('crypto');
const app=express();
app.disable('x-powered-by');
app.use(express.json({limit:'80kb'}));

const PUBLIC=process.env.VAPID_PUBLIC_KEY, PRIVATE=process.env.VAPID_PRIVATE_KEY;
if(!PUBLIC||!PRIVATE){console.error('Defina VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY. Rode: npm run keys');process.exit(1);}
webpush.setVapidDetails(process.env.VAPID_SUBJECT||'mailto:admin@example.com',PUBLIC,PRIVATE);

const dbFile=path.join(__dirname,'push-data.json');
let db={devices:{}}; try{db=JSON.parse(fs.readFileSync(dbFile,'utf8'));}catch(e){}
if(!db.devices)db.devices={};
const persist=()=>fs.writeFileSync(dbFile,JSON.stringify(db,null,2));
const idOf=s=>crypto.createHash('sha256').update(s.endpoint).digest('base64url').slice(0,48);
const validToken=t=>typeof t==='string'&&/^[a-zA-Z0-9_-]{20,160}$/.test(t);

// Rate limit simples, sem dependência externa: protege endpoints de escrita contra abuso básico.
const rate=new Map();
function rateLimit(req,res,next){
  const key=req.ip||req.socket.remoteAddress||'unknown', now=Date.now(), windowMs=10*60*1000, max=120;
  let r=rate.get(key); if(!r||now-r.start>windowMs)r={start:now,count:0}; r.count++; rate.set(key,r);
  if(r.count>max)return res.status(429).json({error:'rate_limited'}); next();
}
setInterval(()=>{const now=Date.now();for(const [k,v] of rate)if(now-v.start>20*60*1000)rate.delete(k);},10*60*1000).unref();

app.get('/api/push/config',(req,res)=>{res.set('Cache-Control','no-store');res.json({publicKey:PUBLIC});});

function progressValues(snapshot){const p=snapshot?.progress||{};return {water:p.waterMl||0,steps:p.steps||0,workout:!!p.workoutDone,nutrition:p.meals||0,sleep:p.sleep||0,mission:!!p.missionDone};}
app.post('/api/push/sync',rateLimit,(req,res)=>{
  const {subscription,snapshot,deviceToken}=req.body||{};
  if(!subscription?.endpoint||!subscription?.keys?.p256dh||!subscription?.keys?.auth||!snapshot||!validToken(deviceToken))return res.status(400).json({error:'invalid'});
  const id=idOf(subscription),prev=db.devices[id];
  if(prev&&prev.deviceToken&&prev.deviceToken!==deviceToken)return res.status(403).json({error:'device_mismatch'});
  const lastSent=prev?.lastSent||{},oldVals=progressValues(prev?.snapshot),newVals=progressValues(snapshot),now=Date.now();
  // Qualquer progresso real reinicia o intervalo daquele lembrete, evitando cobrar logo após uma ação positiva.
  for(const kind of ['water','steps'])if(prev&&oldVals[kind]!==newVals[kind])lastSent[kind]={at:now,value:newVals[kind],reason:'progress'};
  db.devices[id]={subscription,snapshot,lastSent,deviceToken,updatedAt:now};persist();res.json({ok:true});
});

app.post('/api/push/unsubscribe',rateLimit,(req,res)=>{
  const {endpoint,deviceToken}=req.body||{}; if(typeof endpoint!=='string'||!validToken(deviceToken))return res.status(400).json({error:'invalid'});
  const id=idOf({endpoint}),d=db.devices[id]; if(d&&d.deviceToken!==deviceToken)return res.status(403).json({error:'device_mismatch'});
  if(d){delete db.devices[id];persist();} res.json({ok:true});
});

function mins(hm){const [h,m]=(hm||'00:00').split(':').map(Number);return h*60+m;}
function quiet(now,s){if(!s.quietEnabled)return false;const n=now.getHours()*60+now.getMinutes(),a=mins(s.quietStart),b=mins(s.quietEnd);return a===b?false:(a<b?n>=a&&n<b:n>=a||n<b);}
function due(now,hm){return now.getHours()*60+now.getMinutes()>=mins(hm);}
function late(now,hm){return Math.max(0,now.getHours()*60+now.getMinutes()-mins(hm));}
function priority(kind,ratio,minutesLate){const base={workout:95,steps:80,nutrition:76,sleep:72,mission:68,water:60}[kind]||40;return base+Math.round((1-Math.max(0,Math.min(1,Number(ratio)||0)))*25)+Math.min(20,Math.floor(minutesLate/60)*4);}
function candidates(d,now){
  const x=d.snapshot,s=x.settings||{},p=x.progress||{}; if(x.date!==now.toLocaleDateString('en-CA')||quiet(now,s))return [];
  const items=[];
  const add=(kind,title,body,url,value,time,ratio,actions=[])=>{if(due(now,time))items.push({kind,title,body,url,value,actions,score:priority(kind,ratio,late(now,time))});};
  if(s.waterEnabled&&p.waterMl<p.waterTargetMl)add('water','EVOLUÇÃO · Água',p.waterMl?`Você está em ${p.waterMl} / ${p.waterTargetMl} ml. Que tal mais um copo?`:`Sua meta é ${p.waterTargetMl} ml. Comece com um copo de água.`,'./index.html?action=water',p.waterMl,s.waterTime,p.waterTargetMl?p.waterMl/p.waterTargetMl:0,[{action:'add-water',title:'+250 ml'},{action:'later',title:'Lembrar depois'}]);
  if(s.workoutEnabled&&!p.workoutDone)add('workout','EVOLUÇÃO · Treino','Seu treino de hoje ainda está esperando por você.','./index.html?action=workout','pending',s.workoutTime,0,[{action:'workout',title:'Começar treino'},{action:'later',title:'Lembrar depois'}]);
  if(s.nutritionEnabled&&!p.meals)add('nutrition','EVOLUÇÃO · Nutrição','Você ainda não registrou uma refeição hoje.','./index.html?action=nutrition',0,s.nutritionTime,0,[{action:'nutrition',title:'Registrar refeição'},{action:'later',title:'Lembrar depois'}]);
  if(s.stepsEnabled&&p.steps<p.stepsTarget)add('steps','EVOLUÇÃO · Passos',`Você está em ${p.steps} de ${p.stepsTarget} passos. Faltam ${p.stepsTarget-p.steps}.`,'./index.html?action=today',p.steps,s.stepsTime,p.stepsTarget?p.steps/p.stepsTarget:0);
  if(s.sleepEnabled&&!p.sleep)add('sleep','EVOLUÇÃO · Sono','Seu registro de sono ainda está pendente.','./index.html?action=today',0,s.sleepTime,0);
  if(s.missionEnabled&&!p.missionDone)add('mission','EVOLUÇÃO','Sua missão de hoje ainda não foi concluída.','./index.html?action=today','pending',s.missionTime,0);
  return items.sort((a,b)=>b.score-a.score);
}

async function tick(){
  for(const [id,d] of Object.entries(db.devices)){
    try{
      const tz=d.snapshot?.timezone||'America/Sao_Paulo'; const now=new Date(new Date().toLocaleString('en-US',{timeZone:tz}));
      const list=candidates(d,now),gap=(d.snapshot?.settings?.intervalMin||60)*60000; let chosen=null;
      for(const c of list){const last=d.lastSent[c.kind];if(!last||Date.now()-last.at>=gap){chosen=c;break;}}
      if(!chosen)continue;
      await webpush.sendNotification(d.subscription,JSON.stringify({title:chosen.title,body:chosen.body,url:chosen.url,tag:'evolucao-'+chosen.kind,actions:chosen.actions}));
      d.lastSent[chosen.kind]={at:Date.now(),value:chosen.value,reason:'sent'};persist();
    }catch(e){if(e.statusCode===404||e.statusCode===410){delete db.devices[id];persist();}else console.error('push tick:',e.message||e);}
  }
}
setInterval(tick,5*60*1000).unref();tick();
app.use(express.static(path.join(__dirname,'..')));
app.listen(process.env.PORT||3000,()=>console.log('EVOLUÇÃO em http://localhost:'+(process.env.PORT||3000)));
