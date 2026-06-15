import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as Icons from 'lucide-react';

const GlowCard = ({ item, index }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Dynamic Icon rendering
  const IconComponent = Icons[item.icon] || Icons.Star;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group rounded-2xl bg-charcoal border border-white/5 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(212, 175, 55, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 border border-gold/40"
        style={{
          maskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black,
              transparent
            )
          `,
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black,
              transparent
            )
          `,
        }}
      />

      <div className="relative z-10 p-8 flex flex-col items-center text-center h-full gap-4 transition-transform duration-500 group-hover:-translate-y-2">
        <div className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center text-gold mb-2 shadow-inner group-hover:border-gold/50 transition-colors">
          <IconComponent size={28} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-playfair text-white">{item.title}</h3>
        <p className="text-soft-gray font-light text-sm leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
};

export default function WhyChooseUs({ data }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  if (!data || data.length === 0) return null;

  return (
    <section className="w-full bg-black-main py-24 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold tracking-[0.3em] text-sm uppercase mb-4"
          >
            The UdayJain Standard
          </motion.h4>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-playfair text-white mb-6"
          >
            Why Choose Us
          </motion.h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item, index) => (
            <GlowCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
