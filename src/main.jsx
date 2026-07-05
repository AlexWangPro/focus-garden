import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const STORAGE_KEY = 'focus-garden-ultimate-state-v1';
const TODAY = () => new Date().toISOString().slice(0, 10);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const pct = (n) => `${Math.round(n)}%`;
const uid = () => Math.random().toString(36).slice(2, 9);

const TASK_LABELS = {
  target: '找目标',
  memory: '记忆花园',
  go: '红绿灯',
  nback: '记忆反应',
  sequence: '多步指令',
  slow: '慢慢走',
  wait: '等待金鱼',
  stroop: '颜色干扰',
};

const DEFAULT_STATE = {
  settings: {
    childName: '宝贝',
    parentPin: '2580',
    sound: true,
    reduceMotion: false,
    dailyRoundLimit: 3,
    warmupSeconds: 25,
    allowLab: true,
  },
  progress: {
    gardenPoints: 0,
    streak: 0,
    lastActiveDate: '',
    taskLevels: {
      target: 2,
      memory: 2,
      go: 2,
      nback: 1,
      sequence: 1,
      slow: 2,
      wait: 2,
      stroop: 1,
    },
    badges: [],
  },
  sessions: [],
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
      progress: {
        ...DEFAULT_STATE.progress,
        ...(parsed.progress || {}),
        taskLevels: { ...DEFAULT_STATE.progress.taskLevels, ...((parsed.progress || {}).taskLevels || {}) },
      },
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getAccuracy(result) {
  const correct = result.correct || result.hits || result.completed || 0;
  const total = result.total || result.trials || result.possible || Math.max(1, correct + (result.mistakes || 0));
  const penalty = result.falseAlarms || result.mistakes || 0;
  return clamp(((correct - penalty * 0.35) / Math.max(1, total)) * 100, 0, 100);
}

function updateLevel(level, result) {
  const accuracy = getAccuracy(result);
  if (accuracy >= 86 && (result.mistakes || result.falseAlarms || 0) <= 2) return clamp(level + 1, 1, 5);
  if (accuracy < 62 || (result.mistakes || result.falseAlarms || 0) >= 5) return clamp(level - 1, 1, 5);
  return level;
}

function buildPlan(type, levels) {
  if (type === 'easy') return ['target', 'memory'];
  if (type === 'standard') return ['target', 'go', 'slow'];
  if (type === 'challenge') return ['go', levels.nback >= 2 ? 'nback' : 'sequence', 'wait', 'stroop'];
  return [type];
}

function useTimer(seconds, active, onDone) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    setLeft(seconds);
  }, [seconds]);
  useEffect(() => {
    if (!active) return;
    if (left <= 0) {
      onDone?.();
      return;
    }
    const id = setTimeout(() => setLeft((v) => v - 1), 1000);
    return () => clearTimeout(id);
  }, [left, active, onDone]);
  return [left, setLeft];
}

function speakTone(enabled, type = 'good') {
  if (!enabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = type === 'good' ? 680 : type === 'soft' ? 440 : 260;
    gain.gain.value = 0.035;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
    osc.stop(ctx.currentTime + 0.2);
  } catch {}
}

