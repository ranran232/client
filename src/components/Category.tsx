import React, { useEffect, useState } from 'react';
import {Camera, ImageIcon, Plus, Upload,  Edit, Trash2, Eye, AlertTriangle, Edit3 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { useUserStore } from '@/app/store/useUserStore';



const CardGrid = () => {
    interface Latest{
        category:string,
        image:string,
    }
    const [latest, setLatest]= useState<Latest[]>([]);
    const [isNewSet, setIsNewSet]= useState(false);
    const [set, setNewSet]= useState('');
     const [loading,setLoading]= useState(false);
     const [selectedCat, setSelectedCat]= useState('');
      const [isOpen, setIsOpen] = useState(false);
     const [isDeleting, setIsDeleting] = useState(false);
     const [tempFieldName, setTempFieldName]= useState('');
         const [isEditOpen, setIsEditOpen] = useState(false);
         const [isSaving, setIsSaving]= useState(false);
           const {isAdmin}= useUserStore();

      useEffect(() => {
    if (typeof window === 'undefined') return;

    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Wait a bit to ensure everything is mounted
    setTimeout(scrollToHash, 100);
  }, []);

const getLatest= async()=>{
    const res= await fetch('https://expresso-plum.vercel.app/latest');
    const data= await res.json();
    console.log(data);
    setLatest(Array.isArray(data) ? data : []);
}
  
useEffect(()=>{
    getLatest();
},[])

const handleSaveSet = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await fetch('https://expresso-plum.vercel.app/category', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name:set})
    });
    const data = await res.json();
   if (res.status=== 200){
    toast.success(data);
   }
   else{
    toast.error(data);
   }
    setIsNewSet(false);
        getLatest();
  } catch (error) {
    console.log(error);
    toast.error(String(error))
  }finally{
    setLoading(false);
  }
}

const handleIsDelete= (cat:string)=>{
    setSelectedCat(cat);
    setIsOpen(true);
}

const handleDeleteCat= async()=>{
  setIsDeleting(true);
 try{
   const response= await fetch(`https://expresso-plum.vercel.app/category/${selectedCat}`,{
    method:"DELETE",
  });
  const data= await response.json();
  toast.success(data);
 }
 catch(error){
  toast.error(String(error));
 }finally{
  setIsDeleting(false);
  setIsOpen(false);
  getLatest();
 }
}

const handleCancel=()=>{
  setIsOpen(false);
  setSelectedCat('');
  setTempFieldName('');
  setIsEditOpen(false);
}

const handleIsEdit=(cat:string)=>{
  setTempFieldName(cat);
  setSelectedCat(cat);
  setIsEditOpen(true);
}

const handleSaveEdit=async ()=>{
     setIsSaving(true);
 try{
   const response= await fetch(`https://expresso-plum.vercel.app/category/${selectedCat}`,{
    method:"PUT",
    headers:{
      'Content-Type':'application/json',
    },
  body: JSON.stringify({ name: tempFieldName }),
  });
  const data= await response.json();
  console.log(data);
  toast.success(data.message);
 }
 catch(error){
  if (error && typeof error === 'object' && 'error' in error) {
    toast.error(String((error).error));
  } else {
    toast.error(String(error));
  }
 }finally{
  setIsSaving(false);
  setIsEditOpen(false);
  getLatest();
 }
}


