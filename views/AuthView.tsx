
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
  const [message, setMessage] = useState<string | null>(null);
  const [configMissing, setConfigMissing] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setConfigMissing(true);
      setError("System Configuration Error: Supabase keys are missing from the environment.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || configMissing) return;
    
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        
        if (data?.session) {
          onLogin(email);
        } else {
          setMessage("Account created successfully. Please check your email for a verification link.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onLogin(email);
      }
    } catch (err: any) {
      console.error("Authentication failed", err);
      setError(err.message || "Unable to complete authentication. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      });
      if (resetError) throw resetError;
      setMessage("A password recovery link has been dispatched to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to initiate password reset.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
      <header className="w-full border-b border-solid border-gray-200 dark:border-border-dark px-6 md:px-10 py-4 flex items-center justify-between bg-white dark:bg-background-dark shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-8 text-primary">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
            </svg>
          </div>
          <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-tight">JewelShot AI</h2>
        </div>
        <div className="hidden md:block">
          <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20 uppercase tracking-widest">Enterprise Studio</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[440px] bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-border-dark overflow-hidden transition-all duration-300">
          <div className="pt-10 pb-6 px-8 text-center">
            <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight mb-2">JewelShot AI</h1>
            <p className="text-gray-600 dark:text-gray-400 text-base font-medium">
              {isSignUp ? "Join the premier AI jewelry studio" : "Sign in to your professional account"}
            </p>
          </div>
          
          <form className="px-8 pb-10 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-gray-700 dark:text-gray-200 text-sm font-semibold ml-1">Work Email</label>
              <input 
                className="w-full rounded-xl border border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 text-base transition-all placeholder:text-gray-400" 
                placeholder="name@company.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={configMissing}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-gray-700 dark:text-gray-200 text-sm font-semibold">Password</label>
                {!isSignUp && (
                  <button 
                    className="text-primary text-xs font-bold hover:underline transition-all" 
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={configMissing}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <input 
                  className="w-full rounded-xl border border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary h-12 pl-4 pr-12 text-base transition-all placeholder:text-gray-400" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={configMissing}
                />
                <button 
                  type="button"
                  className="absolute right-3 text-gray-400 hover:text-primary transition-colors flex items-center justify-center p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                <span className="material-symbols-outlined text-sm mt-0.5">error</span>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}
            {message && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                <span className="material-symbols-outlined text-sm mt-0.5">check_circle</span>
                <span className="leading-relaxed">{message}</span>
              </div>
            )}

            <div className="pt-2 space-y-5">
              <button 
                className="w-full bg-primary hover:bg-opacity-95 text-white font-black py-4 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] text-base disabled:opacity-50 disabled:cursor-not-allowed group" 
                type="submit"
                disabled={isLoading || configMissing}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>{isSignUp ? "Create Professional Account" : "Enter Studio"}</span>
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                )}
              </button>
              
              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-gray-200 dark:border-border-dark"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">OR</span>
                <div className="flex-grow border-t border-gray-200 dark:border-border-dark"></div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  {isSignUp ? "Already a studio member?" : "New to JewelShot?"} 
                  <button 
                    className="text-primary font-black ml-2 hover:underline transition-all" 
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError(null);
                      setMessage(null);
                    }}
                    disabled={configMissing}
                  >
                    {isSignUp ? "Sign In" : "Request Access"}
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-500 dark:text-gray-500 text-xs shrink-0">
        <p className="font-medium">© 2024 JewelShot AI Studio. High-fidelity rendering for luxury brands.</p>
        <div className="mt-3 space-x-6 flex justify-center">
          <a className="hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms</a>
          <a className="hover:text-primary transition-colors" href="#">Security</a>
        </div>
      </footer>
    </div>
  );
};

export default AuthView;