function App() {
  const [state, setState] = useState(loadState);
  const [screen, setScreen] = useState('home');
  const [run, setRun] = useState(null);
  const [showPin, setShowPin] = useState(false);

  useEffect(() => saveState(state), [state]);
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {});
    }
  }, []);

  const todaySessions = state.sessions.filter((s) => s.date === TODAY());
  const totalTodayMinutes = todaySessions.reduce((sum, s) => sum + s.minutes, 0);

  function startPlan(type) {
    const tasks = buildPlan(type, state.progress.taskLevels);
    setRun({ id: uid(), type, stage: 'warmup', taskIndex: 0, tasks, results: [], startedAt: Date.now() });
    setScreen('run');
  }

  function finishTask(result) {
    setRun((current) => {
      const results = [...current.results, result];
      const nextIndex = current.taskIndex + 1;
      if (nextIndex >= current.tasks.length) {
        const minutes = Math.max(1, Math.round((Date.now() - current.startedAt) / 60000));
        const session = {
          id: current.id,
          date: TODAY(),
          type: current.type,
          minutes,
          startedAt: current.startedAt,
          endedAt: Date.now(),
          results,
        };
        completeSession(session);
        return { ...current, stage: 'complete', results };
      }
      return { ...current, taskIndex: nextIndex, results };
    });
  }

  function completeSession(session) {
    setState((prev) => {
      const nextLevels = { ...prev.progress.taskLevels };
      session.results.forEach((r) => {
        nextLevels[r.task] = updateLevel(nextLevels[r.task] || 1, r);
      });
      const last = prev.progress.lastActiveDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const ymd = yesterday.toISOString().slice(0, 10);
      const streak = last === TODAY() ? prev.progress.streak : last === ymd ? prev.progress.streak + 1 : 1;
      const gardenPoints = prev.progress.gardenPoints + Math.max(1, session.results.length);
      const badges = new Set(prev.progress.badges || []);
      if (gardenPoints >= 10) badges.add('小花匠');
      if (gardenPoints >= 30) badges.add('专注星星');
      if (streak >= 7) badges.add('七天坚持');
      if (session.results.some((r) => getAccuracy(r) >= 90)) badges.add('认真观察');
      return {
        ...prev,
        progress: {
          ...prev.progress,
          taskLevels: nextLevels,
          gardenPoints,
          streak,
          lastActiveDate: TODAY(),
          badges: [...badges],
        },
        sessions: [session, ...prev.sessions].slice(0, 300),
      };
    });
  }

  function updateSettings(patch) {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }

  function resetAll() {
    const ok = window.confirm('确定要清空所有训练记录吗？');
    if (!ok) return;
    setState(DEFAULT_STATE);
    setScreen('home');
  }

  return (
    <div className={`app ${state.settings.reduceMotion ? 'reduce-motion' : ''}`}>
      {screen === 'home' && (
        <Home
          state={state}
          todaySessions={todaySessions}
          totalTodayMinutes={totalTodayMinutes}
          onStart={startPlan}
          onLab={() => setScreen('lab')}
          onParent={() => setShowPin(true)}
        />
      )}
      {screen === 'lab' && (
        <Lab state={state} onStart={startPlan} onBack={() => setScreen('home')} />
      )}
      {screen === 'run' && run && (
        <RunScreen
          run={run}
          setRun={setRun}
          state={state}
          onTaskDone={finishTask}
          onHome={() => {
            setRun(null);
            setScreen('home');
          }}
        />
      )}
      {screen === 'parent' && (
        <ParentCenter state={state} onBack={() => setScreen('home')} updateSettings={updateSettings} resetAll={resetAll} />
      )}
      {showPin && (
        <PinDialog
          pin={state.settings.parentPin}
          onClose={() => setShowPin(false)}
          onSuccess={() => {
            setShowPin(false);
            setScreen('parent');
          }}
        />
      )}
    </div>
  );
}

function Home({ state, todaySessions, totalTodayMinutes, onStart, onLab, onParent }) {
  const limitReached = todaySessions.length >= state.settings.dailyRoundLimit;
  return (
    <main className="page home-page">
      <TopBar onParent={onParent} />
      <section className="hero-card">
        <div>
          <p className="eyebrow">Focus Garden</p>
          <h1>{state.settings.childName}，今天来种一朵专注花吧</h1>
          <p className="hero-copy">每次只做一个小目标。慢慢看，认真点，不着急。</p>
        </div>
        <Garden points={state.progress.gardenPoints} streak={state.progress.streak} />
      </section>

      <section className="today-row">
        <StatCard label="今日完成" value={`${todaySessions.length} 轮`} />
        <StatCard label="今日专注" value={`${totalTodayMinutes} 分钟`} />
        <StatCard label="连续天数" value={`${state.progress.streak} 天`} />
      </section>

      {limitReached && (
        <div className="soft-alert">今天已经完成设定的训练次数，可以休息啦。家长中心可以调整每日次数。</div>
      )}

      <section className="plan-grid">
        <PlanCard
          title="轻松训练"
          time="5分钟"
          icon="🌱"
          desc="找目标 + 记忆花园，适合状态一般的日子。"
          disabled={limitReached}
          onClick={() => onStart('easy')}
        />
        <PlanCard
          title="标准训练"
          time="8分钟"
          icon="🌼"
          desc="观察、等待、慢动作控制，适合每天常规训练。"
          disabled={limitReached}
          onClick={() => onStart('standard')}
        />
        <PlanCard
          title="挑战训练"
          time="12分钟"
          icon="⭐"
          desc="冲动控制、抗干扰和记忆反应，难度更高。"
          disabled={limitReached}
          onClick={() => onStart('challenge')}
        />
      </section>

      <button className="lab-button" onClick={onLab}>进入专注实验室</button>

      <section className="badges-card">
        <h2>我的小徽章</h2>
        {state.progress.badges.length ? (
          <div className="badge-list">{state.progress.badges.map((b) => <span className="badge" key={b}>🏅 {b}</span>)}</div>
        ) : (
          <p>完成更多小任务后，这里会出现徽章。</p>
        )}
      </section>
    </main>
  );
}

function TopBar({ onParent }) {
  const holdRef = useRef(null);
  return (
    <header className="topbar">
      <div className="brand"><span>🌸</span><strong>专注花园</strong></div>
      <button
        className="parent-entry"
        onPointerDown={() => { holdRef.current = setTimeout(onParent, 900); }}
        onPointerUp={() => clearTimeout(holdRef.current)}
        onPointerCancel={() => clearTimeout(holdRef.current)}
        onClick={(e) => e.preventDefault()}
        aria-label="长按进入家长中心"
      >
        家长长按
      </button>
    </header>
  );
}

function StatCard({ label, value }) {
  return <div className="stat-card"><span>{label}</span><strong>{value}</strong></div>;
}

