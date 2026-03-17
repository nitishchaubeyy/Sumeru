"use client";

import { createBrowserClient } from "@supabase/ssr"; // Naya import
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  // Client-side par SSR-friendly client banana
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Isse PKCE (Code Flow) pakka trigger hoga
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) console.error("Login Error:", error.message);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col transition-colors duration-300">
      <nav className="p-6 flex justify-between items-center max-w-7xl w-full mx-auto">
        <h1 className="text-2xl font-black text-brand-orange">SUMERU</h1>
        <ThemeToggle />
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 p-12 rounded-[2.5rem] shadow-2xl border border-orange-100 dark:border-zinc-800 max-w-md w-full text-center">
          <div className="text-5xl mb-6">🏔️</div>
          <h2 className="text-4xl font-black mb-4 text-[#121212] dark:text-white">Aaiye!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg">
            Apni spiritual journey ko track karne ke liye login karein.
          </p>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-4 bg-white text-black border-2 border-zinc-200 py-4 rounded-2xl font-bold hover:bg-zinc-50 transition-all active:scale-95 shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}