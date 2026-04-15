import '@/styles/globals.css'
import '@/styles/normalize.css'
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "react-h5-audio-player/lib/styles.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);


  return <Component {...pageProps} />
}
