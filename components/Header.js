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
                
                <Image src="/img/logo.png" width={250} height={250} alt="Logo" />
                    </Link>
                
            <nav class="navbar navbar-expand-lg navbar-dark shadow-5-strong">
  <div class="container-fluid">
   
    <button class="navbar-toggler btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <Image src="/img/toogle.png" width={40} height={40} alt="toogle" />

    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className={styles.navegacion}>
        <li class="h1">        
          <Link className={styles.customtoggler}  href="/">Inicio</Link>
        </li>
        <li class="h1">
        <Link className={styles.customtoggler} href="/listaNoticias" >Noticias</Link>
        </li>
        <li class="h1">
        <Link className={styles.customtoggler} href="/imagenes" >Imágenes</Link>
        </li>
        <li class="h1">
        <Link className={styles.customtoggler} href="/radios" >Radios Cristianas</Link>
        </li>
        <li class="h1">
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