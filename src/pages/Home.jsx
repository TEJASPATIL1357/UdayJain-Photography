import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { getOptimizedUrl } from '../utils/imageOptimizer';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderImages, setSliderImages] = useState([]);
  const displaySlides = sliderImages;
  const [heroData, setHeroData] = useState({
    headline: 'Capturing Timeless Moments',
    subheadline: 'UdayJain Photography is a cinematic luxury photography studio specializing in weddings, portraits, and timeless visual storytelling.',
    buttonText: 'View Portfolio'
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, 'settings', 'hero');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHeroData(prev => ({ ...prev, ...docSnap.data() }));
        }

        const bgDocRef = doc(db, 'settings', 'backgrounds');
        const bgDocSnap = await getDoc(bgDocRef);
        if (bgDocSnap.exists()) {
          const bgData = bgDocSnap.data();
          if (bgData.homeSlider && bgData.homeSlider.length > 0) {
            const enabledSlides = bgData.homeSlider.filter(slide => slide.enabled);
            if (enabledSlides.length > 0) {
              setSliderImages(enabledSlides);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHeroData();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (displaySlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displaySlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);

  return (
    <div className="w-full min-h-screen bg-black-main relative overflow-hidden">
      <Helmet>
        <title>UdayJain Photography | Premium Luxury Photography Studio</title>
        <meta name="description" content="UdayJain Photography is a cinematic luxury photography studio specializing in weddings, portraits, and timeless visual storytelling." />
        <meta property="og:title" content="UdayJain Photography | Premium Luxury Photography Studio" />
        <meta property="og:description" content="Cinematic luxury photography studio specializing in weddings, portraits, and timeless visual storytelling." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative h-screen w-full bg-black-main">
        {displaySlides.length > 0 ? (
          <>
            {/* Slideshow */}
            {displaySlides.map((slide, index) => (
              <div 
                key={slide.id || index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <div 
                  className={`w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? 'scale-110' : 'scale-100'}`}
                  style={{ backgroundImage: `url(${getOptimizedUrl(slide.url || slide.image, 'hd')})` }}
                ></div>
                {/* Cinematic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black-main via-black-main/40 to-black-main/20"></div>
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            ))}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black-main">
             <p className="text-soft-gray font-light tracking-widest uppercase text-sm">Please configure hero images in Admin Dashboard</p>
          </div>
        )}

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center z-10 max-w-4xl px-6"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair text-white mb-6 drop-shadow-2xl">
                {heroData.headline}
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-light mb-10 max-w-2xl mx-auto drop-shadow-md">
                {heroData.subheadline}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
                <Link to="/gallery">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-full bg-gold text-[#050505] font-inter font-bold text-sm tracking-widest uppercase shadow-xl shadow-gold/20 flex items-center gap-2 group"
                  >
                    {heroData.buttonText}
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                
                <Link to="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-full border border-white/30 text-white font-inter font-bold text-sm tracking-widest uppercase hover:bg-white/10 backdrop-blur-md transition-all"
                  >
                    Contact Us
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Navigation & Indicators (only if slides exist) */}
        {displaySlides.length > 0 && (
          <div className="absolute bottom-12 left-0 right-0 z-20 flex flex-col items-center gap-6">
            <div className="flex gap-4">
              <button onClick={prevSlide} className="p-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors"><ChevronLeft size={20} /></button>
              <button onClick={nextSlide} className="p-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors"><ChevronRight size={20} /></button>
            </div>
            <div className="flex gap-3">
              {displaySlides.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1 transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-gold' : 'w-4 bg-white/30 hover:bg-white/50'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>
      
      {/* Spacer for next sections */}
      <section className="h-screen bg-black-main flex items-center justify-center">
        <h2 className="text-4xl text-white font-playfair">About Section Coming Soon</h2>
      </section>

    </div>
  );
}
