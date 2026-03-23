import { useState } from 'react'

export default function AIResult({ result }) {
  const [pracSel,setPracSel]=useState(null)
  const [pracRev,setPracRev]=useState(false)
  const [mtAns,setMtAns]=useState({})
  const [mtRev,setMtRev]=useState(false)

  if(result.mode==='explain') {
    const d=result.data
    return(
      <div style={{marginTop:14,animation:'fadeUp .4s ease'}}>
        <div className="card">
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--g)',fontFamily:'var(--sm)',marginBottom:7}}>Topic</div>
          <div style={{fontFamily:'var(--sf)',fontSize:22,marginBottom:8}}>{d.title}</div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--g)',fontFamily:'var(--sm)',marginBottom:7}}>Explanation</div>
            <div style={{fontSize:13,lineHeight:1.75,color:'#2a2a38'}}>{d.explanation}</div>
          </div>
          {d.example&&<><div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--g)',fontFamily:'var(--sm)',marginBottom:7}}>Example</div>
          <div style={{background:'var(--ink)',color:'var(--g2)',borderRadius:9,padding:'13px 16px',fontFamily:'var(--sm)',fontSize:12,lineHeight:1.7,whiteSpace:'pre-wrap',margin:'4px 0'}}>{d.example}</div></>}
          {d.practice&&(
            <div style={{marginTop:13}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--g)',fontFamily:'var(--sm)',marginBottom:7}}>Practice</div>
              <div style={{fontSize:13,fontWeight:500,marginBottom:8}}>{d.practice.q}</div>
              {d.practice.opts?.map((opt,i)=>{
                let cls='mini-opt'
                if(pracRev){cls+=' dis';if(i===d.practice.correct)cls+=' show-ok';else if(i===pracSel&&i!==d.practice.correct)cls+=' bad'}
                else if(i===pracSel)cls+=' sel'
                return<button key={i} className={cls} onClick={()=>{if(!pracRev){setPracSel(i);setPracRev(true);}}}>
                  <span className="mini-lt">{['A','B','C','D'][i]}</span>
                  <span style={{fontSize:12,color:'var(--ink)'}}>{opt}</span>
                </button>
              })}
              {pracRev&&<div className={`t-fb ${pracSel===d.practice.correct?'fb-ok':'fb-bad'}`} style={{marginTop:8}}><span>{pracSel===d.practice.correct?'✓':'✗'}</span><span>{d.practice.exp}</span></div>}
            </div>
          )}
        </div>
      </div>
    )
  }

  // minitest
  const d=result.data
  const correct=Object.entries(mtAns).filter(([qi,a])=>(d.questions||[])[+qi]?.correct===a).length
  return(
    <div style={{marginTop:14}}>
      <div className="card">
        <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--g)',fontFamily:'var(--sm)',marginBottom:7}}>Mini-Test</div>
        <div style={{fontFamily:'var(--sf)',fontSize:22,marginBottom:12}}>{d.title}</div>
        {(d.questions||[]).map((q,qi)=>(
          <div key={qi} style={{marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:500,marginBottom:8}}>Q{qi+1}: {q.q}</div>
            {(q.opts||[]).map((opt,i)=>{
              const s=mtAns[qi]
              let cls='mini-opt'
              if(mtRev){cls+=' dis';if(i===q.correct)cls+=' show-ok';else if(i===s&&i!==q.correct)cls+=' bad'}
              else if(i===s)cls+=' sel'
              return<button key={i} className={cls} onClick={()=>{if(!mtRev)setMtAns(p=>({...p,[qi]:i}))}}>
                <span className="mini-lt">{['A','B','C','D'][i]}</span>
                <span style={{fontSize:12,color:'var(--ink)'}}>{opt}</span>
              </button>
            })}
            {mtRev&&q.exp&&<div className={`t-fb ${mtAns[qi]===q.correct?'fb-ok':'fb-bad'}`} style={{marginTop:8}}><span>{mtAns[qi]===q.correct?'✓':'✗'}</span><span>{q.exp}</span></div>}
          </div>
        ))}
        {!mtRev&&Object.keys(mtAns).length>=(d.questions||[]).length&&(d.questions||[]).length>0
          ?<button className="btn btn-dk btn-sm" onClick={()=>setMtRev(true)}>Check All Answers</button>
          :mtRev&&<div style={{marginTop:10,padding:'8px 12px',background:'var(--cr)',borderRadius:9,fontSize:11,fontFamily:'var(--sm)',color:'var(--mt)'}}>{correct}/{(d.questions||[]).length} correct</div>}
      </div>
    </div>
  )
}
