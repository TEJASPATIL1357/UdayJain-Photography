import React from 'react';
import { motion } from 'framer-motion';

export default function AboutHero({ heroImage, title, subtitle }) {
  return (
    <section className="relative w-full h-screen bg-black-main overflow-hidden flex items-center justify-center">
      {/* Background Image with Parallax / Zoom effect */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage || '/placeholder-bg.jpg'})` }}
      />

      {/* Dark Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black-main via-black-main/60 to-black/30 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.h4 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gold tracking-[0.4em] text-xs uppercase mb-6"
        >
          Discover Our Legacy
        </motion.h4>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl font-playfair text-white mb-6 leading-tight drop-shadow-2xl"
        >
          {title || "Every Picture Tells a Story"}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto"
        >
          {subtitle || "Capturing emotions, memories, and moments that last forever."}
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/50">Scroll Down</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}
