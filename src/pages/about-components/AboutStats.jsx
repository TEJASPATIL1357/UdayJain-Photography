import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Counter = ({ target, duration = 2, suffix = '' }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      setCount(Math.floor(target * percentage));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    if (inView) {
      animationFrame = requestAnimationFrame(updateCount);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, inView]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-playfair text-gold mb-2">
      {count}{suffix}
    </div>
  );
};

export default function AboutStats({ stats }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const statItems = [
    { label: 'Years Experience', target: stats.yearsExperience || 5, suffix: '+' },
    { label: 'Happy Clients', target: stats.happyClients || 500, suffix: '+' },
    { label: 'Weddings Covered', target: stats.weddingsCovered || 100, suffix: '+' },
    { label: 'Photos Delivered', target: stats.photosDelivered || 50000, suffix: '+' },
  ];

  return (
    <section className="w-full bg-black-main py-20 border-y border-white/5 relative z-10">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {statItems.map((stat, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl hover:border-gold/30 transition-colors group"
            >
              <div className="group-hover:scale-110 transition-transform duration-300">
                <Counter target={stat.target} suffix={stat.suffix} />
              </div>
              <span className="text-xs font-inter text-soft-gray uppercase tracking-widest text-center mt-2 group-hover:text-white transition-colors">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
