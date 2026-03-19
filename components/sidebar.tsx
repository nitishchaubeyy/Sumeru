"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { useTheme } from "next-themes";
import { Trophy } from 'lucide-react';
import { useState, useEffect } from "react";
import {
  Home,
  LogOut,
  User as UserIcon,
  Flower2,
  Edit3,
  Sun,
  Moon
} from "lucide-react";

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const menuItems = [
    { name: "Mala", href: "/dashboard", icon: Flower2 },
    { name: "Mandal", href: "/dashboard/mandal", icon: Trophy },
    { name: "Manual", href: "/dashboard/manual", icon: Edit3 },
    { name: "Sankalp", href: "/dashboard/sankalp", icon: Home },
    { name: "Profile", href: "/dashboard/profile", icon: UserIcon },
  ];

  return (
    <aside className="
      fixed bottom-0 left-0 w-full h-24 
      md:sticky md:top-0 md:w-72 md:h-screen 
      bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl
      border-t md:border-t-0 md:border-r border-orange-100 dark:border-zinc-800 
      flex flex-row md:flex-col z-50 transition-all duration-300
    ">
      {/* Desktop Brand */}
      <div className="hidden md:block p-10">
        <h1 className="text-4xl font-black italic tracking-tighter text-zinc-900 dark:text-white">
          SUMERU<span className="text-brand-orange">.</span>
        </h1>
      </div>

      <nav className="flex flex-row md:flex-col flex-1 items-center justify-around md:justify-start md:px-6 md:space-y-4 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex flex-col md:flex-row items-center gap-2 md:gap-4 px-4 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-4xl font-black transition-all
                ${isActive 
                  ? "text-brand-orange md:bg-brand-orange md:text-white shadow-xl md:shadow-orange-200 dark:shadow-none scale-110 md:scale-100" 
                  : "text-zinc-400 dark:text-zinc-500 hover:text-brand-orange"}
              `}
            >
              <Icon className="w-7 h-7 md:w-6 md:h-6" />
              <span className="text-[12px] md:text-lg tracking-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User & Theme Section */}
      <div className="hidden md:block p-6 border-t border-orange-100 dark:border-zinc-800">
        <div className="bg-orange-50 dark:bg-zinc-900 rounded-4xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-brand-orange shadow-sm"
            />
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate text-zinc-900 dark:text-white">{user.user_metadata.full_name}</p>
              <p className="text-[10px] uppercase tracking-widest font-black text-brand-orange">Seeker</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {/* Theme Toggle */}
            {mounted && (
              <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center justify-center gap-2 w-full py-2 bg-white dark:bg-zinc-800 rounded-xl text-[10px] font-black shadow-sm border border-zinc-100 dark:border-zinc-700"
              >
                {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-brand-orange" /> : <Moon className="w-3.5 h-3.5 text-zinc-500" />}
                {theme === "dark" ? "LIGHT MODE" : "DARK MODE"}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl text-xs font-black shadow-sm hover:bg-red-100 transition-all border border-red-100 dark:border-red-900/30"
            >
              <LogOut className="w-4 h-4" />
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}