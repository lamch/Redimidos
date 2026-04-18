import { format } from 'fecha';
import Link from 'next/link';
import Image from 'next/image'
import styles from '../src/styles/Entrada.module.css'
import stylesImagen from '../src/styles/ImagenCategoria.module.css'


const ImagenCategoria = ({ entrada }) => {
    const { url, nombre, id } = entrada
    return (
        <div className={stylesImagen.container}>

<Link href={`/imagen/${nombre}`} >
            <Image priority
                src={url}
                alt={nombre}
                width={500}
                height={500}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />

           
                
               
                

                <h3 className={stylesImagen.centered}>{nombre}</h3>


                </Link>
            
        </div>
    )
}

export default ImagenCategoria