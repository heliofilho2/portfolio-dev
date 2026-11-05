import type { NextConfig } from "next";

// Modo manutenção: desligado por padrão. Para ligar, definir MAINTENANCE_MODE=true na Vercel e fazer
// redeploy. Antes era um middleware (proxy.ts), mas ele rodava em toda requisição mesmo desligado:
// uma chamada de função a mais por visita, prefetch e robô. Como rewrite, só existe quando está ligado.
// Painel, APIs e arquivos estáticos continuam acessíveis: dá pra preparar conteúdo com o site fechado.
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";

const nextConfig: NextConfig = {
  images: {
    // Fotos enviadas pelo /admin ficam no Supabase Storage (bucket público "media").
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  // Os primeiros e-mails para marcas foram com "midia-kit" (em português); o endereço certo é /media-kit.
  async redirects() {
    return [
      { source: "/midia-kit", destination: "/media-kit", permanent: true },
      { source: "/mediakit", destination: "/media-kit", permanent: true },
    ];
  },
  async rewrites() {
    if (!MAINTENANCE_MODE) return [];
    return {
      beforeFiles: [
        {
          source: "/:path((?!maintenance|admin|api|_next|favicon\\.ico|icon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
          destination: "/maintenance",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
