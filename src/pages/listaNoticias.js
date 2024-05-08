import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Layout from '../../components/Layaout'
import { db } from "../../firebase";
import React , { useEffect, useState } from "react";
import { collection, onSnapshot, query as fireQuery, where, orderBy, limit, startAfter } from "firebase/firestore";
import { format } from 'fecha';
import Noticias from '../../components/listaNoticias';
import stylesBlog from '../styles/ListaNoticias.module.css'
import stylesTitulares from '../styles/Titulares.module.css'
import Recientes from "./imagen/recientes"
import Link from "next/link"
import { Button, Text } from '@nextui-org/react';

const inter = Inter({ subsets: ['latin'] })

//import { RichTextEditor } from '@mantine/rte';





export default function Home() {

  const [limite, setLimit] = React.useState(12);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [todos, setTodos] = useState([]);
  const [imagenes, setImagenes] = useState([]);
//  setLimit(3);
  const [titular, setTitular] = useState([]);

  const [titulo, setTitulo] = useState({ titulo: '' });
  const [descripcion, setDescripcion] = useState({ descripcion: '' });
  const clickable = true;
  const handleLoadMore = () => {
    //console.log(prevCount)
   // alert("1: " + limite);
    setLimit(prev => prev + 6);
    //alert("2: " + limite);
   // console.log("limite después de la actualización:", limite);
    //refreshData();
  }

  const refreshData = async () => {
   
    
    //const q = fireQuery(collection(db, "noticias").orderBy('fecha',"desc"), where('titulo', '==', "Extremistas islámicos matan a 15 cristianos en el centro-norte de Nigeria"));
    const q = await fireQuery(collection(db, "noticias"), orderBy('fecha',"desc"), limit(limite));
    onSnapshot(q, (querySnapchot) => {
      let ar = [];
      let art = [];
      querySnapchot.docs.forEach((doc, index) => {
        
          ar.push({ id: doc.id, ...doc.data() });
        
          
        
      });
      setTodos(ar);
      setTitular(art);

     


    });
  };


  useEffect(() => {
    refreshData();
    console.log(limite);
  }, [limite]);

 

  const refreshDataMemoized = React.memo(refreshData);
 


  return (


    <Layout pagina='Inicio'>

      
    <div className={stylesBlog.padding}>

        <h2 className='heading'>Últimas noticiassss</h2>
    
   
        <div className={stylesBlog.blog}>
          {todos.map(entrada => (
            <Noticias
              key= {entrada.id} 
              entrada={entrada} 
            />
            
           
          ))
          }
        </div>

       

       
      </div>


      
     
      <center>

       
<Button
      color="gradient" auto
      clickable={clickable.toString()}
      onClick={handleLoadMore}
      //onClick="/noticias"
      css={{
       
        
        width: '350px',
        height: '50px',
        '&:hover': {
          transform: 'translateY(-7px)',
          '&:after': {
            transform: 'scaleX(1.5) scaleY(1.6)',
            opacity: 0
          }
        },
        
      }}
    >
    <div className={stylesBlog.boton} >
     Más antiguas
     </div>
    </Button>


  
    </center>

   
    </Layout>

  )
}
