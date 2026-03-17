"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "sonner";
import { Calendar, Hash, Save } from "lucide-react";

export default function ManualEntryPage() {
  const [count, setCount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!count || parseInt(count) <= 0) {
      toast.error("Kripya valid count daalein.");
      return;
    }

    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    // Hum 'created_at' ko user ki chuni hui date se override kar rahe hain
    const { error } = await supabase.from("jap_logs").insert({
      count: parseInt(count),
      user_id: user?.id,
      source: "manual",
      created_at: new Date(date).toISOString(), 
    });

    if (!error) {
      toast.success(`${count} Jap safaltapurvak darj kar liye gaye hain!`);
      setCount("");
    } else {
      toast.error("Data save karne mein dikkat aayi: " + error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-[3rem] border border-orange-100 dark:border-zinc-800 shadow-xl">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-orange">
            <Calendar className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black italic">Atit ke Sankalp</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">Apne purane ya physical mala ke jap yahan darj karein.</p>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-6">
          {/* Count Input */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Kitne Jap kiye?</label>
            <div className="relative">
              <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-orange w-5 h-5" />
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="E.g. 108, 1008..."
                className="w-full pl-14 pr-6 py-5 bg-zinc-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-brand-orange rounded-3xl outline-none font-bold text-xl transition-all"
                required
              />
            </div>
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Kis din kiye?</label>
            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-orange w-5 h-5" />
              <input
                type="date"
                value={date}
                max={new Date().toISOString().split("T")[0]} // Future date allow nahi karni
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-zinc-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-brand-orange rounded-3xl outline-none font-bold text-lg transition-all"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-brand-text text-white dark:bg-white dark:text-black rounded-3xl font-black text-lg shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : (
              <>
                <Save className="w-6 h-6" />
                Darj Karein
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 p-6 bg-orange-50 dark:bg-zinc-800/30 rounded-3xl border border-dashed border-orange-200 dark:border-zinc-700 text-center text-sm italic text-slate-500">
        "Purane sankalp aaj ki pragati ka aadhar hain."
      </div>
    </div>
  );
}