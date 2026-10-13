import type { NextConfig } from "next";

// Jornal pausado (sem atualização, pouco uso): manda tudo pro site principal em vez de
// mostrar conteúdo parado. Reversível - é só tirar isso daqui pra reativar.
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "https://heliofilho.dev",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
