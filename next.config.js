/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/ar-meditacion', destination: '/', permanent: true },
      { source: '/biofeedback', destination: '/', permanent: true },
      { source: '/companero', destination: '/', permanent: true },
      { source: '/onboarding', destination: '/', permanent: true },
    ]
  },
}

module.exports = nextConfig
