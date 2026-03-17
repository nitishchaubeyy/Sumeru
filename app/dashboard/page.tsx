"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner"; // Naya import
import Link from "next/link";

export default function Dashboard() {
  const [count, setCount] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [userName, setUserName] = useState("Seeker");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserName(user.user_metadata.full_name.split(" ")[0]);
    };
    getUser();
    
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
  }, []);

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
    setSessionTotal((prev) => prev + 1);
    
    if (isSoundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const syncJapToDB = async () => {
    if (sessionTotal === 0) return;
    setIsSyncing(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from("jap_logs").insert({
      count: sessionTotal,
      user_id: user?.id,
      source: "web_dashboard"
    });

    if (!error) {
      setSessionTotal(0);
      // alert hata kar toast add kiya
      toast.success("Sankalp updated! Aapka Jap save ho gaya hai.");
    } else {
      // Error handling ke liye bhi toast
      toast.error("Sync fail ho gaya: " + error.message);
    }
    setIsSyncing(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col transition-colors duration-300">
      <nav className="p-6 flex justify-between items-center max-w-7xl w-full mx-auto">
        <Link href="/" className="text-2xl font-black text-brand-orange tracking-tighter">SUMERU</Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={() => supabase.auth.signOut().then(() => window.location.href = "/")}
            className="text-sm font-bold opacity-50 hover:opacity-100"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-brand-orange font-bold tracking-widest uppercase mb-2">Radhe Radhe, {userName}</p>
        <h2 className="text-2xl font-medium opacity-60 mb-12 italic">Keep your focus on the sound of the name.</h2>

        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-orange-400 to-red-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <button
            onClick={handleIncrement}
            className="relative w-72 h-72 md:w-80 md:h-80 bg-white dark:bg-zinc-900 rounded-full shadow-2xl border-8 border-orange-50 dark:border-zinc-800 flex flex-col items-center justify-center active:scale-95 transition-transform"
          >
            <span className="text-7xl md:text-8xl font-black text-brand-orange">{count}</span>
            <span className="text-sm font-bold opacity-40 mt-2 uppercase">Total Jap</span>
          </button>

          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="absolute top-4 right-4 p-3 bg-white dark:bg-zinc-900 rounded-full shadow-md border border-orange-100 dark:border-zinc-700 hover:scale-110 active:scale-90 transition-all z-10"
            title={isSoundEnabled ? "Disable Sound" : "Enable Sound"}
          >
            {isSoundEnabled ? (
              <Bell className="w-5 h-5 text-brand-orange" />
            ) : (
              <BellOff className="w-5 h-5 text-zinc-400" />
            )}
          </button>
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="bg-orange-50 dark:bg-zinc-800/50 px-10 py-5 rounded-3xl border border-orange-100 dark:border-zinc-700">
            <p className="text-xs font-bold opacity-50 uppercase tracking-widest mb-1">Session Progress</p>
            <p className="text-4xl font-black text-brand-text dark:text-white">{sessionTotal}</p>
          </div>

          <button
            onClick={syncJapToDB}
            disabled={isSyncing || sessionTotal === 0}
            className={`px-12 py-4 rounded-2xl font-black shadow-xl transition-all ${
              sessionTotal > 0 
              ? "bg-brand-text text-white dark:bg-white dark:text-black hover:scale-105" 
              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
            }`}
          >
            {isSyncing ? "Syncing..." : "Submit to Universe"}
          </button>
        </div>
      </main>
    </div>
  );
}