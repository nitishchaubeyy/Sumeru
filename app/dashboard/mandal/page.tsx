"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Trophy,
  Medal,
  Crown,
  Calendar,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MandalPage() {
  const [filter, setFilter] = useState<"today" | "week" | "month">("today");
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const fetchLeaders = async () => {
    setLoading(true);
    let viewName = "leaderboard_today";
    if (filter === "week") viewName = "leaderboard_week";
    if (filter === "month") viewName = "leaderboard_month";

    const { data } = await supabase.from(viewName).select("*").limit(10);
    if (data) setLeaders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaders();
  }, [filter]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      {/* --- Header with Dropdown --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic text-zinc-900 dark:text-white">
            Sumeru Mandal<span className="text-brand-orange">.</span>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 font-bold italic">
            Global Rankings
          </p>
        </div>

        {/* Premium Dropdown */}
        <div className="relative group">
          <select
            value={filter}
            onChange={(e: any) => setFilter(e.target.value)}
            className="appearance-none bg-white dark:bg-zinc-900 border-2 border-orange-100 dark:border-zinc-800 px-8 py-4 rounded-2xl font-black text-sm outline-none focus:border-brand-orange transition-all cursor-pointer pr-12 shadow-sm"
          >
            <option value="today">Top Naamjapak (Today)</option>
            <option value="week">Top Naamjapak (Weekly)</option>
            <option value="month">Top Naamjapak (Monthly)</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-orange pointer-events-none" />
        </div>
      </div>

      {/* --- Visual Chart Section --- */}
      <div className="bg-zinc-900 dark:bg-zinc-800 p-8 rounded-4xl shadow-2xl overflow-hidden relative border-4 border-orange-100/10">
        <div className="flex items-center gap-2 mb-10 text-orange-400">
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-widest">
            Pragati Chart
          </span>
        </div>

        <div className="flex items-end justify-between gap-2 h-48 pt-4">
          {leaders.length > 0 ? (
            leaders.slice(0, 7).map((item, i) => (
              <div
                key={item.id}
                className="flex-1 flex flex-col items-center gap-3 h-full justify-end"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{
                    // 🎯 Fix: Adding a 4% minimum height so bars are always visible
                    height: `${Math.max((item.total_jap / (leaders[0]?.total_jap || 1)) * 100, 4)}%`,
                  }}
                  transition={{ duration: 1, ease: "circOut" }}
                  className={`w-full max-w-10 rounded-t-xl relative group transition-all ${
                    i === 0
                      ? "bg-linear-to-t from-orange-600 to-brand-orange shadow-[0_0_20px_rgba(255,140,0,0.3)]"
                      : "bg-white/10 dark:bg-zinc-700/50 hover:bg-white/30"
                  }`}
                >
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-black">
                    {item.total_jap} Jap
                  </div>
                </motion.div>
                <p className="text-[8px] font-black text-white/40 dark:text-zinc-500 uppercase truncate w-full text-center">
                  {item.display_name.split(" ")[0]}
                </p>
              </div>
            ))
          ) : (
            <div className="w-full text-center text-white/20 font-black italic py-10">
              Sadhana Pratikshit...
            </div>
          )}
        </div>
      </div>

      {/* --- List Section --- */}
      <div className="bg-white dark:bg-zinc-900 rounded-4xl border border-orange-100 dark:border-zinc-800 shadow-xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="divide-y divide-zinc-50 dark:divide-zinc-800"
          >
            {leaders.map((leader, index) => (
              <div
                key={leader.id}
                className="flex items-center justify-between p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <span
                    className={`w-8 font-black text-xl ${index < 3 ? "text-brand-orange" : "text-slate-300"}`}
                  >
                    #{index + 1}
                  </span>
                  <img
                    src={leader.avatar_url}
                    className="w-12 h-12 rounded-2xl border-2 border-zinc-100 dark:border-zinc-700 shadow-sm"
                    alt=""
                  />
                  <div>
                    <p className="font-black text-zinc-900 dark:text-white flex items-center gap-2">
                      {leader.display_name}
                      {index === 0 && (
                        <Crown className="w-4 h-4 text-brand-orange fill-brand-orange" />
                      )}
                    </p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Seeker
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-brand-orange">
                    {leader.total_jap.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-black opacity-30 uppercase">
                    Total Jap
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
