import { html } from 'lit';
import { DOWNLOAD_SECTIONS, PLATFORM_TOOLS_CLI_COMMANDS, PLATFORM_TOOLS_ZIP_OPTIONS } from '../config.js';
import { motionStyle, renderCommandSnippet, renderLinkCards, renderLinkSection } from '../lib/view-helpers.js';
import '@material/web/button/elevated-button.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/labs/card/outlined-card.js';

export default function renderDownloadsView(app) {
  return html`
    <section class="view" aria-label="Downloads and resources view">
      <section class="view-grid">
        ${DOWNLOAD_SECTIONS.map((section) => renderLinkSection(section))}
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
          <div class="download-grid">${renderLinkCards(PLATFORM_TOOLS_ZIP_OPTIONS, 'folder_zip')}</div>
        </md-outlined-card>
      </section>
    </section>
  `;
}
