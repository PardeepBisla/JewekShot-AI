
import React, { useState, useRef } from 'react';
import { PhotoshootConfig } from '../types';

interface CreatePhotoshootViewProps {
  onBack: () => void;
  onSubmit: (config: PhotoshootConfig) => void;
}

const MIN_IMAGES = 2;
const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const PLACEMENT_OPTIONS = [
  { value: 'ring', label: 'Ring (Literal Symmetry)' },
  { value: 'necklace', label: 'Necklace (Architecture)' },
  { value: 'bracelet', label: 'Bracelet (Geometry)' },
  { value: 'earring', label: 'Earrings (Paired Refinement)' },
  { value: 'watch', label: 'Timepiece (Precision)' },
  { value: 'pendant', label: 'Pendant (Focal Point)' }
];

const CreatePhotoshootView: React.FC<CreatePhotoshootViewProps> = ({ onBack, onSubmit }) => {
  const [images, setImages] = useState<string[]>([]);
  const [placement, setPlacement] = useState('ring');
  const [style, setStyle] = useState('white');
  const [prompt, setPrompt] = useState('Produce a hyper-realistic, high-fidelity e-commerce product photo. Ensure 1:1 physical matching with the reference jewelry. White background, neutral lighting, no props.');
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    setError(null);
    if (images.length + files.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} reference assets permitted.`);
      return;
    }
    files.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        setError("Source asset exceeds 10MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = () => {
    if (images.length < MIN_IMAGES) {
      setError(`Minimum ${MIN_IMAGES} source angles required for accurate synthesis.`);
      return;
    }
    onSubmit({ jewelryImages: images, placement, style, prompt });
  };

  return (
    <div className="flex h-screen flex-col bg-obsidian text-slate-100">
      <header className="flex items-center justify-between border-b border-white/5 px-12 py-6 shrink-0 bg-surface/40 backdrop-blur-2xl">
        <button onClick={onBack} className="flex items-center gap-5 hover:opacity-70 transition-all group">
          <div className="text-primary ai-glow group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">diamond</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/50">Project Configurator</span>
        </button>
        <div className="flex items-center gap-8">
          <div className="h-4 w-px bg-white/10"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/10 italic">Core Algorithm v4.2 // Ray-Trace Mode</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-16">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          <div className="lg:col-span-5 space-y-16">
            <section className="space-y-8">
              <div className="flex justify-between items-end">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/30">Asset Lightbox</h3>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{images.length}/{MAX_IMAGES} Registered</span>
              </div>
              
              <div className="grid grid-cols-3 gap-5">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 group bg-surface shadow-2xl">
                    <img src={img} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" alt="Asset" />
                    <button 
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-3 right-3 size-8 bg-obsidian/80 backdrop-blur-xl text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-white/10 hover:border-red-500/50"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-primary/20 backdrop-blur-xl border border-primary/30 text-[9px] font-bold text-primary uppercase tracking-[0.2em] rounded-full">
                        Reference A
                      </div>
                    )}
                  </div>
                ))}
                {images.length < MAX_IMAGES && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] bg-surface/20 hover:bg-surface/40 hover:border-primary/30 transition-all text-white/10 hover:text-primary group"
                  >
                    <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">add</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] mt-4">Append Angle</span>
                  </button>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />
              {error && <p className="text-[10px] font-bold text-primary bg-primary/5 p-5 rounded-2xl border border-primary/10 tracking-widest text-center animate-pulse">{error}</p>}
            </section>

            <section className="space-y-10 bg-surface/30 border border-white/5 p-10 rounded-[3rem] luxury-shadow metallic-border">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/30">Rendering Parameters</h3>
              
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 ml-2">Anatomical Target</label>
                <div className="relative">
                  <select 
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                    className="w-full rounded-2xl bg-obsidian border border-white/5 text-sm h-16 px-6 focus:ring-1 focus:ring-primary focus:border-primary/40 appearance-none text-white font-medium cursor-pointer"
                  >
                    {PLACEMENT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">expand_more</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 ml-2">Synthesis Context</label>
                <div className="relative">
                  <select 
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full rounded-2xl bg-obsidian border border-white/5 text-sm h-16 px-6 focus:ring-1 focus:ring-primary focus:border-primary/40 appearance-none text-white font-medium cursor-pointer"
                  >
                    <option value="white">E-Commerce (Neutral White)</option>
                    <option value="transparent">High-Res Alpha (Transparent)</option>
                    <option value="grey">Studio Grey (Architectural)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">expand_more</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Technical Directive</label>
                  <button onClick={() => setPrompt('Produce a hyper-realistic, high-fidelity e-commerce product photo. Ensure 1:1 physical matching with the reference jewelry. White background, neutral lighting, no props.')} className="text-[9px] font-bold uppercase text-primary tracking-widest hover:underline opacity-40">Default</button>
                </div>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full min-h-[140px] rounded-2xl bg-obsidian border border-white/5 text-xs p-6 focus:ring-1 focus:ring-primary focus:border-primary/40 resize-none leading-relaxed text-white/70 font-medium"
                />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={images.length < MIN_IMAGES}
                className="w-full h-20 rose-gold-gradient text-obsidian font-black rounded-3xl shadow-2xl shadow-primary/10 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-20 text-xs uppercase tracking-[0.5em]"
              >
                Initiate Core Synthesis
              </button>
            </section>
          </div>

          <div className="lg:col-span-7 h-full flex flex-col">
            <div className="bg-surface/20 border border-white/5 rounded-[4rem] flex-1 flex flex-col relative overflow-hidden luxury-shadow spotlight">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-40 pointer-events-none"></div>
              
              <div className="px-12 py-8 border-b border-white/5 flex justify-between items-center bg-surface/40 backdrop-blur-xl relative z-10">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/30">Holographic Workstation</h3>
                <div className="flex gap-3 items-center">
                   <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)] animate-pulse"></div>
                   <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Cluster Active</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center p-24 text-center relative z-10">
                <div className="size-40 rounded-full bg-obsidian border border-white/10 flex items-center justify-center mb-12 shadow-inner spotlight ai-glow">
                  <span className="material-symbols-outlined text-7xl text-primary/20">biotech</span>
                </div>
                <h4 className="text-3xl font-light tracking-[0.3em] uppercase mb-6 text-white">Spatial Mapping</h4>
                <p className="text-[12px] max-w-lg font-medium leading-relaxed text-white/20 uppercase tracking-[0.2em]">
                  The algorithm will parse the selected assets to construct a virtual geometry model. Absolute fidelity rules apply: zero design alterations, literal material reproduction.
                </p>
                <div className="mt-16 flex gap-6">
                  <div className="px-6 py-2 border border-white/5 rounded-full text-[9px] font-bold uppercase tracking-[0.4em] text-white/10">8K Render Output</div>
                  <div className="px-6 py-2 border border-white/5 rounded-full text-[9px] font-bold uppercase tracking-[0.4em] text-white/10">Physical Materiality</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePhotoshootView;
