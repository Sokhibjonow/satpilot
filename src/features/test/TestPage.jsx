import { useState } from 'react'
import useStore from '../../store/appStore.js'
import { DIAG_MODULES } from '../../data/constants.js'
import { DIAG_Q } from '../../data/questions.js'
import { calcSkills, buildDailyPlan } from '../../hooks/useProgress.js'
import QuestionCard from './QuestionCard.jsx'

export default function TestPage() {
  const { setScreen, addHlog, setSkills, setDiagDone, setDAnswers, setTasks, setSDots } = useStore()
  const [modIdx, setModIdx] = useState(0)
  const [qIdx, setQIdx]     = useState(0)
  const [answers, setAnswers] = useState({})
  const [sel, setSel]         = useState(null)
  const [rev, setRev]         = useState(false)
  const [genStatus, setGen]   = useState('')
  const [generating, setGenerating] = useState(false)

  const curMod = DIAG_MODULES[modIdx]
  const curQs  = DIAG_Q[curMod?.id] || []
  const curQ   = curQs[qIdx]

  const advance = () => {
    const nq = qIdx + 1
    if (nq < curQs.length) { setQIdx(nq); setSel(null); setRev(false); return }
    const nm = modIdx + 1
    if (nm < DIAG_MODULES.length) {
      setModIdx(nm); setQIdx(0); setSel(null); setRev(false)
      setScreen('mod-intro'); return
    }
    finishTest()
  }

  const confirm = () => {
    if (sel === null && !rev) return
    if (!rev) { setRev(true); setAnswers(p => ({ ...p, [curQ.id]: sel })) }
    else advance()
  }

  const finishTest = async () => {
    setGenerating(true)
    const statuses = ['Analyzing results...','Calculating skills...','Building your plan...','Done!']
    for (const s of statuses) { setGen(s); await new Promise(r => setTimeout(r, 700)) }
    const computed = calcSkills(answers)
    setSkills(computed)
    setDiagDone(true)
    setDAnswers(answers)
    setTasks(buildDailyPlan(computed))
    setSDots(Array(14).fill('').map((_,i)=>i===0?'today':''))
    addHlog('Completed Diagnostic Test')
    setScreen('app')
  }

  if (generating) return (
    <div className="gen-wrap">
      <div className="gen-orb"/>
      <div className="gen-title">Building your plan</div>
      <div className="gen-st">{genStatus}</div>
    </div>
  )

  if (!curQ) return null

  return (
    <div className="test-wrap">
      <div className="test-inner">
        <div className="t-hdr">
          <div className="t-logo">🛩 SatPilot</div>
          <div style={{fontSize:11,fontFamily:'var(--sm)',color:'var(--mt)'}}>
            {curMod.sec} · {curMod.mod} · {qIdx+1}/5
          </div>
        </div>
        <div className="t-segs">
          {DIAG_MODULES.map((m,i) => (
            <div key={m.id} className={`t-seg${i<modIdx?' done':i===modIdx?' active':''}`}/>
          ))}
        </div>
        <div className="t-pbar">
          <div className="t-pf" style={{width:`${((qIdx+(rev?1:0))/curQs.length)*100}%`}}/>
        </div>
        <div style={{fontSize:11,fontFamily:'var(--sm)',color:'var(--mt)',marginBottom:9}}>
          Q{qIdx+1}/{curQs.length} · {modIdx*5+qIdx+1}/20
        </div>
        <QuestionCard q={curQ} selected={sel} revealed={rev} onSelect={setSel}/>
        <div className="t-nav">
          {!rev
            ? <button className="tbtn-skip" onClick={advance}>Skip →</button>
            : <div/>
          }
          <button className="tbtn tbtn-next" disabled={sel===null&&!rev} onClick={confirm}>
            {!rev
              ? (sel!==null ? 'Check Answer' : 'Select answer')
              : (qIdx===curQs.length-1
                  ? (modIdx===DIAG_MODULES.length-1 ? 'See Results →' : 'Next Section →')
                  : 'Next →')
            }
          </button>
        </div>
      </div>
    </div>
  )
}
