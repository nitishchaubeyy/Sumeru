"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "sonner";
import { Target, Plus } from "lucide-react";

export default function MantrasPage() {
  const [mantras, setMantras] = useState<any[]>([]);
  const [newMantra, setNewMantra] = useState("");
  const [selectedMantra, setSelectedMantra] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    // Mantras Fetching
    const { data: mantrasData, error: mantrasError } = await supabase
      .from("mantras")
      .select("*");
    
    // Profiles check for selected mantra
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("selected_mantra_id")
      .eq("id", user?.id)
      .single();

    if (mantrasData) setMantras(mantrasData);
    if (profileData) setSelectedMantra(profileData.selected_mantra_id);
    
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddMantra = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("mantras").insert({
      user_id: user?.id,
      text: newMantra,
    });

    if (!error) {
      toast.success("Mantra add ho gaya!");
      setNewMantra("");
      fetchData(); // Phir se fetch karke dropdown update kariyey
    } else {
      toast.error("Error: " + error.message);
    }
  };

  const handleSelectMantra = async (mantraId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("profiles").update({
      selected_mantra_id: mantraId,
    }).eq("id", user?.id);

    if (!error) {
      toast.success("Mantra select ho gaya!");
      setSelectedMantra(mantraId);
    } else {
      toast.error("Error: " + error.message);
    }
  };

  if (loading) return <div className="p-8 text-center font-bold">Mantra search ho rahe hain...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <h1 className="text-4xl font-black italic">Apna Mantra 🏔️</h1>

      {/* --- Select Mantra Section --- */}
      <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-[3rem] border border-orange-100 dark:border-zinc-800 shadow-xl">
        <h2 className="text-3xl font-black mb-8">Mantra Chunein</h2>
        
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Apne Mantras</label>
          <select 
            value={selectedMantra || ""} 
            onChange={(e) => handleSelectMantra(e.target.value)}
            className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl outline-none border-2 border-transparent focus:border-brand-orange font-bold text-xl transition-all"
          >
            <option value="">Ek mantra select kariyey...</option>
            {mantras.map((mantra) => (
              <option key={mantra.id} value={mantra.id}>{mantra.text}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- Add Custom Mantra Section --- */}
      <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-[3rem] border border-orange-100 dark:border-zinc-800 shadow-sm text-center">
        <div className="w-20 h-20 bg-orange-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-orange">
          <Plus className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black mb-2">Apna Mantra Link karein</h2>
        <p className="text-slate-500 mb-8">Apna mantra text enter kariyey aur submit kariyey.</p>
        
        <form onSubmit={handleAddMantra} className="grid grid-cols-1 gap-4 text-left">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Mantra Text</label>
            <input 
              placeholder="E.g. Hare Krishna" 
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl outline-none border-2 border-transparent focus:border-brand-orange font-bold text-lg transition-all"
              value={newMantra} onChange={(e) => setNewMantra(e.target.value)} required
            />
          </div>
          <button className="bg-brand-text text-white dark:bg-white dark:text-black py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
            Mantra Add Karein
          </button>
        </form>
      </div>
    </div>
  );
}