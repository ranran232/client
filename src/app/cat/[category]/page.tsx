"use client";

import { AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight, Download, Ellipsis, MousePointerClick, Trash, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner";
import { useUserStore } from '@/app/store/useUserStore'; 
import { FavoriteToggle } from "@/components/FavoriteButton";

interface ImageItem {
  _id: string;
  category: string;
  image: string;
}

interface PageProps {
  params: Promise<{ category: string }>;
}

export default function Page({ params }: PageProps) {
  const [category, setCategory] = useState<string>("");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
const {isAdmin, setIsAdmin}= useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageData, setCurrentImageData] = useState<ImageItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [delModal, setDelModal] = useState(false);
  const [imageId, setImageId]= useState(''); 
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
  const getAuth= async() =>{
        const response = await fetch('https://expresso-plum.vercel.app/auth', {
       method: 'GET',
       credentials: 'include',
     });
     if (response.status === 200) {
         setIsAdmin(true);
     }
  }
  getAuth();

}, [setIsAdmin]);

  // Resolve params and fetch data
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        setCategory(resolvedParams.category);

        const res = await fetch(
          `https://expresso-plum.vercel.app/image?category=${resolvedParams.category}`,
          {
            cache: "no-store",
          }
        );
        const fetchedImages: ImageItem[] = await res.json();
        console.log(fetchedImages)
        setImages(fetchedImages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      // Create preview URLs
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // Revoke the removed URL
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !category) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadedImages: ImageItem[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);

        const response = await fetch("https://expresso-plum.vercel.app/image", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const newImage = await response.json();
          uploadedImages.push(newImage);
          
          // Update progress
          setUploadProgress(((i + 1) / selectedFiles.length) * 100);
        } else {
          console.error(`Upload failed for file: ${file.name}`);
        }
      }

      // Update images state with all uploaded images
      setImages((prevImages) => [...prevImages, ...uploadedImages]);
      
      // Reset form
      setIsDialogOpen(false);
      setSelectedFiles([]);
      setPreviewUrls([]);
      setUploadProgress(0);
      router.refresh();
      
    } catch (error) {
      console.error("Error uploading:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedFiles([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setUploadProgress(0);
  };


  const fetchImageData = async (imageId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://expresso-plum.vercel.app/image/${imageId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentImageData(data);
      } else {
        console.error('Failed to fetch image data');
        // Fallback to use the image from the images array
        setCurrentImageData(images[currentImageIndex]);
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      // Fallback to use the image from the images array
      setCurrentImageData(images[currentImageIndex]);
    } finally {
      setLoading(false);
    }
  };

  // Open modal and fetch image data
  const openModal = (index:number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    fetchImageData(images[index]._id);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImageData(null);
  };

  // Navigate to previous image
  const goToPrevious = () => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    setCurrentImageIndex(newIndex);
    fetchImageData(images[newIndex]._id);
  };

  // Navigate to next image
  const goToNext = () => {
    const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    fetchImageData(images[newIndex]._id);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen, currentImageIndex]);


