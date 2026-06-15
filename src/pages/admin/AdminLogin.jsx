import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, AlertTriangle, Camera } from 'lucide-react';
import { getOptimizedUrl } from '../../utils/imageOptimizer';

// Component to handle 3D rolling background images
const Rolling3DImages = ({ images }) => {
  if (images.length === 0) return null;

  // Duplicate images many times to create a seamless infinite strip
  const strip = [...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images];
  
  // Create variations for different rows
  const row1 = strip;
  const row2 = [...strip].reverse();
  const row3 = [...strip.slice(5), ...strip.slice(0, 5)];
  const row4 = [...strip.slice(10), ...strip.slice(0, 10)].reverse();
  const row5 = [...strip.slice(3), ...strip.slice(0, 3)];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505] flex items-center justify-center perspective-[2000px]">
      
      {/* Vignette & Soft overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)] z-20"></div>
      <div className="absolute inset-0 bg-black/50 z-20"></div> 
      
      {/* 3D Rolling Container */}
      <div 
        className="w-[300vw] h-[300vh] flex flex-col gap-8 justify-center items-center opacity-60"
        style={{
          transform: 'rotateX(45deg) rotateZ(-25deg) scale(1.2)',
          transformOrigin: 'center center'
        }}
      >
        <div className="flex gap-8 animate-scroll-left">
          {row1.map((img, i) => (
            <img key={`r1-${i}`} src={getOptimizedUrl(img.url || img.thumbUrl, 'thumbnail')} alt="gallery" className="w-72 h-56 object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5" />
          ))}
        </div>
        <div className="flex gap-8 animate-scroll-right">
          {row2.map((img, i) => (
            <img key={`r2-${i}`} src={getOptimizedUrl(img.url || img.thumbUrl, 'thumbnail')} alt="gallery" className="w-72 h-56 object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5" />
          ))}
        </div>
        <div className="flex gap-8 animate-scroll-left" style={{ animationDuration: '60s' }}>
          {row3.map((img, i) => (
            <img key={`r3-${i}`} src={getOptimizedUrl(img.url || img.thumbUrl, 'thumbnail')} alt="gallery" className="w-72 h-56 object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5" />
          ))}
        </div>
        <div className="flex gap-8 animate-scroll-right" style={{ animationDuration: '65s' }}>
          {row4.map((img, i) => (
            <img key={`r4-${i}`} src={getOptimizedUrl(img.url || img.thumbUrl, 'thumbnail')} alt="gallery" className="w-72 h-56 object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5" />
          ))}
        </div>
        <div className="flex gap-8 animate-scroll-left" style={{ animationDuration: '55s' }}>
          {row5.map((img, i) => (
            <img key={`r5-${i}`} src={getOptimizedUrl(img.url || img.thumbUrl, 'thumbnail')} alt="gallery" className="w-72 h-56 object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5" />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scrollLeft 50s linear infinite;
          width: max-content;
        }
        .animate-scroll-right {
          animation: scrollRight 50s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
};

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bgImages, setBgImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch some images from the gallery for the cinematic background
    const fetchImages = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(15));
        const snap = await getDocs(q);
        const fetched = [];
        snap.forEach(d => fetched.push(d.data()));
        setBgImages(fetched);
      } catch (err) {
        console.error("Could not fetch bg images", err);
      }
    };
    fetchImages();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black-main flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Dynamic 3D Animated Background */}
      <Rolling3DImages images={bgImages} />

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-md relative z-20"
      >
        <div className="bg-charcoal/80 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full animate-pulse"></div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center text-gold relative z-10 shadow-lg shadow-gold/10">
                <Camera size={36} strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-black-main border border-white/10 rounded-full p-2">
                <Lock size={14} className="text-white/50" />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-playfair text-white mb-3">Admin Portal</h2>
            
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 px-4 py-2 rounded-full mb-2">
              <AlertTriangle size={14} className="text-gold" />
              <p className="text-gold text-xs uppercase tracking-widest font-semibold">
                UdayJain Studio Only
              </p>
            </div>
            
            <p className="text-soft-gray text-xs font-light mt-4 leading-relaxed">
              Welcome to the control center. This area is strictly restricted to authorized studio personnel.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-sm mb-6 text-center shadow-inner"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-soft-gray text-[10px] uppercase tracking-[0.2em] mb-2 pl-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 p-4 text-white focus:outline-none focus:border-gold/50 focus:bg-black/80 transition-all rounded-xl placeholder:text-white/20"
                placeholder="studio@udayjain.com"
              />
            </div>
            <div>
              <label className="block text-soft-gray text-[10px] uppercase tracking-[0.2em] mb-2 pl-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 p-4 text-white focus:outline-none focus:border-gold/50 focus:bg-black/80 transition-all rounded-xl placeholder:text-white/20"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gold hover:bg-white text-black-main font-inter text-sm font-bold tracking-[0.2em] uppercase py-4 mt-4 transition-all rounded-xl disabled:opacity-50 shadow-lg shadow-gold/20 hover:shadow-white/20"
            >
              {loading ? 'Authenticating...' : 'Access Studio'}
            </button>
          </form>
        </div>
        
        <p className="text-center text-white/30 text-[10px] uppercase tracking-widest mt-8">
          Protected by UdayJain Photography Security
        </p>
      </motion.div>
    </div>
  );
}
