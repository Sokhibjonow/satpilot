import useStore from '../../store/appStore.js'
import { SUBJ, RANKS, ACHVS } from '../../data/constants.js'
import { calcGoal, s2score, getWeak, rankScore, getRank, xpLvl, xpIn } from '../../hooks/useProgress.js'

function Chart({data}){
  const W=380,H=130,pad=18,max=Math.max(...data,10)
  const pts=data.map((v,i)=>[pad+(i/(data.length-1))*(W-2*pad),H-pad-(v/max)*(H-2*pad)])
  const pl=pts.map(p=>p.join(',')).join(' ')
  const area=[`${pts[0][0]},${H-pad}`,...pts.map(p=>p.join(',')),...[`${pts[pts.length-1][0]},${H-pad}`]].join(' ')
  return(
    <div><svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:H}} preserveAspectRatio="none">
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c9a84c" stopOpacity=".22"/><stop offset="100%" stopColor="#c9a84c" stopOpacity=".02"/></linearGradient></defs>
      <polygon points={area} fill="url(#cg)"/>
      <polyline points={pl} fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i===pts.length-1?5:3} fill={i===pts.length-1?'#c9a84c':'white'} stroke="#c9a84c" strokeWidth="2.5"/>)}
    </svg>
    <div style={{display:'flex',justifyContent:'space-between',marginTop:3}}>
      {['Mon','Tue','Wed','Thu','Fri','Sat','Today'].map(l=><span key={l} style={{fontSize:10,fontFamily:'var(--sm)',color:'var(--mt)'}}>{l}</span>)}
    </div></div>
  )
}

