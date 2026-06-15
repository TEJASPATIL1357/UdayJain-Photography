import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../firebase/config';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { getOptimizedUrl } from '../../utils/imageOptimizer';

export default function AboutShowcase() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(15));
        const snap = await getDocs(q);
        const fetched = [];
        snap.forEach(d => fetched.push(d.data()));
        setImages(fetched);
      } catch (err) {
        console.error("Could not fetch showcase images", err);
      }
    };
    fetchImages();
  }, []);

  if (images.length === 0) return null;

  // Duplicate images to create a long seamless strip
  const strip = [...images, ...images, ...images, ...images, ...images, ...images, ...images];
  const row1 = strip;
  const row2 = [...strip].reverse();
  const row3 = [...strip.slice(4), ...strip.slice(0, 4)];

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#050505] flex flex-col justify-center items-center py-32 perspective-[2000px]">
      
      {/* Vignettes for smooth blending */}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,1)_80%)] pointer-events-none"></div>
      <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none"></div>
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black-main to-transparent z-20 pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black-main to-transparent z-20 pointer-events-none"></div>

      {/* Foreground Title overlaying the 3D gallery */}
      <div className="relative z-30 text-center px-4 mix-blend-difference pointer-events-none drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-playfair text-white mb-6"
        >
          A Legacy of <span className="text-gold italic drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">Moments</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-white/80 tracking-[0.4em] uppercase text-xs md:text-sm"
        >
          Immerse yourself in our endless canvas
        </motion.p>
      </div>

      {/* 3D Scrolling Background container */}
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden opacity-60 pointer-events-none">
        <div 
          className="w-[250vw] h-[250vh] flex flex-col gap-6 justify-center items-center"
          style={{
            transform: 'rotateX(30deg) rotateZ(-15deg) scale(1.2)',
            transformOrigin: 'center center'
          }}
        >
          <div className="flex gap-6 animate-scroll-left hover:[animation-play-state:paused]">
            {row1.map((img, i) => (
              <img key={`r1-${i}`} src={getOptimizedUrl(img.url || img.thumbUrl, 'medium')} alt="showcase" className="w-80 md:w-96 h-56 md:h-64 object-cover rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10" />
            ))}
          </div>
          <div className="flex gap-6 animate-scroll-right hover:[animation-play-state:paused]" style={{ animationDuration: '45s' }}>
            {row2.map((img, i) => (
              <img key={`r2-${i}`} src={getOptimizedUrl(img.url || img.thumbUrl, 'medium')} alt="showcase" className="w-80 md:w-96 h-56 md:h-64 object-cover rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10" />
            ))}
          </div>
          <div className="flex gap-6 animate-scroll-left hover:[animation-play-state:paused]" style={{ animationDuration: '55s' }}>
            {row3.map((img, i) => (
              <img key={`r3-${i}`} src={getOptimizedUrl(img.url || img.thumbUrl, 'medium')} alt="showcase" className="w-80 md:w-96 h-56 md:h-64 object-cover rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10" />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scrollLeft 50s linear infinite;
          width: max-content;
        }
        .animate-scroll-right {
          animation: scrollRight 50s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  );
}
