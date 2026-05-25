import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, TimerMode, UserStats, GadgetType } from './types';
import { soundService } from './components/SoundService';
import DoraemonVisual from './components/DoraemonVisual';
import AnywhereDoorNav from './components/AnywhereDoorNav';
import BambooCopterTimer from './components/BambooCopterTimer';
import TaskList from './components/TaskList';
import GadgetStore from './components/GadgetStore';
import ManualTimeMachine from './components/ManualTimeMachine';

// Fun translation konjac quotes list
interface KonjacQuote {
  japanese: string;
  english: string;
  character: string;
}

const KONJAC_QUOTES: KonjacQuote[] = [
  { japanese: "もっとがんばろう、のび太くん！明日があるさ。", english: "Step by step, Nobita! There is always a beautiful tomorrow.", character: "Doraemon" },
  { japanese: "アンキパンは便利だけど、自分の頭も育てなきゃね。", english: "Memorization Bread is useful, but we must grow our own minds too!", character: "Doraemon" },
  { japanese: "どこでもドアがあったら、すぐに宿題の部屋を脱出できるのに！", english: "If only I had the Anywhere Door, I could escape this study homework in seconds!", character: "Nobita" },
  { japanese: "ジャイアンのリサイタルは延期！今は集中して勉強する時間だ！", english: "Gian's concert is postponed! Now is the time to focus without noise!", character: "Doraemon" },
  { japanese: "お風呂上がりに、冷たいどら焼きとお茶はどうかしら？", english: "How about some chilled Dorayaki and warm tea after your focus session?", character: "Shizuka" },
  { japanese: "僕、将来は22世紀でも通用するプロになりたいんだ！", english: "I want to become a programmer whose skills are valued even in the 22nd century!", character: "Suneo" },
  { japanese: "どんなに勉強が苦手でも、あきらめない心が一番のひみつ道具だよ。", english: "No matter how hard studying gets, an untamed hearth is the ultimate magic gadget.", character: "Doraemon" }
];

