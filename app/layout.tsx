import type { Metadata, Viewport } from "next"; 
import { ThemeProvider } from "@/lib/theme-provider"; 
import { Toaster } from "sonner";
import "./globals.css";


export const viewport: Viewport = {
  themeColor: "#ff8c00",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, 
};

export const metadata: Metadata = {
  title: "SUMERU. | Aapka Aadhyatmik Saathi 🏔️",
  description: "Track Jap. Build Streaks. Join the Mandal.",
  manifest: "/manifest.webmanifest", 
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sumeru",
  },
  icons: {
    icon: "/icon-192.png", 
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}