function PlanCard({ title, time, icon, desc, onClick, disabled }) {
  return (
    <button className="plan-card" onClick={onClick} disabled={disabled}>
      <div className="plan-icon">{icon}</div>
      <div><h2>{title}</h2><strong>{time}</strong><p>{desc}</p></div>
    </button>
  );
}

function Garden({ points, streak }) {
  const flowers = clamp(Math.floor(points / 2) + 3, 3, 16);
  const animals = points >= 12;
  return (
    <div className="garden" aria-label="专注花园">
      <div className="sun">☀️</div>
      <div className="cloud cloud-a">☁️</div>
      <div className="cloud cloud-b">☁️</div>
      <div className="garden-ground">
        {Array.from({ length: flowers }).map((_, i) => (
          <span key={i} className="flower" style={{ left: `${8 + (i * 83) % 84}%`, bottom: `${8 + (i % 3) * 10}%` }}>
            {['🌷', '🌼', '🌻', '🌸'][i % 4]}
          </span>
        ))}
        {animals && <span className="animal">🦋</span>}
        {streak >= 3 && <span className="animal animal-two">🐝</span>}
      </div>
    </div>
  );
}

function Lab({ state, onStart, onBack }) {
  const items = [
    ['target', '找所有目标', '同时记住颜色和形状，排除干扰。', '🔎'],
    ['memory', '记忆花园', '先观察，再凭记忆点出位置。', '🧠'],
    ['go', '红绿灯反应', '看到目标才点，其他时候忍住。', '🚦'],
    ['nback', '记忆反应', '判断现在是否和前面一样。', '🔁'],
    ['sequence', '多步指令', '记住顺序，然后一步步完成。', '🧩'],
    ['slow', '慢动作控制', '不求快，训练慢下来。', '🐢'],
    ['wait', '等待金鱼', '等待真正目标出现，不能乱点。', '🐟'],
    ['stroop', '颜色干扰', '不要被文字骗，选择真正颜色。', '🎨'],
  ];
  return (
    <main className="page">
      <button className="back-button" onClick={onBack}>← 返回</button>
      <section className="section-head"><p className="eyebrow">Focus Lab</p><h1>专注实验室</h1><p>这里是单项训练。每次只练一个，不建议连续刷太多。</p></section>
      <div className="lab-grid">
        {items.map(([key, title, desc, icon]) => (
          <button key={key} className="lab-card" onClick={() => onStart(key)}>
            <div className="lab-emoji">{icon}</div>
            <div><h2>{title}</h2><p>{desc}</p><span>当前难度 Lv.{state.progress.taskLevels[key] || 1}</span></div>
          </button>
        ))}
      </div>
    </main>
  );
}

function RunScreen({ run, setRun, state, onTaskDone, onHome }) {
  const currentTask = run.tasks[run.taskIndex];
  if (run.stage === 'warmup') {
    return <Warmup seconds={state.settings.warmupSeconds} childName={state.settings.childName} onDone={() => setRun((r) => ({ ...r, stage: 'task' }))} onExit={onHome} />;
  }
  if (run.stage === 'complete') {
    return <CompleteScreen run={run} progress={state.progress} onHome={onHome} />;
  }
  const common = {
    key: `${run.id}-${run.taskIndex}-${currentTask}`,
    level: state.progress.taskLevels[currentTask] || 1,
    sound: state.settings.sound,
    onDone: onTaskDone,
    onExit: onHome,
    taskIndex: run.taskIndex + 1,
    taskTotal: run.tasks.length,
  };
  return (
    <div className="run-wrap">
      {currentTask === 'target' && <TargetSearchTask {...common} />}
      {currentTask === 'memory' && <MemoryTask {...common} />}
      {currentTask === 'go' && <GoNoGoTask {...common} />}
      {currentTask === 'nback' && <NBackTask {...common} />}
      {currentTask === 'sequence' && <SequenceTask {...common} />}
      {currentTask === 'slow' && <SlowPathTask {...common} />}
      {currentTask === 'wait' && <WaitFishTask {...common} />}
      {currentTask === 'stroop' && <StroopTask {...common} />}
    </div>
  );
}

function TaskShell({ title, subtitle, taskIndex, taskTotal, children, onExit, footer }) {
  return (
    <main className="task-page">
      <header className="task-header">
        <button className="exit-button" onClick={onExit}>结束</button>
        <div><span>任务 {taskIndex}/{taskTotal}</span><h1>{title}</h1><p>{subtitle}</p></div>
      </header>
      {children}
      {footer && <footer className="task-footer">{footer}</footer>}
    </main>
  );
}

