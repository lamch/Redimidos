import React from "react"
import Head from "next/head"
import Header from "./Header"
import Footer from "./Footer"

const SITE_URL = 'https://redimidos.net';
const DEFAULT_DESC = 'Noticias e información cristiana actualizada. Mantente al día con lo que ocurre en el mundo cristiano.';
const DEFAULT_IMG = `${SITE_URL}/og-default.jpg`;

const Layout = ({ children, pagina, descripcion, imagen, url, tipo = 'website' }) => {
  const title = pagina === 'Inicio'
    ? 'Redimidos - Noticias Cristianas'
    : `${pagina} | Redimidos`;

  const metaDesc = descripcion || DEFAULT_DESC;
  const metaImg  = imagen || DEFAULT_IMG;
  const metaUrl  = url ? `${SITE_URL}${url}` : SITE_URL;

  const jsonLd = tipo === 'article'
    ? {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: pagina,
        image: [metaImg],
        url: metaUrl,
        publisher: {
          '@type': 'Organization',
          name: 'Redimidos',
          url: SITE_URL,
        },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Redimidos',
        url: SITE_URL,
        description: DEFAULT_DESC,
      };

  return (
    <div>
      <div className="bgArea">
        <ul className="bgCircles">
          <li/><li/><li/><li/><li/>
          <li/><li/><li/><li/><li/>
        </ul>
      </div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={metaUrl} />

        {/* Google Search Console */}
        <meta name="google-site-verification" content="--_PYKSDhPDf7kuN157LtngUxB65-Ibxtd1edphWC0I" />

        {/* Open Graph */}
        <meta property="og:type"        content={tipo} />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image"       content={metaImg} />
        <meta property="og:url"         content={metaUrl} />
        <meta property="og:site_name"   content="Redimidos" />
        <meta property="og:locale"      content="es_ES" />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image"       content={metaImg} />

        {/* Datos estructurados JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <link rel="icon" href="/favicon.ico" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9577139226355545" crossOrigin="anonymous" />

        <link rel="stylesheet" type="text/css" charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
      </Head>

      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default Layout