import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import firebaseApp from "../firebase";
import styles from '@/app/styles/navbar.module.css'

//Creación de la funcion default.
const Navbar = () => {
  const logindwn = document.getElementById('navlist');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [mode, setMode] = useState(searchParams.get('mode') || 'normal');
  //Como primera medida llamamos los parametros "user", "googleSignIn" y "logOut" desde nuestro "AuthContext".
  const { user, googleSignIn, logOut } = UserAuth();

  // "cData": Instanciamos una constante con el uso de "useState".
  // "setCData": Esta función de useState cambia el contenido de "cData".
  const [cData, setCData] = useState([]);

  // "router": es la constante donde inicializas "useRouter", que este es una función de next.js que nos permite
  // navegar en el directorio de app.
  const router = useRouter();

  // "db": Se crea una constante con una referencia de la bd.
  const db = getFirestore(firebaseApp);

  //Esto es una función almacenada, lo que significa que yo la puedo llamar dentro de la función padre.
  //Es una función asincrona que simplemente llama a lo que seria "googleSignIn" con un await al principio
  // dado el origen de la misma que tambien es asincronica, lo cual permite que esta se complete antes de continuar. 
  const handleSignIn = async () => {
    try {
      await googleSignIn();
      router.push(`/?mode=${mode}`); //Usamos la instancia de router que hicimos anteriormente llamando a la función replace, para redirigir.
    } catch (error) {
      console.log(error);
    }
  };
  const handleMode = () => {
    const newMode = mode === 'normal' ? 'navideño' : 'normal';
    setMode(newMode);


    // Update the URL with the new mode (optional)
    router.push(`?mode=${newMode}`, undefined, { shallow: true });
  };

  //Aqui llamamos a todo los datos almacenados en la colección de la bd, llamada genCollection.
  const fetchCollection = async () => {
    const Collection = collection(db, 'genCollection');
    const Snapshot = await getDocs(Collection);
    const Data = Snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCData(Data);
  };

  //Función que verifica si ya hay una cuenta existente.
  const handleFirstLogin = async () => {
    if (user) {
      const foundItem = cData.find((item) => item.uid === user.uid);
      if (foundItem) {
        console.log('User UID found:', foundItem.uid);
      } else {
        console.log('User UID not found in database');
        handleCreateAccount();
      }
    }
  };

  //Función para crear nuevos usuarios, en el caso que no este registrado en la bd.
  const handleCreateAccount = async () => {

    try {

      //Creamos una referencia donde instanciamos una función llamada "addDoc", que sube los datos 
      // name y uid a la bd. Estos datos estan llamados desde el autentificador.
      const docRef = await addDoc(collection(db, 'genCollection'), {
        name: user.displayName,
        uid: user.uid,
        votes: [],
      });
      console.log('Document written with ID: ', docRef.id);
      router.push(`/profile?mode=${mode}`);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  //Función para borrar el inicio de sesion.
  //Llamando a la función "logOut".
  const handleSignOut = async () => {
    try {
      await logOut();
      router.push(`/?mode=${mode}`)
    } catch (error) {
      console.log(error);
    }
  };

  // Update the mode state when the query parameter changes
  useEffect(() => {
    setMode(searchParams.get('mode') || 'normal');
  }, [searchParams]);
  //Llama a "fetchCollection" cada vez que cambie el estado de "user" y cada vez que renderiza la pag por primera vez.
  useEffect(() => {
    fetchCollection();
  }, [user]);

  //Y este "useEffect" llama a "handleFirstLogin" para vereficar el usuario en la bd cada vez que cambia el estado de "cData".
  useEffect(() => {
    handleFirstLogin();
  }, [cData])

  const handleNavDropdown = () => {
    logindwn.style.display === 'block' ? logindwn.style.display = 'none' : logindwn.style.display = 'block';
  }
  const hideNav = () => {
    logindwn.style.display = 'none';
  }
  const test = () => {
    console.log(pathname);
  }

  //Dentro de "return" se va mostrar la parte visual.
  //Y en ciertos lugares tiene condicionales como {condicion && ()} que lo que permite esto es que lo que esta () se muestre solo si se cumple la condición.
  return (
    <div className='fixed w-full z-50'>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <div className={styles.menuIcon} onClick={handleNavDropdown}>
        <i className="fa fa-thin fa-bars fa-2xl text-xl text-white"></i>
      </div>
      <div className={styles.navWrapper} id="navlist">
        <ul className={styles.navList}>
          <Link href={`/?mode=${mode}`} onClick={hideNav}>
            <li className={`${pathname === '/' ? 'bg-violet-800 bg-opacity-60' : ''} ${styles.navItem}`}>
              <span>Home</span>
            </li>
          </Link>
          <Link href={`/stock?mode=${mode}`} onClick={hideNav}>
          <li className={`${pathname === '/stock' ? 'bg-violet-800 bg-opacity-60' : ''} ${styles.navItem}`}>
              <span>Productos</span>
            </li>
          </Link>
          {user && (
            <Link href={`/favorites?mode=${mode}`} onClick={hideNav}>
              <li className={`${pathname === '/favorites' ? 'bg-violet-800 bg-opacity-60' : ''} ${styles.navItem}`}>
                <span>Favoritos</span>
              </li>
            </Link>
          )}
          <ul className="absolute bottom-0 w-full">
            <li className={styles.navItem} onClick={test}>
              <span>Test</span>
            </li>
            <li className={styles.navItem} onClick={test}>
              <span>Test</span>
            </li>
            <li className={`${styles.navItem} mb-0`} onClick={test}>
              <span>Test</span>
            </li>
          </ul>
        </ul>
        <div className={styles.clicker} onClick={handleNavDropdown}>
        </div>
      </div>
    </div>


  );
};

export default Navbar;