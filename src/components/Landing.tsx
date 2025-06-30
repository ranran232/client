import React from 'react';
import { Camera, ArrowRight, Sparkles } from 'lucide-react';
import CardGrid from './Category';
import FeaturedCarousel from './FeaturedCarousel';
import GalleryHeader from './GalleryHeader';

export default function GalleryHero() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 overflow-hidden">
      <GalleryHeader />
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-rose-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-rose-200 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(244 63 94) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 mt-[5rem] md:mt-0">
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
             Her World Through Our Lens
            </div>
            
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-rose-600 to-rose-800 bg-clip-text text-transparent">
                  Discover
                </span>
                <br />
                <span className="text-gray-900">Timeless</span>
                <br />
                <span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
                  Artistry
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed hidden md:block">
          Each photo and drawing in this gallery captures a piece of her growing story. From joyful snapshots to imaginative sketches, this is a place where memories live, beautifully frozen in time.
        </p>      
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="group bg-rose-400 hover:bg-rose-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center gap-2">
                Explore Gallery
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group border-2 border-rose-300 text-rose-600 hover:bg-rose-50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:border-rose-400 flex items-center justify-center gap-2">
                <Camera className="w-5 h-5" />
                Virtual Tour
              </button>
            </div>

          </div>

          {/* Right Content - Featured Art Preview */}
        <FeaturedCarousel/>

        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="rgb(251 113 133)"
            fillOpacity="0.1"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,85.3C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
      <CardGrid/>
    </div>
  );
}