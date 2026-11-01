import type { NextConfig } from 'next';

const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/actor-website-vs-instagram-linktree-casting-profile',
        destination: '/do-actors-need-a-website',
        permanent: true,
      },
      {
        source: '/las-vegas-actor-website-design',
        destination: '/actor-website-design',
        permanent: true,
      },
    ];
  },
  async headers() {
    const production = process.env.VERCEL_ENV === 'production';
    const publicNoIndexPaths = ['/examples/:path*', '/privacy', '/terms', '/accessibility', '/start'];

    return [
      { source: '/:path*', headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ] },
      ...publicNoIndexPaths.map((source) => ({
        source,
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }],
      })),
      ...['/thanks', '/preview/:path*'].map((source) => ({
        source,
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      })),
      // Last matching header wins, so preview protection applies to every route.
      ...(!production ? [{
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      }] : []),
    ];
  },
};

export default config;
