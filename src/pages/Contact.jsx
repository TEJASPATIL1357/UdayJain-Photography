import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import PageHero from '../components/PageHero';

export default function Contact() {
  const contactInfo = [
    { icon: MapPin, title: 'Studio Address', details: 'Datta Wadi, Chalisgaon, 424101' },
    { icon: Phone, title: 'Phone & WhatsApp', details: '+91 7774803320' },
    { icon: Mail, title: 'Email Address', details: 'hello@udayjainphotography.com' },
    { icon: Clock, title: 'Studio Hours', details: 'Mon - Sun: 10:00 AM - 8:00 PM' }
  ];

  const [heroData, setHeroData] = useState({
    bg: '',
    title: 'Let\'s Create Together',
    subtitle: 'We would love to hear about your special day. Reach out to us to schedule a meeting or discuss your photography needs.'
  });

  useEffect(() => {
    const fetchBg = async () => {
      try {
        const docRef = doc(db, 'settings', 'backgrounds');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHeroData({
            bg: data.contactBg || '',
            title: data.contactTitle || 'Let\'s Create Together',
            subtitle: data.contactSubtitle || 'We would love to hear about your special day. Reach out to us to schedule a meeting or discuss your photography needs.'
          });
        }
      } catch (error) {
        console.error("Error fetching background:", error);
      }
    };
    fetchBg();
  }, []);

  return (
    <div className="w-full min-h-screen bg-black-main pb-24">
      <PageHero 
        title={heroData.title} 
        subtitle={heroData.subtitle} 
        bgImage={heroData.bg} 
      />
      <div className="container mx-auto px-6 max-w-7xl pt-24">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold tracking-[0.3em] text-sm uppercase mb-4"
          >
            Get In Touch
          </motion.h4>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Form & Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex flex-col gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gold">
                      <Icon size={20} />
                    </div>
                    <h4 className="text-white font-playfair text-lg">{info.title}</h4>
                    <p className="text-soft-gray text-sm font-light">{info.details}</p>
                  </div>
                )
              })}
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-white/5 border border-white/10 p-4 text-white font-light focus:outline-none focus:border-gold transition-colors"
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-white/5 border border-white/10 p-4 text-white font-light focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <input 
                type="text" 
                placeholder="Subject / Event Type" 
                className="w-full bg-white/5 border border-white/10 p-4 text-white font-light focus:outline-none focus:border-gold transition-colors"
              />
              <textarea 
                rows="5"
                placeholder="Tell us about your requirements..." 
                className="w-full bg-white/5 border border-white/10 p-4 text-white font-light focus:outline-none focus:border-gold transition-colors resize-none"
              ></textarea>
              <button 
                type="submit"
                className="w-full md:w-auto px-10 py-4 bg-gold text-black-main font-inter text-sm tracking-widest uppercase hover:bg-white transition-colors"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Map Embed */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full h-[400px] lg:h-full min-h-[400px] bg-white/5 relative border border-white/10"
          >
            {/* Dummy Map Placeholder */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3744.1504996962283!2d75.0026381!3d20.4609842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdc6d2c4b8b6f3b%3A0xc6c78ec5845bcaf9!2sDatta%20Wadi%2C%20Chalisgaon%2C%20Maharashtra%20424101!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              className="absolute inset-0 w-full h-full grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
