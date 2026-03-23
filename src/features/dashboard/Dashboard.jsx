import useStore from '../../store/appStore.js'
import { SUBJ, RANKS } from '../../data/constants.js'
import { calcGoal, s2score, getWeak, getStrong, rankScore, getRank, xpLvl, xpIn, predictScore, buildMissions } from '../../hooks/useProgress.js'
import TaskList from './TaskList.jsx'

export default function Dashboard() {
  const st = useStore()
  const {
    skills, xp, streak, diagDone, wrong, coachU, coachDis, setCoachDis,
    decayAlert, setDecayAlert, predictMins, setPredictMins, progHist,
    tasks, sDots, anal, goal, exam
  } = st

  // Computed values - all safe with defaults
  const gp    = calcGoal(skills)
  const es    = s2score(skills)
  const weak  = getWeak(skills)
  const strong= getStrong(skills)
  const lvl   = xpLvl(xp)
  const xpin  = xpIn(xp)
  const rs    = rankScore(skills, streak, xp, anal)
  const rk    = getRank(rs)
  const nrk   = RANKS[RANKS.findIndex(r=>r.id===rk.id)+1]
  const p2n   = nrk ? Math.round(((rs-rk.min)/(nrk.min-rk.min))*100) : 100
  const missions = buildMissions(tasks, streak, xp, diagDone)

  const chartData = (() => {
    if (progHist.length < 2) return [0,0,0,0,0,0,gp]
    const l = [...progHist.slice(-6).map(p=>p.pct||0), gp]
    while (l.length < 7) l.unshift(0)
    return l
  })()

  const pr = diagDone ? predictScore(skills, anal, streak, exam, predictMins) : null

  const nav = (p) => st.setPage(p)

  return (
    <div className="page">
      <div className="ph">
        <div className="pt">Welcome <em>back</em></div>
        <div className="ps">{goal || 'StudyCoach'} · {exam}{diagDone ? ' · Diagnostic ✓' : ''}</div>
      </div>

      {/* Decay alert */}
      {decayAlert && decayAlert.length > 0 && (
        <div className="decay-card">
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
            <span style={{fontSize:22}}>📉</span>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:'#f4a87a'}}>Skills decayed while away</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>Train today to recover</div>
            </div>
            <button style={{marginLeft:'auto',background:'none',border:'none',fontSize:16,color:'rgba(255,255,255,.3)',cursor:'pointer'}} onClick={()=>setDecayAlert(null)}>✕</button>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
            {decayAlert.map((d,i) => <span key={i} className="decay-chip">📉 {d.label} −{d.lost}%</span>)}
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:12,color:'rgba(255,255,255,.5)'}}>
            <span>Focus to stop decay</span>
            <button className="btn btn-sm" style={{background:'var(--r)',color:'white',fontSize:11}} onClick={()=>{setDecayAlert(null);nav('focus')}}>Start Focus →</button>
          </div>
        </div>
      )}

      {/* Coach update */}
      {coachU && coachU.date !== coachDis && diagDone && (
        <div className="coach-card">
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,var(--g),var(--g2))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🤖</div>
            <div>
              <div style={{fontFamily:'var(--sf)',fontSize:16,color:'white'}}>AI Coach Update</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,.4)',fontFamily:'var(--sm)'}}>{coachU.date}</div>
            </div>
          </div>
          <div style={{display:'flex',gap:7,flexWrap:'wrap',marginBottom:12}}>
            {(coachU.changes||[]).map((c,i) => <span key={i} className={`cc-item${c.delta>0?' cc-up':' cc-dn'}`}>{c.delta>0?'↑':'↓'} {c.subject} {c.delta>0?'+':''}{c.delta}%</span>)}
          </div>
          <div style={{fontSize:13,color:'rgba(255,255,255,.8)',padding:'10px 13px',background:'rgba(255,255,255,.05)',borderRadius:9,borderLeft:'2px solid var(--g)'}}>💡 {coachU.rec}</div>
          <div style={{marginTop:10,fontSize:11,color:'rgba(255,255,255,.3)',cursor:'pointer',textAlign:'right'}} onClick={()=>setCoachDis(new Date().toDateString())}>Dismiss</div>
        </div>
      )}

      {/* Predictor */}
      {pr && (
        <div className="pred-card">
          <div style={{fontFamily:'var(--sf)',fontSize:20,color:'white',marginBottom:3}}>🔮 Future Score <em style={{fontStyle:'italic',color:'var(--g2)'}}>Predictor</em></div>
          <div style={{fontSize:11,color:'rgba(255,255,255,.4)',fontFamily:'var(--sm)',marginBottom:16}}>Accuracy {pr.acc}% · {pr.daysLeft} days to exam</div>
          <div style={{textAlign:'center',marginBottom:20}}>
            <div style={{fontFamily:'var(--sf)',fontSize:58,color:'var(--g2)',lineHeight:1,letterSpacing:-2}}>{pr.cur}</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.4)',fontFamily:'var(--sm)',marginTop:2}}>current estimated score</div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,color:'rgba(255,255,255,.6)',marginBottom:8,display:'flex',justifyContent:'space-between'}}>
              <span>Daily study time</span>
              <span style={{color:'var(--g2)',fontFamily:'var(--sm)',fontWeight:700}}>{predictMins} min/day</span>
            </div>
            <input type="range" className="pred-sl" min={10} max={120} step={5} value={predictMins} onChange={e=>setPredictMins(+e.target.value)}/>
          </div>
          <div className="pred-scens">
            {pr.scenarios.map((s,i) => (
              <div key={i} className={`pred-s${i===2?' best':''}`}>
                <div style={{fontSize:10,color:'rgba(255,255,255,.45)',fontFamily:'var(--sm)'}}>{s.weeks} weeks</div>
                <div style={{fontFamily:'var(--sf)',fontSize:26,color:'var(--g2)',lineHeight:1,marginBottom:3}}>{s.pred}</div>
                <div style={{fontSize:12,fontWeight:600,color:'#7ed4a0',fontFamily:'var(--sm)'}}>+{s.gain} pts</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagnostic banner */}
      {!diagDone && (
        <div className="diag-banner">
          <div style={{fontSize:32,flexShrink:0}}>📋</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:'var(--sf)',fontSize:19,color:'white',marginBottom:3}}>Take the <em style={{fontStyle:'italic',color:'var(--g)'}}>Diagnostic Test</em></div>
            <div style={{fontSize:12,color:'rgba(255,255,255,.45)',lineHeight:1.6}}>20 questions · Math + English · ~12 min · All skills start at 0%.</div>
          </div>
          <button className="db-btn" onClick={()=>st.setScreen('mod-intro')}>Start →</button>
        </div>
      )}

      <div className="dash-grid">
        {/* Skills card */}
        <div className="card">
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:12}}>
            <div>
              <div className="cl" style={{margin:0,marginBottom:4}}>Goal</div>
              <div className="g-score">{goal || 'SAT'}</div>
            </div>
            <span className="badge b-g">{gp}%</span>
          </div>
          <div className="sk-list" style={{marginBottom:10}}>
            {Object.entries(skills).map(([k,v]) => (
              <div key={k} className="sk-row">
                <div style={{fontSize:12,fontWeight:500}}>{SUBJ[k]?.label}</div>
                <div className="sk-track"><div className="sk-fill" style={{width:`${v}%`,background:SUBJ[k]?.color}}/></div>
                <div style={{fontSize:10,fontFamily:'var(--sm)',color:'var(--mt)',textAlign:'right'}}>{v}%</div>
              </div>
            ))}
          </div>
          <div className="gp-t"><div className="gp-f" style={{width:`${gp}%`}}/></div>
          <div className="gp-lb"><span>Weighted avg</span><span>{diagDone ? `~${es} SAT` : '—'}</span></div>
        </div>

        {/* Streak & Rank */}
        <div className="card">
          <div className="cl">Streak & Rank</div>
          <div className="str-big">🔥 {streak} <span style={{fontSize:13,color:'var(--mt)',fontFamily:'var(--ss)'}}>days</span></div>
          <div style={{fontSize:11,color:'var(--mt)',marginTop:2,marginBottom:9}}>in a row</div>
          <div className="str-grid">
            {sDots.map((s,i) => (
              <div key={i} className={`str-cell${s==='done'?' done':s==='today'?' today':''}`}>
                {s==='today'?'●':s==='done'?'✓':''}
              </div>
            ))}
          </div>
          <div style={{marginTop:12,padding:'10px 12px',background:'var(--cr)',borderRadius:10}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
              <span style={{fontSize:20}}>{rk.icon}</span>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:rk.color}}>{rk.label}</div>
                <div style={{fontSize:10,color:'var(--mt)'}}>{rk.desc}</div>
              </div>
              <div style={{marginLeft:'auto',fontFamily:'var(--sf)',fontSize:22,color:rk.color}}>{rs}</div>
            </div>
            {nrk && (
              <>
                <div className="gp-t" style={{height:4}}>
                  <div style={{height:'100%',width:`${p2n}%`,background:rk.color,borderRadius:99,transition:'width .8s ease'}}/>
                </div>
                <div style={{fontSize:9,color:'var(--mt)',fontFamily:'var(--sm)',marginTop:3}}>{p2n}% to {nrk.label} {nrk.icon}</div>
              </>
            )}
          </div>
          <div style={{marginTop:10}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:10,fontFamily:'var(--sm)',color:'var(--mt)',marginBottom:4}}>
              <span>XP: {xp}</span><span>Lvl {lvl} → {lvl+1}</span>
            </div>
            <div className="xp-t"><div className="xp-f" style={{width:`${xpin}%`}}/></div>
          </div>
        </div>

        {/* Right column */}
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <div className="card csm">
            <div className="cl">Strengths</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:5,marginTop:3}}>
              {diagDone
                ? (strong.length
                    ? strong.map(([k]) => <span key={k} className="badge b-sg">{SUBJ[k]?.label}</span>)
                    : <span style={{fontSize:11,color:'var(--mt)'}}>Keep going!</span>)
                : <span style={{fontSize:11,color:'var(--mt)'}}>Take the test</span>}
            </div>
          </div>
          <div className="card csm">
            <div className="cl">Needs Work</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:5,marginTop:3}}>
              {diagDone
                ? (weak.length
                    ? weak.map(([k,v]) => <span key={k} className="badge b-r">{SUBJ[k]?.label} {v}%</span>)
                    : <span style={{fontSize:11,color:'var(--mt)'}}>All improving!</span>)
                : <span style={{fontSize:11,color:'var(--mt)'}}>Take the test</span>}
            </div>
          </div>
          {weak.length > 0 && (
            <button className="btn btn-g btn-sm" style={{justifyContent:'center'}} onClick={()=>nav('focus')}>
              🎯 Focus Mode
            </button>
          )}
        </div>

        {/* Tasks */}
        <TaskList/>

        {/* Missions */}
        <div className="card" style={{background:'var(--ink)',color:'white',border:'none'}}>
          <div className="cl" style={{color:'var(--g)'}}>Daily Missions</div>
          {missions.map(m => (
            <div key={m.id} className="m-row">
              <div style={{fontSize:20,flexShrink:0}}>{m.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,.85)'}}>{m.name}</div>
                <div className="m-prog">
                  <div className="mp-t"><div className="mp-f" style={{width:`${m.prog*100}%`}}/></div>
                  <div className="mp-tx">{m.cur}/{m.target}</div>
                </div>
              </div>
              {m.done ? <div style={{fontSize:16}}>✅</div> : <div className="m-xp">+{m.xpR}</div>}
            </div>
          ))}
          <div style={{borderTop:'1px solid rgba(255,255,255,.07)',marginTop:10,paddingTop:10,display:'flex',gap:7}}>
            {[
              {id:'focus',   lbl:'🎯 Focus'},
              {id:'errors',  lbl:`🔍 Errors${wrong.length>0?` (${wrong.length})`:''}`},
              {id:'analytics',lbl:'📊 Stats'},
            ].map(b => (
              <button key={b.id} onClick={()=>nav(b.id)} className="btn btn-sm"
                style={{flex:1,justifyContent:'center',background:'rgba(255,255,255,.07)',color:'rgba(255,255,255,.7)',border:'1px solid rgba(255,255,255,.1)',fontSize:11}}>
                {b.lbl}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
