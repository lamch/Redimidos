import Layout from '../../components/Layaout'
import Image from 'next/image'
import styles from "../styles/Nosotros.module.css" 


const Nosotros = () => {
  return (
    <Layout pagina='Nosotros'>
      <main className='contenedor'>
<div className={styles.background}>

        
        <div className={styles.contenido}>
          <h2 className={styles.cabecera}>Nosotros</h2>
          <p>La redención es el acto de Dios por el cual nos libera de la esclavitud del pecado y nos otorga una nueva vida en Cristo. La Biblia nos enseña que la redención es un regalo de Dios que no podemos merecer ni comprar, sino que recibimos por fe en Jesús, el único que puede pagar el precio de nuestro rescate.</p>
          <p>La palabra redención significa &quot;comprar de nuevo&quot; o &quot;recuperar&quot;. En el Antiguo Testamento, se usaba para referirse a la liberación de los israelitas de la opresión de Egipto (Éxodo 6:6). En el Nuevo Testamento, se usa para describir la obra de Cristo en la cruz, por la cual nos compró con su sangre y nos rescató (Efesios 1:7; 1 Pedro 1:19).</p>
          <p>La redención implica varios aspectos: el perdón de los pecados, la justificación, la santificación y la glorificación — una obra maravillosa que abarca todo nuestro ser y toda nuestra historia.</p>
        </div>
        </div>
      </main>


    </Layout>
  )
}

export default Nosotros