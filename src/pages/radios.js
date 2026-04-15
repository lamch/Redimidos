import React, { useState } from "react";
import dynamic from "next/dynamic";
import Layout from '../../components/Layaout';
import styles from '../styles/Radio.module.css';
import { getRadios } from '../../lib/data';

const AudioPlayer = dynamic(() => import('react-h5-audio-player'), { ssr: false });

const Radios = ({ radios }) => {
  const [radioActiva, setRadioActiva] = useState(radios[0] ?? null);

  const seleccionar = (radio) => {
    setRadioActiva(radio);
  };

  return (
    <Layout pagina='Radios'>
      <main className='contenedor'>
        <h1 className='heading'>Radios Cristianas</h1>

        <div className={styles.playerWrapper}>
          <div className={styles.playerInfo}>
            <img
              className={styles.playerImg}
              src={radioActiva.iurl}
              alt={radioActiva.titulo}
            />
            <div>
              <h2 className={styles.playerTitle}>{radioActiva.titulo}</h2>
              {radioActiva.descripcion && (
                <p className={styles.playerDesc}>{radioActiva.descripcion}</p>
              )}
            </div>
          </div>
          <AudioPlayer
            key={radioActiva.id}
            src={radioActiva.url}
            autoPlay
            showJumpControls={false}
            showSkipControls={false}
            customAdditionalControls={[]}
            layout="stacked-reverse"
          />
        </div>

        <div className={styles.grid}>
          {radios.map((radio) => (
            <RadioCard
              key={radio.id}
              radio={radio}
              activa={radioActiva?.id === radio.id}
              onClick={() => seleccionar(radio)}
            />
          ))}
        </div>
      </main>
    </Layout>
  );
};

const RadioCard = ({ radio, activa, onClick }) => (
  <button
    className={`${styles.card} ${activa ? styles.cardActiva : ''}`}
    onClick={onClick}
    aria-label={`Reproducir ${radio.titulo}`}
  >
    <div className={styles.cardImgWrap}>
      <img className={styles.cardImg} src={radio.iurl} alt={radio.titulo} />
      <div className={styles.playOverlay}>
        {activa ? (
          <span className={styles.pauseIcon}>&#9646;&#9646;</span>
        ) : (
          <span className={styles.playIcon}>&#9654;</span>
        )}
      </div>
    </div>
    <p className={styles.cardNombre}>{radio.titulo}</p>
  </button>
);

export async function getServerSideProps() {
  const radios = [...(getRadios())].sort((a, b) =>
    (a.titulo || '').localeCompare(b.titulo || '')
  );
  return { props: { radios } };
}

export default Radios;
