import React from "react";
import Layout from '../../components/Layaout'
import ImagenCategoria from "../../components/ImagenCategoria";
import stylesBlog from '../styles/Blog.module.css'
import { getCategoriasImagenes } from '../../lib/data';

const Imagenes = ({ categorias }) => {
  return (
    <Layout pagina='Imagenes'>
      <main className='contenedor'>
        <div className={stylesBlog.blog}>
          {categorias.map(entrada => (
            <ImagenCategoria key={entrada.id || entrada.url} entrada={entrada} />
          ))}
        </div>
      </main>
    </Layout>
  )
}

export async function getServerSideProps() {
  const categorias = getCategoriasImagenes();
  return { props: { categorias } };
}

export default Imagenes
