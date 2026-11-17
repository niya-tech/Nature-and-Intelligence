export const W=900,H=560;
const R=Math.random,TAU=Math.PI*2,cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const P=(k,l,min,max,s,d)=>({k,l,min,max,s,d}),T=(k,l)=>({k,l,t:1,d:0});
export const fmt=v=>typeof v!=='number'?v:Math.abs(v)>=100?v.toFixed(0):v.toFixed(2);
const flockP=[P('sep','Separation',0,3,.05,1.4),P('ali','Alignment',0,3,.05,1.1),P('coh','Cohesion',0,3,.05,.8)];
export const DEFS={
fish:{name:'Fish Schooling',sub:'Boids · predator avoidance',c:'#22d3ee',params:[P('n','Fish population',10,400,5,150),P('pred','Predator proximity',0,250,5,120),...flockP,P('speed','Speed',.5,6,.1,2.6),P('rad','Neighbour radius',15,150,1,55),P('dist','Environmental disturbance',0,1,.02,.15)]},
bee:{name:'Honeybee Colonies',sub:'Foraging · waggle-dance recruitment',c:'#fbbf24',params:[P('n','Bee population',20,400,5,150),P('sc','Scouts',1,100,1,15),P('src','Food sources',1,8,1,4),P('qual','Food quality',.1,1,.05,.6),P('avail','Availability',10,300,5,100),P('comm','Communication efficiency',0,1,.05,.6),P('comp','Competition',0,1,.05,.3),T('obst','Obstacles')]},
bird:{name:'Bird Flocking',sub:'Emergent coordination · wind',c:'#a78bfa',params:[P('n','Bird population',20,400,5,160),P('speed','Speed',.5,6,.1,3),P('wind','Wind intensity',0,4,.1,.8),P('wdir','Wind direction (°)',0,360,5,30),...flockP,P('rad','Neighbour radius',15,150,1,70),P('dist','Disturbance',0,1,.02,.1),T('obst','Obstacles')]},
ant:{name:'Ant Colonies',sub:'Ant Colony Optimization · stigmergy',c:'#60a5fa',params:[P('n','Ant population',20,500,5,200),P('src','Food sources',1,6,1,3),P('phero','Pheromone intensity',.2,5,.1,1.5),P('evap','Evaporation',.001,.05,.001,.01),P('explore','Exploration',0,1,.05,.25),P('avail','Food availability',20,500,10,150),T('obst','Obstacles')]}};
const OBS=()=>[{x:300,y:170,r:45},{x:620,y:380,r:55},{x:470,y:270,r:30}];
const drawObs=(g,obs)=>{g.fillStyle='rgba(148,163,184,.16)';g.strokeStyle='rgba(148,163,184,.45)';for(const o of obs){g.beginPath();g.arc(o.x,o.y,o.r,0,TAU);g.fill();g.stroke()}};
const bnc=o=>{if(o.x<0||o.x>W){o.vx*=-1;o.x=cl(o.x,0,W)}if(o.y<0||o.y>H){o.vy*=-1;o.y=cl(o.y,0,H)}};

