
import React from 'react';

const ProcessingView: React.FC = () => {
  return (
    <div className="bg-obsidian text-slate-100 min-h-screen flex items-center justify-center p-12 relative overflow-hidden">
      {/* Background Deep Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[1000px] bg-primary/5 rounded-full blur-[200px] animate-pulse-slow"></div>
      
      <div className="max-w-xl w-full text-center space-y-16 relative z-10">
        <div className="space-y-8">
          <div className="text-primary ai-glow inline-block">
            <span className="material-symbols-outlined text-8xl font-light">flare</span>
          </div>
          <h2 className="text-3xl font-light tracking-[0.6em] text-white uppercase">Synthesizing</h2>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.8em]">Core Photonic Calculations Active</p>
        </div>

        <div className="bg-surface/30 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-16 space-y-16 luxury-shadow metallic-border">
           <div className="flex flex-col items-center">
              <div className="size-24 border border-primary/10 rounded-full flex items-center justify-center mb-12 relative">
                 <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                 <div className="absolute inset-[-10px] border border-white/5 rounded-full opacity-20 animate-pulse"></div>
                 <span className="material-symbols-outlined text-primary text-4xl">diamond</span>
              </div>
              <p className="text-[12px] font-bold text-primary uppercase tracking-[0.6em] animate-pulse">Mapping Geometry</p>
           </div>
           
           <div className="space-y-6">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.6em] text-white/20">
                <span>Rendering Voxel Array</span>
                <span className="animate-pulse">Active Path-Trace</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rose-gold-gradient w-2/3 rounded-full animate-progress-stream"></div>
              </div>
           </div>
        </div>

        <div className="flex justify-center gap-12 opacity-10">
           <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl">view_in_ar</span>
              <span className="text-[8px] font-bold uppercase tracking-widest">3D Mesh</span>
           </div>
           <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl">light_mode</span>
              <span className="text-[8px] font-bold uppercase tracking-widest">Ray Cast</span>
           </div>
           <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl">layers</span>
              <span className="text-[8px] font-bold uppercase tracking-widest">Synthesis</span>
           </div>
        </div>
        
        <p className="text-[10px] text-white/10 uppercase tracking-[1em] font-bold">
          Obsidian Neural Compute Node v4.1
        </p>
        
        <style>{`
          @keyframes progress-stream {
            0% { transform: translateX(-150%); }
            100% { transform: translateX(250%); }
          }
          .animate-progress-stream {
            animation: progress-stream 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProcessingView;
