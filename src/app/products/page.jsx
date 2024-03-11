"use client";
import React, { useState, useEffect } from 'react';
import { getDocs, collection, getFirestore, arrayUnion, updateDoc, doc, arrayRemove } from 'firebase/firestore';
import firebaseApp from '@/app/firebase';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { UserAuth } from '@/app/context/AuthContext';
import styles from '@/app/styles/stock.module.css';


const StockPage = () => {
    const [products, setProducts] = useState([]);
    const { user } = UserAuth();
    const db = getFirestore(firebaseApp);
    const searchParams = useSearchParams();

    const categoryFilter = searchParams.get('category');

    const handleFav = async (product) => {
        if (user) {
            try {
                const { id, votes } = product;
                const userHasVoted = votes && votes.includes(user.uid);
                const updatedProducts = [...products];
                const productIndex = updatedProducts.findIndex((p) => p.id === id);
                if (productIndex !== -1) {
                    updatedProducts[productIndex] = {
                        ...product,
                        votes: userHasVoted
                            ? votes.filter((vote) => vote !== user.uid)
                            : votes ? [...votes, user.uid] : [user.uid],
                    };
                    setProducts(updatedProducts);
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


    const selectCategory = categoryFilter ?
        products.filter(product => product.category && product.category.includes(categoryFilter)) :
        products;


    return (
        <main className={styles.stockWrapper}>
            {selectCategory.map((product) => (
                product.id && (
                    <div key={product.id} className={styles.stockCard}>
                        <div className='relative'>

                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className={styles.stockCardImage}
                            />
                        </div>
                        <div className={styles.stockCardInfo}>

                            <aside className='flex justify-between overflow-hidden'>
                                <span>
                                    {product.title}
                                </span>
                                <span onClick={() => handleFav(product)}>
                                    {product.votes.length}
                                    <i tabIndex='0' className={`fa fa-star ml-1 ${product.votes && product.votes.includes(user?.uid) ? `text-orange-400` : ``}`}></i>
                                </span>
                            </aside>
                            <p className='bg-violet-500 bg-opacity-10 h-[15dvh] p-1 break-words overflow-scroll'>
                                {product.description}

                            </p>
                            <div className=' bg-violet-500 bg-opacity-10 text-lg font-normal flex items-center justify-center group select-none cursor-pointer hover:bg-green-600'  onClick={() => {alert("Aca iria la api de wsp si tuviese una")}}>
                                <span className='group-hover:hidden'>${product.price}</span>
                                <div className='hidden group-hover:flex gap-2 items-center justify-center'>
                                    <i className="fa fa-brands fa-whatsapp fa-lg "></i>
                                    <span>WhatsApp</span>
                                </div>
                            </div>
                        </div>

                    </div>
                )
            ))}
        </main>

    );
};

export default StockPage;