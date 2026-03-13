import { html } from 'lit';
import { DOWNLOADS, RESOURCE_LINKS } from '../config.js';
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

        <md-outlined-card class="panel motion-item" style="--delay: 38ms">
          <h2 class="section-title">
            <md-icon>system_update</md-icon>
            Flash preloader and latest firmware images (Recommended)
          </h2>
          <p>Before proceeding with PixelOS installation, ensure you have flashed the latest firmware images. This is especially important if:</p>
          <ul class="firmware-list">
            <li>You are upgrading from an older ROM build</li>
            <li>You want to flash engineering preloader</li>
          </ul>
          <div class="download-grid">
            <md-outlined-card class="download-item">
              <md-elevated-button
              href="https://sourceforge.net/projects/xagaproject/files/Pixelos-xaga/Preloader_xaga.zip/download"
              target="_blank"
              rel="noopener noreferrer">
              <md-icon slot="icon">download</md-icon>
              Download Latest Firmware Images
              </md-elevated-button>
              <small>Required for users upgrading from older ROM bases</small>
              </md-outlined-card>

              <md-outlined-card class="download-item">
              <md-elevated-button
              href="https://wiki.itsvixano.me/device_specific/preloader_xaga/"
              target="_blank"
              rel="noopener noreferrer">
              <md-icon slot="icon">menu_book</md-icon>
              Preloader Wiki
              </md-elevated-button>
              <small>Documentation for engineering preloader</small>
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
