import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Camera } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black-main border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Camera size={28} className="text-gold" />
              <div className="flex flex-col">
                <span className="font-playfair text-xl tracking-wider text-white uppercase">UdayJain</span>
                <span className="text-[9px] tracking-[0.2em] text-soft-gray uppercase font-light">Photography</span>
              </div>
            </Link>
            <p className="text-soft-gray text-sm font-light leading-relaxed mb-6">
              Premium cinematic photography studio specializing in weddings, portraits, and timeless visual storytelling.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-playfair text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-soft-gray font-light">
              <li><Link to="/gallery" className="hover:text-gold transition-colors">Gallery</Link></li>
              <li><Link to="/services" className="hover:text-gold transition-colors">Services</Link></li>
              <li><Link to="/budget" className="hover:text-gold transition-colors">Pricing & Budget</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-playfair text-lg mb-6">Contact Info</h4>
            <ul className="space-y-4 text-sm text-soft-gray font-light">
              <li>Datta Wadi, Chalisgaon, 424101</li>
              <li>+91 7774803320</li>
              <li>+91 7774805800</li>
              <li>hello@udayjainphotography.com</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-playfair text-lg mb-6">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/uj_uday_jain_photography/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-white text-soft-gray transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-white text-soft-gray transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-white text-soft-gray transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-white text-soft-gray transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-soft-gray font-light">
          <p>&copy; {new Date().getFullYear()} UdayJain Photography. All rights reserved.</p>
          <p>DESIGNED BY TEJAS PATIL.</p>
        </div>
      </div>
    </footer>
  );
}
