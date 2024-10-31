/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
        },
      ];
    },
    compiler: {
      styledComponents: true,
    },
    images: {
      domains: process.env.NEXT_PUBLIC_HOSTNAME ? [process.env.NEXT_PUBLIC_HOSTNAME] : [],
      remotePatterns: [
        {
          protocol: 'http',
          hostname: process.env.NEXT_PUBLIC_HOSTNAME || '', // Assurez-vous qu'il y a une valeur par défaut
          port: '5000',
          pathname: '/public/uploads/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  