const NoImagePlaceholder = () => (
    <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center group-hover:from-pink-50 group-hover:to-rose-50 transition-all duration-500">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 w-8 h-8 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute top-12 right-6 w-4 h-4 bg-rose-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-8 left-8 w-6 h-6 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-16 right-4 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      {/* Main Icon */}
      <div className="relative z-10 p-8 rounded-full bg-white/80 backdrop-blur-sm shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
        <ImageIcon className="w-12 h-12 text-gray-400 group-hover:text-pink-500 transition-colors duration-300" />
      </div>
      
      {/* Upload Indicator */}
      <div className="relative z-10 mt-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm group-hover:shadow-md transition-all duration-300">
        <div className="flex items-center space-x-2 text-gray-500 group-hover:text-pink-600 transition-colors duration-300">
          <Upload className="w-4 h-4" />
          <span className="text-sm font-medium">No image yet, upload</span>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 border-2 border-dashed border-gray-200 group-hover:border-pink-300 transition-colors duration-300 rounded-t-2xl"></div>
    </div>
  );


  return (
    <div id='category' className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-16 px-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Responsive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-rose-300 font-bold">
             Albums
            </h1>
          {/* Action Button */}
           {
            isAdmin && 
             <button 
              className="w-full sm:w-auto cursor-pointer group border-2 border-rose-300 text-rose-300 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold  transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => setIsNewSet(true)}
            >
              <span className="flex items-center justify-center space-x-2">
                <span className="text-sm sm:text-base">Create New</span>
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
              </span>
            </button>
           }
        </div>

        {/* Responsive Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {latest.map((item, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
            >
              {/* Image Container or Placeholder */}
              <div className="relative">
                {item.image ? (
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.category}
                      fill
                      unoptimized
                      className=" object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <NoImagePlaceholder />
                )}
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2">
                  {item.category}
                </h3>
                

           {/* Action Button */}
        {
          isAdmin ? 
              <div className="flex justify-center gap-1 w-full">
          {/* Edit - Compact */}
          <button onClick={()=>handleIsEdit(item.category)} className="cursor-pointer group flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-l-lg border border-slate-200 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30">
            <Edit size={16} className="transition-colors" />
            <span className="text-sm font-medium">Edit</span>
          </button>

          {/* Delete - Compact */}
          <button onClick={()=>handleIsDelete(item.category)} className="cursor-pointer group flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border-t border-b border-slate-200 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-30">
            <Trash2 size={16} className="transition-colors" />
               <span className="text-sm font-medium">Delete</span>
          </button>

          {/* View - Compact Primary */}
         <Link href={`cat/${item.category}`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-rose-300  border border-rose-300 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.01] focus:outline-none shadow-sm hover:shadow-md">
            <Eye size={16} />
            <span className="text-sm">View</span>
          </Link>
        </div>
        :
        <Link href={`cat/${item.category}`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-rose-300  border border-rose-300 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.01] focus:outline-none shadow-sm hover:shadow-md">
            <Eye size={20} />
            <span className="text-base">View</span>
          </Link>
        }

              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300 animate-pulse" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300 animate-bounce" />
            </div>
          ))}
        </div>

        {/* Empty State Message */}
        {latest.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-pink-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">No collections yet</h3>
            <p className="text-gray-500 text-sm sm:text-base mb-6">Create your first collection to get started</p>
            <button 
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => setIsNewSet(true)}
            >
              Create Collection
            </button>
          </div>
        )}

      </div>

{/* Dialog */}
<Dialog open={isNewSet} onOpenChange={setIsNewSet}>
  <DialogContent
    className="p-0 max-w-md overflow-hidden rounded-3xl shadow-2xl">
    <div className="bg-rose-300/50 px-6 py-5">
      <DialogHeader className="p-0">
        <DialogTitle className="text-rose-400 flex items-center gap-2 text-xl font-extrabold tracking-wide">
          <Plus className="w-6 h-6" />
          New Set
        </DialogTitle>
      </DialogHeader>
    </div>
    <form
      onSubmit={handleSaveSet}
      className="bg-white px-6 py-8"
    >
      {/* single text input */}
      <label htmlFor="set" className="block text-sm font-medium text-rose-400 mb-2">
        Set name
      </label>
      <input
        id="set"
        name="set"
        type="text"
        value={set}
        required
        placeholder="e.g. lorem ipsum"
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                   onChange={(e)=>setNewSet(e.target.value)}
      />
      <div className="mt-8 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setIsNewSet(false)}
          className="cursor-pointer rounded-full px-6 py-3 font-semibold text-gray-600
                     hover:text-gray-800 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="cursor-pointer group flex items-center gap-2 rounded-full bg-rose-300/50 px-8 py-3 font-semibold text-rose-400
                     hover:shadow-xl
                     transform transition-all duration-300 hover:scale-105"
        >
          <Camera className="h-5 w-5 group-hover:rotate-12 transition-transform" />
           {loading ?
                <svg className="animate-spin h-5 w-5 inline-block text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-label="Loading">
      <title>Loading spinner</title>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
              : 'Create'}
        </button>
      </div>
    </form>
  </DialogContent>
</Dialog>

 <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Confirm Deletion
                </DialogTitle>
              </div>
              <DialogDescription className="text-gray-600 leading-relaxed">
                Are you sure you want to delete this item? 
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className="gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
              onClick={handleDeleteCat}
                disabled={isDeleting}
                className="px-4 py-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-md hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium min-w-[100px]"
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </div>
                ) : (
                  'Delete'
                )}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-white" />
                  </div>
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    Edit Name
                  </DialogTitle>
                </div>
              </DialogHeader>
              
              <div className="">
                <label htmlFor="field-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="field-name"
                  type="text"
                  value={tempFieldName}
                  onChange={(e) => setTempFieldName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                  placeholder="Enter name..."
                  autoFocus
                />
              </div>
              
              <DialogFooter className="gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving || tempFieldName.trim() === '' || tempFieldName.trim() === selectedCat}
                  className="px-4 py-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-md hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium min-w-[80px]"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save'
                  )}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    </div>
  );
};

export default CardGrid;