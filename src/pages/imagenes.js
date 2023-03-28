import React, { useEffect } from "react";
import Layout from '../../components/Layaout'
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Grid, GridItem, Box, SimpleGrid, Center, useColorModeValue, Stack, Heading, Text } from '@chakra-ui/react'
import Image from 'next/image';
import { db } from "../../firebase"
import Link from 'next/link';
import ImagenCategoria from "../../components/ImagenCategoria";
import stylesBlog from '../styles/Blog.module.css'

const Imagenes = () => {



  const [todos, setTodos] = React.useState([]);

  const refreshData = () => {

    const q = query(collection(db, "categoriasImagenes"));

    onSnapshot(q, (querySnapchot) => {
      let ar = [];
      querySnapchot.docs.forEach((doc) => {
        ar.push({ id: doc.id, ...doc.data() });
      });
      setTodos(ar);
    });
  };

  useEffect(() => {
    refreshData();
  }, []);



  return (
    <Layout pagina='Imagenes'>



      <main className='contenedor'>
        <h2 className='heading'></h2>
        <div className={stylesBlog.blog}>
          {todos.map(entrada => (
            <ImagenCategoria
              key={entrada.url}
              entrada={entrada}
            />
          ))
          }
        </div>
      </main>



    </Layout>
  )
}

export default Imagenes