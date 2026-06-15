import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function AboutCTA() {
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const docRef = doc(db, 'settings', 'contact');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().whatsapp) {
          // Format number for wa.me (remove spaces, +, etc)
          const rawNum = docSnap.data().whatsapp.replace(/[^0-9]/g, '');
          setWhatsappNumber(rawNum);
        } else {
          // Fallback
          setWhatsappNumber('917774803320');
        }
      } catch (error) {
        setWhatsappNumber('917774803320');
      }
    };
    fetchContact();
  }, []);

  const waLink = `https://wa.me/${whatsappNumber}?text=Hi%20UdayJain%20Photography,%20I%20would%20like%20to%20book%20a%20shoot.`;

  return (
    <section className="w-full bg-[#111] py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      
      <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-playfair text-white mb-8"
        >
          Let's Create Memories Together
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-soft-gray font-light mb-12 max-w-2xl mx-auto"
        >
          Ready to tell your story? Reach out to us today to schedule your consultation and secure your date.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a 
            href={waLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold text-black-main font-inter font-bold text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-3"
          >
            <MessageCircle size={18} /> Book Your Shoot
          </a>
          
          <a 
            href={waLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/30 text-white font-inter font-bold text-sm tracking-widest uppercase hover:bg-white/10 backdrop-blur-md hover:border-white transition-all flex items-center justify-center gap-3"
          >
            Contact Us <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
