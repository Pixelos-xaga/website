import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { Card } from '../ui/Card';
import {
  BugIcon,
  ExternalLinkIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
  TerminalIcon,
} from '../ui/Icons';
import { DOWNLOADS } from '../../data/downloads';
import { scrollToSection } from '../../utils/sectionNavigation';
import styles from './FAQ.module.css';

type FaqTab = 'safetynet' | 'bugs';

const LOGCAT_GUIDE_URL = 'https://blog.pixelos.net/docs/guides/HowToLog';

const tabPaths: Record<FaqTab, string> = {
  safetynet: '/integrity',
  bugs: '/report-bugs',
};

const getTabFromPath = (pathname: string): FaqTab | null => {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';

  if (normalizedPath === '/integrity' || normalizedPath === '/intrgrity') {
    return 'safetynet';
  }

  if (normalizedPath === '/report-bugs' || normalizedPath === '/bugs') {
    return 'bugs';
  }

  return null;
};

const isLogcatPath = (pathname: string) => {
  return (pathname.replace(/\/+$/, '') || '/') === '/logcat';
};

export const FAQ = () => {
  const [activeTab, setActiveTab] = useState<FaqTab>(() => getTabFromPath(window.location.pathname) ?? 'safetynet');

  useEffect(() => {
    const syncTabFromLocation = () => {
      if (isLogcatPath(window.location.pathname)) {
        window.location.assign(LOGCAT_GUIDE_URL);
        return;
      }

      const routeTab = getTabFromPath(window.location.pathname);

      if (routeTab) {
        setActiveTab(routeTab);
      }
    };

    syncTabFromLocation();
    window.addEventListener('popstate', syncTabFromLocation);

    return () => {
      window.removeEventListener('popstate', syncTabFromLocation);
    };
  }, []);

  const selectTab = (tab: FaqTab) => (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setActiveTab(tab);
    scrollToSection('troubleshooting', { path: tabPaths[tab], history: 'push' });
  };

  const openLogcatGuide = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.location.assign(LOGCAT_GUIDE_URL);
  };

  return (
    <section id="troubleshooting" className={styles.faq}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Troubleshooting & FAQ</h2>
          <p className={styles.sectionSubtitle}>Find solutions to common problems and learn how to report issues.</p>
        </div>

        <div className={styles.tabs}>
          <button 
            className={activeTab === 'safetynet' ? styles.activeTab : ''} 
            onClick={selectTab('safetynet')}
          >
            <ShieldCheckIcon size={20} />
            Integrity
          </button>
          <button 
            className={activeTab === 'bugs' ? styles.activeTab : ''} 
            onClick={selectTab('bugs')}
          >
            <BugIcon size={20} />
            Report Bugs
          </button>
          <button 
            className={styles.redirectTab}
            onClick={openLogcatGuide}
            aria-label="Open Logcat guide on the PixelOS blog"
          >
            <TerminalIcon size={20} />
            Logcat Guide
            <ExternalLinkIcon size={14} />
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'safetynet' && (
            <Card className={styles.contentCard}>
              <h3>Play Integrity & SafetyNet</h3>
              <p>PixelOS usually passes Play Integrity out of the box. If it fails, try the following:</p>
              <ul>
                <li>Clear data of Play Store and Google Play Services.</li>
                <li>Device passes basic integrity by default.</li>
                <li>For Device and Strong integrity, you must add a <code>keybox</code> inside Developer Options (source it yourself).</li>
                <li>
                  For GPay, you may need a custom{' '}
                  <a
                    className={styles.inlineCodeLink}
                    href="https://github.com/PixelOS-AOSP/official_devices/blob/sixteen/API/updater/CertifiedProps/certified_build_props.json"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <code>Pif.json</code>
                    <ExternalLinkIcon size={12} className={styles.linkIcon} />
                  </a>{' '}
                  in Developer Options.
                </li>
              </ul>
              <div className={styles.infoBox}>
                <MessageCircleIcon size={18} />
                <span>Ask in the Telegram group for more info on sourcing keyboxes or PIF files.</span>
              </div>
            </Card>
          )}

          {activeTab === 'bugs' && (
            <Card className={styles.contentCard}>
              <h3>Reporting Bugs</h3>
              <p>When reporting a bug, please be descriptive and include:</p>
              <ul>
                <li>A clear description of the issue.</li>
                <li>Steps to reproduce it.</li>
                <li>Your build version.</li>
                <li><strong>A Logcat file</strong> (mandatory for most issues).</li>
              </ul>
              <div className={styles.bugActions}>
                <a href={DOWNLOADS.links.telegram_support} target="_blank" rel="noopener noreferrer" className={styles.bugLink}>
                  Telegram Support Group
                </a>
                <a href="https://t.me/pixeloschat" target="_blank" rel="noopener noreferrer" className={styles.bugLink}>
                  Official PixelOS Chat
                </a>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};
