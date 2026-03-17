import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  const totalGlobalJaps = "1,00,00,000";

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text selection:bg-orange-200">
      {/* --- Navbar --- */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-3xl font-black tracking-tighter text-brand-orange">
          SUMERU
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="bg-brand-orange text-white px-6 py-2 rounded-full font-bold shadow-lg hover:brightness-110 transition-all"
          >
            Pravēsh
          </Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="text-center py-24 px-4">
        <h2 className="text-6xl md:text-7xl font-extrabold mb-8 leading-tight">
          Every Breath is an <br />
          <span className="text-brand-orange italic">Opportunity.</span>
        </h2>
        <p className="text-xl md:text-2xl opacity-75 max-w-2xl mx-auto mb-12">
          Track your daily Naam Jap, set powerful Sankalps, and be part of a
          global spiritual movement. Clean, minimal, and soulful.
        </p>
        <button className="bg-brand-text text-brand-bg dark:bg-white dark:text-black px-12 py-5 rounded-2xl text-xl font-black shadow-2xl hover:scale-105 transition-transform">
          Start Chanting Now
        </button>
      </section>

      {/* --- Live Global Stats --- */}
      <section className="bg-white dark:bg-zinc-900 py-20 border-y border-orange-100 dark:border-zinc-800 shadow-inner">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-around items-center gap-12 text-center">
          <StatBox count={totalGlobalJaps + "+"} label="Total Naam Jap" />
          <div className="h-16 w-px bg-orange-200 dark:bg-zinc-700 hidden md:block"></div>
          <StatBox count="5,432" label="Active Seekers" />
        </div>
      </section>

      {/* --- Features --- */}
      <section className="py-24 max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <FeatureCard title="Sankalp Tracker" desc="Set daily or long-term goals." icon="🏔️" />
        <FeatureCard title="Mandal Power" desc="Chant with family and friends." icon="🤝" />
        <FeatureCard title="Santvani Feed" desc="Curated spiritual wisdom." icon="📜" />
      </section>
    </div>
  );
}

function StatBox({ count, label }: { count: string; label: string }) {
  return (
    <div>
      <h3 className="text-5xl font-black text-brand-orange">{count}</h3>
      <p className="uppercase tracking-widest text-sm font-bold opacity-50 mt-2">{label}</p>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-10 rounded-3xl shadow-sm border border-orange-50 dark:border-zinc-800 hover:shadow-xl transition-all">
      <div className="text-5xl mb-6">{icon}</div>
      <h4 className="text-2xl font-bold mb-4">{title}</h4>
      <p className="opacity-60 text-lg leading-relaxed">{desc}</p>
    </div>
  );
}