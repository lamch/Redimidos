import Link from "next/link"
import React from "react"
import styles from "../src/styles/Header.module.css"
import Image from "next/image"



const Header = () => {
    return (
        <header className={styles.header}>
            <div className="contenedor">
               
            <div className={styles.barra}>

            <Link href="/">
                
                <Image src="/img/logo.png" width={120} height={120} alt="Logo" />
                    </Link>
                
            <nav className="navbar navbar-expand-lg navbar-dark shadow-5-strong">
  <div className="container-fluid">

    <button className="navbar-toggler btn btn-outline-warning" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <Image src="/img/toogle.png" width={40} height={40} alt="toogle" />

    </button>
    <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className={styles.navegacion}>
        <li>
          <Link className={styles.customtoggler}  href="/">Inicio</Link>
        </li>
        <li>
        <Link className={styles.customtoggler} href="/listaNoticias" >Noticias</Link>
        </li>
        <li>
        <Link className={styles.customtoggler} href="/imagenes" >Imágenes</Link>
        </li>
        <li>
        <Link className={styles.customtoggler} href="/radios" >Radios Cristianas</Link>
        </li>
        <li>
        <Link className={styles.customtoggler} href="/nosotros">Nosotros</Link>
        </li>

      </ul>
    </div>
  </div>
</nav>
</div>

                </div>
           
        </header>
    )
}

export default Header