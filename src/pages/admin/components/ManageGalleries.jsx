import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Upload, Trash2, Image as ImageIcon, Loader2, Search, Filter, CheckSquare, Square, CheckCircle2, AlertCircle } from 'lucide-react';
import { optimizeImage } from '../../../utils/imageOptimizer';

export default function ManageGalleries() {
  // Live Gallery State
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedImages, setSelectedImages] = useState([]);
  
  // Upload State
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [globalCategory, setGlobalCategory] = useState('Wedding');
  const [customCategory, setCustomCategory] = useState('');
  const [watermarkText, setWatermarkText] = useState('');
  const [uploadError, setUploadError] = useState(null);

  const baseCategories = ['Wedding', 'Pre Wedding', 'Baby Shoot', 'Outdoor Photoshoot', 'Indoor Photoshoot', 'Couple'];
  const dynamicCategories = Array.from(new Set(images.map(img => img.category))).filter(c => c && !baseCategories.includes(c));
  const categories = [...baseCategories, ...dynamicCategories, 'Other...'];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setUploadError(null);
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedImages = [];
      querySnapshot.forEach((d) => {
        fetchedImages.push({ id: d.id, ...d.data() });
      });
      setImages(fetchedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      if (error.code === 'permission-denied') {
        setUploadError('Permission Denied. Please configure your Firebase Firestore Security Rules.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilesAdded = (files) => {
    if (!files || files.length === 0) return;
    const newQueueItems = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      progress: 0,
      status: 'pending', // pending, compressing, uploading, success, error
      errorMsg: ''
    }));
    setUploadQueue(prev => [...prev, ...newQueueItems]);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesAdded(e.dataTransfer.files);
  };

  const processQueue = async () => {
    const pendingItems = uploadQueue.filter(item => item.status === 'pending' || item.status === 'error');
    if (pendingItems.length === 0) return;

    for (const item of pendingItems) {
      updateQueueItem(item.id, { status: 'compressing' });
      
      try {
        // 1. Compress & Watermark
        const { mainFile, thumbFile } = await optimizeImage(item.file, watermarkText);
        
        updateQueueItem(item.id, { status: 'uploading', progress: 10 });

        // Cloudinary upload using standard Fetch API
        const uploadToCloudinary = async (file, isMain) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'gei3yir7'); // Unsigned preset

          try {
            const response = await fetch('https://api.cloudinary.com/v1_1/depbmbw4y/image/upload', {
              method: 'POST',
              body: formData
            });
            
            const data = await response.json();
            
            if (response.ok) {
              if (isMain) updateQueueItem(item.id, { progress: 90 });
              return data.secure_url;
            } else {
              throw new Error(JSON.stringify(data));
            }
          } catch (error) {
            throw error;
          }
        };

        // Wait for both uploads to finish
        updateQueueItem(item.id, { status: 'uploading to cloudinary' });
        const [mainUrl, thumbUrl] = await Promise.all([
          uploadToCloudinary(mainFile, true), 
          uploadToCloudinary(thumbFile, false)
        ]);

        // 5. Save to Firestore
        updateQueueItem(item.id, { progress: 95, status: 'saving to database' });
        
        const finalCategory = globalCategory === 'Other...' ? (customCategory || 'Uncategorized') : globalCategory;
        
        // Add a timeout to addDoc to prevent infinite hanging if Firebase blocks it
        const dbPromise = addDoc(collection(db, 'gallery'), {
          url: mainUrl,
          thumbUrl: thumbUrl,
          category: finalCategory,
          title: item.name,
          createdAt: serverTimestamp()
        });
        
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout. Please check your Firestore Security Rules!')), 10000));
        
        await Promise.race([dbPromise, timeoutPromise]);

        updateQueueItem(item.id, { status: 'success', progress: 100 });
      } catch (error) {
        console.error("Upload failed for", item.name, error);
        
        let errorMsg = 'Upload Failed';
        try {
          // Try to parse Cloudinary JSON error
          const parsed = JSON.parse(error.message);
          if (parsed.error && parsed.error.message) {
            errorMsg = parsed.error.message;
          }
        } catch(e) {
          errorMsg = error.message || 'Upload Failed';
        }

        updateQueueItem(item.id, { 
          status: 'error', 
          errorMsg: errorMsg
        });
      }
    }
    fetchImages(); // Refresh live gallery after queue finishes
  };

  const updateQueueItem = (id, updates) => {
    setUploadQueue(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeQueueItem = (id) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id));
  };

  const toggleImageSelection = (id) => {
    setSelectedImages(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedImages.length} images?`)) return;
    
    setLoading(true);
    for (const id of selectedImages) {
      const img = images.find(i => i.id === id);
      if (img) {
        try {
          // Note: Cloudinary unsigned uploads cannot be deleted via the frontend.
          // Deleting from Firestore simply removes it from the website.
          await deleteDoc(doc(db, 'gallery', id));
        } catch (e) {
          console.error("Error deleting", id, e);
        }
      }
    }
    setSelectedImages([]);
    fetchImages();
  };

  // Derived state for gallery
  const filteredGallery = images.filter(img => {
    const matchCategory = filterCategory === 'All' || img.category === filterCategory;
    const matchSearch = img.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="w-full">
      <h2 className="text-2xl font-playfair text-white mb-6">Manage Galleries</h2>

      {uploadError && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl mb-6 flex items-start gap-3">
          <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-red-400 font-semibold mb-1">Firebase Security Rules Missing</h4>
            <p className="text-red-400/80 text-sm">
              Your database is blocking requests. Please update your Firestore and Storage rules as outlined in the Walkthrough document.
            </p>
          </div>
        </div>
      )}
      
      {/* Upload Section */}
      <div className="bg-charcoal border border-white/5 p-6 rounded-xl mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-gold text-sm tracking-widest uppercase">Bulk Upload Photos</h3>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex gap-2 w-full sm:w-auto">
              <select 
                value={globalCategory}
                onChange={(e) => setGlobalCategory(e.target.value)}
                className="bg-black-main border border-white/10 text-white p-2 text-sm rounded focus:border-gold outline-none w-full sm:w-40"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {globalCategory === 'Other...' && (
                <input 
                  type="text" 
                  placeholder="New Folder Name" 
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="bg-black-main border border-gold/50 text-white p-2 text-sm rounded focus:border-gold outline-none w-full sm:w-40 transition-all"
                  autoFocus
                />
              )}
            </div>
            <input 
              type="text" 
              placeholder="Optional Watermark" 
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              className="bg-black-main border border-white/10 text-white p-2 text-sm rounded focus:border-gold outline-none w-full sm:w-48"
            />
          </div>
        </div>

        <div 
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-colors cursor-pointer group mb-6
            ${isDragging ? 'border-gold bg-gold/5' : 'border-white/20 hover:border-gold/50'}
          `}
        >
          <input 
            type="file" 
            accept="image/*" 
            multiple
            webkitdirectory="true"
            onChange={(e) => handleFilesAdded(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <Upload size={40} className={`mb-4 transition-colors ${isDragging ? 'text-gold' : 'text-soft-gray group-hover:text-gold/50'}`} />
          <p className="text-white font-inter text-lg mb-2">Drag & Drop images or folders here</p>
          <p className="text-soft-gray text-sm font-light">or click to browse files (auto-compresses to WebP)</p>
        </div>

        {/* Upload Queue */}
        {uploadQueue.length > 0 && (
          <div className="bg-black-main rounded-lg p-4 border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-soft-gray">Queue ({uploadQueue.filter(i => i.status === 'success').length}/{uploadQueue.length} Complete)</span>
              <button 
                onClick={processQueue}
                className="bg-gold text-black-main px-4 py-2 text-xs uppercase tracking-widest rounded hover:bg-white transition-colors"
              >
                Start Upload
              </button>
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {uploadQueue.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-charcoal p-3 rounded border border-white/5">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {item.status === 'success' ? <CheckCircle2 className="text-green-400 shrink-0" size={18}/> :
                     item.status === 'error' ? <AlertCircle className="text-red-400 shrink-0" size={18}/> :
                     item.status === 'compressing' || item.status === 'uploading' ? <Loader2 className="text-gold animate-spin shrink-0" size={18}/> :
                     <ImageIcon className="text-soft-gray shrink-0" size={18}/>}
                    
                    <div className="flex flex-col truncate">
                      <span className="text-sm text-white truncate w-48 md:w-64">{item.name}</span>
                      <span className="text-xs text-soft-gray">
                        {item.status === 'error' ? <span className="text-red-400">{item.errorMsg}</span> : item.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-1/3">
                    <div className="w-full bg-black-main rounded-full h-1.5 hidden md:block">
                      <div className="bg-gold h-1.5 rounded-full transition-all duration-300" style={{ width: `${item.progress}%` }}></div>
                    </div>
                    {item.status !== 'success' && item.status !== 'uploading' && item.status !== 'compressing' && (
                      <button onClick={() => removeQueueItem(item.id)} className="text-soft-gray hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Gallery with Filters & Multi-Select */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-gold text-sm tracking-widest uppercase">Live Gallery ({images.length})</h3>
        
        <div className="flex items-center gap-4 w-full md:w-auto flex-wrap">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-gray" />
            <input 
              type="text" 
              placeholder="Search images..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-charcoal border border-white/5 pl-9 pr-4 py-2 text-sm text-white rounded focus:border-gold outline-none w-full md:w-48"
            />
          </div>
          
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-gray" />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-charcoal border border-white/5 pl-9 pr-4 py-2 text-sm text-white rounded focus:border-gold outline-none appearance-none"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {selectedImages.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded text-sm hover:bg-red-500 hover:text-white transition-colors"
            >
              <Trash2 size={16} />
              Delete ({selectedImages.length})
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gold" size={32} /></div>
      ) : filteredGallery.length === 0 ? (
        <div className="text-center py-12 text-soft-gray bg-charcoal rounded-xl border border-white/5">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
          <p>No images match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredGallery.map((img) => (
            <div 
              key={img.id} 
              className={`relative group rounded-lg overflow-hidden aspect-square border-2 transition-colors cursor-pointer
                ${selectedImages.includes(img.id) ? 'border-gold' : 'border-white/5 hover:border-white/30'}
              `}
              onClick={() => toggleImageSelection(img.id)}
            >
              <img src={img.thumbUrl || img.url} alt={img.title} className="w-full h-full object-cover" />
              
              <div className="absolute top-2 left-2 z-10">
                {selectedImages.includes(img.id) ? (
                  <CheckSquare className="text-gold fill-black/50" size={20} />
                ) : (
                  <Square className="text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                )}
              </div>

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                <span className="text-[10px] text-white/80 uppercase tracking-widest">{img.category}</span>
                <p className="text-xs text-white truncate">{img.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
