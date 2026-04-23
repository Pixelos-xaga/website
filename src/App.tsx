import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { Changelog } from './components/sections/Changelog';
import { Downloads } from './components/sections/Downloads';
import { FlashGuide } from './components/sections/FlashGuide';
import { FAQ } from './components/sections/FAQ';
import { Footer } from './components/layout/Footer';
import { syncLocationToSection } from './utils/sectionNavigation';
import styles from './App.module.css';

function App() {
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      syncLocationToSection('auto');
    });

    const handleLocationChange = () => {
      syncLocationToSection('auto');
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  return (
    <div className={styles.app}>
      <Navbar />
      
      <main>
        <Hero />
        <Changelog />
        <Downloads />
        <FlashGuide />
        <FAQ />
      </main>
      
      <Footer />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
