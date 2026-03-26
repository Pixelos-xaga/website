import { useRef, useState } from 'react';
import type { TouchEvent } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getSectionPath, scrollToSection } from '../../utils/sectionNavigation';
import styles from './Hero.module.css';

const screenshots = Array.from({ length: 13 }, (_, index) => ({
  src: `/screenshots/screenshot-${index + 1}.png`,
  alt: `PixelOS xaga screenshot ${index + 1}`,
}));

export const Hero = () => {
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isFirstScreenshot = activeScreenshot === 0;
  const isLastScreenshot = activeScreenshot === screenshots.length - 1;

  const moveToPrevious = () => {
    setActiveScreenshot((current) => Math.max(0, current - 1));
  };

  const moveToNext = () => {
    setActiveScreenshot((current) => Math.min(screenshots.length - 1, current + 1));
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    const isHorizontalSwipe = Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

    touchStartX.current = null;
    touchStartY.current = null;

    if (!isHorizontalSwipe) {
      return;
    }

    if (deltaX > 0) {
      moveToPrevious();
      return;
    }

    moveToNext();
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.content}
        >
          <h1 className={styles.title}>
            Pixel OS FOR<br />
            <span className={styles.gradientText}>XAGA.</span>
          </h1>
          <p className={styles.description}>
            Enjoy the clean, smooth, and feature-rich Pixel OS on your 
            Redmi K50i, Poco X4 GT, Redmi Note 11T Pro/Pro+
          </p>
          
          <div className={styles.actions}>
            <a
              href={getSectionPath('downloads')}
              className={styles.primaryButton}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection('downloads', { path: getSectionPath('downloads'), history: 'push' });
              }}
            >
              Get Started
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.visual}
        >
          <div className={styles.viewer}>
            <div className={styles.viewerFrame}>
              <button
                type="button"
                className={`${styles.navButton} ${isFirstScreenshot ? styles.navButtonDisabled : ''}`}
                onClick={moveToPrevious}
                disabled={isFirstScreenshot}
                aria-label="Previous screenshot"
              >
                <ChevronLeft size={20} />
              </button>

              <div
                className={styles.phoneMockup}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={screenshots[activeScreenshot].src}
                  alt={screenshots[activeScreenshot].alt}
                  className={styles.screenImage}
                />
              </div>

              <button
                type="button"
                className={`${styles.navButton} ${isLastScreenshot ? styles.navButtonDisabled : ''}`}
                onClick={moveToNext}
                disabled={isLastScreenshot}
                aria-label="Next screenshot"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div
            className={styles.progressTrack}
            aria-label={`Screenshot ${activeScreenshot + 1} of ${screenshots.length}`}
          >
            <div
              className={styles.progressFill}
              style={{ width: `${((activeScreenshot + 1) / screenshots.length) * 100}%` }}
            />
          </div>
          <div className={styles.glow} />
        </motion.div>
      </div>
    </section>
  );
};
