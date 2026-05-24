import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the molecular geometry of a Methane (CH₄) molecule?",
    options: ["Trigonal Planar", "Linear", "Tetrahedral", "Octahedral"],
    correctAnswer: 2,
    explanation: "Under VSEPR theory, Carbon has 4 bonding pairs and 0 lone pairs, distributing itself into a Tetrahedral shape with bond angles of 109.5°."
  },
  {
    id: 2,
    question: "Which bonding mechanism involves the sharing of valence electron pairs?",
    options: ["Ionic Bonding", "Covalent Bonding", "Hydrogen Bonding", "Metallic Bonding"],
    correctAnswer: 1,
    explanation: "Covalent bonds form between non-metal atoms sharing valence electron clouds to reach an octet state."
  },
  {
    id: 3,
    question: "What color represents Carbon in the classic CPK molecular representation model?",
    options: ["Red", "Blue", "White", "Black / Dark Gray"],
    correctAnswer: 3,
    explanation: "In CPK coloring: Hydrogen is White, Oxygen is Red, Nitrogen is Blue, and Carbon is Black / Dark Gray."
  },
  {
    id: 4,
    question: "According to Le Chatelier's Principle, how does an exothermic reaction shift if temperature increases?",
    options: [
      "Shifts towards the Products",
      "Shifts towards the Reactants",
      "No shift in equilibrium occurs",
      "Reactant volume halves"
    ],
    correctAnswer: 1,
    explanation: "In exothermic reactions, heat is a product. Increasing temperature is equivalent to adding products, forcing the equilibrium to shift to the reactants side."
  },
  {
    id: 5,
    question: "What is the pH level of a highly acidic concentrated Hydrochloric Acid (HCl) solution?",
    options: ["pH 1.0", "pH 7.0", "pH 14.0", "pH 9.5"],
    correctAnswer: 0,
    explanation: "Strong acids fully dissociate in aqueous solution to yield high concentration hydronium ions, translating to very low pH values (typically between 0 and 2)."
  }
];

