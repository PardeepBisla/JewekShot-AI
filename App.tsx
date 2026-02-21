
import React, { useState, useCallback, useEffect } from 'react';
import { AppView, Project, PhotoshootConfig } from './types';
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import CreatePhotoshootView from './views/CreatePhotoshootView';
import ProcessingView from './views/ProcessingView';
import ResultsView from './views/ResultsView';
import { generateJewelryPhoto } from './services/geminiService';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.AUTH);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [lastConfig, setLastConfig] = useState<PhotoshootConfig | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initial projects catalog
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Diamond Ring Set A',
      thumbnail: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400',
      lastEdited: '2 hours ago',
      renderCount: 12,
      status: 'Completed'
    },
    {
      id: '2',
      name: 'Gold Necklace Series',
      thumbnail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
      lastEdited: 'Yesterday',
      renderCount: 8,
      status: 'Completed'
    },
    {
      id: '3',
      name: 'Minimalist Earrings',
      thumbnail: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=400',
      lastEdited: '3 days ago',
      renderCount: 24,
      status: 'Completed'
    }
  ]);

  // Handle Supabase Auth Session with network failure resilience
  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured()) {
      setIsInitializing(false);
      return;
    }

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted && session?.user) {
          setUser({ email: session.user.email || '' });
          setCurrentView(prev => prev === AppView.AUTH ? AppView.DASHBOARD : prev);
        }
      } catch (err) {
        // Log the error but don't brick the app; allow AuthView to handle login UI
        console.warn("Auth check bypassed or failed (likely network issue). Entering guest-ready state.", err);
      } finally {
        if (mounted) setIsInitializing(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        setUser({ email: session.user.email || '' });
        setCurrentView(prev => (prev === AppView.AUTH ? AppView.DASHBOARD : prev));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setCurrentView(AppView.AUTH);
        setResults([]);
        setLastConfig(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (email: string) => {
    setUser({ email });
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error", err);
      // Fallback: Clear local state anyway
      setUser(null);
      setCurrentView(AppView.AUTH);
    }
  };

  const handleStartPhotoshoot = useCallback(async (config: PhotoshootConfig) => {
    if (config.jewelryImages.length === 0) return;

    setLastConfig(config);
    setCurrentView(AppView.PROCESSING);

    try {
      const generatedImages = await generateJewelryPhoto(
        config.jewelryImages,
        config.placement,
        config.style,
        config.prompt
      );
      
      setResults(generatedImages);

      const newProject: Project = {
        id: Date.now().toString(),
        name: `Photoshoot - ${config.placement}`,
        thumbnail: generatedImages[0],
        lastEdited: 'Just now',
        renderCount: generatedImages.length,
        status: 'Completed'
      };
      setProjects(prev => [newProject, ...prev]);
      
      setCurrentView(AppView.RESULTS);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("Photoshoot generation failed", error);
      
      // Better error handling for the user
      alert(`Synthesis Error: ${msg}\n\nPlease check your internet connection or API key status.`);
      setCurrentView(AppView.CREATE);
    }
  }, [projects]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center gap-10">
        <div className="text-primary spotlight-glow animate-pulse">
           <span className="material-symbols-outlined text-7xl font-light">diamond</span>
        </div>
        <div className="space-y-3 text-center">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em]">Establishing Secure Connection</p>
          <div className="w-64 h-[1px] bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rose-gold-gradient animate-[loading_2s_infinite] w-1/3"></div>
          </div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case AppView.AUTH:
        return <AuthView onLogin={handleLogin} />;
      case AppView.DASHBOARD:
        return (
          <DashboardView 
            projects={projects} 
            onCreateNew={() => setCurrentView(AppView.CREATE)} 
            onLogout={handleLogout}
          />
        );
      case AppView.CREATE:
        return (
          <CreatePhotoshootView 
            onBack={() => setCurrentView(AppView.DASHBOARD)} 
            onSubmit={handleStartPhotoshoot}
          />
        );
      case AppView.PROCESSING:
        return <ProcessingView />;
      case AppView.RESULTS:
        return (
          <ResultsView 
            images={results} 
            config={lastConfig}
            onNew={() => setCurrentView(AppView.CREATE)}
            onHome={() => setCurrentView(AppView.DASHBOARD)}
          />
        );
      default:
        return <AuthView onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20">
      {renderCurrentView()}
    </div>
  );
};

export default App;
