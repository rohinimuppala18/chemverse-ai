import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Cpu, Send, HelpCircle, Key, Eye, EyeOff, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const PRESET_QUERIES = [
  {
    question: "Explain Covalent vs. Ionic bonds.",
    answer: `Covalent and Ionic bonds represent the two primary methods elements use to achieve stable valence electron configurations:

1. **Covalent Bonding**:
   * Occurs primarily between **non-metals**.
   * Atoms **share** electron pairs (e.g., $H_2O$, $CH_4$).
   * Leads to molecules with distinct shape structures (dictated by VSEPR theory).
   * Typically lower melting points and non-conductive.

2. **Ionic Bonding**:
   * Occurs between a **metal** and a **non-metal**.
   * Electrostatic attraction between positive cations and negative anions.
   * Total transfer of electrons (e.g., $Na$ transfer to $Cl$ to form $NaCl$).
   * Forms repeating crystalline lattice configurations.
   * High melting points, highly conductive when molten or dissolved in water.`
  },
  {
    question: "How do I balance photosynthesis?",
    answer: `Here is the step-by-step molecular breakdown for the Photosynthesis equation:

**Unbalanced Equation**:
$$\\text{CO}_2 + \\text{H}_2\\text{O} \\xrightarrow{\\text{Light}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + \\text{O}_2$$

**Balancing Procedure**:
1. Check Carbon count: We have 6 carbons in Glucose ($C_6H_{12}O_6$), so we require 6 Carbon Dioxide molecules:
   $$\\mathbf{6}\\text{CO}_2 + \\text{H}_2\\text{O} \\to \\text{C}_6\\text{H}_{12}\\text{O}_6 + \\text{O}_2$$
2. Check Hydrogen count: Glucose contains 12 Hydrogens. We must balance this with 6 Water molecules:
   $$\\mathbf{6}\\text{CO}_2 + \\mathbf{6}\\text{H}_2\\text{O} \\to \\text{C}_6\\text{H}_{12}\\text{O}_6 + \\text{O}_2$$
3. Check Oxygen count: Left side contains $12 + 6 = 18$ oxygens. Right side currently has 6 (in glucose) + 2 (in $O_2$) = 8 oxygens. To get 18 oxygens, we require 6 Oxygen molecules ($O_2$):
   $$\\mathbf{6}\\text{CO}_2 + \\mathbf{6}\\text{H}_2\\text{O} \\xrightarrow{\\text{Light}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + \\mathbf{6}\\text{O}_2$$

This balances the equation perfectly!`
  },
  {
    question: "What is Le Chatelier's Principle?",
    answer: `**Le Chatelier's Principle** states that if a dynamic chemical system in equilibrium experiences a change in concentration, temperature, volume, or partial pressure, the equilibrium will shift to counteract that change and establish a new equilibrium state.

* **Concentration**: Adding a reactant shifts the reaction to the **products** side. Removing products pulls the reaction to the **products** side.
* **Temperature**: 
  * In an **Exothermic** reaction (heat is a product), adding heat shifts it to the **reactants**.
  * In an **Endothermic** reaction (heat is a reactant), adding heat shifts it to the **products**.
* **Pressure**: Increasing pressure shifts the equilibrium to the side with **fewer moles of gas**.`
  },
  {
    question: "Explain Electrophilic Aromatic Substitution.",
    answer: `**Electrophilic Aromatic Substitution (EAS)** is an organic reaction where an atom (typically hydrogen) attached to an aromatic ring (like benzene) is replaced by an electrophile.

**General Mechanism Stages**:
1. **Electrophile Generation**: A strong electrophile ($E^+$) is generated, often using a Lewis acid catalyst (e.g., $FeBr_3$ for bromination).
2. **Electrophilic Attack**: The benzene $\\pi$ electron cloud acts as a nucleophile, attacking the electrophile. This breaks aromaticity, creating a resonance-stabilized **Sigma Complex** (arenium ion).
3. **Deprotonation**: A base in solution removes the proton from the carbon that was attacked, restoring the stable aromatic ring conjugation.

Common examples include Nitration, Halogenation, Sulfonation, and Friedel-Crafts Alkylation/Acylation.`
  }
];

