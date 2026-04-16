import { getNoticias, serializarNoticias } from '../../../lib/data';

const SITE_URL = 'https://redimidos.net';

export async function getServerSideProps({ res }) {
  const noticias = serializarNoticias(getNoticias());

  const urls = [
    { loc: SITE_URL, changefreq: 'daily', priority: '1.0' },
    { loc: `${SITE_URL}/noticias`, changefreq: 'daily', priority: '0.8' },
    ...noticias.map(n => ({
      loc: `${SITE_URL}/noticias/${n.id}`,
      lastmod: new Date(n.fecha).toISOString(),
      changefreq: 'weekly',
      priority: '0.7',
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
