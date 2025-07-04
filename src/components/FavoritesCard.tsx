import React, { useEffect, useState } from 'react';
import { MoveUpRight, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type Favorite = {
  image?: string;
  // Add other properties if needed
};

const FavoritesCard = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const getFavorites = async () => {
    try {
      const res = await fetch('https://expresso-plum.vercel.app/favorite');
      const data = await res.json();
      console.log(data);
      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFavorites();
  }, []);

  const NoImagePlaceholder = () => (
    <div className="relative aspect-[4/5] bg-gradient-to-br from-pink-300 to-rose-500 flex flex-col items-center justify-center transition-all duration-500">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-8 h-8 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute top-12 right-6 w-4 h-4 bg-rose-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-8 left-8 w-6 h-6 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-16 right-4 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      {/* Main Icon */}
      <div className="relative z-10 p-8 rounded-full bg-white/80 backdrop-blur-sm shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
        <Heart className="w-12 h-12 text-pink-500 group-hover:text-rose-600 transition-colors duration-300" />
      </div>
      
      {/* Upload Indicator */}
      <div className="relative z-10 mt-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm group-hover:shadow-md transition-all duration-300">
        <div className="flex items-center space-x-2 text-gray-600 group-hover:text-pink-700 transition-colors duration-300">
          <Heart className="w-4 h-4" />
          <span className="text-sm font-medium">Favorites</span>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 border-2 border-dashed border-pink-300 group-hover:border-rose-400 transition-colors duration-300 rounded-t-2xl"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="aspect-[4/5] bg-gray-200 rounded-xl mb-4"></div>
      </div>
    );
  }

  // If no favorites, show placeholder card
  if (favorites.length === 0) {
    return (
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <NoImagePlaceholder />
          
          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-0 right-0 px-1 md:px-4 py-3 flex items-end justify-between gap-2 text-white text-sm z-10">
            {/* Left: Category Name */}
            <div className="flex items-end gap-2 font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
              <div>
                <span className='text-xs sm:text-base md:text-lg font-thin'>Album</span>
                <span className="text-sm sm:text-xl md:text-2xl lg:text-3xl line-clamp-1">Favorites</span>
              </div>
            </div>

            {/* Right: View Button */}
            <div className="flex items-center gap-0 sm:gap-2">
              <Link
                href="/favorites"
                className="p-1 rounded hover:bg-white/10 text-white transition"
              >
                <MoveUpRight className="w-[17px] h-auto sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show the first favorite image if available
  const firstFavorite = favorites[favorites.length - 1];
  
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
        {firstFavorite?.image ? (
          <Image
            src={firstFavorite.image}
            alt="Favorites"
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <NoImagePlaceholder />
        )}

        {/* Favorites Count Badge */}
        {favorites.length > 0 && (
          <div className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            {favorites.length}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 px-1 md:px-4 py-3 flex items-end justify-between gap-2 text-white text-sm z-10">
          {/* Left: Category Name */}
          <div className="flex items-end gap-2 font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
            <div>
              <span className='text-xs sm:text-base md:text-lg font-thin'>Album</span>
              <span className="text-sm sm:text-xl md:text-2xl lg:text-3xl line-clamp-1">Favorites</span>
            </div>
          </div>

          {/* Right: View Button */}
          <div className="flex items-center gap-0 sm:gap-2">
            <Link
              href="/favorites"
              className="p-1 rounded hover:bg-white/10 text-white transition"
            >
              <MoveUpRight className="w-[17px] h-auto sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesCard;