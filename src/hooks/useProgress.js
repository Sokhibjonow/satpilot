import { SUBJ, DIFF, ZERO, RANKS, DIAG_MODULES } from '../data/constants.js'
import { DIAG_Q } from '../data/questions.js'

export const calcGoal = (sk) =>
  Math.min(Math.round(Object.entries(SUBJ).reduce((s,[k,v]) => s+(sk[k]||0)*v.weight, 0)), 100)

export const s2score = (sk) =>
  Math.round(800 + (Object.values(sk).reduce((a,b)=>a+b,0) / Object.values(sk).length / 100) * 800)

export const getWeak   = (sk) => Object.entries(sk).filter(([,v])=>v<50).sort((a,b)=>a[1]-b[1])
export const getStrong = (sk) => Object.entries(sk).filter(([,v])=>v>=62).sort((a,b)=>b[1]-a[1])

export const xpLvl = (x) => Math.floor(x/100)+1
export const xpIn  = (x) => x%100

export const calcSkills = (answers) => {
  const c={}, t={}
  DIAG_MODULES.forEach(m => (DIAG_Q[m.id]||[]).forEach(q => {
    t[q.s]=(t[q.s]||0)+1
    c[q.s]=(c[q.s]||0)+(answers[q.id]===q.c?1:0)
  }))
  const sk={}
  Object.keys(SUBJ).forEach(s => {
    if(!t[s]){sk[s]=0;return}
    sk[s]=Math.round(5+(c[s]/t[s])*75)
  })
  return sk
}

export const applyTask = (sk, task, done) => {
  const d = done ? DIFF[task.diff]?.delta : -(DIFF[task.diff]?.delta/2)
  return { ...sk, [task.subject]: Math.min(100, Math.max(0, (sk[task.subject]||0)+d)) }
}

export const dimXP = (base, times) =>
  Math.max(2, Math.round(base * Math.pow(0.6, Math.max(0, times-1))))

export const decaySkills = (sk, lastISO) => {
  if (!lastISO) return { sk, decayed:[] }
  const days = Math.min(Math.floor((Date.now()-new Date(lastISO).getTime())/864e5), 7)
  if (days < 1) return { sk, decayed:[] }
  const ns={...sk}; const decayed=[]
  Object.keys(SUBJ).forEach(k => {
    const v=ns[k]||0; if(v<=5)return
    const rate=v<40?1:v<65?2:3
    const loss=Math.min(rate*days,v-5)
    if(loss>0){ns[k]=Math.max(5,v-loss);decayed.push({k,label:SUBJ[k]?.label,lost:loss})}
  })
  return { sk:ns, decayed }
}

export const rankScore = (sk, streak, xp, anal) => {
  const gp=calcGoal(sk)
  const stats=anal?.subjectStats||{}
  const tq=Object.values(stats).reduce((s,v)=>s+v.total,0)
  const tc=Object.values(stats).reduce((s,v)=>s+v.correct,0)
  const acc=tq>0?(tc/tq):0
  return Math.min(Math.round(gp*0.4+acc*20+Math.min(streak*2,20)+Math.min(Math.floor(xp/50),20)), 100)
}

export const getRank = (score) => {
  let r=RANKS[0]
  for(const rk of RANKS){if(score>=rk.min)r=rk}
  return r
}

export const buildDailyPlan = (sk) => {
  const TMPLS = {
    reading:[{name:'Reading: Main Idea',sub:'Comprehension',dur:'20 min',diff:2},{name:'Reading: Author Purpose',sub:'Rhetoric',dur:'25 min',diff:3}],
    math:   [{name:'Math: Linear Equations',sub:'Algebra',dur:'25 min',diff:2},{name:'Math: Quadratic',sub:'Advanced',dur:'30 min',diff:3}],
    grammar:[{name:'Grammar: Punctuation',sub:'Commas',dur:'15 min',diff:1},{name:'Grammar: Agreement',sub:'Subject-verb',dur:'20 min',diff:2}],
    vocab:  [{name:'Vocab: 20 Words',sub:'SAT list',dur:'10 min',diff:1},{name:'Vocab in Context',sub:'Passage',dur:'15 min',diff:2}],
    data:   [{name:'Data Analysis',sub:'Charts',dur:'20 min',diff:2}],
  }
  const weak=getWeak(sk).map(([k])=>k)
  const prio=[...new Set([...weak.slice(0,2),'math',...Object.keys(SUBJ)])]
  const res=[]; let id=Date.now()
  for(const s of prio){
    if(res.length>=3)break
    const t=TMPLS[s]; if(!t)continue
    const p=(sk[s]||0)<45?t[0]:(t[1]||t[0])
    res.push({id:id++,subject:s,...p,done:false,type:'mandatory'})
  }
  const cs=weak[0]||'math'
  const ct=TMPLS[cs]?.slice(-1)[0]||TMPLS[cs]?.[0]
  if(ct)res.push({id:id++,subject:cs,name:`🔥 Challenge: ${ct.name}`,sub:ct.sub,dur:ct.dur,diff:3,done:false,type:'challenge',xpBonus:50})
  return res
}

export const buildMissions = (tasks,streak,xp,diagDone) => {
  const done=tasks.filter(t=>t.done).length
  return [
    {id:'d',icon:'⚡',name:"Complete Today's Tasks",sub:`${done}/${tasks.length} done`,prog:tasks.length?done/tasks.length:0,target:tasks.length||4,cur:done,xpR:50,done:done>=tasks.length&&tasks.length>0},
    {id:'s',icon:'🔥',name:'3-Day Streak',sub:'Study 3 days in a row',prog:Math.min(streak/3,1),target:3,cur:Math.min(streak,3),xpR:100,done:streak>=3},
    {id:'x',icon:'⭐',name:'Earn 200 XP',sub:'Complete tasks',prog:Math.min(xp/200,1),target:200,cur:Math.min(xp,200),xpR:75,done:xp>=200},
    {id:'g',icon:'📋',name:'Complete Diagnostic',sub:'Take the placement test',prog:diagDone?1:0,target:1,cur:diagDone?1:0,xpR:150,done:diagDone},
  ]
}

export const predictScore = (sk,anal,streak,examDate,mins) => {
  const cur=s2score(sk)
  const stats=anal?.subjectStats||{}
  const tq=Object.values(stats).reduce((s,v)=>s+v.total,0)
  const tc=Object.values(stats).reduce((s,v)=>s+v.correct,0)
  const acc=tq>0?tc/tq:0.55
  const cons=Math.min(0.4+streak*0.06,1.0)
  const wp=1-(getWeak(sk).length*0.06)
  const rate=acc*cons*wp*0.08
  let daysLeft=60
  if(examDate){const d=(new Date(examDate).getTime()-Date.now())/864e5;if(d>0)daysLeft=Math.min(d,180)}
  return {
    cur, daysLeft, acc:Math.round(acc*100), cons:Math.round(cons*100),
    scenarios:[2,4,8].map(w=>({weeks:w,gain:Math.round(mins*rate*w*7),pred:Math.min(1600,cur+Math.round(mins*rate*w*7))})),
    milestones:[1200,1300,1400,1500].map(t=>{
      if(cur>=t)return{t,done:true}
      const dn=rate>0?Math.ceil((t-cur)/(40*rate)):999
      return{t,done:false,days:dn,ok:dn<=daysLeft}
    }),
  }
}
