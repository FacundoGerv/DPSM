import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

//Credenciales de la base de datos.
const firebaseConfig = {
  apiKey: "AIzaSyBupyH7QVXDEBy5SJheJaNJqw-WlpjTzM4",
  authDomain: "dpsm-rgb.firebaseapp.com",
  projectId: "dpsm-rgb",
  storageBucket: "dpsm-rgb.appspot.com",
  messagingSenderId: "359027577979",
  appId: "1:359027577979:web:61c7502aeead1e20e7bede"
};

//Inicialización de la bd dentro de una constante llamada "firebaseApp" mediante la función "initializeApp" de firebase.
const firebaseApp = initializeApp(firebaseConfig);

//Es la llamada al autentificador de usuarios de Firebase.
const auth = getAuth(firebaseApp);

//Aca instanciamos las exportaciones para llamarlos desde otros directorios.
export const storage = getStorage();
export { auth };
export default firebaseApp;