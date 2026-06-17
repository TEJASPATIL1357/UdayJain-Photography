import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Camera } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getOptimizedUrl } from '../utils/imageOptimizer';
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
    try {
      const docRef = doc(db, 'settings', 'backgrounds');
      
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().sidebarBg) {
          setSidebarBg(getOptimizedUrl(docSnap.data().sidebarBg, 'hd'));
        }
      });
    } catch (error) {
      console.error("Error fetching sidebar bg:", error);
    }

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
              className="w-[85vw] max-w-sm h-full bg-[#050505] border-l border-white/10 p-8 flex flex-col relative shadow-[-20px_0_50px_rgba(0,0,0,0.8)] overflow-y-auto overflow-x-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sidebar Background Image */}
              {sidebarBg && (
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img src={sidebarBg} alt="Sidebar Background" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/80 to-[#050505] backdrop-blur-[2px]"></div>
                </div>
              )}

              {/* Header */}
              <div className="relative z-10 flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="text-gold">
                    <Camera size={24} strokeWidth={1.5} />
                  </div>
                  <span className="font-playfair text-lg tracking-wider text-white uppercase">UdayJain</span>
                </div>
                <button 
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Links */}
              <div className="flex flex-col gap-6 relative z-10 flex-grow">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1, duration: 0.5, ease: "easeOut" }}
                      key={link.name}
                      className="group"
                    >
                      <Link 
                        to={link.path}
                        className="flex items-center gap-4 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="text-[10px] text-white/30 font-inter tracking-[0.2em] w-6 group-hover:text-gold transition-colors">
                          0{i + 1}
                        </span>
                        <span className={`font-playfair text-3xl tracking-wider uppercase transition-colors ${
                          isActive ? 'text-gold' : 'text-white/80 group-hover:text-white'
                        }`}>
                          {link.name}
                        </span>
                      </Link>
                      {/* Animated Gold Underline */}
                      {isActive && (
                        <motion.div 
                          layoutId="sidebar-active" 
                          className="h-[1px] w-full bg-gold/50 mt-2 ml-10" 
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-8 relative z-10 pt-8 border-t border-white/10">
                <div className="flex gap-3 mb-6">
                  <a href="#" className="w-10 h-10 rounded-full border border-white/10 bg-black/50 flex items-center justify-center text-white/70 hover:bg-gold hover:text-black hover:border-gold transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-white/10 bg-black/50 flex items-center justify-center text-white/70 hover:bg-gold hover:text-black hover:border-gold transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-white/10 bg-black/50 flex items-center justify-center text-white/70 hover:bg-gold hover:text-black hover:border-gold transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </a>
                </div>
                
                <div className="flex flex-col gap-1 text-soft-gray font-light text-xs">
                  <p>Datta Wadi, Chalisgaon</p>
                  <p className="text-white">+91 7774803320</p>
                  <p className="uppercase tracking-widest text-[9px] mt-4 text-white/30">© 2026 UdayJain Photography</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
