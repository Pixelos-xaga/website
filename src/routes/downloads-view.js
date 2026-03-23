import { html } from 'lit';
import { DOWNLOAD_SECTIONS, PLATFORM_TOOLS_CLI_COMMANDS, PLATFORM_TOOLS_ZIP_OPTIONS } from '../config.js';
import { motionStyle, renderCommandSnippet, renderLinkCards, renderLinkSection } from '../lib/view-helpers.js';
import '@material/web/button/elevated-button.js';
import '@material/web/chips/chip-set.js';
import '@material/web/chips/filter-chip.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/labs/card/outlined-card.js';

const DOWNLOAD_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'rom', label: 'ROM' },
  { id: 'archive', label: 'Archive' },
  { id: 'preloader', label: 'Preloader' },
  { id: 'resources', label: 'Resources' },
  { id: 'tools', label: 'Platform-Tools' }
];

const SECTION_FILTERS = {
  rom: 'rom',
  archive: 'archive',
  xda: 'resources',
  preloader: 'preloader',
  resources: 'resources'
};

const matchesDownloadFilter = (filterId, sectionId) =>
  filterId === 'all' || SECTION_FILTERS[sectionId] === filterId;

export default function renderDownloadsView(app) {
  const activeFilter = app.downloadsFilter || 'all';
  const visibleSections = DOWNLOAD_SECTIONS.filter((section) => matchesDownloadFilter(activeFilter, section.id));
  const showPlatformTools = activeFilter === 'all' || activeFilter === 'tools';

  return html`
    <section class="view" aria-label="Downloads and resources view">
      <md-chip-set class="downloads-filter-set" aria-label="Filter downloads sections">
        ${DOWNLOAD_FILTERS.map((filter) => {
          const isSelected = activeFilter === filter.id;
          return html`
            <md-filter-chip
              class="downloads-filter-chip"
              .selected=${isSelected}
              @click=${() => {
                app.downloadsFilter = filter.id;
              }}>
              ${isSelected ? html`<md-icon slot="icon">check</md-icon>` : ''}
              ${filter.label}
            </md-filter-chip>
          `;
        })}
      </md-chip-set>

      <section class="view-grid">
        ${visibleSections.map((section) => renderLinkSection(app, section))}
        ${showPlatformTools ? html`
          <md-outlined-card class="panel motion-item" style=${motionStyle(90)}>
            <h2>Install Platform-Tools</h2>
            <h3>Option 1: Install through CLI</h3>
            <p>Run these in terminal:</p>
            <ol class="commands">
              ${PLATFORM_TOOLS_CLI_COMMANDS.map((item) => html`
                <li>
                  <md-outlined-card class="command-item">
                    <h3>${item.title}</h3>
                    ${renderCommandSnippet(app, item.command)}
                  </md-outlined-card>
                </li>
              `)}
            </ol>
            <h3>Option 2: Install through ZIP</h3>
            <div class="download-grid">${renderLinkCards(app, PLATFORM_TOOLS_ZIP_OPTIONS, 'folder_zip')}</div>
          </md-outlined-card>
        ` : ''}
      </section>
    </section>
  `;
}
