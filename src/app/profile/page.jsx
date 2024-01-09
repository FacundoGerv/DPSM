"use client";
import firebaseApp, { storage } from '@/app/firebase';
import s from "@/app/styles/profile.module.css";
import { Progress } from 'antd';
import 'firebase/firestore';
import { collection, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useState } from 'react';
import Spinner from "../components/Spinner";
import { UserAuth } from "../context/AuthContext";

const db = getFirestore(firebaseApp);




const page = () => {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState('');
  const [id, setId] = useState('');
  const [userData, setUserData] = useState({}); 
  const [progressUpload, setProgressUpload] = useState(0);

 //Función por la cual se sube una imagen al storage de Firebase.
  const handleUploadFile = async () => {
    try {

      //Si hay un archivo vamos a crear una referencia y vamos a generar un pedido de subida de archivo.
      if (imageFile) {
        const name = imageFile.name;
        const storageRef = ref(storage, `image/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
  
        //Mientras que este pedido se ejecuta vamos a tomar el progreso y le estado del mismo.
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
          //Si hay un error, lo toma y lo devuelve.
          (error) => {
            console.error(error.message);
          },
          //Una vez terminada la subida, se va actualizar el usuario con la url del imagen subida.
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Image Url:", url);
            const updatedUserData = {
              ...userData,
              image: url,
            };
            updateUserData(updatedUserData);
          }
        );
        //En el caso que no se requiera actualizar la imagen, solamente se va llamar a la función de "updateUser" para subir los datos.
      } else {
        updateUserData(userData);
        for (let i = 10; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 50)); //Se simula un tiempo de carga.
          setProgressUpload(i);
        }
      }
    } catch (error) {
      console.error('Error uploading file or updating data:', error.message);
    }
  };
  
  //Esta es la función que actualiza los datos en la bd. 
  //Que se llama desde "handleuploadFile" con propiedades diferentes dependiendo del caso.
  const updateUserData = async (updatedUserData) => {
    try {
      const userRef = doc(db, 'genCollection', id);
      await updateDoc(userRef, updatedUserData);
      console.log('Updated UserData:', updatedUserData);
      console.log('Document written with ID: ', userRef.id);
    } catch (error) {
      console.error('Error updating document:', error.message);
    }
  };
  
  //Esto toma los datos desde los input y actualiza el estado de "userData" con los datos nuevos.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      name: userData.name,
      uid: userData.uid,
      age: userData?.age,
      work: userData?.work,
      country: userData?.country,
      province: userData?.province,
      num: userData?.num,
      time: userData?.time,
      [name]: value,
    }));
    console.log('handleChange Data:', userData);
  };


  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
    fetchUserData();

  }, [user]);

  //Actualiza el estado de "imageFile" con el archivo tomado del input type:File.
  const handleSelectedFile = (files) => {
    try {
      if (files[0].size < 10000000) {
        setImageFile(files[0]);
        console.log(files[0])
      } else {
        alert('Archivo demasiado Grande');
      }
    } catch (e) {
      console.error('No se detecto el archivo');
    }

  }

  //Actualiza el estado de "imageFile" y lo pone como indefinido, asi borrando la imagen cargada.
  const handleRemoveFile = () => {
    setImageFile(undefined);
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = '';
    }
  }

  //Llama a la coleción de la bd y actualiza el estado de "userData" filtrando los datos del usuario que a iniciado sesión.
  const fetchUserData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'genCollection'));

      querySnapshot.forEach((doc) => {
        
        // Compara el UID del documento con el UID del usuario.
        if (doc.data().uid === user.uid) {
          setUserData({
            ...userData,
            name: user.displayName,
            uid: user.uid,
          });
          setId(doc.id);
          setUserData((prevUserData) => {
            // console.log('User data:', doc.data());
            return doc.data();
          });
        }
      });
    } catch (error) {
    }
  };


  return (
    <div className={s.mainWrapper}>
      {loading && (
        <Spinner />
      )}
      {!user && (
        <span>No hay una sesion iniciada</span>
      )}
      {user && (


        <div className={s.mainContent}>
          <div className={s.previewWrapper}>
            <div className={s.cardPreviewContent}>
              <div className={s.cardWrapper}>
                <div className={`${s.cardContainer} ${s.imageCard}`}>
                  <input type="file" className={s.imageInput} id='fileInput' defaultValue={userData?.image} accept="image/*" onChange={(event) => handleSelectedFile(event.target.files)} />
                  {imageFile && (
                    <>
                      <div className='w-full flex items-center relative justify-center'>
                        <img src={URL.createObjectURL(imageFile)} alt="Vista previa" className='h-[45dvh] w-[18dvw] object-cover shadow-md' />
                      </div>
                      <span className={`${s.imageText} absolute bottom-0 bg-red-400 bg-opacity-60 z-20 w-full cursor-pointer`}
                        onClick={handleRemoveFile}
                      >Eliminar</span>

                    </>
                  )}
                  {!imageFile && userData.image && (
                    <div className='w-full flex items-center relative justify-center'>
                      <img src={userData.image} alt="Vista previa" className='h-[45dvh] w-[18dvw] object-cover shadow-md' />
                    </div>
                  )}
                  {!imageFile && !userData.image && (
                    <>
                      <span className={s.imageText}>Arrastre o haga click aqui para seleccionar una imagen</span>
                      <div className={`${s.redMark} w-full border-b-2 rotate-45 border-red-500 absolute`}></div>
                      <div className={`${s.redMark} w-full border-b-2 -rotate-45 border-red-500 absolute`}></div>
                    </>
                  )}
                </div>
                <span className={s.cardDesc}>Foto del perfil</span>
              </div>
              <div className={s.cardWrapper}>
                <div className={s.cardContainer}>
                  <span>{userData.name}</span>
                  {userData.country && (<span>{userData.country}, {userData.province}</span>)}
                  {userData.age && (<span>Edad: {userData.age}</span>)}
                  {userData.sex && (<span>Sexo: {userData.sex}</span>)}
                  {userData.work && (<span>Ocupación: {userData.work}</span>)}
                  {userData.time && (<span>Horarios: {userData.time}</span>)}
                  {userData.num && (<span>Telefono {userData.num}</span>)}

                </div>
                <span className={s.cardDesc}>Previsualizacion</span>
              </div>
            </div>
            <div className={s.buttonContainer}>
              <button className={s.submitButton} onClick={handleUploadFile}>Actualizar Perfil</button>
              <Progress percent={progressUpload} trailColor={'#475569'}/>
            </div>
          </div>

          <div className={s.formWrapper}>
            <div className={s.formInner}>
              <div className="w-full flex items-center justify-center">
                <h1 className="text-center border-b pb-1 px-2 text-gray-300">Agregar Datos</h1>
              </div>
              <form className="gap-4 lg:gap-2 2xl:py-4 flex flex-col">
                <div className={s.genInputContainer}>
                  <label>Nombre</label>
                  <input name='name'
                    maxLength={'50'}
                    defaultValue={userData?.name}
                    onChange={handleChange}
                    required></input>
                </div>
                <div className={s.genInputContainer}>
                  <label>Edad</label>
                  <input type="number"
                    name='age'
                    defaultValue={userData?.age}
                    onChange={handleChange}></input>
                </div>
                <div className={s.genInputContainer}>
                  <label>Sexo</label>
                  <select name='sex' onChange={handleChange} value={userData?.sex}>
                    <option></option>
                    <option value={'Masculino'}>Masculino</option>
                    <option value={'Femenino'}>Femenino</option>
                  </select>
                </div>
                <div className={s.genInputContainer}>
                  <label >Ocupación</label>
                  <input maxLength={'30'} name='work' onChange={handleChange} defaultValue={userData?.work}></input>
                </div>
                <div className={s.genInputContainer}>
                  <label>Pais de Residencia</label>
                  <input name='country' onChange={handleChange} defaultValue={userData?.country}></input>
                </div>
                <div className={s.genInputContainer}>
                  <label>Provincia</label>
                  <input placeholder="Ej. Mendoza" name='province' onChange={handleChange} defaultValue={userData?.province}></input>
                </div>
                <div className={s.genInputContainer}>
                  <label>Telefono</label>
                  <input type="number" name='num' onChange={handleChange} defaultValue={userData?.num}></input>
                </div>
                <div className={s.genInputContainer}>
                  <label>Horario Disponible</label>
                  <select name='time' value={userData?.time} onChange={handleChange}>
                    <option></option>
                    <option value={'Medio Tiempo'}>Medio Tiempo</option>
                    <option value={'Full Time'}>Full Time</option>
                  </select>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;