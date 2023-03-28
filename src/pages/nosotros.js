import Layout from '../../components/Layaout'
import Image from 'next/image'
import styles from "../styles/Nosotros.module.css" 


const Nosotros = () => {
  return (
    <Layout pagina='Nosotros'>
      <main className='contenedor'>
<div className={styles.background}>

        <h2 className={styles.cabecera} >Nosotros</h2>
        <div className={styles.contenido}>

        <p>La redenci&oacute;n se refiere a la liberaci&oacute;n del pecado y la culpa, y a la restauraci&oacute;n de una relaci&oacute;n correcta con Dios. A trav&eacute;s de la redenci&oacute;n, las personas pueden experimentar una transformaci&oacute;n profunda y encontrar un prop&oacute;sito en la vida.</p>

<p>La redenci&oacute;n es posible gracias a la gracia y la misericordia de Dios. En la Biblia, se habla de la redenci&oacute;n como un acto de amor divino hacia los seres humanos. Todos somos pecadores, pero Dios nos ofrece la oportunidad de ser perdonados y restaurados a trav&eacute;s de la fe en Jesucristo.</p>

<p>La redenci&oacute;n es un proceso continuo que implica arrepentimiento, perd&oacute;n y transformaci&oacute;n. Cuando nos arrepentimos de nuestros errores y pedimos perd&oacute;n a Dios, podemos experimentar la gracia y el perd&oacute;n divino. A medida que avanzamos en nuestro viaje de redenci&oacute;n, Dios nos ayuda a superar nuestros errores y a transformarnos en personas m&aacute;s amorosas y compasivas.</p>

<p>La redenci&oacute;n tambi&eacute;n nos da un prop&oacute;sito en la vida. Cuando experimentamos la redenci&oacute;n, podemos compartir nuestra experiencia con los dem&aacute;s y ser una fuente de amor y esperanza para aquellos que nos rodean. La redenci&oacute;n nos permite tener una comprensi&oacute;n m&aacute;s profunda del amor y la misericordia de Dios, lo que nos permite amar a los dem&aacute;s de una manera m&aacute;s completa y aut&eacute;ntica.</p>

<p>Es importante recordar que la redenci&oacute;n no significa que nunca volveremos a pecar. Todos seguimos siendo imperfectos y es probable que cometamos errores en el futuro. Pero cuando experimentamos la redenci&oacute;n, sabemos que podemos pedir perd&oacute;n y buscar la ayuda de Dios para superar nuestros errores.</p>

          <Image layout="responsive" width={650} height={250} src="/img/redencion.jpg" />

          <div>         

          </div>

          </div>
        </div>
      </main>


    </Layout>
  )
}

export default Nosotros