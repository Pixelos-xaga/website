import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '../ui/Icons';
import { getSectionPath, scrollToSection } from '../../utils/sectionNavigation';
import styles from './Hero.module.css';

const screenshots = Array.from({ length: 13 }, (_, index) => ({
  src: `/screenshots/screenshot-${index + 1}.png`,
  alt: `PixelOS xaga screenshot ${index + 1}`,
}));

export const Hero = () => {
  const wheelGestures = useRef(
    WheelGesturesPlugin({
      forceWheelAxis: 'x',
      wheelDraggingClass: styles.isWheelDragging,
    }),
  ).current;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      containScroll: 'trimSnaps',
      loop: false,
      skipSnaps: false,
    },
    [wheelGestures],
  );
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(screenshots.length > 1);

  const moveToPrevious = () => {
    emblaApi?.scrollPrev();
  };

  const moveToNext = () => {
    emblaApi?.scrollNext();
  };

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const syncScreenshotState = () => {
      setActiveScreenshot(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    syncScreenshotState();

    emblaApi.on('select', syncScreenshotState);
    emblaApi.on('reInit', syncScreenshotState);

    return () => {
      emblaApi.off('select', syncScreenshotState);
      emblaApi.off('reInit', syncScreenshotState);
    };
  }, [emblaApi]);

  const handleCarouselKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveToPrevious();
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveToNext();
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      emblaApi?.scrollTo(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      emblaApi?.scrollTo(screenshots.length - 1);
    }
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
                className={`${styles.navButton} ${!canScrollPrev ? styles.navButtonDisabled : ''}`}
                onClick={moveToPrevious}
                disabled={!canScrollPrev}
                aria-label="Previous screenshot"
              >
                <ChevronLeftIcon size={20} />
              </button>

              <div
                className={styles.phoneMockup}
              >
                <div
                  ref={emblaRef}
                  className={styles.viewport}
                  onKeyDown={handleCarouselKeyDown}
                  tabIndex={0}
                  aria-label="PixelOS screenshots"
                  aria-roledescription="carousel"
                >
                  <div className={styles.carouselContainer}>
                    {screenshots.map((screenshot, index) => {
                      const isActive = index === activeScreenshot;

                      return (
                        <div
                          key={screenshot.src}
                          className={styles.slide}
                          aria-hidden={!isActive}
                        >
                          <div
                            className={`${styles.slideInner} ${isActive ? styles.slideInnerActive : ''}`}
                          >
                            <img
                              src={screenshot.src}
                              alt={screenshot.alt}
                              className={styles.screenImage}
                              loading={index === 0 ? 'eager' : 'lazy'}
                              decoding="async"
                              draggable="false"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={`${styles.navButton} ${!canScrollNext ? styles.navButtonDisabled : ''}`}
                onClick={moveToNext}
                disabled={!canScrollNext}
                aria-label="Next screenshot"
              >
                <ChevronRightIcon size={20} />
              </button>
            </div>
          </div>
          <div className={styles.viewerMeta}>
            <span aria-live="polite">
              Screenshot {activeScreenshot + 1} / {screenshots.length}
            </span>
          </div>
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-label="Screenshot progress"
            aria-valuemin={1}
            aria-valuemax={screenshots.length}
            aria-valuenow={activeScreenshot + 1}
          >
            <div
              className={styles.progressFill}
              style={{ width: `${((activeScreenshot + 1) / screenshots.length) * 100}%` }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
