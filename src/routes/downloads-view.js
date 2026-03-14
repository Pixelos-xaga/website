import { html } from 'lit';
import { DOWNLOADS, LATEST_XDA_POST, RESOURCE_LINKS } from '../config.js';
import '@material/web/button/elevated-button.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/labs/card/outlined-card.js';

const PLATFORM_TOOLS_CLI_COMMANDS = [
  {
    title: 'Ubuntu',
    command: 'sudo apt update\nsudo apt install android-sdk-platform-tools'
  },
  {
    title: 'Windows',
    command: 'winget install -e --id Google.PlatformTools'
  }
];

const PLATFORM_TOOLS_ZIP_OPTIONS = [
  {
    name: 'Windows ZIP',
    note: 'Official Google ZIP package',
    href: 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip'
  },
  {
    name: 'Linux ZIP (Ubuntu)',
    note: 'Official Google ZIP package',
    href: 'https://dl.google.com/android/repository/platform-tools-latest-linux.zip'
  }
];

const ROM_ARCHIVE_LINKS = [
  {
    name: 'All PixelOS xaga Builds',
    note: 'SourceForge archive for current and older ROM releases',
    href: 'https://sourceforge.net/projects/xagaproject/files/Pixelos-xaga/'
  }
];

export default function renderDownloadsView(app) {
  return html`
    <section class="view" aria-label="Downloads and resources view">
      <section class="view-grid">
        <md-outlined-card class="panel motion-item" style="--delay: 20ms">
          <h2>ROM Downloads</h2>
          <div class="download-grid">
            ${DOWNLOADS.map((item) => html`
              <md-outlined-card class="download-item">
                <md-elevated-button href=${item.href} target="_blank" rel="noopener noreferrer">
                  <md-icon slot="icon">download</md-icon>
                  ${item.name}
                </md-elevated-button>
                <small>${item.note}</small>
              </md-outlined-card>
            `)}
          </div>
        </md-outlined-card>

        <md-outlined-card class="panel motion-item" style="--delay: 28ms">
          <h2>ROM Build Archive</h2>
          <div class="download-grid">
            ${ROM_ARCHIVE_LINKS.map((item) => html`
              <md-outlined-card class="download-item">
                <md-elevated-button href=${item.href} target="_blank" rel="noopener noreferrer">
                  <md-icon slot="icon">history</md-icon>
                  ${item.name}
                </md-elevated-button>
                <small>${item.note}</small>
              </md-outlined-card>
            `)}
          </div>
        </md-outlined-card>

        <md-outlined-card class="panel motion-item" style="--delay: 33ms">
          <h2>Latest XDA Post</h2>
          <div class="download-grid">
            <md-outlined-card class="download-item">
              <md-elevated-button href=${LATEST_XDA_POST.href} target="_blank" rel="noopener noreferrer">
                <md-icon slot="icon">forum</md-icon>
                ${LATEST_XDA_POST.name}
              </md-elevated-button>
              <small>${LATEST_XDA_POST.note}</small>
            </md-outlined-card>
          </div>
        </md-outlined-card>

        <md-outlined-card class="panel motion-item" style="--delay: 38ms">
          <h2 class="section-title">
            <md-icon>system_update</md-icon>
            Preloader Resources
          </h2>
          <p>This section provides the preloader package and its documentation. Always use the preloader package for safety before proceeding.</p>
          <ul class="firmware-list">
            <li>Download the preloader package from the link below</li>
            <li>Read the wiki before flashing engineering preloader</li>
          </ul>
          <div class="download-grid">
            <md-outlined-card class="download-item">
              <md-elevated-button
              href="https://sourceforge.net/projects/xagaproject/files/Pixelos-xaga/Preloader_xaga.zip/download"
              target="_blank"
              rel="noopener noreferrer">
              <md-icon slot="icon">download</md-icon>
              Download Preloader Package
              </md-elevated-button>
              <small>Preloader package for xaga</small>
              </md-outlined-card>

              <md-outlined-card class="download-item">
              <md-elevated-button
              href="https://wiki.itsvixano.me/device_specific/preloader_xaga/"
              target="_blank"
              rel="noopener noreferrer">
              <md-icon slot="icon">menu_book</md-icon>
              Preloader Wiki
              </md-elevated-button>
              <small>Documentation for flashing and usage</small>
              </md-outlined-card>
              </div>          </md-outlined-card>

        <md-outlined-card class="panel motion-item" style="--delay: 55ms">
          <h2>Downloads & Resources</h2>
          <div class="download-grid">
            ${RESOURCE_LINKS.map((item) => html`
              <md-outlined-card class="download-item">
                <md-elevated-button href=${item.href} target="_blank" rel="noopener noreferrer">
                  <md-icon slot="icon">link</md-icon>
                  ${item.name}
                </md-elevated-button>
                <small>${item.note}</small>
              </md-outlined-card>
            `)}
          </div>
        </md-outlined-card>

        <md-outlined-card class="panel motion-item" style="--delay: 90ms">
          <h2>Install Platform-Tools</h2>
          <h3>Option 1: Install through CLI</h3>
          <p>Run these in terminal:</p>
          <ol class="commands">
            ${PLATFORM_TOOLS_CLI_COMMANDS.map((item) => html`
              <li>
                <md-outlined-card class="command-item">
                  <h3>${item.title}</h3>
                  <div class="command-row">
                    <pre class="command-snippet">${item.command}</pre>
                    <md-icon-button
                      aria-label="Copy command"
                      @click=${() => app.copyCommand(item.command)}>
                      <md-icon>${app.copiedCommand === item.command ? 'check' : 'content_copy'}</md-icon>
                    </md-icon-button>
                  </div>
                </md-outlined-card>
              </li>
            `)}
          </ol>
          <h3>Option 2: Install through ZIP</h3>
          <div class="download-grid">
            ${PLATFORM_TOOLS_ZIP_OPTIONS.map((item) => html`
              <md-outlined-card class="download-item">
                <md-elevated-button href=${item.href} target="_blank" rel="noopener noreferrer">
                  <md-icon slot="icon">folder_zip</md-icon>
                  ${item.name}
                </md-elevated-button>
                <small>${item.note}</small>
              </md-outlined-card>
            `)}
          </div>
        </md-outlined-card>
      </section>
    </section>
  `;
}
