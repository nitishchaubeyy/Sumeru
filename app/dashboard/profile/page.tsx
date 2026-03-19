"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "sonner";
import {
  User,
  Shield,
  Save,
  Award,
  Activity,
  History,
  Calendar,
  LogOut,      // 🎯 Added for Logout
  ShieldAlert, // 🎯 Added for Section Header
} from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [userMetadata, setUserMetadata] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [stats, setStats] = useState({ total: 0, sessions: 0 });
  const [logs, setLogs] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const fetchProfileData = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setUserMetadata(user.user_metadata);

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();
    if (profile?.display_name) setDisplayName(profile.display_name);

    const { data: allLogs } = await supabase
      .from("jap_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (allLogs) {
      setLogs(allLogs);
      const total = allLogs.reduce((acc, curr) => acc + curr.count, 0) || 0;
      setStats({ total, sessions: allLogs.length || 0 });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // 🎯 Logout Logic
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout mein samasya aayi!");
    } else {
      window.location.href = "/"; // Landing page par wapas
    }
  };

  const handleUpdateDisplayName = async () => {
    setIsUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("User nahi mila!");
      setIsUpdating(false);
      return;
    }

    const cleanName = displayName.trim();
    const { data, error } = await supabase
      .from("profiles")
      .update({ display_name: cleanName })
      .eq("id", user.id)
      .select();

    if (error) {
      toast.error("Galti: " + error.message);
    } else if (data && data.length > 0) {
      toast.success("Mandal mein ab aap isi naam se dikhenge!");
      fetchProfileData();
    }
    setIsUpdating(false);
  };

  if (loading)
    return (
      <div className="p-8 text-center font-black text-brand-orange animate-pulse">
        Shubh Aarambh...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <h1 className="text-4xl font-black italic text-zinc-900 dark:text-white">
        Mera Profile 🏔️
      </h1>

      {/* --- Profile Header --- */}
      <div className="bg-zinc-900 dark:bg-zinc-800 p-8 md:p-12 rounded-4xl text-white shadow-2xl flex flex-col md:flex-row items-center gap-8 border-4 border-orange-100/10">
        <img
          src={userMetadata?.avatar_url}
          className="w-32 h-32 rounded-full border-4 border-brand-orange shadow-lg"
          alt="Avatar"
        />
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-4xl font-black">{userMetadata?.full_name}</h2>
          <p className="opacity-60 font-medium">{userMetadata?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <span className="px-4 py-1.5 bg-brand-orange rounded-full text-[10px] font-black uppercase tracking-widest">
              Devoted Seeker
            </span>
            <span className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
              Level 1
            </span>
          </div>
        </div>
      </div>

      {/* --- Stats Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-orange p-10 rounded-4xl text-white shadow-xl">
          <Activity className="w-8 h-8 mb-4 opacity-50" />
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-1">
            Total Lifetime Jap
          </p>
          <h3 className="text-6xl font-black leading-none">
            {stats.total.toLocaleString()}
          </h3>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-900 p-10 rounded-4xl border border-zinc-200 dark:border-zinc-800">
          <Award className="w-8 h-8 mb-4 text-brand-orange" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
            Total Sessions
          </p>
          <h3 className="text-6xl font-black text-zinc-900 dark:text-white leading-none">
            {stats.sessions}
          </h3>
        </div>
      </div>

      {/* --- Mandal Settings --- */}
      <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-4xl border border-orange-100 dark:border-zinc-800 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="text-brand-orange w-6 h-6" />
          <h3 className="text-2xl font-black italic text-zinc-900 dark:text-white">
            Mandal Pehchan
          </h3>
        </div>
        <div className="space-y-6">
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-orange w-5 h-5" />
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="E.g. Ek Das, Radhe Sharan..."
              className="w-full pl-14 pr-6 py-5 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white border-2 border-transparent focus:border-brand-orange rounded-3xl outline-none font-bold text-lg transition-all"
            />
          </div>
          <button
            onClick={handleUpdateDisplayName}
            disabled={isUpdating}
            className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-3xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Save className="w-6 h-6" />{" "}
            {isUpdating ? "Saving..." : "Pehchan Save Karein"}
          </button>
        </div>
      </div>

      {/* --- History Section --- */}
      <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-4xl border border-orange-100 dark:border-zinc-800 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <History className="text-brand-orange w-6 h-6" />
            <h3 className="text-2xl font-black italic text-zinc-900 dark:text-white">
              Naam-Jap Abhilekh
            </h3>
          </div>
          <span className="px-4 py-1 bg-orange-50 dark:bg-orange-900/20 text-brand-orange rounded-full text-[10px] font-black uppercase tracking-widest">
            {logs.length} Entries
          </span>
        </div>

        <div className="max-h-125 overflow-y-auto pr-2 custom-scrollbar">
          {logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-transparent hover:border-orange-100 dark:hover:border-orange-900/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-brand-orange shadow-sm group-hover:scale-110 transition-transform">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-zinc-900 dark:text-white leading-none">
                        {new Date(log.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">
                        Source: {log.source || "Dashboard"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-brand-orange">
                      +{log.count}
                    </p>
                    <p className="text-[10px] font-black opacity-30 uppercase tracking-tighter">
                      Jap
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Activity className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold italic">Abhi koi record nahi mila.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- 🎯 NEW: LOGOUT SECTION --- */}
      <div className="pt-10">
        <div className="bg-red-50/50 dark:bg-red-950/10 rounded-4xl p-8 md:p-12 border-2 border-dashed border-red-200 dark:border-red-900/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-3xl text-red-600 dark:text-red-400">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                  Sumeru Se Vida
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                  Aapka sara data surakshit hai. Agli sadhana ke liye phir milenge.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-10 py-5 bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 rounded-3xl font-black text-lg shadow-sm border border-red-100 dark:border-red-900/30 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 shadow-red-100 dark:shadow-none"
            >
              <LogOut className="w-6 h-6" />
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}