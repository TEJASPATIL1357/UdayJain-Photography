import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { LayoutDashboard, Image as ImageIcon, Settings, LogOut, Type, Phone } from 'lucide-react';
import ManageGalleries from './components/ManageGalleries';
import HeroContent from './components/HeroContent';
import ManageBackgrounds from './components/ManageBackgrounds';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard Overview');

  useEffect(() => {
    // Wait for context update, but also check auth.currentUser directly 
    // to prevent premature redirects caused by React state batching delays.
    const isActuallyLoggedOut = !currentUser && (!auth || !auth.currentUser);
    
    if (isActuallyLoggedOut && auth && typeof auth.signOut === 'function') {
      navigate('/admin');
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      if (auth && typeof auth.signOut === 'function') {
        await signOut(auth);
      }
      navigate('/admin');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard Overview' },
    { icon: ImageIcon, label: 'Manage Galleries' },
    { icon: Type, label: 'Hero Content' },
    { icon: ImageIcon, label: 'Manage Backgrounds' },
    { icon: Settings, label: 'Manage Services' },
    { icon: Phone, label: 'Contact Settings' },
  ];

  return (
    <div className="w-full min-h-screen bg-black-main pt-24 pb-12 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-charcoal border-r border-white/10 p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl font-playfair text-gold mb-1">Admin Panel</h2>
          <p className="text-soft-gray text-xs font-light">Welcome back, Admin</p>
        </div>

        <nav className="flex-grow space-y-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button 
                key={idx} 
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-3 p-3 rounded transition-colors text-sm font-inter ${activeTab === item.label ? 'bg-gold text-black-main' : 'text-soft-gray hover:bg-white/5 hover:text-white'}`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-8 flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded transition-colors text-sm font-inter w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-8 overflow-y-auto">
        {activeTab === 'Dashboard Overview' && (
          <>
            <h1 className="text-3xl font-playfair text-white mb-8">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-charcoal p-6 border border-white/5 rounded-xl">
                <h3 className="text-soft-gray text-sm uppercase tracking-widest mb-2">System Status</h3>
                <p className="text-2xl font-light text-green-400">Online</p>
              </div>

              <div className="bg-charcoal p-6 border border-white/5 rounded-xl md:col-span-2">
                <div className="flex justify-between items-center h-full">
                  <div>
                    <h3 className="text-soft-gray text-sm uppercase tracking-widest mb-2">Cloudinary Storage Stats</h3>
                    <p className="text-xs font-light text-soft-gray">
                      For security, live storage tracking requires logging into Cloudinary directly.
                    </p>
                  </div>
                  <a href="https://cloudinary.com/console" target="_blank" rel="noreferrer" className="text-xs bg-gold text-black-main px-4 py-2 uppercase tracking-widest font-semibold rounded hover:bg-white transition-colors whitespace-nowrap">
                    Check Usage
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-charcoal border border-white/5 rounded-xl p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
              <ImageIcon size={48} className="text-white/20 mb-4" />
              <h3 className="text-xl text-white font-playfair mb-2">Firebase Connected Successfully</h3>
              <p className="text-soft-gray max-w-md mx-auto">
                Use the sidebar to navigate between your gallery management, hero content settings, and other configurations.
              </p>
            </div>
          </>
        )}

        {activeTab === 'Manage Galleries' && <ManageGalleries />}
        {activeTab === 'Hero Content' && <HeroContent />}
        {activeTab === 'Manage Backgrounds' && <ManageBackgrounds />}
        
        {(activeTab === 'Manage Services' || activeTab === 'Contact Settings') && (
          <div className="bg-charcoal border border-white/5 rounded-xl p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
            <Settings size={48} className="text-white/20 mb-4" />
            <h3 className="text-xl text-white font-playfair mb-2">Coming Soon</h3>
            <p className="text-soft-gray max-w-md mx-auto">
              This module is currently under development.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
