import { create } from 'zustand'
import { LS } from '../hooks/useLocalStorage.js'
import { ZERO, ACHVS } from '../data/constants.js'
import {
  applyTask, dimXP, decaySkills, buildDailyPlan,
  calcGoal, s2score
} from '../hooks/useProgress.js'

const useStore = create((set, get) => ({
  // ── Persistent
  goal:        LS.get('sc_goal', ''),
  exam:        LS.get('sc_exam', ''),
  skills:      LS.get('sc_skills', ZERO),
  xp:          LS.get('sc_xp', 0),
  streak:      LS.get('sc_streak', 0),
  sDots:       LS.get('sc_sdots', Array(14).fill('')),
  tasks:       LS.get('sc_tasks', []),
  diagDone:    LS.get('sc_diag', false),
  achs:        LS.get('sc_achs', []),
  dAnswers:    LS.get('sc_dans', {}),
  progHist:    LS.get('sc_phist', []),
  planData:    LS.get('sc_plan', null),
  hlog:        LS.get('sc_hlog', []),
  focusHist:   LS.get('sc_fhist', []),
  lastActive:  LS.get('sc_last_active', null),
  notifS:      LS.get('sc_notif', {streak:true,tasks:true,weak:true,back:true,diag:true}),
  wrong:       LS.get('sc_wrong', []),
  anal:        LS.get('sc_anal', {subjectStats:{},questionTimes:[],mistakeTypes:{concept:0,careless:0,vocab:0}}),
  coachU:      LS.get('sc_coach', null),
  coachDis:    LS.get('sc_cdis', ''),
  soundOn:     LS.get('sc_sound', true),
  qAttempts:   LS.get('sc_qatt', {}),
  // UI
  decayAlert:  null,
  predictMins: 40,
  modIdx:      0,
  screen:      LS.get('sc_goal','') && LS.get('sc_exam','') ? 'app' : 'ob',
  page:        'dashboard',

  // ── Setters (all with localStorage sync)
  setGoal:      (v) => { set({goal:v});      LS.set('sc_goal',v) },
  setExam:      (v) => { set({exam:v});      LS.set('sc_exam',v) },
  setScreen:    (v) => set({screen:v}),
  setPage:      (v) => set({page:v}),
  setPredictMins:(v)=> set({predictMins:v}),
  setModIdx:    (v) => set({modIdx:v}),
  setDecayAlert:(v) => set({decayAlert:v}),
  setSoundOn:   (v) => { set({soundOn:v}); LS.set('sc_sound',v) },
  setNotifS:    (v) => { set({notifS:v}); LS.set('sc_notif',v) },
  setCoachU:    (v) => { set({coachU:v});  LS.set('sc_coach',v) },
  setCoachDis:  (v) => { set({coachDis:v}); LS.set('sc_cdis',v) },
  setDiagDone:  (v) => { set({diagDone:v}); LS.set('sc_diag',v) },
  setStreak:    (v) => { set({streak:v}); LS.set('sc_streak',v) },
  setPlanData:  (v) => { set({planData:v}); LS.set('sc_plan',v) },
  setDAnswers:  (v) => { set({dAnswers:v}); LS.set('sc_dans',v) },

  setSkills:   (v) => { const s=typeof v==='function'?v(get().skills):v;    set({skills:s});    LS.set('sc_skills',s) },
  setXp:       (v) => { const x=typeof v==='function'?v(get().xp):v;       set({xp:x});        LS.set('sc_xp',x) },
  setSDots:    (v) => { const d=typeof v==='function'?v(get().sDots):v;     set({sDots:d});     LS.set('sc_sdots',d) },
  setTasks:    (v) => { const t=typeof v==='function'?v(get().tasks):v;     set({tasks:t});     LS.set('sc_tasks',t) },
  setAchs:     (v) => { const a=typeof v==='function'?v(get().achs):v;      set({achs:a});      LS.set('sc_achs',a) },
  setProgHist: (v) => { const p=typeof v==='function'?v(get().progHist):v;  set({progHist:p});  LS.set('sc_phist',p) },
  setHlog:     (v) => { const h=typeof v==='function'?v(get().hlog):v;      set({hlog:h});      LS.set('sc_hlog',h) },
  setFocusHist:(v) => { const f=typeof v==='function'?v(get().focusHist):v; set({focusHist:f}); LS.set('sc_fhist',f) },
  setWrong:    (v) => { const w=typeof v==='function'?v(get().wrong):v;     set({wrong:w});     LS.set('sc_wrong',w) },
  setAnal:     (v) => { const a=typeof v==='function'?v(get().anal):v;      set({anal:a});      LS.set('sc_anal',a) },
  setQAttempts:(v) => { const q=typeof v==='function'?v(get().qAttempts):v; set({qAttempts:q}); LS.set('sc_qatt',q) },

  // ── Init: run decay on first load
  init() {
    try {
      const prev = LS.get('sc_last_active', null)
      const isDiagDone = LS.get('sc_diag', false)
      if (prev && isDiagDone) {
        const curSk = LS.get('sc_skills', ZERO)
        const { sk, decayed } = decaySkills(curSk, prev)
        if (decayed.length > 0) {
          get().setSkills(sk)
          set({ decayAlert: decayed })
        }
      }
    } catch(e) {
      console.warn('Init error:', e)
    }
    LS.set('sc_last_active', new Date().toISOString())
  },

  // ── Actions
  addHlog(event, delta=null) {
    const entry = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
      event, delta
    }
    get().setHlog(h => [entry, ...h.slice(0,49)])
  },

  toggleTask(id) {
    const { tasks, skills, qAttempts } = get()
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const nd = !task.done
    const ns = applyTask(skills, task, nd)
    get().setSkills(ns)
    if (nd) {
      const att = qAttempts[task.id] || 0
      const baseXP = ({1:10,2:20,3:35}[task.diff]||10) + (task.xpBonus||0)
      const earned = dimXP(baseXP, att)
      get().setQAttempts(q => ({...q, [task.id]:(q[task.id]||0)+1}))
      get().setXp(x => x + earned)
      get().addHlog(`Done: ${task.name}`, `+${earned}XP`)
      get().setProgHist(p => [...p, {
        date: new Date().toDateString(),
        pct: calcGoal(ns),
        score: s2score(ns)
      }].slice(-90))
    }
    get().setTasks(t => t.map(x => x.id===id ? {...x, done:nd} : x))
  },

  resetAll() {
    ['sc_goal','sc_exam','sc_skills','sc_xp','sc_streak','sc_sdots','sc_tasks',
     'sc_diag','sc_achs','sc_dans','sc_phist','sc_plan','sc_hlog','sc_fhist',
     'sc_wrong','sc_anal','sc_coach','sc_cdis','sc_notif','sc_sound','sc_qatt',
     'sc_last_active'].forEach(k => LS.del(k))
    window.location.reload()
  },
}))

export default useStore
