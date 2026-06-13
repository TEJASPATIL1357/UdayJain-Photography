import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { db } from '../firebase/config';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import PageHero from '../components/PageHero';

const Counter = ({ target, duration = 2, suffix = '' }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTime;
    let animationFrame;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      setCount(Math.floor(target * percentage));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    if (inView) {
      animationFrame = requestAnimationFrame(updateCount);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, inView]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <span className="text-4xl md:text-5xl font-playfair text-gold mb-2">
        {count}{suffix}
      </span>
      <span className="text-sm font-inter text-soft-gray uppercase tracking-widest text-center">
        {/* We'll pass the label as a sibling, but if we wanted to we could pass it as a prop. 
            For now, we'll just render the number here. */}
      </span>
    </div>
  );
};

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [heroData, setHeroData] = useState({
    bg: '',
    title: 'Our Story',
    subtitle: 'Capturing the essence of your most precious moments.'
  });
  const [aboutImage, setAboutImage] = useState(null);

  useEffect(() => {
    const fetchBg = async () => {
      try {
        const docRef = doc(db, 'settings', 'backgrounds');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHeroData({
            bg: data.aboutBg || '',
            title: data.aboutTitle || 'Our Story',
            subtitle: data.aboutSubtitle || 'Capturing the essence of your most precious moments.'
          });
        }
      } catch (error) {
        console.error("Error fetching background:", error);
      }
    };
    fetchBg();

    const fetchAboutImage = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          setAboutImage(docSnap.data().url || docSnap.data().thumbUrl);
        }
      } catch (error) {
        console.error("Error fetching about image:", error);
      }
    };
    fetchAboutImage();
  }, []);

  const stats = [
    { label: 'Weddings Covered', target: 150, suffix: '+' },
    { label: 'Happy Clients', target: 500, suffix: '+' },
    { label: 'Photos Delivered', target: 100, suffix: 'k+' },
    { label: 'Years Experience', target: 8, suffix: '+' },
  ];

  return (
    <div className="w-full min-h-screen pb-24 relative">
      <PageHero 
        title={heroData.title} 
        subtitle={heroData.subtitle} 
        bgImage={heroData.bg} 
      />
      
      <div className="relative z-10 bg-black-main backdrop-blur-3xl rounded-t-[40px] pt-24 -mt-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/10 min-h-screen">
        <div className="container mx-auto px-6 max-w-7xl">
        
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="flex flex-col lg:flex-row gap-16 items-center"
        >
          {/* Left: Image */}
          <div className="w-full lg:w-1/2 relative group">
            {aboutImage ? (
              <>
                <div className="absolute inset-0 bg-gold/20 translate-x-4 translate-y-4 -z-10 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"></div>
                <div className="overflow-hidden bg-black-main">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7 }}
                    src={aboutImage} 
                    alt="UdayJain Studio Camera" 
                    className="w-full h-auto object-cover opacity-90"
                  />
                </div>
              </>
            ) : (
              <div className="w-full h-[400px] border border-white/10 flex items-center justify-center text-soft-gray font-light text-sm uppercase tracking-widest">
                Upload Gallery Images
              </div>
            )}
          </div>

          {/* Right: Story */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.h4 
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gold tracking-[0.3em] text-sm uppercase mb-4"
            >
              Our Story
            </motion.h4>
            
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl font-playfair text-white mb-8 leading-tight"
            >
              Capturing the essence of your most precious moments.
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-6 text-soft-gray font-inter font-light leading-relaxed text-lg"
            >
              <p>
                Founded on the belief that every photograph is a piece of art, UdayJain Photography represents the pinnacle of luxury visual storytelling. We specialize in transforming fleeting emotions into timeless, cinematic masterpieces.
              </p>
              <p>
                With a deep-rooted passion for elegance and an uncompromising eye for detail, our studio bridges the gap between classic portraiture and modern, emotive journalism. 
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-16">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <Counter target={stat.target} suffix={stat.suffix} />
              <span className="text-sm font-inter text-soft-gray uppercase tracking-widest text-center mt-4">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        </div>
      </div>
    </div>
  );
}
