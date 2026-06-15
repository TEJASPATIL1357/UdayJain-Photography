import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CalendarDays, Camera, Edit3, Image as ImageIcon } from 'lucide-react';

const steps = [
  { title: "Consultation", desc: "Understanding your vision and requirements.", icon: MessageCircle },
  { title: "Planning", desc: "Crafting the perfect timeline and shot list.", icon: CalendarDays },
  { title: "Photoshoot", desc: "Capturing the magic as it unfolds.", icon: Camera },
  { title: "Editing", desc: "Cinematic color grading and retouching.", icon: Edit3 },
  { title: "Delivery", desc: "Handing over your timeless memories.", icon: ImageIcon },
];

export default function Timeline() {
  return (
    <section className="w-full bg-[#0a0a0a] py-24 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-20">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold tracking-[0.3em] text-sm uppercase mb-4"
          >
            The Process
          </motion.h4>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-playfair text-white"
          >
            Client Experience Timeline
          </motion.h2>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent md:block hidden"></div>

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} className="relative flex flex-col md:flex-row items-center md:h-32">
                  
                  {/* Left Content (or empty) */}
                  <div className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-end md:pr-16' : 'md:justify-start md:pl-16 order-2 md:order-1'} text-center md:text-left`}>
                    <motion.div 
                      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`bg-charcoal border border-white/5 p-6 rounded-2xl shadow-xl w-full max-w-sm ${isEven ? 'ml-auto' : ''}`}
                    >
                      <h3 className="text-xl font-playfair text-gold mb-2">{step.title}</h3>
                      <p className="text-sm text-soft-gray font-light">{step.desc}</p>
                    </motion.div>
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-black border-2 border-gold flex items-center justify-center z-10 shadow-[0_0_15px_rgba(212,175,55,0.3)] my-4 md:my-0 order-1 md:order-2">
                    <Icon size={20} className="text-gold" />
                  </div>

                  {/* Right Content (or empty) */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'order-3' : 'order-1'} hidden md:block`}></div>
                  
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
