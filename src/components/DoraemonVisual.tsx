import React, { useEffect, useState } from 'react';

interface DoraemonVisualProps {
  state: 'idle' | 'work' | 'break' | 'copter' | 'celebrate';
  showDorayaki?: boolean;
}

export default function DoraemonVisual({ state, showDorayaki = false }: DoraemonVisualProps) {
  const [blink, setBlink] = useState(false);
  const [zzzState, setZzzState] = useState<number[]>([]);

  // Periodically blink when idle or in work mode
  useEffect(() => {
    if (state === 'idle' || state === 'work') {
      const interval = setInterval(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
      }, 3000 + Math.random() * 2000);
      return () => clearInterval(interval);
    }
  }, [state]);

  // Floating Zzz indicators during break mode
  useEffect(() => {
    if (state === 'break') {
      const interval = setInterval(() => {
        setZzzState((prev) => [...prev, Date.now()].slice(-4)); // keep last 4
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setZzzState([]);
    }
  }, [state]);

  return (
    <div className="relative flex flex-col items-center justify-center p-6 select-none bg-white border-4 border-black rounded-[32px] shadow-[8px_8px_0px_#00A0E9] overflow-hidden">
      {/* Dynamic Comic panel stripes */}
      <div className="absolute inset-0 bg-[radial-gradient(#E6F4FC_25%,transparent_25%)] bg-[size:12px_12px] opacity-60 pointer-events-none -z-10" />

      {/* Break Zzz bubble overlays */}
      {state === 'break' && (
        <div className="absolute top-4 right-12 pointer-events-none h-24 w-24">
          {zzzState.map((timestamp, index) => (
            <span
              key={timestamp}
              className="absolute text-blue-600 font-bold text-2xl animate-float-zzz select-none opacity-0"
              style={{
                left: `${index * 12}px`,
                animationDelay: `${index * 0.3}s`,
                fontFamily: 'monospace',
              }}
            >
              Z
            </span>
          ))}
        </div>
      )}

      {/* Doraemon Main SVG Canvas */}
      <svg
        id="doraemon-canvas"
        viewBox="0 0 240 240"
        className="w-48 h-48 md:w-56 md:h-56 filter drop-shadow-md transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <defs>
          <style>{`
            @keyframes spin-prop {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .bamboo-blade {
              transform-origin: 120px 22px;
              animation: spin-prop 0.2s linear infinite;
            }
            .bamboo-blade-slow {
              transform-origin: 120px 22px;
              animation: spin-prop 1.5s linear infinite;
            }
            @keyframes float-zzz {
              0% { transform: translateY(10px) scale(0.6); opacity: 0; }
              50% { opacity: 0.8; }
              100% { transform: translateY(-40px) scale(1.1); opacity: 0; }
            }
            .animate-float-zzz {
              animation: float-zzz 3s ease-out forwards;
            }
            @keyframes body-sway {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
            .sway {
              animation: body-sway 2s ease-in-out infinite;
            }
            @keyframes copter-float {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              25% { transform: translateY(-8px) rotate(-1deg); }
              75% { transform: translateY(-2px) rotate(1deg); }
            }
            .copter-flying {
              animation: copter-float 1.5s ease-in-out infinite;
            }
          `}</style>
          <radialGradient id="grad-bell" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="80%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>
          <radialGradient id="grad-blue" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="85%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>
          <radialGradient id="grad-nose" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="70%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>
        </defs>

        {/* Outer Group wrapper with context-specific animations */}
        <g className={state === 'copter' ? 'copter-flying' : 'sway'}>
          
          {/* BAMBOO COPTER GADGET (TAKE-COPTER) - only visible/spinning active under 'copter' mode or optionally 'idle' with slower spin */}
          {(state === 'copter' || state === 'work') && (
            <g id="gadget-copter">
              {/* Shaft */}
              <rect x="117" y="24" width="6" height="22" fill="#d97706" rx="2" />
              {/* Copter attachment base */}
              <ellipse cx="120" cy="46" rx="14" ry="4" fill="#ca8a04" />
              
              {/* Spinning Blade */}
              <g className={state === 'copter' ? 'bamboo-blade' : 'bamboo-blade-slow'}>
                {/* Center cap */}
                <circle cx="120" cy="22" r="4" fill="#facc15" />
                {/* Horizontal blades */}
                <path d="M 60 21 L 180 21 L 180 23 L 60 23 Z" fill="#ca8a04" />
                <ellipse cx="60" cy="22" rx="8" ry="3" fill="#ca8a04" />
                <ellipse cx="180" cy="22" rx="8" ry="3" fill="#ca8a04" />
              </g>
            </g>
          )}

          {/* DORAEMON BODY - BLUE CIRCLE HEAD */}
          <circle cx="120" cy="130" r="75" fill="url(#grad-blue)" stroke="#0f172a" strokeWidth="4.5" />

          {/* FACE - WHITE OVAL INSET */}
          <ellipse cx="120" cy="144" rx="63" ry="54" fill="#ffffff" stroke="#0f172a" strokeWidth="3.5" />

          {/* EYES */}
          <g id="doraemon-eyes">
            {/* Left Eye */}
            <ellipse cx="101" cy="104" rx="16" ry="21" fill="#ffffff" stroke="#0f172a" strokeWidth="3.5" />
            {/* Right Eye */}
            <ellipse cx="139" cy="104" rx="16" ry="21" fill="#ffffff" stroke="#0f172a" strokeWidth="3.5" />

            {/* PUPILS based on expression state */}
            {state === 'break' ? (
              // Sleep state - closed curving happy resting eyes (^^)
              <>
                <path d="M 91 106 Q 101 114 111 106" fill="none" stroke="#2563eb" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 129 106 Q 139 114 149 106" fill="none" stroke="#2563eb" strokeWidth="4.5" strokeLinecap="round" />
              </>
            ) : blink ? (
              // Blinking state - flat closed sleep lines
              <>
                <line x1="90" y1="104" x2="112" y2="104" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="128" y1="104" x2="150" y2="104" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
              </>
            ) : state === 'celebrate' ? (
              // Happy winking / diamond eyes / heart shape approximation
              <>
                <path d="M 91 110 Q 101 98 111 110" fill="none" stroke="#dc2626" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M 129 110 Q 139 98 149 110" fill="none" stroke="#dc2626" strokeWidth="5.5" strokeLinecap="round" />
                {/* Little heart marks on cheek */}
                <path d="M 68 140 Q 72 135 76 140 Q 80 135 84 140 Q 76 148 68 140" fill="#fca5a5" />
                <path d="M 156 140 Q 160 135 164 140 Q 168 135 172 140 Q 164 148 156 140" fill="#fca5a5" />
              </>
            ) : state === 'work' ? (
              // Sharp focused smart gaze with cute gold glasses overlays!
              <>
                {/* Pupils staring determinedly in centre */}
                <ellipse cx="106" cy="105" rx="4.5" ry="7" fill="#030712" />
                <ellipse cx="134" cy="105" rx="4.5" ry="7" fill="#030712" />
                {/* Cute white reflection highlights in pupils */}
                <circle cx="105" cy="102" r="1.5" fill="#ffffff" />
                <circle cx="133" cy="102" r="1.5" fill="#ffffff" />
                {/* Focus eyebrow marks */}
                <path d="M 90 81 Q 102 77 110 84" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                <path d="M 150 81 Q 138 77 130 84" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              // Normal state - standard cute pupils
              <>
                {/* Pupils pointing slightly inwards/crossed for cute derpy cat look */}
                <ellipse cx="108" cy="106" rx="4" ry="7" fill="#0f172a" />
                <ellipse cx="132" cy="106" rx="4" ry="7" fill="#0f172a" />
                {/* Reflections */}
                <circle cx="107" cy="103" r="1.5" fill="#ffffff" />
                <circle cx="131" cy="103" r="1.5" fill="#ffffff" />
              </>
            )}
          </g>

          {/* RED NOSE */}
          <circle cx="120" cy="120" r="11" fill="url(#grad-nose)" stroke="#0f172a" strokeWidth="3" />
          {/* White shiny highlight point on nose */}
          <circle cx="116" cy="116" r="3.5" fill="#ffffff" />

          {/* CENTRAL PHILTRUM (Mouth centerline) */}
          <line x1="120" y1="131" x2="120" y2="168" stroke="#0f172a" strokeWidth="3" />

          {/* MOUTH & CHEEK WHISKERS */}
          <g id="doraemon-mouth">
            {state === 'celebrate' ? (
              // Massive joyful open mouth (laughing/dorayaki lover)
              <g>
                <path d="M 85 152 Q 120 200 155 152 Z" fill="#dc2626" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                {/* Cute red tongue inside */}
                <path d="M 100 174 Q 120 160 140 174 Q 135 194 120 194 Q 105 194 100 174" fill="#fca5a5" />
              </g>
            ) : state === 'break' ? (
              // Little resting sleeping mouth line
              <path d="M 98 152 Q 120 158 142 152" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            ) : state === 'work' ? (
              // Concentrated smirk line
              <path d="M 94 154 Q 120 144 146 154" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            ) : (
              // Normal beautiful giant cat smile
              <path d="M 76 148 Q 120 190 164 148" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            )}
          </g>

          {/* WHISKERS - 3 on Left, 3 on Right */}
          <g id="whiskers" stroke="#0f172a" strokeWidth="3" strokeLinecap="round">
            {/* Left cheek whiskers */}
            <line x1="88" y1="138" x2="52" y2="132" />
            <line x1="86" y1="147" x2="48" y2="147" />
            <line x1="88" y1="156" x2="52" y2="161" />

            {/* Right cheek whiskers */}
            <line x1="152" y1="138" x2="188" y2="132" />
            <line x1="154" y1="147" x2="192" y2="147" />
            <line x1="152" y1="156" x2="188" y2="161" />
          </g>

          {/* COLLAR - RED BAND */}
          <path d="M 68 190 Q 120 216 172 190 C 160 206 135 212 120 212 C 105 212 80 206 68 190 Z" fill="#ef4444" stroke="#0f172a" strokeWidth="3.5" />

          {/* BELL - ROUND GOLD WITH KEYHOLE */}
          <circle cx="120" cy="208" r="11.5" fill="url(#grad-bell)" stroke="#0f172a" strokeWidth="3" className="transition-transform duration-300 hover:rotate-12" />
          {/* Bell horizontal slit */}
          <line x1="109" y1="205" x2="131" y2="205" stroke="#0f172a" strokeWidth="3" />
          {/* Keyhole slot circle & line */}
          <circle cx="120" cy="211" r="2.5" fill="#4b5563" />
          <line x1="120" y1="213.5" x2="120" y2="219" stroke="#0f172a" strokeWidth="2.5" />
        </g>
      </svg>

      {/* Floating Dorayaki Graphic (Only visible in celebrate mode) */}
      {showDorayaki && (
        <div className="absolute -bottom-1 transform translate-y-2 select-none animate-bounce z-20">
          <div className="relative w-16 h-12 flex items-center justify-center filter drop-shadow">
            {/* Top pancake bun */}
            <div className="absolute top-1 w-14 h-8 bg-amber-700/90 rounded-full border border-amber-900/60 " />
            {/* White chocolate/red bean filling line */}
            <div className="absolute top-[18px] w-12 h-2 bg-yellow-100 border-t border-b border-amber-900/80" />
            {/* Bottom pancake bun */}
            <div className="absolute bottom-1 w-14 h-8 bg-amber-700 rounded-full border border-amber-900/40" />
            <span className="absolute text-[8px] font-bold text-yellow-100 select-none pointer-events-none uppercase tracking-widest leading-none drop-shadow-xs">
              Yumm!
            </span>
          </div>
        </div>
      )}

      {/* Dynamic Companion Speech bubble */}
      <div className="mt-4 px-4 py-3 bg-[#FFD700] text-black rounded-[16px] border-4 border-black shadow-[4px_4px_0px_#000] relative text-xs select-none font-black uppercase tracking-wider text-center max-w-xs transition-all duration-300 z-10 mx-2">
        <p className="leading-tight">
          {state === 'idle' && "Let's work together! Fly with Bamboo Copter!"}
          {state === 'work' && "Great focus! 4D pockets are proud of you!"}
          {state === 'break' && "Fuu~ Dorayaki tea break! Zzz..."}
          {state === 'copter' && "Shuua! Flying high! Let's conquer this session!"}
          {state === 'celebrate' && "Excellent! You earned another Dorayaki! 🥞"}
        </p>
        <div className="absolute left-1/2 -top-2.5 transform -translate-x-1/2 w-3.5 h-3.5 bg-[#FFD700] border-t-4 border-l-4 border-black rotate-45" />
      </div>
    </div>
  );
}
