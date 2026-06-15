import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { getOptimizedUrl } from '../../utils/imageOptimizer';

export default function Specialties() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        
        // Extract unique categories and their latest image
        const catMap = new Map();
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.category && !catMap.has(data.category.toLowerCase())) {
            catMap.set(data.category.toLowerCase(), {
              title: data.category,
              image: data.url || data.thumbUrl
            });
          }
        });
        
        setCategories(Array.from(catMap.values()).slice(0, 6)); // Top 6 specialties
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };
    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="w-full bg-[#0a0a0a] py-24 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <motion.h4 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold tracking-[0.3em] text-sm uppercase mb-4"
            >
              Our Expertise
            </motion.h4>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-playfair text-white"
            >
              Specialties
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/services" className="text-sm font-inter uppercase tracking-widest text-white hover:text-gold transition-colors flex items-center gap-2">
              View All Services <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
            >
              <img 
                src={getOptimizedUrl(cat.image, 'medium')} 
                alt={cat.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-playfair text-white mb-3">{cat.title}</h3>
                <div className="w-12 h-[1px] bg-gold mb-4 group-hover:w-24 transition-all duration-500"></div>
                <Link to={`/gallery`} className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-xs uppercase tracking-widest text-white flex items-center gap-2">
                  Explore <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
