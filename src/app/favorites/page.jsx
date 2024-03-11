"use client";
import React, { useState, useEffect } from 'react';
import { getDocs, collection, getFirestore, arrayUnion, updateDoc, doc, arrayRemove } from 'firebase/firestore';
import firebaseApp from '@/app/firebase';
import Link from 'next/link';
import { UserAuth } from '@/app/context/AuthContext';
import styles from '@/app/styles/stock.module.css';


const FavPage = () => {
    const [products, setProducts] = useState([]);
    const { user } = UserAuth();
    const db = getFirestore(firebaseApp);

    const handleFav = async (product) => {
        if (user) {
            try {
                const { id, votes } = product;
                const userHasVoted = votes && votes.includes(user.uid);

                const updatedProducts = [...products]; // Create a copy of the products array
                const productIndex = updatedProducts.findIndex((p) => p.id === id);

                if (productIndex !== -1) {
                    // Update the local copy of the product
                    updatedProducts[productIndex] = {
                        ...product,
                        votes: userHasVoted
                            ? votes.filter((vote) => vote !== user.uid)
                            : votes ? [...votes, user.uid] : [user.uid], // Add user.uid if votes exist, otherwise create a new array
                    };

                    // Update the state with the modified array
                    setProducts(updatedProducts);

                    // Update the Firestore document
                    const userRef = doc(db, 'genCollection', id);
                    await updateDoc(userRef, {
                        votes: userHasVoted
                            ? arrayRemove(user.uid)
                            : arrayUnion(user.uid),
                    });
                }
                fetchData();
            } catch (e) {
                console.warn(e);
            }
        } else {
            alert("No hay un usuario registrado");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, 'genCollection'));
            const productsData = [];
            querySnapshot.forEach((doc) => {
                productsData.push({ id: doc.id, ...doc.data() });
            });
            setProducts(productsData);
        };

        fetchData();
    }, []);
    const userFavoriteProducts = products.filter((product) => product.votes && product.votes.includes(user?.uid));
    return (
      
            <main className={styles.stockWrapper}>
            {userFavoriteProducts.length === 0 && (
                <div className='w-full text-center text-white'>
                    <span>Aun no has marcado ninguna publicación como Favorita</span>
                </div>
            )}
                {userFavoriteProducts.map((product) => (
                    product.id && (
                        <div key={product.id} className={styles.stockCard}>
                        <div className='relative'>
                            <img 
                                src={product.imageUrl}
                                alt={product.name}
                                className={styles.stockCardImage}
                            />
                            <div className={styles.stockCardButtons}>
                                <i className="fa fa-brands fa-whatsapp fa-lg"></i>
                                <span>WhatsApp</span>
                            </div>
                        </div>
                        <div className={styles.stockCardInfo}>
                            <aside className='flex justify-between overflow-hidden'>
                                <span>
                                    {product.title}
                                </span>
                                <span>{product.category}</span>
                                <span onClick={() => handleFav(product)}>
                                    {product.votes.length}
                                    <i tabIndex='0' className={`fa fa-star ml-1 ${product.votes && product.votes.includes(user?.uid) ? `text-orange-400` : ``}`}></i>
                                </span>
                            </aside>
                            <p className='bg-slate-800 bg-opacity-20 w-[30dvw] h-[15dvh] p-1 break-words'>
                                {product.description}
                            </p>
                            <span>${product.price}</span>
                        </div>
                    </div>
                    )
                ))}
            </main>
 
    );
};

export default FavPage;