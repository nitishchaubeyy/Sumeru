import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default async function LandingPage() {
  // Hum database se real-time total count uthayenge (baad mein)
  // Abhi ke liye hum placeholder values use kar rahe hain
  const totalGlobalJaps = "1,00,00,000"; 

  return (
    <div className="min-h-screen bg-[#FFFBF2] text-[#2D2424]">
      {/* --- Navbar --- */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-3xl font-bold tracking-tight text-orange-700">
          SUMERU <span className="text-sm font-light text-slate-500">v1.0</span>
        </div>
        <Link href="/login" className="bg-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-orange-700 transition">
          Begin your Journey!
        </Link>
      </nav>

      {/* --- Hero Section --- */}
      <section className="text-center py-20 px-4">
        <h2 className="text-6xl font-extrabold mb-6 leading-tight">
          Every Breath is an <br /> 
          <span className="text-orange-600 italic">Opportunity.</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Track your daily Naam Jap, set powerful Sankalps, and be part of a 
          global spiritual movement. Clean, minimal, and soulful.
        </p>
        <button className="bg-[#2D2424] text-white px-10 py-4 rounded-xl text-lg font-bold shadow-2xl hover:scale-105 transition-transform">
          Start Chanting Now
        </button>
      </section>

      {/* --- Live Global Stats --- */}
      <section className="bg-white py-16 border-y border-orange-100">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-around items-center gap-12 text-center">
          <div>
            <h3 className="text-5xl font-black text-orange-600">{totalGlobalJaps}+</h3>
            <p className="uppercase tracking-widest text-sm font-semibold text-slate-500 mt-2">Total Naam Jap</p>
          </div>
          <div className="h-16 w-[1px] bg-orange-200 hidden md:block"></div>
          <div>
            <h3 className="text-5xl font-black text-orange-600">5,432</h3>
            <p className="uppercase tracking-widest text-sm font-semibold text-slate-500 mt-2">Active Seekers</p>
          </div>
        </div>
      </section>

      {/* --- Why Sumeru? (Features) --- */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            title="Sankalp Tracker" 
            desc="Set daily or long-term goals. Let the app remind you of your commitment to the divine." 
            icon="🏔️"
          />
          <FeatureCard 
            title="Mandal Power" 
            desc="Chant with your family or friends in private groups. Collective energy is transformative." 
            icon="🤝"
          />
          <FeatureCard 
            title="Santvani Feed" 
            desc="Curated spiritual wisdom to keep your motivation high during your dry spells." 
            icon="📜"
          />
        </div>
      </section>
    </div>
  );
}

// Chhota UI component for features
function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-50 hover:shadow-md transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-2xl font-bold mb-3">{title}</h4>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}