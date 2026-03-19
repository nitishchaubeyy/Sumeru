"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Target, ShieldCheck, History, Sun, Moon, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push("/dashboard");
    };
    checkUser();
  }, [router, supabase]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text transition-colors duration-500">
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black italic tracking-tighter">
            SUMERU<span className="text-brand-orange">.</span>
          </h1>
          <div className="flex items-center gap-6">
             <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full transition-all"
             >
                {theme === "dark" ? <Sun className="w-5 h-5 text-brand-orange" /> : <Moon className="w-5 h-5 text-zinc-500" />}
             </button>
             <Link href="/login" className="px-6 py-2 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-full text-xs font-black transition-all">
               LOGIN
             </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-48 pb-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/30 text-brand-orange text-[10px] font-black uppercase tracking-widest border border-orange-100 dark:border-orange-900/30">
            Digital Spiritual Companion
          </span>
          <h1 className="text-7xl md:text-9xl font-black mt-8 tracking-tighter italic">
            SUMERU<span className="text-brand-orange">.</span>
          </h1>
          <p className="max-w-xl mx-auto mt-6 text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            Apni bhakti ko ek naya aadhar dein. Digital precision aur ancient wisdom ka milan.
          </p>
          <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
            <Link href="/login" className="px-10 py-5 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-3xl font-black text-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
              Mala Shuru Karein <ArrowRight className="w-5 h-5 text-brand-orange" />
            </Link>
            <Link href="/margdarshan" className="px-10 py-5 bg-orange-50 dark:bg-zinc-900 text-brand-orange dark:text-white rounded-3xl font-black text-lg border border-orange-100 dark:border-zinc-800 hover:scale-105 transition-all flex items-center gap-3">
              <BookOpen className="w-5 h-5" /> Margdarshan
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Vision/Mission styles updated for themes */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black italic">Hamara <span className="text-brand-orange">Sankalp</span></h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium leading-relaxed">
              Sumeru ka janm ek saral soch se hua: "Bhakti mein niyam ho, par dhyan mein vighna na ho." 
            </p>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex gap-4 items-start">
                <Target className="w-6 h-6 text-brand-orange shrink-0" />
                <div><h4 className="font-black text-xl italic">Vision</h4><p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">1 Crore seekers ko unke nitya jap sankalp se jodna.</p></div>
              </div>
              <div className="flex gap-4 items-start">
                <ShieldCheck className="w-6 h-6 text-brand-orange shrink-0" />
                <div><h4 className="font-black text-xl italic">Mission</h4><p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Bhakti ke anubhav ko digital yug mein vyavasthit banana.</p></div>
              </div>
            </div>
          </div>
          <div className="aspect-square bg-orange-50 dark:bg-orange-900/10 rounded-4xl flex items-center justify-center">
             <Sparkles className="w-24 h-24 text-brand-orange animate-pulse" />
          </div>
        </div>
      </section>

      <footer className="pt-24 pb-12 px-6 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-end">
            <div>
              <div className="flex items-center gap-2 text-brand-orange font-black text-xs mb-4 uppercase tracking-widest">
                <History className="w-4 h-4" /> SUMERU UPDATE LOG
              </div>
              <div className="p-8 bg-zinc-900 dark:bg-zinc-800 rounded-4xl text-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-brand-orange rounded-full text-[10px] font-black uppercase">v1.2</span>
                  <span className="text-[10px] opacity-50">19 MARCH 2026</span>
                </div>
                <h4 className="text-lg font-black italic mb-2">Midnight Fix & UI Polish</h4>
                <p className="text-white/60 text-xs font-medium leading-relaxed">Local midnight sync and new mantra animations are now live.</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-4xl font-black italic mb-2 tracking-tighter">SUMERU<span className="text-brand-orange">.</span></h1>
              <p className="text-zinc-400 text-xs font-bold italic">Building the future of digital devotion.</p>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-50 dark:border-zinc-900 text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            © 2026 SUMERU DIGITAL. BORN IN BHARAT.
          </div>
        </div>
      </footer>
    </div>
  );
}