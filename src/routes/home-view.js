import { html } from 'lit';
import '@material/web/chips/assist-chip.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/labs/card/filled-card.js';
import '@material/web/labs/card/elevated-card.js';

const HOME_SCREENSHOTS = [
  {
    src: '/screenshots/screenshot-1.jpg',
    alt: 'PixelOS home screen screenshot 1',
    width: 720,
    height: 1640
  },
  {
    src: '/screenshots/screenshot-2.jpg',
    alt: 'PixelOS home screen screenshot 2',
    width: 720,
    height: 1640
  },
  {
    src: '/screenshots/screenshot-3.jpg',
    alt: 'PixelOS system UI screenshot 1',
    width: 720,
    height: 1640
  },
  {
    src: '/screenshots/screenshot-4.jpg',
    alt: 'PixelOS system UI screenshot 2',
    width: 720,
    height: 1640
  }
];

export default function renderHomeView(app) {
  return html`
    <section class="view home-view" aria-label="Home view">
      <md-filled-card class="panel hero motion-item" style="--delay: 10ms">
        <md-assist-chip label="Official Device Hub"></md-assist-chip>
        <h1>PixelOS for Xaga</h1>
        <p class="lead">PixelOS A16 for xaga(REDMI K50i,Poco X4 GT,Redmi Note 11t/pro+).</p>
        <div class="hero-actions">
          <md-filled-button @click=${() => app.navigateToInstructions()}>
            <md-icon slot="icon">rocket_launch</md-icon>
            Open Instructions
          </md-filled-button>
          <md-filled-tonal-button @click=${() => app.navigate('downloads')}>
            <md-icon slot="icon">download</md-icon>
            Go to Downloads
          </md-filled-tonal-button>
        </div>
      </md-filled-card>

      <md-elevated-card class="panel screenshots-panel motion-item" style="--delay: 45ms">
        <h2>Screenshots</h2>
        <div class="screenshots-grid">
          ${HOME_SCREENSHOTS.map((shot) => html`
            <figure class="screenshot-item">
              <img
                src=${shot.src}
                alt=${shot.alt}
                width=${shot.width}
                height=${shot.height}
                loading="lazy"
                decoding="async"
                @load=${() => app.handleScreenshotSettled()}
                @error=${() => app.handleScreenshotSettled()} />
            </figure>
          `)}
        </div>
        ${app.pendingScreenshots > 0 ? html`
          <div class="screenshots-loader" role="status" aria-live="polite">
            <md-circular-progress indeterminate></md-circular-progress>
            <span>Loading screenshots...</span>
          </div>
        ` : ''}
      </md-elevated-card>

      <md-elevated-card class="panel motion-item" style="--delay: 80ms">
        <h2>What You Get</h2>
        <md-list>
          <md-list-item>
            <md-icon slot="start">terminal</md-icon>
            <div slot="headline">Install Guide</div>
            <div slot="supporting-text">Step-by-step flashing with copy actions.</div>
          </md-list-item>
          <md-list-item>
            <md-icon slot="start">download</md-icon>
            <div slot="headline">Download Hub</div>
            <div slot="supporting-text">ROM, boot, and vendor_boot entries.</div>
          </md-list-item>
          <md-list-item>
            <md-icon slot="start">shield</md-icon>
            <div slot="headline">Spoofing Notes</div>
            <div slot="supporting-text">Short post-install guidance panel.</div>
          </md-list-item>
          <md-list-item @click=${() => app.navigate('changelogs')} type="button">
            <md-icon slot="start">history</md-icon>
            <div slot="headline">Changelogs</div>
            <div slot="supporting-text">Track latest ROM updates and fixes.</div>
          </md-list-item>
        </md-list>
      </md-elevated-card>
    </section>
  `;
}
