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
      productsData.sort((a, b) => b.votes.length - a.votes.length);
      const topFourProducts = productsData.slice(0, 4);
      setTopProducts(topFourProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleWhatsApp = (product) => {
    const message = `¡Hola! Estoy interesado en el producto: ${product.title}, con precio $:${product.price}. ¿Podrías darme más información?`;
    const phoneNumber = '2604677605';
    const encodedMessage = encodeURIComponent(message);
    const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

    window.open(whatsappWebUrl, '_blank');
  };

  return (
    <main className="flex flex-col justify-start pt-20 items-center relative">
      <div className='w-[90dvw] aspect-[4/1] p-1 ring-4 ring-violet-300 ring-opacity-20 rounded-md shadow-md mb-32'>
        <img src="https://firebasestorage.googleapis.com/v0/b/dpsm-rgb.appspot.com/o/image%2Fbanner.png?alt=media&token=9ba6161e-5ceb-4d29-a393-5401a34bbef7" alt='banner' className='w-full h-full object-cover rounded-md' />
      </div>
      <div className='w-[85dvw] rounded-sm ring-4 ring-violet-300 ring-opacity-20 p-1 '>
        <img src="https://firebasestorage.googleapis.com/v0/b/dpsm-rgb.appspot.com/o/images%2Fminibanner%20(1).png?alt=media&token=1594deeb-4d6f-4ea7-b629-5806d0440360" alt='minni-banner' className='rounded-md' />
      </div>
      <div className='w-[80vw] flex justify-between gap-5 pt-36 mb-10'>
        {topProducts.map((product) => (
          <div key={product.id} className='rounded-md w-[20vw] aspect-[1.7/2] bg-gray-900 bg-opacity-40 flex flex-col items-center gap-2 shadow-md shadow-slate-700 pt-2 justify-between ring-4 ring-violet-300 ring-opacity-20 group select-none cursor-pointer'
            onClick={() => handleWhatsApp(product)}>
            <span className='text-white'>{product.title}</span>
            <img
              key={product.id}
              alt={product.title}
              src={product.imageUrl}
              className='aspect-square object-cover w-[18vw] shadow-md '>
            </img>
            <div className='w-full bg-slate-700 bg-opacity-40 flex justify-end items-center pr-2 relative border-t border-violet-400 border-opacity-30'>
              <div className='hidden group-hover:block absolute left-2'>Click para consultar</div>
              <span className='absolute left-2 group-hover:hidden'>${product.price}</span>
              <span> {product.votes.length}</span>
              <i className={`fa fa-star ml-1 text-orange-400`}></i>
            </div>
          </div>
        ))}
      </div>
      <div className='bg-[url("https://firebasestorage.googleapis.com/v0/b/dpsm-rgb.appspot.com/o/images%2Fubicacion.png?alt=media&token=829f4a50-f49d-4a21-863d-6b9259baf377")]
      aspect-[20] w-[90dvw] bg-cover rounded-md ring-4 ring-violet-300 ring-opacity-30 mt-32'>
      </div>
      <div className="w-[85dvw] h-[30dvh] mt-16 ring-4 ring-violet-300 ring-opacity-30 rounded-md">
        <iframe className='rounded-md border-none'
          title="Mapa de Google"
          width="100%"
          height="100%"
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12526.853988628532!2d-68.33759879804988!3d-34.62085517097045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967ba0f48bf46d4d%3A0x3ea2b5c5e3906156!2sMontecaseros%20214%2C%20M5602ADP%20San%20Rafael%2C%20Mendoza!5e0!3m2!1sen!2sar!4v1647312280709!5m2!1sen!2sar`}
          allowFullScreen
        ></iframe>
      </div>
      <div className='bg-[url("https://firebasestorage.googleapis.com/v0/b/dpsm-rgb.appspot.com/o/images%2Fredes%20(1).png?alt=media&token=d78843a3-6a05-400a-badb-755196d5528d")] bg-cover aspect-[20] w-[90dvw]  p-2 flex rounded-md ring ring-violet-400 ring-opacity-40 justify-end items-center mt-10 gap-10'>
        <a href='https://wa.me/2604677605?text=Hola%20estoy%20interesado%20en%20contactarte%20por%20tus%20productos%21' alt='WhatsApp'>
          <div className="flex items-center gap-2 border-2 border-emerald-500 p-2 rounded-md bg-green-400 ">
            <span className='text-black'>WhatsApp</span>
            <i className="fa fa-brands fa-whatsapp text-black fa-lg "></i>
          </div>
        </a>
        <a href='https://www.facebook.com/luchogoofy.buga' alt='Facebook'>
          <div className="flex items-center gap-3 border-2 border-indigo-500 p-2 rounded-md bg-blue-400">
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
    </main>
  )
}
