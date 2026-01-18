
import React from 'react';
import { Project } from '../types';

interface DashboardViewProps {
  projects: Project[];
  onCreateNew: () => void;
  onLogout: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ projects, onCreateNew, onLogout }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-solid border-slate-200 dark:border-[#292348] bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-[960px] mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="size-8 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">diamond</span>
            </div>
            <h1 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">JewelShot AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20 cursor-pointer" 
              style={{ backgroundImage: 'url("https://picsum.photos/seed/user123/100/100")' }}
              onClick={onLogout}
              title="Click to logout"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[960px] mx-auto px-6 py-8">
        <section className="mb-12 flex flex-col items-center justify-center py-10 rounded-2xl bg-primary/5 border border-primary/10">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready for a new project?</h2>
            <p className="text-slate-500 dark:text-slate-400">Generate professional jewelry photos in minutes using AI.</p>
          </div>
          <button 
            onClick={onCreateNew}
            className="flex min-w-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-primary text-white gap-3 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 font-bold text-lg"
          >
            <span className="material-symbols-outlined">add_a_photo</span>
            <span className="truncate">Create New Photoshoot</span>
          </button>
        </section>

        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-tight">Recent Projects</h2>
          <button className="text-primary text-sm font-semibold hover:underline">View All</button>
        </div>

        <div className="flex flex-col gap-4">
          {projects.map(project => (
            <div key={project.id} className="group flex items-stretch justify-between gap-5 rounded-xl bg-white dark:bg-[#1e1933] p-5 shadow-sm border border-slate-200 dark:border-white/5 hover:border-primary/40 transition-colors">
              <div 
                className="w-32 sm:w-48 bg-slate-100 dark:bg-slate-800 bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg overflow-hidden flex-shrink-0" 
                style={{ backgroundImage: `url("${project.thumbnail}")` }}
              />
              <div className="flex flex-1 flex-col justify-between py-1">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">{project.name}</p>
                    <span className="bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-green-200 dark:border-green-500/20">
                      {project.status}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-[#9b92c9] text-sm font-normal leading-normal">Last edited {project.lastEdited} • {project.renderCount} renders</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center justify-center rounded-lg h-9 px-5 bg-primary text-white text-sm font-bold transition-opacity hover:opacity-90">
                    <span>View</span>
                  </button>
                  <button className="flex items-center justify-center rounded-lg h-9 w-9 bg-slate-100 dark:bg-[#292348] text-slate-600 dark:text-white text-sm font-medium hover:bg-slate-200 dark:hover:bg-[#342d5a]">
                    <span className="material-symbols-outlined text-lg">download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full max-w-[960px] mx-auto px-6 py-10 mt-10 border-t border-slate-200 dark:border-white/5 text-center">
        <p className="text-slate-400 text-xs">JewelShot AI Alpha v0.1.2 • © 2024 JewelShot Technologies</p>
        <div className="mt-4 flex justify-center gap-6 text-slate-400 text-xs">
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-primary transition-colors" href="#">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default DashboardView;