function flock(kind){
 const A=[],pr={x:R()*W,y:R()*H,vx:1,vy:0};let obs=[],ea=0,ev=0;
 const mk=()=>{const a=R()*TAU;return{x:R()*W,y:R()*H,vx:Math.cos(a)*2,vy:Math.sin(a)*2,nd:0}};
 return{
 step(p,dt){
  while(A.length<p.n)A.push(mk());A.length=p.n;
  obs=kind==='bird'&&p.obst?(obs.length?obs:OBS()):[];
  const r2=p.rad*p.rad,s0=p.speed,wa=(p.wdir||0)*Math.PI/180,wx=kind==='bird'?Math.cos(wa)*p.wind*.35:0,wy=kind==='bird'?Math.sin(wa)*p.wind*.35:0;
  if(kind==='fish'&&p.pred>0){let b=null,bd=1e9;for(const a of A){const d=(a.x-pr.x)**2+(a.y-pr.y)**2;if(d<bd){bd=d;b=a}}
   if(b){const d=Math.sqrt(bd)||1;pr.vx+=((b.x-pr.x)/d*s0*.85-pr.vx)*.05;pr.vy+=((b.y-pr.y)/d*s0*.85-pr.vy)*.05}pr.x+=pr.vx*dt;pr.y+=pr.vy*dt;bnc(pr)}
  for(const a of A){
   let sx=0,sy=0,ax=0,ay=0,cx=0,cy=0,c=0,md=1e9;const sr=(p.rad*.4)**2;
   for(const b of A){if(a===b)continue;const dx=b.x-a.x,dy=b.y-a.y,d2=dx*dx+dy*dy;if(d2<md)md=d2;
    if(d2<r2){c++;ax+=b.vx;ay+=b.vy;cx+=dx;cy+=dy;if(d2<sr&&d2>0){sx-=dx/d2*20;sy-=dy/d2*20}}}
   a.nd=Math.sqrt(md);let fx=0,fy=0;
   if(c){fx=p.sep*sx*.15+p.ali*(ax/c-a.vx)*.12+p.coh*(cx/c)*.01;fy=p.sep*sy*.15+p.ali*(ay/c-a.vy)*.12+p.coh*(cy/c)*.01}
   fx+=(R()-.5)*p.dist*1.2;fy+=(R()-.5)*p.dist*1.2;
   if(kind==='fish'&&p.pred>0){const dx=a.x-pr.x,dy=a.y-pr.y,d=Math.hypot(dx,dy)||1;if(d<p.pred){const f=(1-d/p.pred)*2.5;fx+=dx/d*f;fy+=dy/d*f}}
   for(const o of obs){const dx=a.x-o.x,dy=a.y-o.y,d=Math.hypot(dx,dy)||1;if(d<o.r+35){const f=(1-(d-o.r)/35)*2.5;fx+=dx/d*f;fy+=dy/d*f}if(d<o.r){a.x=o.x+dx/d*o.r;a.y=o.y+dy/d*o.r}}
   if(a.x<40)fx+=.3;if(a.x>W-40)fx-=.3;if(a.y<40)fy+=.3;if(a.y>H-40)fy-=.3;
   a.vx+=fx*dt;a.vy+=fy*dt;const s=Math.hypot(a.vx,a.vy)||1,ns=cl(s,s0*.7,s0*1.2);a.vx*=ns/s;a.vy*=ns/s;
   a.x+=(a.vx+wx)*dt;a.y+=(a.vy+wy)*dt;bnc(a)}},
 draw(g,p){
  g.fillStyle='rgba(5,7,12,.28)';g.fillRect(0,0,W,H);drawObs(g,obs);
  g.fillStyle=kind==='fish'?'#22d3ee':'#a78bfa';g.beginPath();
  for(const a of A){const s=Math.hypot(a.vx,a.vy)||1,ux=a.vx/s,uy=a.vy/s;g.moveTo(a.x+ux*7,a.y+uy*7);g.lineTo(a.x-ux*4-uy*3,a.y-uy*4+ux*3);g.lineTo(a.x-ux*4+uy*3,a.y-uy*4-ux*3)}
  g.fill();
  if(kind==='fish'&&p.pred>0){g.strokeStyle='rgba(251,113,133,.35)';g.beginPath();g.arc(pr.x,pr.y,p.pred,0,TAU);g.stroke();g.fillStyle='#fb7185';g.beginPath();g.arc(pr.x,pr.y,9,0,TAU);g.fill()}
  if(kind==='bird'&&p.wind>0){const w=p.wdir*Math.PI/180;g.strokeStyle='rgba(167,139,250,.5)';g.beginPath();g.moveTo(40,40);g.lineTo(40+Math.cos(w)*p.wind*14,40+Math.sin(w)*p.wind*14);g.stroke();g.fillStyle='#a78bfa';g.fillText('wind',34,28)}},
 metrics(){const n=A.length;if(!n)return[];let cx=0,cy=0,vx=0,vy=0,nd=0,sp=0;
  for(const a of A){cx+=a.x;cy+=a.y;const s=Math.hypot(a.vx,a.vy)||1;vx+=a.vx/s;vy+=a.vy/s;sp+=s;nd+=a.nd}
  cx/=n;cy/=n;let ds=0;for(const a of A)ds+=Math.hypot(a.x-cx,a.y-cy);ds/=n;const al=Math.hypot(vx,vy)/n,d=al-ea;ea+=d*.02;ev+=(d*d-ev)*.02;
  const co=cl(1-ds/260,0,1),st=cl(1-Math.sqrt(ev)*6,0,1);
  return kind==='fish'?[['ali','Alignment',al,''],['coh','Cohesion',co,''],['nd','Avg neighbour distance',nd/n,'px'],['disp','Dispersion',ds,'px'],['n','Population',n,'']]
  :[['ali','Synchronization',al,''],['coh','Cohesion',co,''],['vel','Avg velocity',sp/n,'px/f'],['stab','Stability',st,''],['n','Flock size',n,'']]}};}