export default function ProgressPage() {
  const st = useStore()
  const { skills, xp, streak, diagDone, achs, hlog, progHist, setPage, setScreen } = st
  const gp=calcGoal(skills), es=s2score(skills), lvl=xpLvl(xp), xpin=xpIn(xp)
  const rs=rankScore(skills,streak,xp,st.anal), rk=getRank(rs)
  const nrk=RANKS[RANKS.findIndex(r=>r.id===rk.id)+1]
  const p2n=nrk?Math.round(((rs-rk.min)/(nrk.min-rk.min))*100):100
  const chartData=(()=>{if(progHist.length<2)return[0,0,0,0,0,0,gp];const l=[...progHist.slice(-6).map(p=>p.pct||0),gp];while(l.length<7)l.unshift(0);return l})()
  // Heatmap
  const hmap={}
  ;[...hlog,...progHist].forEach(p=>{if(p.date){const d=new Date(p.date);const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;hmap[k]=(hmap[k]||0)+1}})
  const days=[]; const today=new Date()
  for(let i=90;i>=0;i--){const d=new Date(today);d.setDate(today.getDate()-i);const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;const cnt=hmap[k]||0;days.push({k,cnt,int:cnt===0?0:cnt<3?1:cnt<6?2:cnt<10?3:4})}
  const weeks=[]; for(let i=0;i<days.length;i+=7)weeks.push(days.slice(i,i+7))

  return(
    <div className="page">
      <div className="ph"><div className="pt">My <em>Progress</em></div><div className="ps">Weighted · Real history · Heatmap</div></div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}}>
        {[{id:'focus',icon:'🎯',title:'Focus Mode',sub:'Practice tests',color:'var(--g)'},{id:'errors',icon:'🔍',title:'Error Review',sub:`${st.wrong.length} saved`,color:'var(--r)'},{id:'analytics',icon:'📊',title:'Analytics',sub:'Accuracy & speed',color:'var(--sk)'}].map(s=>(
          <button key={s.id} onClick={()=>setPage(s.id)} style={{background:'white',border:'1px solid var(--bd)',borderRadius:12,padding:14,cursor:'pointer',textAlign:'left',transition:'all .18s',fontFamily:'var(--ss)'}}>
            <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{s.title}</div>
            <div style={{fontSize:11,color:'var(--mt)'}}>{s.sub}</div>
          </button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        {[{label:'Goal',value:`${gp}%`,color:'var(--g)'},{label:'Est. Score',value:diagDone?`~${es}`:'—',color:'var(--sg)'},{label:'Level',value:`Lvl ${lvl}`,color:'var(--sk)'},{label:'Streak',value:`${streak}🔥`,color:'var(--r)'}].map(s=>(
          <div key={s.label} className="card csm"><div className="cl">{s.label}</div><div style={{fontSize:22,fontFamily:'var(--sf)',color:s.color,lineHeight:1}}>{s.value}</div></div>
        ))}
      </div>

      <div className="card" style={{marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}><div className="cl" style={{margin:0}}>Goal Progress</div><span className="badge b-g">{gp}% today</span></div>
        <Chart data={chartData}/>
      </div>

      {/* Rank */}
      <div className="card" style={{marginBottom:14}}>
        <div className="cl" style={{marginBottom:10}}>Rank System</div>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
          <span style={{fontSize:36}}>{rk.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:17,fontWeight:700,color:rk.color,marginBottom:2}}>{rk.label}</div>
            <div style={{fontSize:12,color:'var(--mt)'}}>{rk.desc}</div>
            <div className="gp-t" style={{marginTop:6,height:5}}><div style={{height:'100%',width:`${p2n}%`,background:rk.color,borderRadius:99,transition:'width .8s ease'}}/></div>
            {nrk&&<div style={{fontSize:10,color:'var(--mt)',fontFamily:'var(--sm)',marginTop:3}}>{p2n}% to {nrk.label} {nrk.icon}</div>}
          </div>
          <div style={{textAlign:'right'}}><div style={{fontFamily:'var(--sf)',fontSize:28,color:rk.color,lineHeight:1}}>{rs}</div><div style={{fontSize:10,color:'var(--mt)',fontFamily:'var(--sm)'}}>rank score</div></div>
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {RANKS.map(r=><div key={r.id} style={{flex:1,minWidth:54,padding:'6px 8px',borderRadius:8,background:rs>=r.min?'rgba(201,168,76,.08)':'var(--warm)',border:`1px solid ${rs>=r.min?r.color:'var(--bd)'}`,textAlign:'center',opacity:rs>=r.min?1:.45}}><div style={{fontSize:16,marginBottom:2}}>{r.icon}</div><div style={{fontSize:9,fontFamily:'var(--sm)',fontWeight:600,color:rs>=r.min?r.color:'var(--mt)'}}>{r.label}</div></div>)}
        </div>
      </div>

      {/* Heatmap */}
      <div className="card" style={{marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}><div className="cl" style={{margin:0}}>Activity Heatmap</div></div>
        <div style={{overflowX:'auto'}}><div style={{display:'flex',gap:3,minWidth:280}}>{weeks.map((w,wi)=><div key={wi} style={{display:'flex',flexDirection:'column',gap:3,flex:1}}>{w.map((d,di)=><div key={di} className={`hm-cell hm-${d.int}`} title={`${d.cnt} actions`}/>)}</div>)}</div></div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:6,fontSize:10,color:'var(--mt)',fontFamily:'var(--sm)'}}><span>90 days ago</span><span>Today</span></div>
      </div>

      {diagDone&&<><div className="cl" style={{marginBottom:8}}>Skills (weighted)</div>
      <div style={{marginBottom:14}}>{Object.entries(SUBJ).map(([k,v])=>(
        <div key={k} className="prog-row"><div style={{fontWeight:500,fontSize:13,width:110,flexShrink:0}}>{v.label}</div>
          <div className="pr-t"><div className="pr-f" style={{width:`${skills[k]||0}%`,background:v.color}}/></div>
          <div style={{fontFamily:'var(--sm)',fontSize:12,color:'var(--mt)',width:32,textAlign:'right'}}>{skills[k]||0}%</div>
          <span className={`badge${(skills[k]||0)>=65?' b-sg':(skills[k]||0)>=40?' b-g':' b-r'}`} style={{fontSize:10}}>{(skills[k]||0)>=65?'Strong':(skills[k]||0)>=40?'Medium':'Weak'}</span>
        </div>
      ))}</div>
      <div className="cl" style={{marginBottom:8}}>Achievements</div>
      <div className="ach-grid" style={{marginBottom:14}}>{ACHVS.map(a=>{const u=achs.includes(a.id);return(
        <div key={a.id} className={`ach-item${u?' on':' off'}`}><div style={{fontSize:26,marginBottom:5}}>{a.icon}</div><div style={{fontSize:12,fontWeight:600}}>{a.name}</div><div style={{fontSize:10,color:'var(--mt)',marginTop:2,lineHeight:1.4}}>{a.desc}</div><div className={`ach-tag${u?' at-g':' at-l'}`}>{u?'Unlocked':'Locked'}</div></div>
      );})}</div></>}
    </div>
  )
}
