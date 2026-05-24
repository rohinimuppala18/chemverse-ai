import React, { useRef, useState, useEffect } from 'react';

export interface AtomData {
  element: 'H' | 'C' | 'O' | 'N';
  pos: [number, number, number];
}

export interface BondData {
  start: number;
  end: number;
}

export interface Molecule {
  id: string;
  name: string;
  formula: string;
  description: string;
  mass: string;
  atoms: AtomData[];
  bonds: BondData[];
  xyz: string;
}

export const MOLECULES: Record<string, Molecule> = {
  water: {
    id: 'water',
    name: 'Water',
    formula: 'H₂O',
    description: 'A polar inorganic compound that is a tasteless and odorless liquid at room temperature. It is the essential solvent for life on Earth.',
    mass: '18.015 g/mol',
    atoms: [],
    bonds: [],
    xyz: `3
Water
O  0.000000  0.000000  0.117790
H  0.000000  0.755453 -0.471160
H  0.000000 -0.755453 -0.471160`
  },
  co2: {
    id: 'co2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    description: 'An acidic colorless gas with a density about 53% higher than that of dry air. Occurs naturally in Earth\'s atmosphere as a trace gas.',
    mass: '44.009 g/mol',
    atoms: [],
    bonds: [],
    xyz: `3
Carbon Dioxide
C  0.000000  0.000000  0.000000
O  0.000000  0.000000  1.160000
O  0.000000  0.000000 -1.160000`
  },
  methane: {
    id: 'methane',
    name: 'Methane',
    formula: 'CH₄',
    description: 'A group-14 hydride, the simplest alkane, and the main constituent of natural gas. It is a potent greenhouse gas.',
    mass: '16.04 g/mol',
    atoms: [],
    bonds: [],
    xyz: `5
Methane
C  0.000000  0.000000  0.000000
H  0.629100  0.629100  0.629100
H -0.629100 -0.629100  0.629100
H -0.629100  0.629100 -0.629100
H  0.629100 -0.629100 -0.629100`
  },
  ethanol: {
    id: 'ethanol',
    name: 'Ethanol',
    formula: 'C₂H₅OH',
    description: 'A clear, colorless liquid and the principle ingredient in alcoholic beverages. Widely used as a solvent and biofuel.',
    mass: '46.07 g/mol',
    atoms: [],
    bonds: [],
    xyz: `9
Ethanol
C -0.750000 -0.200000  0.000000
C  0.750000  0.350000  0.000000
O  1.700000 -0.650000  0.000000
H  2.500000 -0.200000  0.000000
H -0.700000 -1.200000  0.300000
H -1.200000  0.200000  0.700000
H -1.200000  0.200000 -0.700000
H  0.900000  0.900000 -0.800000
H  0.900000  0.900000  0.800000`
  },
  ammonia: {
    id: 'ammonia',
    name: 'Ammonia',
    formula: 'NH₃',
    description: 'A compound of nitrogen and hydrogen. A colorless gas with a characteristic pungent smell, it is a stable binary hydride.',
    mass: '17.031 g/mol',
    atoms: [],
    bonds: [],
    xyz: `4
Ammonia
N  0.000000  0.200000  0.000000
H  0.800000 -0.300000  0.000000
H -0.400000 -0.300000  0.700000
H -0.400000 -0.300000 -0.700000`
  }
};

interface MoleculeCanvasProps {
  molecule?: Molecule;
  sdfData?: string;
  viewMode: 'ballStick' | 'spaceFill' | 'wireframe';
  surfaceType: 'none' | 'vdw' | 'sas' | 'ses';
  autoRotate: boolean;
}

