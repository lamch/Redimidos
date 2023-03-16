import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Layout from '../../components/Layaout'
import { db } from "../../firebase";
import React, { useEffect } from "react";
import { collection, onSnapshot, query as fireQuery, where, orderBy, limit } from "firebase/firestore";
import { format } from 'fecha';
import Entrada from '../../components/Entrada';
import stylesBlog from '../styles/Blog.module.css'
import stylesTitulares from '../styles/Titulares.module.css'

const inter = Inter({ subsets: ['latin'] })

//import { RichTextEditor } from '@mantine/rte';





export default function Home() {


  const [todos, setTodos] = React.useState([]);
  const [titular, setTitular] = React.useState([]);

  const [titulo, setTitulo] = React.useState({ titulo: '' });
  const [descripcion, setDescripcion] = React.useState({ descripcion: '' });



  const refreshData = async () => {

    //const q = fireQuery(collection(db, "noticias").orderBy('fecha',"desc"), where('titulo', '==', "Extremistas islámicos matan a 15 cristianos en el centro-norte de Nigeria"));
    const q = await fireQuery(collection(db, "noticias"), orderBy('fecha',"desc"), limit(100));
    onSnapshot(q, (querySnapchot) => {
      let ar = [];
      let art = [];
      querySnapchot.docs.forEach((doc, index) => {
        if(index==0 || index==1){
          art.push({ id: doc.id, ...doc.data() });
        }
        else{
          ar.push({ id: doc.id, ...doc.data() });
        }
        
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

      <main className='contenedor'>
        <h2 className='heading'></h2>

        <h2>Noticias del día</h2>
    
        <div className={stylesTitulares.titulares}>
       
          {titular.map((entrada, index) => (
            <Entrada
              key= {entrada.id} 
              entrada={entrada} 
            />
            
           
          ))
          }
        </div>

        <div className={stylesBlog.blog}>
          {todos.map(entrada => (
            <Entrada
              key= {entrada.id} 
              entrada={entrada} 
            />
            
           
          ))
          }
        </div>




        
        
       


      </main>

     



    </Layout>

  )
}
