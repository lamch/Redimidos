import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layaout";
import { Gallery } from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Puede usarse como página (/imagen/recientes) o como componente embebido
const Recientes = ({ id = 'recientes', asPage = false, limit = null }) => {
  const [files, setFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    fetch(`/api/imagenes/${id}`)
      .then(r => r.json())
      .then(data => setFiles(data))
      .catch(() => setFiles([]));
  }, [id]);

  const handleClick = (idx) => {
    setIndex(idx);
    setOpen(true);
  };

  const imagenesMostradas = limit ? files.slice(-limit) : files;

  const contenido = (
    <div>
      <Gallery
        images={imagenesMostradas}
        rowHeight={500}
        onClick={handleClick}
        enableImageSelection={false}
      />
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={imagenesMostradas}
        index={index}
      />
    </div>
  );

  if (asPage) {
    return (
      <Layout pagina='Imágenes recientes'>
        <main className='contenedor'>{contenido}</main>
      </Layout>
    );
  }

  return contenido;
}

export async function getServerSideProps() {
  return { props: { asPage: true } };
}

export default Recientes
