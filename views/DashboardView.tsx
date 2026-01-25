
import React from 'react';
import { Project } from '../types';

interface DashboardViewProps {
  projects: Project[];
  onCreateNew: () => void;
  onLogout: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ projects, onCreateNew, onLogout }) => {
  return (
    <div className="bg-obsidian text-slate-200 min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-obsidian/80 backdrop-blur-3xl">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-10 py-6">
          <div className="flex items-center gap-5">
            <div className="text-primary ai-glow">
              <span className="material-symbols-outlined text-4xl">diamond</span>
            </div>
            <h1 className="text-xl font-light tracking-[0.4em] text-white uppercase">JewelShot</h1>
          </div>
          <div className="flex items-center gap-12">
            <nav className="hidden lg:flex items-center gap-12">
              {['Inventory', 'Vault', 'Processing', 'Dispatch'].map(link => (
                <a key={link} href="#" className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-primary transition-all">{link}</a>
              ))}
            </nav>
            <div className="h-4 w-px bg-white/10 hidden lg:block"></div>
            <button 
              onClick={onLogout}
              className="size-11 rounded-full border border-white/5 bg-surface/40 flex items-center justify-center hover:border-primary/50 transition-all group"
            >
              <span className="material-symbols-outlined text-white/20 group-hover:text-primary text-2xl">logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-10 py-24">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 mb-24">
          <div className="space-y-6">
            <p className="text-primary text-[11px] font-bold uppercase tracking-[0.6em]">Professional Management</p>
            <h2 className="text-6xl font-light tracking-tight text-white uppercase">Collection Archive</h2>
          </div>
          <button 
            onClick={onCreateNew}
            className="flex items-center justify-center rounded-3xl h-16 px-12 rose-gold-gradient text-obsidian gap-4 shadow-2xl shadow-primary/5 hover:scale-[1.03] active:scale-[0.97] transition-all font-bold text-xs uppercase tracking-[0.3em]"
          >
            <span className="material-symbols-outlined text-2xl">add</span>
            <span>Initiate Synthesis</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10">
          {projects.map(project => (
            <div key={project.id} className="group bg-surface/30 rounded-[3rem] border border-white/5 p-6 luxury-shadow hover:border-primary/20 transition-all duration-700 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 rose-gold-gradient opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-8 bg-obsidian border border-white/5 spotlight">
                <img 
                  src={project.thumbnail} 
                  className="w-full h-full object-cover grayscale-[0.6] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                  alt={project.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-8">
                  <span className="px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                    {project.status}
                  </span>
                </div>
              </div>
              
              <div className="px-4 pb-4">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-light tracking-wide text-white group-hover:text-primary transition-colors uppercase mb-1">{project.name}</h3>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">{project.lastEdited}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-light text-white mb-0.5">{project.renderCount}</p>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Assets</p>
                  </div>
                </div>
                
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <button className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Inspect Collection</button>
                  <button className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 hover:text-primary transition-all">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={onCreateNew}
            className="aspect-[16/12] rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-white/10 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all duration-500 group"
          >
            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl">add_a_photo</span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.4em]">New Synthesis Request</span>
          </button>
        </div>
      </main>

      <footer className="max-w-[1440px] mx-auto px-10 py-32 border-t border-white/5 mt-20 flex flex-col lg:flex-row justify-between items-center gap-12 opacity-20">
        <p className="text-[11px] font-bold uppercase tracking-[0.6em]">Obsidian Intelligence Studio // MMXXIV</p>
        <div className="flex gap-16 text-[10px] font-bold uppercase tracking-[0.4em]">
          <a className="hover:text-primary transition-colors" href="#">Legal Protocol</a>
          <a className="hover:text-primary transition-colors" href="#">Studio API</a>
          <a className="hover:text-primary transition-colors" href="#">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default DashboardView;
