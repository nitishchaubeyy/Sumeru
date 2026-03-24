"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "sonner";
import { Trophy, Target, Calendar, Plus, Infinity, Star, CheckCircle2, X, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import DashboardInstallBanner from "@/components/DashboardInstallBanner"; 

export default function SankalpPage() {
  const [sankalps, setSankalps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isAnant, setIsAnant] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchSankalps = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("sankalps")
        .select("*")
        .eq("user_id", user.id)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) console.error("Fetch Error:", error);
      if (data) setSankalps(data);
    } catch (err) {
      console.error("Fetch Exception:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSankalps(); }, []);

  const handleCreateSankalp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const parsedTarget = parseInt(target, 10);
      const finalTarget = isNaN(parsedTarget) ? 108 : parsedTarget;

      let finalEndDate = null;
      if (!isAnant && endDate !== "" && endDate !== null && endDate !== undefined) {
        finalEndDate = endDate;
      }

      const payload = {
        user_id: user?.id,
        title: title || "Mera Sankalp",
        target_count: finalTarget,
        current_count: 0,
        end_date: finalEndDate,
        is_primary: sankalps.length === 0, 
        status: "active" 
      };

      console.log("🚀 Payload going to Supabase:", payload);

      const { data: newSankalp, error } = await supabase.from("sankalps").insert([payload]).select();

      if (error) {
        console.error("Supabase Insert Error:", error);
        toast.error(`Sankalp Add Error: ${error.message}`);
      } else if (newSankalp) {
        toast.success("Naya Sankalp liya gaya! Shubh ho.");
        setTitle(""); setTarget(""); setEndDate(""); setIsAnant(false);
        setShowForm(false);
        fetchSankalps();
      }
    } catch (err) {
      console.error("Unexpected Error in handleCreateSankalp:", err);
      toast.error("Kuch anpekhsit (unexpected) error aaya.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const setPrimary = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase.from("sankalps").update({ is_primary: false }).eq("user_id", user.id);
    const { error } = await supabase.from("sankalps").update({ is_primary: true }).eq("id", id);

    if (!error) {
      toast.success("Focus set kiya gaya! 🔥");
      fetchSankalps();
    }
  };

  const handleDeleteSankalp = async (id: string) => {
    if (!window.confirm("Kya aap sach mein is sankalp ko hatana chahte hain?")) return;
    
    const { error } = await supabase.from("sankalps").delete().eq("id", id);
    if (!error) {
      toast.success("Sankalp hata diya gaya.");
      fetchSankalps();
    } else {
      toast.error("Delete karne mein error aaya.");
    }
  };

  if (loading) return <div className="p-8 text-center font-black text-orange-500 animate-pulse">Sadhana Marg Loading... 🏔️</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 p-4 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black italic text-zinc-900 dark:text-white leading-none">Mere Sankalp</h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Apne adhyatmik lakshyon ko manage karein</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl h-12 px-6 shadow-lg shadow-orange-500/20 gap-2 font-bold"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? "Cancel" : "Naya Sankalp"}
        </Button>
      </div>

      {/* ✅ Naya Dashboard Banner Yahan Render Hoga */}
      <DashboardInstallBanner />

      {showForm && (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border-2 border-orange-100 dark:border-zinc-800 animate-in fade-in slide-in-from-top-4 duration-500 shadow-2xl">
          <form onSubmit={handleCreateSankalp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Sankalp ka Title</label>
              <input 
                placeholder="E.g. 1.25 Lakh Mahamantra Jap" 
                className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border-2 border-transparent focus:border-orange-500 font-bold outline-none transition-all dark:text-white"
                value={title} onChange={(e) => setTitle(e.target.value)} required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Lakshya (Target Jap)</label>
              <input 
                type="number" placeholder="125000" 
                className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border-2 border-transparent focus:border-orange-500 font-bold outline-none transition-all dark:text-white"
                value={target} onChange={(e) => setTarget(e.target.value)} required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Samay Seema (Deadline)</label>
              <div className="flex gap-3 items-center">
                <input 
                  type="date" disabled={isAnant}
                  className={`flex-1 p-4 rounded-2xl border-2 border-transparent font-bold outline-none transition-all ${isAnant ? 'bg-zinc-100 dark:bg-zinc-950 opacity-40' : 'bg-zinc-50 dark:bg-zinc-800 dark:text-white'}`}
                  value={endDate} onChange={(e) => setEndDate(e.target.value)} required={!isAnant}
                />
                <div 
                  onClick={() => setIsAnant(!isAnant)}
                  className={`flex items-center gap-2 cursor-pointer p-4 rounded-2xl border-2 transition-all ${isAnant ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-transparent bg-zinc-50 dark:bg-zinc-800 text-zinc-400'}`}
                >
                  <Infinity className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-tighter">Anant</span>
                </div>
              </div>
            </div>
            <Button 
              disabled={isSubmitting}
              className="md:col-span-2 h-14 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-lg hover:scale-[1.01] transition-all shadow-xl"
            >
              {isSubmitting ? "Processing..." : "Sankalp Dharan Karein 🙏"}
            </Button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sankalps.map((s) => {
          const progress = Math.min((s.current_count / s.target_count) * 100, 100);
          const isSiddh = progress >= 100;
          let isExpired = false;
          if (s.end_date && !isSiddh) {
            const endDateObj = new Date(s.end_date);
            endDateObj.setHours(23, 59, 59, 999); 
            isExpired = endDateObj.getTime() < new Date().getTime();
          }

          return (
            <div key={s.id} className={`relative bg-white dark:bg-zinc-900 p-6 rounded-4xl border-2 transition-all duration-300 ${s.is_primary ? 'border-orange-500 ring-4 ring-orange-500/5' : 'border-zinc-100 dark:border-zinc-800'}`}>
              
              <div className="absolute top-6 right-6 flex items-center gap-3">
                <button 
                  onClick={() => handleDeleteSankalp(s.id)} 
                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors group"
                  title="Delete Sankalp"
                >
                  <Trash2 className="w-4 h-4 text-zinc-300 group-hover:text-red-500 transition-colors" />
                </button>
                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-full">
                  <span className="relative flex h-2 w-2">
                    {!isSiddh && !isExpired && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isSiddh ? 'bg-green-500' : isExpired ? 'bg-red-500' : 'bg-orange-500'}`}></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    {isSiddh ? "Siddh" : isExpired ? "Expired" : "Live"}
                  </span>
                </div>
              </div>

              <div className="mb-8 pr-24">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-black text-zinc-900 dark:text-white truncate">{s.title}</h2>
                  {s.is_primary && <Star className="w-4 h-4 fill-orange-500 text-orange-500 shrink-0" />}
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
                  {s.end_date ? (
                    <><Calendar className="w-3 h-3" /> Ends: {new Date(s.end_date).toLocaleDateString('en-IN')}</>
                  ) : (
                    <><Infinity className="w-3 h-3" /> Anant Sadhana (No Deadline)</>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Progress</span>
                    <span className="text-sm font-black text-zinc-700 dark:text-zinc-300">
                      {s.current_count.toLocaleString()} <span className="text-zinc-500 font-medium">/ {s.target_count.toLocaleString()}</span>
                    </span>
                  </div>
                  <div className={`text-3xl font-black italic tracking-tighter ${isSiddh ? 'text-green-500' : 'text-orange-500'}`}>
                    {progress.toFixed(0)}%
                  </div>
                </div>
                <Progress value={progress} className="h-3 bg-zinc-100 dark:bg-zinc-800" />
              </div>

              {!isSiddh && (
                <div className="mt-8 flex gap-3">
                  {!s.is_primary && (
                    <button 
                      onClick={() => setPrimary(s.id)}
                      className="flex-1 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                    >
                      Focus Mode
                    </button>
                  )}
                </div>
              )}
              
              {isSiddh && (
                <div className="mt-8 py-3 flex items-center justify-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest bg-green-500/10 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" /> Sankalp Siddha Hua ✨
                </div>
              )}
            </div>
          )
        })}
      </div>

      {sankalps.length === 0 && !showForm && (
        <div className="text-center py-24 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem]">
          <Target className="w-16 h-16 mx-auto mb-4 text-zinc-300 opacity-20" />
          <p className="font-black text-zinc-400 uppercase tracking-widest text-xs">Abhi koi active sankalp nahi hai</p>
          <Button onClick={() => setShowForm(true)} variant="link" className="text-orange-500 font-bold mt-2">
            Naya Sankalp lene ke liye yahan click karein
          </Button>
        </div>
      )}
    </div>
  );
}