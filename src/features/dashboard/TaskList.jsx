import useStore from '../../store/appStore.js'
import { SUBJ, DIFF } from '../../data/constants.js'
import { buildDailyPlan } from '../../hooks/useProgress.js'

export default function TaskList() {
  const { tasks, skills, diagDone, soundOn, setSoundOn, setTasks, toggleTask, setScreen } = useStore()
  const done = tasks.filter(t=>t.done).length
  const dw = tasks.filter(t=>t.done).reduce((s,t)=>(DIFF[t.diff]?.weight||1)+s,0)
  const tw = tasks.reduce((s,t)=>(DIFF[t.diff]?.weight||1)+s,0)
  const wp = tw>0?Math.round((dw/tw)*100):0

  return(
    <div className="card tasks-card">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:3}}>
        <div>
          <div className="cl" style={{margin:0}}>Today's AI Plan</div>
          <div style={{fontSize:10,color:'var(--mt)',marginTop:1}}>
            {tasks.filter(t=>t.type==='mandatory').length} core · {tasks.filter(t=>t.type==='challenge').length} challenge
          </div>
        </div>
        <div style={{display:'flex',gap:7,alignItems:'center'}}>
          <button onClick={()=>setSoundOn(!soundOn)}
            style={{fontSize:11,padding:'4px 9px',background:soundOn?'rgba(74,124,89,.08)':'var(--warm)',border:`1px solid ${soundOn?'rgba(74,124,89,.25)':'var(--bd)'}`,color:soundOn?'var(--sg)':'var(--mt)',borderRadius:7,cursor:'pointer'}}>
            {soundOn?'🔊':'🔇'}
          </button>
          <span className="badge b-g">{done}/{tasks.length}</span>
        </div>
      </div>

      {tasks.length>0&&(
        <div style={{marginBottom:12,marginTop:6}}>
          <div className="gp-t" style={{height:8}}><div className="gp-f" style={{width:`${wp}%`}}/></div>
          <div className="gp-lb"><span>Weighted: {wp}%</span><span>{dw}/{tw} pts</span></div>
        </div>
      )}

      {!diagDone?(
        <div style={{textAlign:'center',padding:'20px 0'}}>
          <div style={{fontSize:26,marginBottom:7}}>📋</div>
          <div style={{fontSize:12,color:'var(--mt)',marginBottom:13,lineHeight:1.6}}>Complete diagnostic to unlock tasks.</div>
          <button className="btn btn-dk btn-sm" onClick={()=>useStore.getState().setScreen('mod-intro')}>Start Diagnostic →</button>
        </div>
      ):(
        <>
          {tasks.map(t=>(
            <div key={t.id} className={`task-row${t.done?' done-row':''}`}>
              <button className={`task-cb${t.done?' done-cb':''}`} onClick={()=>toggleTask(t.id)}>{t.done&&'✓'}</button>
              <div className="task-info">
                <div className={`task-name${t.done?' str':''}`}>{t.name}</div>
                <div className="task-meta">{t.sub} · {SUBJ[t.subject]?.label}</div>
              </div>
              {t.type==='challenge'?<span className="ttb ttb-c">+50XP</span>:t.type==='mandatory'?<span className="ttb ttb-m">Core</span>:null}
              <span className={`diff-tag d${t.diff}`}>{DIFF[t.diff]?.label}</span>
              <div style={{fontSize:10,fontFamily:'var(--sm)',color:'var(--mt)',background:'var(--warm)',padding:'2px 6px',borderRadius:4,flexShrink:0}}>{t.dur}</div>
            </div>
          ))}
          <div className="t-foot">
            <button className="btn btn-dk btn-sm" onClick={()=>useStore.getState().setPage('ai')}>✦ AI Help</button>
            <button className="btn btn-out btn-sm" onClick={()=>setTasks(buildDailyPlan(skills))}>↺ Refresh</button>
          </div>
        </>
      )}
    </div>
  )
}
