
import React, { useState, useRef, useEffect } from 'react';
import { PhotoshootConfig } from '../types';

interface CreatePhotoshootViewProps {
  onBack: () => void;
  onSubmit: (config: PhotoshootConfig) => void;
}

const PLACEMENT_PROMPTS: Record<string, string> = {
  hand: 'A stunning high-end diamond ring worn on a finger, soft skin texture, elegant hand pose, warm sunset studio lighting, macro photography, 8k resolution, photorealistic.',
  neck: 'A luxury gold pendant necklace displayed on an elegant jewelry bust, soft cream velvet background, professional studio lighting with rim light, minimalist and sophisticated.',
  ear: 'Exquisite diamond stud earrings, close-up macro shot, professional jewelry photography, brilliant sparkles and light refraction, clean minimalist background, sharp focus.',
  studio: 'A luxury jewelry piece displayed on a polished white marble pedestal, dramatic side lighting, soft bokeh background, architectural studio setup, ultra-high resolution.'
};

const CreatePhotoshootView: React.FC<CreatePhotoshootViewProps> = ({ onBack, onSubmit }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [placement, setPlacement] = useState('neck');
  const [style, setStyle] = useState('soft');
  const [prompt, setPrompt] = useState(PLACEMENT_PROMPTS['neck']);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update prompt when placement changes, but only if the user hasn't manually edited it significantly 
  // or just as a helpful preset whenever they switch categories.
  const handlePlacementChange = (newPlacement: string) => {
    setPlacement(newPlacement);
    setPrompt(PLACEMENT_PROMPTS[newPlacement] || PLACEMENT_PROMPTS['studio']);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!imagePreview) {
      alert("Please upload a jewelry image first.");
      return;
    }
    onSubmit({
      jewelryImage: imagePreview,
      placement,
      style,
      prompt
    });
  };

  return (
    <div className="flex h-screen flex-col bg-background-light dark:bg-background-dark font-display text-white transition-colors duration-300">
      <header className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-[#292348] px-6 lg:px-10 py-4 shrink-0">
        <div className="flex items-center gap-4 cursor-pointer" onClick={onBack}>
          <div className="size-8 text-primary">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
            </svg>
          </div>
          <h2 className="text-slate-900 dark:text-white text-xl font-black leading-tight tracking-tight">JewelShot AI</h2>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-200 dark:bg-[#292348] text-slate-700 dark:text-white hover:bg-primary hover:text-white transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-200 dark:bg-[#292348] text-slate-700 dark:text-white hover:bg-primary hover:text-white transition-colors">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-[1280px] mx-auto px-6 py-8">
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Create Photoshoot</h1>
            <p className="text-slate-600 dark:text-[#9b92c9] text-base font-normal leading-normal">Configure your jewelry AI photoshoot parameters</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: Input Card */}
            <div className="bg-white dark:bg-[#1e1933] rounded-xl border border-slate-200 dark:border-[#3b3267] p-6 flex flex-col gap-6 shadow-sm">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">Input Configuration</h3>
              
              <div className="flex flex-col">
                <div 
                  className={`flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-slate-300 dark:border-[#3b3267] px-6 py-10 bg-slate-50 dark:bg-[#141122] transition-colors ${imagePreview ? 'border-primary/50' : ''}`}
                >
                  {imagePreview ? (
                    <div className="relative group w-full flex justify-center">
                      <img src={imagePreview} className="max-h-48 rounded-md object-contain" alt="Jewelry preview" />
                      <button 
                        onClick={() => setImagePreview(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex max-w-[480px] flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-[#9b92c9]">cloud_upload</span>
                      <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] text-center">Upload Jewelry Image</p>
                      <p className="text-slate-500 dark:text-[#9b92c9] text-sm font-normal leading-normal text-center">Select your jewelry photo or sketch to enhance</p>
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
                  >
                    <span className="truncate">{imagePreview ? 'Replace File' : 'Select File'}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="flex flex-col w-full">
                    <p className="text-slate-700 dark:text-white text-base font-medium leading-normal pb-2">Jewelry Placement</p>
                    <select 
                      value={placement}
                      onChange={(e) => handlePlacementChange(e.target.value)}
                      className="flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-[#3b3267] bg-white dark:bg-[#1e1933] h-14 p-4 text-base font-normal focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                    >
                      <option value="hand">Hand (Rings/Bracelets)</option>
                      <option value="neck">Neck (Necklaces)</option>
                      <option value="ear">Ear (Earrings)</option>
                      <option value="studio">Studio Display (Pedestal)</option>
                    </select>
                  </label>
                </div>

                <div className="flex flex-col">
                  <label className="flex flex-col w-full">
                    <p className="text-slate-700 dark:text-white text-base font-medium leading-normal pb-2">Background Style</p>
                    <select 
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-[#3b3267] bg-white dark:bg-[#1e1933] h-14 p-4 text-base font-normal focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                    >
                      <option value="white">Clean White Studio</option>
                      <option value="soft">Soft Minimalist</option>
                      <option value="lifestyle">Lifestyle Context</option>
                      <option value="marble">Elegant Marble</option>
                      <option value="velvet">Luxury Velvet</option>
                    </select>
                  </label>
                </div>

                <div className="flex flex-col">
                  <label className="flex flex-col w-full">
                    <div className="flex justify-between items-center pb-2">
                      <p className="text-slate-700 dark:text-white text-base font-medium leading-normal">Style Prompt</p>
                      <button 
                        type="button" 
                        onClick={() => setPrompt(PLACEMENT_PROMPTS[placement])}
                        className="text-primary text-xs font-bold hover:underline"
                      >
                        Reset to Preset
                      </button>
                    </div>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full min-h-32 bg-white dark:bg-[#1e1933] border border-slate-200 dark:border-[#3b3267] rounded-xl p-4 text-slate-900 dark:text-white resize-none text-base font-normal focus:ring-2 focus:ring-primary outline-none"
                      placeholder="Describe the environment, lighting, and mood..."
                    />
                  </label>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                className="w-full flex cursor-pointer items-center justify-center rounded-lg h-14 bg-primary text-white text-lg font-black uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Generate Photos
              </button>
            </div>

            {/* Right Column: Preview Placeholder */}
            <div className="bg-white dark:bg-[#1e1933] rounded-xl border border-slate-200 dark:border-[#3b3267] p-6 flex flex-col gap-6 shadow-sm h-full min-h-[500px]">
              <div className="flex justify-between items-center">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold">AI Output Preview</h3>
                <span className="px-3 py-1 bg-slate-100 dark:bg-background-dark text-slate-500 dark:text-[#9b92c9] text-xs font-bold rounded-full uppercase tracking-tighter">Ready</span>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center border border-slate-100 dark:border-[#3b3267] bg-slate-50/50 dark:bg-[#141122] rounded-lg relative overflow-hidden">
                <div className="flex flex-col items-center gap-3 text-slate-300 dark:text-[#3b3267]">
                  <span className="material-symbols-outlined text-8xl">image</span>
                  <p className="text-slate-400 dark:text-[#3b3267] text-sm font-medium">Result will appear here</p>
                </div>
              </div>

              <button className="w-full flex items-center justify-center rounded-lg h-12 bg-slate-200 dark:bg-[#292348] text-slate-400 dark:text-[#5b5289] text-sm font-bold uppercase tracking-wider cursor-not-allowed transition-all" disabled>
                <span className="material-symbols-outlined mr-2">download</span>
                Download Result
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="fixed bottom-4 right-6 pointer-events-none opacity-40">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-[4px]">JewelShot Alpha MVP v1.0.1</p>
      </footer>
    </div>
  );
};

export default CreatePhotoshootView;
