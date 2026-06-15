import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import PageHero from '../components/PageHero';
import { getOptimizedUrl } from '../utils/imageOptimizer';

const servicesList = [
  { id: 1, title: 'Wedding Photography', desc: 'Cinematic storytelling of your most important day.' },
  { id: 2, title: 'Pre Wedding Shoot', desc: 'Romantic and artistic captures before you say I do.' },
  { id: 3, title: 'Baby Shoot', desc: 'Adorable and gentle memories of your little ones.' },
  { id: 4, title: 'Outdoor Photoshoot', desc: 'Breathtaking portraits embracing natural light.' },
  { id: 5, title: 'Indoor Photoshoot', desc: 'Studio perfection with controlled lighting.' },
  { id: 6, title: 'Couple Shoot', desc: 'Intimate and natural chemistry captured beautifully.' },
  { id: 7, title: 'Engagement Shoot', desc: 'The moment she said yes, preserved forever.' },
  { id: 8, title: 'Fashion Photography', desc: 'Editorial style shoots for models and brands.' },
  { id: 9, title: 'Maternity Shoot', desc: 'Glowing portraits of your journey into motherhood.' },
  { id: 10, title: 'Portfolio Shoot', desc: 'Professional headshots and dynamic acting portfolios.' },
  { id: 11, title: 'Event Photography', desc: 'Comprehensive coverage of corporate and private events.' },
  { id: 12, title: 'Birthday Shoot', desc: 'Fun and vibrant captures of your special celebrations.' },
];

const SpotlightCard = ({ service }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className="relative group rounded-3xl bg-[#121212] border border-white/5 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Border Glow Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(212, 175, 55, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Glow Border overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 border border-gold/30"
        style={{
          maskImage: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              black,
              transparent
            )
          `,
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              black,
              transparent
            )
          `,
        }}
      />

      <div className="relative z-10 flex flex-col h-full bg-black-main/40 backdrop-blur-sm p-6 gap-6">
        <div className="relative w-full h-48 overflow-hidden rounded-lg bg-white/5 flex items-center justify-center">
          <motion.div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></motion.div>
          {service.img ? (
            <img 
              src={getOptimizedUrl(service.img, 'medium')} 
              alt={service.title} 
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
              loading="lazy"
            />
          ) : (
            <span className="text-soft-gray text-xs tracking-widest uppercase font-light">Image Pending</span>
          )}
        </div>
        
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-playfair text-white mb-2 group-hover:text-gold transition-colors">{service.title}</h3>
            <p className="text-soft-gray font-light text-sm line-clamp-2">{service.desc}</p>
          </div>
          
          <Link 
            to="/gallery" 
            className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 group-hover:text-white transition-colors"
          >
            View Gallery
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default function Services() {
  const [heroData, setHeroData] = useState({
    bg: '',
    title: 'Bespoke Photography Services',
    subtitle: 'From the grandeur of your wedding day to the quiet intimacy of a newborn shoot, we provide premium, cinematic photography tailored to your unique story.'
  });

  const [services, setServices] = useState(servicesList);

  useEffect(() => {
    const fetchBg = async () => {
      try {
        const docRef = doc(db, 'settings', 'backgrounds');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHeroData({
            bg: data.servicesBg || '',
            title: data.servicesTitle || 'Bespoke Photography Services',
            subtitle: data.servicesSubtitle || 'From the grandeur of your wedding day to the quiet intimacy of a newborn shoot, we provide premium, cinematic photography tailored to your unique story.'
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
        const gallery = snapshot.docs.map(doc => doc.data());
        
        if (gallery.length > 0) {
          setServices(prevServices => prevServices.map((service) => {
            const match = gallery.find(g => 
              g.category && service.title.toLowerCase().includes(g.category.toLowerCase())
            ) || gallery.find(g => 
              g.category && g.category.toLowerCase().includes(service.title.split(' ')[0].toLowerCase())
            );
            
            const imgDoc = match || gallery[Math.floor(Math.random() * gallery.length)];
            const imgUrl = imgDoc ? (imgDoc.url || imgDoc.thumbUrl) : null;
            
            return { ...service, img: imgUrl };
          }));
        }
      } catch (error) {
        console.error("Error fetching gallery for services:", error);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="w-full min-h-screen pb-24 relative">
      <PageHero 
        title={heroData.title} 
        subtitle={heroData.subtitle} 
        bgImage={heroData.bg} 
      />
      
      <div className="relative z-10 bg-black-main backdrop-blur-3xl rounded-t-[40px] pt-24 -mt-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/10 min-h-screen">
        <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold tracking-[0.3em] text-sm uppercase mb-4"
          >
            Our Expertise
          </motion.h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <SpotlightCard key={service.id} service={service} />
          ))}
        </div>

        </div>
      </div>
    </div>
  );
}
