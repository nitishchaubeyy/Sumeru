"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "sonner";
import { Trophy, Target, Calendar, Plus } from "lucide-react";

export default function SankalpPage() {
  const [sankalp, setSankalp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [endDate, setEndDate] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchSankalp = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("sankalps")
      .select("*")
      .eq("user_id", user?.id)
      .eq("status", "active")
      .single();

    if (data) setSankalp(data);
    setLoading(false);
  };

  useEffect(() => { fetchSankalp(); }, []);

  const handleCreateSankalp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("sankalps").insert({
      user_id: user?.id,
      title,
      target_count: parseInt(target),
      end_date: endDate,
    });

    if (!error) {
      toast.success("Sankalp liya gaya! Shubh ho.");
      fetchSankalp();
    } else {
      toast.error("Error: " + error.message);
    }
  };

  if (loading) return <div className="p-8 text-center font-bold text-brand-orange animate-pulse">Loading your spiritual goals...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <h1 className="text-4xl font-black italic text-zinc-900 dark:text-white">Mera Sankalp 🏔️</h1>

      {sankalp ? (
        <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-4xl border border-orange-100 dark:border-zinc-800 shadow-xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-brand-orange font-black uppercase tracking-widest text-xs mb-2">Active Goal</p>
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white">{sankalp.title}</h2>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl text-brand-orange">
              <Trophy className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between font-black text-sm uppercase text-zinc-700 dark:text-zinc-300">
              <span>Pragati (Progress)</span>
              <span className="text-brand-orange">
                {Math.round((sankalp.current_count / sankalp.target_count) * 100)}%
              </span>
            </div>
            <div className="w-full h-6 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border-2 border-zinc-50 dark:border-zinc-700">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-1000"
                style={{ width: `${Math.min((sankalp.current_count / sankalp.target_count) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-zinc-400 font-bold text-sm">
              <span>{sankalp.current_count.toLocaleString()} done</span>
              <span>{sankalp.target_count.toLocaleString()} target</span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2 text-slate-400 text-sm font-medium">
            <Calendar className="w-4 h-4" />
            Ends on: {new Date(sankalp.end_date).toLocaleDateString('en-IN')}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-4xl border border-orange-100 dark:border-zinc-800 shadow-sm text-center">
          <div className="w-20 h-20 bg-orange-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-orange">
            <Target className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Koi active sankalp nahi hai</h2>
          <p className="text-slate-500 dark:text-zinc-400 mb-8">Ek naya lakshya (goal) set kariyey aur apni pragati track kariyey.</p>
          
          <form onSubmit={handleCreateSankalp} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Sankalp ka naam</label>
              <input 
                placeholder="E.g. 1 Lakh Ram Naam" 
                className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl outline-none border-2 border-transparent focus:border-brand-orange font-bold transition-all"
                value={title} onChange={(e) => setTitle(e.target.value)} required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Target Count</label>
              <input 
                type="number" placeholder="10000" 
                className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl outline-none border-2 border-transparent focus:border-brand-orange font-bold transition-all"
                value={target} onChange={(e) => setTarget(e.target.value)} required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Deadline</label>
              <input 
                type="date" 
                className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl outline-none border-2 border-transparent focus:border-brand-orange font-bold transition-all"
                value={endDate} onChange={(e) => setEndDate(e.target.value)} required
              />
            </div>
            <button className="md:col-span-2 mt-4 bg-zinc-900 dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
              Sankalp Shuru Karein
            </button>
          </form>
        </div>
      )}
    </div>
  );
}