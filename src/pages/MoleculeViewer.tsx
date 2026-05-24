import React, { useState } from 'react';
import axios from 'axios';
import { MoleculeCanvas, MOLECULES } from '../components/MoleculeCanvas';
import { Atom, Compass, Info, RotateCw, LayoutGrid, Search, Loader, ShieldAlert } from 'lucide-react';

export const MoleculeViewer: React.FC = () => {
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>('water');
  const [viewMode, setViewMode] = useState<'ballStick' | 'spaceFill' | 'wireframe'>('ballStick');
  const [surfaceType, setSurfaceType] = useState<'none' | 'vdw' | 'sas' | 'ses'>('none');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Dynamic PubChem Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchedSdf, setSearchedSdf] = useState<string | null>(null);
  const [searchedMeta, setSearchedMeta] = useState<{
    name: string;
    formula: string;
    mass: string;
    description: string;
  } | null>(null);
  const [isLoadingPubChem, setIsLoadingPubChem] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const selectedMolecule = selectedMoleculeId ? MOLECULES[selectedMoleculeId] : undefined;

  const handlePubChemSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoadingPubChem(true);
    setSearchError(null);
    setSearchedSdf(null);
    setSearchedMeta(null);

    try {
      // 1. Fetch 3D SDF structure data
      const sdfResponse = await axios.get(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(searchQuery.trim())}/record/SDF/?record_type=3d`
      );

      // 2. Fetch Compound properties (Formula, Mass, IUPAC Name)
      const propertiesResponse = await axios.get(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(searchQuery.trim())}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`
      );

      const props = propertiesResponse.data?.PropertyTable?.Properties?.[0];
      const formula = props?.MolecularFormula || 'N/A';
      const mass = props?.MolecularWeight ? `${props.MolecularWeight} g/mol` : 'N/A';
      const iupac = props?.IUPACName || 'N/A';

      setSearchedSdf(sdfResponse.data);
      setSearchedMeta({
        name: searchQuery.trim().charAt(0).toUpperCase() + searchQuery.trim().slice(1),
        formula,
        mass,
        description: `This organic molecule was fetched dynamically in 3D using PubChem REST architecture.\n\nIUPAC Catalog Name: ${iupac}.\n\nIt is now rendered in real-time WebGL using high-performance coordinate calculations.`
      });

      setSelectedMoleculeId(''); // Unselect presets
    } catch (err: any) {
      console.error(err);
      setSearchError("Chemical signature not indexed in the PubChem 3D coordinate database. Try 'aspirin', 'caffeine', 'benzene', 'nicotine', or 'glucose'.");
    } finally {
      setIsLoadingPubChem(false);
    }
  };

  const handleSelectPreset = (id: string) => {
    setSelectedMoleculeId(id);
    setSearchedSdf(null);
    setSearchedMeta(null);
    setSearchError(null);
    setSearchQuery('');
  };

  const currentName = searchedMeta ? searchedMeta.name : (selectedMolecule ? selectedMolecule.name : 'Water');
  const currentFormula = searchedMeta ? searchedMeta.formula : (selectedMolecule ? selectedMolecule.formula : 'H₂O');
  const currentMass = searchedMeta ? searchedMeta.mass : (selectedMolecule ? selectedMolecule.mass : '18.015 g/mol');
  const currentDesc = searchedMeta ? searchedMeta.description : (selectedMolecule ? selectedMolecule.description : '');

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center justify-start overflow-hidden px-6 py-8 md:px-12 lg:px-24">
      {/* Background neon blur */}
      <div className="absolute top-1/4 left-10 w-[20vw] h-[20vw] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[20vw] h-[20vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-7xl flex flex-col gap-8 z-10">
        
        {/* Title bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800/60 pb-6">
          <div className="flex flex-col gap-2 text-left">
            <h1 className="font-orbitron font-extrabold text-3xl tracking-wider text-white flex items-center gap-3">
              <Atom className="w-8 h-8 text-neon-pink animate-[spin_8s_linear_infinite]" /> MOLECULAR VISUALIZER
            </h1>
            <p className="text-gray-400 text-sm font-light">
              Analyze multi-dimensional chemical structures dynamically fetched from PubChem via 3Dmol.js WebGL rendering.
            </p>
          </div>
        </div>

        {/* Core Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Directory, PubChem Search & Render Settings (4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Dynamic Search Box */}
            <div className="glass-panel border border-pink-500/20 rounded-xl p-6 flex flex-col gap-4 text-left shadow-[0_0_20px_rgba(255,0,85,0.05)] shrink-0">
              <h2 className="font-orbitron font-bold text-sm tracking-wider text-pink-500 flex items-center gap-2">
                <Search className="w-4 h-4" /> QUANTUM DATABASE SEARCH
              </h2>
              <div className="h-px bg-pink-500/20 w-full" />
              
              <form onSubmit={handlePubChemSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search (e.g. aspirin, benzene, glucose)..."
                  className="flex-grow bg-gray-900/60 border border-gray-800 focus:border-neon-pink/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:shadow-[0_0_10px_rgba(255,0,85,0.1)] transition-all font-sans"
                />
                <button
                  type="submit"
                  disabled={isLoadingPubChem || !searchQuery.trim()}
                  className="px-4 rounded-lg bg-neon-pink hover:bg-pink-600 text-white font-extrabold text-xs flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(255,0,85,0.25)] disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105"
                >
                  {isLoadingPubChem ? <Loader className="w-4 h-4 animate-spin" /> : 'QUERY'}
                </button>
              </form>

              {searchError && (
                <div className="p-3 rounded-lg border border-red-500/20 bg-red-950/15 text-[10px] text-pink-300 leading-normal flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{searchError}</span>
                </div>
              )}
            </div>

            {/* Molecule Selector Card (Presets) */}
            <div className="glass-panel border border-pink-500/20 rounded-xl p-6 flex flex-col gap-4 text-left shadow-[0_0_20px_rgba(255,0,85,0.05)]">
              <h2 className="font-orbitron font-bold text-sm tracking-wider text-pink-500 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" /> PRESET SPECTRUIMS
              </h2>
              <div className="h-px bg-pink-500/20 w-full" />
              
              <div className="flex flex-col gap-2">
                {Object.values(MOLECULES).map((mol) => (
                  <button
                    key={mol.id}
                    onClick={() => handleSelectPreset(mol.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border font-orbitron font-semibold text-xs tracking-wider transition-all duration-300 flex justify-between items-center
                      ${selectedMoleculeId === mol.id
                        ? 'border-pink-500/40 text-neon-pink bg-pink-950/20 shadow-[0_0_15px_rgba(255,0,85,0.15)]'
                        : 'border-gray-800 text-gray-400 hover:text-white hover:border-gray-700/50 bg-gray-950/40'
                      }
                    `}
                  >
                    <span>{mol.name.toUpperCase()}</span>
                    <span className="font-sans text-[10px] text-gray-500">{mol.formula}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Display & Physics Controls */}
            <div className="glass-panel border border-cyan-500/20 rounded-xl p-6 flex flex-col gap-4 text-left shadow-[0_0_20px_rgba(0,240,255,0.05)]">
              <h2 className="font-orbitron font-bold text-sm tracking-wider text-cyan-400 flex items-center gap-2">
                <Compass className="w-4 h-4" /> RENDER PARAMETERS
              </h2>
              <div className="h-px bg-cyan-500/20 w-full" />

              {/* View Mode Radio */}
              <div className="flex flex-col gap-2">
                <span className="font-orbitron text-xs text-gray-400 tracking-wide font-semibold">VIEW MODEL STYLE</span>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <button
                    onClick={() => setViewMode('ballStick')}
                    className={`py-2 px-1 border rounded-lg font-orbitron font-bold text-[9px] tracking-wider transition-all duration-300
                      ${viewMode === 'ballStick'
                        ? 'border-cyan-500/40 text-neon-cyan bg-cyan-950/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                        : 'border-gray-800 text-gray-500 hover:text-gray-300 bg-gray-950/20'
                      }
                    `}
                  >
                    STICK
                  </button>
                  <button
                    onClick={() => setViewMode('spaceFill')}
                    className={`py-2 px-1 border rounded-lg font-orbitron font-bold text-[9px] tracking-wider transition-all duration-300
                      ${viewMode === 'spaceFill'
                        ? 'border-cyan-500/40 text-neon-cyan bg-cyan-950/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                        : 'border-gray-800 text-gray-500 hover:text-gray-300 bg-gray-950/20'
                      }
                    `}
                  >
                    SPHERE
                  </button>
                  <button
                    onClick={() => setViewMode('wireframe')}
                    className={`py-2 px-1 border rounded-lg font-orbitron font-bold text-[9px] tracking-wider transition-all duration-300
                      ${viewMode === 'wireframe'
                        ? 'border-cyan-500/40 text-neon-cyan bg-cyan-950/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                        : 'border-gray-800 text-gray-500 hover:text-gray-300 bg-gray-950/20'
                      }
                    `}
                  >
                    WIREFRAME
                  </button>
                </div>
              </div>

              {/* Electrostatics Surfaces */}
              <div className="flex flex-col gap-2">
                <span className="font-orbitron text-xs text-gray-400 tracking-wide font-semibold">ELECTROSTATIC SURFACES</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => setSurfaceType('none')}
                    className={`py-2 border rounded-lg font-orbitron font-bold text-[9px] tracking-wider transition-all duration-300
                      ${surfaceType === 'none'
                        ? 'border-cyan-500/40 text-neon-cyan bg-cyan-950/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                        : 'border-gray-800 text-gray-500 hover:text-gray-300 bg-gray-950/20'
                      }
                    `}
                  >
                    NONE
                  </button>
                  <button
                    onClick={() => setSurfaceType('vdw')}
                    className={`py-2 border rounded-lg font-orbitron font-bold text-[9px] tracking-wider transition-all duration-300
                      ${surfaceType === 'vdw'
                        ? 'border-cyan-500/40 text-neon-cyan bg-cyan-950/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                        : 'border-gray-800 text-gray-500 hover:text-gray-300 bg-gray-950/20'
                      }
                    `}
                  >
                    VDW (CYAN)
                  </button>
                  <button
                    onClick={() => setSurfaceType('sas')}
                    className={`py-2 border rounded-lg font-orbitron font-bold text-[9px] tracking-wider transition-all duration-300
                      ${surfaceType === 'sas'
                        ? 'border-cyan-500/40 text-neon-cyan bg-cyan-950/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                        : 'border-gray-800 text-gray-500 hover:text-gray-300 bg-gray-950/20'
                      }
                    `}
                  >
                    SAS (PINK)
                  </button>
                  <button
                    onClick={() => setSurfaceType('ses')}
                    className={`py-2 border rounded-lg font-orbitron font-bold text-[9px] tracking-wider transition-all duration-300
                      ${surfaceType === 'ses'
                        ? 'border-cyan-500/40 text-neon-cyan bg-cyan-950/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                        : 'border-gray-800 text-gray-500 hover:text-gray-300 bg-gray-950/20'
                      }
                    `}
                  >
                    SES (PURPLE)
                  </button>
                </div>
              </div>

              {/* Auto rotate switch */}
              <div className="flex justify-between items-center mt-2">
                <span className="font-orbitron text-xs text-gray-400 tracking-wide font-semibold flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" /> SPIN MOLECULE LAYER
                </span>
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none flex items-center
                    ${autoRotate ? 'bg-neon-cyan' : 'bg-gray-800'}
                  `}
                >
                  <div 
                    className={`w-4 h-4 rounded-full bg-black transition-transform duration-300 transform
                      ${autoRotate ? 'translate-x-6' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            </div>

          </div>

          {/* Right panel: 3D Canvas & Info (8 columns) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Molecule Visualizer canvas */}
            <div className="w-full aspect-[4/3] max-h-[460px] rounded-2xl relative">
              <MoleculeCanvas 
                molecule={selectedMolecule} 
                sdfData={searchedSdf || undefined}
                viewMode={viewMode} 
                surfaceType={surfaceType}
                autoRotate={autoRotate} 
              />
            </div>

            {/* Molecule Description Cards */}
            <div className="glass-panel border border-pink-500/20 rounded-xl p-6 text-left flex flex-col gap-3 shadow-[0_0_20px_rgba(255,0,85,0.05)]">
              <div className="flex justify-between items-center">
                <span className="font-orbitron text-sm text-pink-500 tracking-wider font-semibold uppercase flex items-center gap-2">
                  <Info className="w-4 h-4" /> COMPOUND DATA SHEET
                </span>
                <span className="font-orbitron text-xs text-gray-500 tracking-wider font-semibold uppercase">
                  STATUS: {searchedMeta ? 'LIVE CATALOGUE' : 'PRESET VERIFIED'}
                </span>
              </div>
              <div className="h-px bg-pink-500/20 w-full my-1" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-1">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-orbitron text-gray-500 tracking-wider">COMPOUND NAME</span>
                  <span className="text-white font-bold text-lg">{currentName}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-orbitron text-gray-500 tracking-wider">CHEMICAL FORMULA</span>
                  <span className="text-neon-pink font-bold text-lg font-orbitron">{currentFormula}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-orbitron text-gray-500 tracking-wider">MOLECULAR WEIGHT</span>
                  <span className="text-white font-bold text-lg font-orbitron">{currentMass}</span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[10px] font-orbitron text-gray-500 tracking-wider block mb-1">CHEMICAL DESCRIPTION</span>
                <p className="text-gray-300 text-sm font-light leading-relaxed whitespace-pre-wrap">
                  {currentDesc}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
