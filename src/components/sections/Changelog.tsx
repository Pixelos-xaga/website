import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Card } from '../ui/Card';
import { CHANGELOG } from '../../data/changelog';
import styles from './Changelog.module.css';

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));

const renderInlineMarkdown = (text: string) => {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`)/g).filter(Boolean);

  return parts.map((part, index) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={`${linkMatch[2]}-${index}`} href={linkMatch[2]} target="_blank" rel="noopener noreferrer">
          {linkMatch[1]}
        </a>
      );
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={`code-${index}`}>{part.slice(1, -1)}</code>;
    }

    return <span key={`text-${index}`}>{part}</span>;
  });
};

export const Changelog = () => {
  const [selectedDate, setSelectedDate] = useState(CHANGELOG.entries[0]?.date ?? '');

  const selectedEntry =
    CHANGELOG.entries.find((entry) => entry.date === selectedDate) ?? CHANGELOG.entries[0];

  if (!selectedEntry) {
    return null;
  }

  return (
    <section id="changelog" className={styles.changelog}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Changelog</h2>
          <p className={styles.sectionSubtitle}>Pick a build date to review what changed in that release.</p>
        </div>

        <Card className={styles.viewerCard}>
          <div className={styles.viewerHeader}>
            <div className={styles.buildInfo}>
              <div className={styles.infoLabel}>Selected Build</div>
              <h3 className={styles.buildTitle}>{formatDate(selectedEntry.date)}</h3>
              <div className={styles.versionPill}>{selectedEntry.version}</div>
            </div>

            <label className={styles.selectWrap}>
              <span className={styles.selectLabel}>
                <CalendarDays size={16} />
                Date
              </span>
              <select
                className={styles.select}
                value={selectedEntry.date}
                onChange={(event) => setSelectedDate(event.target.value)}
              >
                {CHANGELOG.entries.map((entry) => (
                  <option key={entry.date} value={entry.date}>
                    {formatDate(entry.date)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.sections}>
            {selectedEntry.sections.map((section) => (
              <div key={section.title} className={styles.sectionCard}>
                <h4 className={styles.sectionHeading}>{section.title}</h4>
                <ul className={styles.sectionList}>
                  {section.items.map((item) => (
                    <li key={item} className={styles.sectionItem}>
                      {renderInlineMarkdown(item)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};
