"use client";
import React, { useState, useEffect } from 'react';
import { getDocs, collection, getFirestore } from 'firebase/firestore';
import firebaseApp from '@/app/firebase';
import Link from 'next/link';
import StockComponent from '../components/Stock';

const db = getFirestore(firebaseApp);

const StockPage = () => {
    const [products, setProducts] = useState([]);

    const updateProducts = async () => {
        try {
            // Fetch the updated data again
            const querySnapshot = await getDocs(collection(db, 'genCollection'));
            const updatedProducts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Set the updated data to the state
            setProducts(updatedProducts);

            console.log('Updated Products:', updatedProducts);
        } catch (error) {
            console.error('Error updating products:', error);
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

    return (
        <>
            <StockComponent products={products} updateProducts={updateProducts} />
        </>
    );
};

export default StockPage;