export const MoleculeCanvas: React.FC<MoleculeCanvasProps> = ({ 
  molecule, 
  sdfData,
  viewMode, 
  surfaceType,
  autoRotate 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const viewerRef = useRef<any>(null);

  // Load 3Dmol.js script from official CDN dynamically
  useEffect(() => {
    const existingScript = document.getElementById('3dmol-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://3dmol.org/build/3Dmol-min.js';
      script.id = '3dmol-script';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  // Initialize and update 3Dmol viewer whenever props or coordinates change
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current) return;

    // Ensure global $3Dmol exists
    const $3Dmol = (window as any).$3Dmol;
    if (!$3Dmol) return;

    let viewer = viewerRef.current;
    if (!viewer) {
      // Clear container only on initial creation
      containerRef.current.innerHTML = '';
      const config = { backgroundColor: '#07070a' };
      viewer = $3Dmol.createViewer(containerRef.current, config);
      viewerRef.current = viewer;
    } else {
      // Clear existing models and surfaces to reuse the WebGL context cleanly
      viewer.clear();
      viewer.removeAllSurfaces();
    }

    // Load chemical structure data (XYZ or SDF format)
    if (sdfData) {
      viewer.addModel(sdfData, 'sdf');
    } else if (molecule && molecule.xyz) {
      viewer.addModel(molecule.xyz, 'xyz');
    } else {
      return;
    }

    // Apply chemical rendering style mapping
    let modelStyle = {};
    if (viewMode === 'ballStick') {
      modelStyle = { stick: { radius: 0.15, colorscheme: 'Jmol' }, sphere: { radius: 0.25, colorscheme: 'Jmol' } };
    } else if (viewMode === 'spaceFill') {
      modelStyle = { sphere: { scale: 0.9, colorscheme: 'Jmol' } };
    } else if (viewMode === 'wireframe') {
      modelStyle = { line: { colorscheme: 'Jmol' } };
    }
    viewer.setStyle({}, modelStyle);

    // Apply volumetric electronic/molecular surfaces
    if (surfaceType === 'vdw') {
      viewer.addSurface($3Dmol.SurfaceType.VDW, {
        opacity: 0.45,
        color: '0x00f0ff' // Neon cyan
      });
    } else if (surfaceType === 'sas') {
      viewer.addSurface($3Dmol.SurfaceType.SAS, {
        opacity: 0.45,
        color: '0xff0055' // Neon pink
      });
    } else if (surfaceType === 'ses') {
      viewer.addSurface($3Dmol.SurfaceType.SES, {
        opacity: 0.45,
        color: '0xb026ff' // Neon purple
      });
    }

    // Rotate/Spin simulation
    viewer.spin(autoRotate ? [0.15, 0.15, 0] : false);

    // Zoom and draw render frame
    viewer.zoomTo();
    viewer.render();

    // Clean up animation spin on update
    return () => {
      if (viewerRef.current) {
        viewerRef.current.spin(false);
      }
    };
  }, [scriptLoaded, molecule, sdfData, viewMode, surfaceType, autoRotate]);

  // Handle component unmount to completely free WebGL memory
  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        viewerRef.current.clear();
        viewerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] border border-cyan-500/20 rounded-2xl glass-panel relative overflow-hidden shadow-[0_0_25px_rgba(0,240,255,0.1)]">
      {/* 3Dmol.js HTML5 Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full min-h-[400px] bg-[#07070a]" 
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      />

      {/* Loading telemetry overlay */}
      {!scriptLoaded && (
        <div className="absolute inset-0 bg-[#07070a]/95 flex flex-col justify-center items-center gap-2 z-30">
          <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce" />
          <span className="font-orbitron text-xs text-cyan-400 tracking-widest animate-pulse">
            LOADING WebGL 3Dmol MATRIX...
          </span>
        </div>
      )}

      {/* Interactive HUD Overlay */}
      <div className="absolute top-4 left-4 z-10 font-orbitron text-[10px] text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-500/20 backdrop-blur-sm pointer-events-none uppercase">
        WebGL 3Dmol: ACTIVE | SPIN: {autoRotate ? 'ON' : 'OFF'}
      </div>
      <div className="absolute bottom-4 right-4 z-10 font-orbitron text-[10px] text-purple-400 bg-purple-950/40 px-3 py-1.5 rounded-lg border border-purple-500/20 backdrop-blur-sm pointer-events-none uppercase">
        {molecule ? `MASS: ${molecule.mass}` : 'PUBCHEM SPECTRUM LOADED'}
      </div>
    </div>
  );
};
