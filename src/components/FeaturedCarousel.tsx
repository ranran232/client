'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const featuredImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop' },
  { id: 2, src: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop' },
  { id: 3, src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop' },
  { id: 4, src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop' },
  { id: 5, src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop' },
];

export default function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredImages.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredImages.length) % featuredImages.length);
  };

  const getVisibleImages = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + featuredImages.length) % featuredImages.length;
      visible.push({ ...featuredImages[index], position: i });
    }
    return visible;
  };

  const getImageStyle = (position: number) => {
    const scale = position === 0 ? 1 : 0.8 - Math.abs(position) * 0.1;
    const translateX = position * 280;
    const translateZ = position === 0 ? 50 : -Math.abs(position) * 100;
    const rotateY = position * -15;
    const opacity = Math.abs(position) <= 2 ? 1 - Math.abs(position) * 0.2 : 0;

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex: 10 - Math.abs(position),
      willChange: 'transform',
    };
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4">
      <h1 className='text-center text-4xl font-bold md:mt-15 bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent'>Featured Photos</h1>
      <div
        className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden"
        style={{ perspective: '1500px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {getVisibleImages().map((image) => (
            <div
              key={image.id}
              className="absolute transition-transform transition-opacity duration-700 ease-in-out cursor-pointer"
              style={getImageStyle(image.position)}
              onClick={() =>
                image.position !== 0 &&
                setCurrentIndex(featuredImages.findIndex((img) => img.id === image.id))
              }
            >
              <div className="relative w-64 h-80 md:w-72 md:h-96 group">
                <div
                  className="w-full h-full bg-cover bg-center rounded-3xl shadow-2xl"
                  style={{ backgroundImage: `url(${image.src})` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 text-rose-600 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 text-rose-600 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots & Index */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/95 rounded-2xl px-6 py-3 shadow-xl z-20">
          <div className="flex items-center gap-4">
            <div className="flex space-x-2">
              {featuredImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-rose-500 scale-150' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
