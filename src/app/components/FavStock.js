import React, { useState, useEffect } from 'react';
import s from '@/app/styles/category.module.css';
import { updateDoc, doc, getDocs, arrayUnion, getFirestore, onSnapshot, collection } from 'firebase/firestore'
import Image from 'next/image';
import { UserAuth } from '../context/AuthContext';
import firebaseApp from '../firebase';

const FavStock = ({ products, updateProducts }) => {
    const { user } = UserAuth();
    const db = getFirestore(firebaseApp);

    const handleFav = async (product) => {
        const { id, votes } = product;

        // Check if the user has already voted
        const userHasVoted = votes && votes.includes(user.uid);

        // Toggle between fav and unfav actions
        const updatedUserData = {
            ...product,
            votes: userHasVoted ? votes.filter((vote) => vote !== user.uid) : arrayUnion(user.uid),
        };

        const userRef = doc(db, 'genCollection', id);
        await updateDoc(userRef, updatedUserData);

        updateProducts();
    };


    const handleWhatsappClick = (phoneNumber, username, ocupation) => {
        try {
            console.log("Whatsapp Number", phoneNumber)

            const message =
                `*¡Hola ${username}!*\n
      Vengo desde _*Pico Y Pala*_. 
      Quería consultar por tu servicio de ${ocupation}.
      `;

            const encodedMessage = encodeURIComponent(message);
            const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            window.open(whatsappLink, '_blank');

        } catch (err) {
            console.error(err);
        }

    }

    const userFavoriteProducts = products.filter((product) => product.votes && product.votes.includes(user?.uid));

    return (
        <div className={s.categoryWrapper}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
            {userFavoriteProducts.length === 0 && (
                <div className='w-full text-center'>
                    <span>Aun no has marcado ninguna publicación como Favorita</span>
                    <i className="fa fa-face-sad-cry"></i>
                </div>
            )}
            <div className={s.homeGrid}>
                {userFavoriteProducts.map((product) => (
                    <div key={product.id} className={s.homeCard}>
                        <img
                            src={product.image}
                            alt={product.title}
                            className={s.cardImage}
                        />
                        <span className={s.cardPriceText}>{product.work}</span>
                        <div className={s.hoverContent}>
                            <span className={s.hoverTitle}>{product.name}</span>
                            <span>⋆ Edad: {product.age}</span>
                            <span>⋆ Sexo: {product.sex}</span>
                            {/* <span>⋆ Ocupaciíon: {product.work}</span> */}
                            <span>⋆ Horarios: {product.time}</span>
                            <span>⋆ Telefono: {product.num}</span>
                            <span>⋆ Locación: {product.country}, {product.province}</span>
                            {product.num && product.num.length > 7 && product.num.length < 15 && (
                                <div className={s.whatsappButton} onClick={() => handleWhatsappClick(product.num, product.name, product.work)}>
                                    <i className="fa fa-brands fa-whatsapp fa-lg"></i>
                                    <span>WhatsApp</span>
                                </div>
                            )}
                            <div className='flex gap-2 items-center absolute bottom-5 right-5 active:animate-ping' onClick={() => handleFav(product)}>
                                <i className={`fa fa-star ${product.votes && product.votes.includes(user?.uid) ? 'text-orange-400' : ''}`}
                                ></i>
                                {product.votes ? (
                                    <span>{product.votes.length}</span>
                                ) : (
                                    <span>0</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavStock;
