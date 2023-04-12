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

                <nav className={styles.navegacion}>
                    <Link href="/">Inicio</Link>
                    <Link href="/noticias">Noticias</Link>                    
                    <Link href="/imagenes">Imagenes</Link>
                    <Link href="/radios">Radios Cristianas</Link>
                    <Link href="/nosotros">Nosotros</Link>

                </nav>
                </div>
            </div>
        </header>
    )
}

export default Header