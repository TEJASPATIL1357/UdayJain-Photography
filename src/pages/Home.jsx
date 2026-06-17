import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { db } from '../firebase/config';
import { doc, getDoc, collection, query, orderBy, limit, getDocs, setDoc, updateDoc, increment } from 'firebase/firestore';
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
  
  // About preview state
  const [aboutData, setAboutData] = useState(null);
  const [aboutImages, setAboutImages] = useState([]);
  const [currentAboutSlide, setCurrentAboutSlide] = useState(0);
  
  // Visitor count state
  const [visitorCount, setVisitorCount] = useState(0);

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

    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'settings', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAboutData(docSnap.data());
        }

        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const imgs = [];
        const seenUrls = new Set();
        snap.forEach(d => {
          const data = d.data();
          const cat = data.category?.toLowerCase() || '';
          const url = data.url || data.thumbUrl;
          if (cat !== 'indoor photoshoot' && cat !== 'photo frames desgin' && !cat.includes('indoor') && !cat.includes('frame')) {
            if (url && !seenUrls.has(url)) {
              seenUrls.add(url);
              imgs.push(url);
            }
          }
        });
        // Shuffle the imgs array
        for (let i = imgs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
        }
        setAboutImages(imgs.slice(0, 5));
      } catch (error) {
        console.error("Error fetching about preview:", error);
      }
    };

    const updateAndFetchVisitorCount = async () => {
      try {
        const visitorRef = doc(db, 'analytics', 'visitors');
        const docSnap = await getDoc(visitorRef);
        if (!docSnap.exists()) {
           await setDoc(visitorRef, { count: 1 });
           setVisitorCount(1);
        } else {
           await updateDoc(visitorRef, { count: increment(1) });
           const newSnap = await getDoc(visitorRef);
           setVisitorCount(newSnap.data().count);
        }
      } catch (e) {
        console.error("Error updating visitors:", e);
      }
    };

    fetchHeroData();
    fetchAboutData();
    updateAndFetchVisitorCount();
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

  // Auto-advance about preview
  useEffect(() => {
    if (aboutImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentAboutSlide((prev) => (prev + 1) % aboutImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [aboutImages.length]);

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

        {/* Creative Visitor Counter */}
        {visitorCount > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 right-8 z-30 flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-5 py-3 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.15)]"
          >
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-playfair text-lg leading-none">{visitorCount.toLocaleString()}</span>
              <span className="text-gold text-[10px] uppercase tracking-widest leading-none mt-1">Total Visitors</span>
            </div>
          </motion.div>
        )}
      </section>
      
      {/* About Preview Section */}
      {aboutData && (
        <section className="w-full bg-black-main py-24 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              {/* Left: About Text */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <motion.h4 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-gold tracking-[0.3em] text-sm uppercase mb-4"
                >
                  Our Story
                </motion.h4>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-playfair text-white mb-8 leading-snug"
                >
                  {aboutData.aboutTitle || "Every Picture Tells a Story"}
                </motion.h2>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-soft-gray font-light font-inter leading-relaxed text-lg mb-8 line-clamp-4 whitespace-pre-line"
                >
                  {aboutData.aboutStory || "Capturing emotions, memories, and moments that last forever."}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <Link to="/about" className="inline-flex items-center gap-2 text-gold uppercase tracking-widest text-sm font-semibold hover:text-white transition-colors group">
                    Read Full Story <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>

              {/* Right: Creative Slideshow */}
              <div className="w-full lg:w-1/2 h-[350px] md:h-[500px] relative mt-10 lg:mt-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold/10 blur-[100px] rounded-full pointer-events-none"></div>
                
                {aboutImages.length > 0 ? (
                  <div className="w-full h-full relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentAboutSlide}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        src={getOptimizedUrl(aboutImages[currentAboutSlide], 'medium')}
                        alt="Gallery preview"
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    </AnimatePresence>
                  </div>
                ) : (
                   <div className="w-full h-full bg-charcoal rounded-2xl border border-white/10"></div>
                )}
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 w-24 h-24 md:w-32 md:h-32 border-b-2 border-l-2 border-gold/30 rounded-bl-3xl"></div>
                <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-24 h-24 md:w-32 md:h-32 border-t-2 border-r-2 border-gold/30 rounded-tr-3xl"></div>
              </div>

            </div>
          </div>
        </section>
      )}

    </div>
  );
}
