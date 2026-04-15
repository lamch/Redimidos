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

export default function Home({ titular, todos }) {
  return (
    <Layout pagina='Inicio'>
      <main className='contenedor'>
        <h1 className='heading'>Noticias del día</h1>

        <div className={stylesTitulares.titulares}>
          {titular.map((entrada) => (
            <Entrada key={entrada.id} entrada={entrada} />
          ))}
        </div>

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
  return {
    props: {
      titular: todas.slice(0, 2),
      todos: todas.slice(2),
    }
  };
}