export const Quiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [screenEffect, setScreenEffect] = useState<'none' | 'success' | 'fail'>('none');

  const currentQuestion = QUESTIONS[currentIdx];

  const handleSubmit = () => {
    if (selectedOpt === null || isAnswered) return;

    setIsAnswered(true);
    const isCorrect = selectedOpt === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + Math.round(100 * multiplier));
      setMultiplier((prev) => Math.min(prev + 0.5, 3.0));
      setScreenEffect('success');
    } else {
      setLives((prev) => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          setQuizFinished(true);
        }
        return nextLives;
      });
      setMultiplier(1.0);
      setScreenEffect('fail');
    }

    setTimeout(() => {
      setScreenEffect('none');
    }, 1000);
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    
    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setLives(3);
    setScore(0);
    setMultiplier(1.0);
    setQuizFinished(false);
    setScreenEffect('none');
  };

  // Screen-shake dynamic style class
  const getEffectClass = () => {
    if (screenEffect === 'success') return 'border-green-500 bg-green-950/10 shadow-[0_0_30px_rgba(57,255,20,0.15)]';
    if (screenEffect === 'fail') return 'border-red-500 bg-red-950/10 shadow-[0_0_30px_rgba(255,0,85,0.15)] animate-[shake_0.4s_ease-in-out]';
    return 'border-cyan-500/25';
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center justify-start overflow-hidden px-6 py-8 md:px-12 lg:px-24">
      {/* Background blurs */}
      <div className="absolute top-1/4 left-10 w-[20vw] h-[20vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[20vw] h-[20vw] rounded-full bg-green-500/5 blur-[120px] pointer-events-none" />

      {/* Shake Keyframe injected locally if not in stylesheet */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>

      <div className="w-full max-w-3xl flex flex-col gap-6 z-10">
        
        {/* Page Title & Status panel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800/60 pb-6 text-left w-full">
          <div className="flex flex-col gap-2">
            <h1 className="font-orbitron font-extrabold text-3xl tracking-wider text-white flex items-center gap-3">
              <Award className="w-8 h-8 text-neon-green" /> EVALUATION STATION
            </h1>
            <p className="text-gray-400 text-sm font-light">Validate synthesis models and quantum properties under neon diagnostic constraints.</p>
          </div>
        </div>

        {/* Dashboard Readout (Lives, Score, Multiplier) */}
        {!quizFinished && (
          <div className="grid grid-cols-3 gap-4 w-full text-left">
            {/* Health indicators */}
            <div className="glass-panel border border-cyan-500/25 rounded-xl p-4 flex flex-col gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.03)]">
              <span className="font-orbitron text-[10px] text-gray-500 tracking-wider">MODULE SHIELD ENERGY</span>
              <div className="flex items-center gap-2 mt-0.5">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-6 h-3.5 rounded border transition-all duration-300
                      ${idx < lives 
                        ? 'bg-neon-green border-green-400 shadow-[0_0_8px_rgba(57,255,20,0.5)]' 
                        : 'bg-transparent border-gray-800'
                      }
                    `}
                  />
                ))}
              </div>
            </div>

            {/* Score */}
            <div className="glass-panel border border-cyan-500/25 rounded-xl p-4 flex flex-col gap-0.5 shadow-[0_0_15px_rgba(0,240,255,0.03)]">
              <span className="font-orbitron text-[10px] text-gray-500 tracking-wider">ACCUMULATED DATA</span>
              <span className="font-orbitron text-xl font-bold text-white mt-0.5">{score} pts</span>
            </div>

            {/* Multiplier */}
            <div className="glass-panel border border-cyan-500/25 rounded-xl p-4 flex flex-col gap-0.5 shadow-[0_0_15px_rgba(0,240,255,0.03)]">
              <span className="font-orbitron text-[10px] text-gray-500 tracking-wider">SYNAPSE MULTIPLIER</span>
              <span className="font-orbitron text-xl font-bold text-neon-cyan mt-0.5 flex items-center gap-1">
                <Zap className="w-4 h-4 fill-neon-cyan/20 shrink-0" /> {multiplier.toFixed(1)}x
              </span>
            </div>
          </div>
        )}

        {/* Main Quiz View Container */}
        {quizFinished ? (
          <div className="glass-panel border border-green-500/30 rounded-2xl p-8 flex flex-col items-center gap-6 text-center shadow-[0_0_30px_rgba(57,255,20,0.08)]">
            <div className="w-16 h-16 rounded-full bg-green-950/40 border border-neon-green flex items-center justify-center text-neon-green shadow-[0_0_20px_rgba(57,255,20,0.3)] animate-pulse">
              <Award className="w-9 h-9" />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-orbitron font-extrabold text-2xl tracking-wider text-white">DIAGNOSTIC REPORT GENERATED</h2>
              <p className="text-gray-400 text-sm font-light max-w-md">Your testing cycle is complete. Reaction simulation performance has been indexed.</p>
            </div>

            <div className="h-px bg-green-500/20 w-full my-1" />

            <div className="grid grid-cols-2 gap-8 w-full max-w-sm">
              <div className="flex flex-col gap-1 text-center">
                <span className="text-[10px] font-orbitron text-gray-500 tracking-wider">FINAL SCORE</span>
                <span className="text-white font-extrabold text-3xl font-orbitron">{score}</span>
              </div>
              <div className="flex flex-col gap-1 text-center">
                <span className="text-[10px] font-orbitron text-gray-500 tracking-wider">DIAGNOSTIC OUTCOME</span>
                <span className={`font-extrabold text-xl font-orbitron ${lives > 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
                  {lives > 0 ? 'SYNTHESIS STABLE' : 'SHIELD DISSIPATED'}
                </span>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="mt-4 flex items-center gap-2 px-6 py-3 font-orbitron font-bold text-sm tracking-wider text-black bg-neon-green hover:bg-green-400 rounded-lg shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <RefreshCw className="w-4 h-4" /> INITIALIZE NEW RUN
            </button>
          </div>
        ) : (
          <div className={`glass-panel border transition-all duration-300 rounded-2xl p-6 md:p-8 flex flex-col gap-6 text-left ${getEffectClass()}`}>
            
            {/* Question Progress header */}
            <div className="flex justify-between items-center text-xs font-orbitron tracking-wider text-gray-500">
              <span>TEST FRAME: {currentIdx + 1} OF {QUESTIONS.length}</span>
              <span className="text-neon-cyan">DIAGNOSTIC INDEX: {currentQuestion.id * 20}%</span>
            </div>

            {/* Question Text */}
            <h3 className="font-orbitron font-bold text-lg md:text-xl text-white leading-relaxed">
              {currentQuestion.question}
            </h3>

            <div className="h-px bg-cyan-500/20 w-full my-1" />

            {/* Options List */}
            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrectAns = currentQuestion.correctAnswer === idx;
                
                let optionStyle = 'border-gray-800 text-gray-300 hover:text-white hover:border-gray-700 bg-gray-950/20';
                
                if (isSelected && !isAnswered) {
                  optionStyle = 'border-cyan-500/50 text-neon-cyan bg-cyan-950/20 shadow-[0_0_10px_rgba(0,240,255,0.1)]';
                } else if (isAnswered) {
                  if (isCorrectAns) {
                    optionStyle = 'border-green-500/50 text-neon-green bg-green-950/20 shadow-[0_0_15px_rgba(57,255,20,0.1)]';
                  } else if (isSelected) {
                    optionStyle = 'border-pink-500/50 text-neon-pink bg-pink-950/20 shadow-[0_0_15px_rgba(255,0,85,0.1)]';
                  } else {
                    optionStyle = 'border-gray-900/60 text-gray-600 bg-gray-950/5 cursor-not-allowed';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isAnswered) setSelectedOpt(idx);
                    }}
                    disabled={isAnswered}
                    className={`w-full text-left px-5 py-4 border rounded-xl font-medium text-sm transition-all duration-300 flex justify-between items-center ${optionStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrectAns && <CheckCircle2 className="w-5 h-5 text-neon-green shrink-0" />}
                    {isAnswered && isSelected && !isCorrectAns && <XCircle className="w-5 h-5 text-neon-pink shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanatory Info Card (after submission) */}
            {isAnswered && (
              <div className={`rounded-xl p-4 text-xs leading-relaxed text-left border
                ${selectedOpt === currentQuestion.correctAnswer 
                  ? 'bg-green-950/15 border-green-500/20 text-green-300' 
                  : 'bg-pink-950/15 border-pink-500/20 text-pink-300'
                }
              `}>
                <span className="font-orbitron font-bold tracking-wider block mb-1">CORE FEEDBACK PROTOCOL</span>
                {currentQuestion.explanation}
              </div>
            )}

            {/* Action Bottom controls */}
            <div className="flex justify-end items-center mt-3">
              {!isAnswered ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedOpt === null}
                  className="px-6 py-3 font-orbitron font-bold text-xs tracking-widest text-black bg-neon-cyan hover:bg-cyan-400 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:scale-105 transition-all duration-300 disabled:opacity-20 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  SUBMIT DIAGNOSTIC
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 font-orbitron font-bold text-xs tracking-widest text-black bg-neon-cyan hover:bg-cyan-400 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:scale-105 transition-all duration-300"
                >
                  {currentIdx + 1 === QUESTIONS.length ? 'REPORT DIAGNOSTIC' : 'CONTINUE DIAGNOSTIC'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
