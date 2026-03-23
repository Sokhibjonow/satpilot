import useStore from '../../store/appStore.js'
import { NAV } from '../../data/constants.js'

export default function MobileNav() {
  const { page, setPage } = useStore()
  return (
    <div className="mob-nav">
      <div className="mob-nav-items">
        {NAV.map(n=>(
          <button key={n.id} className={`mni${page===n.id?' active':''}`} onClick={()=>setPage(n.id)}>
            <span className="mni-icon">{n.icon}</span>
            <span className="mni-lbl">{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
