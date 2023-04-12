import Link from "next/link"
import React from "react"
import styles from "../src/styles/Footer.module.css"
import Image from "next/image"
import {
    FaFacebookF,
    FaTwitter,
    FaAndroid
} from "react-icons/fa"

const style = { color: "white", fontSize: "2.5em" }

const Footer = () => {
    return (
        
        <footer className={styles.footer}>
             
            <div className={`contenedor ${styles.contenido}`}>
           <div>

           
            <p className={styles.copyright}>Siguenos</p>
            
            <div className={`contenedor ${styles.navegacion}`}>
                <nav className={styles.navegacion}>
                    <Link href="https://www.facebook.com/Redimidos2.0"> <FaFacebookF size="50px" className={styles.changeColor} />  </Link>
                    <p className={styles.copyright}>|</p><Link href="https://www.facebook.com/Redimidos2.0"> <FaTwitter size="50px" className={styles.changeColor} /> </Link>
                    <p className={styles.copyright}>|</p><Link href="https://play.google.com/store/apps/details?id=com.bo.appcristiana"> <FaAndroid size="50px" className={styles.changeColor} />  </Link>
                   
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