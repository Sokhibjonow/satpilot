import { useEffect } from 'react'

const fmt = s => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`

export default function Timer({ time, running, onTick, warn=120 }) {
  useEffect(()=>{
    if(!running||time<=0) return
    const t = setTimeout(()=>onTick(time-1),1000)
    return ()=>clearTimeout(t)
  },[running,time])

  return (
    <div className={`fc-chip${time<warn?' warn':''}`}>
      <span className="fc-dot"/>
      {fmt(time)}
    </div>
  )
}
