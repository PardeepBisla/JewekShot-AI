
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

  // Mock initial projects
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Diamond Ring Set A',
      thumbnail: 'https://picsum.photos/seed/ring1/400/300',
      lastEdited: '2 hours ago',
      renderCount: 12,
      status: 'Completed'
    },
    {
      id: '2',
      name: 'Gold Necklace Series',
      thumbnail: 'https://picsum.photos/seed/necklace/400/300',
      lastEdited: 'Yesterday',
      renderCount: 8,
      status: 'Completed'
    },
    {
      id: '3',
      name: 'Minimalist Earrings',
      thumbnail: 'https://picsum.photos/seed/earrings/400/300',
      lastEdited: '3 days ago',
      renderCount: 24,
      status: 'Completed'
    }
  ]);

  // Handle Supabase Auth Session
  useEffect(() => {
    let mounted = true;

    // Check configuration status
    if (!isSupabaseConfigured()) {
      console.warn("Supabase is not configured. Redirecting to Auth View for manual setup or keys.");
      setIsInitializing(false);
      return;
    }

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          setUser({ email: session.user.email || '' });
          setCurrentView(prev => prev === AppView.AUTH ? AppView.DASHBOARD : prev);
        }
      } catch (err) {
        console.error("Initial session check failed", err);
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
      setUser(null);
      setCurrentView(AppView.AUTH);
    }
  };

  const handleStartPhotoshoot = useCallback(async (config: PhotoshootConfig) => {
    if (!config.jewelryImage) return;

    setLastConfig(config);
    setCurrentView(AppView.PROCESSING);

    try {
      const generatedImages = await generateJewelryPhoto(
        config.jewelryImage,
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
      console.error("Photoshoot generation failed", error);
      alert("Error generating image: " + (error instanceof Error ? error.message : "Unknown error"));
      setCurrentView(AppView.CREATE);
    }
  }, [projects]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center gap-6">
        <div className="text-primary animate-bounce">
           <span className="material-symbols-outlined text-6xl">diamond</span>
        </div>
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-[loading_1.5s_ease-in-out_infinite] w-1/3"></div>
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
    <div className="min-h-screen flex flex-col">
      {renderCurrentView()}
    </div>
  );
};

export default App;
