/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:lang/docs',
        destination: '/:lang/docs/getting-started/introduction',
        permanent: true,
      }
    ]
  }
};

export default nextConfig;