export default function App() {
  // State initialization with localStorage fallback
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('doraemon_pomodoro_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Default initial tasks
    return [
      {
        id: 'init-1',
        title: 'Calibrate Tomorrow\'s Anywhere Door Coordinates',
        description: 'Prepare focus environment and log standard tasks',
        completed: false,
        pomodorosEstimated: 2,
        pomodorosCompleted: 1,
        gadgetIcon: 'door',
        createdAt: new Date().toISOString(),
        timeSpent: 1500,
      },
      {
        id: 'init-2',
        title: 'Launch Pomodoro Rocket flights using Take-Copter',
        description: 'Conduct a fully focused 25-minute Pomodoro flight',
        completed: false,
        pomodorosEstimated: 1,
        pomodorosCompleted: 0,
        gadgetIcon: 'copter',
        createdAt: new Date().toISOString(),
        timeSpent: 0,
      }
    ];
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('doraemon_pomodoro_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fall back below
      }
    }
    return {
      dorayakiEarned: 15, // start with 15 so they can try unlocking something shortly!
      totalFocusSeconds: 1500,
      completedSessionsCount: 1,
      unlockedGadgets: ['door', 'copter', 'light'], // basic core ones
    };
  });

  const [history, setHistory] = useState<{ id: string; title: string; durationMinutes: number; date: string; gadget: GadgetType }[]>(() => {
    const saved = localStorage.getItem('doraemon_pomodoro_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: 'h-1', title: 'Anywhere Door Calibration Flight', durationMinutes: 25, date: '2026-05-24', gadget: 'door' }
    ];
  });

  const [currentTab, setCurrentTab] = useState<string>('desk');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeDoraemonState, setActiveDoraemonState] = useState<'idle' | 'work' | 'break' | 'copter' | 'celebrate'>('idle');
  const [soundOn, setSoundOn] = useState(true);

  // Translation Konjac State
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);

  // Save states securely
  useEffect(() => {
    localStorage.setItem('doraemon_pomodoro_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('doraemon_pomodoro_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('doraemon_pomodoro_history', JSON.stringify(history));
  }, [history]);

  // Sync general sound settings with service
  useEffect(() => {
    soundService.setSoundEnabled(soundOn);
  }, [soundOn]);

  // Handle task deletion
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
  };

  // Handle adding new task
  const handleAddTask = (title: string, desc: string, gadget: GadgetType) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description: desc || undefined,
      completed: false,
      pomodorosEstimated: 1,
      pomodorosCompleted: 0,
      gadgetIcon: gadget,
      createdAt: new Date().toISOString(),
      timeSpent: 0,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Toggle active completeness status
  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const toCompleted = !t.completed;
          // Award a bonus pancake for checklist clearance
          if (toCompleted) {
            setStats((s) => ({
              ...s,
              dorayakiEarned: s.dorayakiEarned + 5,
            }));
          }
          return { ...t, completed: toCompleted };
        }
        return t;
      })
    );
  };

  // Log manual historic time traveler coordinates
  const handleLogHistory = (title: string, minutes: number, dateString: string, gadget: GadgetType) => {
    const newLog = {
      id: `history-${Date.now()}`,
      title,
      durationMinutes: minutes,
      date: dateString,
      gadget,
    };
    setHistory((prev) => [newLog, ...prev]);
    // Log additional total stats
    setStats((s) => ({
      ...s,
      totalFocusSeconds: s.totalFocusSeconds + minutes * 60,
      // Manual entries don't count towards raw live Pomodoro streak counts to be fair, but earn 1 dorayaki pancake as fuel!
      dorayakiEarned: s.dorayakiEarned + 1,
    }));
  };

  // Triggered from BambooCopterTimer once a countdown finishes!
  const handleSessionComplete = (mode: TimerMode) => {
    const focusEarned = mode === 'work';
    const durationSeconds = mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
    
    // 1. Update general stats
    setStats((prev) => {
      // Check for bread multiplier (1.5x completion pancakes!)
      const hasBread = prev.unlockedGadgets.includes('bread');
      const baseEarned = focusEarned ? 10 : 3;
      const finalPancakePoints = hasBread ? Math.round(baseEarned * 1.5) : baseEarned;

      return {
        ...prev,
        dorayakiEarned: prev.dorayakiEarned + finalPancakePoints,
        totalFocusSeconds: prev.totalFocusSeconds + (focusEarned ? durationSeconds : 0),
        completedSessionsCount: prev.completedSessionsCount + (focusEarned ? 1 : 0),
      };
    });

    // 2. Log in chronology
    const sessionLabel = mode === 'work' ? 'Focused Study Session' : 'Tea Jam / Relax Break';
    const dateStr = new Date().toISOString().split('T')[0];
    const loggedHistory = {
      id: `history-${Date.now()}`,
      title: selectedTaskId 
        ? `Task focus: ${tasks.find(t => t.id === selectedTaskId)?.title || sessionLabel}`
        : sessionLabel,
      durationMinutes: Math.floor(durationSeconds / 60),
      date: dateStr,
      gadget: (mode === 'work' ? 'copter' : 'door') as GadgetType,
    };
    setHistory((prev) => [loggedHistory, ...prev]);

    // 3. Increment current active task count if assigned
    if (selectedTaskId && focusEarned) {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === selectedTaskId) {
            return {
              ...t,
              pomodorosCompleted: t.pomodorosCompleted + 1,
              timeSpent: t.timeSpent + durationSeconds,
            };
          }
          return t;
        })
      );
    }
  };

  const handleUnlockGadget = (gadgetId: string, cost: number) => {
    setStats((prev) => ({
      ...prev,
      dorayakiEarned: prev.dorayakiEarned - cost,
      unlockedGadgets: [...prev.unlockedGadgets, gadgetId],
    }));
  };

  // Eat a dorayaki pancake gift - deducts 1 point and shows happy celebration
  const handleEatDorayakiGift = () => {
    setActiveDoraemonState('celebrate');
    setStats((prev) => ({
      ...prev,
      dorayakiEarned: Math.max(prev.dorayakiEarned - 1, 0),
    }));
    setTimeout(() => {
      setActiveDoraemonState('idle');
    }, 4500);
  };

  // Cycle Translation Konjac slogan quotes
  const cycleQuote = () => {
    soundService.playClick();
    setActiveQuoteIdx((prev) => (prev + 1) % KONJAC_QUOTES.length);
  };

  // Tabs configured
  const navigationTabs = [
    { id: 'desk', label: 'Study Desk', icon: '📝', color: 'bg-blue-600' },
    { id: 'ledger', label: 'Task Ledger', icon: '▤', color: 'bg-emerald-600' },
    { id: 'pocket', label: '4D Magic Pocket', icon: '🎒', color: 'bg-indigo-600' },
    { id: 'machine', label: 'Time Machine', icon: '🌌', color: 'bg-purple-600' },
  ];

  const currentActiveTaskObj = tasks.find((t) => t.id === selectedTaskId) || null;
  const translationKonjacUnlocked = stats.unlockedGadgets.includes('konjac');

  return (
    <div className="min-h-screen bg-[#F0F8FF] bg-[radial-gradient(#00A0E9_1.5px,transparent_1.5px)] [background-size:24px_24px] flex flex-col font-sans transition-all selection:bg-[#FFEE55] text-black">
      
      {/* Sound toggler / Audio Controller float button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => {
            setSoundOn(!soundOn);
            soundService.playClick();
          }}
          className={`
            px-4 py-3 rounded-2xl shadow-[4px_4px_0px_#000] border-4 border-black font-black text-xs cursor-pointer transition-all flex items-center justify-center uppercase select-none hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000] active:translate-y-[1px]
            ${soundOn 
              ? 'bg-[#00A0E9] text-white' 
              : 'bg-stone-200 text-stone-500'
            }
          `}
          title={soundOn ? 'Silence Gadget Sound FX' : 'Enable Magic Sound FX'}
        >
          {soundOn ? '🔊 Audio ON' : '🔇 Muted'}
        </button>
      </div>

      {/* Main Navigation Row styled around the Pink Anywhere Door */}
      <AnywhereDoorNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        tabs={navigationTabs}
      />

      {/* Primary content bento spacing */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start relative">
        
        {/* LEFT COLUMN: INTERACTIVE COMPANION & GADGET INSPIRATIONS */}
        <div className="md:col-span-1 lg:col-span-1 flex flex-col gap-6 sticky top-8 z-10">
          
          {/* Real-time Dynamic Doraemon face / cartoon SVG companion */}
          <DoraemonVisual
            state={activeDoraemonState}
            showDorayaki={activeDoraemonState === 'celebrate'}
          />

          {/* Translation Konjac Quote Box - unlocked with 20 pancakes! */}
          {translationKonjacUnlocked ? (
            <div 
              onClick={cycleQuote}
              className="bg-stone-50 hover:bg-stone-100/80 border-4 border-black rounded-[24px] p-5 cursor-pointer shadow-[6px_6px_0px_#00A0E9] hover:translate-y-[-1px] hover:shadow-[7px_7px_0px_#00A0E9] transition-all relative text-black"
              title="Click jelly to cycle inspirational quote!"
            >
              <div className="absolute -top-3 right-4 bg-[#EE1C23] border-3 border-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider leading-none shadow-[2px_2px_0px_#000]">
                🍮 Translation Konjac
              </div>
              <h4 className="text-[9px] font-black tracking-widest text-[#00A0E9] block mt-2 mb-2 uppercase">
                22nd Century Dialect Transcript
              </h4>
              <p className="font-sans font-black text-black leading-snug text-sm">
                "{KONJAC_QUOTES[activeQuoteIdx].japanese}"
              </p>
              <div className="my-2 border-t-2 border-dashed border-stone-300" />
              <p className="text-xs text-stone-700 font-extrabold italic">
                "{KONJAC_QUOTES[activeQuoteIdx].english}"
              </p>
              <span className="text-[9px] font-black text-stone-500 mt-2.5 block text-right uppercase">
                - {KONJAC_QUOTES[activeQuoteIdx].character} (Click jelly to cycle!)
              </span>
            </div>
          ) : (
            <div className="p-5 rounded-[24px] bg-stone-100 border-4 border-black border-dashed text-center shadow-[4px_4px_0px_#000] relative">
              <span className="text-3xl">🍮</span>
              <h5 className="text-xs font-black text-black uppercase tracking-wider mt-2">
                Confer with Slogans
              </h5>
              <p className="text-[10px] text-stone-600 font-bold leading-relaxed px-1 mt-1.5 uppercase">
                Unlock the <strong>Translation Konjac</strong> inside the 4D Pocket to hear motivational slogans from Doraemon!
              </p>
            </div>
          )}

          {/* Quick instructions panel */}
          <div className="p-5 bg-white rounded-[24px] border-4 border-black text-[11px] text-black shadow-[6px_6px_0px_#FFD700] uppercase font-bold tracking-wide leading-relaxed">
            <span className="font-black text-xs block mb-1">✨ Doraemon Flight Guide:</span>
            <ul className="list-disc pl-4 space-y-1.5 text-stone-700 text-[10px]">
              <li>Manage focus targets in the <strong className="text-black">Task Ledger</strong> page</li>
              <li>Press the <strong className="text-black">Launch Take-Copter</strong> button to fly</li>
              <li>Complete segments to bake <strong className="text-black">Dorayaki pancakes</strong>!</li>
              <li>Trade pancakes in the <strong className="text-black">4D Pocket</strong> to buy secret gadgets</li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED TABS MOUNT PANEL */}
        <div className="md:col-span-2 lg:col-span-3 h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentTab === 'desk' && (
                <BambooCopterTimer
                  currentTask={currentActiveTaskObj}
                  onSessionComplete={handleSessionComplete}
                  activeDoraemonState={activeDoraemonState}
                  setActiveDoraemonState={setActiveDoraemonState}
                  userUnlockedGadgets={stats.unlockedGadgets}
                />
              )}

              {currentTab === 'ledger' && (
                <TaskList
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTask={handleDeleteTask}
                  selectedTaskId={selectedTaskId}
                  onSelectTask={setSelectedTaskId}
                />
              )}

              {currentTab === 'pocket' && (
                <GadgetStore
                  stats={stats}
                  onUnlockGadget={handleUnlockGadget}
                  onEatDorayakiGift={handleEatDorayakiGift}
                />
              )}

              {currentTab === 'machine' && (
                <ManualTimeMachine
                  unlocked={stats.unlockedGadgets.includes('machine')}
                  history={history}
                  onLogHistory={handleLogHistory}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* Humorous humble footer */}
      <footer className="py-8 mt-16 text-center text-xs text-black font-black uppercase tracking-wider border-t-6 border-black bg-white shadow-[0px_-8px_0px_rgba(0,0,0,0.04)]">
        <p>© 2112 Sewashi-kun future laboratory. All rights reserved.</p>
        <p className="mt-1.5 text-[10px] text-stone-500">Crafted with iconic blue, white, and red collars for peak dynamic flight scores.</p>
      </footer>

    </div>
  );
}
