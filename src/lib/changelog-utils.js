import { html } from 'lit';

const CHANGELOG_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const CHANGELOG_HEADER_PATTERN = /^##\s+(?:[^\[]*?)?\[([\d-]+)\]\s+-\s+(.*)$/;
const CHANGELOG_ENTRY_PATTERN = /^(?:#{3,6}\s+)?(.+)$/;
const MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
const BULLET_PREFIXES = ['- ', '* '];

export function getChangelogDateFromHash(hash = '') {
  const decoded = decodeURIComponent(String(hash).replace(/^#/, '').trim());
  return CHANGELOG_DATE_PATTERN.test(decoded) ? decoded : '';
}

function isBulletLine(line) {
  return BULLET_PREFIXES.some((prefix) => line.startsWith(prefix));
}

function getEntryHeading(line) {
  const match = line.match(CHANGELOG_ENTRY_PATTERN);
  if (!match) {
    return '';
  }

  const heading = match[1].trim();
  if (!heading || heading.startsWith('#') || isBulletLine(heading)) {
    return '';
  }

  return heading;
}

export function parseChangelogs(markdown = '') {
  const logs = [];
  let currentLog = null;

  for (const rawLine of String(markdown).split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const headerMatch = line.match(CHANGELOG_HEADER_PATTERN);
    if (headerMatch) {
      currentLog = {
        date: headerMatch[1],
        version: headerMatch[2],
        tag: logs.length === 0 ? 'Latest' : '',
        entries: []
      };
      logs.push(currentLog);
      continue;
    }

    if (!currentLog) {
      continue;
    }

    const entryHeading = getEntryHeading(line);
    if (entryHeading) {
      currentLog.entries.push({ type: entryHeading, items: [] });
      continue;
    }

    if (!isBulletLine(line) || currentLog.entries.length === 0) {
      continue;
    }

    currentLog.entries[currentLog.entries.length - 1].items.push(line.replace(/^[-*]\s+/, ''));
  }

  return logs;
}

export function sortChangelogsByDate(logs = []) {
  return [...logs]
    .sort((left, right) => String(right?.date || '').localeCompare(String(left?.date || '')))
    .map((log, index) => ({
      ...log,
      tag: index === 0 ? 'Latest' : ''
    }));
}

export function renderMarkdownLinks(text) {
  const value = String(text ?? '');
  const parts = [];
  let lastIndex = 0;
  let match = null;

  while ((match = MARKDOWN_LINK_PATTERN.exec(value)) !== null) {
    const [fullMatch, label, href] = match;
    if (match.index > lastIndex) {
      parts.push(value.slice(lastIndex, match.index));
    }

    parts.push(html`<a href=${href} target="_blank" rel="noopener noreferrer">${label}</a>`);
    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }

  return parts.length ? parts : [value];
}
