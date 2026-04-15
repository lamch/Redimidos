import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAm0g92FS9R3fwu0QST_eq-gSexi3GeQko",
  authDomain: "app-cristian-ccbf3.appspot.com",
  projectId: "app-cristian-ccbf3",
  storageBucket: "app-cristian-ccbf3.appspot.com",
  messagingSenderId: "989711683222",
  appId: "1:989711683222:web:bc878dca5a5d251177fcb7",
};

const app = initializeApp(firebaseConfig, { useFetchStreams: false, experimentalForceLongPolling: true });

const db = getFirestore(app);
const storage = getStorage(app)
//enableIndexedDbPersistence(db)
export { db, storage };
