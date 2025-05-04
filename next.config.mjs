/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurazione per gestire meglio gli errori
  onDemandEntries: {
    // Periodo di tempo in ms in cui una pagina dovrebbe rimanere in buffer
    maxInactiveAge: 25 * 1000,
    // Numero di pagine che dovrebbero rimanere in buffer
    pagesBufferLength: 2,
  },
  // Configurazione per la gestione degli errori
  experimental: {
    // Abilita il logging dettagliato degli errori
    logging: {
      level: 'verbose',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disabilita la generazione statica per evitare errori durante il build
  output: 'standalone',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
