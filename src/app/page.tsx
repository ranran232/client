"use client";

import React, { useEffect } from 'react'
import PhotoGalleryLanding from '../components/Landing'
import { useUserStore } from '@/app/store/useUserStore';
import { useLoadingStore } from './store/useLoadingStore';


const Page = () => {
const { setIsAdmin}= useUserStore();
 const { setLoading}= useLoadingStore();


    useEffect(() => {
      setLoading(true);
    const getAuth= async() =>{
          try{
            const response = await fetch('https://expresso-plum.vercel.app/auth', {
         method: 'GET',
         credentials: 'include',
       });
       if (response.status === 200) {
           setIsAdmin(true);
       }
          }catch(error){
            console.log(error)
          }finally{
            setLoading(false)
          }
    }
    getAuth();
  
  }, [setIsAdmin]);


  return (
    <div>
      <PhotoGalleryLanding/>
    </div>
  )
}

export default Page
