import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { getSectionPath, scrollToSection } from '../../utils/sectionNavigation';
import styles from './Navbar.module.css';

const navLinks = [
  { name: 'Changelog', href: getSectionPath('changelog'), sectionId: 'changelog' },
  { name: 'Downloads', href: getSectionPath('downloads'), sectionId: 'downloads' },
  { name: 'Guide', href: getSectionPath('guide'), sectionId: 'guide' },
  { name: 'Troubleshooting', href: getSectionPath('troubleshooting'), sectionId: 'troubleshooting' },
] as const;

const socialLinks = [
  { name: 'Telegram', href: 'https://t.me/XAGASupport', iconSrc: '/brands/telegram.svg' },
  { name: 'GitHub', href: 'https://github.com/Pixelos-xaga/', iconSrc: '/brands/github.svg' },
] as const;

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleSectionClick = (sectionId: string, path: string, closeMenu = false) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(sectionId, { path, history: 'push' });

    if (closeMenu) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sectionLinks = navLinks.filter((link) => 'sectionId' in link);
      const viewportMarker = window.innerHeight * 0.35;
      const sections = sectionLinks.flatMap((link) => {
        const element = document.getElementById(link.sectionId);
        return element ? [{ id: link.sectionId, element }] : [];
      });

      let currentSection: string | null = null;

      for (const section of sections) {
        const rect = section.element.getBoundingClientRect();
        if (rect.top <= viewportMarker && rect.bottom >= viewportMarker) {
          currentSection = section.id;
        }
      }

      if (!currentSection) {
        const visibleSections = sections.filter((section) => {
          const rect = section.element.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        });

        if (visibleSections.length > 0) {
          currentSection = visibleSections[visibleSections.length - 1].id;
        }
      }

      setActiveSection(currentSection);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={clsx(styles.navbar, isScrolled && styles.scrolled)}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src="/favicon.svg" alt="" className={styles.logoIcon} aria-hidden="true" />
          <span>PixelOS <span className={styles.device}>xaga</span></span>
        </div>

        {/* Desktop Links */}
        <div className={styles.desktopLinks}>
          {navLinks.map((link) => {
            const isActive = 'sectionId' in link && activeSection === link.sectionId;

            return (
              <a
                key={link.name}
                href={link.href}
                className={clsx(styles.link, isActive && styles.activeLink)}
                onClick={handleSectionClick(link.sectionId, link.href)}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.name}
              </a>
            );
          })}

          <div className={styles.iconLinks}>
            {socialLinks.map((link) => {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={styles.iconLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                >
                  <img src={link.iconSrc} alt="" className={styles.iconImage} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={styles.menuButton} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={clsx(styles.mobileMenu, isMenuOpen && styles.mobileMenuOpen)}>
        {navLinks.map((link) => {
          const isActive = 'sectionId' in link && activeSection === link.sectionId;

          return (
            <a
              key={link.name}
              href={link.href}
              className={clsx(styles.mobileLink, isActive && styles.activeMobileLink)}
              onClick={handleSectionClick(link.sectionId, link.href, true)}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.name}
            </a>
          );
        })}

        <div className={styles.mobileIconLinks}>
          {socialLinks.map((link) => {
            return (
              <a
                key={link.name}
                href={link.href}
                className={styles.mobileIconLink}
                onClick={() => setIsMenuOpen(false)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
              >
                <img src={link.iconSrc} alt="" className={styles.mobileIconImage} aria-hidden="true" />
                {link.name}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
