"use client";

import { ArrowLeft, ChevronLeft, ChevronRight, Download, Ellipsis, Heart, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { toast } from "sonner";
import { FavoriteToggle } from "@/components/FavoriteButton";

interface FavoriteItem {
  _id: string;
  image: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageData, setCurrentImageData] = useState<FavoriteItem | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch favorites data
  const fetchFavorites = async () => {
    try {
      const res = await fetch("https://expresso-plum.vercel.app/favorite", {
        cache: "no-store",
      });
      const fetchedFavorites: FavoriteItem[] = await res.json();
      console.log(fetchedFavorites);
      setFavorites(fetchedFavorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchImageData = async (imageId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://expresso-plum.vercel.app/favorite/${imageId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentImageData(data);
      } else {
        console.error('Failed to fetch image data');
        // Fallback to use the image from the favorites array
        setCurrentImageData(favorites[currentImageIndex]);
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      // Fallback to use the image from the favorites array
      setCurrentImageData(favorites[currentImageIndex]);
    } finally {
      setLoading(false);
    }
  };

  // Open modal and fetch image data
  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    fetchImageData(favorites[index]._id);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImageData(null);
  };

  // Navigate to previous image
  const goToPrevious = () => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : favorites.length - 1;
    setCurrentImageIndex(newIndex);
    fetchImageData(favorites[newIndex]._id);
  };

  // Navigate to next image
  const goToNext = () => {
    const newIndex = currentImageIndex < favorites.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    fetchImageData(favorites[newIndex]._id);
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
  }, [isModalOpen, currentImageIndex, favorites.length]);

  // Helper function to get file extension
  const getFileExtension = (url: string) => {
    return url.split('.').pop()?.split(/\#|\?/)[0] || 'jpg';
  };

  // Download image function
  const downloadImageAdvanced = async () => {
    if (!currentImageData) return;
    try {
      const response = await fetch(currentImageData.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `favorite-${currentImageIndex + 1}.${getFileExtension(currentImageData.image)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download image');
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Header */}
      <header className="grid grid-cols-3 items-center px-6 py-4 bg-rose-300/50 text-white shadow-md">
        <div className="flex items-center">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white/30 transition"
          >
            <ArrowLeft size={22} className="text-rose-400" />
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-xs sm:text-xl font-semibold text-rose-500 tracking-wide flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Favorites
          </h1>
        </div>
        <div className="flex items-center justify-end">
          <div className="text-rose-500 text-sm">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[5/4] bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center text-gray-500">
            <div className="w-20 h-20 mb-6 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-pink-400" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">No favorites yet</p>
            <p className="text-sm text-gray-500 mb-6">Start adding images to your favorites to see them here</p>
            <Link
              href="/"
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Browse Albums
            </Link>
          </div>
        ) : (
          <div>
            {/* Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map((item, index) => (
                <div
                  key={item._id}
                  className="relative aspect-[5/4] rounded-xl overflow-hidden shadow-lg border border-gray-200 group cursor-pointer bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                  onClick={() => openModal(index)}
                >
                  <Image
                    fill
                    unoptimized
                    src={item.image}
                    alt={`Favorite ${index + 1}`}
                    className="w-full object-cover"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>

                  {/* Favorite Badge */}
                  <div className="absolute top-2 right-2 bg-pink-500 text-white p-1 rounded-full shadow-lg">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>

                  {/* Heart Toggle */}
                  <div className="absolute bottom-2 right-2 p-1 hover:scale-110 transition-transform">
                    <FavoriteToggle 
                      image={item.image} 
                    />
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
                  {favorites.length > 1 && (
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/60 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
                    >
                      <ChevronLeft size={30} className="text-rose-400" />
                    </button>
                  )}

                  {/* Next Button */}
                  {favorites.length > 1 && (
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/60 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
                    >
                      <ChevronRight size={30} className="text-rose-400" />
                    </button>
                  )}

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
                          alt={`Favorite ${currentImageIndex + 1}`}
                          className="w-full object-contain"
                        />
                        
                        {/* Image Info */}
                        <div className="p-4 bg-gray-50 h-[5px]">
                          <div className="flex justify-between items-center h-[5px]">
                            <div>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Heart className="w-4 h-4 text-pink-500" />
                                Favorite {currentImageIndex + 1} of {favorites.length}
                              </p>
                            </div>
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger className="cursor-pointer">
                                  <Ellipsis />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem onClick={downloadImageAdvanced}>
                                    <Download className="text-rose-400" />
                                    Download
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-96">
                        <p className="text-gray-500">Failed to load image</p>
                      </div>
                    )}
                    
                    {/* Favorite Toggle in Modal */}
                    <div className="absolute bottom-10 right-5 p-1 hover:scale-110 transition-transform">
                      <FavoriteToggle 
                        image={currentImageData?.image ?? ""} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}