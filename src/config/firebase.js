import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore';

  const firebaseConfig = {
  apiKey: "AIzaSyDnZ9kkrFq4gnIEj3OskVyao3OsJG_2oYo",
  authDomain: "marketing-rrhh.firebaseapp.com",
  projectId: "marketing-rrhh",
  storageBucket: "marketing-rrhh.appspot.com",
  messagingSenderId: "694821702939",
  appId: "1:694821702939:web:47c1e53a883e3a2bdc97be"
  };  

export const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp);

