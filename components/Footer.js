import Link from "next/link"
import React from "react"
import styles from "../src/styles/Footer.module.css"
import { FaYoutube } from "react-icons/fa"

const Footer = () => {
    return (

        <footer className={styles.footer}>
            <div className={`contenedor ${styles.contenido}`}>
           <div>
            <p className={styles.copyright}>Síguenos</p>

            <div className={`contenedor ${styles.navegacion}`}>
                <nav className={styles.navegacion}>
                    <Link target="_blank" href="https://www.youtube.com/channel/UCyAUERYr27Uy7DgehnPsTzA">
                        <FaYoutube size="50px" className={styles.youtube} />
                    </Link>
                </nav>
                </div>
                </div>
                <div>
                <p className={styles.copyright}>Todos los derechos reservados - {(new Date().getFullYear())}</p>

                </div>
              
            </div>
        </footer>
    )
}

export default Footer