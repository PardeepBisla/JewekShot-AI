
import React, { useState, useCallback, useEffect } from 'react';
import { AppView, Project, PhotoshootConfig } from './types';
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import CreatePhotoshootView from './views/CreatePhotoshootView';
import ProcessingView from './views/ProcessingView';
import ResultsView from './views/ResultsView';
import { generateJewelryPhoto } from './services/geminiService';
import { supabase } from './services/supabaseClient';

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
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ email: session.user.email || '' });
        setCurrentView(AppView.DASHBOARD);
      }
      setIsInitializing(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email || '' });
        setCurrentView(AppView.DASHBOARD);
      } else {
        setUser(null);
        setCurrentView(AppView.AUTH);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (email: string) => {
    setUser({ email });
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentView(AppView.AUTH);
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

      // Add to mock projects
      const newProject: Project = {
        id: Date.now().toString(),
        name: `New Photoshoot ${projects.length + 1}`,
        thumbnail: generatedImages[0],
        lastEdited: 'Just now',
        renderCount: generatedImages.length,
        status: 'Completed'
      };
      setProjects(prev => [newProject, ...prev]);
      
      setCurrentView(AppView.RESULTS);
    } catch (error) {
      alert("Error generating image: " + (error instanceof Error ? error.message : "Unknown error"));
      setCurrentView(AppView.CREATE);
    }
  }, [projects]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-primary animate-pulse">
           <span className="material-symbols-outlined text-6xl">diamond</span>
        </div>
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
