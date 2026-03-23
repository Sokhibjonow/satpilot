import useStore from '../../store/appStore.js'
import { SUBJ } from '../../data/constants.js'

export default function AnalyticsPage() {
  const { anal, wrong, focusHist, streak, diagDone, setPage } = useStore()
  const st=anal?.subjectStats||{}; const tq=Object.values(st).reduce((s,v)=>s+v.total,0); const tc=Object.values(st).reduce((s,v)=>s+v.correct,0); const oa=tq>0?Math.round((tc/tq)*100):0
  const mt=anal?.mistakeTypes||{concept:0,careless:0,vocab:0}; const tmis=(mt.concept||0)+(mt.careless||0)+(mt.vocab||0)
  const qt=anal?.questionTimes||[]; const spd=(()=>{if(!qt.length)return{};const b={};qt.forEach(({subject:s,ms})=>{if(!b[s])b[s]={t:0,n:0};b[s].t+=ms;b[s].n++;});const r={};Object.entries(b).forEach(([s,{t,n}])=>{r[s]=Math.round(t/n/1000);});return r;})()
  const SAT_T={reading:75,math:90,grammar:60,vocab:45,data:80}

  if(!diagDone) return(
    <div className="page"><div className="ph"><button onClick={()=>setPage('progress')} style={{fontSize:12,color:'var(--mt)',cursor:'pointer',background:'none',border:'none',fontFamily:'var(--ss)',padding:0,marginBottom:4}}>← Progress</button><div className="pt">True <em>Analytics</em></div></div>
      <div className="card" style={{textAlign:'center',padding:'36px 24px'}}><div style={{fontSize:36,marginBottom:10}}>📊</div><div style={{fontFamily:'var(--sf)',fontSize:18,marginBottom:7}}>No data yet</div><button className="btn btn-g" onClick={()=>setPage('dashboard')}>Take Diagnostic →</button></div></div>
  )

  return(
    <div className="page">
      <div className="ph"><button onClick={()=>setPage('progress')} style={{fontSize:12,color:'var(--mt)',cursor:'pointer',background:'none',border:'none',fontFamily:'var(--ss)',padding:0,marginBottom:4}}>← Progress</button><div className="pt">True <em>Analytics</em></div><div className="ps">Accuracy · Mistakes · Speed</div></div>
      <div className="an-grid">
        {[{val:`${oa}%`,lbl:'Overall Accuracy',color:'var(--sg)'},{val:focusHist.length,lbl:'Focus Sessions',color:'var(--g)'},{val:wrong.length,lbl:'Mistakes Saved',color:'var(--r)'},{val:streak,lbl:'Day Streak',color:'var(--sk)'}].map(s=>(
          <div key={s.lbl} className="an-card"><div style={{fontFamily:'var(--sf)',fontSize:28,color:s.color,lineHeight:1,marginBottom:3}}>{s.val}</div><div style={{fontSize:11,color:'var(--mt)',fontFamily:'var(--sm)'}}>{s.lbl}</div></div>
        ))}
      </div>
      {Object.keys(SUBJ).length>0&&<div className="card" style={{marginBottom:14}}>
        <div className="cl" style={{marginBottom:12}}>Accuracy by Subject</div>
        {Object.keys(SUBJ).map(k=>{const s=st[k]||{correct:0,total:0};const a=s.total>0?Math.round((s.correct/s.total)*100):null;return(
          <div key={k} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid var(--bd2)'}}>
            <div style={{fontWeight:500,fontSize:13,width:90,flexShrink:0}}>{SUBJ[k]?.label}</div>
            <div style={{flex:1,height:5,background:'var(--warm)',borderRadius:99,overflow:'hidden'}}><div style={{height:'100%',background:a===null?'var(--warm)':a>=70?'var(--sg)':a>=50?'var(--g)':'var(--r)',width:`${a||0}%`,transition:'width .8s ease'}}/></div>
            <div style={{fontSize:11,fontFamily:'var(--sm)',color:'var(--mt)',width:36,textAlign:'right'}}>{a!==null?`${a}%`:'—'}</div>
            <div style={{fontSize:10,color:'var(--mt)',fontFamily:'var(--sm)',width:44,textAlign:'right'}}>{s.total>0?`${s.correct}/${s.total}`:'—'}</div>
          </div>
        )})}
      </div>}
    </div>
  )
}
