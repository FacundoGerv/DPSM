"use client";
import React, { useState, useEffect } from 'react';
import { getDocs, collection, getFirestore } from 'firebase/firestore';
import firebaseApp from '@/app/firebase';

export default function Home() {
  const [topProducts, setTopProducts] = useState([]);
  const db = getFirestore(firebaseApp);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'genCollection'));
      const productsData = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() });
      });
      // Ordenar los productos por la cantidad de votos de mayor a menor
      productsData.sort((a, b) => b.votes.length - a.votes.length);
      // Seleccionar los primeros 4 productos
      const topFourProducts = productsData.slice(0, 4);
      setTopProducts(topFourProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="flex flex-col justify-start pt-20 items-center">
      <div className='w-[80vw] aspect-[4/1] p-1 border-4 border-gray-900 rounded-md shadow-md mb-10'>
        <img src="gs://dpsm-rgb.appspot.com/images/banner.png" alt='banner' className='w-full h-full object-cover rounded-md' />
      </div>
      <span className='text-xl'>Productos Destacados</span>
      <div className='w-[80vw] flex justify-between gap-5 pt-10 mb-10'>
        {topProducts.map((product) => (
          <div key={product.id} className='w-[20vw] aspect-[1.7/2] bg-red-400 flex flex-col items-center gap-2 py-2'>
            <span className='text-white'>{product.title}</span>
            <img
              key={product.id}
              alt={product.title}
              src={product.imageUrl}
              className='aspect-square object-cover w-[18vw]'></img>
            <div>
              <span> {product.votes.length}</span>
              <i className={`fa fa-star ml-1 text-orange-400`}></i>
            </div>
          </div>
        ))}
      </div>
      <span className='text-xl'>About Us</span>
      <div className='w-full h-[40vh] bg-violet-300 bg-opacity-20 mt-10 -mb-12 relative'>
        <div className="flex gap-10 absolute bottom-5 right-5">
          <a href='https://github.com/BugaToro' alt='GitHub'>
            <div className="flex items-center gap-2 border-2 border-emerald-500 p-2 rounded-md bg-green-400 bg-opacity-60">
              <span className='text-black'>Whatsapp</span>
              <i className="fa fa-brands fa-whatsapp text-black fa-lg "></i>
            </div>
          </a>
          <a href='https://www.facebook.com/luchogoofy.buga' alt='Facebook'>
            <div className="flex items-center gap-3 border-2 border-indigo-500 p-2 rounded-md bg-blue-400 bg-opacity-60">
              <span className='text-black'>Facebook</span>
              <i className="fa fa-brands fa-facebook text-black fa-lg -mb-1 fa-lg"></i>
            </div>
          </a>
          <a href='https://www.instagram.com/_buga_99' alt='Instagram'>
            <div className="flex gap-2 items-center border-2 border-t-violet-500 border-r-violet-500 border-b-amber-400 border-l-amber-400 bg-gradient-to-bl from-violet-400 via-violet-300 to-yellow-300 p-2 rounded-md ">
              <span className='text-black'>Instagram</span>
              <i className="fa fa-brands fa-instagram text-black fa-lg"></i>
            </div>
          </a>
        </div>
      </div>
    </main>
  )
}
