import { Download, Wrench, ExternalLink, Copy, Check, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../ui/Card';
import { CodeBlock } from '../ui/CodeBlock';
import { DOWNLOADS } from '../../data/downloads';
import styles from './Downloads.module.css';

export const Downloads = () => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const primaryImages = DOWNLOADS.recovery_images.filter(
    (img) => img.name === 'boot.img' || img.name === 'vendor_boot.img'
  );
  const secondaryImages = DOWNLOADS.recovery_images.filter(
    (img) => img.name === 'dtbo.img' || img.name === 'vbmeta.img'
  );

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
          <Download size={16} />
        </a>
      </div>
      <div className={styles.imageHash}>
        <code className={styles.imageHashText}>{img.sha256}</code>
        <button
          onClick={() => copyToClipboard(img.sha256)}
          className={styles.imageCopyButton}
          title={`Copy ${img.name} SHA256`}
        >
          {copiedHash === img.sha256 ? <Check size={12} /> : <Copy size={12} />}
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
          {/* Main ROM Card */}
          <Card variant="primary" className={styles.romCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <Download size={24} />
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>{DOWNLOADS.rom.name}</h3>
                <span className={styles.versionTag}>{DOWNLOADS.rom.version}</span>
              </div>
            </div>
            
            <div className={styles.cardBody}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Build Date</span>
                <span className={styles.metaValue}>{DOWNLOADS.rom.date}</span>
              </div>
              <div className={styles.metaItem}>
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
                    {copiedHash === DOWNLOADS.rom.sha256 ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className={styles.embeddedImages}>
                <h4 className={styles.groupTitle}>Boot Images</h4>
                <div className={styles.imageList}>
                  {primaryImages.map(renderImageItem)}
                </div>
              </div>
            </div>

            <div className={styles.cardActions}>
              <a href={DOWNLOADS.rom.link} className={styles.downloadButton}>
                <Download size={18} />
                Download ZIP
              </a>
            </div>
          </Card>

          {/* Recovery Images Card */}
          <Card className={styles.imagesCard}>
            <h3 className={styles.groupTitle}>Other Images</h3>
            <div className={styles.imageList}>
              {secondaryImages.map(renderImageItem)}
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
              <ExternalLink size={16} />
            </a>
          </Card>

          {/* Essential Tools Card */}
          <Card className={styles.toolsCard}>
            <h3 id="preloader-download" className={`${styles.groupTitle} ${styles.anchorTitle}`}>Essential Tools</h3>
            <div className={styles.toolsList}>
              {DOWNLOADS.essential.map((tool) => (
                <div key={tool.name} className={styles.toolItem}>
                   <div className={styles.toolHeader}>
                    <Wrench size={20} className={styles.toolIcon} />
                    <span className={styles.toolName}>{tool.name}</span>
                  </div>
                  <p className={styles.toolDesc}>{tool.description}</p>
                  <a href={tool.link} className={styles.toolLink}>
                    Download
                    <ChevronRight size={14} />
                  </a>
                </div>
              ))}
            </div>
          </Card>

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
              <ExternalLink size={14} />
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
        </div>
      </div>
    </section>
  );
};
