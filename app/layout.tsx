import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/theme-provider"; // Ensure this is using next-themes
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "SUMERU. | Your Spiritual Journey",
  description: "Track your Naam Jap and join the Sangh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning is important because next-themes 
        will modify the class on the html tag before the page hydrates.
      */}
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