"use client";

import { useState, useEffect } from "react";
import { Download, Share, PlusSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstallBanner() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // 1. Check karein ki kya app pehle se install ho chuki hai
    const isAppMode = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
    setIsStandalone(isAppMode);

    if (isAppMode) return; // Agar installed hai, toh aage kuch mat karo

    // 2. Check karein ki kya ye iOS (iPhone/iPad) hai
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // 3. Android/Chrome ke native popup ko Hijack karein
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault(); // Browser ka aalsi popup roko
      setDeferredPrompt(e); // Event ko save karo
      setIsInstallable(true); // Hamara custom button dikhao
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); // Ab native dialog dikhao
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false); // Install ho gaya toh banner hata do
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Agar installed hai ya user ne close kar diya, toh kuch mat dikhao
  if (isStandalone || !showBanner) return null;
  
  // Agar na iOS hai na Android PWA ready hai (jaise PC browser), toh mat dikhao
  if (!isInstallable && !isIOS) return null; 

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-white dark:bg-zinc-900 border-2 border-orange-500 shadow-[0_20px_50px_rgba(249,115,22,0.2)] rounded-3xl p-5 z-50 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-black text-zinc-900 dark:text-white text-lg flex items-center gap-2">
          <Download className="w-5 h-5 text-orange-500" />
          Sumeru App Download
        </h3>
        <button 
          onClick={() => setShowBanner(false)} 
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 rounded-full p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isInstallable ? (
        /* 🤖 ANDROID VIEW */
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Ek tap mein Sumeru ko apne phone mein install karein aur bina rukaawat sadhana karein.
          </p>
          <Button 
            onClick={handleInstall} 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl h-12 shadow-lg shadow-orange-500/20"
          >
            Install App Now 🚀
          </Button>
        </div>
      ) : isIOS ? (
        /* 🍎 APPLE iOS VIEW */
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            iPhone par app install karne ka tareeka:
          </p>
          <ol className="text-xs font-black text-zinc-700 dark:text-zinc-300 space-y-3 bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl border-2 border-zinc-100 dark:border-zinc-700">
            <li className="flex items-center gap-3">
              <span className="bg-white dark:bg-zinc-900 p-1.5 rounded-lg shadow-sm">
                <Share className="w-4 h-4 text-blue-500" />
              </span>
              Niche menu mein Share icon dabayein
            </li>
            <li className="flex items-center gap-3">
              <span className="bg-white dark:bg-zinc-900 p-1.5 rounded-lg shadow-sm">
                <PlusSquare className="w-4 h-4 text-zinc-900 dark:text-white" />
              </span>
              Scroll karke &quot;Add to Home Screen&quot; chuney
            </li>
          </ol>
        </div>
      ) : null}
    </div>
  );
}