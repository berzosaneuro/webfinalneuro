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
      // Biblioteca: slugs alineados con tono experiencial (301 permanentes)
      {
        source: '/biblioteca/neuroplasticidad-aplicada-al-ahora',
        destination: '/biblioteca/tu-mente-puede-cambiar-de-habito',
        permanent: true,
      },
      {
        source: '/biblioteca/sueno-y-neuroplasticidad',
        destination: '/biblioteca/sueno-cuando-la-mente-ordena-el-dia',
        permanent: true,
      },
      {
        source: '/biblioteca/cortisol-y-estres-cronico',
        destination: '/biblioteca/estres-cronico-cuando-la-alarma-no-se-apaga',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
