import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader2, Save } from 'lucide-react';

export default function HeroContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    headline: '',
    subheadline: '',
    buttonText: ''
  });

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const fetchHeroSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'hero');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      } else {
        // Initialize default if doesn't exist
        setFormData({
          headline: 'Capturing Timeless Moments',
          subheadline: 'Luxury Cinematic Photography & Films',
          buttonText: 'View Portfolio'
        });
      }
    } catch (error) {
      console.error("Error fetching hero settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'hero'), formData, { merge: true });
      alert("Hero content updated successfully!");
    } catch (error) {
      console.error("Error saving hero settings:", error);
      alert("Failed to save. Check your Firestore rules.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-gold" size={32} /></div>;
  }

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-playfair text-white mb-6">Hero Content</h2>
      
      <div className="bg-charcoal border border-white/5 p-8 rounded-xl">
        <h3 className="text-gold text-sm tracking-widest uppercase mb-6">Main Taglines</h3>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Primary Headline (H1)</label>
            <input 
              type="text" 
              value={formData.headline}
              onChange={(e) => setFormData({...formData, headline: e.target.value})}
              className="w-full bg-black-main border border-white/10 text-white p-4 rounded focus:outline-none focus:border-gold font-playfair text-xl"
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Subheadline</label>
            <input 
              type="text" 
              value={formData.subheadline}
              onChange={(e) => setFormData({...formData, subheadline: e.target.value})}
              className="w-full bg-black-main border border-white/10 text-soft-gray p-4 rounded focus:outline-none focus:border-gold font-light"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Button Text</label>
            <input 
              type="text" 
              value={formData.buttonText}
              onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
              className="w-full bg-black-main border border-white/10 text-white p-4 rounded focus:outline-none focus:border-gold text-sm tracking-widest uppercase"
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-gold text-black-main py-4 uppercase tracking-widest text-sm hover:bg-white transition-colors disabled:opacity-50 flex justify-center items-center gap-2 rounded mt-8 font-semibold"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving Changes...' : 'Save Hero Content'}
          </button>
        </form>
      </div>
    </div>
  );
}
