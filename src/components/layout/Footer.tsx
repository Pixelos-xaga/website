import { Heart } from 'lucide-react';
import { DOWNLOADS } from '../../data/downloads';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h3 className={styles.logo}>PixelOS <span className={styles.device}>xaga</span></h3>
            <p className={styles.description}>
              An AOSP based ROM, with Google Pixel goodies, a sleek UI and extra features.
            </p>
          </div>

          <div className={styles.links}>
            <h4>Resources</h4>
            <ul>
              <li><a href="https://pixelos.net" target="_blank" rel="noopener noreferrer">Official PixelOS Website</a></li>
              <li><a href="https://github.com/PixelOS-AOSP" target="_blank" rel="noopener noreferrer">Pixelos Xaga GitHub</a></li>
              <li><a href="https://blog.pixelos.net" target="_blank" rel="noopener noreferrer">PixelOS Blog</a></li>
              <li><a href={DOWNLOADS.links.xda} target="_blank" rel="noopener noreferrer">XDA Thread</a></li>
            </ul>
          </div>

          <div className={styles.links}>
            <h4>Community</h4>
            <ul>
               <li><a href="https://t.me/XAGA_Updates" target="_blank" rel="noopener noreferrer">Device Channel</a></li>
              <li><a href="https://t.me/XAGASupport" target="_blank" rel="noopener noreferrer">Support Group</a></li>
              <li><a href="https://t.me/PixelOSChat" target="_blank" rel="noopener noreferrer">Official PixelOS Chat</a></li>
            </ul>
          </div>

          <div className={styles.social}>
            <h4 className={styles.socialTitle}>By Angad</h4>
            <div className={styles.socialIcons}>
              <a href="https://x.com/Angxddeep" target="_blank" rel="noopener noreferrer" aria-label="X">
                <img src="/brands/x.svg" alt="" className={styles.socialIconImage} aria-hidden="true" />
              </a>
              <a href="https://github.com/Angxddeep/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <img src="/brands/github.svg" alt="" className={styles.socialIconImage} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()}{' '}
            <a
              href="https://pixelos.net/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.copyrightLink}
            >
              PixelOS
            </a>
            . This project is not affiliated with upstream{' '}
            <a
              href="https://pixelos.net/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.copyrightLink}
            >
              PixelOS
            </a>
            .
          </p>
          <p className={styles.madeWith}>
            Made with <Heart size={14} className={styles.heartIcon} /> for Xaga
          </p>
        </div>
      </div>
    </footer>
  );
};
