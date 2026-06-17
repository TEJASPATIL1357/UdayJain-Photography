import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase/config';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import PageHero from '../components/PageHero';
import { getOptimizedUrl } from '../utils/imageOptimizer';
import { Folder, ArrowLeft } from 'lucide-react';

export default function Gallery() {
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [liveImages, setLiveImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState({
    bg: '',
    title: 'Our Masterpieces',
    subtitle: 'A curated collection of our finest captures. Select an album below to explore.'
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
            subtitle: data.gallerySubtitle || 'A curated collection of our finest captures. Select an album below to explore.'
          });
        }
      } catch (error) {
        console.error("Error fetching background:", error);
      }
    };
    fetchBg();
  }, []);

  // Compute dynamic albums
  const albums = useMemo(() => {
    const map = new Map();
    liveImages.forEach(img => {
      const cat = img.category || 'Uncategorized';
      if (!map.has(cat)) {
        map.set(cat, {
          title: cat,
          allImages: [img.url || img.thumbUrl || img.src],
          count: 1
        });
      } else {
        const entry = map.get(cat);
        entry.count += 1;
        entry.allImages.push(img.url || img.thumbUrl || img.src);
      }
    });

    // Pick a random cover for each album
    return Array.from(map.values()).map(album => {
      const randIdx = Math.floor(Math.random() * album.allImages.length);
      album.coverImage = album.allImages[randIdx];
      return album;
    });
  }, [liveImages]);

  const filteredImages = activeAlbum 
    ? liveImages.filter(img => (img.category || 'Uncategorized') === activeAlbum)
    : [];

  return (
    <div className="w-full min-h-screen pb-24 relative">
      <PageHero 
        title={heroData.title} 
        subtitle={heroData.subtitle} 
        bgImage={heroData.bg} 
      />
      
      <div className="relative z-10 bg-black-main backdrop-blur-3xl rounded-t-[40px] pt-24 -mt-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/10 min-h-screen">
        <div className="container mx-auto px-6 max-w-7xl">
        
        <AnimatePresence mode="wait">
          {!activeAlbum ? (
            /* ALBUMS VIEW */
            <motion.div 
              key="albums-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {albums.length > 0 ? albums.map((album, idx) => (
                <motion.div 
                  key={album.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  onClick={() => setActiveAlbum(album.title)}
                  className="relative group cursor-pointer aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-[#121212] border border-white/5 hover:border-gold/30 transition-colors"
                >
                  <img 
                    src={getOptimizedUrl(album.coverImage, 'medium')} 
                    alt={album.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Glassmorphism gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <h3 className="text-3xl font-playfair text-white mb-2 group-hover:text-gold transition-colors">{album.title}</h3>
                      <div className="flex items-center gap-2">
                        <div className="h-[1px] w-8 bg-gold transition-all duration-500 group-hover:w-12"></div>
                        <p className="text-soft-gray text-xs font-inter tracking-widest uppercase">{album.count} Photos</p>
                      </div>
                    </div>
                  </div>

                  {/* Folder Icon Overlay */}
                  <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-90 group-hover:scale-100">
                    <Folder size={20} className="text-white" />
                  </div>
                </motion.div>
              )) : !loading && (
                <div className="col-span-full py-32 text-center text-soft-gray font-light text-xl">
                  No albums created yet. Upload photos from the Admin panel to get started!
                </div>
              )}
            </motion.div>
          ) : (
            /* GRID VIEW INSIDE AN ALBUM */
            <motion.div 
              key="grid-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                <div>
                  <motion.h4 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-gold tracking-[0.3em] text-sm uppercase mb-2"
                  >
                    Album
                  </motion.h4>
                  <h3 className="text-4xl md:text-5xl font-playfair text-white">{activeAlbum}</h3>
                </div>
                
                <button 
                  onClick={() => setActiveAlbum(null)}
                  className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 text-xs font-bold tracking-widest uppercase text-white hover:bg-white hover:text-black transition-all group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                  Back to Albums
                </button>
              </div>
              
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {filteredImages.map((img, idx) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    key={img.id}
                    className="relative overflow-hidden group rounded-xl cursor-pointer break-inside-avoid border border-white/5"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img 
                      src={getOptimizedUrl(img.url || img.thumbUrl || img.src, 'medium')} 
                      alt={img.title || img.category} 
                      className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="text-white font-inter text-xs tracking-[0.3em] uppercase border border-white/30 px-6 py-3 hover:bg-white/10 transition-colors">
                        Expand
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
