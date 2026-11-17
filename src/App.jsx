import {useState} from 'react';
import SimView from './SimView';
import {Overview,Lab,Compare,Theory} from './Pages';
const TABS=[['overview','Overview'],['fish','Fish Schooling'],['bee','Honeybee Colonies'],['bird','Bird Flocking'],['ant','Ant Colonies'],['compare','Comparative Analysis'],['lab','Experiment Lab'],['theory','Theory & Research']];
export default function App(){const [t,setT]=useState('overview');
 return <div className="min-h-screen" style={{background:'radial-gradient(circle at 15% 0%,rgba(34,211,238,.10),transparent 40%),radial-gradient(circle at 90% 20%,rgba(167,139,250,.10),transparent 40%),#05070c'}}>
  <header className="sticky top-0 z-20 backdrop-blur bg-[#05070c]/80 border-b border-white/10"><div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4"><div className="font-bold tracking-wide whitespace-nowrap"><span className="text-cyan-300">NATURE</span> × <span className="text-purple-300">INTELLIGENCE</span></div>
   <nav className="flex gap-1 overflow-x-auto">{TABS.map(([k,l])=><button key={k} onClick={()=>setT(k)} className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition ${t===k?'bg-cyan-400/15 text-cyan-200 border border-cyan-400/40':'text-slate-400 hover:text-white border border-transparent'}`}>{l}</button>)}</nav></div></header>
  <main className="max-w-7xl mx-auto px-4 py-6">
   {t==='overview'&&<Overview go={setT}/>}{['fish','bee','bird','ant'].includes(t)&&<SimView key={t} id={t}/>}
   {t==='compare'&&<Compare/>}{t==='lab'&&<Lab/>}{t==='theory'&&<Theory/>}
   <p className="text-center text-xs text-slate-500 mt-10">Intelligence does not always require a central brain.</p></main></div>}
