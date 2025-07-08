'use client';

import React, { useState } from 'react';
import { ArrowRight, Code, Sparkles} from 'lucide-react';
import CardGrid from './Category';
import FeaturedCarousel from './FeaturedCarousel';
import GalleryHeader from './GalleryHeader';
import { toast } from 'sonner';
import { useSigninStore } from '@/app/store/signInStore';
import { useUserStore } from '@/app/store/useUserStore';
import Footer from './Footer';

// SignInModal defined inline
function SignInModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 const {setIsAdmin}= useUserStore();

  if (!isOpen) return null;

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://expresso-plum.vercel.app/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      if(res.ok) {
        setIsAdmin(true)
       toast.success('Login successful!');
      onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };


  

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
      <div className="bg-gradient-to-br from-rose-200 to-rose-300 text-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-700 hover:text-gray-900">✕</button>
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            )}
          </div>

          {error && <p className="text-sm text-red-700 text-center">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full bg-white text-rose-600 font-semibold py-3 rounded-xl hover:bg-gray-100 transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GalleryHero() {
  const {isSignin, setIsSignin} = useSigninStore();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 overflow-hidden">
      <GalleryHeader />
      <SignInModal isOpen={isSignin} onClose={() => setIsSignin(false)} />
isSignin
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
              <a href='#category' className="group bg-rose-400 hover:bg-rose-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center gap-2">
                Explore Gallery
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <button
           
                className="group border-2 border-rose-300 text-rose-600 hover:bg-rose-50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:border-rose-400 flex items-center justify-center gap-2"
              >
                <Code className="w-5 h-5" />
                Contact
              </button>
            </div>
          </div>

          {/* Right Content - Featured Art Preview */}
          <FeaturedCarousel />
        </div>
      </div>


      <CardGrid />

      <Footer/>
    </div>
  );
}
