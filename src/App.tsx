import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { VirtualLab } from './pages/VirtualLab';
import { AITutor } from './pages/AITutor';
import { MoleculeViewer } from './pages/MoleculeViewer';
import { Quiz } from './pages/Quiz';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#07070a] text-gray-100 flex flex-col font-space antialiased selection:bg-cyan-500/30 selection:text-white">
        {/* Futuristic Top Nav Header */}
        <Navbar />

        {/* Dynamic Route Pages */}
        <main className="flex-grow w-full flex flex-col items-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lab" element={<VirtualLab />} />
            <Route path="/tutor" element={<AITutor />} />
            <Route path="/molecule" element={<MoleculeViewer />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
