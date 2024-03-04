"use client";
import { React, useState, useEffect } from "react";
import firebaseApp from '@/app/firebase';
import { updateDoc, doc, getFirestore, collection, getDocs, getDoc } from 'firebase/firestore'
import { UserAuth } from "../context/AuthContext";

const EditStock = () => {
    const [userMeta, setUserMeta] = useState({});
    const { user } = UserAuth();
    const [products, setProducts] = useState([]);
    const db = getFirestore(firebaseApp);

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRef = doc(db, 'users', user?.uid);
                const querySnapshot = await getDoc(userRef);
                if (querySnapshot.exists()) {
                    setUserMeta(querySnapshot.data());
                    console.log("Usuario: ", userMeta.displayName);
                } else {
                    console.error("El usuario no se encuentra en la base de datos.");
                }
            } catch (e) {
                console.warn("User not found in the database.", e.message)
            }
        };

        fetchData();
    }, [user]);

    return (
        <main>
            {userMeta.isAdmin && userMeta !== undefined ? (
                <div className="w-full bg-slate-600 bg-opacity-30 overflow-hidden">
                    <ul className="grid grid-flow-row w-full">
                        <ul className="flex gap-x-10  w-full border-b px-10 bg-slate-500 bg-opacity-50">
                            <li className="w-[15dvw]">Titulo</li>
                            <li className="w-[15dvw]">Precio</li>
                            <li className="w-[15dvw]">Favoritos</li>
                            <li className="w-[15dvw]">Id del Producto</li>
                            <li className="w-[15dvw]">Admin</li>
                        </ul>
                        {products.map((product) => (
                            <ul className="flex gap-x-10  w-full border-b px-10 hover:bg-slate-500" key={product.id}>
                                <li className="w-[15dvw]">
                                    {product.title}
                                </li>
                                <li className="w-[15dvw]">
                                    $ {product.price}
                                </li>
                                <li className="w-[15dvw]">
                                    {product.votes.length} ★
                                </li>
                                <li className="w-[15dvw]">
                                    {product.id}
                                </li>
                                <li className="w-[20dvw] flex justify-start items-center gap-2">
                                    <button className="bg-indigo-400 bg-opacity-50 h-[80%] flex justify-center items-center px-2">Editar</button>
                                    {!product.title ? (
                                        <button className="bg-emerald-400 h-[80%] bg-opacity-50 flex justify-center items-center px-2 w-[4dvw]">Ocultar</button>
                                    ) : (
                                        <button className="bg-emerald-400 h-[80%] bg-opacity-50 flex justify-center items-center px-2 w-[4dvw]">Mostrar</button>
                                    )}
                                    <button className="bg-red-400 h-[80%] bg-opacity-50 flex justify-center items-center px-2">Eliminar</button>
                                    {product.title && (
                                        <span className="text-green-500">Oculto</span>
                                    )}
                                </li>
                            </ul>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="w-full flex justify-center pt-10">
                    <span className="text-center text-xl">
                        No posee autorización para ver esto.
                    </span>
                </div>
            )}
        </main>
    )
}
export default EditStock;