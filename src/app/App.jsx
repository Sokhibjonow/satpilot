import { useState, useEffect } from 'react'
import useStore from '../store/appStore.js'
import Onboarding from '../features/onboarding/Onboarding.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'
import Header from '../components/layout/Header.jsx'
import MobileNav from '../components/layout/MobileNav.jsx'
import TestPage from '../features/test/TestPage.jsx'
import Routes from './routes.jsx'
import { DIAG_MODULES } from '../data/constants.js'
import { DIAG_Q } from '../data/questions.js'
import { calcSkills, s2score, buildDailyPlan } from '../hooks/useProgress.js'

export default function App() {
  const { screen, init } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { init() }, [])

  if (screen === 'ob')        return <Onboarding />
  if (screen === 'mod-intro') return <ModIntro />
  if (screen === 'test')      return <TestPage />
  if (screen === 'results')   return <Results />
  if (screen === 'gen')       return <Generating />

  return (
    <div className="app-wrap">
      <Header onMenu={() => setSidebarOpen(o => !o)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main">
        <Routes />
      </main>
      <MobileNav />
    </div>
  )
}

function ModIntro() {
  const { screen, setScreen, modIdx=0 } = useStore()
  const st = useStore()
  const idx = st.modIdx || 0
  const curMod = DIAG_MODULES[idx]
  if (!curMod) return null
  return (
    <div className="ob-wrap">
      <div className="ob-card" style={{textAlign:'center'}}>
        <div className="ob-logo" style={{justifyContent:'center'}}>⬡ StudyCoach</div>
        <div style={{display:'flex',gap:5,marginBottom:22}}>
          {DIAG_MODULES.map((m,i) => (
            <div key={m.id} style={{flex:1,height:4,borderRadius:99,
              background:i<idx?'var(--sg)':i===idx?'var(--g)':'var(--warm)',transition:'background .4s'}}/>
          ))}
        </div>
        <div style={{fontSize:44,marginBottom:12}}>{curMod.icon}</div>
        <h1 className="ob-title" style={{fontSize:24}}>
          {curMod.sec} — <em style={{fontStyle:'italic',color:'var(--g)'}}>{curMod.mod}</em>
        </h1>
        <div style={{fontSize:12,color:'var(--mt)',margin:'4px 0 16px'}}>
          Section {idx+1} of {DIAG_MODULES.length}
        </div>
        <p className="ob-sub">
          {curMod.level==='easy' ? 'Foundational — take your time.' : 'Advanced — do your best!'}
        </p>
        <button className="ob-btn gold" onClick={() => setScreen('test')}>
          Start {curMod.sec} {curMod.mod} →
        </button>
        {idx > 0 && (
          <div style={{marginTop:9,fontSize:11,color:'var(--mt)'}}>
            {idx}/{DIAG_MODULES.length} done ✓
          </div>
        )}
      </div>
    </div>
  )
}

function Results() {
  const st = useStore()
  const tSkills = calcSkills(st.dAnswers)
  const tScore  = s2score(tSkills)
  const mScores = DIAG_MODULES.map(m => {
    const qs = DIAG_Q[m.id] || []
    const c  = qs.filter(q => st.dAnswers[q.id] === q.c).length
    return { mod:m, c, total:qs.length, pct:Math.round((c/qs.length)*100) }
  })
  const tCorrect = mScores.reduce((s,m) => s+m.c, 0)

  const genPlan = async () => {
    st.setScreen('gen')
    st.setSkills(tSkills)
    st.setDiagDone(true)
    st.setDAnswers(st.dAnswers)
    await new Promise(r => setTimeout(r, 2000))
    st.setTasks(buildDailyPlan(tSkills))
    st.setSDots(Array(14).fill('').map((_,i) => i===0?'today':''))
    st.addHlog('Completed Diagnostic Test')
    st.setScreen('app')
  }

  return (
    <div className="res-wrap">
      <div className="res-card">
        <div className="ob-logo">⬡ StudyCoach</div>
        <div style={{textAlign:'center',marginBottom:16}}>
          <div style={{fontSize:12,color:'var(--mt)',fontFamily:'var(--sm)',marginBottom:3}}>
            {tCorrect}/20 correct
          </div>
          <div style={{fontFamily:'var(--sf)',fontSize:54,color:'var(--g)',lineHeight:1}}>~{tScore}</div>
          <div style={{fontSize:12,color:'var(--mt)'}}>Estimated SAT Score</div>
        </div>
        <div className="res-mods">
          {mScores.map(({mod,c,total,pct}) => (
            <div key={mod.id} className="res-mod">
              <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',fontFamily:'var(--sm)',color:'var(--mt)',marginBottom:5}}>
                {mod.level==='easy'?'M1 · Easier':'M2 · Harder'}
              </div>
              <div style={{fontSize:12,fontWeight:600,color:mod.color,marginBottom:5}}>{mod.sec}</div>
              <div className="rsr">
                <div style={{fontSize:11,width:56,color:'var(--mt)'}}>{c}/{total}</div>
                <div className="rsr-t">
                  <div className="rsr-f" style={{width:`${pct}%`,background:mod.color}}/>
                </div>
                <div style={{fontSize:11,fontFamily:'var(--sm)',width:30,textAlign:'right',
                  color:pct>=60?'var(--sg)':pct>=40?'var(--g)':'var(--r)'}}>
                  {pct}%
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="ob-btn gold" onClick={genPlan}>✦ Build My Personalized Plan</button>
        <div style={{marginTop:9,fontSize:11,color:'var(--mt)',textAlign:'center'}}>
          Results saved · AI focuses on your weakest areas
        </div>
      </div>
    </div>
  )
}

function Generating() {
  return (
    <div className="gen-wrap">
      <div className="gen-orb"/>
      <div className="gen-title">Building your plan</div>
      <div className="gen-st">Analyzing your results...</div>
    </div>
  )
}
