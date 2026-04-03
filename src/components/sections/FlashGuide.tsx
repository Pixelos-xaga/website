import type { MouseEvent } from 'react';
import { CodeBlock } from '../ui/CodeBlock';
import { Card } from '../ui/Card';
import { AlertTriangleIcon, InfoIcon } from '../ui/Icons';
import { DOWNLOADS } from '../../data/downloads';
import { getSectionPath, scrollToSection } from '../../utils/sectionNavigation';
import styles from './FlashGuide.module.css';

export const FlashGuide = () => {
  const handleSectionLinkClick = (sectionId: string, path: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(sectionId, { path, history: 'push' });
  };

  const steps = [
    {
      title: "Prerequisites",
      content: (
        <>
          <p>Before you begin, ensure you have the following:</p>
          <ul>
            <li>Xaga with an unlocked bootloader.</li>
            <li>A PC with ADB & Fastboot drivers installed.</li>
            <li>Original USB Cable.</li>
            <li><strong>Backup all your data</strong> (internal storage will be wiped).</li>
          </ul>
        </>
      )
    },
    {
      title: "Boot into Fastboot",
      content: (
        <>
          <p>Power off your device and hold <strong>Volume Down + Power</strong> until the Fastboot logo appears. Connect it to your PC.</p>
          <CodeBlock code="fastboot devices" />
        </>
      )
    },
    {
      title: "Flash Preloader",
      content: (
        <>
          <div className={styles.warning}>
            <AlertTriangleIcon size={20} />
            <span>Xaga is easy to brick. You <strong>MUST</strong> flash the engineering preloader first.</span>
          </div>
          <p className={styles.preloaderHelp}>
            Download the engineering preloader from the <a href={getSectionPath('downloads')} onClick={handleSectionLinkClick('preloader-download', getSectionPath('downloads'))}>Engineering Preloader</a> section in the Downloads hub before continuing.
          </p>
          <CodeBlock code={`fastboot flash preloader1 preloader_aristotle.bin\nfastboot flash preloader2 preloader_aristotle.bin`} />
        </>
      )
    },
    {
      title: "Flash Recovery",
      content: (
        <>
          <p>
            Ensure you have the correct <span className={styles.keycap}>boot</span> and <span className={styles.keycap}>vendor_boot</span> image from the{' '}
            <a href={getSectionPath('downloads')} onClick={handleSectionLinkClick('downloads', getSectionPath('downloads'))}>Downloads</a> hub.
          </p>
          <CodeBlock code={`fastboot flash boot boot.img`} />
          <CodeBlock code={`fastboot flash vendor_boot vendor_boot.img`} />
        </>
      )
    },
    {
      title: "Reboot to Recovery",
      content: (
        <>
          <p>With the device powered off, hold <strong>Volume Up + Power</strong>. Keep holding both buttons until the MI logo appears, then release the power button.</p>
          <div className={styles.info}>
            <InfoIcon size={18} />
            <span>You should now be in PixelOS Recovery.</span>
          </div>
        </>
      )
    },
    {
      title: "Turn on ADB Sideload",
      content: (
        <>
          <p>Click <strong>Apply update</strong> and then click <strong>adb sideload</strong>.</p>
        </>
      )
    },
    {
      title: "Format and Reboot",
      content: (
        <>
          <p>Go to <strong>Factory Reset {"->"} Format Data/Factory Reset</strong> and confirm.</p>
        </>
      )
    },
    {
      title: "Sideload ROM",
      content: (
        <>
          <p>Run the following on your PC:</p>
          <CodeBlock code={`adb sideload ${DOWNLOADS.rom.filename}`} />
          <p>Finally, select <strong>Reboot System Now</strong>.</p>
          <p className={styles.smallText}>Note: The process may stop at 47% or 94%, this is normal.</p>
        </>
      )
    },
  ];

  return (
    <section id="guide" className={styles.guide}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Installation Guide</h2>
          <p className={styles.sectionSubtitle}>Follow these steps carefully to ensure a successful flash.</p>
        </div>

        <div className={styles.stepper}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepMarker}>
                <div className={styles.stepNumber}>{index + 1}</div>
                {index < steps.length - 1 && <div className={styles.stepLine} />}
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <div className={styles.stepBody}>{step.content}</div>
              </div>
            </div>
          ))}
        </div>

        <Card variant="glass" className={styles.disclaimerCard}>
          <div className={styles.disclaimerHeader}>
            <AlertTriangleIcon size={24} className={styles.disclaimerIcon} />
            <h3>Disclaimer</h3>
          </div>
          <p>
            Modifying your device's software can lead to data loss or a bricked device if not done correctly. 
            The PixelOS team and the device maintainers are not responsible for any damage caused to your hardware. 
            Proceed at your own risk.
          </p>
        </Card>
      </div>
    </section>
  );
};
