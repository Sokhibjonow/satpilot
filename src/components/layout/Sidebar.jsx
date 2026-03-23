import useStore from '../../store/appStore.js'
import { NAV } from '../../data/constants.js'
import { xpLvl, xpIn } from '../../hooks/useProgress.js'

export default function Sidebar({ open, onClose }) {
  const { page, setPage, xp, wrong, diagDone, goal } = useStore()
  const lvl = xpLvl(xp)
  const xpin = xpIn(xp)

  const navigate = (id) => { setPage(id); onClose() }

  return (
    <>
      <div className={`sb-ov${open?' open':''}`} onClick={onClose}/>
      <nav className={`sidebar${open?' open':''}`}>
        <div className="sb-logo">🛩 <span>SatPilot</span></div>

        {NAV.map(n => (
          <button key={n.id} className={`sb-item${page===n.id?' active':''}`} onClick={()=>navigate(n.id)}>
            <span style={{fontSize:15,width:19,textAlign:'center'}}>{n.icon}</span>
            <span>{n.label}</span>
            {n.id==='dashboard'&&!diagDone&&<span className="sb-badge">!</span>}
          </button>
        ))}

        <div style={{padding:'8px 10px 0',marginTop:8,borderTop:'1px solid rgba(255,255,255,.06)'}}>
          <div style={{fontSize:10,color:'rgba(255,255,255,.22)',padding:'3px 8px 7px',letterSpacing:'.1em',textTransform:'uppercase'}}>Tools</div>
          {[
            {id:'focus',   icon:'🎯', label:'Focus'},
            {id:'errors',  icon:'🔍', label:`Errors${wrong.length>0?` (${wrong.length})`:''}`},
            {id:'analytics',icon:'📊',label:'Analytics'},
          ].map(n=>(
            <button key={n.id} className={`sb-item${page===n.id?' active':''}`} onClick={()=>navigate(n.id)}>
              <span style={{fontSize:14,width:19,textAlign:'center'}}>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </div>

        <div className="sb-xp">
          <div className="sb-xpm">Level {lvl} · {xp} XP</div>
          <div className="sb-xpt"><div className="sb-xpf" style={{width:`${xpin}%`}}/></div>
        </div>

        <div className="sb-bot">
          <div className="sb-user">
            <div className="sb-av">👤</div>
            <div>
              <div style={{fontSize:12,color:'rgba(255,255,255,.58)',fontWeight:500}}>{goal||'Student'}</div>
              <div style={{fontSize:10,color:'var(--g)',fontFamily:'var(--sm)'}}>Lvl {lvl} · Free</div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
