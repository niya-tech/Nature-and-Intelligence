import {useEffect,useRef,useState} from 'react';
import {LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid} from 'recharts';
import {DEFS,make,W,H,fmt,defaults} from './sims';
const saved={};
export default function SimView({id}){
 const D=DEFS[id],cv=useRef(),st=useRef({p:saved[id]||defaults(id),sim:make(id),play:true,sp:1,acc:0});
 const [p,setP]=useState(st.current.p),[play,setPlay]=useState(true),[sp,setSp]=useState(1),[m,setM]=useState([]),[hist,setH]=useState([]);
 const upd=o=>{st.current.p={...st.current.p,...o};saved[id]=st.current.p;setP(st.current.p)};
 useEffect(()=>{const s=st.current,g=cv.current.getContext('2d');let raf,t0=0;
  const loop=t=>{if(s.play){s.acc+=s.sp;while(s.acc>=1){s.sim.step(s.p,1);s.acc--}}s.sim.draw(g,s.p);
   if(t-t0>400){t0=t;const mm=s.sim.metrics(s.p);setM(mm);if(s.play)setH(h=>[...h.slice(-90),{t:h.length?h[h.length-1].t+1:0,a:mm[0]?.[2],b:mm[1]?.[2]}])}
   raf=requestAnimationFrame(loop)};
  raf=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf)},[]);
 const tog=()=>{st.current.play=!st.current.play;setPlay(st.current.play)};
 const reset=()=>{st.current.sim=make(id);st.current.acc=0;setH([]);cv.current.getContext('2d').clearRect(0,0,W,H)};
 const rnd=()=>{const o={};for(const q of D.params)o[q.k]=q.t?(R()<.5?1:0):+(q.min+Math.round(Math.random()*(q.max-q.min)/q.s)*q.s).toFixed(3);upd(o)};
 const R=Math.random;
 return <div className="fade grid lg:grid-cols-[1fr_320px] gap-5">
  <div className="space-y-4">
   <div className="glass p-2" style={{boxShadow:`0 0 60px ${D.c}22`}}><canvas ref={cv} width={W} height={H} className="w-full rounded-xl bg-[#05070c]"/></div>
   <div className="flex flex-wrap gap-2 items-center">
    <button className="btn" onClick={tog}>{play?'⏸ Pause':'▶ Play'}</button><button className="btn" onClick={reset}>↺ Reset</button><button className="btn" onClick={rnd}>🎲 Randomize</button>
    <span className="text-xs text-slate-400 ml-2">Speed</span>{[.5,1,2,4].map(v=><button key={v} className="btn" style={sp===v?{borderColor:D.c,color:D.c}:{}} onClick={()=>{st.current.sp=v;setSp(v)}}>{v}×</button>)}
   </div>
   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{m.map(([k,l,v,u])=><div key={k} className="glass p-3"><div className="text-[11px] uppercase tracking-wider text-slate-400">{l}</div><div className="text-2xl font-semibold" style={{color:D.c}}>{fmt(v)}<span className="text-xs text-slate-400 ml-1">{u}</span></div></div>)}</div>
   <div className="glass p-4 h-56"><div className="text-xs text-slate-400 mb-1">Live: {m[0]?.[1]} <span style={{color:D.c}}>●</span> · {m[1]?.[1]} <span className="text-amber-300">●</span></div>
    <ResponsiveContainer width="100%" height="90%"><LineChart data={hist}><CartesianGrid stroke="#ffffff10"/><XAxis dataKey="t" hide/><YAxis stroke="#64748b" fontSize={11} domain={['auto','auto']}/><Tooltip contentStyle={{background:'#0b1020',border:'1px solid #334155'}}/>
     <Line dataKey="a" stroke={D.c} dot={false} isAnimationActive={false}/><Line dataKey="b" stroke="#fbbf24" dot={false} isAnimationActive={false}/></LineChart></ResponsiveContainer></div>
  </div>
  <div className="glass p-4 space-y-3 h-fit"><h3 className="font-semibold" style={{color:D.c}}>{D.name} parameters</h3>
   {D.params.map(q=>q.t?<label key={q.k} className="flex justify-between items-center text-sm"><span>{q.l}</span><button className="btn" style={p[q.k]?{borderColor:D.c,color:D.c}:{}} onClick={()=>upd({[q.k]:p[q.k]?0:1})}>{p[q.k]?'On':'Off'}</button></label>
   :<label key={q.k} className="block text-sm"><div className="flex justify-between"><span>{q.l}</span><span className="text-slate-400">{+p[q.k].toFixed(3)}</span></div><input type="range" min={q.min} max={q.max} step={q.s} value={p[q.k]} onChange={e=>upd({[q.k]:+e.target.value})}/></label>)}
   <button className="btn w-full" onClick={()=>upd(defaults(id))}>Restore defaults</button></div>
 </div>}
