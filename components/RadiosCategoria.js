import { format } from 'fecha';
import Link from 'next/link';
import Image from 'next/image'
import styles from '../src/styles/Entrada.module.css'
import stylesImagen from '../src/styles/ImagenCategoria.module.css'
import stylesRadios from '../src/styles/ImagenRadio.module.css'

import {
    Avatar,
    AvatarGroup,
    Badge,
    Flex,
    Button,
    Icon,
    Image as Imagen,
    Text,
    DarkMode,
    useColorModeValue,
  } from "@chakra-ui/react";



const RadiosCategoria = ({ entrada }) => {
    const { iurl, titulo, id, descripcion, url } = entrada


    return (

      /*<div className={stylesRadios.card}>
      
      <Image priority
                src={iurl}
                alt={titulo}
                width={500}
                height={500}
                responsive
            />

      <div class="card-content">
        <h2 className={stylesRadios.h2}>
        {titulo}
        </h2>
        <p className={stylesRadios.p}>
        {descripcion}
        </p>
        
      </div>
    </div>*/
        


   

<Link className={stylesRadios.enlace} href={`../radios/${id}`} >

<div className={stylesRadios.card}>
       
        <div className={stylesRadios.contenedor}>
        <img className={stylesRadios.img} src={iurl} alt={stylesRadios.titulo} />
       
        </div>
       
          <h2 className={stylesRadios.card_title}>
            <a className={stylesRadios.a}>{titulo}</a>
          </h2>
          
       
        </div>
        </Link>

        

/*
        <div className={stylesImagen.container}>


            <Image priority
                src={iurl}
                alt={titulo}
                width={500}
                height={500}
                responsive
            />

           
                
               
                

                <h3 className={stylesImagen.centered}>{titulo}</h3>


                </Link>
            
        </div>*/
    )
}

export default RadiosCategoria