import React, { useEffect, useState, Fragmen, useRef } from "react";
import Link from 'next/link';

import stylesBlog from '../../styles/Noticia.module.css'
import parse from 'html-react-parser';
import Slider from "react-slick";
import Entrada from '../../../components/Entrada';
import { collection, limit, onSnapshot, query as fireQuery, where, doc, docs, getDocs, getDoc, QueryDocumentSnapshot, DocumentData, orderBy } from "firebase/firestore";

import {
  Badge,
  Button,
  Center,
  Flex,
  Image,
  Stack,
  Text,
  useColorModeValue,
  Box,
  HStack,
  Tag,
  Heading,
  ChakraNextImage
} from '@chakra-ui/react';
import { db } from "../../../firebase";
import Layout from "../../../components/Layaout";
import { Black_And_White_Picture } from "next/font/google";

export async function getNote(id) {
  const docRef = doc(db, "noticias", id);
  const docSnap = await getDoc(docRef);
  const objectData = docSnap.data();
  return JSON.parse(JSON.stringify(objectData));
}

/*export async function Carrusel({noticias}) {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Slider {...settings}>
      {noticias.map(noticia => (
        <div key={noticia.id}>
          <div 
            className="slide"
            style={{backgroundImage: `url(${noticia.imagen})`}}
          >
            <h2>{noticia.titulo}</h2>
          </div>
        </div>
      ))}
    </Slider>
  );


<Slider {...settings}>

{todos.map(entrada => (

<div key={entrada.id}>
  
<div 
            className={stylesBlog.slide}
            style={{backgroundImage: `url(${entrada.imagen})`}}
          >
            <h2>{entrada.titulo}</h2>
          </div>


  </div>

))
}
      
    </Slider>



}*/

function manualSerialize(obj) {
  const serializedObj = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Verificar si es un objeto y hacer la serialización recursivamente si es necesario
      if (typeof obj[key] === 'object') {
        serializedObj[key] = manualSerialize(obj[key]);
      } else {
        serializedObj[key] = obj[key];
      }
    }
  }

  return serializedObj;
}

const EntradaBlog = ({ id, titulo, fecha, categoria, descripcion, imagen }) => {

  const [todos, setTodos] = React.useState([]);
  const [ultimos, setUltimos] = React.useState([]);

  const [singleNote, setSingleNote] = React.useState(categoria);
  //const [singleNote, setSingleNote] = React.useState(note);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const getSingleNote = async (id) => {

    if (id != null && id != undefined) {
      const singleNotea = doc(db, 'noticias', id);
      const data = await getDoc(singleNotea);

      setSingleNote({ ...data.data(), id: data.id, });
      setCategoria({ ...data.data().categoria });
    }


  }




  /*
    useEffect(() => {
  
  
      getSingleNote(id);
  
  
    }, [id]
    );
  */

  useEffect(() => {
    //setSingleNote(note);
    console.log("cata   : " + categoria);

    refreshData();
    refreshUltimo();
    //console.log("todos : " + todos);


  }, [singleNote]
  );






  const refreshData = async () => {

    console.log("nota:  " + singleNote);
    const q = await fireQuery(collection(db, "noticias"), where('categoria', '==', singleNote), orderBy('fecha', "desc"), limit(10));
    onSnapshot(q, (querySnapchot) => {
      let ar = [];
      let art = [];
      querySnapchot.docs.forEach((doc, index) => {
        if (doc.id != id) {
          ar.push({ id: doc.id, ...doc.data() });
        }




      });
      setTodos(ar);
    });
  }


  const refreshUltimo = async () => {

    console.log("nota:  " + singleNote);
    const q = await fireQuery(collection(db, "noticias"), orderBy('fecha', "desc"), limit(8));
    onSnapshot(q, (querySnapchot) => {
      let ar = [];
      let art = [];
      querySnapchot.docs.forEach((doc, index) => {
      
          ar.push({ id: doc.id, ...doc.data() });
        




      });
      setUltimos(ar);
    });
  }

  return (


    <Layout pagina={titulo}>
      <div className={stylesBlog.blog}>
        <Center as='section' bg='gray.100' >
          <Box maxW='1020px' bg='white' p='6'>


            <Heading my='4' size='lg'>
              <a className={stylesBlog.a}>
                {titulo}
              </a>
            </Heading>
            <div className={stylesBlog.margen}>
              {parse(descripcion ? descripcion.replaceAll("font-size:48px", "font-size:20px") : ""
              )}
            </div>

          </Box>
        </Center>
        

        <div className={stylesBlog.navbar}>

          <div className={stylesBlog.container}>
          <div className={stylesBlog.titulo}>
            {categoria}
          </div>


          <ul className={stylesBlog.listaNav}>

            {todos.map(entrada => (



              <li className={stylesBlog.item}>

<Link href={`/noticias/${entrada.id}`} >

                <div className={stylesBlog.lista}>
                  <a className={stylesBlog.a}>
                    {entrada.titulo}
                  </a>
                </div>
</Link>
              </li>


            ))
            }

          </ul>
          </div>
        </div>

      </div>
      
      <div className={stylesBlog.footer}>
     
     <h1>Últimas noticias</h1>
     
     <div className={stylesBlog.grilla}>
               {ultimos.map(entrada => (
                 <Entrada
                   key= {entrada.id} 
                   entrada={entrada} 
                 />
                 
                
               ))
               }
             </div>
     </div>
    </Layout>

    
  )
}

export async function getServerSideProps({ query: { id } }) {

  const note = await getNote(id);
  const titulo = note.titulo;
  const fecha = note.fecha;
  const categoria = note.categoria;
  const descripcion = note.descripcion;
  console.log(note.titulo);
  const serializedSingleNote = manualSerialize(note);
  // const aaa = JSON.parse(note);

  return {
    props: {
      id,
      titulo,
      fecha,
      categoria,
      descripcion
    }
  }

}



export default EntradaBlog