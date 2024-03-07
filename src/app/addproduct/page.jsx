"use client";
import { React, useState, useEffect } from "react";
import firebaseApp, { storage } from '@/app/firebase';
import { updateDoc, doc, getFirestore, collection, getDocs, getDoc, addDoc } from 'firebase/firestore';
import { UserAuth } from "../context/AuthContext";
import { ref, storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const AddProduct = () => {
    const { user } = UserAuth();
    const [productName, setProductName] = useState('');
    const [productCat, setProductCat] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [progressUpload, setProgressUpload] = useState(0);
    const [imagePreview, setImagePreview] = useState('');
    const categories = ['iPhone', 'Macbooks', 'AirPods', 'Fundas', 'Apple Watch', 'Samsung', 'Motorola', 'Xiaomi']
    categories.sort();
    const db = getFirestore(firebaseApp);
    const handleAddProduct = async () => {
        try {
            if (!productName || !productPrice || !productDescription) {
                alert('Por favor completa todos los campos');
                return;
            }

            if (imageFile) {
                const name = imageFile.name;
                const storageRef = ref(storage, `images/${name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgressUpload(progress);
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        console.error(error.message);
                    },
                    async () => {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("Image Url:", url);
                        addProductWithImage(url);
                    }
                );
            } else {
                addProductWithImage(null);
            }
        } catch (error) {
            console.error('Error uploading file or adding product:', error.message);
            alert('Ocurrió un error al agregar el producto. Por favor intenta de nuevo.');
        }
    };

    const addProductWithImage = async (imageUrl) => {
        try {
            const docRef = collection(db, 'genCollection');
            await addDoc(docRef, {
                title: productName,
                price: productPrice,
                description: productDescription,
                votes: [],
                category: productCat,
                imageUrl: imageUrl,
            });

            setProductName('');
            setProductPrice('');
            setProductDescription('');
            setImageFile(null);
            setProgressUpload(0);

            alert('Producto agregado correctamente');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Ocurrió un error al agregar el producto. Por favor intenta de nuevo.');
        }
    };

    const handleSelectedFile = (files) => {
        try {
            if (files[0].size < 10000000) {
                setImageFile(files[0]);
                setImagePreview(URL.createObjectURL(files[0]));
                console.log(files[0]);
            } else {
                alert('Archivo demasiado Grande');
            }
        } catch (e) {
            console.error('No se detecto el archivo');
        }
    };
    const handleImageClick = function () {
        document.getElementById('fileInput').click()
    }
    const handleImageDelete = () => {
        URL.revokeObjectURL(imagePreview);
        setImageFile();
        setImagePreview();
        document.getElementById('fileInput').value = '';
    }


    return (
        <main className="w-full bg-slate-600 bg-opacity-30 flex justify-center pt-3 items-center flex-col">
            <span className="flex text- font-medium text-slate-300">
                Agregar producto
            </span>
            <label className="flex flex-col p-2 gap-2 bg-red-300 w-[20dvw]">
                <input className="border-slate-200 placeholder-slate-400 text-slate-900 "
                    type="text"
                    placeholder="Nombre del producto"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)} />
                <input className="border-slate-200 placeholder-slate-400 text-slate-900"
                    type="text"
                    placeholder="Precio"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)} />
                <div  className="grid grid-flow-row grid-cols-3 items-center justify-between">
                    {categories.map((cat) => (
                     <label className="flex gap-2 items-center whitespace-nowrap">
                        <input className="border-slate-200 placeholder-slate-400 text-slate-900"
                            type="checkbox"
                            placeholder="Categoria"
                            value={productCat}
                            onChange={(e) => setProductCat(`${cat}`)} />
                        <span>
                            {cat}
                        </span>
                    </label>
                    
                    
                    
                    
                    ))}
                   
                    <label className="flex gap-2 items-center ">
                        <input className="border-slate-200 placeholder-slate-400 text-slate-900"
                            type="checkbox"
                            placeholder="Categoria"
                            value={productCat}
                            onChange={(e) => setProductCat("AirPods")} />
                        <span>
                            AirPods
                        </span>
                    </label>
                    
                </div>
                <textarea className="border-slate-200 placeholder-slate-400 text-slate-900"
                    placeholder="Descripción del producto"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)} />
                {!imagePreview ? (
                    <button className=" bg-violet-700 border cursor-pointer text-center" onClick={handleImageClick}>Agregar imagen</button>
                ) : (
                    <>
                        <div className="flex gap-2 w-full">
                            <button className=" bg-violet-700 border cursor-pointer text-center w-1/2" onClick={handleImageClick}>Cambiar Imagen</button>
                            <button className=" bg-red-400 border cursor-pointer text-center w-1/2" onClick={handleImageDelete}>Eliminar Imagen</button>
                        </div>
                        <img
                            src={imagePreview}
                            className="aspect-square object-cover"
                            id="image-preview"
                            alt={imageFile?.name} />
                    </>
                )}
                <input type="file"
                    accept="image/*"
                    onChange={(event) => handleSelectedFile(event.target.files)}
                    id="fileInput"
                    className="hidden" />
                <button className=" bg-violet-700 border cursor-pointer text-center"
                    onClick={handleAddProduct}>
                    Agregar Producto
                </button>
                {progressUpload > 0 && (
                    <progress value={progressUpload} max="100" />
                )}
            </label>
        </main>
    );
};

export default AddProduct;
