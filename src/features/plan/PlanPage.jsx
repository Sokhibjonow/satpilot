import useStore from '../../store/appStore.js'
import { SUBJ, DIFF } from '../../data/constants.js'
import { getWeak, buildDailyPlan } from '../../hooks/useProgress.js'
import { useState } from 'react'

export default function PlanPage() {
  const { skills, diagDone, setScreen } = useStore()
  const weak = getWeak(skills)
  const plan = buildDailyPlan(skills)
  const [exp,setExp]=useState(0)
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((s,i)=>({s,today:i===0,tasks:plan.slice(0,i===0?plan.length:i%2===0?2:1)}))

  if(!diagDone) return(
    <div className="page"><div className="ph"><div className="pt">My <em>Plan</em></div></div>
      <div className="card" style={{textAlign:'center',padding:'36px 24px'}}><div style={{fontSize:36,marginBottom:10}}>📋</div><div style={{fontFamily:'var(--sf)',fontSize:19,marginBottom:7}}>Your plan is waiting</div><button className="btn btn-g" onClick={()=>setScreen('mod-intro')}>Start Diagnostic →</button></div></div>
  )

  return(
    <div className="page">
      <div className="ph"><div className="pt">My <em>Plan</em></div><div className="ps">Adaptive · Focuses on weak areas</div></div>
      {weak.length>0&&<div style={{background:'rgba(201,168,76,.06)',border:'1px solid rgba(201,168,76,.2)',borderRadius:11,padding:'11px 15px',marginBottom:13,fontSize:13}}>🤖 Extra focus on {weak.slice(0,2).map(([k])=>SUBJ[k]?.label).join(' & ')} this week.</div>}
      {days.map((d,i)=>(
        <div key={i} className="ad-day">
          <div className="ad-hd" onClick={()=>setExp(exp===i?-1:i)}>
            <div style={{fontWeight:600,fontSize:13,width:32}}>{d.s}</div>
            {d.today&&<span className="today-tag">Today</span>}
            <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:8,fontSize:11,color:'var(--mt)',fontFamily:'var(--sm)'}}>{d.tasks.length} tasks <span>{exp===i?'▲':'▼'}</span></div>
          </div>
          {exp===i&&<div className="ad-body">
            {d.tasks.map((t,j)=>(
              <div key={j} className="ad-tr">
                <div style={{width:4,height:4,borderRadius:'50%',background:'var(--g)',flexShrink:0}}/>
                <div style={{flex:1}}>{t.name}<span style={{fontSize:10,color:'var(--mt)',marginLeft:6,fontFamily:'var(--sm)'}}>{SUBJ[t.subject]?.label}</span></div>
                <span className={`diff-tag d${t.diff}`}>{DIFF[t.diff]?.label}</span>
                <span style={{fontSize:10,fontFamily:'var(--sm)',color:'var(--mt)'}}>{t.dur}</span>
              </div>
            ))}
          </div>}
        </div>
      ))}
    </div>
  )
}
