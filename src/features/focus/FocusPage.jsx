import { useState, useRef, useEffect } from 'react'
import useStore from '../../store/appStore.js'
import { SUBJ, FOCUS_TESTS, DIFF } from '../../data/constants.js'
import { FOCUS_BANKS } from '../../data/questions.js'
import { getWeak } from '../../hooks/useProgress.js'

const fmtT = s=>`${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`

export default function FocusPage() {
  const st = useStore()
  const weak = getWeak(st.skills)
  const [fActive,setFActive]=useState(false)
  const [fTest,setFTest]=useState(null)
  const [fQs,setFQs]=useState([])
  const [fIdx,setFIdx]=useState(0)
  const [fAns,setFAns]=useState({})
  const [fSel,setFSel]=useState(null)
  const [fRev,setFRev]=useState(false)
  const [fDone,setFDone]=useState(false)
  const [fTime,setFTime]=useState(0)
  const [fTimerOn,setFTimerOn]=useState(false)
  const timerRef=useRef(null)
  const autoRef=useRef(null)

  useEffect(()=>{
    if(fTimerOn&&fTime>0){timerRef.current=setTimeout(()=>setFTime(t=>t-1),1000)}
    else if(fTimerOn&&fTime===0)setFTimerOn(false)
    return()=>clearTimeout(timerRef.current)
  },[fTimerOn,fTime])

  const startFocus=(ft)=>{
    let bank=[]
    if(ft.s==='mixed'){const w=weak[0]?.[0]||'math';bank=[...(FOCUS_BANKS[w]||[]),...(FOCUS_BANKS.reading||[])]}
    else if(ft.s==='english')bank=[...(FOCUS_BANKS.reading||[]),...(FOCUS_BANKS.grammar||[]),...(FOCUS_BANKS.vocab||[])]
    else bank=FOCUS_BANKS[ft.s]||[]
    const shuffled=[...bank].sort(()=>Math.random()-.5).slice(0,Math.min(ft.n,bank.length))
    if(!shuffled.length){return}
    setFTest(ft);setFQs(shuffled);setFIdx(0);setFAns({});setFSel(null);setFRev(false);setFDone(false)
    setFTime(ft.time);setFTimerOn(true);setFActive(true)
  }

  const confirm=()=>{
    if(fSel===null&&!fRev)return
    const q=fQs[fIdx]
    if(!fRev){
      setFRev(true);setFAns(p=>({...p,[q.id]:fSel}))
      if(st.soundOn&&fSel===q.c){try{const c=new(window.AudioContext||window.webkitAudioContext)();const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.setValueAtTime(.12,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.18);o.start();o.stop(c.currentTime+.18);}catch{}}
      clearTimeout(autoRef.current)
      autoRef.current=setTimeout(()=>{
        const ni=fIdx+1
        if(ni<fQs.length){setFIdx(ni);setFSel(null);setFRev(false)}else finish()
      },800)
    } else {
      clearTimeout(autoRef.current)
      const ni=fIdx+1
      if(ni<fQs.length){setFIdx(ni);setFSel(null);setFRev(false)}else finish()
    }
  }

  const finish=()=>{
    setFTimerOn(false)
    const fa={...fAns,[fQs[fIdx]?.id]:fSel}
    const c=fQs.filter(q=>fa[q.id]===q.c).length
    const pct=Math.round((c/fQs.length)*100)
    const earned=c*8
    st.setXp(x=>x+earned)
    st.setFocusHist(p=>[{date:new Date().toLocaleDateString(),time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),name:fTest?.name,c,total:fQs.length,pct},...p].slice(0,30))
    st.addHlog(`Focus: ${fTest?.name}`,`${c}/${fQs.length}`)
    const wng=fQs.filter(q=>fa[q.id]!==q.c)
    if(wng.length>0)st.setWrong(p=>[...wng.map(q=>({id:q.id+'_'+Date.now(),text:q.t,context:q.cx||null,options:q.o,correct:q.c,yourAnswer:fa[q.id],explanation:q.e,subject:q.s,errType:q.s==='vocab'?'vocab':'concept',date:new Date().toLocaleDateString(),source:fTest?.name})),...p].slice(0,100))
    setFDone(true)
  }

  const fQ=fQs[fIdx]

  if(fActive&&!fDone&&fQ) return(
    <div className="page">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,flexWrap:'wrap',gap:8}}>
        <div><div style={{fontFamily:'var(--sf)',fontSize:18,marginBottom:2}}>{fTest?.name}</div><div style={{fontSize:11,color:'var(--mt)',fontFamily:'var(--sm)'}}>Q{fIdx+1}/{fQs.length}</div></div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div className={`fc-chip${fTime<120?' warn':''}`}><span className="fc-dot"/>{fmtT(fTime)}</div>
          <button className="btn btn-out btn-sm" onClick={()=>{clearTimeout(autoRef.current);finish()}}>End</button>
        </div>
      </div>
      <div className="gp-t" style={{marginBottom:16}}><div className="gp-f" style={{width:`${(fIdx/fQs.length)*100}%`}}/></div>
      <div className="t-card">
        <div style={{fontSize:11,fontFamily:'var(--sm)',color:'var(--mt)',marginBottom:9}}>Question {fIdx+1} of {fQs.length}</div>
        {fQ.cx&&<div className="t-ctx">{fQ.cx}</div>}
        <div className="t-qtxt">{fQ.t}</div>
        <div className="t-opts">
          {fQ.o.map((opt,i)=>{
            let cls='topt'
            if(fRev){cls+=' dis';if(i===fQ.c)cls+=' show-ok';else if(i===fSel&&i!==fQ.c)cls+=' bad'}
            else if(i===fSel)cls+=' sel'
            return<button key={i} className={cls} onClick={()=>!fRev&&setFSel(i)}>
              <span className="tlt">{['A','B','C','D'][i]}</span><span className="ttxt">{opt}</span>
            </button>
          })}
        </div>
        {fRev&&<div className={`t-fb ${fSel===fQ.c?'fb-ok':'fb-bad'}`}><span>{fSel===fQ.c?'✓':'✗'}</span><span><strong>{fSel===fQ.c?'Correct! ':'Incorrect. '}</strong>{fQ.e}</span></div>}
        {fRev&&fIdx<fQs.length-1&&<div className="an-bar vis"><div className="an-fill"/></div>}
      </div>
      <div className="t-nav"><div/>
        <button className="tbtn tbtn-next" disabled={fSel===null&&!fRev} onClick={confirm}>
          {!fRev?(fSel!==null?'Check Answer':'Select answer'):(fIdx===fQs.length-1?'Finish →':'Next → (auto)')}
        </button>
      </div>
    </div>
  )

  if(fDone) return(
    <div className="page">
      <div className="foc-score" style={{marginBottom:24}}>
        <div style={{fontSize:13,color:'var(--mt)',fontFamily:'var(--sm)',marginBottom:4}}>{fTest?.name}</div>
        <div style={{fontFamily:'var(--sf)',fontSize:52,color:'var(--g)',lineHeight:1}}>{st.focusHist[0]?.c}/{st.focusHist[0]?.total}</div>
        <div style={{fontSize:13,color:'var(--mt)',marginBottom:16}}>{st.focusHist[0]?.pct}% correct</div>
        <div style={{display:'flex',gap:9,justifyContent:'center'}}>
          <button className="btn btn-g" onClick={()=>{setFActive(false);setFDone(false)}}>Back to Tests</button>
          <button className="btn btn-out" onClick={()=>startFocus(fTest)}>Retry →</button>
        </div>
      </div>
    </div>
  )

  return(
    <div className="page">
      <div className="ph">
        <button onClick={()=>st.setPage('progress')} style={{fontSize:12,color:'var(--mt)',cursor:'pointer',background:'none',border:'none',fontFamily:'var(--ss)',padding:0,marginBottom:4}}>← Progress</button>
        <div className="pt">🎯 Focus <em>Mode</em></div><div className="ps">Choose a test · Timer · Skills update after session</div>
      </div>
      <div className="focus-grid">
        {Object.entries(SUBJ).map(([k,v])=>(
          <div key={k} className={`ftc ftc-${k}`} onClick={()=>startFocus(FOCUS_TESTS.find(t=>t.s===k)||FOCUS_TESTS[0])}>
            <div style={{fontSize:28,marginBottom:8}}>{k==='math'?'📐':k==='reading'?'📖':k==='grammar'?'✏️':k==='vocab'?'🔤':'📊'}</div>
            <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{v.label}</div>
            <div className="gp-t" style={{height:4,marginTop:8}}><div className="gp-f" style={{width:`${st.skills[k]||0}%`,background:v.color}}/></div>
            <div style={{fontSize:10,fontFamily:'var(--sm)',marginTop:3,color:(st.skills[k]||0)<35?'var(--r)':(st.skills[k]||0)<60?'var(--g)':'var(--sg)'}}>{st.skills[k]||0}% · {(st.skills[k]||0)<35?'Weak':(st.skills[k]||0)<60?'Medium':'Strong'}</div>
          </div>
        ))}
      </div>
      <div className="cl" style={{marginBottom:12}}>All Focus Tests</div>
      <div className="focus-test-list">
        {FOCUS_TESTS.map(ft=>(
          <div key={ft.id} className="ftr" onClick={()=>startFocus(ft)}>
            <div style={{fontSize:22,flexShrink:0}}>{ft.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{ft.name}</div><div style={{fontSize:11,color:'var(--mt)',marginTop:1}}>{ft.desc}</div></div>
            <div style={{display:'flex',gap:6,alignItems:'center',flexShrink:0}}>
              <span className="badge b-g">{ft.n}Q</span>
              <button className="btn btn-dk btn-sm">Start →</button>
            </div>
          </div>
        ))}
      </div>
      {st.focusHist.length>0&&<div style={{marginTop:18}}>
        <div className="cl" style={{marginBottom:10}}>Session History</div>
        {st.focusHist.slice(0,6).map((h,i)=>(
          <div key={i} className="fh-row">
            <div style={{fontSize:10,fontFamily:'var(--sm)',color:'var(--mt)',width:48,flexShrink:0}}>{h.time}</div>
            <div style={{flex:1,fontSize:12,fontWeight:500}}>{h.name}</div>
            <div style={{fontSize:12,fontFamily:'var(--sm)',color:h.pct>=70?'var(--sg)':h.pct>=50?'var(--g)':'var(--r)'}}>{h.c}/{h.total} · {h.pct}%</div>
          </div>
        ))}
      </div>}
    </div>
  )
}
