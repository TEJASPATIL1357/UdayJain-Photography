import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Camera } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Services', path: '/services' },
  { name: 'Budget', path: '/budget' },
  { name: 'Contact', path: '/contact' },
  { name: 'Admin', path: '/admin' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarBg, setSidebarBg] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch sidebar background in real-time
    let unsubscribe = () => {};
    const setupRealtimeBg = async () => {
      try {
        const { doc, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../firebase/config');
        const { getOptimizedUrl } = await import('../utils/imageOptimizer');
        const docRef = doc(db, 'settings', 'backgrounds');
        
        unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists() && docSnap.data().sidebarBg) {
            setSidebarBg(getOptimizedUrl(docSnap.data().sidebarBg, 'hd'));
          }
        });
      } catch (error) {
        console.error("Error fetching sidebar bg:", error);
      }
    };
    setupRealtimeBg();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/60 backdrop-blur-xl py-4 shadow-2xl border-b border-white/5' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: 180 }} 
            transition={{ duration: 0.6 }}
            className="text-gold"
          >
            <Camera size={32} strokeWidth={1.5} />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-playfair text-xl tracking-wider text-white uppercase group-hover:text-gold transition-colors">
              UdayJain
            </span>
            <span className="text-[10px] tracking-[0.2em] text-soft-gray uppercase font-light">
              Photography
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`text-sm tracking-wide transition-colors ${
                location.pathname === link.path ? 'text-gold' : 'text-white/80 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2 hover:text-gold transition-colors"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>

      </div>

      {/* Cinematic Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex justify-end"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[85vw] max-w-sm h-full bg-[#050505] border-l border-white/10 p-8 flex flex-col relative shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sidebar Background Image */}
              {sidebarBg && (
                <div className="absolute inset-0 z-0">
                  <img src={sidebarBg} alt="Sidebar Background" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                </div>
              )}

              <button 
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={32} />
              </button>
              
              <div className="flex flex-col gap-8 mt-24 z-10">
                {navLinks.map((link, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.1, duration: 0.5, ease: "easeOut" }}
                    key={link.name}
                  >
                    <Link 
                      to={link.path}
                      className={`font-playfair text-4xl tracking-wider uppercase transition-colors ${
                        location.pathname === link.path ? 'text-gold' : 'text-white/70 hover:text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-white/10 flex flex-col gap-4 text-soft-gray font-light text-sm z-10">
                <p>Datta Wadi, Chalisgaon</p>
                <p>+91 7774803320</p>
                <p className="uppercase tracking-widest text-[10px] mt-4 text-white/30">UdayJain Photography</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
