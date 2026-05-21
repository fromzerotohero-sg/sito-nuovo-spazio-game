import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../index.css';
import useLenis from '../hooks/useLenis';
import { siteConfig } from '../config';
import Hero from '../sections/Hero';
import AlbumCube from '../sections/AlbumCube';
import ParallaxGallery from '../sections/ParallaxGallery';
import TourSchedule from '../sections/TourSchedule';
import Footer from '../sections/Footer';

export default function Home() {
  useLenis();

  useEffect(() => {
    if (siteConfig.title) {
      document.title = siteConfig.title;
    }

    const refresh = () => ScrollTrigger.refresh();
    refresh();
    window.addEventListener('resize', refresh);
    window.addEventListener('orientationchange', refresh);

    return () => {
      window.removeEventListener('resize', refresh);
      window.removeEventListener('orientationchange', refresh);
    };
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-void-black overflow-x-hidden">
      {/* Hero Section - Immersive landing */}
      <Hero />

      {/* Album Cube Section - 3D showcase */}
      <AlbumCube />

      {/* Parallax Gallery Section */}
      <ParallaxGallery />

      {/* Tour Schedule Section */}
      <TourSchedule />

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
