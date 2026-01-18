
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        
        // Handle successful signup
        if (data.session) {
          // If auto-confirm is enabled in Supabase settings
          onLogin(email);
        } else {
          // If email confirmation is required
          setMessage("Account created! Please check your email for a verification link.");
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
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) throw resetError;
      setMessage("Password reset link sent to your email.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
      <header className="w-full border-b border-solid border-gray-200 dark:border-border-dark px-6 md:px-10 py-4 flex items-center justify-between bg-white dark:bg-background-dark">
        <div className="flex items-center gap-3">
          <div className="size-8 text-primary">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
            </svg>
          </div>
          <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-tight">JewelShot AI</h2>
        </div>
        <div className="hidden md:block">
          <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20 uppercase tracking-widest">Alpha MVP</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[440px] bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-border-dark overflow-hidden">
          <div className="pt-10 pb-6 px-8 text-center">
            <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight mb-2">JewelShot AI</h1>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              {isSignUp ? "Create your professional studio account" : "Log in to start your AI photoshoot"}
            </p>
          </div>
          
          <form className="px-8 pb-10 space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 dark:text-gray-200 text-sm font-medium">Email</label>
              <input 
                className="form-input w-full rounded-lg border border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 text-base transition-all placeholder:text-gray-400 dark:placeholder:text-[#9b92c9]" 
                placeholder="name@company.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-gray-700 dark:text-gray-200 text-sm font-medium">Password</label>
                {!isSignUp && (
                  <button 
                    className="text-primary text-xs font-semibold hover:underline" 
                    type="button"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <input 
                  className="form-input w-full rounded-lg border border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary h-12 pl-4 pr-12 text-base transition-all placeholder:text-gray-400 dark:placeholder:text-[#9b92c9]" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div 
                  className="absolute right-3 text-gray-400 dark:text-[#9b92c9] cursor-pointer hover:text-gray-600 dark:hover:text-white flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </div>
              </div>
            </div>

            {/* Error and Success feedback placed below inputs as per checklist requirements */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-medium">
                {message}
              </div>
            )}

            <div className="pt-4 space-y-4">
              <button 
                className="w-full bg-primary hover:bg-opacity-90 text-white font-bold py-3.5 px-4 rounded-lg shadow-md transition-all active:scale-[0.98] text-base disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Wait a moment...</span>
                  </div>
                ) : (isSignUp ? "Create Account" : "Sign In")}
              </button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200 dark:border-border-dark"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-gray-200 dark:border-border-dark"></div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"} 
                  <button 
                    className="text-primary font-bold ml-1 hover:underline" 
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError(null);
                      setMessage(null);
                    }}
                  >
                    {isSignUp ? "Sign In" : "Create Account"}
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500 dark:text-gray-500 text-xs">
        <p>© 2024 JewelShot AI Studio. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default AuthView;
