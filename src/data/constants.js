export const SUBJ = {
  reading: { label: 'Reading',   color: '#4a7c59', weight: 0.25 },
  math:    { label: 'Math',      color: '#c9a84c', weight: 0.30 },
  grammar: { label: 'Grammar',   color: '#c95f3a', weight: 0.20 },
  vocab:   { label: 'Vocab',     color: '#3a6bc9', weight: 0.10 },
  data:    { label: 'Data',      color: '#8b6fc9', weight: 0.15 },
}

export const DIFF = {
  1: { label: 'Easy',   xp: 10, delta: 4,  weight: 1 },
  2: { label: 'Med',    xp: 20, delta: 7,  weight: 2 },
  3: { label: 'Hard',   xp: 35, delta: 12, weight: 3 },
}

export const ZERO = { reading: 0, math: 0, grammar: 0, vocab: 0, data: 0 }

export const RANKS = [
  { id: 'novice',   label: 'Novice',   icon: '🪨', min: 0,  color: '#7a7a8c', desc: 'Just getting started' },
  { id: 'bronze',   label: 'Bronze',   icon: '🥉', min: 20, color: '#cd7f32', desc: 'Building foundations' },
  { id: 'silver',   label: 'Silver',   icon: '🥈', min: 40, color: '#a8a9ad', desc: 'Gaining momentum' },
  { id: 'gold',     label: 'Gold',     icon: '🥇', min: 60, color: '#c9a84c', desc: 'Real progress' },
  { id: 'platinum', label: 'Platinum', icon: '💎', min: 75, color: '#a8c4d0', desc: 'Consistently strong' },
  { id: 'elite',    label: 'Elite',    icon: '🏆', min: 90, color: '#e8c96d', desc: 'SAT champion' },
]

export const NAV = [
  { id: 'dashboard', icon: '⌂',  label: 'Home' },
  { id: 'plan',      icon: '◫',  label: 'Plan' },
  { id: 'ai',        icon: '✦',  label: 'AI Tutor' },
  { id: 'progress',  icon: '◈',  label: 'Progress' },
  { id: 'profile',   icon: '◉',  label: 'Profile' },
]

export const ACHVS = [
  { id: 'first',  icon: '✅', name: 'First Step',    desc: 'Complete first task',   c: (sk,xp,s,t)    => t.filter(tt=>tt.done).length >= 1 },
  { id: 'str3',   icon: '🔥', name: 'On Fire',       desc: '3-day streak',          c: (sk,xp,s)      => s >= 3 },
  { id: 'str7',   icon: '💥', name: 'Unstoppable',   desc: '7-day streak',          c: (sk,xp,s)      => s >= 7 },
  { id: 'xp100',  icon: '⭐', name: 'Rising Star',   desc: 'Earn 100 XP',           c: (sk,xp)        => xp >= 100 },
  { id: 'xp500',  icon: '🏆', name: 'Champion',      desc: 'Earn 500 XP',           c: (sk,xp)        => xp >= 500 },
  { id: 'diag',   icon: '🔬', name: 'Diagnosed',     desc: 'Complete diagnostic',   c: (sk,xp,s,t,d)  => d },
  { id: 'math60', icon: '📐', name: 'Math Mind',     desc: 'Math ≥ 60%',            c: (sk)           => (sk.math||0) >= 60 },
  { id: 'foc5',   icon: '🎯', name: 'Focus Master',  desc: '5 focus sessions',      c: (sk,xp,s,t,d,h)=> (h?.filter(x=>x.event?.includes('Focus'))?.length||0) >= 5 },
]

export const FOCUS_TESTS = [
  { id: 'math-q',  s: 'math',    icon: '⚡', name: 'Math Quick Fire',       desc: '8 questions · 15 min',       n: 8,  time: 15*60 },
  { id: 'math-h',  s: 'math',    icon: '🔥', name: 'Math Hard Mode',        desc: '8 advanced · 20 min',        n: 8,  time: 20*60 },
  { id: 'reading', s: 'reading', icon: '📖', name: 'Reading Comprehension',  desc: '4 passages · 12 min',        n: 4,  time: 12*60 },
  { id: 'grammar', s: 'grammar', icon: '✏️', name: 'Grammar Drill',          desc: '5 questions · 10 min',       n: 5,  time: 10*60 },
  { id: 'vocab',   s: 'vocab',   icon: '🔤', name: 'Vocabulary Sprint',      desc: '4 questions · 8 min',        n: 4,  time:  8*60 },
  { id: 'data',    s: 'data',    icon: '📊', name: 'Data Analysis',          desc: '4 questions · 12 min',       n: 4,  time: 12*60 },
  { id: 'weak',    s: 'mixed',   icon: '🎯', name: 'Target Weak Areas',      desc: 'Adaptive · 10 questions',    n: 10, time: 18*60 },
  { id: 'all-eng', s: 'english', icon: '📝', name: 'Full English Set',        desc: 'Reading + Grammar · 20 min', n: 8,  time: 20*60 },
]

export const DIAG_MODULES = [
  { id: 'm1', sec: 'Math',    mod: 'Module 1', level: 'easy', icon: '📐', color: 'var(--g)' },
  { id: 'm2', sec: 'Math',    mod: 'Module 2', level: 'hard', icon: '📐', color: 'var(--r)' },
  { id: 'e1', sec: 'English', mod: 'Module 1', level: 'easy', icon: '📖', color: 'var(--sk)' },
  { id: 'e2', sec: 'English', mod: 'Module 2', level: 'hard', icon: '📖', color: 'var(--sg)' },
]
