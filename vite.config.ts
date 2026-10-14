import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'CCycle — Seguimiento menstrual y bienestar',
        short_name: 'CCycle',
        description: 'Seguimiento menstrual, estimaciones del ciclo y bienestar. Tus datos, tus decisiones.',
        theme_color: '#8e5a7d',
        background_color: '#fdf8f4',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'es',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Nunca cachear API privada ni datos de salud
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkOnly'
          }
        ]
      }
    })
  ],
  server: { port: 5173 },
  test: { environment: 'jsdom', globals: true } as never
});
