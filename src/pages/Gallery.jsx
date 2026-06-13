import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase/config';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import PageHero from '../components/PageHero';
import { getOptimizedUrl } from '../utils/imageOptimizer';

const categories = [
  'All', 'Wedding', 'Pre Wedding', 'Baby Shoot', 'Outdoor', 'Indoor', 'Fashion', 'Events'
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [liveImages, setLiveImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState({
    bg: '',
    title: 'Our Masterpieces',
    subtitle: 'A curated collection of our finest captures. Select a category below to explore.'
  });

  useEffect(() => {
    const fetchLiveGallery = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const images = [];
        snapshot.forEach((doc) => {
          images.push({ id: doc.id, ...doc.data() });
        });
        setLiveImages(images);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveGallery();

    const fetchBg = async () => {
      try {
        const docRef = doc(db, 'settings', 'backgrounds');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHeroData({
            bg: data.galleryBg || '',
            title: data.galleryTitle || 'Our Masterpieces',
            subtitle: data.gallerySubtitle || 'A curated collection of our finest captures. Select a category below to explore.'
          });
        }
      } catch (error) {
        console.error("Error fetching background:", error);
      }
    };
    fetchBg();
  }, []);

  const filteredImages = activeCategory === 'All' 
    ? liveImages 
    : liveImages.filter(img => img.category === activeCategory);

  return (
    <div className="w-full min-h-screen pb-24 relative">
      <PageHero 
        title={heroData.title} 
        subtitle={heroData.subtitle} 
        bgImage={heroData.bg} 
      />
      
      <div className="relative z-10 bg-black-main backdrop-blur-3xl rounded-t-[40px] pt-16 -mt-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/10 min-h-screen">
        <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-inter uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-gold text-black-main font-medium' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div 
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={img.id}
                className="relative overflow-hidden group rounded-lg cursor-pointer break-inside-avoid"
                onClick={() => setSelectedImage(img)}
              >
                <img 
                  src={getOptimizedUrl(img.thumbUrl || img.url || img.src, 'medium')} 
                  alt={img.title || img.category} 
                  className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-playfair text-xl tracking-wider uppercase border border-white/30 px-6 py-3">
                    View
                  </span>
                </div>
              </motion.div>
            ))}
            {liveImages.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center text-soft-gray font-light">
                No gallery images uploaded yet.
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-12"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={getOptimizedUrl(selectedImage.url || selectedImage.src, 'hd')} 
                alt={selectedImage.title || selectedImage.category} 
                className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
                loading="lazy"
              />
              <button 
                className="absolute top-4 right-4 md:-right-12 md:-top-12 text-white/50 hover:text-white transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
