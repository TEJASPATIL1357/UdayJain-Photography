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
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(2));
        const snapshot = await getDocs(q);
        const images = [];
        snapshot.forEach(doc => {
          images.push(doc.data().url || doc.data().thumbUrl);
        });
        setGalleryImages(images);
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
