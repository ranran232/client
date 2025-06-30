'use client';
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const NUM_SPARKLES = 7;

// Add your image URLs here
const featuredImages: string[] = [
  '/anewwife_bg.png',
  '/asd.webp',
  '/body-slider-bg-1.webp',
  // Add more image paths as needed
];

export default function FeaturedCarousel() {
  const [current, setCurrent] = useState(0);
  const [sparklePositions, setSparklePositions] = useState<
    { top: number; left: number; rotate: number }[]
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featuredImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Only run randomization on client
  useEffect(() => {
    const generated = Array.from({ length: NUM_SPARKLES }, () => ({
      top: Math.random() * 90,
      left: Math.random() * 90,
      rotate: Math.random() * 360,
    }));
    setSparklePositions(generated);
  }, []);

return (
<div className="relative w-full max-w-lg mx-auto">
  {/* Image with Sparkles */}
  <div className="bg-gradient-to-br from-rose-200 to-rose-300 rounded-3xl p-8 shadow-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
    <div
      className="relative bg-cover bg-center bg-no-repeat rounded-2xl aspect-[3/4] shadow-inner flex items-center justify-center overflow-hidden transition-all duration-1000"
      style={{
        backgroundImage: `url(${featuredImages[current]})`,
      }}
    >
      {sparklePositions.map((s, i) => (
        <Sparkles
          key={i}
          className="absolute text-rose-400 w-5 h-5"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            transform: `rotate(${s.rotate}deg)`,
          }}
        />
      ))}
    </div>
  </div>

  {/* 🔲 Floating corner cards - now outside the image frame */}
  <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl transform rotate-12 hover:rotate-6 transition-transform duration-300">
    <div className="w-16 h-16 bg-gradient-to-br from-rose-300 to-rose-400 rounded-xl"></div>
  </div>

  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl transform -rotate-12 hover:-rotate-6 transition-transform duration-300">
    <div className="w-20 h-16 bg-gradient-to-br from-rose-200 to-rose-300 rounded-xl"></div>
  </div>
</div>

);

}
