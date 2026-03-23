export const DIAG_Q = {
  m1: [
    { id:'m1a', t:'Solve: 3x+9=24',           o:['x=3','x=4','x=5','x=7'],     c:2, e:'3x=15, x=5',           s:'math' },
    { id:'m1b', t:'15% of 200?',               o:['20','25','30','35'],          c:2, e:'0.15×200=30',          s:'math' },
    { id:'m1c', t:'Rectangle 8×5. Area?',      o:['13','26','40','45'],          c:2, e:'8×5=40',              s:'math' },
    { id:'m1d', t:'y=2x−3, x=4 → y=?',        o:['2','4','5','6'],             c:2, e:'2(4)−3=5',            s:'math' },
    { id:'m1e', t:'Median of {4,7,2,9,5}?',   o:['4','5','6','7'],             c:1, e:'Sorted:{2,4,5,7,9}',  s:'math' },
  ],
  m2: [
    { id:'m2a', t:'f(x)=x²−4x+3 crosses x-axis at?',           o:['x=1&3','x=−1&−3','x=2&4','x=0&3'], c:0, e:'(x−1)(x−3)=0', s:'math' },
    { id:'m2b', t:'Line through (2,5) and (6,13)?',             o:['y=2x+1','y=3x−1','y=2x−1','y=x+3'],c:0, e:'slope=2,b=1', s:'math' },
    { id:'m2c', cx:'Product A $12, B $8. $100 for 10 items.',   t:'How many A?', o:['2','3','5','7'],          c:2, e:'12a+8(10−a)=100→a=5', s:'data' },
    { id:'m2d', t:'f(x)=3x²−2x+1, f(−2)=?',                   o:['9','13','17','21'],                 c:2, e:'3(4)−2(−2)+1=17', s:'math' },
    { id:'m2e', t:'Mean of 5 nums=14. Four: 10,12,16,18. Fifth?',o:['12','14','16','18'],               c:1, e:'Sum=70,known=56,fifth=14', s:'data' },
  ],
  e1: [
    { id:'e1a', cx:'Exercise before exams → 20% higher scores.', t:'Main idea?', o:['Exercise harmful','Activity enhances performance','Students dislike exams','Memory declines'], c:1, e:'Passage states exercise improves memory', s:'reading' },
    { id:'e1b', t:'Correct subject-verb agreement:', o:['The group are working.','The group is working.','The group were working.','The group have worked.'], c:1, e:"'Group' is singular", s:'grammar' },
    { id:'e1c', t:'Correct comma use:', o:['She studied hard, but she failed.','She studied hard but, she failed.','She, studied hard but failed.','She studied hard but she, failed.'], c:0, e:'Comma before FANBOYS', s:'grammar' },
    { id:'e1d', t:"'Benevolent' means:", o:['Hostile','Kind and charitable','Neutral','Strict'], c:1, e:'Benevolent = well-meaning', s:'vocab' },
    { id:'e1e', cx:'Printing press 15th century, books stayed expensive.', t:'Why oral tradition?', o:['Preferred it','Books too expensive','Press broken','Literacy declined'], c:1, e:"Books 'remained expensive'", s:'reading' },
  ],
  e2: [
    { id:'e2a', cx:"'The wilderness is a necessity of the human spirit.'", t:"Author's purpose:", o:['Describe wilderness','Argue wilderness essential','Compare water and bread','Warn about forgetting'], c:1, e:"'Necessity' argues essentialness", s:'reading' },
    { id:'e2b', cx:'Her approach: subtle adjustments rather than direct confrontation.', t:"'Oblique' means:", o:['Transparent','Indirect','Reckless','Methodical'], c:1, e:"She avoided 'addressing directly'", s:'vocab' },
    { id:'e2c', t:"Best revision: 'Due to the fact that the experiment was a failure...'", o:['Due to the fact it failed, scientists ended it.','Because the experiment failed, scientists ended it.','The experiment being a failure was ended.','Scientists ended it due to its failure.'], c:1, e:'Most concise', s:'grammar' },
    { id:'e2d', cx:'Renewables grew 340% (2010-2020). Fossil fuels still 68%.', t:'Best conclusion:', o:['Renewables surpass soon','Fossil use decreased','Renewables grew but minority','Transitioned to clean'], c:2, e:'340% growth but still 68%', s:'reading' },
    { id:'e2e', t:'Correct semicolon:', o:['She loved math; however she struggled.','She loved math; however, she struggled.','She loved math, however; she struggled.','She loved math however; she struggled.'], c:1, e:"'; however,' — semicolon before, comma after", s:'grammar' },
  ],
}

