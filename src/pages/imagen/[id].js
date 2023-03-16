import React, { useEffect, useState, Fragmen, useRef } from "react";
import parse from 'html-react-parser'
import { collection, limit, onSnapshot, query as fireQuery, where, doc, docs, getDocs, getDoc, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import Image from 'next/image'
import { Gallery } from "react-grid-gallery";
import { Grid } from "react-visual-grid";

import { storage } from "../../../firebase";
import Layout from "../../../components/Layaout";
import { ref, list, listAll, getDownloadURL } from "firebase/storage"

import { Carousel } from 'react-responsive-carousel';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";


const EntradaImagen = ({ id }) => {

  const [open, setOpen] = React.useState(false);


  const images = [
    {
       src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
       width: 500,
       height: 500,
       //isSelected: true,
       caption: "After Rain (Jeshu John - designerspics.com)",
    },
    {
       src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
       width: 500,
       height: 500,
       tags: [
          { value: "Ocean", title: "Ocean" },
          { value: "People", title: "People" },
       ],
       alt: "Boats (Jeshu John - designerspics.com)",
    },
  
    
 ];


  const [files, setFiles] = React.useState([])
  const imagesListRef = ref(storage, id)
  var arr = [];

  


  useEffect(() => {
    const fetchImages = async () => {
      const storaRef = await ref(storage, id)
      const result = await listAll(storaRef)
      let urlPromises = result.items.map((imageRef) =>     
        getDownloadURL(imageRef)
      );

      return Promise.all(urlPromises);
    };

    const loadImages = async () => {


     

      await setFiles([]);
      const urls = await fetchImages();
      console.log("URL");
      console.log(urls);
      //setFiles(urls);
      let temparray = []

      urls.forEach((items, index) => {
        
       // console.log(index);
       temparray.push({
        "src" : items, "index" : index
       })
          //setFiles((prev) =>[...prev, {"src" : items, "index" : index }]);
        
         
        });
        setFiles(temparray);

        

    };

    
    loadImages();
  


  }, []);

  /*useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item, index) => {
        
        getDownloadURL(item).then((url) => {
          setFiles((prev) => [...prev, {"src" : url, "index" : index }]);
        });
      });
    });
  }, []);*/


  //console.log(files);
  //console.log("dddd");

  const [index, setIndex] = useState(-1);

  const handleClick = (index, item) =>{
    setIndex(index);
    setOpen(true);
  } 
 
  return (


    <Layout pagina='Imagenes'>
     <main className='contenedor'>
      
      
 <Gallery images={files} rowHeight={500}
 onClick={handleClick }
 enableImageSelection={false}
 
 />
      
     

    
     
      
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={files}
        index={index}
          
                      
      />
      

      {files.map((url) => {
      // return <img src={url}  alt="" />
                       
                  //return <img src={url} />;
                    })}
                
          

          



      </main>
    </Layout>
  )
}


class GalleryModal extends React.Component {
  constructor() {
    super();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyDown);
  }  
  componentWillUnMount() {
    document.body.removeEventListener('keydown', this.handleKeyDown);
  }
  handleKeyDown(e) {
    if (e.keyCode === 27)
      this.props.closeModal();
    if (e.keyCode === 37 && this.props.hasPrev)
      this.props.findPrev();
    if (e.keyCode === 39 && this.props.hasNext)
      this.props.findNext();
  }
  render () {
    const { closeModal, hasNext, hasPrev, findNext, findPrev, src } = this.props;
    if (!src) {
      console.log('whut')
      return null;
    }
    return (
      <div>
        <div className="modal-overlay" onClick={closeModal}></div>
        <div isOpen={!!src} className="modal">
          <div className='modal-body'>
            <a href="#" className='modal-close' onClick={closeModal} onKeyDown={this.handleKeyDown}>&times;</a>
            {hasPrev && <a href="#" className='modal-prev' onClick={findPrev} onKeyDown={this.handleKeyDown}>&lsaquo;</a>}
            {hasNext && <a href="#" className='modal-next' onClick={findNext} onKeyDown={this.handleKeyDown}>&rsaquo;</a>}
            <img src={src} />
          </div>
        </div>
      </div>
    )
  }
}


export async function getServerSideProps({ query: { id } }) {

  return {
    props: {
      //data: aaaa
      id
    }
  }

}



export default EntradaImagen