import React, { useState } from 'react';
import { Task, GadgetType } from '../types';
import { soundService } from './SoundService';

interface ManualTimeMachineProps {
  unlocked: boolean;
  history: { id: string; title: string; durationMinutes: number; date: string; gadget: GadgetType }[];
  onLogHistory: (title: string, minutes: number, dateString: string, gadget: GadgetType) => void;
}

export default function ManualTimeMachine({ unlocked, history, onLogHistory }: ManualTimeMachineProps) {
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState(25);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [gadget, setGadget] = useState<GadgetType>('machine');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || minutes <= 0) return;

    soundService.playGadgetReveal();
    onLogHistory(title, minutes, date, gadget);
    setTitle('');
    setMinutes(25);
  };

  return (
    <div className="bg-white rounded-[40px] border-6 border-black p-8 shadow-[12px_12px_0px_#7c3aed] text-black">
      <div className="flex items-center gap-3 pb-4 border-b-4 border-black mb-6">
        <span className="text-4xl select-none">🌌</span>
        <div>
          <h2 className="text-xl font-black text-black tracking-wider uppercase flex items-center gap-2">
            Time Machine Console 
          </h2>
          <p className="text-xs text-stone-500 font-extrabold uppercase mt-0.5">Rewrite timeline coordinates inside Nobita's Desk Drawer</p>
        </div>
      </div>

      {!unlocked ? (
        <div className="bg-[#E6F4FC] rounded-[24px] p-8 border-4 border-black text-center flex flex-col items-center shadow-[6px_6px_0px_#000]">
          <span className="text-5xl mb-3 animate-pulse">🔒</span>
          <h3 className="text-base font-black text-black uppercase tracking-wide">Space-Time Nav Deck Locked</h3>
          <p className="text-xs text-stone-600 mt-2 max-w-sm mb-6 font-semibold">
            Earn 30 Dorayaki pancakes dynamically from active Pomodoro flights and buy the <strong>Time Machine</strong> inside the 4D Pocket to warp manual historical logs!
          </p>
          <div className="p-4 bg-white rounded-xl border-3 border-black shadow-[3px_3px_0px_#000] text-left text-xs text-black leading-relaxed max-w-sm font-bold uppercase tracking-wider bg-dashed">
            <p><strong>✨ Time Travel Physics:</strong> Allows Nobita to jump back to earlier calendar dates to log offline learning and earn pancakes safely!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Manual Entry Form - Timeline changer */}
          <div className="p-5 rounded-[24px] bg-[#E6F4FC] border-4 border-black shadow-[4px_4px_0px_#000] h-fit">
            <h3 className="text-xs font-black text-black uppercase tracking-wider mb-4 flex items-center gap-1.5 bg-white border-2 border-black rounded-lg px-2 py-1 w-fit">
              <span>✍️</span> Alter focus history
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[9px] font-black text-black uppercase tracking-widest mb-1.5">Session Slogan</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Offline Reading, Dojo exercise"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border-3 border-black rounded-xl focus:outline-none focus:border-[#00A0E9] font-black text-black uppercase"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-black uppercase tracking-widest mb-1.5">Time spent (Minutes)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="180"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 25)}
                  className="w-full px-3 py-2 text-xs bg-white border-3 border-black rounded-xl focus:outline-none focus:border-[#00A0E9] font-black text-black"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-black uppercase tracking-widest mb-1.5">Target Date coordinates</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border-3 border-black rounded-xl focus:outline-none focus:border-[#00A0E9] font-black text-stone-700 uppercase"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-black uppercase tracking-widest mb-1.5">Equipped Gadget type</label>
                <div className="grid grid-cols-5 gap-1 bg-white p-1 rounded-xl border-3 border-black">
                  {(['door', 'copter', 'bread', 'konjac', 'machine'] as GadgetType[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        soundService.playClick();
                        setGadget(g);
                      }}
                      className={`
                        py-1 text-xs border-2 rounded-lg transition-all font-black cursor-pointer select-none
                        ${gadget === g 
                          ? 'bg-[#FFD700] border-black text-black shadow-[1px_1px_0px_#000]' 
                          : 'bg-white hover:bg-stone-50 text-stone-500 border-transparent'
                        }
                      `}
                    >
                      {g === 'door' && '🚪'}
                      {g === 'copter' && '🚁'}
                      {g === 'bread' && '🍞'}
                      {g === 'konjac' && '🍮'}
                      {g === 'machine' && '🌌'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-[#EE1C23] hover:bg-rose-600 border-4 border-black text-white text-xs font-black rounded-xl shadow-[4px_4px_0px_#000] active:translate-y-[1px] active:shadow-none hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000] transition-all cursor-pointer select-none uppercase tracking-widest"
              >
                🌌 Portal Manual Entry!
              </button>
            </form>
          </div>

          {/* Chronological List of Timeline Events */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-black text-stone-500 uppercase tracking-widest mb-4">Space-Time Log Sequence</h3>
            <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
              {history.length === 0 ? (
                <div className="py-16 text-center flex flex-col items-center justify-center border-4 border-dashed border-stone-200 rounded-[24px] bg-stone-50">
                  <span className="text-4xl mb-2 animate-bounce">⏱</span>
                  <p className="text-xs font-black text-stone-400 uppercase tracking-wider">Nobita's timeline is currently calm.</p>
                </div>
              ) : (
                history.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 bg-white border-4 border-black rounded-[20px] shadow-[4px_4px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:translate-y-[-1px] flex items-center justify-between gap-3 text-xs transition-all duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl select-none shrink-0 bg-stone-100 p-1.5 rounded-lg border border-stone-200">
                        {log.gadget === 'door' && '🚪'}
                        {log.gadget === 'copter' && '🚁'}
                        {log.gadget === 'bread' && '🍞'}
                        {log.gadget === 'konjac' && '🍮'}
                        {log.gadget === 'machine' && '🌌'}
                      </span>
                      <div>
                        <h4 className="font-black text-black uppercase tracking-wide leading-tight">{log.title}</h4>
                        <p className="text-[10px] text-stone-500 mt-1 font-mono font-bold">{log.date}</p>
                      </div>
                    </div>

                    <span className="font-black text-[#00A0E9] uppercase bg-blue-50 border-2 border-[#00A0E9] px-2 py-1 rounded-full shrink-0 text-xs">
                      ⚡ {log.durationMinutes}m
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
