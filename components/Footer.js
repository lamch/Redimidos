import Link from "next/link"
import React from "react"
import styles from "../src/styles/Footer.module.css"
import Image from "next/image"


const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={`contenedor ${styles.contenido}`}>
                <nav className={styles.navegacion}>
                    <Link href="/">Inicio</Link>
                    <Link href="/nosotros">Nosotros</Link>
                    <Link href="/imagenes">Imagenes</Link>
                    <Link href="/">Contacto</Link>

                </nav>
                <p className={styles.copyright}>Todos los derechos reservados - {(new Date().getFullYear())}</p>
                
            </div>
        </footer>
    )
}

export default Footer