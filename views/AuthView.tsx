
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface AuthViewProps {
  onLogin: (email: string) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        if (data?.session) onLogin(email);
        else setError("Verification link sent to email.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        onLogin(email);
      }
    } catch (err: any) {
      setError(err.message || "Studio access denied.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-obsidian min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Cinematic Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-primary/5 rounded-full blur-[160px] pointer-events-none animate-pulse-slow"></div>

      <div className="w-full max-w-[420px] relative z-10">
        <div className="mb-14 text-center">
          <div className="inline-flex items-center justify-center size-16 mb-10 text-primary ai-glow">
            <span className="material-symbols-outlined text-6xl leading-none">diamond</span>
          </div>
          <h1 className="text-4xl font-light tracking-[0.4em] text-white uppercase mb-4">
            JewelShot
          </h1>
          <p className="text-primary/40 text-[11px] font-bold uppercase tracking-[0.5em]">
            Precision Synthesis Studio
          </p>
        </div>

        <div className="bg-surface/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] luxury-shadow overflow-hidden group hover:border-white/10 transition-all duration-700">
          <form className="p-12 space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label className="text-white/30 text-[9px] font-bold uppercase tracking-[0.3em] ml-2">Studio Identity</label>
              <input 
                className="w-full rounded-2xl border border-white/5 bg-obsidian/40 text-white focus:ring-1 focus:ring-primary focus:border-primary/50 h-14 px-6 text-sm transition-all placeholder:text-white/10" 
                placeholder="email@brand.luxury" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-white/30 text-[9px] font-bold uppercase tracking-[0.3em] ml-2">Access Key</label>
              <div className="relative">
                <input 
                  className="w-full rounded-2xl border border-white/5 bg-obsidian/40 text-white focus:ring-1 focus:ring-primary focus:border-primary/50 h-14 pl-6 pr-14 text-sm transition-all placeholder:text-white/10" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold flex items-start gap-4 uppercase tracking-widest leading-relaxed">
                <span className="material-symbols-outlined text-base">info</span>
                {error}
              </div>
            )}

            <button 
              className="w-full rose-gold-gradient text-obsidian font-bold py-5 px-4 rounded-2xl shadow-xl shadow-primary/10 transition-all active:scale-[0.97] hover:brightness-110 text-[11px] uppercase tracking-[0.3em] disabled:opacity-40" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : (isSignUp ? 'Create Studio' : 'Initiate Session')}
            </button>
          </form>

          <div className="px-12 pb-12 pt-0 text-center">
            <button 
              className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] hover:text-primary transition-all underline-offset-8 hover:underline"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Existing Member? Access' : 'Inquire for Enterprise Membership'}
            </button>
          </div>
        </div>
        
        <p className="mt-16 text-center text-white/5 text-[10px] font-bold uppercase tracking-[0.8em]">
          Obsidian Protocol v4.0.0
        </p>
      </div>
    </div>
  );
};

export default AuthView;
