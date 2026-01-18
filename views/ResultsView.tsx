
import React from 'react';
import { PhotoshootConfig } from '../types';

interface ResultsViewProps {
  images: string[];
  config: PhotoshootConfig | null;
  onNew: () => void;
  onHome: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ images, config, onNew, onHome }) => {
  // Map the generated images to their intended categories
  const variantLabels = ['Close-up Detail', 'Studio Display', 'Lifestyle Portrait'];

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen">
      <header className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-[#292348] px-10 py-4 bg-background-light dark:bg-background-dark">
        <div className="flex items-center gap-4 cursor-pointer" onClick={onHome}>
          <div className="size-6 text-primary">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">JewelShot AI</h2>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-200 dark:bg-[#292348] text-slate-700 dark:text-white transition-colors hover:bg-primary/20">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-200 dark:bg-[#292348] text-slate-700 dark:text-white transition-colors hover:bg-primary/20">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-10 px-6">
        <div className="w-full max-w-[1200px]">
          <div className="flex flex-col gap-2 mb-10 px-4 text-center">
            <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">Professional Renders</h1>
            <p className="text-slate-500 dark:text-[#9b92c9] text-lg font-normal">We've generated three distinct photoshoot styles for your piece.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
            {images.map((img, idx) => (
              <div key={idx} className="flex flex-col bg-white dark:bg-[#1c1830] rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 transition-all hover:-translate-y-2">
                <div className="w-full aspect-[4/5] bg-slate-100 dark:bg-[#292348] flex items-center justify-center relative group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: `url("${img}")` }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-white opacity-0 group-hover:opacity-100 transition-opacity">zoom_in</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-4">
                  <div>
                    <span className="inline-block px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-2 border border-primary/20">
                      {config?.style} Edition
                    </span>
                    <h3 className="text-slate-900 dark:text-white text-xl font-bold">{variantLabels[idx] || `Variant ${idx + 1}`}</h3>
                    <p className="text-slate-500 dark:text-[#9b92c9] text-sm mt-1">High-fidelity marketing render</p>
                  </div>
                  <a 
                    href={img} 
                    download={`jewelshot-${variantLabels[idx]?.replace(/\s+/g, '-').toLowerCase() || idx}.png`}
                    className="flex items-center justify-center rounded-xl h-12 w-full bg-primary text-white gap-2 text-sm font-bold tracking-wide transition-all hover:brightness-110 active:scale-95 shadow-md shadow-primary/30"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                    <span>Save Image</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="flex px-4 py-16 justify-center gap-6">
            <button 
              onClick={onNew}
              className="flex min-w-[260px] cursor-pointer items-center justify-center rounded-full h-16 px-10 bg-white dark:bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white gap-3 text-lg font-bold leading-normal transition-all shadow-lg hover:shadow-primary/20"
            >
              <span className="material-symbols-outlined">add_a_photo</span>
              <span className="truncate">New Photoshoot</span>
            </button>
            <button 
              onClick={onHome}
              className="flex items-center justify-center rounded-full h-16 px-10 border-2 border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 gap-3 text-lg font-bold leading-normal transition-all"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="truncate">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="flex flex-col gap-6 px-5 py-12 text-center border-t border-slate-200 dark:border-[#292348] bg-slate-50 dark:bg-background-dark/50">
        <div className="flex flex-wrap items-center justify-center gap-10 md:flex-row md:justify-around max-w-[960px] mx-auto w-full">
          <a className="text-slate-500 dark:text-[#9b92c9] text-sm font-medium hover:text-primary transition-colors" href="#">Support</a>
          <a className="text-slate-500 dark:text-[#9b92c9] text-sm font-medium hover:text-primary transition-colors" href="#">Documentation</a>
          <a className="text-slate-500 dark:text-[#9b92c9] text-sm font-medium hover:text-primary transition-colors" href="#">API Access</a>
        </div>
        <p className="text-slate-400 dark:text-[#9b92c9]/60 text-xs font-normal">© 2024 JewelShot AI Studio. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ResultsView;
