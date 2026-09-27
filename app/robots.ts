import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://quran-elhafez.com'

  return {
    rules: [
      // Allow all good bots
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'Sogou', 'YandexBot', 'YandexMobileBot'],
        allow: '/',
      },
      // Standard rules for common bots
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/.well-known/ai.txt',
          '/*?*sort=',
          '/*?*filter=',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
