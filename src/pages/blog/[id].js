import React from "react";
import stylesBlog from '../../styles/Blog.module.css'
import parse from 'html-react-parser'
import {
  Center, Box, Heading
} from '@chakra-ui/react';
import Layout from "../../../components/Layaout";
import { getNoticia } from '../../../lib/data';

const EntradaBlog = ({ noticia }) => {
  if (!noticia) {
    return <Layout pagina='Noticia'><div>Noticia no encontrada</div></Layout>;
  }

  return (
    <Layout pagina='Noticia'>
      <div>
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
    </Layout>
  )
}

export async function getServerSideProps({ query: { id } }) {
  const noticia = getNoticia(id);
  return { props: { noticia: noticia || null } };
}

export default EntradaBlog
