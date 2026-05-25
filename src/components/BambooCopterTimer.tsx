import React, { useEffect, useState, useRef } from 'react';
import { TimerMode, TimerConfig, Task } from '../types';
import { soundService } from './SoundService';

interface BambooCopterTimerProps {
  currentTask: Task | null;
  onSessionComplete: (mode: TimerMode) => void;
  activeDoraemonState: 'idle' | 'work' | 'break' | 'copter' | 'celebrate';
  setActiveDoraemonState: (state: 'idle' | 'work' | 'break' | 'copter' | 'celebrate') => void;
  userUnlockedGadgets: string[];
}

export default function BambooCopterTimer({
  currentTask,
  onSessionComplete,
  activeDoraemonState,
  setActiveDoraemonState,
  userUnlockedGadgets,
}: BambooCopterTimerProps) {
  // Config state
  const [config, setConfig] = useState<TimerConfig>({
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
  });

  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [totalDuration, setTotalDuration] = useState<number>(25 * 60);

  // Big Light / Small Light sizing states
  const [timerScale, setTimerScale] = useState<'normal' | 'large' | 'small'>('normal');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync timer duration if config or mode changes
  useEffect(() => {
    let minutes = config.workMinutes;
    if (mode === 'shortBreak') minutes = config.shortBreakMinutes;
    if (mode === 'longBreak') minutes = config.longBreakMinutes;

    setTimeLeft(minutes * 60);
    setTotalDuration(minutes * 60);
    setIsRunning(false);
  }, [mode, config]);

  // Handle countdown tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            soundService.playTimerComplete();
            
            // Trigger completion upwards
            onSessionComplete(mode);
            
            setActiveDoraemonState('celebrate');
            setTimeout(() => {
              setActiveDoraemonState('idle');
            }, 6000);
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, onSessionComplete, setActiveDoraemonState]);

  // Start with Bamboo Copter start sound
  const handleToggleStart = () => {
    soundService.playClick();
    if (isRunning) {
      soundService.playCopterStop();
      setIsRunning(false);
      setActiveDoraemonState(mode === 'work' ? 'work' : 'break');
    } else {
      soundService.playCopterStart();
      setIsRunning(true);
      setActiveDoraemonState('copter');
    }
  };

  const handleReset = () => {
    soundService.playClick();
    soundService.playCopterStop();
    setIsRunning(false);
    
    let minutes = config.workMinutes;
    if (mode === 'shortBreak') minutes = config.shortBreakMinutes;
    if (mode === 'longBreak') minutes = config.longBreakMinutes;
    
    setTimeLeft(minutes * 60);
    setActiveDoraemonState('idle');
  };

  const switchMode = (newMode: TimerMode) => {
    soundService.playClick();
    setMode(newMode);
    setActiveDoraemonState(newMode === 'work' ? 'work' : 'break');
  };

  // Big light / Small Light triggers
  const useBigLight = () => {
    soundService.playGadgetReveal();
    setTimerScale('large');
    // Add additional working/scale benefits or increase/decrease durations dynamically
    setConfig((prev) => ({
      ...prev,
      workMinutes: Math.min(prev.workMinutes + 5, 60),
    }));
  };

  const useSmallLight = () => {
    soundService.playGadgetReveal();
    setTimerScale('small');
    setConfig((prev) => ({
      ...prev,
      workMinutes: Math.max(prev.workMinutes - 5, 5),
    }));
  };

  const resetLights = () => {
    soundService.playClick();
    setTimerScale('normal');
    setConfig({
      workMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
    });
  };

  // Compute format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Compute progress percent for visual rendering
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;
  const radius = 85;
  const strokeDashoffset = 2 * Math.PI * radius * (1 - progressPercent / 100);

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-[40px] border-6 border-black shadow-[12px_12px_0px_#00A0E9] text-black transition-all duration-300 relative select-none">
      
      {/* Session Tab buttons inside the clock box */}
      <div className="flex bg-slate-100 p-1.5 rounded-[20px] gap-2 border-4 border-black max-w-sm w-full mb-6">
        <button
          onClick={() => switchMode('work')}
          className={`flex-1 py-2 px-3 text-xs md:text-sm font-black rounded-[12px] transition-all border-2 border-transparent select-none cursor-pointer uppercase tracking-tight ${
            mode === 'work'
              ? 'bg-[#00A0E9] text-white border-black shadow-[2px_2px_0px_#000]'
              : 'text-stone-700 hover:text-black hover:bg-white/50'
          }`}
        >
          Work Focus
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`flex-1 py-2 px-3 text-xs md:text-sm font-black rounded-[12px] transition-all border-2 border-transparent select-none cursor-pointer uppercase tracking-tight ${
            mode === 'shortBreak'
              ? 'bg-[#EE1C23] text-white border-black shadow-[2px_2px_0px_#000]'
              : 'text-stone-700 hover:text-black hover:bg-white/50'
          }`}
        >
          Quick Jam
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`flex-1 py-2 px-3 text-xs md:text-sm font-black rounded-[12px] transition-all border-2 border-transparent select-none cursor-pointer uppercase tracking-tight ${
            mode === 'longBreak'
              ? 'bg-[#FFD700] text-black border-black shadow-[2px_2px_0px_#000]'
              : 'text-stone-700 hover:text-black hover:bg-white/50'
          }`}
        >
          Grand Break
        </button>
      </div>

      {/* Main Timer Display & Circle */}
      <div
        className={`relative flex items-center justify-center transition-all duration-500 ${
          timerScale === 'large' ? 'scale-110 md:scale-115 my-6' : timerScale === 'small' ? 'scale-85 my-[-10px]' : ''
        }`}
      >
        {/* SVG Progress Circle with Cartoon Black Outlines */}
        <svg className="w-56 h-56 md:w-64 md:h-64 transform -rotate-90">
          <circle
            cx="112"
            cy="112"
            r={radius}
            className="md:cx-128 md:cy-128 stroke-stone-100 fill-white"
            strokeWidth="14"
            style={{ cx: '50%', cy: '50%' }}
          />
          <circle
            cx="112"
            cy="112"
            r={radius}
            className={`
              md:cx-128 md:cy-128 fill-transparent transition-all duration-500 stroke-[14] stroke-linecap-round
              ${mode === 'work' ? 'stroke-[#00A0E9]' : mode === 'shortBreak' ? 'stroke-[#EE1C23]' : 'stroke-[#FFD700]'}
            `}
            style={{
              cx: '50%',
              cy: '50%',
              strokeDasharray: 2 * Math.PI * radius,
              strokeDashoffset: strokeDashoffset,
            }}
          />
          {/* External visual outline loop */}
          <circle
            cx="112"
            cy="112"
            r={radius + 7}
            className="md:cx-128 md:cy-128 stroke-black fill-transparent"
            strokeWidth="3"
            style={{ cx: '50%', cy: '50%' }}
          />
          <circle
            cx="112"
            cy="112"
            r={radius - 7}
            className="md:cx-128 md:cy-128 stroke-black fill-transparent"
            strokeWidth="3"
            style={{ cx: '50%', cy: '50%' }}
          />
        </svg>

        {/* Floating Bell marker on top node */}
        <div className="absolute top-0 select-none text-2xl animate-bounce">
          🔔
        </div>

        {/* Central numbers */}
        <div className="absolute flex flex-col items-center">
          <div className="font-mono text-4xl md:text-5xl font-black tracking-widest text-black tabular-nums">
            {formatTime(timeLeft)}
          </div>
          <span className="text-[10px] uppercase font-black tracking-widest text-[#00A0E9] mt-2 bg-yellow-100 px-2 py-0.5 rounded-full border border-black leading-none">
            {mode === 'work' ? 'FOCUSED STREAK' : 'TEA REFRESHMENT'}
          </span>
        </div>
      </div>

      {/* Target Active Task Banner */}
      <div className="w-full max-w-sm my-6 p-4 rounded-[20px] bg-[#E6F4FC] border-4 border-black shadow-[4px_4px_0px_#000] flex flex-col items-center text-center relative">
        <span className="text-[9px] font-black tracking-wider text-[#00A0E9] uppercase bg-white px-2 py-0.5 rounded-full border border-black leading-none">
          Active Flight Orbit Target
        </span>
        <h3 className="text-base font-black text-black leading-tight mt-2.5">
          {currentTask ? `🎯 ${currentTask.title}` : '🎒 Pull a task out of your pocket!'}
        </h3>
        {currentTask?.description && (
          <p className="text-xs text-stone-600 mt-2 max-w-xs bg-white/80 border border-stone-200 p-2 rounded-lg font-medium">{currentTask.description}</p>
        )}
      </div>

      {/* Core Action Trigger - Bamboo Copter Play/Pause button */}
      <div className="flex flex-col items-center w-full max-w-sm gap-4">
        <button
          onClick={handleToggleStart}
          className={`
            w-full py-4 px-6 font-extrabold rounded-[20px] text-lg flex items-center justify-center gap-3 border-4 border-black 
            transition-all cursor-pointer select-none uppercase tracking-wider
            ${
              isRunning
                ? 'bg-[#EE1C23] text-white shadow-[6px_6px_0px_#000] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000]'
                : 'bg-[#FFD700] text-black shadow-[6px_6px_0px_#000] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000]'
            }
          `}
        >
          {/* Animated Bamboo Copter Spinner in Start button! */}
          <span className={`text-2xl inline-block ${isRunning ? 'animate-spin' : ''}`} style={{ animationDuration: '0.1s' }}>
            🚁
          </span>
          <span className="font-sans font-black">
            {isRunning ? 'Land Take-Copter' : 'Launch Take-Copter!'}
          </span>
        </button>

        <div className="flex w-full gap-3">
          <button
            onClick={handleReset}
            className="w-full py-2.5 bg-white hover:bg-slate-50 text-black border-4 border-black rounded-[16px] font-black anonymity-none text-xs uppercase tracking-widest shadow-[4px_4px_0px_#000] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000] active:translate-y-[1px] active:shadow-[2px_2px_0px_#000] cursor-pointer select-none"
          >
            Reset Time Log
          </button>
        </div>
      </div>

      {/* Mini-pocket with interactive big light / small light (unlocked easily for fun modification!) */}
      <div className="mt-6 pt-5 border-t-4 border-dashed border-black w-full flex flex-col items-center">
        <h4 className="text-[10px] font-black tracking-widest text-[#00A0E9] uppercase flex items-center gap-1.5 mb-2.5 bg-yellow-100 border border-black px-2.5 py-1 rounded-full">
          <span>🔦</span> ACTIVE GADGET LENSES (Big/Small Light)
        </h4>
        <div className="flex items-center gap-2 bg-[#E6F4FC] p-2 rounded-[20px] border-4 border-black">
          <button
            onClick={useSmallLight}
            className="px-4 py-2 bg-white hover:bg-[#EE1C23] hover:text-white text-black border-2 border-black shadow-[2px_2px_0px_#000] rounded-xl text-xs font-black flex items-center gap-1 transition cursor-pointer"
            title="Shrink timer size and work minutes"
          >
            🔦 Small
          </button>
          {timerScale !== 'normal' && (
            <button
              onClick={resetLights}
              className="px-2 py-1 text-xs text-black font-extrabold hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
          <button
            onClick={useBigLight}
            className="px-4 py-2 bg-white hover:bg-[#FFE135] text-black border-2 border-black shadow-[2px_2px_0px_#000] rounded-xl text-xs font-black flex items-center gap-1 transition cursor-pointer"
            title="Enlarge timer size and work minutes"
          >
            🔦 Big
          </button>
        </div>
        <p className="text-[9px] text-stone-500 font-bold text-center mt-3 max-w-[280px]">
          Small Light reduces session focus by 5m. Big Light enlarges session focus by 5m!
        </p>
      </div>

    </div>
  );
}
