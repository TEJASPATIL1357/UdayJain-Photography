import React, { Suspense, lazy, useState, useEffect, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Lazy loading pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Budget = lazy(() => import('./pages/Budget'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Creative Cinematic Loader
const PageLoader = () => (
  <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-black-main">
    {/* Static Background Image (from public folder) */}
    <motion.div 
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/loading-bg.jpg')" }}
    />
    
    {/* Dramatic Glass Overlay */}
    <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
    
    {/* Animated Content */}
    <div className="relative z-10 flex flex-col items-center">
      {/* Glowing Golden Camera Icon */}
      <motion.div 
        initial={{ opacity: 0.5, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="text-gold mb-6 relative"
      >
        <div className="absolute inset-0 bg-gold blur-2xl opacity-40"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="relative drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
      </motion.div>
      
      {/* Luxury Typography */}
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-playfair text-3xl tracking-[0.2em] text-white uppercase mb-2 drop-shadow-xl"
      >
        UdayJain
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-[10px] tracking-[0.4em] text-gold uppercase mb-10"
      >
        Photography
      </motion.p>
      
      {/* Elegant Progress Line */}
      <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 bottom-0 w-1/3 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]"
          initial={{ left: "-33%" }}
          animate={{ left: "100%" }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  </div>
);

// Route Transition Wrapper
const RouteTransition = ({ children }) => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Show loader on every route change
    setIsNavigating(true);
    // Hide it after a short cinematic delay
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[1000]"
          >
            <PageLoader />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-red-500 p-10">
          <div>
            <h1 className="text-4xl font-bold mb-4">React Error</h1>
            <pre className="bg-red-900/20 p-6 rounded whitespace-pre-wrap">{this.state.error?.toString()}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
      <Router>
        <RouteTransition>
          <div className="flex min-h-screen flex-col bg-black-main text-white font-inter">
            <Navbar />
            
            <main className="flex-grow">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/budget" element={<Budget />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
            <FloatingWhatsApp />
          </div>
        </RouteTransition>
      </Router>
    </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
