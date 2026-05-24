import React from 'react';
import { Link } from 'react-router-dom';
import { OrbitingAtom } from '../components/OrbitingAtom';
import { FlaskConical, Cpu, Atom, Award, ChevronRight, Terminal } from 'lucide-react';

export const Home: React.FC = () => {
  const features = [
    {
      to: '/lab',
      title: 'Virtual Reactor',
      description: 'Conduct simulations on highly reactive compounds in a safe, simulated 3D environment.',
      icon: <FlaskConical className="w-8 h-8 text-neon-cyan" />,
      borderColor: 'border-cyan-500/25',
      glowColor: 'hover:shadow-[0_0_20px_rgba(0,240,255,0.25)]',
      hoverBorder: 'hover:border-neon-cyan/50',
    },
    {
      to: '/tutor',
      title: 'AI Core Tutor',
      description: 'Query the artificial neural network on compound mechanisms, equation balancing, and stoichiometry.',
      icon: <Cpu className="w-8 h-8 text-neon-purple" />,
      borderColor: 'border-purple-500/25',
      glowColor: 'hover:shadow-[0_0_20px_rgba(176,38,255,0.25)]',
      hoverBorder: 'hover:border-neon-purple/50',
    },
    {
      to: '/molecule',
      title: 'Molecular Viewer',
      description: 'Explore multi-dimensional ball-and-stick renderings of common solvents, greenhouse gases, and complex compounds.',
      icon: <Atom className="w-8 h-8 text-neon-pink" />,
      borderColor: 'border-pink-500/25',
      glowColor: 'hover:shadow-[0_0_20px_rgba(255,0,85,0.25)]',
      hoverBorder: 'hover:border-neon-pink/50',
    },
    {
      to: '/quiz',
      title: 'Evaluation Station',
      description: 'Test your organic synthesis and reaction outcome predictions under high-pressure neon diagnostics.',
      icon: <Award className="w-8 h-8 text-neon-green" />,
      borderColor: 'border-green-500/25',
      glowColor: 'hover:shadow-[0_0_20px_rgba(57,255,20,0.25)]',
      hoverBorder: 'hover:border-neon-green/50',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center justify-start overflow-hidden px-6 py-12 md:px-16 lg:px-24">
      {/* Background Neon Glow Circles */}
      <div className="absolute top-1/4 left-1/4 w-[35vw] h-[35vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Grid Layout: Left Hero Info, Right 3D Visual */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left text column */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/35 bg-cyan-950/25 text-neon-cyan text-xs font-orbitron font-semibold tracking-wider w-fit shadow-[0_0_10px_rgba(0,240,255,0.15)] animate-pulse">
            <Terminal className="w-3.5 h-3.5" /> SYSTEM VERSION: 2.4.0-BETA
          </div>
          
          <h1 className="font-orbitron font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            The Quantum Space for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-cyan-400 to-neon-purple drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              Digital Chemistry
            </span>
          </h1>
          
          <p className="text-gray-400 text-base md:text-lg max-w-xl font-light leading-relaxed">
            Welcome to the future of chemical analysis. Interactive 3D molecular structures, automated core logic tutoring, and simulated thermal environments are ready for deployment.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-2">
            <Link 
              to="/lab"
              className="flex items-center gap-2 px-6 py-3 font-orbitron font-bold text-sm tracking-wider text-black bg-neon-cyan hover:bg-cyan-400 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              LAUNCH REACTOR <ChevronRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/tutor"
              className="flex items-center gap-2 px-6 py-3 font-orbitron font-bold text-sm tracking-wider text-white border border-cyan-500/40 hover:border-neon-cyan bg-cyan-950/15 hover:bg-cyan-950/30 rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.1)] hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              CONSULT CORE AI
            </Link>
          </div>
        </div>

        {/* Right 3D Visual column */}
        <div className="lg:col-span-5 w-full flex justify-center items-center relative select-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 rounded-full blur-[80px] pointer-events-none scale-75" />
          <div className="w-full max-w-[450px] aspect-square relative z-10 animate-float">
            <OrbitingAtom />
          </div>
        </div>

      </div>

      {/* Feature section */}
      <div className="w-full max-w-7xl mt-24 z-10 flex flex-col gap-10">
        <div className="flex flex-col gap-2 text-center lg:text-left">
          <h2 className="font-orbitron font-extrabold text-2xl tracking-wider text-white">
            OPERATIONAL TIERS
          </h2>
          <div className="h-0.5 w-24 bg-gradient-to-r from-neon-cyan to-transparent mx-auto lg:mx-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Link 
              key={idx}
              to={feature.to}
              className={`flex flex-col gap-4 p-6 rounded-xl border ${feature.borderColor} bg-dark-panel/40 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 hover:bg-dark-panel/60 ${feature.hoverBorder} ${feature.glowColor} group`}
            >
              <div className="w-12 h-12 rounded-lg bg-gray-950/50 flex items-center justify-center border border-gray-800/80 transition-all duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white group-hover:text-white transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed flex-grow">
                {feature.description}
              </p>
              <div className="flex items-center gap-1 text-xs font-orbitron text-gray-500 group-hover:text-neon-cyan transition-colors mt-2">
                INITIALIZE MODULE <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
