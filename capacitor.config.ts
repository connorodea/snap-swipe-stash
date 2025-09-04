import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9f3b154be52e42a1a41dabee20c9f73a',
  appName: 'snap-swipe-stash',
  webDir: 'dist',
  server: {
    url: "https://9f3b154b-e52e-42a1-a41d-abee20c9f73a.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['photos', 'camera']
    }
  }
};

export default config;