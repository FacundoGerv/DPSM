//La función de Layout se va usar desde el cliente, no desde el servidor.
"use client";
import { useSearchParams, useRouter } from "next/navigation";

import { Inter } from "next/font/google";

//Desde aca importamos el componente Navbar, para mostrarlo en todo el programa.
import Navbar from "./components/Navbar";

//Aca se importa los estilos CSS globales, el root.
import "./globals.css";

// El "AuthContextProvider" es la función que genera el contexto para la autentificación y al estar en el Layout
// hace una similitud a lo que seria un "GlobalContext" ramificandose por todo el programa.
import { AuthContextProvider } from "./context/AuthContext";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });


// Esto es la esctructura del programa, como se va msotrar todas las paginas del programa
//Desde la función "RootLayout" lo que se devuelve es un body, como padre principal internalizando el 
// "Auth" a lo que luego se va desplegar los contenidos visibles como el Navbar y como sibling vas a mostrar
//cualquier children que se asigne al "RootLayout" como puede ser el Home, el Stock, el Perfil ...
export default function RootLayout({ children }) {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');


  return (
    <html lang="en">
      <body className={`${mode === 'normal' ? '' : 'bg-gradient-to-br from-red-400 to-green-400'}`}>
        <AuthContextProvider>
          <Navbar />
          <div className='h-10 bg-transparent'></div>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}

