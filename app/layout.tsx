import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/theme-provider";
import { Toaster } from "sonner"; // Naya import
import "./globals.css";

export const metadata: Metadata = {
  title: "Sumeru | Your Spiritual Journey",
  description: "Track your Naam Jap and join the Sangh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Toaster yahan add kiya hai */}
          <Toaster position="top-center" richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}