function Warmup({ seconds, childName, onDone, onExit }) {
  const [left] = useTimer(seconds, true, onDone);
  const ratio = 1 - left / seconds;
  return (
    <main className="warmup page">
      <button className="exit-button" onClick={onExit}>退出</button>
      <div className="breath-card">
        <p className="eyebrow">准备开始</p>
        <h1>{childName}，先让身体安静下来</h1>
        <div className="breath-orb" style={{ transform: `scale(${1 + Math.sin(ratio * Math.PI * 6) * 0.12})` }}>🌸</div>
        <p className="breath-tip">花朵变大时吸气，变小时呼气。</p>
        <div className="progress-line"><span style={{ width: pct(ratio * 100) }} /></div>
        <button className="primary-button" onClick={onDone}>我准备好了</button>
      </div>
    </main>
  );
}

function TargetSearchTask({ level, sound, onDone, onExit, taskIndex, taskTotal }) {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
  const shapes = ['●', '▲', '■', '★', '♥'];
  const size = level <= 2 ? 16 : level <= 4 ? 20 : 25;
  const [target] = useState(() => ({ color: colors[level % colors.length], shape: shapes[(level + 2) % shapes.length] }));
  const [items] = useState(() => {
    const targetCount = clamp(level + 2, 3, 7);
    const arr = Array.from({ length: size }, (_, i) => {
      const isTarget = i < targetCount;
      return { id: uid(), color: isTarget ? target.color : colors[Math.floor(Math.random() * colors.length)], shape: isTarget ? target.shape : shapes[Math.floor(Math.random() * shapes.length)], found: false };
    }).sort(() => Math.random() - 0.5);
    return arr.map((item, index) => ({ ...item, index }));
  });
  const [found, setFound] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState('慢慢找，找到一个点一个。');
  const totalTargets = items.filter((x) => x.color === target.color && x.shape === target.shape).length;
  const [left] = useTimer(70 + level * 10, true, () => finish(false));

  function finish(byCompletion = true) {
    onDone({ task: 'target', label: TASK_LABELS.target, correct: found.length, total: totalTargets, mistakes, seconds: 70 + level * 10 - left, completed: byCompletion ? found.length : 0 });
  }

  function tap(item) {
    const ok = item.color === target.color && item.shape === target.shape;
    if (ok && !found.includes(item.id)) {
      speakTone(sound, 'good');
      const next = [...found, item.id];
      setFound(next);
      setMessage(next.length === totalTargets ? '全部找到了！' : '很好，再找找看。');
      if (next.length === totalTargets) setTimeout(() => finish(true), 550);
    } else {
      speakTone(sound, 'soft');
      setMistakes((m) => m + 1);
      setMessage('再看一看，要颜色和形状都一样。');
    }
  }

  return (
    <TaskShell title="找目标" subtitle={`找到所有 ${colorName(target.color)} ${target.shape}`} taskIndex={taskIndex} taskTotal={taskTotal} onExit={onExit}
      footer={<><span>剩余 {left}s</span><span>找到 {found.length}/{totalTargets}</span><button onClick={() => finish(false)}>完成</button></>}
    >
      <div className="instruction-card"><span className={`shape-sample ${target.color}`}>{target.shape}</span><strong>只点这个目标</strong><p>{message}</p></div>
      <div className={`target-grid grid-${size}`}>
        {items.map((item) => (
          <button key={item.id} className={`target-cell ${item.color} ${found.includes(item.id) ? 'found' : ''}`} onClick={() => tap(item)}>{item.shape}</button>
        ))}
      </div>
    </TaskShell>
  );
}

function MemoryTask({ level, sound, onDone, onExit, taskIndex, taskTotal }) {
  const icons = ['🐱', '🐶', '🦊', '🐼', '🐸', '🐵', '🐰', '🦁'];
  const count = level <= 2 ? 8 : level <= 4 ? 10 : 12;
  const targetIcon = icons[level % icons.length];
  const targetCount = clamp(level + 1, 2, 5);
  const [cards] = useState(() => {
    const arr = Array.from({ length: count }, (_, i) => ({ id: uid(), icon: i < targetCount ? targetIcon : icons[Math.floor(Math.random() * icons.length)], isTarget: i < targetCount }));
    return arr.sort(() => Math.random() - 0.5);
  });
  const [show, setShow] = useState(true);
  const [selected, setSelected] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState('先记住它们在哪里。');
  useEffect(() => {
    const id = setTimeout(() => { setShow(false); setMessage(`请点出刚才所有 ${targetIcon} 的位置。`); }, Math.max(2200, 4800 - level * 400));
    return () => clearTimeout(id);
  }, [level, targetIcon]);
  function finish() {
    onDone({ task: 'memory', label: TASK_LABELS.memory, correct: selected.filter((id) => cards.find((c) => c.id === id)?.isTarget).length, total: targetCount, mistakes, possible: targetCount });
  }
  function tap(card) {
    if (show || selected.includes(card.id)) return;
    if (card.isTarget) {
      speakTone(sound, 'good');
      const next = [...selected, card.id];
      setSelected(next);
      setMessage(next.length === targetCount ? '记得很清楚！' : '很好，继续找。');
      if (next.length === targetCount) setTimeout(finish, 500);
    } else {
      speakTone(sound, 'soft');
      setMistakes((m) => m + 1);
      setMessage('这个位置好像不是，再想想。');
    }
  }
  return (
    <TaskShell title="记忆花园" subtitle={`记住 ${targetIcon} 的位置`} taskIndex={taskIndex} taskTotal={taskTotal} onExit={onExit}
      footer={<><span>{show ? '观察中' : `已找到 ${selected.length}/${targetCount}`}</span><button onClick={finish}>完成</button></>}
    >
      <div className="instruction-card"><strong>{message}</strong></div>
      <div className={`memory-grid count-${count}`}>
        {cards.map((card) => (
          <button key={card.id} className={`memory-card ${selected.includes(card.id) ? 'selected' : ''}`} onClick={() => tap(card)}>
            {show || selected.includes(card.id) ? card.icon : '🌿'}
          </button>
        ))}
      </div>
    </TaskShell>
  );
}

