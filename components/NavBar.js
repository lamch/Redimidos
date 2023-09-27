import React, { useState, useEffect } from 'react';
import stylesBlog from '../src/styles/Noticia.module.css'
import { collection, limit, onSnapshot, query as fireQuery, where, doc, docs, getDocs, getDoc, QueryDocumentSnapshot, DocumentData, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Link from 'next/link';

const NavBar = ({ category }) => {
  const [todos, setTodos] = useState([]);

  const refreshData = async (category) => {
    console.log("nota: " + category);
    const q = await fireQuery(
      collection(db, "noticias"),
      where('categoria', '==', category),
      orderBy('fecha', "desc"),
      limit(10)
    );
    onSnapshot(q, (querySnapshot) => {
      let ar = [];
      let art = [];
      querySnapshot.docs.forEach((doc, index) => {
        //if (doc.id !== id) {
          ar.push({ id: doc.id, ...doc.data() });
        //}
      });
      setTodos(ar);
    });
  };

  useEffect(() => {
    refreshData(category);
  }, [category]);

  return (
    <div className={stylesBlog.navbar}>

    <div className={stylesBlog.container}>
    <div className={stylesBlog.titulo}>
      {category}
    </div>


    <ul className={stylesBlog.listaNav}>

      {todos.map(entrada => (



        <li className={stylesBlog.item} key={entrada.id}>

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
  );
};

export default NavBar;