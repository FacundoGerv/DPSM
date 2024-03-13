"use client";
import { React, useState, useEffect } from "react";
import firebaseApp, { storage } from '@/app/firebase';
import { updateDoc, doc, getFirestore, collection, getDocs, getDoc, addDoc } from 'firebase/firestore';
import { UserAuth } from "../context/AuthContext";
import { ref, storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Progress, CheckCircleOutlined, CloseCircleOutlined } from "antd";


const CheckboxButton = ({ label, value, checked, onChange, className }) => (
    <label className={className}>
        <input
            type="checkbox"
            className="hidden"
            value={value}
            checked={checked}
            onChange={onChange}
        />
        <span className="text-slate-300 text-center flex justify-center">{label}</span>
    </label>
);

const AddProduct = () => {
    const { user } = UserAuth();
    const twoColors = {
        '0%': '#108ee9',
        '100%': '#87d068',
    };
    const successIcon = <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    const errorIcon = <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
    const [productName, setProductName] = useState('');
    const [productCat, setProductCat] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [progressUpload, setProgressUpload] = useState(0);
    const [imagePreview, setImagePreview] = useState('');
    const categories = ['iPhone', 'Macbooks', 'AirPods', 'Fundas', 'Apple Watch', 'Samsung', 'Motorola', 'Xiaomi', 'Cargadores']
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
        <main className="overflow-y-scroll overscroll-contain relative w-full h-[95.8dvh] bg-slate-800 bg-opacity-30 flex justify-start pt-20 items-center flex-col !m-0">
            
            <span className="flex text-2xl text-slate-300 absolute top-5">
                Agregar producto
            </span>
            <label className="w-[20dvw] flex flex-col p-2 gap-2 ring-2 ring-violet-400 ring-opacity-60">
                <input className=" px-1 border-slate-200 placeholder-slate-400 text-slate-900 "
                    type="text"
                    placeholder="Nombre del producto"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)} />
                <input className="px-1 border-slate-200 placeholder-slate-400 text-slate-900"
                    type="text"
                    placeholder="Precio"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)} />
                <div className="grid grid-flow-row grid-cols-3 gap-3 items-center justify-between">
                    {categories.map((cat) => (
                        <CheckboxButton
                            className={`${productCat === cat ? 'border-b-2 border-violet-400' : ''} cursor-pointer select-none border-b-2 whitespace-nowrap`}
                            key={cat}
                            label={cat}
                            value={cat}
                            checked={productCat === cat}
                            onChange={() => setProductCat(cat)}
                        />
                    ))}

                </div>
                <textarea className="h-[10dvh] resize-none px-1 border-slate-200 placeholder-slate-400 text-slate-900"
                    placeholder="Descripción del producto"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)} />
                {!imagePreview ? (
                    <button className="hover:border-2 bg-opacity-30 bg-violet-700 border cursor-pointer text-center" onClick={handleImageClick}>Agregar imagen</button>
                ) : (
                    <>
                        <div className="flex gap-2 w-full">
                            <button className="bg-opacity-30 hover:border-2 bg-violet-700 border cursor-pointer text-center w-1/2" onClick={handleImageClick}>Cambiar Imagen</button>
                            <button className="bg-opacity-30 hover:border-2 bg-red-400 border cursor-pointer text-center w-1/2" onClick={handleImageDelete}>Eliminar Imagen</button>
                        </div>
                        <img
                            src={imagePreview}
                            className="w-full aspect-square object-cover"
                            id="image-preview"
                            alt={imageFile?.name} />
                    </>
                )}
                <input type="file"
                    accept="image/*"
                    onChange={(event) => handleSelectedFile(event.target.files)}
                    id="fileInput"
                    className="hidden" />
                <button className="bg-opacity-60 hover:border-2 hover:border-emerald-500 bg-green-400 border cursor-pointer text-center"
                    onClick={handleAddProduct}>
                    Agregar Producto
                </button>
                <div className="w-[105%] h-4 mt-2 items-center justify-end flex pl-1">
                    <Progress
                        format={(percent) => percent != 100 ? (<span style={{ color: '#fff' }}>{percent}%</span>
                        ) : (
                            <div 
                            className="border border-emerald-200 rounded-full w-5 bg-emerald-300 bg-opacity-80 aspect-square flex items-center justify-center overflow-hidden">
                                <span 
                                className="text-black font-extrabold"
                                >
                                    ✓
                                </span>
                            </div>
                        )}
                        percent={progressUpload}
                        max="100"
                        trailColor="rgba(255, 255, 255 , .05)"
                        strokeColor={twoColors}
                    />
                </div>

            </label>
        </main>
    );
};

export default AddProduct;
