import { useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { clsx } from 'clsx';
import { CodeBlock } from '../ui/CodeBlock';
import { Card } from '../ui/Card';
import { AlertTriangleIcon, InfoIcon, TerminalIcon, WrenchIcon } from '../ui/Icons';
import { DOWNLOADS } from '../../data/downloads';
import { getSectionPath, scrollToSection } from '../../utils/sectionNavigation';
import styles from './FlashGuide.module.css';

type FlashMethod = 'recovery' | 'fastboot' | null;

const MethodCard = ({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  description: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(styles.methodCard, selected && styles.methodCardSelected)}
    aria-pressed={selected}
  >
    <div className={styles.methodIcon}>{icon}</div>
    <div className={styles.methodInfo}>
      <strong className={styles.methodTitle}>{title}</strong>
      <span className={styles.methodDesc}>{description}</span>
    </div>
  </button>
);

export const FlashGuide = () => {
  const [method, setMethod] = useState<FlashMethod>(null);

  const handleSectionLinkClick = (sectionId: string, path: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(sectionId, { path, history: 'push' });
  };

  const resetMethod = () => setMethod(null);

  const commonSteps = [
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
          <CodeBlock code={`fastboot flash preloader1 preloader_xaga.bin\nfastboot flash preloader2 preloader_xaga.bin`} />
        </>
      )
    },
    {
      title: "Choose Install Method",
      content: (
        <>
          <p>Select how you want to install PixelOS:</p>
          <div className={styles.methodGrid}>
            <MethodCard
              selected={method === 'recovery'}
              onClick={() => setMethod('recovery')}
              icon={<TerminalIcon size={28} />}
              title="Recovery Method"
              description="Flash via custom recovery — requires boot & vendor_boot images"
            />
            <MethodCard
              selected={method === 'fastboot'}
              onClick={() => setMethod('fastboot')}
              icon={<WrenchIcon size={28} />}
              title="Fastboot Method"
              description="Flash directly with the fastboot package via fastboot"
            />
          </div>
          {method && (
            <p className={styles.methodHint}>
              {method === 'recovery' ? 'Continuing with Recovery method...' : 'Continuing with Fastboot method...'}
            </p>
          )}
        </>
      )
    },
  ];

  const recoverySteps = [
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

  const fastbootSteps = [
    {
      title: "Download & Extract",
      content: (
        <>
          <p>
            Download the Fastboot Package from the{' '}
            <a href={getSectionPath('downloads')} onClick={handleSectionLinkClick('downloads', getSectionPath('downloads'))}>Downloads</a> hub
            and extract the ZIP archive.
          </p>
        </>
      )
    },
    {
      title: "Run the Installation Script",
      content: (
        <>
          <p>Open a terminal in the extracted folder and run the script for your OS:</p>
          <div className={styles.platformList}>
            <div className={styles.platformItem}>
              <span className={styles.platformLabel}>macOS</span>
              <CodeBlock code="bash mac_installation.sh" />
            </div>
            <div className={styles.platformItem}>
              <span className={styles.platformLabel}>Windows</span>
              <CodeBlock code="win_installation.bat" />
            </div>
            <div className={styles.platformItem}>
              <span className={styles.platformLabel}>Linux</span>
              <CodeBlock code="bash linux_installation.sh" />
            </div>
          </div>
          <div className={styles.info}>
            <InfoIcon size={18} />
            <span>The script will handle all flashing steps automatically.</span>
          </div>
        </>
      )
    },
    {
      title: "Reboot",
      content: (
        <>
          <p>Once the script completes, reboot your device.</p>
          <CodeBlock code="fastboot reboot" />
          <div className={styles.info}>
            <InfoIcon size={18} />
            <span>The first boot may take a few minutes. This is normal.</span>
          </div>
        </>
      )
    },
  ];

  const allSteps = [...commonSteps];
  if (method === 'recovery') {
    allSteps.push(...recoverySteps);
  } else if (method === 'fastboot') {
    allSteps.push(...fastbootSteps);
  }

  return (
    <section id="guide" className={styles.guide}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Installation Guide</h2>
          <p className={styles.sectionSubtitle}>Follow these steps carefully to ensure a successful flash.</p>
        </div>

        <div className={styles.stepper}>
          {allSteps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepMarker}>
                <div className={styles.stepNumber}>{index + 1}</div>
                {index < allSteps.length - 1 && <div className={styles.stepLine} />}
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <div className={styles.stepBody}>{step.content}</div>
              </div>
            </div>
          ))}
        </div>

        {method && (
          <div className={styles.methodSwitcher}>
            <button type="button" onClick={resetMethod} className={styles.switchButton}>
              <span>← Switch to {method === 'recovery' ? 'Fastboot' : 'Recovery'} method</span>
            </button>
          </div>
        )}

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
