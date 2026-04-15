import React, { useState } from "react";
import Layout from "../../../components/Layaout";
import { Gallery } from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { getImagenesDeFolder } from '../../../lib/data';

const EntradaImagen = ({ files }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(-1);

  const handleClick = (idx) => {
    setIndex(idx);
    setOpen(true);
  };

  return (
    <Layout pagina='Imagenes'>
      <main className='contenedor'>
        <Gallery
          images={files}
          rowHeight={500}
          onClick={handleClick}
          enableImageSelection={false}
        />
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={files}
          index={index}
        />
      </main>
    </Layout>
  )
}

export async function getServerSideProps({ query: { id } }) {
  const files = getImagenesDeFolder(id);
  return { props: { files } };
}

export default EntradaImagen
