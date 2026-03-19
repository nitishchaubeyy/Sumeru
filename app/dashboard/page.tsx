"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "sonner";
import { Bell, BellOff, X, Sparkles, Trash2, RotateCcw, ArrowRight, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export default function Dashboard() {
  const [sessionTotal, setSessionTotal] = useState<number>(0);
  const [dbTotal, setDbTotal] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false); // 🎯 Darbaan Flag
  
  const [userName, setUserName] = useState("Seeker");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  
  const [showMantraModal, setShowMantraModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showManualSuggestion, setShowManualSuggestion] = useState(false);

  const [mantras, setMantras] = useState<any[]>([]);
  const [activeMantra, setActiveMantra] = useState<any>(null);
  const [customMantra, setCustomMantra] = useState("");
  const [floatingMantras, setFloatingMantras] = useState<{ id: number; text: string }[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const getTodayString = () => new Date().toLocaleDateString('en-CA'); 

  // --- 1. Recovery Logic (Runs ONLY once on mount) ---
  useEffect(() => {
    const saved = localStorage.getItem("sumeru_pending_session");
    if (saved) {
      const val = parseInt(saved);
      if (!isNaN(val)) setSessionTotal(val);
    }
    setIsInitialized(true); // Recovery complete, ab save hona shuru ho sakta hai
    
    fetchData();
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
  }, []);

  // --- 2. Save Logic (Runs whenever sessionTotal changes, but waits for recovery) ---
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("sumeru_pending_session", sessionTotal.toString());
    }
  }, [sessionTotal, isInitialized]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserName(user.user_metadata.full_name.split(" ")[0]);
    
    const today = getTodayString();
    const { data: logs } = await supabase.from("jap_logs").select("count").eq("user_id", user.id).gte("created_at", today);
    const todaySum = logs?.reduce((acc: number, curr: { count: number }) => acc + curr.count, 0) || 0;
    setDbTotal(todaySum);

    const { data: mData } = await supabase.from("mantras").select("*").or(`user_id.is.null,user_id.eq.${user.id}`);
    if (mData) setMantras(mData);
    const { data: pData } = await supabase.from("profiles").select("active_mantra_id").eq("id", user.id).single();
    if (pData?.active_mantra_id && mData) {
      setActiveMantra(mData.find((m) => m.id === pData.active_mantra_id));
    }
  };

  const handleIncrement = () => {
    setSessionTotal((prev) => prev + 1);
    if (isSoundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    if (activeMantra) {
      const id = Date.now();
      setFloatingMantras((prev) => [...prev, { id, text: activeMantra.text }]);
      setTimeout(() => { setFloatingMantras((prev) => prev.filter((m) => m.id !== id)); }, 800);
    }
  };

  const syncToDB = async () => {
    if (sessionTotal === 0) return;
    setIsSyncing(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("jap_logs").insert({ 
      count: sessionTotal, 
      user_id: user?.id, 
      source: "web_dashboard" 
    });

    if (!error) {
      localStorage.removeItem("sumeru_pending_session");
      setDbTotal((prev) => prev + sessionTotal);
      setSessionTotal(0);
      toast.success("Shubh Ho! Save ho gaya.");
    }
    setIsSyncing(false);
  };

  const handleResetToday = async () => {
    setIsSyncing(true);
    const { data: { user } } = await supabase.auth.getUser();
    const today = getTodayString();
    const { error } = await supabase.from("jap_logs").delete().eq("user_id", user?.id).gte("created_at", today);
    if (!error) {
      localStorage.removeItem("sumeru_pending_session");
      setSessionTotal(0);
      setDbTotal(0);
      setShowResetConfirm(false);
      setShowManualSuggestion(true);
      toast.success("Reset Safal!");
    }
    setIsSyncing(false);
  };

  const updateActiveMantra = (mantra: any) => {
    setActiveMantra(mantra);
    setShowMantraModal(false);
    toast.success(`Ab mantra "${mantra.text}" hai.`);
  };

  const addCustomMantra = async () => {
    if (!customMantra) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("mantras").insert({ text: customMantra, user_id: user?.id }).select().single();
    if (!error && data) {
      setMantras((prev) => [...prev, data]);
      updateActiveMantra(data);
      setCustomMantra("");
    }
  };

  const displayCount = dbTotal + sessionTotal;

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-brand-bg selection-orange">
      
      {/* Floating Mantras */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
        <AnimatePresence>
          {floatingMantras.map((m) => (
            <motion.span key={m.id} initial={{ opacity: 0, y: 0, scale: 0.5 }} animate={{ opacity: [0, 1, 0], y: -200, scale: [0.5, 1.2, 1] }} transition={{ duration: 0.8 }} className="absolute text-brand-orange font-black text-3xl md:text-6xl italic drop-shadow-[0_0_20px_rgba(255,165,0,0.6)] text-center">
              {m.text}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <p className="text-brand-orange font-black tracking-widest uppercase mb-2">Radhe Radhe, {userName}</p>
      
      <button onClick={() => setShowMantraModal(true)} className="mb-8 flex items-center gap-2 bg-orange-50 dark:bg-zinc-900 px-8 py-3 rounded-full border border-orange-100 dark:border-zinc-800 hover:scale-105 transition-all shadow-sm">
        <Sparkles className="w-5 h-5 text-brand-orange" />
        <span className="font-black text-base text-zinc-900 dark:text-white">{activeMantra ? activeMantra.text : "Mantra Chunein"}</span>
      </button>

      {/* Main Bead */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-linear-to-r from-orange-400 to-red-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <button onClick={handleIncrement} className="relative w-80 h-80 md:w-96 md:h-96 bg-white dark:bg-zinc-900 rounded-full shadow-2xl border-12 border-orange-50 dark:border-zinc-800 flex flex-col items-center justify-center active:scale-95 transition-all z-10">
          <span className="text-8xl md:text-9xl font-black text-brand-orange leading-none">{displayCount}</span>
          <span className="text-xs font-black opacity-30 dark:opacity-40 uppercase tracking-widest mt-4 text-zinc-500 dark:text-zinc-400">Aaj ka kul jap</span>
        </button>
        <button onClick={() => setIsSoundEnabled(!isSoundEnabled)} className="absolute -top-4 -right-4 p-5 bg-white dark:bg-zinc-900 rounded-full shadow-xl border border-orange-50 dark:border-zinc-700 z-20">
          {isSoundEnabled ? <Bell className="w-6 h-6 text-brand-orange" /> : <BellOff className="w-6 h-6 text-zinc-400" />}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-16 flex flex-col items-center gap-6">
        <div className="flex gap-4">
          <button onClick={syncToDB} disabled={isSyncing || sessionTotal === 0} className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-14 py-5 rounded-4xl font-black text-xl shadow-2xl hover:scale-105 transition-all disabled:opacity-30">
            {isSyncing ? "Saving..." : `Submit ${sessionTotal} Jap`}
          </button>
          <button onClick={() => setShowResetConfirm(true)} className="p-5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-3xl hover:bg-red-100 transition-all shadow-sm border border-red-100 dark:border-red-900/30">
            <RotateCcw className="w-7 h-7" />
          </button>
        </div>
        {sessionTotal > 0 && <p className="text-sm font-black text-brand-orange animate-pulse uppercase tracking-widest">{sessionTotal} Unsaved (Safe in Memory)</p>}
      </div>

      {/* Modals Logic as earlier... */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-4xl p-10 text-center border-4 border-red-500/20 shadow-2xl">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 className="w-10 h-10" /></div>
              <h3 className="text-3xl font-black mb-4 italic text-zinc-900 dark:text-white">Reset Karein?</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 font-bold text-sm italic">⚠️ Aaj ki saari mehnat profile se hat jayegi.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl font-black text-zinc-900 dark:text-white transition-colors hover:bg-zinc-200">Nahi</button>
                <button onClick={handleResetToday} className="flex-1 py-5 bg-red-500 text-white rounded-2xl font-black shadow-lg">Reset</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showManualSuggestion && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-4xl p-10 text-center border-4 border-brand-orange/20 shadow-2xl">
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-6"><Sparkles className="w-10 h-10" /></div>
              <h3 className="text-3xl font-black mb-4 italic text-zinc-900 dark:text-white">Nayi Shuruat!</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 font-bold text-sm">Purane records ke liye Manual Entry par jayein.</p>
              <div className="flex flex-col gap-4">
                <Link href="/dashboard/manual" className="w-full py-5 bg-brand-orange text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">Manual Entry <ArrowRight className="w-6 h-6" /></Link>
                <button onClick={() => setShowManualSuggestion(false)} className="w-full py-4 text-slate-400 font-bold hover:text-slate-600">Theek Hai</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMantraModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-4xl border border-orange-100 p-10 shadow-2xl">
              <div className="mb-10 flex items-center justify-between">
                <h3 className="text-3xl font-black italic text-brand-orange">Mantras</h3>
                <button onClick={() => setShowMantraModal(false)}><X className="h-8 w-8 opacity-40 hover:opacity-100 text-zinc-900 dark:text-white" /></button>
              </div>
              <div className="mb-10 grid grid-cols-2 gap-4">
                {mantras.map((m) => (
                  <button key={m.id} onClick={() => updateActiveMantra(m)} className={`rounded-2xl border-2 p-5 text-sm font-black transition-all ${activeMantra?.id === m.id ? "border-brand-orange bg-orange-50 text-brand-orange" : "border-zinc-50 dark:border-zinc-800 text-zinc-900 dark:text-white"}`}>{m.text}</button>
                ))}
              </div>
              <div className="space-y-4">
                <p className="ml-2 text-xs font-black uppercase tracking-widest text-slate-400">Add Your Isht Naam</p>
                <div className="flex gap-3">
                  <input value={customMantra} onChange={(e) => setCustomMantra(e.target.value)} placeholder="Custom..." className="flex-1 rounded-2xl border-2 border-transparent bg-zinc-50 p-5 text-lg font-black text-zinc-900 dark:text-white outline-none focus:border-brand-orange dark:bg-zinc-800" />
                  <button onClick={addCustomMantra} className="rounded-2xl bg-brand-orange p-5 text-white hover:scale-105 transition-all"><Plus className="w-7 h-7" /></button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}