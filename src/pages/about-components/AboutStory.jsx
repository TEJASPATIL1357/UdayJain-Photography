import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function AboutStory({ storyText, images }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="w-full bg-black-main py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div ref={ref} className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Premium Glassmorphism Image Composition */}
          <div className="w-full lg:w-1/2 relative h-[350px] md:h-[500px] flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold/20 blur-[100px] rounded-full pointer-events-none"></div>

            {/* Main Image */}
            <motion.div 
              initial={{ opacity: 0, x: -50, rotate: -5 }}
              animate={inView ? { opacity: 1, x: 0, rotate: 0 } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative z-10 w-[90%] md:w-4/5 h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <img 
                src={images[0] || '/placeholder.jpg'} 
                alt="Studio Setup" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
            </motion.div>

            {/* Floating Glass Card (Optional secondary image) */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="absolute -bottom-6 right-2 w-[55%] h-[150px] md:-bottom-10 md:right-0 md:w-1/2 md:h-[250px] bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-2 z-20 shadow-2xl"
            >
              <img 
                src={images[1] || '/placeholder.jpg'} 
                alt="Photography Action" 
                className="w-full h-full object-cover rounded-xl" 
              />
            </motion.div>
          </div>

          {/* Right: Story Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.h4 
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-gold tracking-[0.3em] text-sm uppercase mb-4"
            >
              Our Journey
            </motion.h4>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-playfair text-white mb-8 leading-snug"
            >
              We transform fleeting moments into timeless art.
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-soft-gray font-light font-inter leading-relaxed text-lg whitespace-pre-line"
            >
              {storyText}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
