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
    <main className="flex flex-col justify-start pt-36 items-center">
      <div className='w-[90dvw] aspect-[4/1] p-1 border-4 border-gray-900 rounded-md shadow-md mb-40'>
        <img src="https://firebasestorage.googleapis.com/v0/b/dpsm-rgb.appspot.com/o/image%2Fbanner.png?alt=media&token=9ba6161e-5ceb-4d29-a393-5401a34bbef7" alt='banner' className='w-full h-full object-cover rounded-md' />
      </div>
      <span className='text-xl'>Productos Destacados</span>
      <div className='w-[80vw] flex justify-between gap-5 pt-10 mb-10'>
        {topProducts.map((product) => (
          <div key={product.id} className='w-[20vw] aspect-[1.7/2] bg-gray-900 bg-opacity-40 flex flex-col items-center gap-2 shadow-md shadow-slate-700 pt-2 justify-between ring ring-violet-400 ring-opacity-40 group select-none cursor-pointer'
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
      <span className='text-xl'>About Us</span>
      <div className='w-full h-[40dvh] bg-violet-300 bg-opacity-20 mt-10 -mb-12 relative flex justify-center items-center'>

        <div className='w-[90dvw] h-[35dvh] p-2 flex rounded-md ring ring-violet-400 ring-opacity-40 relative'>
          <div className='h-[15dvw] w-[15dvw] rounded-full overflow-hidden self-center align-middle'>
            <img src='https://scontent.fafa1-1.fna.fbcdn.net/v/t39.30808-6/302147091_5299548356766800_785634177997923449_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=-VnW_PLbpNAAX9riiBb&_nc_ht=scontent.fafa1-1.fna&oh=00_AfAUqzK8qzDgLhUnkivJuKJB7h92_F-qNpx1cXlmLMnARQ&oe=65F5E092'></img>
          </div>
          <div className='flex flex-col gap-2 px-3 '>
            <span className='text-2xl px-2 py-10 border-b flex w-full h-[5dvh]'>Luciano Bugarin</span>
            <p className='pl-3 h-[70%] w-[60dvw]'>
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
              Aca va la descripcion.
            </p>

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
        </div>
      </div>
    </main>
  )
}
