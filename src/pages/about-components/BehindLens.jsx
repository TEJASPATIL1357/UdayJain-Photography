import React from 'react';
import { motion } from 'framer-motion';

export default function BehindLens({ name, bio }) {
  return (
    <section className="w-full bg-black-main py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          {/* Signature or abstract representation */}
          <div className="text-6xl md:text-8xl font-playfair italic text-white/5 opacity-50 absolute left-1/2 -translate-x-1/2 -top-10 pointer-events-none whitespace-nowrap">
            {name || "The Artist"}
          </div>
        </motion.div>

        <motion.h4 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-gold tracking-[0.3em] text-sm uppercase mb-4"
        >
          Meet The Artist Behind The Camera
        </motion.h4>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-playfair text-white mb-8"
        >
          {name || "Uday Jain"}
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="w-24 h-[1px] bg-gold mx-auto mb-10"
        ></motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-xl md:text-2xl text-soft-gray font-light font-playfair leading-relaxed max-w-3xl mx-auto italic"
        >
          "{bio || "A passionate visual storyteller dedicated to capturing the raw emotion and timeless beauty of your most cherished moments."}"
        </motion.p>
      </div>
    </section>
  );
}
