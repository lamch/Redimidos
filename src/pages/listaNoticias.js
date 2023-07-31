import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Layout from '../../components/Layaout'
import { db } from "../../firebase";
import React, { useEffect } from "react";
import { collection, onSnapshot, query as fireQuery, where, orderBy, limit } from "firebase/firestore";
import { format } from 'fecha';
import Noticias from '../../components/listaNoticias';
import stylesBlog from '../styles/ListaNoticias.module.css'
import stylesTitulares from '../styles/Titulares.module.css'
import Recientes from "./imagen/recientes"

const inter = Inter({ subsets: ['latin'] })

//import { RichTextEditor } from '@mantine/rte';





export default function Home() {


  const [todos, setTodos] = React.useState([]);
  const [imagenes, setImagenes] = React.useState([]);

  const [titular, setTitular] = React.useState([]);

  const [titulo, setTitulo] = React.useState({ titulo: '' });
  const [descripcion, setDescripcion] = React.useState({ descripcion: '' });



  const refreshData = async () => {

    //const q = fireQuery(collection(db, "noticias").orderBy('fecha',"desc"), where('titulo', '==', "Extremistas islámicos matan a 15 cristianos en el centro-norte de Nigeria"));
    const q = await fireQuery(collection(db, "noticias"), orderBy('fecha',"desc"));
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
    console.log(todos)
  }, []);




  return (


    <Layout pagina='Inicio'>

      
    <div className={stylesBlog.padding}>

        <h2 className='heading'>Todas las noticias</h2>
    
    <div className={stylesBlog.sidebar}>
        <div className={stylesBlog.blog}>
          {todos.map(entrada => (
            <Noticias
              key= {entrada.id} 
              entrada={entrada} 
            />
            
           
          ))
          }
        </div>

        <div class="sidebar">
    <p>sidebar</p>
  </div>

        </div>
      </div>


      
     
     


    </Layout>

  )
}