function GoNoGoTask({ level, sound, onDone, onExit, taskIndex, taskTotal }) {
  const trials = 16 + level * 2;
  const [index, setIndex] = useState(0);
  const [stimulus, setStimulus] = useState(null);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const tappedRef = useRef(false);
  const targetRate = clamp(0.46 - level * 0.035, 0.22, 0.42);
  const speed = clamp(1300 - level * 120, 700, 1300);

  useEffect(() => {
    if (index >= trials) {
      onDone({ task: 'go', label: TASK_LABELS.go, hits, correct: hits, total: trials, misses, falseAlarms, trials });
      return;
    }
    tappedRef.current = false;
    const isTarget = Math.random() < targetRate;
    const animal = isTarget ? '🐰' : ['🐢', '🦊', '🐸', '🐱'][Math.floor(Math.random() * 4)];
    const light = isTarget ? 'green' : Math.random() > 0.45 ? 'red' : 'green';
    setStimulus({ isTarget, animal, light });
    const id = setTimeout(() => {
      if (isTarget && !tappedRef.current) setMisses((m) => m + 1);
      setIndex((i) => i + 1);
    }, speed);
    return () => clearTimeout(id);
  }, [index]);

  function tap() {
    if (!stimulus || tappedRef.current) return;
    tappedRef.current = true;
    if (stimulus.isTarget) {
      speakTone(sound, 'good');
      setHits((h) => h + 1);
    } else {
      speakTone(sound, 'soft');
      setFalseAlarms((f) => f + 1);
    }
  }
  return (
    <TaskShell title="红绿灯反应" subtitle="只有绿色小兔子出现时才点" taskIndex={taskIndex} taskTotal={taskTotal} onExit={onExit}
      footer={<><span>{index}/{trials}</span><span>点对 {hits}</span><span>忍住 {Math.max(0, index - hits - falseAlarms)}</span></>}
    >
      <button className={`stimulus-card ${stimulus?.light || ''}`} onClick={tap}>
        <span className="light-dot">{stimulus?.light === 'green' ? '🟢' : '🔴'}</span>
        <span className="stimulus-animal">{stimulus?.animal}</span>
      </button>
      <p className="task-hint">看到目标就轻点一下；不是目标就把手停住。</p>
    </TaskShell>
  );
}

function NBackTask({ level, sound, onDone, onExit, taskIndex, taskTotal }) {
  const n = level >= 4 ? 2 : 1;
  const icons = ['⭐', '🌙', '☀️', '🍎', '🚗', '🐱'];
  const trials = 14 + level * 2;
  const sequence = useMemo(() => {
    const arr = [];
    for (let i = 0; i < trials; i++) {
      if (i >= n && Math.random() < 0.3) arr.push(arr[i - n]);
      else arr.push(icons[Math.floor(Math.random() * icons.length)]);
    }
    return arr;
  }, []);
  const [index, setIndex] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const tappedRef = useRef(false);
  const current = sequence[index];
  const shouldTap = index >= n && sequence[index] === sequence[index - n];
  useEffect(() => {
    if (index >= trials) {
      const possible = sequence.filter((_, i) => i >= n && sequence[i] === sequence[i - n]).length;
      onDone({ task: 'nback', label: TASK_LABELS.nback, hits, correct: hits, total: possible || 1, falseAlarms, misses, trials });
      return;
    }
    tappedRef.current = false;
    const id = setTimeout(() => {
      if (shouldTap && !tappedRef.current) setMisses((m) => m + 1);
      setIndex((i) => i + 1);
    }, clamp(1550 - level * 90, 950, 1500));
    return () => clearTimeout(id);
  }, [index]);
  function tap() {
    if (tappedRef.current || index >= trials) return;
    tappedRef.current = true;
    if (shouldTap) {
      speakTone(sound, 'good');
      setHits((h) => h + 1);
    } else {
      speakTone(sound, 'soft');
      setFalseAlarms((f) => f + 1);
    }
  }
  return (
    <TaskShell title={`${n}-Back 记忆反应`} subtitle={n === 1 ? '和上一个一样就点' : '和前两个之前一样就点'} taskIndex={taskIndex} taskTotal={taskTotal} onExit={onExit}
      footer={<><span>{Math.min(index + 1, trials)}/{trials}</span><span>点对 {hits}</span><span>乱点 {falseAlarms}</span></>}
    >
      <button className="nback-card" onClick={tap}>{current || '完成'}</button>
      <p className="task-hint">先想一想，再决定要不要点。</p>
    </TaskShell>
  );
}

