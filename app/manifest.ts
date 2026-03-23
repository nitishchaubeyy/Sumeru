import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sumeru Chanting Tracker',
    short_name: 'Sumeru',
    description: 'A professional and minimalist Naam Jap tracker for seekers.',
    start_url: '/dashboard', // App khulne par seedha yahan jayega
    display: 'standalone',    // (Full screen feel)
    background_color: '#09090b', // Zinc-950 (Aapka dark theme background)
    theme_color: '#ff8c00',      // Brand Orange
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable', 
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}