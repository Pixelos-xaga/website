import changelogSource from './changelog.md?raw';

export interface ChangelogSection {
  title: string;
  items: string[];
}

export interface ChangelogEntry {
  date: string;
  version: string;
  sections: ChangelogSection[];
}

export interface ChangelogData {
  note: string | null;
  entries: ChangelogEntry[];
}

const SECTION_TITLES = new Set(['Added', 'Fixed', 'Changed']);

const stripDecorators = (value: string) => value.replace(/^[^A-Za-z0-9]+/, '').trim();

const parseSectionTitle = (line: string) => {
  const normalized = stripDecorators(line);
  return SECTION_TITLES.has(normalized) ? normalized : null;
};

const parseChangelog = (source: string): ChangelogData => {
  const lines = source.split(/\r?\n/);
  const entries: ChangelogEntry[] = [];

  let note: string | null = null;
  let currentEntry: ChangelogEntry | null = null;
  let currentSection: ChangelogSection | null = null;

  const commitEntry = () => {
    if (currentEntry) {
      entries.push(currentEntry);
      currentEntry = null;
      currentSection = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith('# ')) {
      continue;
    }

    if (!currentEntry && line.startsWith('- ') && note === null) {
      note = line.slice(2).trim();
      continue;
    }

    const entryMatch = line.match(/^##\s+.*\[(\d{4}-\d{2}-\d{2})\]\s*-\s*(.+)$/);
    if (entryMatch) {
      commitEntry();
      currentEntry = {
        date: entryMatch[1],
        version: entryMatch[2].trim(),
        sections: [],
      };
      continue;
    }

    if (!currentEntry) {
      continue;
    }

    const sectionTitle = parseSectionTitle(line);
    if (sectionTitle) {
      currentSection = {
        title: sectionTitle,
        items: [],
      };
      currentEntry.sections.push(currentSection);
      continue;
    }

    if (line.startsWith('- ') && currentSection) {
      currentSection.items.push(line.slice(2).trim());
    }
  }

  commitEntry();

  return {
    note,
    entries,
  };
};

export const CHANGELOG = parseChangelog(changelogSource);
