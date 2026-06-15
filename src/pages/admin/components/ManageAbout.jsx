import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader2, Upload, Trash2, Plus, Save } from 'lucide-react';
import { optimizeImage } from '../../../utils/imageOptimizer';

export default function ManageAbout() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const defaultData = {
    aboutHeroImage: "",
    aboutTitle: "Every Picture Tells a Story",
    aboutSubtitle: "Capturing emotions, memories, and moments that last forever.",
    aboutStory: "At UdayJain Photography, we believe every photograph is more than an image—it is a memory preserved forever. From weddings and pre-wedding shoots to baby photography and special celebrations, we transform moments into timeless stories.",
    aboutPhotographerName: "Uday Jain",
    aboutPhotographerBio: "A passionate visual storyteller dedicated to capturing the raw emotion and timeless beauty of your most cherished moments.",
    yearsExperience: 5,
    happyClients: 500,
    weddingsCovered: 100,
    photosDelivered: 50000,
    whyChooseUs: [
      { title: "Professional Equipment", description: "Using top-tier gear for the best results.", icon: "Camera" },
      { title: "Creative Vision", description: "Unique and artistic perspectives.", icon: "Eye" },
    ],
    testimonials: []
  };

  const [data, setData] = useState(defaultData);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const docRef = doc(db, 'settings', 'about');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData({ ...defaultData, ...docSnap.data() });
      } else {
        setData(defaultData);
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'about'), data);
      alert("About page content saved successfully!");
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

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(`Uploading...`);

    try {
      const { mainFile } = await optimizeImage(file, '');
      const url = await uploadToCloudinary(mainFile);
      setData(prev => ({ ...prev, [field]: url }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image.");
    } finally {
      setUploading(false);
      setUploadProgress('');
      e.target.value = null;
    }
  };

  const handleTestimonialImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(`Uploading...`);

    try {
      const { mainFile } = await optimizeImage(file, '');
      const url = await uploadToCloudinary(mainFile);
      const newTestimonials = [...data.testimonials];
      newTestimonials[index].image = url;
      setData(prev => ({ ...prev, testimonials: newTestimonials }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image.");
    } finally {
      setUploading(false);
      setUploadProgress('');
      e.target.value = null;
    }
  };

  // Why Choose Us array handlers
  const addWhyChooseUs = () => {
    setData(prev => ({
      ...prev,
      whyChooseUs: [...prev.whyChooseUs, { title: "", description: "", icon: "Star" }]
    }));
  };
  const updateWhyChooseUs = (index, field, value) => {
    const newItems = [...data.whyChooseUs];
    newItems[index][field] = value;
    setData(prev => ({ ...prev, whyChooseUs: newItems }));
  };
  const removeWhyChooseUs = (index) => {
    const newItems = [...data.whyChooseUs];
    newItems.splice(index, 1);
    setData(prev => ({ ...prev, whyChooseUs: newItems }));
  };

  // Testimonials array handlers
  const addTestimonial = () => {
    setData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, { id: Date.now().toString(), name: "", text: "", rating: 5, image: "" }]
    }));
  };
  const updateTestimonial = (index, field, value) => {
    const newItems = [...data.testimonials];
    newItems[index][field] = value;
    setData(prev => ({ ...prev, testimonials: newItems }));
  };
  const removeTestimonial = (index) => {
    const newItems = [...data.testimonials];
    newItems.splice(index, 1);
    setData(prev => ({ ...prev, testimonials: newItems }));
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gold" size={32} /></div>;

  return (
    <div className="w-full max-w-5xl pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair text-white">Manage About Page</h2>
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
        
        {/* Basic Content & Hero */}
        <div className="bg-charcoal border border-white/5 p-6 rounded-xl space-y-6">
          <h3 className="text-gold text-sm tracking-widest uppercase border-b border-white/10 pb-2">Hero & Story</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Hero Image</label>
              {data.aboutHeroImage ? (
                <div className="relative group rounded-lg overflow-hidden h-32 bg-black border border-white/10 mb-2">
                  <img src={data.aboutHeroImage} alt="Hero" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-black/50 p-2 rounded text-white hover:text-gold transition-colors">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'aboutHeroImage')} disabled={uploading} />
                      Replace
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-gold/50 transition-colors bg-black/20">
                  <Upload size={24} className="text-soft-gray mb-2" />
                  <span className="text-xs text-soft-gray">Upload Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'aboutHeroImage')} disabled={uploading} />
                </label>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Title</label>
                <input type="text" value={data.aboutTitle} onChange={(e) => setData({ ...data, aboutTitle: e.target.value })} className="w-full bg-black-main border border-white/10 text-white p-2 rounded focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Subtitle</label>
                <input type="text" value={data.aboutSubtitle} onChange={(e) => setData({ ...data, aboutSubtitle: e.target.value })} className="w-full bg-black-main border border-white/10 text-white p-2 rounded focus:border-gold" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Our Story (Text)</label>
            <textarea value={data.aboutStory} onChange={(e) => setData({ ...data, aboutStory: e.target.value })} className="w-full bg-black-main border border-white/10 text-soft-gray p-2 rounded focus:border-gold h-24" />
          </div>
        </div>

        {/* Photographer Profile */}
        <div className="bg-charcoal border border-white/5 p-6 rounded-xl space-y-6">
          <h3 className="text-gold text-sm tracking-widest uppercase border-b border-white/10 pb-2">Behind The Lens</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Photographer Name</label>
              <input type="text" value={data.aboutPhotographerName} onChange={(e) => setData({ ...data, aboutPhotographerName: e.target.value })} className="w-full bg-black-main border border-white/10 text-white p-2 rounded focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Photographer Bio</label>
              <textarea value={data.aboutPhotographerBio} onChange={(e) => setData({ ...data, aboutPhotographerBio: e.target.value })} className="w-full bg-black-main border border-white/10 text-soft-gray p-2 rounded focus:border-gold h-20" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-charcoal border border-white/5 p-6 rounded-xl space-y-6">
          <h3 className="text-gold text-sm tracking-widest uppercase border-b border-white/10 pb-2">Statistics Counter</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Years Exp.</label>
              <input type="number" value={data.yearsExperience} onChange={(e) => setData({ ...data, yearsExperience: parseInt(e.target.value) || 0 })} className="w-full bg-black-main border border-white/10 text-white p-2 rounded focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Clients</label>
              <input type="number" value={data.happyClients} onChange={(e) => setData({ ...data, happyClients: parseInt(e.target.value) || 0 })} className="w-full bg-black-main border border-white/10 text-white p-2 rounded focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Weddings</label>
              <input type="number" value={data.weddingsCovered} onChange={(e) => setData({ ...data, weddingsCovered: parseInt(e.target.value) || 0 })} className="w-full bg-black-main border border-white/10 text-white p-2 rounded focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-soft-gray mb-2">Photos Delivered</label>
              <input type="number" value={data.photosDelivered} onChange={(e) => setData({ ...data, photosDelivered: parseInt(e.target.value) || 0 })} className="w-full bg-black-main border border-white/10 text-white p-2 rounded focus:border-gold" />
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-charcoal border border-white/5 p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
            <h3 className="text-gold text-sm tracking-widest uppercase">Why Choose Us</h3>
            <button onClick={addWhyChooseUs} className="text-xs bg-white/10 text-white px-3 py-1 rounded hover:bg-white/20 flex items-center gap-1"><Plus size={14}/> Add Item</button>
          </div>
          
          {data.whyChooseUs.map((item, index) => (
            <div key={index} className="flex gap-4 items-start bg-black-main/50 p-4 rounded-lg border border-white/5 relative">
              <button onClick={() => removeWhyChooseUs(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-500"><Trash2 size={16} /></button>
              <div className="flex-1 space-y-3">
                <input type="text" placeholder="Title (e.g. Professional Equipment)" value={item.title} onChange={(e) => updateWhyChooseUs(index, 'title', e.target.value)} className="w-full bg-black border border-white/10 text-white p-2 rounded focus:border-gold" />
                <textarea placeholder="Short description..." value={item.description} onChange={(e) => updateWhyChooseUs(index, 'description', e.target.value)} className="w-full bg-black border border-white/10 text-soft-gray p-2 rounded focus:border-gold h-16" />
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="bg-charcoal border border-white/5 p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
            <h3 className="text-gold text-sm tracking-widest uppercase">Testimonials</h3>
            <button onClick={addTestimonial} className="text-xs bg-white/10 text-white px-3 py-1 rounded hover:bg-white/20 flex items-center gap-1"><Plus size={14}/> Add Testimonial</button>
          </div>
          
          {data.testimonials.map((testi, index) => (
            <div key={testi.id} className="flex flex-col md:flex-row gap-6 bg-black-main/50 p-4 rounded-lg border border-white/5 relative">
              <button onClick={() => removeTestimonial(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-500"><Trash2 size={16} /></button>
              
              <div className="w-24 h-24 shrink-0 rounded-full bg-black border border-white/10 overflow-hidden relative group">
                {testi.image ? (
                   <img src={testi.image} alt={testi.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-soft-gray"><Upload size={20}/></div>
                )}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <span className="text-[10px] uppercase text-white">Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleTestimonialImageUpload(e, index)} disabled={uploading} />
                </label>
              </div>

              <div className="flex-1 space-y-3 pt-2">
                <div className="flex gap-4">
                  <input type="text" placeholder="Client Name" value={testi.name} onChange={(e) => updateTestimonial(index, 'name', e.target.value)} className="flex-1 bg-black border border-white/10 text-white p-2 rounded focus:border-gold" />
                  <input type="number" min="1" max="5" placeholder="Rating (1-5)" value={testi.rating} onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value)||5)} className="w-24 bg-black border border-white/10 text-white p-2 rounded focus:border-gold" />
                </div>
                <textarea placeholder="Testimonial Text..." value={testi.text} onChange={(e) => updateTestimonial(index, 'text', e.target.value)} className="w-full bg-black border border-white/10 text-soft-gray p-2 rounded focus:border-gold h-20" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