function SequenceTask({ level, sound, onDone, onExit, taskIndex, taskTotal }) {
  const icons = ['🌟', '🍓', '🐱', '🚀', '🌈', '🍀'];
  const length = clamp(level + 1, 2, 5);
  const [sequence] = useState(() => Array.from({ length }, () => icons[Math.floor(Math.random() * icons.length)]));
  const [show, setShow] = useState(true);
  const [step, setStep] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setShow(false), 2800 + length * 450);
    return () => clearTimeout(id);
  }, []);
  function pick(icon) {
    if (show) return;
    if (icon === sequence[step]) {
      speakTone(sound, 'good');
      const next = step + 1;
      setStep(next);
      if (next >= sequence.length) setTimeout(() => onDone({ task: 'sequence', label: TASK_LABELS.sequence, correct: length, total: length, mistakes }), 500);
    } else {
      speakTone(sound, 'soft');
      setMistakes((m) => m + 1);
    }
  }
  return (
    <TaskShell title="多步指令" subtitle="先记顺序，再一步步点出来" taskIndex={taskIndex} taskTotal={taskTotal} onExit={onExit}
      footer={<><span>{show ? '正在记忆' : `第 ${step + 1} 步`}</span><span>错误 {mistakes}</span></>}
    >
      <div className="sequence-show">
        {show ? sequence.map((x, i) => <span key={`${x}-${i}`}>{x}</span>) : <span>{'✓ '.repeat(step)}</span>}
      </div>
      <div className="choice-grid">
        {[...new Set(icons)].map((icon) => <button key={icon} onClick={() => pick(icon)}>{icon}</button>)}
      </div>
    </TaskShell>
  );
}

function SlowPathTask({ level, sound, onDone, onExit, taskIndex, taskTotal }) {
  const [started, setStarted] = useState(false);
  const [pos, setPos] = useState({ x: 8, y: 50 });
  const [warnings, setWarnings] = useState(0);
  const [done, setDone] = useState(false);
  const boxRef = useRef(null);
  const lastRef = useRef({ t: 0, x: 8, y: 50 });
  const maxSpeed = 1.1 + (5 - level) * 0.12;

  function move(e) {
    if (!started || done) return;
    const rect = boxRef.current.getBoundingClientRect();
    const x = clamp(((e.clientX - rect.left) / rect.width) * 100, 3, 97);
    const y = clamp(((e.clientY - rect.top) / rect.height) * 100, 12, 88);
    const now = performance.now();
    if (lastRef.current.t) {
      const dist = Math.hypot(x - lastRef.current.x, y - lastRef.current.y);
      const dt = Math.max(16, now - lastRef.current.t);
      const speed = dist / dt;
      const centerY = 50 + Math.sin((x / 100) * Math.PI * 2) * 18;
      if (speed > maxSpeed || Math.abs(y - centerY) > 18) {
        setWarnings((w) => w + 1);
        speakTone(sound, 'soft');
      }
    }
    lastRef.current = { t: now, x, y };
    setPos({ x, y });
    if (x > 92) {
      setDone(true);
      setTimeout(() => onDone({ task: 'slow', label: TASK_LABELS.slow, correct: Math.max(0, 8 - warnings), total: 8, mistakes: warnings, completed: 1 }), 700);
    }
  }
  return (
    <TaskShell title="慢慢走" subtitle="把小猫慢慢送到小屋，不要太快" taskIndex={taskIndex} taskTotal={taskTotal} onExit={onExit}
      footer={<><span>提醒 {warnings}</span><span>{done ? '到家啦' : '越慢越稳'}</span></>}
    >
      <div
        className="slow-board"
        ref={boxRef}
        onPointerDown={(e) => { setStarted(true); boxRef.current.setPointerCapture?.(e.pointerId); lastRef.current = { t: performance.now(), x: pos.x, y: pos.y }; }}
        onPointerMove={move}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="path-svg">
          <path d="M6,50 C25,20 38,80 55,50 S80,20 94,50" />
        </svg>
        <div className="home-target">🏠</div>
        <div className="drag-cat" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>🐱</div>
      </div>
      <p className="task-hint">用手指按住小猫拖动。太快或离开小路会提醒。</p>
    </TaskShell>
  );
}