// Helper function to get file extension
const getFileExtension = (url: string) => {
  return url.split('.').pop()?.split(/\#|\?/)[0] || 'jpg';
};

// Method 2: For base64 images or when you need more control
const downloadImageAdvanced = async () => {
  if (!currentImageData) return;
  try {
    const response = await fetch(currentImageData.image);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentImageData.image || 'image'}-${currentImageIndex + 1}.${getFileExtension(currentImageData.image)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
  }
};

const handleDeleteImage=(id:string)=>{
  setDelModal(true);
  setImageId(id);
}

const handleCancel=()=>{
 setDelModal(false);
 setImageId('');
}


const handleDeleteImg= async()=>{
  setIsDeleting(true);
 try{
   const response= await fetch(`https://expresso-plum.vercel.app/image/${imageId}`,{
    method:"DELETE",
  });
  const data= await response.json();
  setIsModalOpen(false)
  toast.success(data);
 }
 catch(error){
  toast.error(String(error));
 }finally{
  setIsDeleting(false);
  setDelModal(false);
  fetchData();
 }
}

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="grid grid-cols-3 items-center px-6 py-4 bg-rose-300/50 text-white shadow-md">
         <div className="flex items-center">
  <Link
   href="/" as="/#category"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white/30 transition"
  >
    <ArrowLeft size={22} className="text-rose-400" />
  </Link>
</div>
          <div className="text-center">
       <h1 className="text-xs sm:text-xl font-semibold text-rose-500 tracking-wide">
        {category.length > 10 ? category.slice(0, 10) + '...' : category}
      </h1>
      </div>
        <div className="flex items-center justify-end gap-4">
         
          {
            isAdmin && 
            <>
             <button className="flex items-center cursor-pointer text-rose-500">
             <MousePointerClick />
            <span className="hidden sm:inline">Select</span>
          </button>
           
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 cursor-pointer text-rose-500">
                <UploadCloud className="w-5 h-5" />
                <span className="hidden sm:inline">Upload</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload Images</DialogTitle>
                <DialogDescription>
                  Upload multiple images to the  {category.length > 10 ? category.slice(0, 10) + '...' : category}category.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Choose Images</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                  {selectedFiles.length > 0 && (
                    <p className="text-sm text-gray-500">
                      {selectedFiles.length} file(s) selected
                    </p>
                  )}
                </div>

                {previewUrls.length > 0 && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 text-xs"
                            disabled={isUploading}
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                            {selectedFiles[index]?.name.slice(0, 10)}...
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className=" w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={handleDialogClose}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={selectedFiles.length === 0 || isUploading}
                  >
                    {isUploading ? `Uploading (${Math.round(uploadProgress)}%)` : `Upload ${selectedFiles.length} Image(s)`}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
           </>
          }
         
        </div>
      </header>

      {/* Body */}
      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 <div className="animate-pulse">
          <div className=" aspect-[5/4] bg-gray-200 rounded mb-4 rounded-xl"></div>
      </div>
         <div className="animate-pulse">
          <div className=" aspect-[5/4] bg-gray-200 rounded mb-4 rounded-xl"></div>
      </div>
         <div className="animate-pulse">
          <div className=" aspect-[5/4] bg-gray-200 rounded mb-4 rounded-xl"></div>
      </div>
         <div className="animate-pulse">
          <div className=" aspect-[5/4] bg-gray-200 rounded mb-4 rounded-xl"></div>
      </div>
         <div className="animate-pulse">
          <div className=" aspect-[5/4] bg-gray-200 rounded mb-4 rounded-xl"></div>
      </div>
         <div className="animate-pulse">
          <div className=" aspect-[5/4] bg-gray-200 rounded mb-4 rounded-xl"></div>
      </div>
         <div className="animate-pulse">
          <div className=" aspect-[5/4] bg-gray-200 rounded mb-4 rounded-xl"></div>
      </div>
         <div className="animate-pulse">
          <div className=" aspect-[5/4] bg-gray-200 rounded mb-4 rounded-xl"></div>
      </div>
         <div className="animate-pulse">
          <div className=" aspect-[5/4] bg-gray-200 rounded mb-4 rounded-xl"></div>
      </div>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center text-gray-500">
            <UploadCloud className="w-16 h-16 mb-4 text-rose-300" />
            <p className="text-lg font-medium">No images yet.</p>
            <p className="text-sm">Try uploading one to get started.</p>
          </div>
        ) : (
         <div>
    
      {/* Image Grid */}
   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {images.map((item, index) => (
    <div
      key={item._id}
      className="relative aspect-[5/4] rounded-xl overflow-hidden shadow-md border border-gray-200 group cursor-pointer"
      onClick={() => openModal(index)}
    >
      <Image
        fill
        unoptimized
        src={item.image}
        alt={item.category}
        className="w-full object-cover"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>

      {/* Heart Icon */}
      <div className="absolute bottom-2 right-2 p-1 hover:scale-110 transition-transform">
    <FavoriteToggle image={item.image}/>
      </div>
    </div>
  ))}
</div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-5xl max-h-full w-full">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/60 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
            >
              <X size={20} className="text-rose-400" />
            </button>

            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/60 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
            >
              <ChevronLeft size={30} className="text-rose-400"/>
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/60 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
            >
              <ChevronRight  size={30} className="text-rose-400"/>
            </button>

            {/* Image Container */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                </div>
              ) : currentImageData ? (
                <>
                  <img
                    src={currentImageData.image}
                    alt={currentImageData.category || 'Image'}
                     className="w-full max-h-[80vh] object-contain"
                  />
                  
                  {/* Image Info */}
                  <div className="p-4 bg-gray-50 h-[5px]">
                    <div className="flex justify-between items-center h-[5px]">
                      <div>
                        <p className="text-sm text-gray-600">
                          Image {currentImageIndex + 1} of {images.length}
                        </p>
                      </div>
                      <div>
                        <div >
                                      <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer"><Ellipsis/></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={downloadImageAdvanced}>
                <Download className="text-rose-400"/>
                Download</DropdownMenuItem>
             {
              isAdmin && 
                <>
                 <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>handleDeleteImage(currentImageData._id)}>
                <Trash className="text-rose-400" />
                Delete
                </DropdownMenuItem>
                </>
             }
            </DropdownMenuContent>
          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <p className="text-gray-500">Failed to load image</p>
                </div>
              )}
                 <div className="absolute bottom-10 right-5 p-1 hover:scale-110 transition-transform">
    <FavoriteToggle image={currentImageData?.image ?? ""}/>
      </div>
            </div>
          </div>
        </div>
      )}
    </div>
        )}
      </div>
     <Dialog open={delModal} onOpenChange={setDelModal}>
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
              onClick={handleDeleteImg}
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
    </div>
  );
}