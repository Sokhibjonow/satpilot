import { useState } from 'react'
import useStore from '../../store/appStore.js'

export default function Onboarding() {
  const { goal, setGoal, exam, setExam, setScreen } = useStore()
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: <>What is your <em style={{fontStyle:'italic',color:'var(--g)'}}>SAT goal?</em></>,
      sub: 'Set your target score — the AI builds your entire plan around it.',
      content: (
        <div>
          <label className="ob-lbl">Target Score</label>
          <input className="ob-inp" placeholder="e.g. SAT 1400" value={goal} onChange={e=>setGoal(e.target.value)}/>
        </div>
      ),
      valid: goal.trim().length > 1,
    },
    {
      title: <>When is your <em style={{fontStyle:'italic',color:'var(--g)'}}>exam?</em></>,
      sub: 'Your test date shapes the timeline and weekly difficulty.',
      content: (
        <div>
          <label className="ob-lbl">SAT Exam Date</label>
          <input className="ob-inp" placeholder="e.g. May 2026" value={exam} onChange={e=>setExam(e.target.value)}/>
          <div className="ob-chips">
            {['Mar 2026','May 2026','Aug 2026','Oct 2026','Nov 2026'].map(d=>(
              <button key={d} className={`ob-chip${exam===d?' sel':''}`} onClick={()=>setExam(d)}>{d}</button>
            ))}
          </div>
        </div>
      ),
      valid: exam.trim().length > 2,
    },
  ]

  const obs = steps[step]

  return (
    <div className="ob-wrap">
      <div className="ob-bg" style={{width:500,height:500,top:-200,right:-150}}/>
      <div className="ob-card">
        <div className="ob-logo">🛩 SatPilot</div>
        <div className="ob-dots">
          {steps.map((_,i)=><div key={i} className={`ob-dot${i<step?' done':i===step?' active':''}`}/>)}
        </div>
        <h1 className="ob-title">{obs.title}</h1>
        <p className="ob-sub">{obs.sub}</p>
        {obs.content}
        {step===steps.length-1 ? (
          <button className="ob-btn gold" disabled={!obs.valid} onClick={()=>setScreen('app')}>
            Enter Dashboard →
          </button>
        ) : (
          <button className="ob-btn" disabled={!obs.valid} onClick={()=>setStep(s=>s+1)}>
            Next →
          </button>
        )}
        {step>0&&<div className="ob-back" onClick={()=>setStep(s=>s-1)}>← Back</div>}
        {step===steps.length-1&&<div style={{marginTop:9,fontSize:11,color:'var(--mt)',textAlign:'center'}}>Progress saves automatically</div>}
      </div>
    </div>
  )
}