export const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "ChemVerse AI Tutor Core operational. Enter a Google Gemini API Key in the settings panel to connect live neural capabilities, or use the preset quick queries for local system demonstrations.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  // API Key States
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [tempKey, setTempKey] = useState<string>('');
  const [hideKeyChars, setHideKeyChars] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSaveKey = () => {
    if (tempKey.trim()) {
      localStorage.setItem('gemini_api_key', tempKey.trim());
      setApiKey(tempKey.trim());
      setTempKey('');
      setShowKeyInput(false);
      
      const statusMsg: ChatMessage = {
        sender: 'ai',
        text: "[SYSTEM LOG] - Gemini Neural API Key linked successfully. Operational mode shifted to: LIVE NEURAL INTERFACE.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, statusMsg]);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setShowKeyInput(false);
    
    const statusMsg: ChatMessage = {
      sender: 'ai',
      text: "[SYSTEM LOG] - API Key purged from local storage. Neural link closed. Mode returned to: LOCAL OFFLINE DEMO.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, statusMsg]);
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Case 1: Live Gemini API Key is available
    if (apiKey) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: `You are "ChemVerse Core AI", a highly advanced chemistry neural tutor in a dark-neon sci-fi laboratory app. 
                           Answer the following chemistry question in a clear, extremely structured, and pedagogical manner. 
                           Format compounds with standard notation. Use markdown lists and headings. 
                           Question: ${textToSend}`
                  }
                ]
              }
            ]
          }
        );

        const aiReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiReply) {
          const aiMsg: ChatMessage = {
            sender: 'ai',
            text: aiReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages((prev) => [...prev, aiMsg]);
        } else {
          throw new Error("Invalid response format received from Gemini.");
        }
      } catch (err: any) {
        console.error("Gemini API Error:", err);
        const errorMsg: ChatMessage = {
          sender: 'ai',
          text: `[ERROR] - Live Neural query failed.\n\nDetails: ${err.response?.data?.error?.message || err.message || "Unknown Network Exception."}\n\nPlease check that your API key is correct and not blocked, or clear the key to return to local offline demo mode.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }
      return;
    }

    // Case 2: Offline Demo - Check presets
    const matchedPreset = PRESET_QUERIES.find(
      (q) => textToSend.toLowerCase().includes(q.question.toLowerCase().split(' ')[1] || '---') ||
             q.question.toLowerCase().includes(textToSend.toLowerCase()) ||
             textToSend.toLowerCase().includes(q.question.toLowerCase())
    );

    setTimeout(() => {
      let aiText = `[LOCAL DEMO FALLBACK]\n\nI received your question: "${textToSend}".\n\nTo fetch live neural dynamic responses, please link a **Google Gemini API Key** using the settings panel in the upper right. \n\nAlternatively, select one of the core queries on the left panel (e.g. Covalent vs. Ionic, Photosynthesis, EAS) to see pre-programmed deep learning chemistry breakdowns!`;
      
      if (matchedPreset) {
        aiText = matchedPreset.answer;
      }

      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center justify-start overflow-hidden px-4 py-8 md:px-12 lg:px-24">
      {/* Glow Rings */}
      <div className="absolute top-1/4 right-10 w-[25vw] h-[25vw] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[25vw] h-[25vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl flex flex-col gap-6 z-10 h-[calc(100vh-140px)] min-h-[550px]">
        
        {/* Page Title & Controls */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-800/60 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg border border-purple-500 bg-purple-950/30 flex items-center justify-center text-neon-purple shadow-[0_0_15px_rgba(176,38,255,0.3)] animate-pulse">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h1 className="font-orbitron font-extrabold text-2xl tracking-wider text-white">AI CORE TUTOR</h1>
              <p className="text-gray-400 text-xs font-light">Interactive chemical tutor powered by Google Gemini API.</p>
            </div>
          </div>

          {/* Connection Status indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-orbitron font-bold transition-all duration-300
                ${apiKey 
                  ? 'border-green-500/40 text-neon-green bg-green-950/10 shadow-[0_0_10px_rgba(57,255,20,0.15)]' 
                  : 'border-yellow-500/40 text-yellow-500 bg-yellow-950/10'
                }
              `}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{apiKey ? 'LINKED' : 'OFFLINE DEMO'}</span>
            </button>
          </div>
        </div>

        {/* API Key Modal dropdown */}
        {showKeyInput && (
          <div className="w-full glass-panel border border-cyan-500/20 rounded-xl p-5 flex flex-col gap-4 text-left shadow-[0_0_20px_rgba(0,240,255,0.1)] shrink-0">
            <div className="flex justify-between items-center">
              <span className="font-orbitron text-xs text-cyan-400 font-bold tracking-wider uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> LINK NEURAL DECRYPTOR KEY
              </span>
              <span className="text-[9px] text-gray-500">SAVED LOCALLY IN CLIENT STORAGE</span>
            </div>
            <div className="h-px bg-cyan-500/20 w-full" />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <input
                  type={hideKeyChars ? 'password' : 'text'}
                  value={apiKey ? '••••••••••••••••••••••••••••••••' : tempKey}
                  disabled={!!apiKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="Paste your Google Gemini API Key here..."
                  className="w-full bg-gray-900/60 border border-gray-800 focus:border-neon-cyan/50 rounded-lg pl-4 pr-10 py-2.5 text-xs text-white focus:outline-none transition-all font-mono"
                />
                {!apiKey && (
                  <button
                    type="button"
                    onClick={() => setHideKeyChars(!hideKeyChars)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
                  >
                    {hideKeyChars ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                {apiKey ? (
                  <button
                    onClick={handleClearKey}
                    className="px-4 py-2.5 rounded-lg border border-pink-500/40 text-neon-pink font-bold text-xs tracking-wider hover:bg-pink-950/20 hover:border-neon-pink transition-all duration-300"
                  >
                    UNLINK KEY
                  </button>
                ) : (
                  <button
                    onClick={handleSaveKey}
                    disabled={!tempKey.trim()}
                    className="px-4 py-2.5 rounded-lg bg-neon-cyan hover:bg-cyan-400 text-black font-extrabold text-xs tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    ESTABLISH LINK
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow overflow-hidden">
          
          {/* Left: suggestions */}
          <div className="lg:col-span-1 flex flex-col gap-3 text-left">
            <span className="font-orbitron text-xs text-purple-400 tracking-wider font-semibold uppercase flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" /> Core Queries
            </span>
            <div className="h-px bg-purple-500/20 w-full mb-1" />
            
            <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {PRESET_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q.question)}
                  className="whitespace-nowrap lg:whitespace-normal text-left text-xs bg-dark-panel/40 hover:bg-purple-950/20 border border-purple-500/20 hover:border-neon-purple/50 rounded-lg p-3 text-gray-300 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.2)] shrink-0 lg:shrink"
                >
                  {q.question}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Terminal Chat Interface */}
          <div className="lg:col-span-3 flex flex-col glass-panel border border-cyan-500/25 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.05)] h-full">
            
            {/* Terminal Top bar */}
            <div className="bg-gray-950/95 px-5 py-3 border-b border-cyan-500/20 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="font-mono text-[10px] text-cyan-400/85 ml-3 flex items-center gap-1.5">
                  tutor_neural_matrix.sh {apiKey ? <Wifi className="w-3 h-3 text-neon-green" /> : <WifiOff className="w-3 h-3 text-yellow-500" />}
                </span>
              </div>
              <div className="font-orbitron text-[10px] text-gray-500 tracking-widest uppercase">
                {apiKey ? 'NEURAL LINK ACTIVE' : 'LOCAL SIMULATOR'}
              </div>
            </div>

            {/* Chat Messages container */}
            <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4 bg-dark-panel/10 font-sans">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col max-w-[90%] text-left gap-1.5 ${
                    msg.sender === 'user' 
                      ? 'self-end items-end' 
                      : 'self-start items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[10px] font-orbitron tracking-wide text-gray-500">
                    <span>{msg.sender === 'user' ? 'USER_AGENT' : 'CHEM_CORE_AI'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div 
                    className={`px-4 py-3 rounded-xl text-sm leading-relaxed border shadow-md whitespace-pre-wrap
                      ${msg.sender === 'user' 
                        ? 'bg-cyan-950/30 text-neon-cyan border-cyan-500/35 shadow-[0_0_15px_rgba(0,240,255,0.05)] rounded-tr-none' 
                        : 'bg-dark-panel/90 text-gray-200 border-gray-805/80 rounded-tl-none font-light leading-relaxed'
                      }
                    `}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="self-start flex flex-col items-start gap-1.5">
                  <div className="text-[10px] font-orbitron text-gray-500">CHEM_CORE_AI • Analysing matrix...</div>
                  <div className="bg-dark-panel/90 border border-gray-800/85 px-4 py-3 rounded-xl rounded-tl-none flex items-center gap-1.5 shadow-md">
                    <div className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-4 bg-gray-950/95 border-t border-cyan-500/20 flex gap-3 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={apiKey ? "Ask Live Gemini chemistry questions..." : "Ask offline query (or link API Key in settings)..."}
                className="flex-grow bg-gray-900/60 border border-gray-800 focus:border-neon-cyan/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all font-sans"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="px-5 rounded-lg bg-neon-cyan hover:bg-cyan-400 text-black font-semibold flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
