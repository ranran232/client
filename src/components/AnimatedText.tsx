import React from 'react';

const IntegratedAnimatedGallery = () => {
  return (
    <div className="absolute bottom-20 w-full flex justify-center">

        <div className="text-center">
          <h1 className="text-rose-300 text-6xl md:text-8xl font-semibold tracking-[0.2em] uppercase px-4 font-sans">
           Ylana Rayne&apos;s
          </h1>
          <span className="text-white font-extrabold tracking-[0.2em] text-3xl block mt-2 animated-text">
            <span className="letter g-1">G</span>
            <span className="letter a-1">a</span>
            <span className="letter l-1">l</span>
            <span className="letter l-2">l</span>
            <span className="letter e-1">e</span>
            <span className="letter r-1">r</span>
            <span className="letter y-1">y</span>
          </span>
        </div>

      
      <style jsx>{`
        .animated-text {
          position: relative;
          overflow: hidden;
        }
        
        .letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          animation: letterAppear 0.8s ease-out forwards;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }
        
        /* Staggered animation delays for each letter */
        .g-1 { animation-delay: 0s; }
        .a-1 { animation-delay: 0.15s; }
        .l-1 { animation-delay: 0.3s; }
        .l-2 { animation-delay: 0.45s; }
        .e-1 { animation-delay: 0.6s; }
        .r-1 { animation-delay: 0.75s; }
        .y-1 { animation-delay: 0.9s; }
        
        @keyframes letterAppear {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
            text-shadow: 0 0 0 rgba(255, 255, 255, 0);
          }
          50% {
            opacity: 0.7;
            transform: translateY(-5px) scale(1.1);
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
        }
        
        /* Add a subtle glow effect */
        .animated-text::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
          transform: translateX(-100%);
          animation: shimmer 2s ease-in-out 1.2s forwards;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        /* Hover effect for interactivity */
        .animated-text:hover .letter {
          animation: letterPulse 0.6s ease-in-out;
        }
        
        @keyframes letterPulse {
          0%, 100% {
            transform: translateY(0) scale(1);
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
          50% {
            transform: translateY(-3px) scale(1.05);
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
          }
        }
      `}</style>
    </div>
  );
};

export default IntegratedAnimatedGallery;