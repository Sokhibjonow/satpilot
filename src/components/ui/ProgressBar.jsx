export default function ProgressBar({ value=0, color='var(--g)', height=6, className='', label, sublabel }) {
  return (
    <div className={className}>
      <div style={{height,background:'var(--warm)',borderRadius:99,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${Math.min(value,100)}%`,background:color,borderRadius:99,transition:'width .8s ease'}}/>
      </div>
      {(label||sublabel) && (
        <div style={{display:'flex',justifyContent:'space-between',fontSize:10,fontFamily:'var(--sm)',color:'var(--mt)',marginTop:4}}>
          {label&&<span>{label}</span>}
          {sublabel&&<span>{sublabel}</span>}
        </div>
      )}
    </div>
  )
}
