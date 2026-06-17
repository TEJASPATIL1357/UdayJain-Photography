import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { db } from '../firebase/config';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

import AboutHero from './about-components/AboutHero';
import AboutStory from './about-components/AboutStory';
import AboutStats from './about-components/AboutStats';
import WhyChooseUs from './about-components/WhyChooseUs';
import Specialties from './about-components/Specialties';
import BehindLens from './about-components/BehindLens';
import Timeline from './about-components/Timeline';
import Testimonials from './about-components/Testimonials';
import AboutShowcase from './about-components/AboutShowcase';
import AboutCTA from './about-components/AboutCTA';

export default function About() {
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'settings', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAboutData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };

    const fetchGalleryImages = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const images = [];
        const seen = new Set();
        snapshot.forEach(doc => {
          const data = doc.data();
          const cat = data.category?.toLowerCase() || '';
          const url = data.url || data.thumbUrl;
          if (cat !== 'indoor photoshoot' && cat !== 'photo frames desgin' && !cat.includes('indoor') && !cat.includes('frame')) {
            if (url && !seen.has(url)) {
              seen.add(url);
              images.push(url);
            }
          }
        });
        // Shuffle images array
        for (let i = images.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [images[i], images[j]] = [images[j], images[i]];
        }
        setGalleryImages(images.slice(0, 2));
      } catch (error) {
        console.error("Error fetching gallery images for about:", error);
      }
    };

    Promise.all([fetchAboutData(), fetchGalleryImages()]).then(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black-main flex items-center justify-center">
      <div className="text-gold tracking-[0.3em] uppercase text-sm animate-pulse">Loading Story...</div>
    </div>;
  }

  // Fallback defaults if data is missing
  const data = aboutData || {};

  return (
    <div className="w-full min-h-screen bg-black-main overflow-hidden font-inter">
      <Helmet>
        <title>Our Story | UdayJain Photography</title>
        <meta name="description" content={data.aboutSubtitle || "Capturing emotions, memories, and moments that last forever."} />
      </Helmet>

      <AboutHero 
        heroImage={data.aboutHeroImage} 
        title={data.aboutTitle} 
        subtitle={data.aboutSubtitle} 
      />
      
      <AboutStory 
        storyText={data.aboutStory} 
        images={galleryImages} 
      />
      
      <AboutStats 
        stats={{
          yearsExperience: data.yearsExperience,
          happyClients: data.happyClients,
          weddingsCovered: data.weddingsCovered,
          photosDelivered: data.photosDelivered
        }} 
      />
      
      <WhyChooseUs data={data.whyChooseUs} />
      
      <Specialties />
      
      <BehindLens 
        name={data.aboutPhotographerName} 
        bio={data.aboutPhotographerBio} 
      />
      
      <Timeline />
      
      <Testimonials data={data.testimonials} />
      
      <AboutCTA />

    </div>
  );
}
