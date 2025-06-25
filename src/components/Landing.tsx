'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner';
import CardGrid from './Category';
import { useInView } from '@/app/hooks/useInView';
import { Home, Info, LogOut, User } from 'lucide-react';
import Footer from './Footer';
import { useUserStore } from '@/app/store/useUserStore'; 
import LoginModal from './LoginModal';
import IntegratedAnimatedGallery from './AnimatedText';


export default function Page() {
const [isLoginOpen, setIsLoginOpen] = useState(false);
const {isAdmin, setIsAdmin}= useUserStore();
const { ref, isInView } = useInView<HTMLDivElement>(0.2); 
const [hasAnimated, setHasAnimated] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolledToGrid, setScrolledToGrid] = useState(false);
  
// Define your navigation items conditionally
const navItems = isAdmin
  ? [
      { id: 'home', icon: <Home size={20} />, label: 'Home', href: '#' },
      { id: 'category', icon: <Info size={20} />, label: 'About', href: '#category' },
      { id: 'logout', icon: <LogOut size={20} />, label: 'Logout', href: '#' },
    ]
  : [
      { id: 'home', icon: <Home size={20} />, label: 'Home', href: '#' },
      { id: 'category', icon: <Info size={20} />, label: 'About', href: '#category' },
      { id: 'login', icon: <User size={20} />, label: 'Login', href: '#' },
    ];


useEffect(() => {
  if (isInView && !hasAnimated) {
    setHasAnimated(true);
  }
}, [isInView, hasAnimated]);


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

}, []);
    


       const handleLogOut=async ()=>{
    try{
      const response= await fetch('https://expresso-plum.vercel.app/logout/', {
        method:"POST",
        headers:{
          'Content-Type' : 'application/json'
        },
        credentials: 'include',
      })
      const status= response.status;
      if(status === 200) {
        setIsAdmin(false);
      }
      toast.success('log-out successfully');
    }
    catch(error){
      console.error(error);
    }

    }
useEffect(() => {
  if (isInView && !hasAnimated) {
    setHasAnimated(true);
  }
  setScrolledToGrid(isInView);
}, [isInView, hasAnimated]);

useEffect(() => {
  if (scrolledToGrid) {
    setActive('category');
  } else {
    setActive('home');
  }
}, [scrolledToGrid]);


  return (
    <div>
      {/* Responsive Header */}
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-md border border-white/20 px-4 py-2 flex items-center gap-6 transition focus-within:ring-2 ring-rose-400">
        
        {/* Text logo */}
        <div className="text-rose-300 text-lg font-semibold tracking-wide pr-4 border-r border-white/20">
          Maby
        </div>

        {/* Icon navigation */}
        <nav className="flex items-center gap-4">
      {navItems.map((item) => (
        <a
          key={item.id}
          href={item.href}
          onClick={(e) => {
            setActive(item.id);

            if (item.id === 'login') {
              e.preventDefault();
              setIsLoginOpen(true);
            }

            if (item.id === 'logout') {
              e.preventDefault();
             handleLogOut();
              setActive('home'); 
            }
          }}
          className={`p-2 rounded-full transition-colors duration-200 hover:bg-white/20 focus:outline-none ${
            active === item.id
              ? 'bg-white/30 text-rose-300'
              : scrolledToGrid
              ? 'text-black'
              : 'text-white'
          }`}
          aria-label={item.label}
        >
          {item.icon}
        </a>
      ))}
    </nav>
      </div>
    </header>

      {/* Parallax Section */}
<section
  className="relative h-screen bg-fixed bg-center bg-cover"
  style={{
    backgroundImage: `url('/anewwife_bg.png')`,
  }}
>
  <IntegratedAnimatedGallery/>
  <LoginModal isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />
</section>

      {/* Content Section */}
      <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <CardGrid />
    </motion.div>

      <Footer />

    
    </div>
  )
}
