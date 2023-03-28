import React, { useEffect } from "react";
import Layout from '../../components/Layaout'
import { collection, onSnapshot, query as fireQuery, orderBy, where } from "firebase/firestore";
import { Grid, GridItem, Box, SimpleGrid, Center, useColorModeValue, Stack, Heading, Text } from '@chakra-ui/react'
import Image from 'next/image';
import { db } from "../../firebase"
import Link from 'next/link';
import RadiosCategoria from "../../components/RadiosCategoria";
import stylesBlog from '../styles/Radio.module.css'

import { ref, child, list, listAll, getDownloadURL } from "firebase/storage"
import { storage } from "../../firebase";
import { async } from "@firebase/util";

const Radios = () => {



  const [todos, setTodos] = React.useState([]);

  const refreshData = async () => {

    //const q = fireQuery(collection(db, "radios"), orderBy('titulo',"asc"));

    const q = await fireQuery(collection(db, "radios"), orderBy('titulo',"desc"));
    //const storaRef = ref(storage, 'radios');
   // var childRef = child('gs://app-cristian-ccbf3.appspot.com/radios/AdoraRadioFM.png');

   
   // const result = child(storaRef)
   //var aaa = getDownloadURL(storaRef);

    onSnapshot(q, (querySnapchot) => {
      let ar = [];
       querySnapchot.docs.forEach((doc) => {

      

          //var aa = storaRef.child(doc.url).getDownloadUrl()
         // var aaa = result;

       //  var storageRef = storage.ref().child('gs://app-cristian-ccbf3.appspot.com/radios/AdoraRadioFM.png');
          //var aa = storaRef.child().getDownloadURL();

          
        
        
      // var valor = storaRef.child(doc.url).getDownloadUrl()


        ar.push({ id: doc.id, ...doc.data() });
      });
      setTodos(ar);
    });
  };




/*storageRef.child("users/me/profile.png").getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
    @Override
    public void onSuccess(Uri uri) {
        // Got the download URL for 'users/me/profile.png'
        Uri downloadUri = taskSnapshot.getMetadata().getDownloadUrl();
        generatedFilePath = downloadUri.toString(); /// The string(file link) that you need
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(@NonNull Exception exception) {
        // Handle any errors
    }
});
*/


  useEffect(() => {
    refreshData();
  }, []);



  return (
    <Layout pagina='Imagenes'>



      <main className='contenedor'>
        <h2 className='heading'></h2>
        <div className={stylesBlog.blog}>
          {todos.map(entrada => (



            <RadiosCategoria
              key={entrada.imagen}
              entrada={entrada}
            />
          ))
          }
        </div>
      </main>



    </Layout>
  )
}

export default Radios