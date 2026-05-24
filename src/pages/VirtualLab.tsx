import React, { useState } from 'react';
import { LabCanvas } from '../components/LabCanvas';
import { FlaskConical, RefreshCw, ShieldAlert, CheckCircle2, Move } from 'lucide-react';

interface Reagent {
  id: string;
  name: string;
  formula: string;
  type: 'acid' | 'base' | 'water' | 'metal';
  color: string; // Neon theme color hex
  glowClass: string;
  borderClass: string;
  description: string;
}

const REAGENTS: Reagent[] = [
  {
    id: 'hcl',
    name: 'Hydrochloric Acid',
    formula: 'HCl',
    type: 'acid',
    color: '#ff0055',
    glowClass: 'shadow-[0_0_15px_rgba(255,0,85,0.2)] hover:shadow-[0_0_25px_rgba(255,0,85,0.4)]',
    borderClass: 'border-pink-500/30 hover:border-pink-500',
    description: 'Strong monoprotic mineral acid. Highly corrosive and reactive.'
  },
  {
    id: 'naoh',
    name: 'Sodium Hydroxide',
    formula: 'NaOH',
    type: 'base',
    color: '#00f0ff',
    glowClass: 'shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]',
    borderClass: 'border-cyan-500/30 hover:border-cyan-500',
    description: 'Strong caustic metallic base. Highly soluble alkaline compound.'
  },
  {
    id: 'h2o',
    name: 'Deionized Water',
    formula: 'H₂O',
    type: 'water',
    color: '#3b82f6',
    glowClass: 'shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]',
    borderClass: 'border-blue-500/30 hover:border-blue-500',
    description: 'Ultra-pure water filtered of ionic minerals. Neutral solvent.'
  },
  {
    id: 'na',
    name: 'Metallic Sodium',
    formula: 'Na',
    type: 'metal',
    color: '#39ff14',
    glowClass: 'shadow-[0_0_15px_rgba(57,255,20,0.2)] hover:shadow-[0_0_25px_rgba(57,255,20,0.4)]',
    borderClass: 'border-green-500/30 hover:border-green-500',
    description: 'Soft, highly reactive alkali metal. Rapidly oxidizes in atmosphere.'
  }
];

interface ReactionOutcome {
  equation: string;
  enthalpy: string;
  phResult: string;
  observations: string[];
  type: 'acid_base' | 'sodium_water' | 'copper_acid' | 'no_reaction';
  logs: string[];
}