function WaitFishTask({ level, sound, onDone, onExit, taskIndex, taskTotal }) {
  const trials = 18 + level * 2;
  const [index, setIndex] = useState(0);
  const [fish, setFish] = useState(null);
  const [hits, setHits] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [misses, setMisses] = useState(0);
  const tappedRef = useRef(false);
  const targetRate = clamp(0.32 - level * 0.02, 0.16, 0.3);
  useEffect(() => {
    if (index >= trials) {
      onDone({ task: 'wait', label: TASK_LABELS.wait, hits, correct: hits, total: trials, falseAlarms, misses, trials });
      return;
    }
    tappedRef.current = false;
    const isGold = Math.random() < targetRate;
    setFish({ isGold, icon: isGold ? '🐠' : ['🐟', '🦈', '🐡'][Math.floor(Math.random() * 3)] });
    const id = setTimeout(() => {
      if (isGold && !tappedRef.current) setMisses((m) => m + 1);
      setIndex((i) => i + 1);
    }, clamp(1500 - level * 80, 900, 1500));
    return () => clearTimeout(id);
  }, [index]);
  function tap() {
    if (!fish || tappedRef.current) return;
    tappedRef.current = true;
    if (fish.isGold) {
      speakTone(sound, 'good');
      setHits((h) => h + 1);
    } else {
      speakTone(sound, 'soft');
      setFalseAlarms((f) => f + 1);
    }
  }
  return (
    <TaskShell title="等待金鱼" subtitle="只有彩色金鱼出现时才点" taskIndex={taskIndex} taskTotal={taskTotal} onExit={onExit}
      footer={<><span>{index}/{trials}</span><span>点对 {hits}</span><span>乱点 {falseAlarms}</span></>}
    >
      <button className="fish-pond" onClick={tap}><span>{fish?.icon}</span></button>
      <p className="task-hint">普通鱼游过时，手要停住。</p>
    </TaskShell>
  );
}

function StroopTask({ level, sound, onDone, onExit, taskIndex, taskTotal }) {
  const colorMap = {
    red: { name: '红色', hex: '#f36d6d' },
    blue: { name: '蓝色', hex: '#5a9df8' },
    green: { name: '绿色', hex: '#5fbd8b' },
    yellow: { name: '黄色', hex: '#e9b93f' },
    purple: { name: '紫色', hex: '#9b78e7' },
  };
  const keys = Object.keys(colorMap).slice(0, clamp(level + 2, 3, 5));
  const trials = 10 + level * 2;
  const [index, setIndex] = useState(0);
  const [stim, setStim] = useState(makeStim);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  function makeStim() {
    const textKey = keys[Math.floor(Math.random() * keys.length)];
    let inkKey = keys[Math.floor(Math.random() * keys.length)];
    if (level >= 2 && Math.random() < 0.75) while (inkKey === textKey) inkKey = keys[Math.floor(Math.random() * keys.length)];
    return { textKey, inkKey };
  }
  function choose(key) {
    if (key === stim.inkKey) {
      speakTone(sound, 'good');
      setCorrect((c) => c + 1);
    } else {
      speakTone(sound, 'soft');
      setMistakes((m) => m + 1);
    }
    const next = index + 1;
    if (next >= trials) setTimeout(() => onDone({ task: 'stroop', label: TASK_LABELS.stroop, correct: correct + (key === stim.inkKey ? 1 : 0), total: trials, mistakes: mistakes + (key === stim.inkKey ? 0 : 1) }), 250);
    else {
      setIndex(next);
      setStim(makeStim());
    }
  }
  return (
    <TaskShell title="颜色干扰" subtitle="不要读字，选择字真正的颜色" taskIndex={taskIndex} taskTotal={taskTotal} onExit={onExit}
      footer={<><span>{index + 1}/{trials}</span><span>正确 {correct}</span><span>错误 {mistakes}</span></>}
    >
      <div className="stroop-word" style={{ color: colorMap[stim.inkKey].hex }}>{colorMap[stim.textKey].name}</div>
      <div className="color-choice-row">
        {keys.map((key) => <button key={key} className={`color-choice ${key}`} onClick={() => choose(key)}>{colorMap[key].name}</button>)}
      </div>
    </TaskShell>
  );
}

function CompleteScreen({ run, progress, onHome }) {
  const avg = run.results.length ? Math.round(run.results.reduce((sum, r) => sum + getAccuracy(r), 0) / run.results.length) : 0;
  return (
    <main className="page complete-page">
      <section className="complete-card">
        <div className="complete-emoji">🌟</div>
        <h1>完成啦！</h1>
        <p>你认真完成了 {run.results.length} 个小任务，花园又长大了一点。</p>
        <div className="result-list">
          {run.results.map((r, i) => (
            <div key={`${r.task}-${i}`} className="result-item"><span>{r.label}</span><strong>{pct(getAccuracy(r))}</strong></div>
          ))}
        </div>
        <div className="big-score">本轮专注度：{avg}%</div>
        <Garden points={progress.gardenPoints + run.results.length} streak={progress.streak} />
        <button className="primary-button" onClick={onHome}>回到花园</button>
      </section>
    </main>
  );
}

