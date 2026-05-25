import React from 'react';
import { soundService } from './SoundService';

interface AnywhereDoorNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string; icon: React.ReactNode; color: string }[];
}

export default function AnywhereDoorNav({ currentTab, onTabChange, tabs }: AnywhereDoorNavProps) {
  const handleNav = (tabId: string) => {
    if (tabId === currentTab) return;
    soundService.playDoorOpen();
    onTabChange(tabId);
  };

  return (
    <div className="w-full bg-white px-6 py-4 border-b-6 border-black text-black relative select-none">
      {/* Dynamic Comic-strip style patterns */}
      <div className="absolute inset-0 bg-radial-gradient from-white to-[#E6F4FC] opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 z-10 relative">
        
        {/* Top brand header with Doraemon logo style */}
        <div className="flex items-center gap-3">
          {/* Collar ring bell decoration */}
          <div className="relative w-14 h-14 rounded-full bg-[#FFD700] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000] shrink-0 group transition-transform hover:rotate-12">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🔔</span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-black rounded" />
            <div className="absolute -bottom-1 w-full h-1 bg-red-600 rounded-full" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-wider text-[#00A0E9] uppercase drop-shadow-sm font-sans" style={{ WebkitTextStroke: '1px black' }}>
              Doraemon <span className="text-[#EE1C23]">Pomodoro</span>
            </h1>
            <p className="text-xs text-stone-500 font-mono tracking-wider font-extrabold uppercase mt-0.5">
              ⏱ 4D Pocket Gadget Ledger
            </p>
          </div>
        </div>

        {/* Anywhere Door Navigation Row */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNav(tab.id)}
                className={`
                  relative px-5 py-2.5 text-xs md:text-sm font-black flex items-center gap-2 rounded-[16px] transition-all duration-200
                  overflow-hidden border-4 border-black cursor-pointer uppercase tracking-wider
                  ${isActive 
                    ? 'bg-[#FF69B4] text-white shadow-[4px_4px_0px_#000] translate-y-[-2px] scale-105' 
                    : 'bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-[#E6F4FC] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000]'
                  }
                `}
              >
                {/* Visual miniature sliding pink door effect as background highlight */}
                {isActive && (
                  <div className="absolute inset-y-0 left-0 bg-rose-600 w-1 rounded-l transition-all" />
                )}
                
                {/* Icon wrapper */}
                <span className="text-lg">{tab.icon}</span>
                
                <span className="font-sans font-black select-none">{tab.label}</span>

                {/* Secret golden handle mark in icon when active */}
                {isActive && (
                  <span className="w-2 h-2 bg-[#FFD700] rounded-full border border-black animate-ping" />
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Iconic bottom collar strap in bright red with thick borders */}
      <div className="absolute -bottom-3 left-0 w-full h-3 bg-[#EE1C23] border-t-4 border-b-4 border-black pointer-events-none z-10" />
    </div>
  );
}