export const FOCUS_BANKS = {
  math: [
    { id:'fm1', t:'2x+5=17, x=?',               o:['4','5','6','7'],   c:2, e:'2x=12, x=6', s:'math' },
    { id:'fm2', t:'Slope of y=−3x+7?',            o:['7','3','−3','−7'], c:2, e:'Coefficient of x', s:'math' },
    { id:'fm3', t:'Square perimeter 36. Area?',    o:['36','64','81','72'],c:2, e:'side=9, 9²=81', s:'math' },
    { id:'fm4', t:'Solve x²−9=0',                 o:['x=3','x=−3','x=±3','x=±9'], c:2, e:'x=±3', s:'math' },
    { id:'fm5', t:'f(x)=x²+2x, f(3)=?',          o:['9','12','15','18'], c:2, e:'9+6=15', s:'math' },
    { id:'fm6', t:'30% of 150?',                   o:['30','40','45','50'], c:2, e:'0.3×150=45', s:'math' },
    { id:'fm7', t:'Triangle angles sum?',          o:['90°','180°','270°','360°'], c:1, e:'Always 180°', s:'math' },
    { id:'fm8', t:'5 workers 8 days. 10 workers?', o:['2','4','6','16'], c:1, e:'5×8=10×d, d=4', s:'math' },
  ],
  reading: [
    { id:'fr1', cx:'Technology paradox: more digital connection, more emotional isolation.', t:'Central idea?', o:['Tech harmful','Digital reduces emotional','Ban tech','People prefer isolation'], c:1, e:'Author describes the paradox', s:'reading' },
    { id:'fr2', cx:'Despite setbacks, scientist persisted, believing failure was a stepping stone.', t:"Author's attitude:", o:['Critical','Admiring','Indifferent','Skeptical'], c:1, e:"'Persisted' signals admiration", s:'reading' },
    { id:'fr3', cx:'Industrial revolution: jobs created, but 16-hour days in dangerous conditions.', t:'Progress was:', o:['Entirely positive','Entirely negative','Complex with both','Irrelevant'], c:2, e:'Both benefits and drawbacks', s:'reading' },
    { id:'fr4', t:'Best source for climate change effect on polar bears:', o:['News blog','Peer-reviewed study','Documentary','Social media activist'], c:1, e:'Peer-reviewed = rigorous', s:'reading' },
  ],
  grammar: [
    { id:'fg1', t:"Correct: 'Between ___ this is wrong':", o:['you and I,','you and me,','you and myself,','I and you,'], c:1, e:"Preposition requires 'me'", s:'grammar' },
    { id:'fg2', t:"'The data ___ a clear trend.'", o:['shows','show','are showing','is'], c:1, e:"'Data' is plural", s:'grammar' },
    { id:'fg3', t:"Correct 'its' vs 'it's':", o:["The company lost it's way.","Its been a long day.","The dog wagged its tail.","Its tail wagged it's way."], c:2, e:"'Its' = possessive", s:'grammar' },
    { id:'fg4', t:"Parallel: 'She likes hiking, swimming, and ___.'", o:['to read','reading','reads','she reads'], c:1, e:'All gerunds', s:'grammar' },
    { id:'fg5', t:'Correct em dash:', o:['The results—were surprising.','Results were — surprising.','Three factors — cost, time, quality — affect decision.','Three—cost—time—quality affect.'], c:2, e:'Dashes set off nonessential phrases', s:'grammar' },
  ],
  vocab: [
    { id:'fv1', t:"'Ambiguous' means:", o:['Clear','Open to multiple interpretations','Established','False'], c:1, e:'Multiple possible meanings', s:'vocab' },
    { id:'fv2', t:"'Pragmatic' means:", o:['Idealistic','Practical','Emotional','Theoretical'], c:1, e:'Realistic and practical', s:'vocab' },
    { id:'fv3', t:"'Proliferate' means:", o:['Decrease','Increase rapidly','Stay constant','Become complex'], c:1, e:'Increase in numbers', s:'vocab' },
    { id:'fv4', cx:'Her demeanor was always placid, even in chaos.', t:"'Placid' means:", o:['Anxious','Calm and peaceful','Angry','Confused'], c:1, e:'Context suggests composure', s:'vocab' },
  ],
  data: [
    { id:'fd1', cx:'100 students: 40 Math, 35 Science, 25 English.', t:'% prefer Math or Science?', o:['40%','65%','75%','80%'], c:2, e:'40+35=75%', s:'data' },
    { id:'fd2', t:'Dataset {2,4,4,6,8,10} mean?', o:['4','5','5.67','6'], c:2, e:'34/6≈5.67', s:'data' },
    { id:'fd3', cx:'Revenue: $50k to $65k.', t:'% increase?', o:['15%','25%','30%','35%'], c:2, e:'15000/50000×100=30%', s:'data' },
    { id:'fd4', t:'Most affected by outliers:', o:['Median','Mode','Mean','Range'], c:2, e:'Mean uses all values', s:'data' },
  ],
}
