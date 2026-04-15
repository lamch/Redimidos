import React from 'react';
import stylesBlog from '../src/styles/Noticia.module.css'
import Link from 'next/link';

const NavBar = ({ category, noticias = [] }) => {
  return (
    <div className={stylesBlog.navbar}>
      <div className={stylesBlog.container}>
        <div className={stylesBlog.titulo}>{category}</div>
        <ul className={stylesBlog.listaNav}>
          {noticias.map(entrada => (
            <li className={stylesBlog.item} key={entrada.id}>
              <Link href={`/noticias/${entrada.id}`} className={stylesBlog.a}>
                <div className={stylesBlog.lista}>
                  {entrada.titulo}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
