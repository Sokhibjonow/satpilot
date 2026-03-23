import { useState } from 'react'
import useStore from '../../store/appStore.js'
import { SUBJ } from '../../data/constants.js'
import { getWeak } from '../../hooks/useProgress.js'
import AIResult from './AIResult.jsx'

const callClaude = async (messages, system) => {
  const r = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, system })
  })
  const d = await r.json()
  if (!r.ok) {
    console.error('API error:', d)
    throw new Error(d.error || `HTTP ${r.status}`)
  }
  return d.content?.find(b => b.type === 'text')?.text || ''
}

export default function AIPage() {
  const { skills, diagDone, setXp, addHlog } = useStore()
  const weak = getWeak(skills)
  const [aiQ,setAiQ]       = useState('')
  const [aiRes,setAiRes]   = useState(null)
  const [aiLoad,setAiLoad] = useState(false)
  const [aiWeak,setAiWeak] = useState(null)
  const [aiWeakLoad,setAiWeakLoad] = useState(false)

  const ask = async (q, mode='explain') => {
    const query=(q||aiQ).trim(); if(!query)return
    setAiQ(query); setAiLoad(true); setAiRes(null)
    const sys = 'You are SatPilot SAT tutor. Respond ONLY valid JSON (no markdown, no backticks). Only discuss SAT topics.'
    const prompt = mode==='minitest'
      ? `Create 4 SAT practice questions about:"${query}". JSON only: {"title":"str","questions":[{"q":"str","opts":["A","B","C","D"],"correct":0,"exp":"str"}]}`
      : `Explain this SAT concept:"${query}". JSON only: {"title":"str","explanation":"2-3 sentences about SAT","example":"concrete SAT example","practice":{"q":"SAT practice question","opts":["A","B","C","D"],"correct":0,"exp":"str"}}`
    try {
      const raw = await callClaude([{role:'user',content:prompt}], sys)
      setAiRes({mode, data:JSON.parse(raw.replace(/```json|```/g,'').trim())})
      setXp(x=>x+5)
      addHlog(`AI: ${query.slice(0,30)}`, '+5 XP')
    } catch(e) {
      setAiRes({mode:'explain',data:{title:'Error',explanation:e.message||'API call failed. Check console.',example:'',practice:null}})
    }
    setAiLoad(false)
  }

  const analyzeWeak = async () => {
    if(!weak.length){return}
    setAiWeakLoad(true); setAiWeak(null)
    const wk = weak.map(([k,v])=>`${SUBJ[k]?.label}:${v}%`).join(', ')
    try {
      const raw = await callClaude([{role:'user',content:`Student weak SAT skills: ${wk}. Analyze and give SAT study tips. JSON only: {"analysis":"3-4 sentences","tips":[{"subject":"str","tip":"str","priority":1}],"studyOrder":["s1"]}`}], 'You are SatPilot SAT tutor. ONLY JSON, no markdown.')
      setAiWeak(JSON.parse(raw.replace(/```json|```/g,'').trim()))
    } catch { setAiWeak({analysis:'Unable to load.',tips:[],studyOrder:[]}) }
    setAiWeakLoad(false)
  }

  return(
    <div className="page">
      <div className="ph"><div className="pt">✦ AI <em>Tutor</em></div><div className="ps">Explanations · Weakness analysis · Mini-tests · +5 XP per session</div></div>

      {/* Mobile: horizontal scrollable chips */}
      <div className="ai-topics-mobile">
        {[{icon:'📐',text:'Linear & Quadratic',s:'SAT Math'},{icon:'📊',text:'Data Analysis',s:'SAT Math'},{icon:'📖',text:'Main Idea',s:'SAT Reading'},{icon:'✏️',text:'Semicolons',s:'SAT Writing'},{icon:'🔤',text:'Vocab in Context',s:'SAT Reading'}].map(t=>(
          <button key={t.text} className="ai-topic-chip" onClick={()=>ask(t.text)}>{t.icon} {t.text}</button>
        ))}
        {weak.map(([k,v])=>(
          <button key={k} className="ai-topic-chip" style={{borderColor:'rgba(201,95,58,.3)',color:'var(--r)'}} onClick={()=>ask(`Explain ${SUBJ[k]?.label} for SAT`)}>
            ⚠️ {SUBJ[k]?.label} {v}%
          </button>
        ))}
      </div>

      <div className="ai-grid">
        <div>
          {diagDone&&(
            <div style={{background:'rgba(201,95,58,.05)',border:'1px solid rgba(201,95,58,.18)',borderRadius:12,padding:14,marginBottom:14}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:weak.length>0?8:0}}>
                <div style={{fontSize:12,fontWeight:700,color:'var(--r)'}}>🔍 AI Weakness Analysis</div>
                {weak.length>0&&<button className="btn btn-out btn-sm" disabled={aiWeakLoad} onClick={analyzeWeak}>{aiWeakLoad?'Analyzing...':'Analyze'}</button>}
              </div>
              {aiWeakLoad&&<div style={{display:'flex',alignItems:'center',gap:9,padding:'14px 0',color:'var(--mt)',fontFamily:'var(--sm)',fontSize:12}}>Analyzing...</div>}
              {aiWeak&&!aiWeakLoad&&(
                <div>
                  <div style={{fontSize:13,lineHeight:1.7,marginBottom:10}}>{aiWeak.analysis}</div>
                  {aiWeak.tips?.map((t,i)=>(
                    <div key={i} style={{display:'flex',gap:9,marginBottom:7,padding:'9px 12px',background:'white',borderRadius:9,border:'1px solid var(--bd)'}}>
                      <span style={{fontSize:15,flexShrink:0}}>{['🔴','🟡','🟢'][t.priority-1]||'🟡'}</span>
                      <div><div style={{fontSize:11,fontWeight:600,color:'var(--r)',marginBottom:2}}>{t.subject}</div><div style={{fontSize:12,lineHeight:1.5}}>{t.tip}</div></div>
                    </div>
                  ))}
                </div>
              )}
              {!aiWeak&&!aiWeakLoad&&<div style={{fontSize:12,color:'var(--mt)'}}>{weak.length>0?`Weak: ${weak.map(([k])=>SUBJ[k]?.label).join(', ')}. Click Analyze.`:'Complete tasks to identify weak areas.'}</div>}
            </div>
          )}

          <div className="card">
            <div className="cl">Ask Anything</div>
            <textarea className="ai-ta" placeholder="e.g. 'How do I solve quadratic equations?'" value={aiQ} onChange={e=>setAiQ(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&e.metaKey)ask()}}/>
            <div style={{display:'flex',gap:7,marginTop:10,alignItems:'center',flexWrap:'wrap'}}>
              <button className="btn btn-out btn-sm" disabled={aiLoad||!aiQ.trim()} onClick={()=>ask(aiQ,'minitest')}>📝 Mini-Test</button>
              <button className="btn btn-dk btn-sm" style={{marginLeft:'auto'}} disabled={aiLoad||!aiQ.trim()} onClick={()=>ask()}>{aiLoad?'...':'✦ Explain'}</button>
            </div>
          </div>

          {aiLoad&&<div style={{display:'flex',alignItems:'center',gap:9,padding:18,color:'var(--mt)',fontFamily:'var(--sm)',fontSize:12}}>Thinking...</div>}
          {aiRes&&!aiLoad&&<AIResult result={aiRes}/>}
        </div>

        <div className="ai-sidebar-topics">
          <div className="cl" style={{marginBottom:10}}>Quick Topics</div>
          {[{icon:'📐',text:'Linear & Quadratic Equations',sub:'SAT Math'},{icon:'📊',text:'Data Analysis',sub:'SAT Math'},{icon:'📖',text:'Main Idea & Author Purpose',sub:'SAT Reading'},{icon:'✏️',text:'Comma and Semicolon Rules',sub:'SAT Writing'},{icon:'🔤',text:'Vocabulary in Context',sub:'SAT Reading'}].map(s=>(
            <button key={s.text} className="ai-sug" onClick={()=>ask(s.text)}>
              <div style={{fontSize:16,marginBottom:4}}>{s.icon}</div>
              <div style={{fontSize:13,fontWeight:500,color:'var(--ink)'}}>{s.text}</div>
              <div style={{fontSize:11,color:'var(--mt)',marginTop:2}}>{s.sub}</div>
            </button>
          ))}
          {diagDone&&weak.length>0&&<div style={{marginTop:12}}>
            <div className="cl" style={{marginBottom:7}}>Your Weak Topics</div>
            {weak.map(([k,v])=>(
              <button key={k} className="ai-sug" style={{borderColor:'rgba(201,95,58,.3)'}} onClick={()=>ask(`Explain ${SUBJ[k]?.label} for SAT`)}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{fontSize:13,fontWeight:500}}>{SUBJ[k]?.label}</div>
                  <span className="badge b-r">{v}%</span>
                </div>
                <div style={{fontSize:11,color:'var(--mt)',marginTop:2}}>Tap to study</div>
              </button>
            ))}
          </div>}
        </div>
      </div>
    </div>
  )
}
