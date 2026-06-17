import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { db } from '../firebase/config';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import PageHero from '../components/PageHero';
import DomeGallery from '../components/DomeGallery/DomeGallery';
import { getOptimizedUrl } from '../utils/imageOptimizer';

const pricingPackages = [
  {
    id: 1,
    category: 'Pre Wedding',
    price: 'Custom Quote',
    title: 'Cinematic Pre-Wedding',
    features: ['1 Day Shoot', 'Cinematic Teaser', '50 Edited Photos', '2 Locations', 'Drone Photography'],
    featured: false
  },
  {
    id: 2,
    category: 'Wedding',
    price: 'Tailored Package',
    title: 'Luxury Wedding Package',
    features: ['3 Days Coverage', 'Traditional + Candid', 'Cinematic Wedding Film', 'Premium Album', 'Pre-Wedding Included'],
    featured: true
  },
  {
    id: 3,
    category: 'Baby Shoot',
    price: 'Upon Request',
    title: 'Memorable Baby Shoot',
    features: ['3 Hour Studio Session', '3 Costume Changes', '20 Edited Photos', 'Props Provided', 'Digital Delivery'],
    featured: false
  }
];

export default function Budget() {
  const whatsappNumber = "919999999999";
  const [heroData, setHeroData] = useState({
    bg: '',
    title: 'Pricing & Packages',
    subtitle: 'Transparent pricing for premium quality. Contact us for custom tailored packages that suit your specific requirements.'
  });
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    const fetchBg = async () => {
      try {
        const docRef = doc(db, 'settings', 'backgrounds');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHeroData({
            bg: data.budgetBg || '',
            title: data.budgetTitle || 'Pricing & Packages',
            subtitle: data.budgetSubtitle || 'Transparent pricing for premium quality. Contact us for custom tailored packages that suit your specific requirements.'
          });
        }
      } catch (error) {
        console.error("Error fetching background:", error);
      }
    };
    fetchBg();

    const fetchGallery = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const images = [];
        const seen = new Set();
        snapshot.forEach((doc) => {
          const data = doc.data();
          const cat = data.category?.toLowerCase() || '';
          const url = data.url || data.thumbUrl;
          if (cat !== 'indoor photoshoot' && cat !== 'photo frames desgin' && !cat.includes('indoor') && !cat.includes('frame')) {
            if (url && !seen.has(url)) {
              seen.add(url);
              images.push(data);
            }
          }
        });
        
        // Shuffle for DomeGallery
        for (let i = images.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [images[i], images[j]] = [images[j], images[i]];
        }
        
        setGalleryImages(images.slice(0, 35));
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };
    fetchGallery();
  }, []);

  const handleWhatsApp = (pkgTitle) => {
    const msg = encodeURIComponent(`Hello UdayJain Photography, I would like to get a custom quote for the ${pkgTitle}.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
  };

  return (
    <div className="w-full min-h-screen pb-24 relative">
      <PageHero 
        title={heroData.title} 
        subtitle={heroData.subtitle} 
        bgImage={heroData.bg} 
      />
      <div className="relative z-10 bg-black-main backdrop-blur-3xl rounded-t-[40px] pt-24 -mt-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/10 min-h-screen">
        <div className="container mx-auto px-6 max-w-7xl">
        
        {galleryImages.length > 0 && (
          <div className="mb-32">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h4 className="text-gold tracking-[0.3em] text-sm uppercase mb-4">
                Explore Our World
              </h4>
              <p className="text-soft-gray font-light">
                Immerse yourself in a 3D gallery of our favorite captures.
              </p>
            </div>
            <div className="w-full relative">
              {/* Desktop: Immersive 3D Dome */}
              <div className="hidden md:block w-full h-[700px] rounded-3xl overflow-hidden bg-[#121212] border border-white/10 shadow-2xl">
                <DomeGallery 
                  images={galleryImages.map(img => ({
                    src: getOptimizedUrl(img.url || img.thumbUrl, 'hd'),
                    alt: img.title || img.category || 'Gallery Image'
                  }))} 
                />
              </div>

              {/* Mobile: Lightweight Swipeable Carousel */}
              <div className="md:hidden w-full flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 hide-scrollbar">
                {galleryImages.map((img, i) => (
                  <div key={i} className="min-w-[85vw] h-[400px] snap-center rounded-2xl overflow-hidden bg-[#121212] flex-shrink-0 shadow-lg">
                    <img 
                      src={getOptimizedUrl(img.url || img.thumbUrl, 'medium')} 
                      alt={img.title || img.category || 'Gallery Image'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold tracking-[0.3em] text-sm uppercase mb-4"
          >
            Investment
          </motion.h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {pricingPackages.map((pkg, index) => (
            <motion.div 
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative flex flex-col p-8 rounded-[32px] backdrop-blur-md border ${
                pkg.featured 
                  ? 'bg-[#121212] border-gold shadow-2xl shadow-gold/10 transform md:-translate-y-4' 
                  : 'bg-white/5 border-white/10'
              }`}
            >
              {pkg.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-black-main text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-8">
                <span className="text-soft-gray uppercase tracking-widest text-xs mb-2 block">{pkg.category}</span>
                <h3 className="text-2xl font-playfair text-white mb-4">{pkg.title}</h3>
                <div className="text-3xl md:text-2xl font-light text-gold mb-2">
                  {pkg.price}
                </div>
                <span className="text-xs text-soft-gray mt-2 block tracking-widest">Price details to be discussed post-consultation</span>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-soft-gray font-light text-sm">
                    <Check size={16} className="text-gold shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleWhatsApp(pkg.title)}
                className={`w-full py-4 text-sm font-inter font-bold tracking-widest uppercase transition-all rounded-full ${
                  pkg.featured 
                    ? 'bg-gold text-black-main hover:bg-white' 
                    : 'bg-white/10 text-white hover:bg-gold hover:text-black-main'
                }`}
              >
                Get Custom Quote
              </button>
            </motion.div>
          ))}
        </div>

        </div>
      </div>
    </div>
  );
}
