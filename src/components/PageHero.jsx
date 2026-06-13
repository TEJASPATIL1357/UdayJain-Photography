import React from 'react';
import { motion } from 'framer-motion';
import { getOptimizedUrl } from '../utils/imageOptimizer';

export default function PageHero({ title, subtitle, bgImage }) {
  // Use an empty string if no image is provided
  const backgroundImage = bgImage ? getOptimizedUrl(bgImage, 'hd') : '';

  return (
    <div className="sticky top-0 w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden z-0">
      {/* Background Image with Parallax/Scale Effect */}
      <motion.div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      {/* Soft Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mt-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-playfair text-white mb-6 drop-shadow-lg"
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-soft-gray font-light max-w-2xl mx-auto drop-shadow-md"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
