import Layout from '../../components/Layaout'
import React from "react";
import Noticias from '../../components/Noticias';
import stylesBlog from '../styles/Noticias.module.css'
import { getNoticias, serializarNoticias } from '../../lib/data';

export default function Home({ todos }) {
  return (
    <Layout pagina='Noticias' descripcion='Todas las noticias cristianas. Entérate de lo último en el mundo cristiano.' url='/noticias'>
      <main className='contenedor'>
        <h2 className='heading'>Todas las noticias</h2>
        <div className={stylesBlog.blog}>
          {todos.map(entrada => (
            <Noticias key={entrada.id} entrada={entrada} />
          ))}
        </div>
      </main>
    </Layout>
  )
}

export async function getServerSideProps() {
  const todos = serializarNoticias(getNoticias());
  return { props: { todos } };
}
