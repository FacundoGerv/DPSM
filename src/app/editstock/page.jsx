"use client";
import { React, useState, useEffect } from "react";
import firebaseApp from '@/app/firebase';
import { updateDoc, doc, getFirestore, collection, getDocs, getDoc, deleteDoc } from 'firebase/firestore'
import { UserAuth } from "../context/AuthContext";
import Link from "next/link";

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
    }, [db]);

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

    const handleEdit = async (productId) => {

        // no se como hacer esto 
        console.log("Editar producto con ID:", productId);
    };

    const handleDelete = async (productId) => {
        try {
            await deleteDoc(doc(db, 'genCollection', productId));
            console.log("Producto eliminado correctamente");
            setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));

        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    };
    const [editingProduct, setEditingProduct] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDesc, setEditedDesc] = useState("");
    const [editedPrice, setEditedPrice] = useState("");

    const startEditing = (product) => {
        setEditingProduct(product);
        setEditedTitle(product.title);
        setEditedPrice(product.price.toString()); // Convertimos el precio a cadena para mostrarlo en el campo de entrada
        setEditedDesc(product.description);
    };

    const handleTitleChange = (event) => {
        setEditedTitle(event.target.value);
    };

    const handlePriceChange = (event) => {
        setEditedPrice(event.target.value);
    };

    const handleDescChange = (event) => {
        setEditedDesc(event.target.value);
    };

    const applyChanges = async () => {
        try {
            await updateDoc(doc(db, 'genCollection', editingProduct.id), {
                title: editedTitle,
                price: parseFloat(editedPrice), // Convertimos el precio nuevamente a número
                description: editedDesc,
            });
            console.log("Producto actualizado correctamente");
            alert("Producto actualizado correctamente");
            
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === editingProduct.id ? { ...product, title: editedTitle, price: parseFloat(editedPrice), description: editedDesc } : product
                )
            );
            setEditingProduct(null); // Terminamos el proceso de edición
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    };

    return (
        <main>
            {userMeta.isAdmin && userMeta !== undefined ? (
                <>
                    <div className="w-full flex justify-center relative h-10 select-none">
                        <span className="text-lg">Control de Stock</span>
                        <Link href={'/addproduct'}>
                            <span className="bg-violet-400 hover:bg-opacity-30 p-1 absolute top-0 right-2">Añadir Producto</span>
                        </Link>
                    </div>
                    <div className="w-full bg-slate-600 bg-opacity-30 overflow-hidden">
                        <ul className="grid grid-flow-row w-full">
                            <ul className="flex gap-x-10  w-full border-b px-10 bg-slate-500 bg-opacity-50">
                                <li className="w-[25dvw]">Titulo</li>
                                <li className="w-[15dvw]">Precio</li>
                                {editingProduct ? ( <li className="w-[25dvw]">Descripcion</li> ) : (<li className="w-[25dvw]"></li>)}
                                <li className="w-[15dvw]">Admin</li>
                            </ul>
                            {products.map((product) => (
                                <ul className="flex gap-x-10  w-full border-b px-10 hover:bg-slate-500 group" key={product.id}>
                                    <li className="w-[25dvw] whitespace-nowrap">
                                        {editingProduct === product ? (
                                            <input
                                                required
                                                type="text"
                                                value={editedTitle}
                                                onChange={handleTitleChange}
                                                className="border-2 focus:border-violet-500 bg-transparent focus:outline-none w-[25dvw]"
                                            />
                                        ) : (
                                            product.title
                                        )}
                                    </li>
                                    {editingProduct === product ? (
                                        <input
                                            type="text"
                                            value={editedPrice}
                                            onChange={handlePriceChange}
                                            className="border bg-transparent focus:outline-none w-[15dvw] h-[3dvh] focus:border-violet-500"
                                        />
                                    ) : (
                                        <span className="w-[15dvw] ">
                                            $ {product.price}
                                        </span>
                                    )}

                                    {editingProduct === product ? (
                                        <textarea
                                            required
                                            value={editedDesc}
                                            onChange={handleDescChange}
                                            className="border bg-transparent focus:border-violet-500 focus:outline-none w-[25dvw] h-[20dvh]"
                                        />
                                    ) : (
                                        <div className="w-[25dvw]">
                                        </div>
                                    )}

                                    <li className="w-[20dvw] flex justify-start items-center gap-2 h-[3dvh]">
                                        {editingProduct === product ? (
                                            <>
                                                <button onClick={applyChanges} className="bg-green-400 h-[80%] bg-opacity-50 flex justify-center items-center px-2">Guardar</button>
                                                <button onClick={() => setEditingProduct(null)} className="bg-red-400 h-[80%] bg-opacity-50 flex justify-center items-center px-2">Cancelar</button>
                                            </>
                                        ) : (
                                            <button onClick={() => startEditing(product)} className="bg-indigo-400 bg-opacity-50 h-[80%] flex justify-center items-center px-2">Editar</button>
                                        )}
                                        <button onClick={() => handleDelete(product.id)} className="bg-red-400 h-[80%] bg-opacity-50 flex justify-center items-center px-2">Eliminar</button>
                                    </li>
                                </ul>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (
                <div className="w-full flex justify-center pt-10">
                    <span className="text-center text-xl">
                        No posee autorización para ver esto.
                    </span>
                </div>
            )
            }
        </main>
    )
}
export default EditStock;