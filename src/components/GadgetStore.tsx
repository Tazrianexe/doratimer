import React, { useState } from 'react';
import { Gadget, UserStats } from '../types';
import { soundService } from './SoundService';

interface GadgetStoreProps {
  stats: UserStats;
  onUnlockGadget: (gadgetId: string, cost: number) => void;
  onEatDorayakiGift: () => void;
}

export default function GadgetStore({ stats, onUnlockGadget, onEatDorayakiGift }: GadgetStoreProps) {
  const [selectedGadget, setSelectedGadget] = useState<Gadget | null>(null);

  const gadgetList: Gadget[] = [
    {
      id: 'door',
      name: 'Anywhere Door',
      japaneseName: 'どこでもドア',
      description: 'Teleports you instantly between different menus. Already unlocked!',
      cost: 0,
      type: 'door',
      flavorText: 'An iconic pink sliding door. Just think of the destination, slide open, and walk into another world!',
    },
    {
      id: 'copter',
      name: 'Bamboo Copter',
      japaneseName: 'タケコプター',
      description: 'Propels you into focus mode at high flight speeds. Already unlocked!',
      cost: 0,
      type: 'copter',
      flavorText: 'Place this little yellow propeller on your head, and fly around the sky at up to 80 km/h!',
    },
    {
      id: 'light',
      name: 'Big/Small Light',
      japaneseName: 'ビッグライト / スモールライト',
      description: 'Enlarges or shrinks session items and task focus times. Already unlocked!',
      cost: 0,
      type: 'light',
      flavorText: 'Two magical flashlights. One makes objects and durations expand, the other shrinks them down!',
    },
    {
      id: 'bread',
      name: 'Memorization Bread',
      japaneseName: 'アンキパン',
      description: 'Unlocks study tips and gives 1.5x completed session points! Cost: 10 Dorayakis.',
      cost: 10,
      type: 'bread',
      flavorText: 'Press this toast onto any notebook page, eat it, and memorize the content perfectly! Just do not go to the bathroom before the exam!',
    },
    {
      id: 'konjac',
      name: 'Translation Konjac',
      japaneseName: '翻訳こんにゃく',
      description: 'Unlocks native Japanese inspirational study quotes. Cost: 20 Dorayakis.',
      cost: 20,
      type: 'konjac',
      flavorText: 'Tastes like rubbery jelly, but allows you to understand, read, and master any language in the universe!',
    },
    {
      id: 'machine',
      name: 'Time Machine',
      japaneseName: 'タイムマシン',
      description: 'Unlocks the historic Time Travel manual logging desk tab! Cost: 30 Dorayakis.',
      cost: 30,
      type: 'machine',
      flavorText: 'Parked right inside Nobitas study desk drawer. Allows you to travel back and forward across historical space-time.',
    },
  ];

  const handleUnlock = (gadget: Gadget) => {
    const alreadyUnlocked = stats.unlockedGadgets.includes(gadget.id);
    if (alreadyUnlocked) {
      soundService.playClick();
      setSelectedGadget(gadget);
      return;
    }

    if (stats.dorayakiEarned >= gadget.cost) {
      soundService.playGadgetReveal();
      onUnlockGadget(gadget.id, gadget.cost);
      setSelectedGadget(gadget);
    } else {
      soundService.playCopterStop(); // buzz warning
      alert(`Oops! You need ${gadget.cost - stats.dorayakiEarned} more Dorayakis for this gadget. Keep focusing!`);
    }
  };

  const eatPancake = () => {
    if (stats.dorayakiEarned > 0) {
      soundService.playEatDorayaki();
      onEatDorayakiGift();
    } else {
      soundService.playClick();
    }
  };

  const formatHours = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return mins;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 4D Pocket Summary Display Card */}
      <div className="bg-white text-black rounded-[32px] p-6 shadow-[10px_10px_0px_#00A0E9] border-6 border-black flex flex-col justify-between shrink-0 h-fit">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">🎒</span>
            <h2 className="text-xl font-black uppercase tracking-wider text-black">Nobita's 4D Pocket</h2>
          </div>

          {/* Interactive Dorayaki clicker! */}
          <div className="flex flex-col items-center bg-[#E6F4FC] rounded-[24px] p-5 border-4 border-black select-none shadow-[4px_4px_0px_#000]">
            <span className="text-xs uppercase font-black tracking-widest text-[#00A0E9]">Dorayaki Balance</span>
            
            <div 
              onClick={eatPancake}
              className="relative my-4 w-28 h-20 cursor-pointer active:scale-95 hover:scale-105 transition-all flex items-center justify-center"
              title="Click to eat a Dorayaki!"
            >
              <div className="absolute top-0 w-24 h-14 bg-amber-700 rounded-full border-3 border-black" />
              <div className="absolute top-[14px] w-22 h-3.5 bg-yellow-100 border-t-3 border-b-3 border-black z-10" />
              <div className="absolute bottom-0 w-24 h-14 bg-[#B45309] rounded-full border-3 border-black" />
              <span className="absolute z-10 text-black font-black text-[9px] uppercase tracking-wider bg-white border-2 border-black rounded-lg px-1.5 py-0.5 leading-none shadow-[1px_1px_0px_#000]">
                MUNCH!
              </span>
            </div>

            <p className="text-2xl font-black text-black tracking-wider uppercase">
              {stats.dorayakiEarned} Baked
            </p>
            <p className="text-[9px] text-stone-500 font-bold mt-2 text-center uppercase tracking-tight">Click pancake for sound effect!</p>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t-4 border-dashed border-black">
          <h3 className="text-xs font-black tracking-widest text-black uppercase mb-3">Pocket Records</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border-3 border-black shadow-[2px_2px_0px_#000]">
              <p className="text-stone-500 font-black uppercase text-[9px] leading-tight">Focus Minutes</p>
              <p className="text-base font-black text-black mt-1">{formatHours(stats.totalFocusSeconds)} m</p>
            </div>
            <div className="bg-white p-3 rounded-xl border-3 border-black shadow-[2px_2px_0px_#000]">
              <p className="text-stone-500 font-black uppercase text-[9px] leading-tight">Slices Done</p>
              <p className="text-base font-black text-black mt-1">{stats.completedSessionsCount} sessions</p>
            </div>
            <div className="bg-white p-3 rounded-xl border-3 border-black shadow-[2px_2px_0px_#000] col-span-2">
              <p className="text-stone-500 font-black uppercase text-[9px] leading-tight font-extrabold">Unlocked Gadgets</p>
              <p className="text-xs font-black text-[#00A0E9] mt-1">
                {stats.unlockedGadgets.length} / {gadgetList.length} items
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gadget Inventory/Grid */}
      <div className="lg:col-span-2 bg-white rounded-[40px] border-6 border-black p-8 shadow-[12px_12px_0px_#EE1C23]">
        <h2 className="text-xl font-black text-black tracking-wider flex items-center gap-2 mb-1 uppercase">
          <span>🍪</span> Gadget Laboratory
        </h2>
        <p className="text-xs text-stone-500 font-black uppercase mt-0.5 mb-6">Trade focus milestones for legendary utilities</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gadgetList.map((gadget) => {
            const isUnlocked = stats.unlockedGadgets.includes(gadget.id);
            const canAfford = stats.dorayakiEarned >= gadget.cost;

            return (
              <div
                key={gadget.id}
                onClick={() => handleUnlock(gadget)}
                className={`
                  p-5 rounded-[22px] border-4 border-black cursor-pointer transition-all duration-200 flex flex-col justify-between text-left relative overflow-hidden
                  ${isUnlocked 
                    ? 'bg-[#E6F4FC] shadow-[4px_4px_0px_#000] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000]' 
                    : canAfford 
                      ? 'bg-yellow-50 hover:bg-yellow-100/40 shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000]' 
                      : 'bg-stone-100 opacity-75 shadow-[2px_2px_0px_#000]'
                  }
                `}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2.5">
                    <div>
                      <h4 className="font-black text-sm text-black leading-tight uppercase tracking-wide">{gadget.name}</h4>
                      <p className="text-[10px] text-stone-500 font-mono italic">{gadget.japaneseName}</p>
                    </div>
                    {/* Badge */}
                    <span className="text-2xl shrink-0">
                      {gadget.type === 'door' && '🚪'}
                      {gadget.type === 'copter' && '🚁'}
                      {gadget.type === 'light' && '🔦'}
                      {gadget.type === 'bread' && '🍞'}
                      {gadget.type === 'konjac' && '🍮'}
                      {gadget.type === 'machine' && '🌌'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-normal font-medium">{gadget.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-stone-200 flex items-center justify-between text-xs font-black">
                  {isUnlocked ? (
                    <span className="text-emerald-700 flex items-center gap-1 uppercase tracking-wide">✓ OWNED</span>
                  ) : (
                    <span className={canAfford ? 'text-[#00A0E9]' : 'text-stone-400'}>
                      🥞 COST: {gadget.cost} pancakes
                    </span>
                  )}
                  
                  <button
                    type="button"
                    className={`
                      px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border-3 border-black
                      ${isUnlocked 
                        ? 'bg-[#00A0E9] text-white shadow-[2px_2px_0px_#000] hover:translate-y-[-1px]' 
                        : canAfford 
                          ? 'bg-[#FFD700] text-black shadow-[2px_2px_0px_#000] hover:translate-y-[-1px]' 
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {isUnlocked ? 'Inspect' : 'Trade'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gadget Inspector details drawer/modal overlay if selected */}
      {selectedGadget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[32px] border-6 border-black p-8 max-w-sm w-full shadow-[10px_10px_0px_#000] relative text-center">
            <button
              onClick={() => {
                soundService.playClick();
                setSelectedGadget(null);
              }}
              className="absolute top-4 right-4 text-black hover:text-[#EE1C23] font-black text-xl border-3 border-black rounded-lg w-8 h-8 flex items-center justify-center bg-white cursor-pointer select-none"
            >
              ✕
            </button>

            <div className="text-5xl my-6">
              {selectedGadget.type === 'door' && '🚪'}
              {selectedGadget.type === 'copter' && '🚁'}
              {selectedGadget.type === 'light' && '🔦'}
              {selectedGadget.type === 'bread' && '🍞'}
              {selectedGadget.type === 'konjac' && '🍮'}
              {selectedGadget.type === 'machine' && '🌌'}
            </div>

            <h3 className="text-xl font-black text-black uppercase tracking-wide">{selectedGadget.name}</h3>
            <p className="text-xs text-stone-500 font-mono mb-4">{selectedGadget.japaneseName}</p>

            <div className="bg-[#E6F4FC] rounded-[20px] p-5 border-4 border-black text-left text-xs text-black leading-relaxed font-black uppercase tracking-wide my-6 italic">
              " {selectedGadget.flavorText} "
            </div>

            <button
              onClick={() => {
                soundService.playClick();
                setSelectedGadget(null);
              }}
              className="w-full py-3 bg-[#EE1C23] hover:bg-red-600 text-white text-xs uppercase font-black rounded-xl border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-[1px] active:shadow-none block transition-all cursor-pointer"
            >
              Pack Back into Pocket
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
