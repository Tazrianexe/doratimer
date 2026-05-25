import React, { useState } from 'react';
import { Task, GadgetType } from '../types';
import { soundService } from './SoundService';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (title: string, desc: string, gadget: GadgetType) => void;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
}

export default function TaskList({
  tasks,
  onAddTask,
  onToggleComplete,
  onDeleteTask,
  selectedTaskId,
  onSelectTask,
}: TaskListProps) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [activeGadget, setActiveGadget] = useState<GadgetType>('door');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const gadgetOptions: { type: GadgetType; label: string; icon: string; bg: string; border: string; text: string }[] = [
    { type: 'door', label: 'Anywhere Door', icon: '🚪', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600' },
    { type: 'copter', label: 'Take-Copter', icon: '🚁', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600' },
    { type: 'bread', label: 'Memorization Bread', icon: '🍞', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    { type: 'konjac', label: 'Translation Konjac', icon: '🍮', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' },
    { type: 'pocket', label: '4D Magic Pocket', icon: '🎒', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
    { type: 'machine', label: 'Time Machine', icon: '🌌', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
    { type: 'cloth', label: 'Furoshiki Time Cloth', icon: '🧣', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundService.playGadgetReveal();
    onAddTask(title, desc, activeGadget);
    setTitle('');
    setDesc('');
    setIsFormOpen(false);
  };

  const handleToggle = (id: string, isCompleted: boolean) => {
    if (!isCompleted) {
      soundService.playEatDorayaki();
    } else {
      soundService.playClick();
    }
    onToggleComplete(id);
  };

  const handleTaskSelect = (id: string) => {
    soundService.playClick();
    onSelectTask(id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundService.playClick();
    onDeleteTask(id);
  };

  return (
    <div className="bg-white rounded-[40px] border-6 border-black p-8 shadow-[12px_12px_0px_#EE1C23] text-black">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b-4 border-black">
        <div>
          <h2 className="text-xl font-black text-black tracking-wider flex items-center gap-1.5 uppercase">
            <span>🎒</span> Task Ledger Pocket
          </h2>
          <p className="text-xs text-stone-500 font-extrabold uppercase mt-0.5">Assemble 4D Gadget Checklists</p>
        </div>

        <button
          onClick={() => {
            soundService.playClick();
            setIsFormOpen(!isFormOpen);
          }}
          className="px-4 py-2.5 bg-[#00A0E9] hover:bg-sky-500 text-white text-xs font-black rounded-[14px] border-4 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000] active:translate-y-[1px] active:shadow-[2px_2px_0px_#000] transition-all cursor-pointer select-none uppercase"
        >
          {isFormOpen ? '✖ Close Pocket' : '➕ Pull Out Task Gadget'}
        </button>
      </div>

      {/* Task Creation Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-[24px] bg-[#E6F4FC] border-4 border-black shadow-[4px_4px_0px_#000] animate-fade-in">
          <div className="mb-4">
            <label className="block text-xs font-black text-black tracking-wider uppercase mb-1.5">Task Title / Slogan</label>
            <input
              type="text"
              required
              placeholder="e.g., Memorize formulas, Code Anywhere portal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-white border-3 border-black rounded-xl focus:outline-none focus:border-[#00A0E9] font-extrabold text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-black text-black tracking-wider uppercase mb-1.5">Task Memo / Subtext</label>
            <input
              type="text"
              placeholder="Optional brief memo"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-white border-3 border-black rounded-xl focus:outline-none focus:border-[#00A0E9] font-extrabold text-black"
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-black text-black tracking-wider uppercase mb-2.5">Equip Doraemon Gadget Tag</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {gadgetOptions.map((g) => {
                const isSelected = activeGadget === g.type;
                return (
                  <button
                    key={g.type}
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      setActiveGadget(g.type);
                    }}
                    className={`
                      p-2.5 flex flex-col items-center justify-center rounded-xl border-2 border-black text-center transition-all duration-150 cursor-pointer select-none
                      ${isSelected 
                        ? 'bg-[#FFD700] font-black text-black shadow-[3px_3px_0px_#000] translate-y-[-1px]' 
                        : 'bg-white hover:bg-stone-50 text-stone-700 hover:shadow-[1px_1px_0px_#000]'
                      }
                    `}
                  >
                    <span className="text-2xl">{g.icon}</span>
                    <span className="text-[10px] tracking-tight leading-normal font-black mt-1 uppercase">{g.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                setIsFormOpen(false);
              }}
              className="px-3 py-1.5 text-xs font-black text-stone-600 hover:text-black hover:underline cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 w-auto bg-[#FFD700] hover:bg-yellow-400 text-black font-black border-4 border-black rounded-xl shadow-[2px_2px_0px_#000] active:translate-y-[1px] active:shadow-none hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] uppercase text-xs tracking-wider cursor-pointer"
            >
              Confirm & Equip!
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="flex flex-col gap-4">
        {tasks.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center bg-stone-50 rounded-[20px] border-4 border-dashed border-stone-200 p-8">
            <span className="text-4xl animate-bounce">👝</span>
            <p className="text-sm font-black text-stone-400 mt-2 uppercase tracking-wide">No active pocket tasks. Craft one above!</p>
          </div>
        ) : (
          tasks.map((task) => {
            const isSelected = selectedTaskId === task.id;
            const option = gadgetOptions.find((o) => o.type === task.gadgetIcon) || gadgetOptions[0];

            return (
              <div
                key={task.id}
                onClick={() => handleTaskSelect(task.id)}
                className={`
                  p-4 rounded-[20px] border-4 border-black flex items-center justify-between gap-4 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? 'bg-[#E6F4FC] shadow-[6px_6px_0px_#000] translate-y-[-2px]' 
                    : 'bg-white shadow-[4px_4px_0px_#000] hover:bg-stone-50 hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Task Completion Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(task.id, task.completed);
                    }}
                    className={`
                      w-7 h-7 rounded-lg border-3 border-black flex items-center justify-center shrink-0 transition-all font-black text-xs cursor-pointer select-none
                      ${task.completed 
                        ? 'bg-[#EE1C23] text-white' 
                        : 'bg-white hover:bg-yellow-100 text-black'
                      }
                    `}
                  >
                    {task.completed ? '✓' : ''}
                  </button>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Miniature gadget badge */}
                      <span className="text-xl select-none" title={option.label}>
                        {option.icon}
                      </span>
                      <h4 className={`text-sm font-black uppercase tracking-wide ${task.completed ? 'line-through text-stone-400' : 'text-black'}`}>
                        {task.title}
                      </h4>
                    </div>
                    {task.description && (
                      <p className="text-xs text-stone-500 font-medium max-w-[180px] sm:max-w-[320px] mt-1 italic pl-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Session counter badge */}
                  <span className="text-[10px] font-black tracking-wider text-black px-2.5 py-1 bg-[#FFD700] rounded-full border-2 border-black shrink-0 uppercase leading-none">
                    ⏱ {task.pomodorosCompleted} completed
                  </span>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(e, task.id)}
                    className="p-1.5 text-stone-400 hover:text-[#EE1C23] hover:bg-[#EE1C23]/10 border-2 border-transparent hover:border-black rounded-lg transition-all cursor-pointer select-none"
                    title="Dump gadget back to sub-space"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedTaskId && (
        <div className="mt-6 p-4 bg-[#FFD700]/10 rounded-[16px] border-4 border-black flex items-center justify-between gap-3 relative overflow-hidden">
          <span className="text-xs font-black text-black uppercase tracking-wider">📌 Active task locked into 4D coordinate deck.</span>
          <button
            onClick={() => {
              soundService.playClick();
              onSelectTask('');
            }}
            className="text-xs font-black text-[#EE1C23] underline hover:no-underline cursor-pointer uppercase"
          >
            Clear Deck
          </button>
        </div>
      )}
    </div>
  );
}
