import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader2, Upload, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Save, Image as ImageIcon } from 'lucide-react';
import { optimizeImage } from '../../../utils/imageOptimizer';

export default function ManageBackgrounds() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  
  const defaultData = {
    homeSlider: [],
    aboutBg: "", aboutTitle: "Our Story", aboutSubtitle: "Capturing the essence of your most precious moments.",
    servicesBg: "", servicesTitle: "Bespoke Photography Services", servicesSubtitle: "From the grandeur of your wedding day to the quiet intimacy of a newborn shoot...",
    galleryBg: "", galleryTitle: "Our Masterpieces", gallerySubtitle: "A curated collection of our finest captures.",
    budgetBg: "", budgetTitle: "Pricing & Packages", budgetSubtitle: "Transparent pricing for premium quality.",
    contactBg: "", contactTitle: "Let's Create Together", contactSubtitle: "We would love to hear about your special day.",
    sidebarBg: ""
  };
  
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    fetchBackgrounds();
  }, []);

  const fetchBackgrounds = async () => {
    try {
      const docRef = doc(db, 'settings', 'backgrounds');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData({ ...defaultData, ...docSnap.data() });
      } else {
        setData(defaultData);
      }
    } catch (error) {
      console.error("Error fetching backgrounds:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'backgrounds'), data);
      alert("Backgrounds saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'gei3yir7'); 

    const response = await fetch('https://api.cloudinary.com/v1_1/depbmbw4y/image/upload', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    if (response.ok) return result.secure_url;
    throw new Error(result.error?.message || "Upload failed");
  };

  const handleSliderUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    
    setUploading(true);
    setUploadProgress('Uploading slider images...');
    
    try {
      const urls = [];
      for (const file of files) {
        const { mainFile } = await optimizeImage(file, '');
        const url = await uploadToCloudinary(mainFile);
        urls.push(url);
      }
      
      setData(prev => {
        const newSlides = [...(prev.homeSlider || [])];
        urls.forEach(url => {
          newSlides.push({ id: Math.random().toString(36).substr(2, 9), url, enabled: true });
        });
        const updated = { ...prev, homeSlider: newSlides };
        // Auto-save
        setDoc(doc(db, 'settings', 'backgrounds'), updated).catch(err => console.error("Auto-save failed:", err));
        return updated;
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading images.");
    } finally {
      setUploading(false);
      setUploadProgress('');
      e.target.value = null; // Reset input
    }
  };

  const handlePageBgUpload = async (e, fieldKey) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(`Uploading ${fieldKey}...`);
    
    try {
      const { mainFile } = await optimizeImage(file, '');
      const url = await uploadToCloudinary(mainFile);
      
      setData(prev => {
        const updated = { ...prev, [fieldKey]: url };
        // Auto-save
        setDoc(doc(db, 'settings', 'backgrounds'), updated).catch(err => console.error("Auto-save failed:", err));
        return updated;
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image.");
    } finally {
      setUploading(false);
      setUploadProgress('');
      e.target.value = null;
    }
  };

  const moveSlide = (index, direction) => {
    setData(prev => {
      const newSlides = [...prev.homeSlider];
      if (direction === 'up' && index > 0) {
        [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
      } else if (direction === 'down' && index < newSlides.length - 1) {
        [newSlides[index + 1], newSlides[index]] = [newSlides[index], newSlides[index + 1]];
      }
      const updated = { ...prev, homeSlider: newSlides };
      setDoc(doc(db, 'settings', 'backgrounds'), updated).catch(console.error);
      return updated;
    });
  };

  const toggleSlide = (index) => {
    setData(prev => {
      const newSlides = [...prev.homeSlider];
      newSlides[index].enabled = !newSlides[index].enabled;
      const updated = { ...prev, homeSlider: newSlides };
      setDoc(doc(db, 'settings', 'backgrounds'), updated).catch(console.error);
      return updated;
    });
  };

  const deleteSlide = (index) => {
    setData(prev => {
      const newSlides = [...prev.homeSlider];
      newSlides.splice(index, 1);
      const updated = { ...prev, homeSlider: newSlides };
      setDoc(doc(db, 'settings', 'backgrounds'), updated).catch(console.error);
      return updated;
    });
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gold" size={32} /></div>;

  const PageConfigSection = ({ title, prefix }) => (
    <div className="bg-charcoal border border-white/5 p-6 rounded-xl space-y-4">
      <h3 className="text-gold text-sm tracking-widest uppercase mb-4">{title} Hero Section</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Background Image</label>
          {data[`${prefix}Bg`] ? (
            <div className="relative group rounded-lg overflow-hidden h-32 bg-black border border-white/10 mb-2">
              <img src={data[`${prefix}Bg`]} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-black/50 p-2 rounded text-white hover:text-gold transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePageBgUpload(e, `${prefix}Bg`)} disabled={uploading} />
                  Replace
                </label>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-gold/50 transition-colors bg-black/20">
              <Upload size={24} className="text-soft-gray mb-2" />
              <span className="text-xs text-soft-gray">Upload Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePageBgUpload(e, `${prefix}Bg`)} disabled={uploading} />
            </label>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Title</label>
            <input 
              type="text" 
              value={data[`${prefix}Title`]} 
              onChange={(e) => setData({ ...data, [`${prefix}Title`]: e.target.value })}
              className="w-full bg-black-main border border-white/10 text-white p-2 rounded focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Subtitle</label>
            <textarea 
              value={data[`${prefix}Subtitle`]} 
              onChange={(e) => setData({ ...data, [`${prefix}Subtitle`]: e.target.value })}
              className="w-full bg-black-main border border-white/10 text-soft-gray p-2 rounded focus:outline-none focus:border-gold resize-none h-20"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair text-white">Manage Pages & Backgrounds</h2>
        <div className="flex items-center gap-4">
          {uploading && <span className="text-gold text-sm animate-pulse">{uploadProgress}</span>}
          <button 
            onClick={handleSave} 
            disabled={saving || uploading}
            className="flex items-center gap-2 bg-gold text-black-main px-6 py-2 rounded uppercase tracking-widest text-sm font-semibold hover:bg-white transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* Home Slider Section */}
        <div className="bg-charcoal border border-white/5 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-gold text-sm tracking-widest uppercase">Home Page Slider</h3>
              <p className="text-xs text-soft-gray mt-1">Manage the sliding background images on the home page.</p>
            </div>
            <label className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-white/20 transition-colors">
              <Upload size={16} />
              Add Images
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleSliderUpload} disabled={uploading} />
            </label>
          </div>

          <div className="space-y-3">
            {!data.homeSlider || data.homeSlider.length === 0 ? (
              <div className="text-center py-8 text-soft-gray border border-dashed border-white/10 rounded-lg">
                <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                No slider images uploaded.
              </div>
            ) : (
              data.homeSlider.map((slide, index) => (
                <div key={slide.id} className={`flex items-center gap-4 p-3 rounded-lg border ${slide.enabled ? 'bg-black-main border-white/10' : 'bg-black/50 border-white/5 opacity-60'} transition-opacity`}>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveSlide(index, 'up')} disabled={index === 0} className="p-1 text-soft-gray hover:text-white disabled:opacity-30"><ArrowUp size={16} /></button>
                    <button onClick={() => moveSlide(index, 'down')} disabled={index === data.homeSlider.length - 1} className="p-1 text-soft-gray hover:text-white disabled:opacity-30"><ArrowDown size={16} /></button>
                  </div>
                  
                  <img src={slide.url} alt={`Slide ${index}`} className="w-24 h-16 object-cover rounded" />
                  
                  <div className="flex-grow flex items-center justify-between">
                    <span className="text-sm font-mono text-soft-gray">Slide {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleSlide(index)} 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs uppercase tracking-widest ${slide.enabled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/5 text-soft-gray hover:bg-white/10'}`}
                      >
                        {slide.enabled ? <><Eye size={14} /> Enabled</> : <><EyeOff size={14} /> Disabled</>}
                      </button>
                      <button onClick={() => deleteSlide(index)} className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Background Section */}
        <div className="bg-charcoal border border-white/5 p-6 rounded-xl">
          <h3 className="text-gold text-sm tracking-widest uppercase mb-4">Mobile Sidebar Background</h3>
          <p className="text-xs text-soft-gray mb-4">Set the background image that appears when the mobile menu is opened.</p>
          <div className="max-w-md">
            {data.sidebarBg ? (
              <div className="relative group rounded-lg overflow-hidden h-40 bg-black border border-white/10">
                <img src={data.sidebarBg} alt="Sidebar" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer bg-black/50 p-2 rounded text-white hover:text-gold transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePageBgUpload(e, 'sidebarBg')} disabled={uploading} />
                    Replace Image
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-gold/50 transition-colors bg-black/20">
                <Upload size={24} className="text-soft-gray mb-2" />
                <span className="text-xs text-soft-gray">Upload Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePageBgUpload(e, 'sidebarBg')} disabled={uploading} />
              </label>
            )}
          </div>
        </div>

        {/* Other Pages */}
        <PageConfigSection title="About Page" prefix="about" />
        <PageConfigSection title="Services Page" prefix="services" />
        <PageConfigSection title="Gallery Page" prefix="gallery" />
        <PageConfigSection title="Budget Page" prefix="budget" />
        <PageConfigSection title="Contact Page" prefix="contact" />

      </div>
    </div>
  );
}
