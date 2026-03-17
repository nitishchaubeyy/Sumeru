import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation"; // Naya import for redirect
import { ThemeToggle } from "@/components/theme-toggle";

export const revalidate = 0;

export default async function LandingPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // --- 1. SMART REDIRECT (Private Zone Protection) ---
  if (user) {
    redirect("/dashboard");
  }

  // --- 2. DYNAMIC STATS FETCHING ---
  // Fetch Jap Logs
  const { data: japData } = await supabase.from('jap_logs').select('count');
  const totalRawCount = japData?.reduce((acc: number, curr: { count: number }) => acc + curr.count, 0) || 0;
  const formattedJapCount = new Intl.NumberFormat('en-IN').format(totalRawCount);

  // Fetch Real Active Seekers (Profiles count)
  const { count: seekersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const formattedSeekersCount = new Intl.NumberFormat('en-IN').format(seekersCount || 0);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text transition-colors duration-300">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-3xl font-black text-brand-orange tracking-tighter">SUMERU</div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="bg-brand-orange text-white px-6 py-2 rounded-full font-bold shadow-lg">
            Pravēsh
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h2 className="text-6xl md:text-7xl font-extrabold mb-8 leading-tight">
          Every Breath is an <br /> 
          <span className="text-brand-orange italic">Opportunity.</span>
        </h2>
        <Link href="/login">
          <button className="bg-brand-text text-brand-bg dark:bg-white dark:text-black px-12 py-4 rounded-xl font-bold shadow-2xl hover:scale-105 transition-transform">
            Start Chanting Now
          </button>
        </Link>
      </section>

      {/* Stats Section - Dynamic Counts */}
      <section className="bg-zinc-900 py-16 text-center border-y border-zinc-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-around gap-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-5xl font-black text-brand-orange">{formattedJapCount}+</h3>
            <p className="text-zinc-400 uppercase tracking-widest text-xs font-bold">Total Naam Jap</p>
          </div>
          <div className="h-16 w-px bg-zinc-700 hidden md:block"></div>
          <div className="flex flex-col gap-1">
            <h3 className="text-5xl font-black text-brand-orange">{formattedSeekersCount}</h3>
            <p className="text-zinc-400 uppercase tracking-widest text-xs font-bold">Active Seekers</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <FeatureCard title="Sankalp Tracker" desc="Set daily or long-term goals." icon="🏔️" />
        <FeatureCard title="Mandal Power" desc="Chant with family and friends." icon="🤝" />
        <FeatureCard title="Santvani Feed" desc="Curated spiritual wisdom." icon="📜" />
      </section>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-10 rounded-3xl shadow-sm border border-orange-100 dark:border-zinc-800 hover:shadow-xl transition-all">
      <div className="text-5xl mb-6">{icon}</div>
      <h4 className="text-2xl font-bold mb-4 text-[#121212] dark:text-white">{title}</h4>
      <p className="text-slate-600 dark:text-slate-400 text-lg">{desc}</p>
    </div>
  );
}