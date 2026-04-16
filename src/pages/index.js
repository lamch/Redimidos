import styles from '@/styles/Home.module.css'
import Layout from '../../components/Layaout'
import React from "react";
import Entrada from '../../components/Entrada';
import stylesBlog from '../styles/Blog.module.css'
import stylesTitulares from '../styles/Titulares.module.css'
import Recientes from "../pages/imagen/recientes"
import { Button, Text } from '@nextui-org/react';
import Link from "next/link"
import { getNoticias, serializarNoticias } from '../../lib/data';

export default function Home({ titular, todos, ultimoVideo }) {
  return (
    <Layout pagina='Inicio' url='/'>
      <main className='contenedor'>
        <h1 className='heading'>Noticias del día</h1>

        <div className={stylesTitulares.titulares}>
          {titular.map((entrada) => (
            <Entrada key={entrada.id} entrada={entrada} />
          ))}
        </div>

        {ultimoVideo && (
          <div className={styles.videoSection}>
            <h2 className='heading'>Último video</h2>
            <div className={styles.videoWrapper}>
              <iframe
                src={`https://www.youtube.com/embed/${ultimoVideo}`}
                title="Último video de Redimidos"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.videoIframe}
              />
            </div>
          </div>
        )}

        <h2 className='heading'>Últimas noticias</h2>

        <div className={stylesBlog.blog}>
          {todos.map(entrada => (
            <Entrada key={entrada.id} entrada={entrada} />
          ))}
        </div>

        <center>
          <Link href="/listaNoticias" className={stylesBlog.enlace}>
            <Button
              color="gradient" auto
              css={{
                width: '350px',
                height: '50px',
                '&:hover': {
                  transform: 'translateY(-7px)',
                  '&:after': { transform: 'scaleX(1.5) scaleY(1.6)', opacity: 0 }
                },
              }}
            >
              <div className={stylesBlog.boton}>Leer más</div>
            </Button>
          </Link>
        </center>

        <div className={stylesBlog.center}>
          <h2 className='heading'>Últimas Imagenes</h2>
          <Recientes id="recientes" />
        </div>
      </main>
    </Layout>
  )
}

export async function getServerSideProps() {
  const todas = serializarNoticias(getNoticias()).slice(0, 8);

  let ultimoVideo = null;
  try {
    const res = await fetch(
      'https://www.youtube.com/channel/UCyAUERYr27Uy7DgehnPsTzA/videos',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'es-ES,es;q=0.9',
        },
      }
    );
    const html = await res.text();
    const match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    if (match) ultimoVideo = match[1];
  } catch {
    // Si falla la petición no se muestra el video
  }

  return {
    props: {
      titular: todas.slice(0, 2),
      todos: todas.slice(2),
      ultimoVideo,
    }
  };
}
