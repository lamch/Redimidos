import React from "react";
import Link from 'next/link';
import stylesBlog from '../../styles/Noticia.module.css'
import parse from 'html-react-parser';
import Entrada from '../../../components/Entrada';
import NavBar from '../../../components/NavBar';
import {
  Center, Box, Heading
} from '@chakra-ui/react';
import Layout from "../../../components/Layaout";
import { getNoticias, serializarNoticias } from '../../../lib/data';

function limpiarDescripcion(html) {
  if (!html) return '';
  return html
    // Eliminar etiquetas <img> (la imagen ya se muestra arriba desde el campo imagen)
    .replace(/<img[^>]*>/gi, '')
    // Eliminar todas las declaraciones font-size inline para unificar via CSS
    .replace(/font-size\s*:\s*[^;}"']+;?/gi, '')
    // Eliminar estilos complejos generados por IA (variables --cib-*, --bs-*, --rz-*)
    .replace(/\b(line-height|font-variation-settings|font-weight|display|user-select|word-break)\s*:\s*var\([^)]+\)\s*;?/gi, '')
    // Limpiar atributos style que quedaron vacíos o solo con espacios
    .replace(/style="\s*"/gi, '')
    .replace(/style='\s*'/gi, '');
}

function extraerDescripcion(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().substring(0, 160);
}

const EntradaBlog = ({ id, noticia, relacionadas, ultimos }) => {
  if (!noticia) {
    return <Layout pagina='Noticia'><div>Noticia no encontrada</div></Layout>;
  }

  return (
    <Layout
      pagina={noticia.titulo}
      descripcion={extraerDescripcion(noticia.descripcion)}
      imagen={noticia.imagen}
      url={`/noticias/${id}`}
      tipo="article"
    >
      <div className={stylesBlog.blog}>
        <div className={stylesBlog.content}>
          <Center as='section' bg='gray.100'>
            <Box maxW='1020px' bg='white' p='6'>
              <Heading my='4' size='lg'>
                <a className={stylesBlog.a}>{noticia.titulo}</a>
              </Heading>
              {noticia.imagen && (
                <img
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  className={stylesBlog.imagenPrincipal}
                />
              )}
              <div className={`${stylesBlog.margen} ${stylesBlog.contenidoNoticia}`}>
                {parse(limpiarDescripcion(noticia.descripcion))}
              </div>
            </Box>
          </Center>
        </div>

        <div className={stylesBlog.NavBar}>
          <NavBar category={noticia.categoria} noticias={relacionadas} />
        </div>
      </div>

      <div className={stylesBlog.footer}>
        <h1>Últimas noticias</h1>
        <div className={stylesBlog.grilla}>
          {ultimos.map(entrada => (
            <Entrada key={entrada.id} entrada={entrada} height="350px" />
          ))}
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ query: { id } }) {
  const todas = serializarNoticias(getNoticias());
  const noticiaSerializada = todas.find(n => n.id === id) || null;

  if (!noticiaSerializada) {
    return { props: { id, noticia: null, relacionadas: [], ultimos: [] } };
  }

  const relacionadas = todas
    .filter(n => n.categoria === noticiaSerializada.categoria && n.id !== id)
    .slice(0, 10);
  const ultimos = todas.slice(0, 8);

  return {
    props: { id, noticia: noticiaSerializada, relacionadas, ultimos }
  };
}

export default EntradaBlog