function PinDialog({ pin, onClose, onSuccess }) {
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  function submit() {
    if (value === pin) onSuccess();
    else { setWrong(true); setValue(''); }
  }
  return (
    <div className="modal-backdrop">
      <div className="pin-dialog">
        <h2>家长中心</h2>
        <p>请输入家长 PIN 码。默认是 2580，可在家长中心修改。</p>
        <input inputMode="numeric" pattern="[0-9]*" value={value} onChange={(e) => { setWrong(false); setValue(e.target.value); }} placeholder="PIN" autoFocus />
        {wrong && <span className="wrong">PIN 不正确</span>}
        <div className="dialog-actions"><button onClick={onClose}>取消</button><button className="primary-button small" onClick={submit}>进入</button></div>
      </div>
    </div>
  );
}

function ParentCenter({ state, onBack, updateSettings, resetAll }) {
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const date = d.toISOString().slice(0, 10);
    const sessions = state.sessions.filter((s) => s.date === date);
    return { date, label: `${d.getMonth() + 1}/${d.getDate()}`, minutes: sessions.reduce((sum, s) => sum + s.minutes, 0), count: sessions.length };
  });
  const taskStats = Object.keys(TASK_LABELS).map((task) => {
    const results = state.sessions.flatMap((s) => s.results || []).filter((r) => r.task === task);
    const avg = results.length ? Math.round(results.reduce((sum, r) => sum + getAccuracy(r), 0) / results.length) : 0;
    return { task, label: TASK_LABELS[task], count: results.length, avg, level: state.progress.taskLevels[task] || 1 };
  });
  return (
    <main className="page parent-page">
      <button className="back-button" onClick={onBack}>← 返回孩子首页</button>
      <section className="section-head"><p className="eyebrow">Parent Center</p><h1>家长中心</h1><p>这里的数据只保存在当前浏览器/设备里，不上传服务器。</p></section>
      <section className="dashboard-grid">
        <StatCard label="总训练轮数" value={`${state.sessions.length} 轮`} />
        <StatCard label="花园成长点" value={`${state.progress.gardenPoints}`} />
        <StatCard label="连续天数" value={`${state.progress.streak} 天`} />
      </section>
      <section className="panel">
        <h2>最近 7 天</h2>
        <BarChart data={last7} />
      </section>
      <section className="panel">
        <h2>单项训练表现</h2>
        <div className="task-stat-list">
          {taskStats.map((s) => (
            <div className="task-stat" key={s.task}>
              <div><strong>{s.label}</strong><span>训练 {s.count} 次 · Lv.{s.level}</span></div>
              <div className="mini-meter"><span style={{ width: `${s.avg}%` }} /></div>
              <b>{s.count ? `${s.avg}%` : '—'}</b>
            </div>
          ))}
        </div>
      </section>
      <section className="panel settings-panel">
        <h2>设置</h2>
        <label>孩子称呼<input value={state.settings.childName} onChange={(e) => updateSettings({ childName: e.target.value })} /></label>
        <label>家长 PIN<input inputMode="numeric" value={state.settings.parentPin} onChange={(e) => updateSettings({ parentPin: e.target.value || '2580' })} /></label>
        <label>每日最多训练轮数<select value={state.settings.dailyRoundLimit} onChange={(e) => updateSettings({ dailyRoundLimit: Number(e.target.value) })}><option value={1}>1轮</option><option value={2}>2轮</option><option value={3}>3轮</option><option value={4}>4轮</option></select></label>
        <label>呼吸准备时间<select value={state.settings.warmupSeconds} onChange={(e) => updateSettings({ warmupSeconds: Number(e.target.value) })}><option value={15}>15秒</option><option value={25}>25秒</option><option value={40}>40秒</option></select></label>
        <label className="switch-line"><span>柔和音效</span><input type="checkbox" checked={state.settings.sound} onChange={(e) => updateSettings({ sound: e.target.checked })} /></label>
        <label className="switch-line"><span>减少动画</span><input type="checkbox" checked={state.settings.reduceMotion} onChange={(e) => updateSettings({ reduceMotion: e.target.checked })} /></label>
        <button className="danger-button" onClick={resetAll}>清空全部记录</button>
      </section>
      <section className="panel note-panel">
        <h2>使用建议</h2>
        <p>建议每天 1–2 轮，每轮 5–10 分钟。孩子疲劳、情绪不好或明显抗拒时，不要硬练。这个工具用于亲子陪伴和训练习惯，不用于医学诊断。</p>
      </section>
    </main>
  );
}

function BarChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.minutes));
  return (
    <div className="bar-chart">
      {data.map((d) => (
        <div className="bar-item" key={d.date}>
          <div className="bar-track"><span style={{ height: `${Math.max(5, (d.minutes / max) * 100)}%` }} /></div>
          <b>{d.minutes}</b>
          <small>{d.label}</small>
        </div>
      ))}
    </div>
  );
}

function colorName(color) {
  return { red: '红色', blue: '蓝色', green: '绿色', yellow: '黄色', purple: '紫色' }[color] || color;
}

createRoot(document.getElementById('root')).render(<App />);