function bee(){
 const hv={x:W/2,y:H/2};let B=[],S=[],obs=[],tick=0,rate=0,first=null,dec=null;
 const mkS=()=>{let x,y;do{x=60+R()*(W-120);y=40+R()*(H-80)}while(Math.hypot(x-hv.x,y-hv.y)<130);return{x,y,b:R()*.6-.3,amt:100,found:false,q:.5}};
 const go=(b,s)=>{let nx=b.x+Math.cos(b.a)*s,ny=b.y+Math.sin(b.a)*s;
  for(const o of obs){const d=Math.hypot(nx-o.x,ny-o.y);if(d<o.r+4){const t=Math.atan2(ny-o.y,nx-o.x);nx=o.x+Math.cos(t)*(o.r+4);ny=o.y+Math.sin(t)*(o.r+4);b.a+=.9}}
  if(nx<2||nx>W-2||ny<2||ny>H-2){b.a+=Math.PI;nx=cl(nx,2,W-2);ny=cl(ny,2,H-2)}b.x=nx;b.y=ny};
 const mv=(b,tx,ty,s)=>{b.a=Math.atan2(ty-b.y,tx-b.x);go(b,s)};
 return{
 step(p,dt){tick++;obs=p.obst?(obs.length?obs:OBS()):[];
  while(S.length<p.src)S.push(mkS());S.length=p.src;
  S.forEach(s=>{s.q=cl(p.qual+s.b,.05,1);s.amt=Math.min(p.avail,s.amt+.03*dt)});
  let bi=0;S.forEach((s,i)=>{if(s.q>S[bi].q)bi=i});
  while(B.length<p.n)B.push({x:hv.x,y:hv.y,a:R()*TAU,st:0,t:0,ld:0,tm:0,sc:0});B.length=p.n;let got=0;
  B.forEach((b,i)=>{b.sc=i<p.sc;
   if(b.st===0){if(b.sc||R()<.002){b.st=1;b.tm=0;b.a=R()*TAU}else{b.x=cl(b.x+(R()-.5)*.8,hv.x-20,hv.x+20);b.y=cl(b.y+(R()-.5)*.8,hv.y-20,hv.y+20)}}
   else if(b.st===1){b.tm+=dt;b.a+=(R()-.5)*.5;go(b,2.2*dt);
    for(let j=0;j<S.length;j++){const s=S[j];if(s.amt>1&&Math.hypot(b.x-s.x,b.y-s.y)<16){if(!s.found){s.found=true;if(first===null)first=tick}s.amt-=1+p.comp*2;b.t=j;b.ld=1;b.st=3;break}}
    if(!b.sc&&b.tm>350)b.st=3}
   else if(b.st===2){const s=S[b.t];if(!s||s.amt<1){b.st=1;b.tm=0}else{mv(b,s.x,s.y,2.6*dt);if(Math.hypot(b.x-s.x,b.y-s.y)<10){s.amt-=1+p.comp*2;b.ld=1;b.st=3}}}
   else{mv(b,hv.x,hv.y,2.6*dt);if(Math.hypot(b.x-hv.x,b.y-hv.y)<8){let nx=b.sc?1:0;
    if(b.ld&&S[b.t]){const s=S[b.t];got+=s.q;if(s.amt>1){let k=Math.floor(p.comm*s.q*3+R());for(const o of B){if(!k)break;if(o.st===0&&!o.sc){o.st=2;o.t=b.t;k--}}if(!b.sc&&R()<.4+p.comm*.5)nx=2}}
    b.ld=0;b.tm=0;b.st=nx}}});
  rate+=(got*100-rate)*.02;
  let tot=0,cb=0;for(const b of B)if(b.st===2||(b.st===3&&b.ld)){tot++;if(b.t===bi)cb++}
  if(dec===null&&tot>=5&&cb/tot>=.5)dec=tick},
 draw(g,p){g.fillStyle='rgba(5,7,12,.3)';g.fillRect(0,0,W,H);drawObs(g,obs);
  for(const s of S){g.fillStyle=`rgba(251,191,36,${.25+s.q*.6})`;g.beginPath();g.arc(s.x,s.y,6+s.amt/p.avail*16,0,TAU);g.fill();g.strokeStyle=s.found?'#fde68a':'#475569';g.stroke()}
  g.strokeStyle='#fbbf24';g.lineWidth=2;g.beginPath();g.arc(hv.x,hv.y,22,0,TAU);g.stroke();g.lineWidth=1;
  for(const b of B){g.fillStyle=b.ld?'#fff':b.sc?'#22d3ee':b.st===2?'#fb923c':'#fbbf24';g.fillRect(b.x-1.5,b.y-1.5,3.5,3.5)}},
 metrics(){const n=S.filter(s=>s.found).length,sc=B.filter(b=>b.st===1).length,act=B.filter(b=>b.st>0).length||1;
  return[['sc','Active scouts',sc,''],['rate','Collection rate',rate,'/100t'],['disc','Discovered sources',n,`/${S.length}`],['expl','Exploration share',sc/act*100,'%'],['first','First discovery',first??0,'ticks'],['dec','Decision time',dec??900,'ticks']]}};}

