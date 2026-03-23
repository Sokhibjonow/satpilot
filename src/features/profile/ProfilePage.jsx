import { useState } from 'react'
import useStore from '../../store/appStore.js'
import { xpLvl } from '../../hooks/useProgress.js'
import { LS } from '../../hooks/useLocalStorage.js'

export default function ProfilePage() {
  const st = useStore()
  const { goal, exam, xp, streak, achs, diagDone, wrong, focusHist, notifS, setNotifS, soundOn, setSoundOn, resetAll } = st
  const [importTxt,setImportTxt]=useState('')
  const [importErr,setImportErr]=useState('')
  const lvl=xpLvl(xp)

  const exportData=()=>{
    const keys=['sc_goal','sc_exam','sc_skills','sc_xp','sc_streak','sc_sdots','sc_tasks','sc_diag','sc_achs','sc_dans','sc_phist','sc_plan','sc_hlog','sc_fhist','sc_wrong','sc_anal','sc_coach','sc_notif','sc_sound','sc_qatt']
    const data={}; keys.forEach(k=>{const v=LS.get(k);if(v!==null)data[k]=v})
    try{navigator.clipboard.writeText(JSON.stringify({v:1,ts:Date.now(),data}));alert('✓ Progress copied!');}catch{alert('Copy failed')}
  }
  const importData=(txt)=>{
    try{const p=JSON.parse(txt.trim());if(!p.v||!p.data)throw new Error();Object.entries(p.data).forEach(([k,v])=>LS.set(k,v));alert('✓ Imported! Reloading...');setTimeout(()=>window.location.reload(),1000);}
    catch{setImportErr('Invalid backup code.')}
  }

  return(
    <div className="page">
      <div className="ph"><div className="pt">Profile</div><div className="ps">Settings · Backup · Notifications</div></div>

      <div className="card" style={{maxWidth:480,marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:18}}>
          <div style={{width:48,height:48,borderRadius:12,background:'linear-gradient(135deg,var(--g),var(--r))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>👤</div>
          <div><div style={{fontFamily:'var(--sf)',fontSize:20}}>Student</div>
            <div style={{display:'flex',gap:6,alignItems:'center',marginTop:3}}>
              <span className="badge b-g">{xp} XP</span>
              {diagDone&&<span className="badge b-sg">Diag ✓</span>}
              <span className="badge b-sk">{achs.length} Achs</span>
            </div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
          {[{l:'Goal',v:goal||'SAT 1400'},{l:'Exam Date',v:exam||'Not set'},{l:'Streak',v:`${streak}🔥`},{l:'Level',v:`Lvl ${lvl}`},{l:'Focus Sessions',v:`${focusHist.length} done`},{l:'Mistakes Saved',v:`${wrong.length}`}].map(f=>(
            <div key={f.l} style={{background:'var(--cr)',border:'1px solid var(--bd)',borderRadius:9,padding:'11px 13px'}}>
              <div style={{fontSize:10,textTransform:'uppercase',letterSpacing:'.07em',color:'var(--mt)',fontFamily:'var(--sm)'}}>{f.l}</div>
              <div style={{fontSize:15,fontWeight:600,marginTop:3}}>{f.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{maxWidth:480,marginBottom:14}}>
        <div className="cl" style={{marginBottom:12}}>🔔 Notifications</div>
        {[{k:'streak',icon:'🔥',t:'Streak at Risk'},{k:'tasks',icon:'📋',t:'Task Reminder'},{k:'weak',icon:'💡',t:'Weak Area Reminder'},{k:'back',icon:'👋',t:'Welcome Back'},{k:'diag',icon:'📊',t:'Diagnostic Reminder'}].map(n=>(
          <div key={n.k} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid var(--bd2)'}}>
            <div style={{fontSize:13,fontWeight:500}}>{n.icon} {n.t}</div>
            <button onClick={()=>setNotifS({...notifS,[n.k]:!notifS[n.k]})}
              style={{width:40,height:22,borderRadius:99,background:notifS[n.k]?'var(--sg)':'var(--warm)',position:'relative',cursor:'pointer',transition:'background .2s',flexShrink:0,border:'none'}}>
              <div style={{width:16,height:16,borderRadius:'50%',background:'white',position:'absolute',top:3,left:notifS[n.k]?21:3,transition:'left .2s',boxShadow:'0 1px 4px rgba(0,0,0,.2)'}}/>
            </button>
          </div>
        ))}
        <div style={{marginTop:10,display:'flex',gap:8,alignItems:'center'}}>
          <span style={{fontSize:13,fontWeight:500}}>🔊 Sound Effects</span>
          <button onClick={()=>setSoundOn(!soundOn)}
            style={{width:40,height:22,borderRadius:99,background:soundOn?'var(--sg)':'var(--warm)',position:'relative',cursor:'pointer',transition:'background .2s',flexShrink:0,border:'none',marginLeft:'auto'}}>
            <div style={{width:16,height:16,borderRadius:'50%',background:'white',position:'absolute',top:3,left:soundOn?21:3,transition:'left .2s',boxShadow:'0 1px 4px rgba(0,0,0,.2)'}}/>
          </button>
        </div>
      </div>

      <div className="card" style={{maxWidth:480,marginBottom:14}}>
        <div className="cl" style={{marginBottom:12}}>📲 Backup & Sync</div>
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid var(--bd2)'}}>
          <span style={{fontSize:20}}>📤</span>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>Export Progress</div><div style={{fontSize:11,color:'var(--mt)'}}>Copy to clipboard</div></div>
          <button className="btn btn-g btn-sm" onClick={exportData}>Backup</button>
        </div>
        <div style={{padding:'10px 0'}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:6}}>📥 Import Progress</div>
          <textarea className="imp-ta" placeholder="Paste backup code here..." value={importTxt} onChange={e=>{setImportTxt(e.target.value);setImportErr('')}}/>
          {importErr&&<div style={{fontSize:11,color:'var(--r)',marginTop:4}}>{importErr}</div>}
          <button className="btn btn-dk btn-sm" style={{marginTop:8}} disabled={!importTxt.trim()} onClick={()=>importData(importTxt)}>Import</button>
        </div>
      </div>

      <div className="card" style={{maxWidth:480}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div><div style={{fontSize:13,fontWeight:600,color:'var(--r)'}}>Reset All Data</div><div style={{fontSize:11,color:'var(--mt)'}}>Clear all progress permanently</div></div>
          <button className="btn btn-sm" style={{background:'var(--r)',color:'white'}} onClick={resetAll}>Reset</button>
        </div>
      </div>
    </div>
  )
}
