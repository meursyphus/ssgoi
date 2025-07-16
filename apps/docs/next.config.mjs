/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/:lang/docs',
        destination: '/:lang/docs/getting-started/introduction',
        permanent: true,
      }
    ]
  }
};

export default nextConfig;