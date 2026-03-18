"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "sonner";
import { Bell, BellOff, X, Sparkles, Trash2, RotateCcw, ArrowRight, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export default function Dashboard() {
  const [count, setCount] = useState(0); // Today's Running Total (Big Number)
  const [sessionTotal, setSessionTotal] = useState(0); // Only current unsaved session
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

  // Helper: Get local date string for DB filtering
  const getTodayString = () => new Date().toLocaleDateString('en-CA'); 

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserName(user.user_metadata.full_name.split(" ")[0]);

    const today = getTodayString();
    
    // Fetch all logs for today to set the initial Big Counter
    const { data: logs } = await supabase
      .from("jap_logs")
      .select("count")
      .eq("user_id", user.id)
      .gte("created_at", today);

    const todaySum = logs?.reduce((acc: number, curr: { count: number }) => acc + curr.count, 0) || 0;
    setCount(todaySum); // Initial load: DB total for today

    // Fetch Mantras
    const { data: mData } = await supabase.from("mantras").select("*").or(`user_id.is.null,user_id.eq.${user.id}`);
    if (mData) setMantras(mData);

    // Fetch Active Mantra
    const { data: pData } = await supabase.from("profiles").select("active_mantra_id").eq("id", user.id).single();
    if (pData?.active_mantra_id && mData) {
      setActiveMantra(mData.find((m) => m.id === pData.active_mantra_id));
    }
  };

  useEffect(() => {
    fetchData();
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
  }, []);

  const handleIncrement = () => {
    setCount((prev) => prev + 1); // Increment Big Counter
    setSessionTotal((prev) => prev + 1); // Increment Session tracker
    
    if (isSoundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    if (activeMantra) {
      const id = Date.now();
      setFloatingMantras((prev) => [...prev, { id, text: activeMantra.text }]);
      setTimeout(() => {
        setFloatingMantras((prev) => prev.filter((m) => m.id !== id));
      }, 800);
    }
  };

  // --- 🎯 SUBMIT: Saves session, but KEEPS big counter ---
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
      setSessionTotal(0); // Clear only the pending "label"
      // Note: We DON'T setCount(0). Count stays at today's total.
      toast.success("Jap Save Ho Gaya!");
    } else {
      toast.error("Error: " + error.message);
    }
    setIsSyncing(false);
  };

  // --- 🛠️ RESET: Clears EVERYTHING for today ---
  const handleResetToday = async () => {
    setIsSyncing(true);
    const { data: { user } } = await supabase.auth.getUser();
    const today = getTodayString();

    const { error } = await supabase
      .from("jap_logs")
      .delete()
      .eq("user_id", user?.id)
      .gte("created_at", today);

    if (!error) {
      setCount(0); // Now Big Counter becomes 0
      setSessionTotal(0);
      setShowResetConfirm(false);
      setShowManualSuggestion(true);
      toast.success("Aaj ka account reset ho gaya.");
    }
    setIsSyncing(false);
  };

  // Mantra logic functions remain same...
  const updateActiveMantra = async (mantra: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("profiles").update({ active_mantra_id: mantra.id }).eq("id", user?.id);
    if (!error) { setActiveMantra(mantra); setShowMantraModal(false); toast.success(`Mantra Updated.`); }
  };

  const addCustomMantra = async () => {
    if (!customMantra) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("mantras").insert({ text: customMantra, user_id: user?.id }).select().single();
    if (!error && data) { setMantras((prev) => [...prev, data]); updateActiveMantra(data); setCustomMantra(""); }
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
      
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
        <span className="font-black text-base">{activeMantra ? activeMantra.text : "Mantra Chunein"}</span>
      </button>

      {/* Main Bead */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-linear-to-r from-orange-400 to-red-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <button onClick={handleIncrement} className="relative w-80 h-80 md:w-96 md:h-96 bg-white dark:bg-zinc-900 rounded-full shadow-2xl border-12px border-orange-50 dark:border-zinc-800 flex flex-col items-center justify-center active:scale-95 transition-all z-10">
          <span className="text-8xl md:text-9xl font-black text-brand-orange leading-none">{count}</span>
          <span className="text-xs font-black opacity-30 uppercase tracking-widest mt-4">Aaj ka kul jap</span>
        </button>
        <button onClick={() => setIsSoundEnabled(!isSoundEnabled)} className="absolute -top-4 -right-4 p-5 bg-white dark:bg-zinc-900 rounded-full shadow-xl border border-orange-50 dark:border-zinc-700 z-20">
          {isSoundEnabled ? <Bell className="w-6 h-6 text-brand-orange" /> : <BellOff className="w-6 h-6 text-zinc-400" />}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-16 flex flex-col items-center gap-6">
        <div className="flex gap-4">
          <button 
            onClick={syncToDB} 
            disabled={isSyncing || sessionTotal === 0} 
            className="bg-brand-text text-white dark:bg-white dark:text-black px-14 py-5 rounded-2rem font-black text-xl shadow-2xl hover:scale-105 transition-all disabled:opacity-30"
          >
            {isSyncing ? "Saving..." : `Submit ${sessionTotal} Jap`}
          </button>
          
          <button onClick={() => setShowResetConfirm(true)} className="p-5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-1.5rem hover:bg-red-100 transition-all shadow-sm">
            <RotateCcw className="w-7 h-7" />
          </button>
        </div>
        
        {sessionTotal > 0 && (
          <p className="text-sm font-black text-brand-orange animate-pulse uppercase tracking-widest">
            {sessionTotal} Jap Pending Sync
          </p>
        )}
      </div>

      {/* Modals remain same as previous working version... (Reset, Suggestion, Mantra) */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[3rem] p-10 text-center border-4 border-red-500/20 shadow-2xl">
              <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 className="w-10 h-10" /></div>
              <h3 className="text-3xl font-black mb-4 italic">Reset Karein?</h3>
              <p className="text-slate-500 mb-8 font-bold text-sm italic">⚠️ Aaj ki saari mehnat profile se hat jayegi. Kya aap nishchit hain?</p>
              <div className="flex gap-4">
                <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl font-black transition-colors hover:bg-zinc-200">Nahi</button>
                <button onClick={handleResetToday} className="flex-1 py-5 bg-red-500 text-white rounded-2xl font-black shadow-lg">Reset</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showManualSuggestion && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[3rem] p-10 text-center border-4 border-brand-orange/20 shadow-2xl">
              <div className="w-20 h-20 bg-orange-100 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-6"><Sparkles className="w-10 h-10" /></div>
              <h3 className="text-3xl font-black mb-4 italic">Nayi Shuruat!</h3>
              <p className="text-slate-500 mb-8 font-bold text-sm">Data reset ho gaya hai. Purane records ke liye niche jayein.</p>
              <div className="flex flex-col gap-4">
                <Link href="/dashboard/manual" className="w-full py-5 bg-brand-orange text-white rounded-2xl font-black flex items-center justify-center gap-2">Manual Entry <ArrowRight className="w-6 h-6" /></Link>
                <button onClick={() => setShowManualSuggestion(false)} className="w-full py-4 text-slate-400 font-bold hover:text-slate-600">Theek Hai</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMantraModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl border border-orange-100 dark:border-zinc-800">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black italic text-brand-orange">Mantras</h3>
                <button onClick={() => setShowMantraModal(false)}><X className="w-8 h-8 opacity-40 hover:opacity-100" /></button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-10">
                {mantras.map((m) => (
                  <button key={m.id} onClick={() => updateActiveMantra(m)} className={`p-5 rounded-2xl font-black text-sm transition-all border-2 ${activeMantra?.id === m.id ? "border-brand-orange bg-orange-50 text-brand-orange" : "border-zinc-50 dark:border-zinc-800"}`}>{m.text}</button>
                ))}
              </div>
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Add Your Isht Naam</p>
                <div className="flex gap-3">
                  <input value={customMantra} onChange={(e) => setCustomMantra(e.target.value)} placeholder="Custom..." className="flex-1 bg-zinc-50 dark:bg-zinc-800 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-brand-orange font-black text-lg" />
                  <button onClick={addCustomMantra} className="p-5 bg-brand-orange text-white rounded-2xl hover:scale-105"><Plus className="w-7 h-7" /></button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnPresence({ children }: { children: React.ReactNode }) { return <AnimatePresence>{children}</AnimatePresence>; }