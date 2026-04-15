import Layout from '../../components/Layaout'
import React, { useState } from "react";
import Noticias from '../../components/listaNoticias';
import stylesBlog from '../styles/ListaNoticias.module.css'
import { Button, Text } from '@nextui-org/react';
import { getNoticias, serializarNoticias } from '../../lib/data';

const PASO = 6;
const INICIAL = 12;

export default function Home({ todasNoticias }) {
  const [visible, setVisible] = useState(INICIAL);

  return (
    <Layout pagina='Noticias'>
      <div className={stylesBlog.padding}>
        <h2 className='heading'>Últimas noticias</h2>
        <div className={stylesBlog.blog}>
          {todasNoticias.slice(0, visible).map(entrada => (
            <Noticias key={entrada.id} entrada={entrada} />
          ))}
        </div>
      </div>

      {visible < todasNoticias.length && (
        <center>
          <Button
            color="gradient" auto
            onClick={() => setVisible(prev => prev + PASO)}
            css={{
              width: '350px',
              height: '50px',
              '&:hover': {
                transform: 'translateY(-7px)',
                '&:after': { transform: 'scaleX(1.5) scaleY(1.6)', opacity: 0 }
              },
            }}
          >
            <div className={stylesBlog.boton}>Más antiguas</div>
          </Button>
        </center>
      )}
    </Layout>
  )
}

export async function getServerSideProps() {
  const todasNoticias = serializarNoticias(getNoticias());
  return { props: { todasNoticias } };
}
