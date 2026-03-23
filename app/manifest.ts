import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sumeru Chanting Tracker',
    short_name: 'Sumeru',
    description: 'A professional and minimalist Naam Jap tracker for seekers.',
    start_url: '/dashboard', 
    scope: '/',            
    display: 'standalone', 
    orientation: 'portrait', 
    background_color: '#09090b', 
    theme_color: '#ff8c00', 
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