import { addDoc, collection, doc, getDoc, getFirestore } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import firebaseApp from '@/app/firebase';
import styles from '@/app/styles/navbar.module.css';
import wide from '@/app/styles/navbarwide.module.css';


const Navbar = () => {

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [userMeta, setUserMeta] = useState({});
  const { user, googleSignIn, logOut } = UserAuth();
  const db = getFirestore(firebaseApp);
  const router = useRouter();
  const categories = ['IPhone', 'Macbooks', 'AirPods', 'Fundas', 'Cargadores', 'Apple Watch', 'Samsung', 'Motorola', 'Xiaomi']
  categories.sort();
  const isAdmin = true;
  const handleSignIn = async () => {
    try {
      await googleSignIn();
      router.push(`/`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  var logindwn = document.getElementById('navlist');

  const handleNavDropdown = () => {
    try {
      logindwn = document.getElementById('navlist');
      logindwn.style.display === 'block' ? logindwn.style.display = 'none' : logindwn.style.display = 'block';
    }
    catch (e) {
      logindwn = document.getElementById('navlist');
      console.log(e);
    }
  }
  const hideNav = () => {
    try {
      logindwn = document.getElementById('navlist');
      logindwn.style.display = 'none';
    }
    catch (e) {
      logindwn = document.getElementById('navlist');
      console.error(e.error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try{

        const userRef = doc(db, 'users', user?.uid);
        const querySnapshot = await getDoc(userRef);
        if (querySnapshot.exists()) {
          // Verifica si el documento existe
          setUserMeta(querySnapshot.data()); 
          console.log("correo: ", userMeta.email);
        } else {
          console.warn("El usuario no se encuentra en la base de datos.");
        }
      }catch(e){
        console.warn("User not found in the database.")
      }
    };

    fetchData();
  }, [user]);
  
  const test = () => {
    console.log(userMeta.email);
  }
  return (
    <div className='fixed w-full z-50'>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />


      <div className={wide.navWrapper}>
        <ul className={wide.navbarContainer}>
          <Link href={`/`}>
            <li className={`${pathname === '/' ? 'bg-violet-800 bg-opacity-60' : ''} ${styles.navItem} hover:bg-[var(--primary10)]`}>
              <span>Home</span>
            </li>
          </Link>
          {pathname !== '/products' ? (
            <Link href={`/products`}>
              <li className={`${pathname === '/products' ? 'bg-[var(--primary30)]' : ''} ${styles.navItem} hover:bg-[var(--primary10)]`}>
                <span>Productos</span>
              </li>
            </Link>
          ) : (
            <li className={`${pathname === '/products' ? 'bg-[var(--primary30)]' : ''} ${styles.navItem} hover:bg-[var(--primary10)]`}>
              <span>Categorias</span>
            </li>
          )}
          <Link href={`/favorites`}>
            <li className={`${pathname === '/favorites' ? 'bg-violet-800 bg-opacity-60' : ''} ${styles.navItem} hover:bg-[var(--primary10)]`}>
              <span>Favoritos</span>
            </li>
          </Link>
          {!user ? (
            <li className={`${styles.navItem}  top-0 hover:bg-[var(--primary20)] px-5 cursor-pointer`} onClick={handleSignIn}>
              <span>Iniciar Sesión</span>
            </li>
          ) : (
            <>
              <ul className="absolute right-0 flex items-center gap-2">
                <li>
                  <span>Bienvenido, {user?.displayName}!</span>
                </li>
                {userMeta.isAdmin ? (

                  <li className={`${styles.navItem}  hover:bg-[var(--primary20)] px-5 cursor-pointer`} onClick={test}>
                    <span>Menu</span>
                  </li>
                ) : (
                  <li className={`${styles.navItem}  hover:bg-[var(--primary20)] px-5 cursor-pointer`} onClick={handleSignOut}>
                    <span>Cerrar Sesion</span>
                  </li>
                )}
              </ul>
              <ul className="flex flex-col absolute right-0 top-12 z-50">
                <li className={`${styles.navItem}  hover:bg-[var(--primary20)] px-5 cursor-pointer`} onClick={handleSignIn}>
                  <span>Administrar Stock</span>
                </li>
                <li className={`${styles.navItem}  hover:bg-[var(--primary20)] px-5 cursor-pointer`} onClick={handleSignIn}>
                  <span>Administrar Pagina</span>
                </li>
                <li className={`${styles.navItem}  hover:bg-[var(--primary20)] px-5 cursor-pointer`} onClick={handleSignIn}>
                  <span>Administrar Usuarios</span>
                </li>
                <li className={`${styles.navItem}  hover:bg-[var(--primary20)] px-5 cursor-pointer`} onClick={handleSignOut}>
                  <span>Cerrar Sesion</span>
                </li>
              </ul>

            </>
          )}

        </ul>
        <div>
          {pathname === '/products' && (

            <ul className="w-[100dvw] overflow-hidden bg-black border-b border-t border-violet-800 border-opacity-60 flex relative justify-center gap-3" >
              {categories.map((cat) => (
                <li className=" hover:bg-slate-500  border-violet-800 border-opacity-60 px-3 cursor-pointer whitespace-nowrap">
                  {cat}
                </li>
              ))}
              {categories.length > 15 && (

                <li className=" hover:bg-slate-500 border-l border-violet-800 border-opacity-60 bg-black border-r px-3 cursor-pointer absolute right-0">
                  ver más...
                </li>
              )}
            </ul>
          )}
        </div>
      </div>







      <div className={styles.menuIcon} onClick={handleNavDropdown}>
        <i className="fa fa-thin fa-bars fa-2xl text-xl text-white"></i>
        <span className={styles.menuTitle}>DPSM</span>
      </div>
      <div className={styles.navWrapper} id="navlist">
        <ul className={styles.navList}>
          <Link href={`/`} onClick={hideNav}>
            <li className={`${pathname === '/' ? 'bg-violet-800 bg-opacity-60' : ''} ${styles.navItem}`}>
              <span>
                Home
              </span>
            </li>
          </Link>
          <Link href={`/products`} onClick={hideNav}>
            <li className={`${pathname === '/products' ? 'bg-violet-800 bg-opacity-60' : ''} ${styles.navItem}`}>
              <span>
                Productos
              </span>
            </li>
          </Link>
          {user && (
            <Link href={`/favorites`} onClick={hideNav}>
              <li className={`${pathname === '/favorites' ? 'bg-violet-800 bg-opacity-60' : ''} ${styles.navItem}`}>
                <span>
                  Favoritos
                </span>
              </li>
            </Link>
          )}
          <ul className="absolute bottom-2 w-full">
            <div className={styles.navDivLine}>
              <span>
                Administrar Página
              </span>
              <div className={styles.navInnerLine}></div>
            </div>
            {user ? (
              <>
                <Link href={`/editpage`} onClick={hideNav}>
                  <li className={`${styles.navItem}`}>
                    <span>
                      Añadir Producto
                    </span>
                  </li>
                </Link>
                <Link href={`/editpage`} onClick={hideNav}>
                  <li className={`${styles.navItem}`}>
                    <span>
                      Control Stock
                    </span>
                  </li>
                </Link>
                <Link href={`/editpage`} onClick={hideNav}>
                  <li className={`${styles.navItem}`}>
                    <span>
                      Administrar Usuarios
                    </span>
                  </li>
                </Link>
                <Link href={`/editpage`} onClick={hideNav}>
                  <li className={`${styles.navItem} ${pathname === '/editpage' ? 'bg-violet-800 bg-opacity-60' : ''}`}>
                    <span>
                      Editar Página
                    </span>
                  </li>
                </Link>
                <li className={`${styles.navItem} bg-red-400 bg-opacity-20`} onClick={handleSignOut}>
                  <span>
                    Cerrar Sesión
                  </span>
                </li>
              </>
            ) : (
              <>
                <li className={`${styles.navItem} bg-violet-300 bg-opacity-20`} onClick={handleSignIn}>
                  <span>
                    Iniciar Sesión
                  </span>
                </li>
              </>
            )}
          </ul>
        </ul>
        <div className={styles.clicker} onClick={handleNavDropdown}>
        </div>
      </div>
    </div>


  );
};

export default Navbar;