import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../firebase/config';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { getOptimizedUrl } from '../../utils/imageOptimizer';

export default function AboutHero({ title, subtitle }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const fetched = [];
        const seen = new Set();
        snap.forEach(d => {
          const data = d.data();
          const cat = data.category?.toLowerCase() || '';
          const url = data.url || data.thumbUrl;
          if (cat !== 'indoor photoshoot' && cat !== 'photo frames desgin' && !cat.includes('indoor') && !cat.includes('frame')) {
            if (url && !seen.has(url)) {
              seen.add(url);
              fetched.push(data);
            }
          }
        });
        // Shuffle the array
        for (let i = fetched.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [fetched[i], fetched[j]] = [fetched[j], fetched[i]];
        }
        setImages(fetched.slice(0, 15));
      } catch (err) {
        console.error("Could not fetch hero images", err);
      }
    };
    fetchImages();
  }, []);

  // Prepare infinite strips
  const strip = images.length > 0 ? [...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images] : [];
  const row1 = strip;
  const row2 = [...strip].reverse();
  const row3 = [...strip.slice(4), ...strip.slice(0, 4)];

  return (
    <section className="relative w-full h-screen bg-[#050505] overflow-hidden flex items-center justify-center perspective-[2000px]">
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.8)_100%)] pointer-events-none"></div>
      <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#050505]/80 to-transparent z-20 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#050505]/80 to-transparent z-20 pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black-main to-transparent z-20 pointer-events-none"></div>

      {/* 3D Scrolling Background */}
      {images.length > 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-70 pointer-events-none">
          <div 
            className="w-[250vw] h-[250vh] flex flex-col gap-6 justify-center items-center"
            style={{
              transform: 'rotateX(30deg) rotateZ(-15deg) scale(1.2)',
              transformOrigin: 'center center'
            }}
          >
            <div className="flex gap-6 animate-scroll-left-slow">
              {row1.map((img, i) => (
                <img key={`r1-${i}`} src={getOptimizedUrl(img.url || img.thumbUrl, 'medium')} alt="hero" className="w-80 md:w-96 h-56 md:h-64 object-cover rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10" />
              ))}
            </div>
            <div className="flex gap-6 animate-scroll-right-slow" style={{ animationDuration: '110s' }}>
              {row2.map((img, i) => (
                <img key={`r2-${i}`} src={getOptimizedUrl(img.url || img.thumbUrl, 'medium')} alt="hero" className="w-80 md:w-96 h-56 md:h-64 object-cover rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10" />
              ))}
            </div>
            <div className="flex gap-6 animate-scroll-left-slow" style={{ animationDuration: '130s' }}>
              {row3.map((img, i) => (
                <img key={`r3-${i}`} src={getOptimizedUrl(img.url || img.thumbUrl, 'medium')} alt="hero" className="w-80 md:w-96 h-56 md:h-64 object-cover rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Foreground Hero Content */}
      <div className="relative z-30 text-center px-6 max-w-4xl mx-auto flex flex-col items-center drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/50">Scroll Down</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>

      <style>{`
        @keyframes scrollLeftSlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRightSlow {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left-slow {
          animation: scrollLeftSlow 120s linear infinite;
          width: max-content;
        }
        .animate-scroll-right-slow {
          animation: scrollRightSlow 120s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  );
}
