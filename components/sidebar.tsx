"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  Home,
  Settings,
  LogOut,
  User as UserIcon,
  Flower2, // Mala ke liye icon
} from "lucide-react";

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const menuItems = [
    { name: "Mala Dashboard", href: "/dashboard", icon: Flower2 },
    {
      name: "Sankalp Tracker",
      href: "/dashboard/sankalp",
      icon: Home,
      disabled: true,
    },
    {
      name: "My Profile",
      href: "/dashboard/profile",
      icon: UserIcon,
      disabled: false,
    }, 
  ];

  return (
    <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-orange-100 dark:border-zinc-800 flex flex-col h-screen sticky top-0 transition-colors duration-300">
      {/* --- App Brand --- */}
      <div className="p-8">
        <h1 className="text-2xl font-black text-brand-orange tracking-tighter">
          SUMERU
        </h1>
      </div>

      {/* --- Navigation --- */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.disabled ? "#" : item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all
                ${item.disabled ? "opacity-30 cursor-not-allowed" : "hover:scale-[1.02]"}
                ${
                  isActive
                    ? "bg-brand-orange text-white shadow-lg shadow-orange-200 dark:shadow-none"
                    : "text-slate-500 dark:text-zinc-400 hover:bg-orange-50 dark:hover:bg-zinc-900"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* --- User Profile Section --- */}
      <div className="p-4 border-t border-orange-100 dark:border-zinc-800">
        <div className="bg-orange-50 dark:bg-zinc-900 rounded-3xl p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-brand-orange shadow-sm"
            />
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">
                {user.user_metadata.full_name}
              </p>
              <p className="text-[10px] uppercase tracking-widest font-black text-brand-orange">
                Seeker
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 bg-white dark:bg-zinc-800 text-red-500 rounded-xl text-xs font-black shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-red-100 dark:border-red-900/30"
          >
            <LogOut className="w-4 h-4" />
            LOGOUT
          </button>
        </div>
      </div>
    </aside>
  );
}
