'use client';
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="w-full fixed top-0 left-0 z-30 bg-white/80 backdrop-blur border-b border-rose-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 text-rose-600 font-extrabold text-xl sm:text-2xl tracking-tight">
          <Sparkles className="w-5 h-5 text-rose-500" />
          <span>HerGallery</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm sm:text-base text-gray-700 font-medium">
          <a href="#featured" className="hover:text-rose-500 transition">Featured</a>
          <a href="#drawings" className="hover:text-rose-500 transition">Drawings</a>
          <a href="#memories" className="hover:text-rose-500 transition">Memories</a>
          <a href="#about" className="hover:text-rose-500 transition">About</a>
        </nav>

        {/* CTA Button - Desktop Only */}
        <div className="hidden md:block">
          <button className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-full font-semibold transition text-sm sm:text-base shadow-md hover:shadow-lg">
            Start Tour
          </button>
        </div>

        {/* Hamburger Toggle - Mobile Only */}
      <div className="md:hidden">
  <button
    onClick={toggleMenu}
    className="relative w-8 h-8 flex items-center justify-center"
    aria-label="Toggle menu"
  >
    <motion.span
      className="absolute h-[2px] w-6 bg-gray-800 rounded origin-center"
      animate={{
        rotate: menuOpen ? 45 : 0,
        y: menuOpen ? 0 : -6,
      }}
      transition={{ duration: 0.3 }}
    />
    <motion.span
      className="absolute h-[2px] w-6 bg-gray-800 rounded"
      animate={{
        opacity: menuOpen ? 0 : 1,
      }}
      transition={{ duration: 0.2 }}
    />
    <motion.span
      className="absolute h-[2px] w-6 bg-gray-800 rounded origin-center"
      animate={{
        rotate: menuOpen ? -45 : 0,
        y: menuOpen ? 0 : 6,
      }}
      transition={{ duration: 0.3 }}
    />
  </button>
</div>

      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-rose-100 px-6 pb-4"
          >
            <div className="flex flex-col gap-4 mt-4 text-gray-700 text-sm font-medium">
              <a href="#featured" onClick={toggleMenu}>Featured</a>
              <a href="#drawings" onClick={toggleMenu}>Drawings</a>
              <a href="#memories" onClick={toggleMenu}>Memories</a>
              <a href="#about" onClick={toggleMenu}>About</a>
              <button
                onClick={toggleMenu}
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full font-semibold text-sm transition shadow-md mt-2"
              >
                Start Tour
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
