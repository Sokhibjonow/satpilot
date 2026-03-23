export default function QuestionCard({ q, selected, revealed, onSelect }) {
  if (!q) return null
  return (
    <div className="t-card">
      {q.cx && <div className="t-ctx">{q.cx}</div>}
      <div className="t-qtxt">{q.t}</div>
      <div className="t-opts">
        {q.o.map((opt,i)=>{
          let cls='topt'
          if(revealed){ cls+=' dis'; if(i===q.c)cls+=' show-ok'; else if(i===selected&&i!==q.c)cls+=' bad' }
          else if(i===selected) cls+=' sel'
          return(
            <button key={i} className={cls} onClick={()=>!revealed&&onSelect(i)}>
              <span className="tlt">{['A','B','C','D'][i]}</span>
              <span className="ttxt">{opt}</span>
            </button>
          )
        })}
      </div>
      {revealed&&(
        <div className={`t-fb ${selected===q.c?'fb-ok':'fb-bad'}`}>
          <span>{selected===q.c?'✓':'✗'}</span>
          <span><strong>{selected===q.c?'Correct! ':'Incorrect. '}</strong>{q.e}</span>
        </div>
      )}
    </div>
  )
}
