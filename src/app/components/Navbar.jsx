import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import firebaseApp from '@/app/firebase';
import styles from '@/app/styles/navbar.module.css'


const Navbar = () => {

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { user, googleSignIn, logOut } = UserAuth();
  const router = useRouter();

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
      router.push(`/?mode=${mode}`)
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

  return (
    <div className='fixed w-full z-50'>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <div className={styles.menuIcon} onClick={handleNavDropdown}>
        <i className="fa fa-thin fa-bars fa-2xl text-xl text-white"></i>
      </div>
      <div className={styles.navWrapper} id="navlist">
        <ul className={styles.navList}>
          <Link href={`/`} onClick={hideNav}>
            <li className={`${pathname === '/' ? 'bg-violet-800 bg-opacity-60' : ''} ${styles.navItem}`}>
              <span>Home</span>
            </li>
          </Link>
          <Link href={`/stock`} onClick={hideNav}>
            <li className={`${pathname === '/stock' ? 'bg-violet-800 bg-opacity-60' : ''} ${styles.navItem}`}>
              <span>Productos</span>
            </li>
          </Link>
          {user && (
            <Link href={`/favorites`} onClick={hideNav}>
              <li className={`${pathname === '/favorites' ? 'bg-violet-800 bg-opacity-60' : ''} ${styles.navItem}`}>
                <span>Favoritos</span>
              </li>
            </Link>
          )}
          <ul className="absolute bottom-0 w-full">
            {user ? (
              <>
                <li className={`${styles.navItem} bg-red-400 bg-opacity-20`} onClick={handleSignOut}>
                  <span>
                    Cerrar Sesión
                  </span>
                </li>
              </>
            ) : (
              <>
                <li className={`${styles.navItem} bg-violet-300 bg-opacity-20`} onClick={handleSignIn}>
                  <span>Iniciar Sesión</span>
                </li>
              </>
            )}
            <li className={`${styles.navItem} bg-violet-300 bg-opacity-20`} onClick={()=>{
              console.log(user)
              .catch((e) => {console.error(e)})
            }}>
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