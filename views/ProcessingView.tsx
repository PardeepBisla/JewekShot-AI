
import React from 'react';

const ProcessingView: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full mx-auto flex flex-col items-center">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            High-Fidelity Studio Engine
          </div>
          <h2 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">Simulating Real Physics</h2>
          <p className="text-xl text-slate-500 dark:text-[#9b92c9] max-w-xl mx-auto">We are calculating gemstone refraction, metal caustics, and organic skin textures for maximum realism.</p>
        </div>

        <div className="w-full max-w-2xl p-12 rounded-3xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-2xl flex flex-col items-center justify-center space-y-10">
          <div className="relative">
            <svg className="spinner w-24 h-24" viewBox="0 0 50 50">
              <circle cx="25" cy="25" fill="none" r="20" strokeWidth="3" className="stroke-primary/20"></circle>
              <circle cx="25" cy="25" fill="none" r="20" strokeWidth="3" strokeDasharray="90, 150" strokeLinecap="round" className="stroke-primary"></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">flare</span>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Rendering Photorealistic Material...</h3>
            <p className="text-base text-primary font-bold animate-pulse">Processing light paths and macro details</p>
          </div>

          <div className="w-full space-y-4">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#9b92c9]">
              <span>Geometry</span>
              <span>Lighting</span>
              <span>Final Render</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-background-dark rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
              <div className="h-full bg-primary w-3/4 rounded-full shadow-[0_0_15px_rgba(55,19,236,0.5)] transition-all duration-1000"></div>
            </div>
          </div>

          <p className="text-sm text-slate-400 text-center italic">"True beauty lies in the details that AI often overlooks."</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingView;
