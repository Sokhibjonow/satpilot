import { xpLvl, xpIn } from '../../hooks/useProgress.js'

export default function XPBar({ xp }) {
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:10,fontFamily:'var(--sm)',color:'var(--mt)',marginBottom:4}}>
        <span>XP: {xp}</span><span>Lvl {xpLvl(xp)} → {xpLvl(xp)+1}</span>
      </div>
      <div className="xp-t"><div className="xp-f" style={{width:`${xpIn(xp)}%`}}/></div>
    </div>
  )
}
