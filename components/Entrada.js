import { format } from 'fecha';
import Link from 'next/link';
import Image from 'next/image'
import styles from '../src/styles/Entrada.module.css'
import { Card, Col, Row, Button, Text } from "@nextui-org/react";

const Entrada = ({ entrada }) => {
    const { titulo, fecha, id, imagen } = entrada
    return (
        
        
        <Link href={`/blog/${id}`} className={styles.enlace} >
        <Card hoverable clickable width="100%" css={{ w: "100%", h: "600px", '&:hover': {
            background: '$pink100',
            color: '$pink800',
          }, }}>
    <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
     
    </Card.Header>
    <Card.Body css={{ p: 0 }}>
      <Card.Image
        src={imagen} 
        objectFit="cover"
        width="100%"
        height="100%"
        alt="Relaxing app background"
      />
    </Card.Body>
    <Card.Footer
      isBlurred
      css={{
        position: "absolute",
        bgBlur: "#0f111466",
        borderTop: "$borderWeights$light solid $gray800",
        bottom: 0,
        zIndex: 1,
      }}
    >
      <Row>

      <Col>
      <Text size={26} h2 color="white"> 
        {titulo} 
        </Text>
        <Text size={20} weight="bold" transform="uppercase" color="orange"
         
        
        >
        {format(fecha.toDate(), 'DD-MM-YYYY HH:MM')}
       
        </Text>
       
       </Col>
      
      </Row>
      
    </Card.Footer>
  </Card>
  </Link>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        /*
        <article>
            <Image priority className={styles.imagen}
                src={imagen}
                alt={titulo}
                width={500}
                height={300}
                responsive


            />

            <div>

                <h3 className={styles.resumen}>{titulo}</h3>
                <p className={styles.fecha}>{format(fecha.toDate(), 'DD-MM-YYYY')} </p>
                <Link href={`/blog/${id}`} className={styles.enlace} >

                    Leer más


                </Link>
            </div>

        </article>*/
    )
}

export default Entrada