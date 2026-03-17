import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  // 1. Check Auth (Security Layer)
  const { data: { user } } = await supabase.auth.getUser();

  // Agar user logged in nahi hai, toh use login page par bhej do
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-brand-bg text-brand-text transition-colors duration-300">
      {/* Sidebar hamesha left mein rahega */}
      <Sidebar user={user} />
      
      {/* Right side mein content change hota rahega */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}