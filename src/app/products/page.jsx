"use client";
import { UserAuth } from '@/app/context/AuthContext';
import firebaseApp from '@/app/firebase';
import styles from '@/app/styles/stock.module.css';
import { arrayRemove, arrayUnion, collection, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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

    const handleWhatsApp = (product) => {
        const message = `¡Hola! Estoy interesado en el producto: ${product.title}, con precio $:${product.price}. ¿Podrías darme más información?`;
        const phoneNumber = '2604677605'; 
        const encodedMessage = encodeURIComponent(message);
        const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    
        window.open(whatsappWebUrl, '_blank');
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
                                <span className='pl-1 pt-1'>
                                    {product.title}
                                </span>
                                <span className=' cursor-pointer select-none' onClick={() => handleFav(product)}>
                                    {product.votes.length}
                                    <i tabIndex='0' className={`fa fa-star ml-1  ${product.votes && product.votes.includes(user?.uid) ? `text-orange-400` : ``}`}></i>
                                </span>
                            </aside>
                            <textarea className='bg-violet-500 bg-opacity-10 h-[15dvh] p-1 break-words overflow-scroll'>
                                {product.description}
                            </textarea>
                            <div className=' bg-violet-500 bg-opacity-10 text-lg font-normal flex items-center justify-center group select-none cursor-pointer hover:bg-green-600' onClick={() => handleWhatsApp(product)}>
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
