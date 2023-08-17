import React, { useEffect, useState, Fragmen,useRef } from "react";
import stylesBlog from '../../styles/Blog.module.css'
import parse from 'html-react-parser'
import { collection, limit, onSnapshot, query as fireQuery, where, doc, docs, getDocs, getDoc, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

import {
    Badge,
    Button,
    Center,
    Flex,
    Image,
    Link,
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



const EntradaBlog = ({id}) => {
 

    const [singleNote, setSingleNote] = React.useState([]);
    console.log("eeee" + id);
  
    const [count, setCount] = React.useState({id}); 
  
    useEffect(() => {
        
      getSingleNote(id)
   
  
  
    
    }, []
    )
    
  
    const getSingleNote = async (id) => {
    
     if(id != null && id != undefined){
      const singleNotea = doc(db, 'noticias', id);
      const data = await getDoc(singleNotea);
      
      setSingleNote({ ...data.data(), id: data.id })
     }
     
         
      }
  
  
    return(
        <Layout pagina='Noticia'>
      <div>
  
  
  
  <Center as='section' bg='gray.100' >
        <Box maxW='1020px' bg='white' p='6'>
          
          
          <Heading my='4' size='lg'>
            <a className={stylesBlog.a}>
            {singleNote.titulo}
            </a>
          </Heading>
          <div className={stylesBlog.margen}>
          {parse(singleNote.descripcion ? singleNote.descripcion.replaceAll("font-size:48px", "font-size:20px") : ""
            )}
            </div>
          
        </Box>
      </Center>
  
      </div>
      </Layout>
    )
  }
  
  export async function getServerSideProps({query: { id }}) {
    //console.log(id);
  
   // const singleNotea = doc(db, 'noticias', id);
     // const data = await getDoc(singleNotea);
     // const aaaa = JSON.stringify(data);
      //console.log(data.id);
  return {
    props:{
      //data: aaaa
      id
    }
  }
  
    }
  
  
  
  export default EntradaBlog