export const VirtualLab: React.FC = () => {
  const [beakerContents, setBeakerContents] = useState<string[]>([]);
  const [reaction, setReaction] = useState<'none' | 'acid_base' | 'sodium_water' | 'copper_acid' | 'no_reaction'>('none');
  const [outcome, setOutcome] = useState<ReactionOutcome | null>(null);
  const [isReacting, setIsReacting] = useState<boolean>(false);
  const [mixTrigger, setMixTrigger] = useState<number>(0);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[SYSTEM] - Reactor online. Electromagnetic containment functional.',
    '[SYSTEM] - Drag reagents from the dispenser grid and drop them into the beaker chamber.'
  ]);

  const addLog = (logText: string) => {
    setConsoleLogs((prev) => [...prev, logText]);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('reagentId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isReacting && reaction === 'none') {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (isReacting || reaction !== 'none') return;

    const reagentId = e.dataTransfer.getData('reagentId');
    if (!reagentId) return;

    injectReagent(reagentId);
  };

  const injectReagent = (id: string) => {
    if (beakerContents.includes(id)) {
      addLog(`[WARNING] - ${id.toUpperCase()} has already been injected into the reactor beaker.`);
      return;
    }

    const reagent = REAGENTS.find((r) => r.id === id);
    if (!reagent) return;

    const nextContents = [...beakerContents, id];
    setBeakerContents(nextContents);
    addLog(`[0.00s] - Discharging ${reagent.name} (${reagent.formula}) into mixture matrix.`);

    // Evaluate if reaction is complete
    evaluateMixture(nextContents);
  };

  const evaluateMixture = (contents: string[]) => {
    // Combination 1: HCl + NaOH (Acid-Base Neutralization)
    if (contents.includes('hcl') && contents.includes('naoh')) {
      triggerReaction('acid_base', {
        equation: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)',
        enthalpy: '-57.3 kJ/mol (Exothermic)',
        phResult: 'Neutral pH 7.0',
        observations: [
          'Exothermic thermal spike detected.',
          'Acid-Base neutralization complete.',
          'Fluid indicator dye shift: Red/Magenta + Cyan → Neutral Green.'
        ],
        type: 'acid_base',
        logs: [
          '[0.00s] - Acid-Base neutralization initiated.',
          '[0.25s] - High density hydronium and hydroxide ionic collision event.',
          '[0.50s] - Temperature spike: ΔH = -57.3 kJ/mol.',
          '[0.85s] - Solution stabilizing. Salt particles (NaCl) dissolving in solvent.',
          '[1.50s] - Reactor neutralization diagnostic complete. State stable.'
        ]
      });
    }
    // Combination 2: Water + Sodium (Na + H2O)
    else if (contents.includes('h2o') && contents.includes('na')) {
      triggerReaction('sodium_water', {
        equation: '2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g) ↑',
        enthalpy: '-368.4 kJ/mol (Highly Exothermic)',
        phResult: 'Alkaline pH 13.5',
        observations: [
          'Violent effervescence and mechanical agitation of sodium chunk.',
          'High thermal ignition sparks at surface.',
          'Release of gaseous Hydrogen byproduct.'
        ],
        type: 'sodium_water',
        logs: [
          '[0.00s] - Exothermic contact. Sodium dissolving violently in H₂O matrix.',
          '[0.20s] - Surface ignition. Gaseous Hydrogen (H₂) evolving rapidly.',
          '[0.45s] - Sodium chunk entering molten sphere phase. High speed surface drift.',
          '[0.90s] - Fluid indicator dye shifting to alkaline deep purple.',
          '[1.50s] - All metallic sodium consumed. Chamber stabilizing.'
        ]
      });
    }
    // Other dual mixtures that don't trigger severe events
    else if (contents.length >= 2) {
      triggerReaction('no_reaction', {
        equation: 'No Significant Reaction',
        enthalpy: '0.0 kJ/mol',
        phResult: 'Slight shift based on concentration',
        observations: [
          'No significant thermal shift detected.',
          'No bubble evolution, sparks, or precipitates.'
        ],
        type: 'no_reaction',
        logs: [
          '[0.00s] - Reactants mixed. Analyzing spectrometer returns...',
          '[0.60s] - No thermal deviation. Inter-molecular forces inactive.',
          '[1.20s] - Reagents are stable. Equilibrium maintained.'
        ]
      });
    }
  };

  const triggerReaction = (type: 'acid_base' | 'sodium_water' | 'copper_acid' | 'no_reaction', outcomes: ReactionOutcome) => {
    setIsReacting(true);
    addLog(`[SYSTEM] - Evaluating reaction variables... Stand by.`);

    setTimeout(() => {
      setReaction(type);
      setOutcome(outcomes);
      setIsReacting(false);
      setMixTrigger((t) => t + 1);
      
      // Dump reaction specific logs into console
      outcomes.logs.forEach((logLine) => {
        addLog(logLine);
      });
    }, 1500);
  };

  const handleReset = () => {
    setBeakerContents([]);
    setReaction('none');
    setOutcome(null);
    setIsReacting(false);
    setConsoleLogs([
      '[SYSTEM] - Reactor successfully flushed. Electromagnets reset.',
      '[SYSTEM] - Drag reagents from the dispenser grid and drop them into the beaker chamber.'
    ]);
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center justify-start overflow-hidden px-6 py-8 md:px-12 lg:px-24">
      {/* Background Neon Blur */}
      <div className="absolute top-1/3 left-10 w-[20vw] h-[20vw] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[20vw] h-[20vw] rounded-full bg-pink-500/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-7xl flex flex-col gap-8 z-10">
        
        {/* Title Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800/60 pb-6">
          <div className="flex flex-col gap-2 text-left">
            <h1 className="font-orbitron font-extrabold text-3xl tracking-wider text-white flex items-center gap-3">
              <FlaskConical className="w-8 h-8 text-neon-cyan" /> VIRTUAL REACTOR
            </h1>
            <p className="text-gray-400 text-sm font-light">
              Drag chemical reagents and drop them onto the reactor chamber beaker to simulate reactive properties.
            </p>
          </div>
          
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 font-orbitron font-bold text-xs tracking-wider border border-gray-700 hover:border-neon-cyan/50 text-gray-400 hover:text-white rounded-lg transition-all duration-300 bg-gray-900/30"
          >
            <RefreshCw className="w-3.5 h-3.5" /> FLUSH CHAMBER
          </button>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Chemical Dispenser (5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Reagents Grid Box */}
            <div className="glass-panel border border-cyan-500/20 rounded-xl p-6 flex flex-col gap-5 shadow-[0_0_20px_rgba(0,240,255,0.05)] text-left">
              <div className="flex justify-between items-center">
                <h2 className="font-orbitron font-bold text-sm tracking-wider text-cyan-400">
                  REAGENT DISPENSER ARRAY
                </h2>
                <span className="font-orbitron text-[10px] text-gray-500 flex items-center gap-1">
                  <Move className="w-3 h-3" /> DRAG ITEMS
                </span>
              </div>
              <div className="h-px bg-cyan-500/20 w-full" />

              {/* Draggable Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {REAGENTS.map((reagent) => {
                  const isAlreadyUsed = beakerContents.includes(reagent.id);
                  return (
                    <div
                      key={reagent.id}
                      draggable={!isAlreadyUsed && !isReacting && reaction === 'none'}
                      onDragStart={(e) => handleDragStart(e, reagent.id)}
                      className={`relative rounded-xl border p-4 bg-gray-950/60 transition-all duration-300 flex flex-col gap-2 select-none
                        ${isAlreadyUsed 
                          ? 'border-gray-900 opacity-30 cursor-not-allowed'
                          : isReacting || reaction !== 'none'
                            ? 'border-gray-800 opacity-60 cursor-not-allowed'
                            : `cursor-grab active:cursor-grabbing border-cyan-500/20 ${reagent.borderClass} ${reagent.glowClass}`
                        }
                      `}
                    >
                      {/* Interactive Drag Badge indicator */}
                      {!isAlreadyUsed && !isReacting && reaction === 'none' && (
                        <div className="absolute top-2 right-2 text-gray-600 group-hover:text-neon-cyan transition-colors">
                          <Move className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" 
                          style={{ backgroundColor: reagent.color, boxShadow: `0 0 10px ${reagent.color}` }}
                        />
                        <span className="font-orbitron font-extrabold text-xs text-white tracking-wide">
                          {reagent.formula}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-gray-400 font-bold">{reagent.name}</span>
                        <span className="text-[9px] text-gray-500 leading-tight font-light mt-0.5">{reagent.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Display inside beaker */}
              <div className="mt-2 bg-gray-950/40 border border-gray-900 rounded-lg p-4 flex flex-col gap-2">
                <span className="font-orbitron text-[10px] text-gray-500 tracking-wider uppercase">ACTIVE CHAMBER CONTENTS</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {beakerContents.length === 0 ? (
                    <span className="text-xs text-gray-600 font-light italic">Chamber empty. Awaiting reagent injection.</span>
                  ) : (
                    beakerContents.map((id) => {
                      const r = REAGENTS.find((reg) => reg.id === id);
                      return (
                        <span 
                          key={id}
                          className="px-2.5 py-1 rounded text-xs font-orbitron font-bold border"
                          style={{
                            borderColor: `${r?.color}35`,
                            color: r?.color,
                            backgroundColor: `${r?.color}08`,
                            boxShadow: `0 0 8px ${r?.color}15`
                          }}
                        >
                          {r?.formula}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Reaction Console Log Monitor */}
            <div className="glass-panel border border-purple-500/20 rounded-xl p-6 flex flex-col gap-4 text-left shadow-[0_0_20px_rgba(176,38,255,0.05)]">
              <h2 className="font-orbitron font-bold text-sm tracking-wider text-purple-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> DISCHARGE MONITOR
              </h2>
              <div className="h-px bg-purple-500/20 w-full" />
              
              <div className="w-full bg-gray-950/90 rounded-lg p-4 font-mono text-xs text-gray-400 min-h-[170px] max-h-[220px] flex flex-col gap-2 overflow-y-auto border border-gray-900 leading-normal">
                {consoleLogs.map((log, idx) => (
                  <div key={idx} className="transition-all duration-300 opacity-90 hover:opacity-100">
                    <span className="text-purple-500">❯</span> {log}
                  </div>
                ))}
                {isReacting && (
                  <div className="animate-pulse text-cyan-400">
                    <span className="text-cyan-500">❯</span> [SYSTEM] - Mixing reagents and computing kinetic variables...
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Panel: Beaker Chamber Drop Zone & Telemetry (7 columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Beaker Chamber Drop Zone */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative w-full aspect-[4/3] max-h-[420px] rounded-2xl border-2 transition-all duration-300 overflow-hidden
                ${isDraggingOver 
                  ? 'border-neon-cyan border-dashed bg-cyan-950/10 shadow-[0_0_25px_rgba(0,240,255,0.15)] scale-[1.01]' 
                  : 'border-transparent'
                }
              `}
            >
              {/* Dragging over overlay indicator */}
              {isDraggingOver && (
                <div className="absolute inset-0 bg-cyan-950/30 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center gap-2 pointer-events-none transition-all duration-300 animate-pulse">
                  <div className="w-12 h-12 rounded-full border border-neon-cyan flex items-center justify-center text-neon-cyan">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <span className="font-orbitron font-extrabold text-sm tracking-widest text-neon-cyan">
                    RELEASE MOUSE TO DISCHARGE
                  </span>
                </div>
              )}

              <LabCanvas reaction={isReacting || reaction === 'no_reaction' ? 'none' : reaction} mixTrigger={mixTrigger} />
            </div>

            {/* Reaction Details Output telemetry */}
            {outcome && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Column 1: Thermal specs */}
                <div className="glass-panel border border-cyan-500/20 rounded-xl p-5 text-left flex flex-col gap-3">
                  <div className="text-xs font-orbitron text-cyan-400 tracking-wider font-semibold">THERMAL DEVIATION</div>
                  <div>
                    <div className="text-xs text-gray-500">REACTANT FORMULA</div>
                    <div className="font-orbitron font-bold text-white text-base tracking-wide mt-1 overflow-x-auto whitespace-nowrap">
                      {outcome.equation}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <div className="text-xs text-gray-500">ENTHALPY (ΔH)</div>
                      <div className="font-orbitron font-bold text-pink-500 text-sm mt-1">{outcome.enthalpy}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">pH MEASUREMENT</div>
                      <div className="font-orbitron font-bold text-green-400 text-sm mt-1">{outcome.phResult}</div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Observations */}
                <div className="glass-panel border border-purple-500/20 rounded-xl p-5 text-left flex flex-col gap-3">
                  <div className="text-xs font-orbitron text-purple-400 tracking-wider font-semibold">OBSERVATION MATRIX</div>
                  <div className="flex flex-col gap-2 mt-1">
                    {outcome.observations.map((obs, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neon-cyan shrink-0 mt-0.5" />
                        <span>{obs}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
