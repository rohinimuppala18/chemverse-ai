import React from 'react';
import { NavLink } from 'react-router-dom';
import { Atom, FlaskConical, Cpu, Award, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  const links = [
    { to: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { to: '/lab', label: 'Virtual Lab', icon: <FlaskConical className="w-4 h-4" /> },
    { to: '/tutor', label: 'AI Tutor', icon: <Cpu className="w-4 h-4" /> },
    { to: '/molecule', label: 'Molecule Viewer', icon: <Atom className="w-4 h-4" /> },
    { to: '/quiz', label: 'Quiz Station', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cyan-500/25 glass-panel py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg border border-cyan-400 bg-cyan-950/30 text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.4)] animate-pulse">
          <Atom className="w-6 h-6 animate-spin [animation-duration:12s]" />
        </div>
        <span className="font-orbitron font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">
          CHEMVERSE AI
        </span>
      </div>

      <div className="hidden md:flex items-center gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron font-semibold text-sm transition-all duration-300 border border-transparent
              ${isActive 
                ? 'text-neon-cyan bg-cyan-950/40 border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.25)]' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/30 hover:border-gray-700/50'
              }
            `}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Small Screen Layout Indicators */}
      <div className="flex md:hidden gap-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            title={link.label}
            className={({ isActive }) => `
              p-2 rounded-lg border border-transparent transition-all duration-300
              ${isActive 
                ? 'text-neon-cyan bg-cyan-950/40 border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.25)]' 
                : 'text-gray-400 hover:text-white'
              }
            `}
          >
            {link.icon}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
