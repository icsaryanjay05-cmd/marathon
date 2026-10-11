/* PACE Marathon Hub: zero-dependency, GitHub Pages-compatible local-first app. */
(() => {
'use strict';
const STORE = 'pace.marathon.v1';
const TODAY = localISO();
const START = '2026-10-12', RACE = '2026-11-28';
const TYPES = ['Easy','Recovery','Long run','Threshold','Interval','Tempo','Race','Strength','Other'];
const ICONS = {
 dashboard:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
 activity:'<path d="M22 12h-4l-3 8-6-16-3 8H2"/>',
 nutrition:'<path d="M12 22v-6M12 16C6 16 3 12 3 6c5 0 9 3 9 10Zm0 0c0-6 4-10 9-10 0 6-3 10-9 10Z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 chart:'<path d="M3 3v18h18"/><path d="m6 16 5-6 4 3 5-8"/>',
 settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4M17.6 17.6 19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 run:'<circle cx="14" cy="4.5" r="2"/><path d="m7 21 3-5 3.5-2-2-4-3 3H5m6.5-3 3-2 3 2 3.5 1.5M15 14l4 3-1 4"/>',
 bolt:'<path d="m13 2-9 12h7l-1 8 10-12h-7z"/>',
 heart:'<path d="M20.8 8.5c0 5-8.8 11-8.8 11s-8.8-6-8.8-11a5 5 0 0 1 8.8-3.2 5 5 0 0 1 8.8 3.2Z"/>',
 distance:'<path d="M3 17c2-6 4-8 7-8s3 6 6 6 4-4 5-8"/><path d="M3 5h3v3H3zM18 3h3v3h-3z"/>',
 check:'<path d="m5 12 4 4L19 6"/>',chevron:'<path d="m15 18-6-6 6-6"/>',edit:'<path d="M12 20h9M16 4l4 4-10 10-5 1 1-5L16 4Z"/>',
 trash:'<path d="M4 7h16m-14 0 1 14h10l1-14M9 7V4h6v3m-5 4v6m4-6v6"/>',
 download:'<path d="M12 3v13m-5-5 5 5 5-5M4 18v3h16v-3"/>',
 upload:'<path d="M12 21V8m-5 5 5-5 5 5M4 7V3h16v4"/>',
 water:'<path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13Z"/>',
 flame:'<path d="M12 22c5 0 8-4 8-9 0-4-3-7-4-9-.5 4-3 4.5-4 5.5-.5-2-2-4-3-5.5-.5 4-5 7-5 10 0 5 3 8 8 8Z"/>',
 share:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
 fork:'<circle cx="6" cy="3" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="21" r="2"/><path d="M6 5v12m12-9c0 6-12 2-12 9"/>',
 moon:'<path d="M20 15A8 8 0 0 1 9 4a8.5 8.5 0 1 0 11 11Z"/>',
 shoe:'<path d="M3 15c3 0 5-4 6-9l4 1c-1 6 3 8 8 9v4H3v-5Z"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8v.3"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'
};
function icon(name){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.info}</svg>`;}
function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function localISO(d=new Date()){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
function dateObj(iso){return new Date(`${iso}T12:00:00`);}
function addDays(iso,n){const d=dateObj(iso);d.setDate(d.getDate()+n);return localISO(d);}
function diffDays(a,b){return Math.round((dateObj(a)-dateObj(b))/86400000);}
function monday(iso){const d=dateObj(iso);const num=(d.getDay()+6)%7;return addDays(iso,-num);}
function dateFmt(iso,opts={month:'short',day:'numeric'}){return dateObj(iso).toLocaleDateString('en-US',opts);}
function fmtFull(iso){return dateFmt(iso,{weekday:'long',month:'long',day:'numeric',year:'numeric'});}
function weekIndex(date){const n=diffDays(date,START);return n<0?-1:Math.floor(n/7);}
function sum(arr,fn=x=>x){return arr.reduce((s,x)=>s+(Number(fn(x))||0),0);}
function mean(arr){return arr.length?sum(arr)/arr.length:0;}
function num(v,d=0){return Number.isFinite(Number(v))?Number(v):d;}
function displayN(v,d=0){return Number(v||0).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});}
function clamp(n,min,max){return Math.min(max,Math.max(min,n));}
function paceStr(secondsPerKm){if(!Number.isFinite(secondsPerKm)||secondsPerKm<=0)return '—';let secs=Math.round(secondsPerKm);const m=Math.floor(secs/60);secs-=m*60;return `${m}:${String(secs).padStart(2,'0')}`;}
function secondsDuration(str){const parts=String(str||'').trim().split(':');if(!/^[0-9]+(?::[0-9]{1,2}){0,2}$/.test(String(str).trim())||parts.length>3) return NaN;const a=parts.map(Number);if(a.some(x=>x<0)||a.length>1&&a.slice(1).some(x=>x>=60))return NaN;if(a.length===3)return a[0]*3600+a[1]*60+a[2];if(a.length===2)return a[0]*60+a[1];return a[0]*60;}
function durationStr(total){if(!Number.isFinite(total)||total<=0)return '—';let t=Math.round(total),h=Math.floor(t/3600);t%=3600;let m=Math.floor(t/60),s=t%60;return h?`${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`:`${m}:${String(s).padStart(2,'0')}`;}
function clockTime(s){if(!s)return '—';const [h,m]=s.split(':').map(Number);return new Date(2000,1,1,h,m).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});}
function sortDate(arr,desc=true){return [...arr].sort((a,b)=>(desc?-1:1)*(a.date.localeCompare(b.date)));}
function defaultData(){return {version:1,settings:{weight:76.7,weeklyGoal:70,calories:2800,carbs:400,protein:135,fat:80,water:2500,marathonGoal:'3:10:00'},runs:[],meals:[],tasks:[],water:[],plan:structuredClone(DEFAULT_PLAN)};}
function load(){try{const s=JSON.parse(localStorage.getItem(STORE));if(s&&Array.isArray(s.runs)&&Array.isArray(s.plan)&&Array.isArray(s.tasks)&&Array.isArray(s.meals))return {...defaultData(),...s,settings:{...defaultData().settings,...s.settings},water:Array.isArray(s.water)?s.water:[]};}catch(e){console.warn('Unable to read stored training data',e);}return defaultData();}
let db=load();
let ui={page:'dashboard',week:clamp(weekIndex(TODAY),0,6),date:TODAY,nutritionDate:TODAY,runFilter:'All',runSort:'newest'};
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
function save(){try{localStorage.setItem(STORE,JSON.stringify(db));}catch(e){notify('Could not save. Export a backup and check browser storage.');console.error(e);}}
function notify(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(notify.timeout);notify.timeout=setTimeout(()=>el.classList.remove('show'),3300);}
function rerender(){save();render();}
function sortedRuns(){return sortDate(db.runs);}
function runStats(runs){return {km:sum(runs,r=>r.distance),time:sum(runs,r=>r.duration),pace:sum(runs,r=>r.duration)/sum(runs,r=>r.distance),hr:mean(runs.filter(r=>r.hr).map(r=>r.hr)),count:runs.length};}
function runWeek(date){const start=monday(date),end=addDays(start,6);return db.runs.filter(r=>r.date>=start&&r.date<=end);}
function planWeek(i){let start=addDays(START,i*7),end=addDays(start,6);return db.plan.filter(p=>p.date>=start&&p.date<=end).sort((a,b)=>a.date.localeCompare(b.date));}
function weekSummary(i){const p=planWeek(i);const start=addDays(START,i*7),end=addDays(start,6);const runs=db.runs.filter(r=>r.date>=start&&r.date<=end);return {start,end,planned:sum(p,p=>p.km),actual:sum(runs,r=>r.distance),completed:p.filter(p=>p.complete).length,count:p.length,runs:runs.length};}
function dayPlan(date){return db.plan.filter(p=>p.date===date);}
function dayRuns(date){return db.runs.filter(r=>r.date===date);}
function todayNutrition(date){const meals=db.meals.filter(m=>m.date===date),water=sum(db.water.filter(w=>w.date===date),w=>w.ml)+sum(meals,m=>m.water);return {meals,calories:sum(meals,m=>m.calories),carbs:sum(meals,m=>m.carbs),protein:sum(meals,m=>m.protein),fat:sum(meals,m=>m.fat),water};}
function target(n){return Math.max(0,num(db.settings[n]));}
function labelType(t){return `<i class="type-dot type-${esc(String(t).replaceAll(' ',''))}"></i>${esc(t)}`;}
function badgeType(t){const cls=t==='Threshold'||t==='Interval'?'purple':t==='Long run'||t==='Race'?'green':t==='Strength'?'orange':'';return `<span class="tag ${cls}">${esc(t)}</span>`;}
function button(label,action,kind='button-outline',attrs=''){return `<button class="button ${kind}" data-action="${action}" ${attrs}>${label}</button>`;}
function blankState(title,subtitle,action,label='Get started'){return `<div class="empty-state"><div class="empty-icon">${icon('run')}</div><h3>${esc(title)}</h3><p>${esc(subtitle)}</p>${action?button(label,action,'button-primary'):''}</div>`;}
function panelHeader(title,caption='',action='',actionLabel='View all'){return `<div class="panel-head"><div><h2 class="panel-title">${title}</h2>${caption?`<div class="panel-kicker">${caption}</div>`:''}</div>${action?`<button class="text-link" data-action="${action}">${actionLabel} ${icon('arrow')}</button>`:''}</div>`;}
function statCard(label,value,unit,iconName,footer){return `<div class="stat-card"><div class="stat-head"><span>${label}</span><span class="stat-ic">${icon(iconName)}</span></div><div class="stat-value">${value}<span class="unit">${unit}</span></div><div class="stat-foot">${footer}</div></div>`;}
function ring(percent,diameter=230,color='var(--lime)',bg='#425346'){const r=92,c=2*Math.PI*r,fill=clamp(percent,0,100)/100*c;return `<svg viewBox="0 0 230 230" class="ring-svg" aria-hidden="true"><circle cx="115" cy="115" r="${r}" fill="none" stroke="${bg}" stroke-width="11"/><circle cx="115" cy="115" r="${r}" fill="none" stroke="${color}" stroke-width="11" stroke-linecap="round" stroke-dasharray="${fill.toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 115 115)"/></svg>`;}
function progress(value,max,type=''){return `<div class="progress-wrap"><span class="progress-fill ${type}" style="width:${clamp(max>0?value/max*100:0,0,100)}%"></span></div>`;}
function effectivePlanToday(){const p=dayPlan(TODAY);return p[0]||db.plan.filter(x=>x.date>=TODAY).sort((a,b)=>a.date.localeCompare(b.date))[0]||db.plan[db.plan.length-1];}
function header(eyebrow,title,sub,actions=''){return `<div class="page-header"><div><div class="page-eyebrow">${eyebrow}</div><h1 class="page-title">${title}</h1><p class="page-subtitle">${sub}</p></div>${actions?`<div class="header-actions">${actions}</div>`:''}</div>`;}
function svgWeekly(){const weeks=TRAINING_WEEKS.map((w,i)=>({...weekSummary(i),name:'W'+(i+1)}));const W=650,H=229,l=37,r=10,t=15,b=32,innerH=H-t-b,max=Math.max(20,Math.ceil(Math.max(...weeks.map(x=>Math.max(x.actual,x.planned)))/20)*20);const x=i=>l+((W-l-r)/7)*(i+.5),y=v=>t+innerH-(v/max*innerH);let parts=[];for(let i=0;i<=4;i++){let val=max*i/4,yy=y(val);parts.push(`<line x1="${l}" y1="${yy}" x2="${W-r}" y2="${yy}" stroke="#35434b" stroke-width="1" stroke-dasharray="2 6"/><text x="${l-9}" y="${yy+4}" fill="#7f959c" font-size="10" text-anchor="end">${val.toFixed(0)}</text>`);}let pts=[];weeks.forEach((w,i)=>{const xx=x(i),bw=32,yy=y(w.actual),height=t+innerH-yy;parts.push(`<rect x="${xx-bw/2}" y="${yy}" width="${bw}" height="${Math.max(height,0)}" rx="6" fill="#c9f879" opacity=".9"/><text x="${xx}" y="${H-8}" text-anchor="middle" fill="#879ba1" font-size="11">${w.name}</text>`);pts.push(`${xx},${y(w.planned)}`);});parts.push(`<polyline points="${pts.join(' ')}" fill="none" stroke="#b4a8ff" stroke-width="2.4" stroke-dasharray="6 5"/>`);weeks.forEach((w,i)=>parts.push(`<circle cx="${x(i)}" cy="${y(w.planned)}" r="3" fill="#b4a8ff"/>`));return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Weekly distance chart: green actual kilometers and purple dotted planned kilometers">${parts.join('')}</svg>`;}
function svgPace(){const runs=sortDate(db.runs,false).slice(-12);if(!runs.length)return `<div class="chart-empty">Your pace trend will appear here after you log some runs.</div>`;const W=600,H=235,l=50,r=15,t=22,b=42,data=runs.map(r=>r.duration/r.distance),min=Math.floor(Math.min(...data)/30)*30-15,max=Math.ceil(Math.max(...data)/30)*30+15;const yy=v=>t+(max-v)/(max-min)*(H-t-b),xx=i=>l+i*(W-l-r)/Math.max(1,data.length-1);let elems=[];for(let i=0;i<=4;i++){let v=min+(max-min)*i/4,py=yy(v);elems.push(`<line x1="${l}" y1="${py}" x2="${W-r}" y2="${py}" stroke="#34434b" stroke-dasharray="3 6"/><text x="${l-8}" y="${py+4}" fill="#82999f" font-size="10" text-anchor="end">${paceStr(v)}</text>`);}let p=data.map((v,i)=>`${xx(i)},${yy(v)}`).join(' ');elems.push(`<polyline points="${p}" fill="none" stroke="#c9f879" stroke-width="3" stroke-linejoin="round"/>`);runs.forEach((r,i)=>{elems.push(`<circle cx="${xx(i)}" cy="${yy(data[i])}" r="4.7" fill="#c9f879" stroke="#1c2824" stroke-width="2"/>`);if(i===0||i===runs.length-1||runs.length<=4)elems.push(`<text x="${xx(i)}" y="${H-12}" text-anchor="middle" fill="#90a4ac" font-size="10">${dateFmt(r.date)}</text>`);});return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Pace per kilometer for recent runs. Lower pace times are faster.">${elems.join('')}</svg>`;}
function dashboard(){
 const weekly=runWeek(TODAY),ws=runStats(weekly),all=runStats(db.runs),last=sortedRuns().slice(0,4),p=effectivePlanToday(),pDate=p.date,days=diffDays(RACE,TODAY),prog=clamp(diffDays(TODAY,START)/Math.max(1,diffDays(RACE,START))*100,0,100),nextW=weekSummary(clamp(weekIndex(TODAY),0,6));
 const todayTasks=db.tasks.filter(t=>t.date===TODAY&&!t.done).sort((a,b)=>(a.time||'99').localeCompare(b.time||'99'));
 const goalPace=paceStr(secondsDuration(db.settings.marathonGoal)/42.195),count=db.runs.length;
 return `${header('YOUR RUNNING COMMAND CENTER','Every mile <em>matters.</em>','Train with intention. Fuel with purpose. See the progress.')} 
  <div class="dashboard-hero"><div class="hero-copy"><div class="hero-eyebrow">✳ &nbsp; ROAD TO MARATHON DAY</div><div class="hero-title">THE ROAD TO<br/><span>42.2 KM.</span></div><p class="hero-detail">Your 7-week build is mapped out. Show up, log the work, and keep recovery part of the plan.</p><div class="hero-meta"><span class="hero-pill">${icon('calendar')} <b>28 NOV 2026</b></span><span class="hero-pill">${icon('target')} Goal ${esc(db.settings.marathonGoal)} · ${goalPace}/km</span></div></div><div class="hero-ring">${ring(prog)}<div class="ring-center"><strong>${days>0?days:days===0?'0':'✓'}</strong><small>${days>=0?'DAYS TO GO':'RACE DATE PASSED'}</small><span class="ring-bottom">${Math.round(prog)}% of build</span></div></div></div>
  <div class="stat-grid">
    ${statCard('THIS WEEK',displayN(ws.km,1),'km','distance',`${ws.count} logged ${ws.count===1?'run':'runs'} · Mon–Sun`)}
    ${statCard('AVERAGE PACE',ws.count?paceStr(ws.pace):'—','/km','activity',ws.count?'Distance-weighted this week':'Start logging to see your pace')}
    ${statCard('TOTAL RUNS',displayN(all.count),'sessions','shoe',`${displayN(all.km,1)} km logged overall`)}
    ${statCard('WEEK PLAN',displayN(nextW.planned,1),'km','target',`${Math.round(nextW.planned?Math.min(nextW.actual/nextW.planned*100,100):0)}% of core plan distance logged`)}
  </div>
  <div class="layout-two"><section class="panel">${panelHeader('Your training volume','Actual vs core planned kilometers • Oct 12 – Nov 28','training','Training calendar')}<div class="chart-area">${svgWeekly()}</div><div class="chart-legend"><span><i class="legend-dot"></i>Completed km</span><span><i class="legend-dot secondary"></i>Planned km (optional running not counted)</span></div></section>
  <section class="panel">${panelHeader(pDate===TODAY?"Today's workout":"Next up",dateFmt(pDate,{weekday:'long',month:'short',day:'numeric'}),'training','Full plan')}
    <div class="workout-card"><div class="workout-icon">${icon(p.type==='Strength'?'bolt':'run')}</div><div><div class="workout-tag">${esc(p.type)} ${p.complete?'· Completed':''}</div><h3>${esc(p.title)}</h3><p>${esc(p.notes)}</p></div></div><div class="workout-bottom">${p.km?`<span class="info-dot">${displayN(p.km,1)} km planned</span>`:''}${p.pace?`<span class="info-dot">${esc(p.pace)}</span>`:''}<span class="info-dot">${dateFmt(p.date)}</span></div><div class="split-line"></div><div class="section-label">QUICK LOG</div><div class="quick-actions"><button class="quick-action" data-action="add-run">${icon('plus')} Add run</button><button class="quick-action" data-action="add-meal">${icon('nutrition')} Log food</button><button class="quick-action" data-action="add-task">${icon('clock')} Add activity</button></div>
  </section></div>
  <div class="layout-two"><section class="panel">${panelHeader('Recent sessions',`${count} runs in your journal`,'runs','View all')}${last.length?last.map(r=>`<div class="compact-row"><div><strong>${labelType(r.type)}</strong><small>${dateFmt(r.date,{weekday:'short',month:'short',day:'numeric'})} · ${durationStr(r.duration)}${r.hr?' · '+r.hr+' bpm':''}</small></div><div class="text-right"><span class="right-strong">${displayN(r.distance,2)} km</span><small style="display:block;color:#9bb0b2;margin-top:4px">${paceStr(r.duration/r.distance)} /km</small></div></div>`).join(''):blankState('The first run starts the story','Log a session to unlock your running journal and analytics.','add-run','Log your first run')}</section>
  <section class="panel">${panelHeader('Today, organized','Your schedule at a glance','schedule','Open schedule')}
    <div class="compact-row"><div><strong>${icon('run')} &nbsp; Training</strong><small>${dayPlan(TODAY).length?dayPlan(TODAY).map(x=>x.title).join(', '):'No session on the calendar today'}</small></div><span class="metric-badge">${dayPlan(TODAY).some(x=>x.complete)?'DONE':'PLAN'}</span></div>
    ${todayTasks.slice(0,3).map(t=>`<div class="compact-row"><div><strong>${esc(t.title)}</strong><small>${t.time?clockTime(t.time):'Anytime'} · ${esc(t.category)}</small></div><span class="tag">TO DO</span></div>`).join('')}
    ${todayTasks.length===0?`<div class="empty-inline">Nothing else scheduled. Add your routine, meals or recovery blocks.</div>`:''}
    <div class="top-gap">${button('Open daily schedule','schedule','button-outline')}</div>
  </section></div>
  <div class="info-bar">${icon('info')} &nbsp; Your updated plan makes the sub-3 marathon an ambitious stretch goal, not a confirmed race pace. Adjust hard workouts for fatigue, heat and sleep. The site is a training journal, not a medical assessment.</div>`;
}
function training(){
 const i=ui.week,week=TRAINING_WEEKS[i],p=planWeek(i),s=weekSummary(i),todayIn=p.some(w=>w.date===TODAY);
 return `${header('BUILD PHASE / 2026','Training <em>calendar.</em>','Your actual Oct 12–Nov 28 training schedule — every session is editable.',button(`${icon('plus')} Add workout`,'add-plan','button-primary'))}
   <div class="week-strip">${TRAINING_WEEKS.map((w,j)=>`<button class="week-tab ${i===j?'active':''}" data-action="set-week" data-week="${j}"><small>WEEK ${j+1}</small><strong>${esc(w.dates)}</strong><span>${esc(w.name)}</span></button>`).join('')}</div>
   <div class="week-focus"><div><div class="section-label">WEEK ${i+1} / 7</div><h3>${esc(week.name)}</h3><p>${esc(week.focus)}</p></div><div class="week-focus-badge">${displayN(s.actual,1)} / ${displayN(s.planned,1)} CORE KM${progress(s.actual,s.planned)}</div></div>
   <div class="toolbar"><p class="page-subtitle">${dateFmt(s.start,{month:'long',day:'numeric'})} – ${dateFmt(s.end,{month:'long',day:'numeric',year:'numeric'})} · ${p.filter(x=>x.complete).length} marked complete</p><div class="filter-group">${button('◀ Previous','prev-week','button-outline',i===0?'disabled':'')}${button('Next ▶','next-week','button-outline',i===6?'disabled':'')}</div></div>
   <div class="sessions-list">${p.length?p.map(x=>`<div class="session-row ${x.date===TODAY?'today':''} ${x.complete?'completed':''}"><div class="session-date"><strong>${dateFmt(x.date,{weekday:'short'})}</strong><small>${dateFmt(x.date)}</small></div><div class="session-content"><h3>${esc(x.title)}</h3><p>${esc(x.notes)}</p><div class="session-details">${badgeType(x.type)}${x.km?`<span class="tag">${displayN(x.km,1)} km</span>`:''}${x.pace?`<span class="tag">${esc(x.pace)}</span>`:''}${x.date===TODAY?`<span class="tag green">TODAY</span>`:''}</div></div><div class="session-actions"><button class="mini-check ${x.complete?'checked':''}" aria-label="${x.complete?'Mark incomplete':'Mark completed'}" title="Toggle completed" data-action="toggle-plan" data-id="${esc(x.id)}">${icon('check')}</button><button class="small-icon-btn" title="Edit workout" aria-label="Edit workout" data-action="edit-plan" data-id="${esc(x.id)}">${icon('edit')}</button>${x.id.startsWith('plan-')?'':`<button class="small-icon-btn" title="Delete workout" aria-label="Delete workout" data-action="delete-plan" data-id="${esc(x.id)}">${icon('trash')}</button>`}</div></div>`).join(''):blankState('No workouts on this week','Add a planned session.','add-plan','Add a workout')}</div>
   <div class="info-bar top-gap">The distances shown are estimates for core running sessions. Rest days and optional easy running are intentionally not included in planned km totals. Mark a workout complete manually or log its corresponding run.</div>`;
}
function runs(){
 const all=sortedRuns(),filtered=all.filter(r=>ui.runFilter==='All'||r.type===ui.runFilter),n=runStats(all),weekly=runStats(runWeek(TODAY));
 const filt=Array.from(new Set(['All',...all.map(r=>r.type)]));
 return `${header('THE WORK BEHIND THE GOAL','Run <em>journal.</em>','Record every session and let the numbers tell the story.',button(`${icon('plus')} Log a run`,'add-run','button-primary'))}
 <div class="stat-grid">${statCard('TOTAL DISTANCE',displayN(n.km,1),'km','distance','Across all logged sessions')}${statCard('RUNS LOGGED',displayN(n.count),'runs','shoe','Every session counts')}${statCard('MOVING TIME',displayN(n.time/3600,1),'hours','clock','Total time on your feet')}${statCard('AVG RUNNING PACE',n.count?paceStr(n.pace):'—','/km','activity','Distance-weighted average')}</div>
 <section class="panel"><div class="toolbar"><div class="filter-group">${filt.map(f=>`<button class="filter-pill ${f===ui.runFilter?'active':''}" data-action="run-filter" data-filter="${esc(f)}">${esc(f)}</button>`).join('')}</div>${button(`${icon('download')} Export CSV`,'export-csv','button-outline')}</div>
 ${filtered.length?`<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Date</th><th>Session</th><th>Distance</th><th>Moving time</th><th>Pace / km</th><th>Avg HR</th><th>RPE</th><th>Actions</th></tr></thead><tbody>${filtered.map(r=>`<tr><td><strong>${dateFmt(r.date,{month:'short',day:'numeric'})}</strong><small>${dateFmt(r.date,{weekday:'long',year:'numeric'})}</small></td><td>${labelType(r.type)}${r.notes?`<small title="${esc(r.notes)}">${esc(r.notes).slice(0,45)}${r.notes.length>45?'…':''}</small>`:''}</td><td><strong>${displayN(r.distance,2)} km</strong></td><td>${durationStr(r.duration)}</td><td><strong>${paceStr(r.duration/r.distance)}</strong></td><td>${r.hr?`${r.hr} bpm`:'—'}</td><td>${r.rpe?r.rpe+'/10':'—'}</td><td><div class="filter-group"><button class="small-icon-btn" data-action="edit-run" data-id="${esc(r.id)}" aria-label="Edit run">${icon('edit')}</button><button class="small-icon-btn" data-action="delete-run" data-id="${esc(r.id)}" aria-label="Delete run">${icon('trash')}</button></div></td></tr>`).join('')}</tbody></table></div>`:blankState('No matching runs yet','Record a training session to start your log, or change the filter.','add-run','Log a run')}
 </section><p class="footer-note">Average pace is total moving time divided by total distance, not an arithmetic average of per-run paces. Runs are stored locally in this browser.</p>`;
}
function mealRows(items){return items.length?items.map(m=>`<div class="food-row"><span class="food-icon">${icon('nutrition')}</span><div class="food-main"><strong>${esc(m.name)}</strong><small>${esc(m.category)} · C ${displayN(m.carbs,1)}g / P ${displayN(m.protein,1)}g / F ${displayN(m.fat,1)}g ${m.water?'· '+m.water+' mL':''}</small></div><div class="food-cal">${displayN(m.calories)}<small>kcal</small></div><button class="small-icon-btn" data-action="edit-meal" data-id="${esc(m.id)}" title="Edit">${icon('edit')}</button><button class="small-icon-btn" data-action="delete-meal" data-id="${esc(m.id)}" title="Delete">${icon('trash')}</button></div>`).join(''):blankState('Start your food journal','Log food, gels, drinks or meals to see your daily totals.','add-meal','Add first meal');}
function nutrition(){
 const d=ui.nutritionDate,n= todayNutrition(d),s=db.settings,percent=clamp(n.calories/target('calories')*100,0,100),planned=dayPlan(d)[0],weight=target('weight'),dayKind=planned?.type==='Long run'?'Long run':planned?.type==='Threshold'||planned?.type==='Interval'||planned?.type==='Race'?'Quality session':'Regular training';
 const guides=planned?.type==='Long run'?['5–7+','1.4–2.0','50–75']:planned?.type==='Threshold'||planned?.type==='Race'?['4–7','1.4–2.0','50–75']:['3–5','1.4–2.0','As needed'];
 const macro=(label,value,goal,cl)=>`<div class="macro-row"><span class="macro-name">${label}</span>${progress(value,goal,cl)}<span class="macro-total"><strong>${displayN(value,1)}</strong> / ${displayN(goal)}g</span></div>`;
 const PRESETS=[['Banana','banana'],['Cooked rice (1 cup)','rice'],['Energy gel','gel'],['Sports drink (250mL)','drink'],['Egg (1)','egg']];
 return `${header('EAT TO PERFORM','Nutrition <em>& fuel.</em>','Fuel your training, recover consistently and log what you actually consume.',button(`${icon('plus')} Add food`,'add-meal','button-primary'))}
 <div class="toolbar"><div class="date-nav"><button class="icon-button" data-action="nutri-prev" aria-label="Previous day">${icon('chevron')}</button><strong>${dateFmt(d,{weekday:'short',month:'short',day:'numeric'})}</strong><button class="icon-button" data-action="nutri-next" aria-label="Next day" style="transform:rotate(180deg)">${icon('chevron')}</button><input class="date-dark" type="date" value="${d}" id="nutritionDatePicker" aria-label="Nutrition date"></div><div class="filter-group">${button('Edit targets','settings','button-outline')}${button(`${icon('water')} +250 mL`,'add-water','button-soft')}</div></div>
 <div class="nutri-hero"><section class="panel">${panelHeader('Daily energy','Your intake compared with editable starter targets')}
  <div class="calorie-main"><div class="calorie-circle">${ring(percent,170)}<div class="calorie-circle-center"><strong>${displayN(n.calories)}</strong><small>OF ${displayN(s.calories)} KCAL</small></div></div><div class="calorie-number"><h3>${displayN(Math.max(0,s.calories-n.calories))} kcal</h3><p>Remaining to your selected daily target. Targets are adjustable — not a prescribed calorie deficit.</p><span class="metric-badge">${esc(dayKind)}</span></div></div></section>
  <section class="panel">${panelHeader('Macro & fluid balance','Daily tracking, not a clinical dietary assessment')}${macro('Carbs',n.carbs,target('carbs'),'')}${macro('Protein',n.protein,target('protein'),'secondary')}${macro('Fat',n.fat,target('fat'),'orange')}<div class="macro-row"><span class="macro-name">Fluids</span>${progress(n.water,target('water'),'water')}<span class="macro-total"><strong>${displayN(n.water)}</strong> / ${displayN(s.water)}mL</span></div></section></div>
 <div class="layout-two"><section class="panel">${panelHeader('Food log',`${dateFmt(d)} · ${n.meals.length} entries`,'add-meal','Add food')}
  <div class="section-label">QUICK ADD · ESTIMATES, EDIT TO MATCH YOUR PORTION</div><div class="meal-presets">${PRESETS.map(([label,key])=>`<button class="preset-btn" data-action="preset-food" data-preset="${key}">+ ${esc(label)}</button>`).join('')}</div>${mealRows(n.meals)}</section>
 <section class="panel">${panelHeader('Your fueling playbook',`${dayKind} · based on your training plan`)}<div class="fuel-guide"><div class="fuel-item"><small>DAILY CARBS</small><strong>${guides[0]} g/kg</strong><span>Illustrative range varies with load; at ${displayN(weight,1)} kg, ~${Math.round(weight*Number(guides[0].split('–')[0]))} g+ as a reference.</span></div><div class="fuel-item"><small>DAILY PROTEIN</small><strong>${guides[1]} g/kg</strong><span>Spread across meals to support endurance training and recovery.</span></div><div class="fuel-item"><small>DURING LONG RUNS</small><strong>${guides[2]} g/h</strong><span>${guides[2]==='As needed'?'Short easy sessions may not need extra fuel.':'For runs over ~90 minutes: begin 50–60 g/h, progress to 60–75 if tolerated.'}</span></div></div>
 <div class="split-line"></div><h3 class="mini-heading">Long-run checklist</h3><div class="compact-row"><div><strong>Fuel early</strong><small>For long efforts, begin carbohydrate intake within ~20–30 minutes.</small></div>${icon('check')}</div><div class="compact-row"><div><strong>Hydrate for conditions</strong><small>Use thirst, heat and sweat loss; avoid excessive fluid intake.</small></div>${icon('water')}</div><div class="compact-row"><div><strong>Practice race setup</strong><small>Use familiar gels, drinks and sodium strategies in training.</small></div>${icon('target')}</div>
 </section></div>
 <section class="panel" style="margin-bottom:18px">${panelHeader('A day of eating, planned',`${dayKind} · flexible meal ideas, adjust portions to appetite and training`)}
 <div class="meal-blueprint">${(planned?.type==='Long run'?[['BEFORE YOUR RUN','Oatmeal or toast with banana and honey','Eat familiar, easy-to-digest carbs ahead of the run; give yourself time to digest.'],['DURING THE RUN','Your practiced gels, sports drink or chews','Aim for your practiced 50–60 g carbs/hour at first, progressing as tolerated.'],['AFTER YOUR RUN','Rice or potatoes + eggs, fish or chicken + fruit','Replenish carbohydrate and include protein after a long effort.'],['LATER MEALS','Rice/pasta + lean protein + vegetables + snacks','Spread enough food and fluid throughout the day to support recovery.']]:planned?.type==='Threshold'||planned?.type==='Interval'||planned?.type==='Race'?[['PRE-SESSION','Banana + toast, or your familiar pre-run snack','Favor familiar carbohydrates and avoid experimenting before faster sessions.'],['POST-SESSION','Rice or oats + eggs/yogurt + fruit','Combine carbs and protein after training.'],['LUNCH','Rice, chicken or tofu and vegetables','Build a balanced plate and scale carbohydrates with training demand.'],['DINNER','Pasta or potatoes + fish/beans + vegetables','Eat enough to support the next day rather than chasing a deficit.']]:[['BREAKFAST','Oats + milk or yogurt + fruit','A practical mix of carbohydrates and protein.'],['LUNCH','Rice + chicken/fish/tofu + vegetables','Adjust portions for your appetite and next session.'],['SNACK','Fruit and yogurt, or a sandwich','Use snacks to fill gaps between meals and support recovery.'],['DINNER','Potatoes/rice + protein + vegetables','Eat regularly; easy days still require adequate fuel.']]).map(([time,food,detail],j)=>`<div class="blueprint-item"><span class="blueprint-number">0${j+1}</span><small>${esc(time)}</small><strong>${esc(food)}</strong><p>${esc(detail)}</p></div>`).join('')}</div></section>
 <div class="info-bar">Macros and calorie targets here are examples until you customize them. Carbohydrate gram ranges are general fueling references, not a substitute for a dietitian's individualized plan.</div>`;
}
function schedule(){
 const date=ui.date,start=monday(date),days=Array.from({length:7},(_,i)=>addDays(start,i)),p=dayPlan(date),tasks=db.tasks.filter(t=>t.date===date).sort((a,b)=>(a.time||'99').localeCompare(b.time||'99'));
 let agenda=[...p.map(x=>({...x,kind:'training',time:'',isPlan:true})),...tasks.map(x=>({...x,kind:x.category.toLowerCase(),isPlan:false}))];
 agenda.sort((a,b)=>{if(a.time&&!b.time)return -1;if(!a.time&&b.time)return 1;return(a.time||'').localeCompare(b.time||'');});
 return `${header('OWN YOUR DAY','Daily <em>schedule.</em>','Plan your workouts, recovery, meals, work and personal activities.',button(`${icon('plus')} Add activity`,'add-task','button-primary'))}
 <div class="toolbar"><div class="date-nav"><button class="icon-button" data-action="schedule-prev" aria-label="Previous week">${icon('chevron')}</button><strong>${dateFmt(start,{month:'short',day:'numeric'})} – ${dateFmt(addDays(start,6),{month:'short',day:'numeric'})}</strong><button class="icon-button" data-action="schedule-next" aria-label="Next week" style="transform:rotate(180deg)">${icon('chevron')}</button></div><div class="filter-group"><input class="date-dark" type="date" id="scheduleDatePicker" value="${date}" aria-label="Select day">${button('Today','schedule-today','button-outline')}</div></div>
 <div class="mini-calendar">${days.map(d=>{let pp=dayPlan(d),mm=db.meals.some(m=>m.date===d),tt=db.tasks.some(t=>t.date===d);return `<button class="day-box ${d===date?'active':''}" data-action="select-day" data-date="${d}"><span class="day-label">${dateFmt(d,{weekday:'short'}).toUpperCase()}</span><span class="day-num">${dateFmt(d,{day:'numeric'})}</span><div class="mini-indicators">${pp.length?'<i></i>':''}${mm?'<i class="meal"></i>':''}${tt?'<i class="task"></i>':''}</div></button>`;}).join('')}</div>
 <div class="layout-two"><section class="panel">${panelHeader(dateFmt(date,{weekday:'long',month:'long',day:'numeric'}),'Your planned agenda','add-task','Add another activity')}
 <div class="agenda-list">${agenda.length?agenda.map(x=>`<div class="agenda-item ${x.done||x.complete?'done':''}"><span class="agenda-time">${x.isPlan?'FLEXIBLE':x.time?clockTime(x.time):'ANYTIME'}</span><span class="agenda-mark ${x.isPlan?'training':x.kind}"></span><div><h3>${esc(x.title)}</h3><p>${esc(x.notes|| (x.isPlan?x.type:x.category))}</p><div class="session-details">${x.isPlan?badgeType(x.type):`<span class="tag">${esc(x.category)}</span>`}${x.isPlan&&x.km?`<span class="tag">${x.km} km</span>`:''}</div></div><div class="agenda-side">${x.isPlan?`<button class="mini-check ${x.complete?'checked':''}" data-action="toggle-plan" data-id="${esc(x.id)}" title="Mark workout complete">${icon('check')}</button><button class="small-icon-btn" data-action="edit-plan" data-id="${esc(x.id)}" title="Edit workout">${icon('edit')}</button>`:`<button class="mini-check ${x.done?'checked':''}" data-action="toggle-task" data-id="${esc(x.id)}" title="Toggle completed">${icon('check')}</button><button class="small-icon-btn" data-action="edit-task" data-id="${esc(x.id)}" title="Edit activity">${icon('edit')}</button><button class="small-icon-btn" data-action="delete-task" data-id="${esc(x.id)}" title="Delete activity">${icon('trash')}</button>`}</div></div>`).join(''):blankState('Your day is wide open','Add work hours, meals, sleep and other activities to build your routine.','add-task','Schedule an activity')}</div></section>
 <section class="panel">${panelHeader('Day overview','One glance at training and recovery')}<div class="compare-stats"><div class="compare-stat"><small>Workouts</small><strong>${p.length}</strong><span>planned</span></div><div class="compare-stat"><small>Activities</small><strong>${tasks.length}</strong><span>scheduled</span></div><div class="compare-stat"><small>Logged runs</small><strong>${dayRuns(date).length}</strong><span>completed</span></div></div><div class="split-line"></div><div class="section-label">TODAY'S TRAINING</div>${p.length?p.map(x=>`<div class="compact-row"><div><strong>${labelType(x.type)}</strong><small>${esc(x.title)} · ${x.km?x.km+' km':'No fixed mileage'}</small></div><span class="metric-badge ${x.complete?'':'warning'}">${x.complete?'DONE':'PLANNED'}</span></div>`).join(''):'<p class="muted">No planned session on this date.</p>'}<div class="split-line"></div><div class="section-label">NUTRITION LOG</div><div class="compact-row"><div><strong>${todayNutrition(date).meals.length} food entries</strong><small>${displayN(todayNutrition(date).calories)} kcal logged</small></div><button class="text-link" data-action="go-nutri-date" data-date="${date}">View ${icon('arrow')}</button></div><div class="top-gap">${button('Log run for this day','log-day-run','button-soft')}</div></section></div>`;
}
function recommendations(){
 const out=[];const runs=sortedRuns();if(!runs.length)return [
  {title:'Your first data point',text:'Log your next run with distance, moving time and effort to start tracking volume and pace.',kind:'good'},
  {title:'Training before racing',text:'The October 12 plan begins with recovery after a high-load block. Hard sessions should stay conditional on sleep and how your legs feel.',kind:'good'},
  {title:'Build the fueling habit',text:'For runs over ~90 minutes, your current plan suggests starting around 50–60 g carbohydrate per hour and progressing if tolerated.',kind:'good'},
  {title:'Make a schedule you can keep',text:'Add your actual work hours, sleep window and meal-prep blocks to your daily planner.',kind:'good'}
 ];
 const last7=db.runs.filter(r=>diffDays(TODAY,r.date)>=0&&diffDays(TODAY,r.date)<7),prior7=db.runs.filter(r=>diffDays(TODAY,r.date)>=7&&diffDays(TODAY,r.date)<14),curKm=sum(last7,x=>x.distance),prevKm=sum(prior7,x=>x.distance);
 if(prevKm>0){let increase=(curKm/prevKm-1)*100;out.push(increase>15?{title:`Weekly volume up ${Math.round(increase)}%`,text:'You logged a notable seven-day mileage increase. Check fatigue and recovery rather than treating a fixed percentage as an injury predictor.',kind:'notice'}:{title:'Seven-day mileage comparison',text:`Current 7 days: ${displayN(curKm,1)} km. Previous 7 days: ${displayN(prevKm,1)} km (${Math.round(increase)>0?'+':''}${Math.round(increase)}%).`,kind:'good'});}
 const sleepRun=runs.find(r=>r.sleep!==null&&r.sleep!==undefined&&Number(r.sleep)<6);if(sleepRun)out.push({title:'Sleep and recovery deserve attention',text:`A run on ${dateFmt(sleepRun.date)} followed ${sleepRun.sleep} hours of sleep. Your plan advises reducing intensity after inadequate sleep, especially before long runs.`,kind:'notice'});
 const hardEasy=runs.find(r=>r.type==='Easy'&&r.rpe>=8);if(hardEasy)out.push({title:'One easy day felt hard',text:`Your ${dateFmt(hardEasy.date)} easy run was rated ${hardEasy.rpe}/10. Consider heat, fatigue and recovery when interpreting the pace.`,kind:'notice'});
 const long=runs.find(r=>r.duration>=5400);if(long){if(long.fuelCarbs!==null&&long.fuelCarbs!==undefined){const gramsPerHour=Number(long.fuelCarbs)/(long.duration/3600);out.push({title:'Long-run carbohydrate intake',text:`On ${dateFmt(long.date)}, you logged about ${Math.round(gramsPerHour)} g/h of carbohydrate. Compare this with your practiced 50–60 g/h starting target and what your stomach tolerates.`,kind:gramsPerHour<45?'notice':'good'});}else out.push({title:'Capture your fueling rate',text:'You have a run over 90 minutes. Add carbohydrate grams consumed during the run to see grams per hour in your analysis.',kind:'good'});}
 if(!out.length||out.length<3)out.push({title:'Look for trends, not one-offs',text:'A single heart-rate or pace reading cannot establish fitness change. Compare similar sessions across multiple weeks and consider the conditions.',kind:'good'});
 if(out.length<4)out.push({title:'Practice recovery, too',text:'Your current plan schedules lighter strength after Friday long runs, with races replacing Saturday strength work.',kind:'good'});
 return out.slice(0,6);
}
function insights(){
 const all=sortedRuns(),s=runStats(all),n=all.length,week=weekSummary(clamp(weekIndex(TODAY),0,6)),fatigue=all.filter(r=>r.rpe>=8).length;
 const long=all.filter(r=>r.type==='Long run').sort((a,b)=>b.distance-a.distance)[0];
 const runTypes=TYPES.map(t=>({type:t,km:sum(all.filter(r=>r.type===t),r=>r.distance)})).filter(x=>x.km>0).sort((a,b)=>b.km-a.km);
 return `${header('UNDERSTAND THE EFFORT','Training <em>insights.</em>','A clear view of your running patterns, pace and recovery decisions.',button(`${icon('plus')} Log new data`,'add-run','button-primary'))}
  <div class="layout-two"><section class="panel">${panelHeader('Pace progression',`${Math.min(12,n)} most recent runs · lower min/km means faster`)}<div class="chart-area">${svgPace()}</div><div class="chart-legend"><span><i class="legend-dot"></i>Actual distance-based pace</span></div></section>
  <section class="panel">${panelHeader('Effort distribution','Kilometers by run type')}${runTypes.length?runTypes.map((t,i)=>`<div class="macro-row"><span class="macro-name" style="white-space:nowrap">${esc(t.type)}</span>${progress(t.km,Math.max(...runTypes.map(x=>x.km)),i%3===1?'secondary':i%3===2?'sky':'')}<span class="macro-total"><strong>${displayN(t.km,1)}</strong> km</span></div>`).join(''):blankState('Run types appear here','When you add runs, see how mileage is distributed between easy days, quality sessions and long runs.','add-run','Log a run')}</section></div>
  <div class="stat-grid">${statCard('TOTAL KM',displayN(s.km,1),'km','distance',`${n} runs in journal`)}${statCard('LONGEST LOGGED RUN',long?displayN(long.distance,2):'—','km','shoe',long?dateFmt(long.date):'Not logged yet')}${statCard('MEAN RECORDED HR',s.hr?displayN(s.hr,0):'—','bpm','heart','Only runs with HR entries')}${statCard('HIGH-EFFORT RUNS',displayN(fatigue),'RPE ≥ 8','bolt','Based on your subjective rating')}</div>
  <div class="layout-two"><section class="panel">${panelHeader('Training notes','Automatically generated, rule-based observations')}<div class="analysis-list">${recommendations().map(x=>`<div class="analysis-card ${x.kind}"><span class="analysis-icon">${icon(x.kind==='notice'?'info':'check')}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div>`).join('')}</div></section>
  <section class="panel">${panelHeader('Marathon pace reference','Planning examples only · 42.195 km')}<div class="race-paces"><div class="pace-card feature"><small>YOUR SELECTED GOAL</small><strong>${paceStr(secondsDuration(db.settings.marathonGoal)/42.195)} /km</strong><span>${esc(db.settings.marathonGoal)} finish</span></div><div class="pace-card"><small>CONSERVATIVE RANGE</small><strong>4:30–4:37</strong><span>3:10–3:15 planning</span></div><div class="pace-card"><small>STRETCH A GOAL</small><strong>4:16 /km</strong><span>Sub-3 hour marathon</span></div></div>
  <div class="split-line"></div><h3 class="mini-heading">Before you choose race pace</h3><p class="page-subtitle">Use your October 30 and November 6 long runs, the November 14 10K tune-up and race-day conditions to refine your target. The sub-3 goal remains a stretch, not a prediction.</p><div class="top-gap">${button('Edit marathon goal','settings','button-outline')}</div>
  <div class="split-line"></div><h3 class="mini-heading">What this dashboard does not measure</h3><p class="page-subtitle">Without split-by-split data, GPS and environmental conditions, it cannot reliably infer aerobic threshold, cardiac drift, fatigue or injury risk. Use the trends as context, not a diagnosis.</p></section></div>`;
}
function render(){
 const pages={dashboard:['Overview',dashboard],training:['Training plan',training],runs:['Run journal',runs],nutrition:['Nutrition & fuel',nutrition],schedule:['Daily schedule',schedule],insights:['Insights',insights]};
 const [name,fn]=pages[ui.page]||pages.dashboard;$('#topPageName').textContent=name;
 $$('#mainNav .nav-link').forEach(el=>{el.classList.toggle('active',el.dataset.page===ui.page);el.setAttribute('aria-current',el.dataset.page===ui.page?'page':'false');});
 $('#view').innerHTML=fn();
 if(window.PACE_MOTION && typeof window.PACE_MOTION.onRender==='function')window.PACE_MOTION.onRender($('#view'));
 const days=diffDays(RACE,TODAY);$('#sidebarCountdown').textContent=days>=0?`${days}d left`:'Completed';
 $('#raceProgress').style.width=`${clamp(100*diffDays(TODAY,START)/Math.max(1,diffDays(RACE,START)),0,100)}%`;
}
function navigate(page){ui.page=page;render();$('#sidebar').classList.remove('open');$('#mobileOverlay').classList.remove('visible');window.scrollTo({top:0,behavior:'smooth'});}
const PRESETS={
 banana:{name:'Medium banana (estimate)',calories:105,carbs:27,protein:1.3,fat:0.4,water:0,category:'Snack'},
 rice:{name:'Cooked white rice, 1 cup (estimate)',calories:205,carbs:45,protein:4.3,fat:0.4,water:0,category:'Lunch'},
 gel:{name:'Energy gel, typical (check label)',calories:100,carbs:25,protein:0,fat:0,water:0,category:'Run fueling'},
 drink:{name:'Sports drink, 250 mL (check label)',calories:60,carbs:15,protein:0,fat:0,water:250,category:'Run fueling'},
 egg:{name:'One large egg (estimate)',calories:72,carbs:0.4,protein:6.3,fat:4.8,water:0,category:'Breakfast'}
};
function uid(){return typeof crypto!=='undefined'&&typeof crypto.randomUUID==='function'?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`;}
function openDialog(kind,record=null){
 const id=kind+'Dialog',dialog=document.getElementById(id),form=dialog.querySelector('form');form.reset();
 const dates={run:ui.date||TODAY,meal:ui.nutritionDate||TODAY,task:ui.date||TODAY,plan:ui.date||TODAY};
 if(kind==='settings')Object.entries(db.settings).forEach(([k,v])=>{if(form.elements.namedItem(k))form.elements.namedItem(k).value=v;});
 else {const date=form.elements.namedItem('date');if(date)date.value=dates[kind]||TODAY;}
 if(record)Object.entries(record).forEach(([k,v])=>{const field=form.elements.namedItem(k);if(field&&v!==null&&v!==undefined)field.value=k==='duration'?durationStr(v):v;});
 if(kind==='run')$('#runDialogTitle').textContent=record?'Edit run':'Log a run';
 if(kind==='meal')$('#mealDialogTitle').textContent=record?'Edit food entry':'Add a meal';
 if(kind==='task')$('#taskDialogTitle').textContent=record?'Edit activity':'Schedule an activity';
 if(kind==='plan')$('#planDialogTitle').textContent=record?'Edit workout':'Plan a workout';
 dialog.showModal();
}
function getVals(e){return Object.fromEntries(new FormData(e.currentTarget).entries());}
function updateRecord(collection,object){const i=db[collection].findIndex(x=>x.id===object.id);if(i>=0)db[collection][i]=object;else db[collection].push(object);}
function validateDate(date){return /^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(dateObj(date).getTime());}
function commitRun(e){e.preventDefault();const v=getVals(e);const seconds=secondsDuration(v.duration),dist=num(v.distance);if(!Number.isFinite(seconds)||seconds<=0||dist<=0||dist>1000||!validateDate(v.date)){notify('Check distance, date and time format (e.g. 54:30 or 1:14:20).');return;}
 const nOpt=k=>v[k]===''?null:Number(v[k]);const object={id:v.id||uid(),date:v.date,type:TYPES.includes(v.type)?v.type:'Other',distance:dist,duration:seconds,hr:nOpt('hr'),rpe:nOpt('rpe'),sleep:nOpt('sleep'),fuelCarbs:nOpt('fuelCarbs'),fluids:nOpt('fluids'),shoe:v.shoe||'',notes:v.notes||''};
 if(object.hr!==null&&(object.hr<40||object.hr>240)||object.rpe!==null&&(object.rpe<1||object.rpe>10)||object.sleep!==null&&(object.sleep<0||object.sleep>24)){notify('Check optional heart rate, effort and sleep values.');return;}
 updateRecord('runs',object);db.plan.filter(p=>p.date===object.date&&p.km>0&&p.type!=='Strength').forEach(p=>p.complete=true);$('#runDialog').close();rerender();notify(v.id?'Run updated':'Run logged — nice work!');
}
function commitMeal(e){e.preventDefault();const v=getVals(e);if(!validateDate(v.date)||!v.name.trim())return notify('Please enter a valid date and food name.');const fields=['calories','carbs','protein','fat','water'];if(fields.some(k=>!Number.isFinite(Number(v[k]))||Number(v[k])<0))return notify('Nutrition values cannot be negative.');
 updateRecord('meals',{id:v.id||uid(),date:v.date,name:v.name.trim(),category:v.category,calories:num(v.calories),carbs:num(v.carbs),protein:num(v.protein),fat:num(v.fat),water:num(v.water)});$('#mealDialog').close();rerender();notify('Food entry saved');
}
function commitTask(e){e.preventDefault();const v=getVals(e);if(!validateDate(v.date)||!v.title.trim())return notify('Enter a valid date and activity name.');const old=db.tasks.find(t=>t.id===v.id);updateRecord('tasks',{id:v.id||uid(),date:v.date,time:v.time||'',title:v.title.trim(),category:v.category,notes:v.notes||'',done:old?.done||false});$('#taskDialog').close();rerender();notify('Activity scheduled');
}
function commitPlan(e){e.preventDefault();const v=getVals(e);if(!validateDate(v.date)||!v.title.trim()||num(v.km)<0)return notify('Enter a date, workout name and valid distance.');const old=db.plan.find(p=>p.id===v.id);updateRecord('plan',{id:v.id||uid(),date:v.date,title:v.title.trim(),type:TYPES.includes(v.type)?v.type:'Other',km:Math.max(0,num(v.km)),pace:v.pace||'',notes:v.notes||'',complete:old?.complete||false});$('#planDialog').close();rerender();notify('Workout saved');
}
function commitSettings(e){e.preventDefault();const v=getVals(e);const goal=secondsDuration(v.marathonGoal);if(!Number.isFinite(goal)||goal<7200||goal>86400)return notify('Enter a marathon goal like 3:10:00.');const keys=['weight','weeklyGoal','calories','carbs','protein','fat','water'];if(keys.some(k=>!Number.isFinite(Number(v[k]))||Number(v[k])<0))return notify('Please check the target values.');db.settings={...db.settings,...Object.fromEntries(keys.map(k=>[k,num(v[k])])),marathonGoal:v.marathonGoal};$('#settingsDialog').close();rerender();notify('Your targets have been updated');}
function download(filename,content,mime){const blob=new Blob([content],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function exportCSV(){const cols=['date','type','distance','duration','pace_per_km','hr','rpe','sleep','fuelCarbs','fluids','shoe','notes'];const csv=[cols.join(','),...sortedRuns().map(r=>cols.map(k=>{let v=k==='duration'?durationStr(r.duration):k==='pace_per_km'?paceStr(r.duration/r.distance):r[k]??'';return '"'+String(v).replaceAll('"','""')+'"';}).join(','))].join('\r\n');download(`PACE_runs_${TODAY}.csv`,csv,'text/csv;charset=utf-8');notify('Run CSV exported');}
function exportBackup(){download(`PACE_full_backup_${TODAY}.json`,JSON.stringify({...db,exportedAt:new Date().toISOString()},null,2),'application/json');notify('Your full backup is downloading');}
async function importBackup(file){if(!file)return;try{const s=JSON.parse(await file.text());if(!s||!Array.isArray(s.runs)||!Array.isArray(s.meals)||!Array.isArray(s.plan)||!Array.isArray(s.tasks)||!s.settings)throw new Error('Invalid backup');if(!window.confirm('Replace the data in this browser with the imported backup? Export your current data first if needed.'))return;
 db={...defaultData(),...s,settings:{...defaultData().settings,...s.settings},water:Array.isArray(s.water)?s.water:[]};rerender();notify('Backup restored successfully');}catch(e){console.error(e);notify('Unable to import: not a compatible PACE JSON backup.');}finally{$('#backupInput').value='';}}
const actions={
 'add-run':()=>openDialog('run'), 'add-meal':()=>openDialog('meal'), 'add-task':()=>openDialog('task'), 'add-plan':()=>openDialog('plan'), 'settings':()=>openDialog('settings'),
 'training':()=>navigate('training'),'runs':()=>navigate('runs'),'nutrition':()=>navigate('nutrition'),'schedule':()=>navigate('schedule'),'insights':()=>navigate('insights'),'dashboard':()=>navigate('dashboard'),
 'set-week':el=>{ui.week=clamp(num(el.dataset.week),0,6);render();},'prev-week':()=>{ui.week=Math.max(0,ui.week-1);render();},'next-week':()=>{ui.week=Math.min(6,ui.week+1);render();},
 'toggle-plan':el=>{let p=db.plan.find(p=>p.id===el.dataset.id);if(p){p.complete=!p.complete;rerender();notify(p.complete?'Workout marked complete':'Workout marked not complete');}},
 'edit-plan':el=>openDialog('plan',db.plan.find(p=>p.id===el.dataset.id)),
 'delete-plan':el=>{if(window.confirm('Delete this custom workout?')){db.plan=db.plan.filter(p=>p.id!==el.dataset.id);rerender();notify('Workout removed');}},
 'edit-run':el=>openDialog('run',db.runs.find(r=>r.id===el.dataset.id)),
 'delete-run':el=>{if(window.confirm('Delete this run permanently?')){db.runs=db.runs.filter(r=>r.id!==el.dataset.id);rerender();notify('Run deleted');}},
 'run-filter':el=>{ui.runFilter=el.dataset.filter;render();},'export-csv':()=>exportCSV(),'export-backup':()=>exportBackup(), 'import-backup':()=>$('#backupInput').click(),
 'edit-meal':el=>openDialog('meal',db.meals.find(m=>m.id===el.dataset.id)),
 'delete-meal':el=>{if(window.confirm('Delete this food entry?')){db.meals=db.meals.filter(m=>m.id!==el.dataset.id);rerender();notify('Food entry removed');}},
 'add-water':()=>{db.water.push({id:uid(),date:ui.nutritionDate,ml:250});rerender();notify('+250 mL fluids logged');},
 'preset-food':el=>{let p=PRESETS[el.dataset.preset];if(!p)return;openDialog('meal');const f=$('#mealForm');Object.entries(p).forEach(([k,v])=>f.elements.namedItem(k).value=v);},
 'nutri-prev':()=>{ui.nutritionDate=addDays(ui.nutritionDate,-1);render();},'nutri-next':()=>{ui.nutritionDate=addDays(ui.nutritionDate,1);render();},
 'schedule-prev':()=>{ui.date=addDays(ui.date,-7);render();},'schedule-next':()=>{ui.date=addDays(ui.date,7);render();},
 'schedule-today':()=>{ui.date=TODAY;render();},'select-day':el=>{ui.date=el.dataset.date;render();},
 'edit-task':el=>openDialog('task',db.tasks.find(t=>t.id===el.dataset.id)),
 'toggle-task':el=>{const t=db.tasks.find(x=>x.id===el.dataset.id);if(t){t.done=!t.done;rerender();notify(t.done?'Activity completed':'Activity reopened');}},
 'delete-task':el=>{if(window.confirm('Delete this activity?')){db.tasks=db.tasks.filter(t=>t.id!==el.dataset.id);rerender();notify('Activity deleted');}},
 'go-nutri-date':el=>{ui.nutritionDate=el.dataset.date;navigate('nutrition');},
 'log-day-run':()=>{openDialog('run');$('#runForm').elements.namedItem('date').value=ui.date;}
};
function init(){
 $$('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
 $('#currentDate').textContent=dateFmt(TODAY,{weekday:'short',month:'short',day:'numeric',year:'numeric'});
 $$('#mainNav .nav-link').forEach(el=>el.addEventListener('click',()=>navigate(el.dataset.page)));
 $('#settingsBtn').addEventListener('click',()=>openDialog('settings'));
 document.addEventListener('click',e=>{const button=e.target.closest('button[data-action]');if(!button||button.disabled)return;const fn=actions[button.dataset.action];if(fn)fn(button);});
 $('#runForm').addEventListener('submit',commitRun);$('#mealForm').addEventListener('submit',commitMeal);$('#taskForm').addEventListener('submit',commitTask);$('#planForm').addEventListener('submit',commitPlan);$('#settingsForm').addEventListener('submit',commitSettings);
 $$('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
 $$('.app-dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close();}));
 $('#view').addEventListener('change',e=>{if(e.target.id==='nutritionDatePicker'){ui.nutritionDate=e.target.value;render();}if(e.target.id==='scheduleDatePicker'){ui.date=e.target.value;render();}});
 $('#mobileMenu').addEventListener('click',()=>{$('#sidebar').classList.add('open');$('#mobileOverlay').classList.add('visible');});
 $('#mobileOverlay').addEventListener('click',()=>{$('#sidebar').classList.remove('open');$('#mobileOverlay').classList.remove('visible');});
 $('#backupInput').addEventListener('change',e=>importBackup(e.target.files?.[0]));
 // Backups are accessible from the settings panel and the dashboard, without external services.
 const archive=document.createElement('div');archive.className='backup-dock';archive.innerHTML=`<button class="backup-button" data-action="export-backup" title="Download JSON backup">${icon('download')} <span>Backup</span></button><button class="backup-button" data-action="import-backup" title="Restore JSON backup">${icon('upload')} <span>Restore</span></button>`;$('#sidebar').insertBefore(archive,$('.sidebar-bottom'));
 render();
}
init();
})();
