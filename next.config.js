/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@react-pdf/renderer'],
  async redirects() {
    return [
      { source: '/sonidos', destination: '/', permanent: true },
      { source: '/ar-meditacion', destination: '/', permanent: true },
      { source: '/biofeedback', destination: '/', permanent: true },
      { source: '/companero', destination: '/', permanent: true },
      { source: '/onboarding', destination: '/', permanent: true },
    ]
  },
}

module.exports = nextConfig
