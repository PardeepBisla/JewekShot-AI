
import React from 'react';
import { PhotoshootConfig } from '../types';

interface ResultsViewProps {
  images: string[];
  config: PhotoshootConfig | null;
  onNew: () => void;
  onHome: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ images, config, onNew, onHome }) => {
  const variantLabels = ['Primary Angle', 'Technical Top', 'Macro Detail'];

  return (
    <div className="bg-obsidian text-slate-100 min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/5 px-12 py-6 flex justify-between items-center bg-obsidian/80 backdrop-blur-3xl">
        <button onClick={onHome} className="flex items-center gap-5 hover:opacity-70 transition-all group">
          <div className="text-primary ai-glow group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl font-light">diamond</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/50">Synthesis Vault</span>
        </button>
        <div className="flex items-center gap-8">
          <button 
            onClick={onNew}
            className="h-12 px-10 rose-gold-gradient text-obsidian text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-primary/5 hover:scale-105 transition-all"
          >
            New Project
          </button>
          <button onClick={onHome} className="size-12 rounded-2xl border border-white/5 bg-surface/40 flex items-center justify-center hover:border-primary/40 transition-all group">
             <span className="material-symbols-outlined text-white/20 text-2xl group-hover:text-primary transition-colors">grid_view</span>
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-12 py-32">
        <div className="mb-32 text-center space-y-6">
           <p className="text-primary text-[11px] font-bold uppercase tracking-[0.8em] animate-pulse">Process Finalized</p>
           <h1 className="text-7xl font-light tracking-tight text-white mb-6 uppercase">Asset Library</h1>
           <p className="text-[11px] text-white/20 font-bold uppercase tracking-[0.5em] italic">Product: {config?.placement} // Algorithm: Absolute Fidelity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {images.map((img, idx) => (
            <div key={idx} className="group bg-surface/20 border border-white/5 rounded-[4rem] overflow-hidden luxury-shadow hover:border-primary/20 transition-all duration-1000 metallic-border">
              <div className="aspect-[4/5] bg-obsidian relative overflow-hidden spotlight">
                 <img src={img} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Render" />
                 <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent opacity-80" />
                 <div className="absolute top-10 left-10 px-6 py-2 bg-obsidian/40 backdrop-blur-2xl border border-white/5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-primary ai-glow">
                    {variantLabels[idx]}
                 </div>
              </div>
              <div className="p-14 flex flex-col gap-10">
                <div>
                   <h3 className="text-2xl font-light tracking-[0.3em] text-white mb-3 uppercase">{variantLabels[idx]}</h3>
                   <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em]">8K Master Asset // Professional Finish</p>
                </div>
                <a 
                  href={img} 
                  download={`jewelshot-master-${idx}.png`}
                  className="flex items-center justify-center gap-4 h-16 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-white/10 hover:text-primary transition-all group overflow-hidden relative"
                >
                  <span className="material-symbols-outlined text-2xl group-hover:translate-y-1 transition-transform">download</span>
                  Export Asset
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-56 flex flex-col items-center gap-14">
          <div className="flex flex-col sm:flex-row gap-10">
            <button onClick={onNew} className="h-20 px-16 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-[0.5em] rounded-3xl hover:bg-primary/5 transition-all active:scale-[0.97]">
               Initiate New Synthesis
            </button>
            <button onClick={onHome} className="h-20 px-16 border border-white/5 text-white/20 text-[11px] font-bold uppercase tracking-[0.5em] rounded-3xl hover:text-white hover:border-white/10 transition-all active:scale-[0.97]">
               Vault Repository
            </button>
          </div>
          <p className="text-[10px] text-white/5 uppercase tracking-[1em] font-bold">Secure Hardware Storage v3.2</p>
        </div>
      </main>
    </div>
  );
};

export default ResultsView;
