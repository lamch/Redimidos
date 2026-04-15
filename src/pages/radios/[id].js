import React from "react";
import Image from 'next/image'
import Layout from "../../../components/Layaout";
import ReactAudioPlayer from 'react-audio-player';
import styles from '../../styles/AudioPlayer.module.css';
import { getRadio } from '../../../lib/data';

const EntradaRadio = ({ radio }) => {
  const [volumen, setVolumen] = React.useState(1);

  if (!radio) {
    return <Layout pagina='Radio'><div>Radio no encontrada</div></Layout>;
  }

  return (
    <Layout pagina='Radio'>
      <main className='contenedor'>
        <div className={styles.radioplayer}>
          <h2 className={styles.radioplayer__title}>{radio.titulo}</h2>

          <ReactAudioPlayer
            src={radio.url}
            autoPlay={true}
            controls
            showJumpControls={false}
            showFilledVolume={true}
            showDownloadProgress={true}
            onPlay={() => console.log("onPlay")}
            volume={volumen}
            onVolumeChanged={e => setVolumen(e)}
          />

          {radio.iurl && (
            <Image
              priority
              src={radio.iurl}
              alt={radio.titulo}
              width={400}
              height={400}
              className={styles.radioplayer__image}
            />
          )}

          <p className={styles.radioplayer__description}>{radio.descripcion}</p>
        </div>
      </main>
    </Layout>
  )
}

export async function getServerSideProps({ query: { id } }) {
  const radio = getRadio(id);
  return { props: { radio: radio || null } };
}

export default EntradaRadio
