import { MessageCircle, Bug, Terminal, ShieldCheck, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../ui/Card';
import { CodeBlock } from '../ui/CodeBlock';
import { DOWNLOADS } from '../../data/downloads';
import styles from './FAQ.module.css';

export const FAQ = () => {
  const [activeTab, setActiveTab] = useState<'safetynet' | 'logcat' | 'bugs'>('safetynet');

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
            onClick={() => setActiveTab('safetynet')}
          >
            <ShieldCheck size={20} />
            Integrity
          </button>
          <button 
            className={activeTab === 'bugs' ? styles.activeTab : ''} 
            onClick={() => setActiveTab('bugs')}
          >
            <Bug size={20} />
            Report Bugs
          </button>
          <button 
            className={activeTab === 'logcat' ? styles.activeTab : ''} 
            onClick={() => setActiveTab('logcat')}
          >
            <Terminal size={20} />
            Logcat
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
                    <code>pif.json</code>
                    <ExternalLink size={12} className={styles.linkIcon} />
                  </a>{' '}
                  in Developer Options.
                </li>
              </ul>
              <div className={styles.infoBox}>
                <MessageCircle size={18} />
                <span>Ask in the Telegram group for more info on sourcing keyboxes or PIF files.</span>
              </div>
            </Card>
          )}

          {activeTab === 'logcat' && (
            <Card className={styles.contentCard}>
              <h3>How to Collect a Logcat</h3>
              <p>Logs are essential for developers to fix bugs. Here's how to get them:</p>
              <ol>
                <li>Enable <strong>Developer Options</strong> by tapping Build Number 7 times in Settings.</li>
                <li>Turn on <strong>USB Debugging</strong>.</li>
                <li>Connect to PC and run:</li>
              </ol>
              <CodeBlock code="adb logcat -b all > logcat.log" />
              <p>Reproduce the issue, then press <code>Ctrl + C</code> to stop logging.</p>
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
