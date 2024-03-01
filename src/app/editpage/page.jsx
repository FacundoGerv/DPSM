"use client";
import React from "react";
import { useContext, createContext, useState, useEffect, use } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/app/firebase";
import firebaseApp from '@/app/firebase';
import { updateDoc, setDoc, doc, getFirestore, collection, getDocs, getDoc} from 'firebase/firestore'
import { setuid } from "process";


const EditPage = () => {
    const [users, setUsers] = useState([]);
    const db = getFirestore(firebaseApp);

    const handleCheckboxChange = async (e) => {

        console.log(e.target.getAttribute('e-key'))
        const userRef = doc(db, 'users', e.target.getAttribute('e-key'));
        const userSnap = await getDoc(userRef);
        console.log(userSnap.data().isAdmin)
        userSnap.data().isAdmin ? updateDoc(doc(db, 'users',  e.target.getAttribute('e-key')), {isAdmin: false}) : updateDoc(doc(db, 'users',  e.target.getAttribute('e-key')), {isAdmin: true})

        .then(() => {
            users.forEach((ud)=>{
                ud.id === userSnap.data().id ? console.warn("si") : console.log("no") 
            })
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const userData = [];
            querySnapshot.forEach((doc) => {
                userData.push({ id: doc.id, ...doc.data() });
            });
            setUsers(userData);
        };
        fetchData();
    }, [users]);

    return (
        <main>
            <div className="w-full flex justify-start bg-slate-600 bg-opacity-30">
                <ul className="grid grid-flow-row  gap-x-5 w-full">
                    <ul className="flex gap-x-10  w-full border-b px-10 bg-slate-500 bg-opacity-50">
                        <li className="w-[20dvw]">Nombre</li>
                        <li className="w-[20dvw]">Correo</li>
                        <li className="w-[20dvw]">Id de usuario</li>
                        <li className="w-[20dvw]">Administrador</li>
                    </ul>
                    {users.map((u) => (
                        <ul className="flex gap-x-10  w-full border-b px-10 py-1 hover:bg-slate-500" key={u.id}>
                            <li className="w-[20dvw]">{u.displayName}</li>
                            <li className="w-[20dvw]">{u.email}</li>
                            <li className="w-[20dvw]">{u.id}</li>
                            <li className="w-[20dvw]">
                                <label className='relative inline-flex cursor-pointer select-none items-center'>
                                    <input
                                        type='checkbox'
                                        name='autoSaver'
                                        className='sr-only'
                                        e-key={u.id}
                                        checked={u.isAdmin}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span
                                        className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 bg-slate-300`}
                                    >
                                        <span
                                            className={`dot h-[18px] w-[18px] rounded-full  duration-200 ${u.isAdmin ? 'translate-x-6 bg-green-500' : 'bg-red-400'
                                                }`}
                                        ></span>
                                    </span>
                                    <span className='label flex items-center text-sm font-medium text-white'>
                                        <span className='pl-1'> {u.isAdmin ? 'Si' : 'No'} </span>
                                    </span>
                                </label>
                            </li>
                        </ul>
                    ))}

                </ul>
            </div>
        </main>
    )
}
export default EditPage;