import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // --- Total Jap Fetching (Only for this User) ---
  const { data: userLogs } = await supabase
    .from("jap_logs")
    .select("count, created_at")
    .eq("user_id", user.id);

  const totalJap = userLogs?.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const sessionsCount = userLogs?.length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-orange-100 dark:border-zinc-800 shadow-sm">
        <img 
          src={user.user_metadata.avatar_url} 
          alt="Profile" 
          className="w-24 h-24 rounded-full border-4 border-brand-orange shadow-lg"
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black mb-1">{user.user_metadata.full_name}</h1>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">{user.email}</p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-4 py-1 bg-orange-100 dark:bg-orange-900/30 text-brand-orange text-xs font-black rounded-full uppercase tracking-widest">
              Devoted Seeker
            </span>
            <span className="px-4 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-black rounded-full uppercase tracking-widest">
              Level 1
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-orange p-8 rounded-[2.5rem] text-white shadow-xl shadow-orange-200 dark:shadow-none">
          <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Total Lifetime Jap</p>
          <h2 className="text-6xl font-black">{totalJap.toLocaleString('en-IN')}</h2>
          <p className="mt-4 text-sm opacity-90 font-medium italic">"Sumeru par aapka har naam jap darj hai."</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-orange-100 dark:border-zinc-800 flex flex-col justify-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Total Sessions</p>
          <h2 className="text-5xl font-black text-brand-text dark:text-white">{sessionsCount}</h2>
          <p className="mt-4 text-sm text-slate-500 font-medium italic">Kitni baar aapne dhyaan lagaya.</p>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-orange-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-orange-50 dark:border-zinc-800">
          <h3 className="text-xl font-bold">Recent Sankalps</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-orange-50/50 dark:bg-zinc-800/50 text-xs uppercase font-black text-slate-400">
              <tr>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Count</th>
                <th className="px-8 py-4 text-right">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50 dark:divide-zinc-800">
              {userLogs?.slice(-5).reverse().map((log, i) => (
                <tr key={i} className="hover:bg-orange-50/30 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-8 py-4 text-sm font-bold">
                    {new Date(log.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-4 text-brand-orange font-black text-lg">+{log.count}</td>
                  <td className="px-8 py-4 text-sm text-slate-400 text-right font-medium">Web Dashboard</td>
                </tr>
              ))}
              {sessionsCount === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-12 text-center text-slate-400 font-medium">
                    Abhi tak koi data nahi hai. Mala shuru kariyey!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}