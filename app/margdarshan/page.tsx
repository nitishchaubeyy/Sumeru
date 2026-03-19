"use client";

import Link from "next/link";
import { ArrowLeft, AlertCircle, CheckCircle, Info, Sparkles } from "lucide-react";

export default function MargdarshanPage() {
  const offenses = [
    { title: "Sadhu-Ninda", desc: "Bhagwan ke bhakton aur santon ki ninda karna sabse bada aparadh hai." },
    { title: "Naam-Bhed", desc: "Bhagwan ke vibhinn naamon (Ram, Krishna, Shiv) mein bhed karna ya unhe devi-devtaon ke saman samajhna." },
    { title: "Guru-Avagya", desc: "Guru ke vachnon ka ullanghan karna ya unhe sadharan manushya samajhna." },
    { title: "Shastra-Ninda", desc: "Vedas aur Puranon ki pramanikta par sandeh karna." },
    { title: "Naam-Aparadh", desc: "Naam ke bal par paap karna (ye sochna ki jap se paap dhul jayenge)." },
    { title: "Asandhan", desc: "Naam-Jap ko anya shubh karmon (daan, tap) ke saman samajhna. Naam sarvopari hai." },
    { title: "Ashraddha", desc: "Shraddha-heen vyakti ko naam ka updesh dena." },
    { title: "Pramad", desc: "Naam ki mahima sunne ke baad bhi usmein ruchi na lena." }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 md:p-20">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-orange font-black mb-12 hover:-translate-x-2 transition-transform uppercase text-xs tracking-widest">
          <ArrowLeft className="w-5 h-5" /> Wapas Jayein
        </Link>

        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4 leading-none">
          Margdarshan<span className="text-brand-orange">.</span>
        </h1>
        <p className="text-zinc-500 font-bold mb-16 italic text-lg">"Naam Jap ki maryada, niyam aur phal."</p>

        {/* Section 1: 10 Aparadh */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-8">
             <AlertCircle className="text-red-500 w-8 h-8" />
             <h2 className="text-3xl font-black italic">Naam-Aparadh se Bachein</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offenses.map((item, i) => (
              <div key={i} className="p-8 bg-red-50/30 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-[2.5rem]">
                <h4 className="font-black text-red-600 dark:text-red-400 mb-2 italic text-xl">{i+1}. {item.title}</h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Important Rules */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-8">
             <CheckCircle className="text-brand-orange w-8 h-8" />
             <h2 className="text-3xl font-black italic">Jap ke Mukhya Niyam</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="p-10 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800">
               <h4 className="text-2xl font-black mb-4 italic">Sthiti aur Pavitrata</h4>
               <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">Naam Jap har samay, har sthiti mein ho sakta hai. Shuddh avastha shreshtha hai, par ashuddh avastha (bina nahaye) mein bhi mansik jap kabhi nahi chhodna chahiye. Bhagwan ka naam swayam pavitra karne wala hai.</p>
            </div>
            <div className="p-10 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800">
               <h4 className="text-2xl font-black mb-4 italic">Man ki Ekagrata</h4>
               <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">Yadi jap karte samay man bhatke, toh ghabrayein nahi. Naam apna kaam karta rahega. Jaise dawai bina swaad ke bhi asar karti hai, waise hi 'Naam' aapke antahkaran ko shuddh kar dega.</p>
            </div>
          </div>
        </div>

        <div className="text-center py-20 border-t border-zinc-100 dark:border-zinc-900">
           <Sparkles className="w-12 h-12 text-brand-orange mx-auto mb-6" />
           <p className="text-zinc-400 font-black italic">"Japant Siddhi, Japant Siddhi, Japant Siddhi na sanshayah."</p>
        </div>
      </div>
    </div>
  );
}