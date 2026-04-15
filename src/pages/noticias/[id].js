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
import { getNoticia, getNoticias, serializarNoticias } from '../../../lib/data';

const EntradaBlog = ({ id, noticia, relacionadas, ultimos }) => {
  if (!noticia) {
    return <Layout pagina='Noticia'><div>Noticia no encontrada</div></Layout>;
  }

  return (
    <Layout pagina={noticia.titulo}>
      <div className={stylesBlog.blog}>
        <div className={stylesBlog.content}>
          <Center as='section' bg='gray.100'>
            <Box maxW='1020px' bg='white' p='6'>
              <Heading my='4' size='lg'>
                <a className={stylesBlog.a}>{noticia.titulo}</a>
              </Heading>
              <div className={stylesBlog.margen}>
                {parse(noticia.descripcion
                  ? noticia.descripcion.replaceAll("font-size:48px", "font-size:20px")
                  : ""
                )}
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
            <Entrada key={entrada.id} entrada={entrada} />
          ))}
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ query: { id } }) {
  const noticia = getNoticia(id);
  if (!noticia) {
    return { props: { id, noticia: null, relacionadas: [], ultimos: [] } };
  }

  const todas = serializarNoticias(getNoticias());
  const relacionadas = todas
    .filter(n => n.categoria === noticia.categoria && n.id !== id)
    .slice(0, 10);
  const ultimos = todas.slice(0, 8);

  const noticiaSerializada = todas.find(n => n.id === id) || null;

  return {
    props: { id, noticia: noticiaSerializada, relacionadas, ultimos }
  };
}

export default EntradaBlog