function ant(){
 const GW=150,GH=94,ph=new Float32Array(GW*GH),nest={x:90,y:H/2};let A=[],S=[],obs=[],trips=[],best=0,oc,ox,im;
 const ci=(x,y)=>cl((y/H*GH)|0,0,GH-1)*GW+cl((x/W*GW)|0,0,GW-1);
 return{
 step(p,dt){obs=p.obst?(obs.length?obs:[{x:300,y:200,r:50},{x:300,y:360,r:50},{x:520,y:280,r:45}]):[];
  while(S.length<p.src)S.push({x:380+R()*460,y:50+R()*(H-100),amt:p.avail,seen:false});S.length=p.src;S.forEach(s=>s.amt=Math.min(p.avail,s.amt+.05));
  while(A.length<p.n)A.push({x:nest.x,y:nest.y,a:R()*TAU,r:0,len:0});A.length=p.n;
  for(const a of A){const sp=2*dt;
   if(!a.r){let ba=a.a,bv=.03;for(const o of[-.7,0,.7]){const v=ph[ci(a.x+Math.cos(a.a+o)*14,a.y+Math.sin(a.a+o)*14)];if(v>bv){bv=v;ba=a.a+o}}
    if(bv>.03&&R()>p.explore*.6)a.a+=(ba-a.a)*.4+(R()-.5)*.2;else a.a+=(R()-.5)*(.3+p.explore*1.4)}
   else{a.a=Math.atan2(nest.y-a.y,nest.x-a.x)+(R()-.5)*.15;
    for(const o of obs){const dx=a.x-o.x,dy=a.y-o.y,d=Math.hypot(dx,dy);if(d<o.r+22){const cr=(nest.x-a.x)*dy-(nest.y-a.y)*dx;a.a=Math.atan2(dy,dx)+(cr>0?1:-1)*1.45}}
    const c=ci(a.x,a.y);ph[c]=Math.min(20,ph[c]+p.phero*.5*Math.min(2,350/(a.len+60)))}
   let nx=a.x+Math.cos(a.a)*sp,ny=a.y+Math.sin(a.a)*sp,hit=nx<2||nx>W-2||ny<2||ny>H-2;
   for(const o of obs)if(Math.hypot(nx-o.x,ny-o.y)<o.r)hit=true;
   if(hit){a.a+=Math.PI/2+R();continue}
   a.x=nx;a.y=ny;a.len+=sp;
   if(!a.r){for(const s of S)if(s.amt>1&&Math.hypot(a.x-s.x,a.y-s.y)<12){s.amt--;s.seen=true;a.r=1;break}}
   else if(Math.hypot(a.x-nest.x,a.y-nest.y)<14){trips.push(a.len);if(trips.length>40)trips.shift();best=best?Math.min(best,a.len):a.len;a.r=0;a.len=0;a.a=R()*TAU}}
  const k=1-p.evap*dt;for(let i=0;i<ph.length;i++)ph[i]*=k},
 draw(g,p){if(!oc){oc=document.createElement('canvas');oc.width=GW;oc.height=GH;ox=oc.getContext('2d');im=ox.createImageData(GW,GH)}
  const d=im.data;for(let i=0;i<ph.length;i++){d[i*4]=192;d[i*4+1]=132;d[i*4+2]=252;d[i*4+3]=Math.min(255,ph[i]*60)}ox.putImageData(im,0,0);
  g.fillStyle='#05070c';g.fillRect(0,0,W,H);g.drawImage(oc,0,0,W,H);drawObs(g,obs);
  for(const s of S){g.fillStyle='rgba(251,191,36,.8)';g.beginPath();g.arc(s.x,s.y,5+s.amt/p.avail*14,0,TAU);g.fill()}
  g.strokeStyle='#60a5fa';g.lineWidth=2;g.beginPath();g.arc(nest.x,nest.y,16,0,TAU);g.stroke();g.lineWidth=1;
  for(const a of A){g.fillStyle=a.r?'#fff':'#60a5fa';g.fillRect(a.x-1.2,a.y-1.2,2.8,2.8)}},
 metrics(){const n=S.filter(s=>s.seen),rec=trips.slice(-30),avg=rec.length?rec.reduce((x,y)=>x+y,0)/rec.length:0;
  const opt=n.length?Math.min(...n.map(s=>2*Math.hypot(s.x-nest.x,s.y-nest.y))):0;
  return[['best','Best route',best,'px'],['avg','Average route',avg,'px'],['eff','Optimization progress',avg&&opt?Math.min(100,opt/avg*100):0,'%'],['seen','Discovered sources',n.length,`/${S.length}`],['n','Active ants',A.length,'']]}};}

export const make=id=>({fish:()=>flock('fish'),bird:()=>flock('bird'),bee,ant}[id])();
export const defaults=id=>Object.fromEntries(DEFS[id].params.map(q=>[q.k,q.d]));
export async function runLab(id,over,key,steps){
 const p={...defaults(id),...over},s=make(id);let sum=0,c=0;
 for(let i=0;i<steps;i++){s.step(p,1);if(i>=steps-100&&i%10===0){const m=s.metrics(p).find(x=>x[0]===key);if(m){sum+=m[2];c++}}}
 await new Promise(r=>setTimeout(r));return c?sum/c:0}
export async function bench(){const o={};for(const id of Object.keys(DEFS)){const p={...defaults(id)},s=make(id);for(let i=0;i<300;i++)s.step(p,1);o[id]=s.metrics(p);await new Promise(r=>setTimeout(r))}return o}
