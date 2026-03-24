"use client";

import { useState, useEffect } from "react";
import { Download, Share, PlusSquare, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardInstallBanner() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // 1. Check karein ki kya app pehle se install ho chuki hai
    const isAppMode = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
    
    // 2. Check karein ki kya user ne is session mein X daba diya tha
    const hasDismissed = sessionStorage.getItem("dismissedInstallBanner");

    // Agar app installed hai YA user ne dismiss kiya hai, toh mat dikhao
    if (isAppMode || hasDismissed === "true") {
      return;
    }

    // 3. Apple iOS detect karein
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // 4. Android PWA Prompt Event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    // Banner ko dikhana shuru karein (kyunki user ne dismiss nahi kiya hai)
    setIsVisible(true);

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("dismissedInstallBanner", "true");
    setIsVisible(false);
  };

  const handleInstallClick = async () => {
    // Agar iOS hai, toh popup instructions dikhao
    if (isIOS) {
      setShowIOSInstructions(!showIOSInstructions);
      return;
    }

    // Agar Android hai par prompt ready nahi hai (PC/Fallback)
    if (!deferredPrompt) {
      alert("Aapke browser mein install prompt block ho gaya hai. Browser menu se 'Add to Home Screen' chuney.");
      return;
    }

    // Android/Chrome 1-Click Install
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-linear-to-r from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/20 border-2 border-orange-200 dark:border-orange-800/50 rounded-4xl p-6 mb-8 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm">
      {/* Background Icon Decoration */}
      <Smartphone className="absolute -right-6 -top-6 w-32 h-32 text-orange-500/10 rotate-12" />
      
      <div className="relative z-10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 pr-8">
          <h3 className="font-black text-orange-800 dark:text-orange-400 text-lg mb-1 flex items-center gap-2">
            Sumeru App Download <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span></span>
          </h3>
          <p className="text-sm font-bold text-orange-700/80 dark:text-orange-200/60 leading-tight">
            Bina rukaawat sadhana karne ke liye, Sumeru ko apne phone ki home screen par add karein.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
          <Button 
            onClick={handleInstallClick}
            className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl h-12 px-6 shadow-lg shadow-orange-500/20"
          >
            <Download className="w-4 h-4 mr-2" />
            {isIOS ? "iOS Install Guide" : "Install App 🚀"}
          </Button>
        </div>
      </div>

      {/* Cross (X) Button */}
      <button 
        onClick={handleDismiss}
        title="Hide for this session"
        className="absolute top-4 right-4 p-2 text-orange-400 hover:text-orange-600 hover:bg-orange-200/50 dark:hover:bg-orange-800/50 rounded-full transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* iOS Instructions Expansion */}
      {isIOS && showIOSInstructions && (
        <div className="mt-6 pt-5 border-t-2 border-orange-200/50 dark:border-orange-800/30 animate-in fade-in slide-in-from-top-2">
          <p className="text-xs font-black uppercase tracking-widest text-orange-800 dark:text-orange-400 mb-3 ml-1">
            iPhone par install karne ke steps:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-900/50 p-3 rounded-2xl">
              <span className="bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-sm">
                <Share className="w-4 h-4 text-blue-500" />
              </span>
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Niche browser mein <strong className="text-blue-500">Share</strong> icon dabayein</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-900/50 p-3 rounded-2xl">
              <span className="bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-sm">
                <PlusSquare className="w-4 h-4 text-zinc-900 dark:text-white" />
              </span>
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Scroll karke <strong className="text-zinc-900 dark:text-white underline decoration-orange-300">&quot;Add to Home Screen&quot;</strong> chuney</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}