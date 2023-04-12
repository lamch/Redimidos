import React, { useEffect, useState, Fragmen, useRef } from "react";
import parse from 'html-react-parser'
import { collection, limit, onSnapshot, query as fireQuery, where, doc, docs, getDocs, getDoc, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import Image from 'next/image'
import { Gallery } from "react-grid-gallery";
import { Grid } from "react-visual-grid";


import Layout from "../../../components/Layaout";
import { ref, list, listAll, getDownloadURL } from "firebase/storage"
import { storage } from "../../../firebase";

import { Carousel } from 'react-responsive-carousel';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import ReactPlayer from 'react-player'
import ReactAudioPlayer from 'react-audio-player';;
import { db } from "../../../firebase";

import styles from '../../styles/AudioPlayer.module.css';

const EntradaRadio = ({ id }) => {

  

  const [singleNote, setSingleNote] = React.useState([]);
    console.log("eeee" + id);
  
    const [count, setCount] = React.useState({id}); 
    const [volumen, setVolumne] = React.useState(1); 
  
    useEffect(() => {
        console.log("dddd" + id);
        console.log("fffff" + count);
        //findOne();
    
        //if(singleNote == null){
        //try {
     //  console.log(router);
     
      getSingleNote(id)
    // setSingleNote({ ...data.data(), id: data.id })
  
  
    
    }, []
    )


    const getSingleNote = async (id) => {
      console.log("aaa" + id);
     if(id != null && id != undefined){
      const singleNotea = doc(db, 'radios', id);
      const data = await getDoc(singleNotea);
      //setSingleNote({ ...data.data(), id: data.id })
      
      setSingleNote({ ...data.data(), id: data.id })
     }
     
         
      }


  return (

    <Layout pagina='Radio'>
     <main className='contenedor'>
      
     
     <div className={styles.radioplayer}>
      <h2 className={styles.radioplayer__title}>{singleNote.titulo}</h2>

      <ReactAudioPlayer
  src={singleNote.url}
  autoPlay={true}
  controls
  showJumpControls={false}
  showFilledVolume={true}
  showDownloadProgress={true}
  onPlay={e => console.log("onPlay")}
  volume={volumen}
  onVolumeChanged={e=>setVolumne(e)}
  
/>


<Image priority
                src={singleNote.iurl}
                alt={singleNote.titulo}
                width={400}
                height={400}
                responsive
                className={styles.radioplayer__image}
            />

      <p className={styles.radioplayer__description}>{singleNote.descripcion}</p>


    
      </div>
      


     

      </main>
    </Layout>
  )
}



export async function getServerSideProps({ query: { id } }) {

  return {
    props: {
      //data: aaaa
      id
    }
  }

}



export default EntradaRadio