import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Prevents web app manifest and 401 status code (Unauthorized)
      useCredentials: true,
      // Disable service worker registration
      injectRegister: null, 
      manifest: {
        name: "Number Streak – listen and learn numbers in foreign languages",
        short_name: "Listen Numbers",
        description: "Practice listening skills with Number Streak!",
        id: "NumStr",
        start_url: "/",
        theme_color: "#1f69ff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "regular_icon_x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable_icon_x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "regular_icon_x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable_icon_x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
