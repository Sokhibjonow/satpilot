import { useState } from 'react'
import useStore from '../../store/appStore.js'
import { SUBJ } from '../../data/constants.js'

export default function ErrorsPage() {
  const { wrong, setWrong, setPage, setAiQ } = useStore()
  const [tab,setTab]=useState('all')
  const filtered = tab==='all'?wrong:wrong.filter(w=>w.errType===tab)

  return(
    <div className="page">
      <div className="ph">
        <button onClick={()=>setPage('progress')} style={{fontSize:12,color:'var(--mt)',cursor:'pointer',background:'none',border:'none',fontFamily:'var(--ss)',padding:0,marginBottom:4}}>← Progress</button>
        <div className="pt">Error <em>Review</em></div><div className="ps">{wrong.length} mistakes saved</div>
      </div>
      <div className="err-tabs">
        {[{id:'all',lbl:`All (${wrong.length})`},{id:'concept',lbl:`Concept (${wrong.filter(w=>w.errType==='concept').length})`},{id:'careless',lbl:`Careless (${wrong.filter(w=>w.errType==='careless').length})`}].map(t=>(
          <button key={t.id} className={`err-tab${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>{t.lbl}</button>
        ))}
      </div>
      {wrong.length===0?(
        <div className="card" style={{textAlign:'center',padding:'40px 24px'}}>
          <div style={{fontSize:36,marginBottom:10}}>✅</div>
          <div style={{fontFamily:'var(--sf)',fontSize:18,marginBottom:8}}>No mistakes yet</div>
          <div style={{fontSize:13,color:'var(--mt)',lineHeight:1.6,marginBottom:16}}>Complete Focus sessions to track errors.</div>
          <button className="btn btn-g" onClick={()=>setPage('focus')}>Start Focus →</button>
        </div>
      ):(
        filtered.map((w,i)=>(
          <div key={w.id||i} className="err-card">
            {w.context&&<div style={{fontSize:12,color:'var(--mt)',marginBottom:8,lineHeight:1.6,background:'var(--cr)',padding:'8px 10px',borderRadius:7,borderLeft:'2px solid var(--g)'}}>{w.context}</div>}
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10,gap:10}}>
              <div style={{fontSize:13,fontWeight:500,flex:1,lineHeight:1.5}}>{w.text}</div>
              <div style={{display:'flex',flexDirection:'column',gap:5,alignItems:'flex-end',flexShrink:0}}>
                <span style={{fontSize:10,fontFamily:'var(--sm)',padding:'2px 7px',borderRadius:4,background:w.errType==='concept'?'rgba(201,95,58,.1)':'rgba(201,168,76,.1)',color:w.errType==='concept'?'var(--r)':'var(--g)'}}>{w.errType}</span>
                <span style={{fontSize:10,fontFamily:'var(--sm)',background:'var(--warm)',padding:'2px 7px',borderRadius:4,color:'var(--mt)'}}>{SUBJ[w.subject]?.label}</span>
                <span style={{fontSize:9,color:'var(--mt)',fontFamily:'var(--sm)'}}>{w.date}</span>
              </div>
            </div>
            {(w.options||[]).map((opt,oi)=>(
              <div key={oi} className={`err-opt${oi===w.correct?' eo-ok':oi===w.yourAnswer&&oi!==w.correct?' eo-bad':' eo-n'}`}>
                <span style={{width:20,height:20,borderRadius:5,background:oi===w.correct?'var(--sg)':oi===w.yourAnswer&&oi!==w.correct?'var(--r)':'var(--warm)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,fontFamily:'var(--sm)',color:oi===w.correct||(oi===w.yourAnswer&&oi!==w.correct)?'white':'var(--mt)',flexShrink:0}}>{['A','B','C','D'][oi]}</span>
                {opt}{oi===w.correct&&<span style={{marginLeft:'auto',fontSize:10,opacity:.6}}>✓</span>}
                {oi===w.yourAnswer&&oi!==w.correct&&<span style={{marginLeft:'auto',fontSize:10,opacity:.6}}>✗ yours</span>}
              </div>
            ))}
            <div style={{fontSize:12,color:'var(--mt)',lineHeight:1.6,padding:'8px 10px',background:'var(--cr)',borderRadius:7,marginBottom:8}}>{w.explanation}</div>
            <div style={{display:'flex',gap:7}}>
              <button className="btn btn-out btn-sm" onClick={()=>{setAiQ&&setAiQ(`Explain: ${w.text}`);setPage('ai')}}>✦ AI Explain</button>
              <button className="btn btn-sm" style={{color:'var(--mt)'}} onClick={()=>setWrong(p=>p.filter((_,ix)=>ix!==i))}>✕ Remove</button>
            </div>
          </div>
        ))
      )}
      {wrong.length>0&&<div style={{marginTop:10,display:'flex',gap:8}}>
        <button className="btn btn-out btn-sm" onClick={()=>setPage('focus')}>🎯 Focus Session</button>
        <button className="btn btn-sm" style={{color:'var(--r)'}} onClick={()=>{if(window.confirm('Clear all?'))setWrong([])}}>Clear All</button>
      </div>}
    </div>
  )
}
