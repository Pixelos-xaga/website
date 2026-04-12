import { useState } from 'react';
import { Card } from '../ui/Card';
import { CodeBlock } from '../ui/CodeBlock';
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
} from '../ui/Icons';
import { DOWNLOADS } from '../../data/downloads';
import styles from './Downloads.module.css';

export const Downloads = () => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const primaryImages = DOWNLOADS.recovery_images.filter((img) => img.name === 'boot.img');
  const recoveryImages = DOWNLOADS.recovery_images.filter((img) => img.name === 'vendor_boot.img');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const renderImageItem = (img: { name: string; link: string; sha256: string }) => (
    <div key={img.name} className={styles.imageItem}>
      <div className={styles.imageHeader}>
        <span className={styles.imageName}>{img.name}</span>
        <a href={img.link} className={styles.miniDownload} title={`Download ${img.name}`}>
          <DownloadIcon size={16} />
        </a>
      </div>
      <span className={styles.imageHashLabel}>SHA256 Hash</span>
      <div className={styles.imageHash}>
        <code className={styles.imageHashText}>{img.sha256}</code>
        <button
          onClick={() => copyToClipboard(img.sha256)}
          className={styles.imageCopyButton}
          title={`Copy ${img.name} SHA256`}
        >
          {copiedHash === img.sha256 ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
        </button>
      </div>
    </div>
  );

  return (
    <section id="downloads" className={styles.downloads}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Download Hub</h2>
          <p className={styles.sectionSubtitle}>Everything you need to flash PixelOS on xaga.</p>
        </div>

        <div className={styles.grid}>
          <Card variant="primary" className={styles.romCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <DownloadIcon size={24} />
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>{DOWNLOADS.rom.name}</h3>
                <span className={styles.versionTag}>{DOWNLOADS.rom.version}</span>
              </div>
            </div>
            
            <div className={styles.cardBody}>
              <div className={styles.metaInline}>
                <span className={styles.metaLabel}>Build Date</span>
                <span className={styles.metaValue}>{DOWNLOADS.rom.date}</span>
                <span className={styles.metaLabel}>Filename</span>
                <code className={styles.filename}>{DOWNLOADS.rom.filename}</code>
              </div>
              
              <div className={styles.hashSection}>
                <span className={styles.metaLabel}>SHA256 Hash</span>
                <div className={styles.hashBox}>
                  <code className={styles.hashText}>{DOWNLOADS.rom.sha256}</code>
                  <button
                    onClick={() => copyToClipboard(DOWNLOADS.rom.sha256)}
                    className={styles.copyButton}
                    title="Copy hash"
                  >
                    {copiedHash === DOWNLOADS.rom.sha256 ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.cardActions}>
              <a href={DOWNLOADS.rom.link} className={styles.downloadButton}>
                <DownloadIcon size={18} />
                Download ZIP
              </a>
            </div>
          </Card>

          <div className={styles.secondaryGrid}>
            <Card className={styles.recoveryCard}>
              <h3 className={styles.groupTitle}>PixelOS Recovery</h3>
              <div className={styles.imageList}>
                {recoveryImages.map(renderImageItem)}
              </div>
            </Card>

            <Card className={styles.imagesCard}>
              <h3 className={styles.groupTitle}>Boot Image</h3>
              <div className={styles.imageList}>
                {primaryImages.map(renderImageItem)}
              </div>
            </Card>

            <Card className={styles.preloaderCard}>
              <h3 id="preloader-download" className={`${styles.groupTitle} ${styles.anchorTitle}`}>Engineering Preloader</h3>
              <div className={styles.imageList}>
                {DOWNLOADS.preloader.map(renderImageItem)}
              </div>
            </Card>

            <Card className={styles.archiveCard}>
              <h3 className={styles.groupTitle}>Archive</h3>
              <p className={styles.archiveText}>
                Browse older PixelOS xaga builds and mirrors on SourceForge.
              </p>
              <a
                href={DOWNLOADS.links.sourceforge}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.archiveButton}
              >
                Open Archive
                <ExternalLinkIcon size={16} />
              </a>
            </Card>
          </div>

          <Card className={styles.platformCard}>
            <h3 className={styles.groupTitle}>Platform Tools</h3>
            <p className={styles.platformIntro}>
              ADB and Fastboot are required for flashing, sideloading, and recovery work.
            </p>
            <a
              href={DOWNLOADS.platform_tools.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.externalLink}
            >
              Download Platform Tools
              <ExternalLinkIcon size={14} />
            </a>

            <div className={styles.orDivider}>
              <span>OR</span>
            </div>

            <div className={styles.platformList}>
              {DOWNLOADS.platform_tools.installs.map((install) => (
                <div key={install.os} className={styles.platformItem}>
                  <CodeBlock
                    code={install.command}
                    language={install.os}
                    className={styles.platformCodeBlock}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className={styles.driversCard}>
            <h3 className={styles.groupTitle}>Drivers</h3>
            <p className={styles.platformIntro}>
              Install the Windows USB drivers before using Fastboot if your device is not detected.
            </p>

            <div className={styles.imageItem}>
              <div className={styles.imageHeader}>
                <span className={styles.imageName}>{DOWNLOADS.drivers.filename}</span>
                <a
                  href={DOWNLOADS.drivers.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.miniDownload}
                  title={`Download ${DOWNLOADS.drivers.filename}`}
                >
                  <DownloadIcon size={16} />
                </a>
              </div>
              <span className={styles.imageHashLabel}>SHA256 Hash</span>
              <div className={styles.imageHash}>
                <code className={styles.imageHashText}>{DOWNLOADS.drivers.sha256}</code>
                <button
                  onClick={() => copyToClipboard(DOWNLOADS.drivers.sha256)}
                  className={styles.imageCopyButton}
                  title={`Copy ${DOWNLOADS.drivers.filename} SHA256`}
                >
                  {copiedHash === DOWNLOADS.drivers.sha256 ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
                </button>
              </div>
            </div>

            <ol className={styles.instructionsList}>
              {DOWNLOADS.drivers.instructions.map((instruction) => (
                <li key={instruction} className={styles.instructionItem}>
                  {instruction}
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </section>
  );
};
