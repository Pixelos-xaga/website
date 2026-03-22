import { html } from 'lit';
import { HOME_SCREENSHOTS } from '../home-screenshots.js';
import { motionStyle } from '../lib/view-helpers.js';
import '@material/web/chips/assist-chip.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/labs/card/filled-card.js';
import '@material/web/labs/card/elevated-card.js';

const HOME_FEATURES = [
  ['terminal', 'Install Guide', 'Step-by-step flashing with copy actions.'],
  ['download', 'Download Hub', 'ROM, boot, and vendor_boot entries.'],
  ['history', 'Changelogs', 'Track latest ROM updates and fixes.', 'changelogs']
];

export default function renderHomeView(app) {
  return html`
    <section class="view home-view" aria-label="Home view">
      <md-filled-card class="panel hero motion-item" style=${motionStyle(10)}>
        <md-assist-chip label="Official Device Hub"></md-assist-chip>
        <h1>PixelOS for Xaga</h1>
        <p class="lead">PixelOS A16 for xaga(REDMI K50i,Poco X4 GT,Redmi Note 11t/pro+).</p>
        <div class="hero-actions">
          <md-filled-button @click=${() => app.navigateToInstructions()}>
            <md-icon slot="icon">terminal</md-icon>
            Open Instructions
          </md-filled-button>
          <md-filled-tonal-button @click=${() => app.navigate('downloads')}>
            <md-icon slot="icon">download</md-icon>
            Go to Downloads
          </md-filled-tonal-button>
        </div>
      </md-filled-card>

      <md-elevated-card class="panel screenshots-panel motion-item" style=${motionStyle(45)}>
        <h2>Screenshots</h2>
        <div
          class="screenshots-strip"
          tabindex="0"
          aria-label="Horizontally scrollable screenshots">
          <div class="screenshots-track">
            ${HOME_SCREENSHOTS.map((shot) => html`
              <figure class="screenshot-item">
                <button
                  class="screenshot-button"
                  type="button"
                  aria-label=${`Open ${shot.alt}`}
                  @click=${() => app.openScreenshotViewer(shot)}>
                  <img
                    src=${shot.src}
                    alt=${shot.alt}
                    width=${shot.width}
                    height=${shot.height}
                    loading="lazy"
                    decoding="async"
                    @load=${() => app.handleScreenshotSettled()}
                    @error=${() => app.handleScreenshotSettled()} />
                </button>
              </figure>
            `)}
          </div>
        </div>
        ${app.pendingScreenshots > 0 ? html`
          <div class="screenshots-loader" role="status" aria-live="polite">
            <md-circular-progress indeterminate></md-circular-progress>
            <span>Loading screenshots...</span>
          </div>
        ` : ''}
      </md-elevated-card>

      <md-elevated-card class="panel motion-item" style=${motionStyle(80)}>
        <h2>What You Get</h2>
        <md-list>
          ${HOME_FEATURES.map(([icon, headline, supportingText, route]) => route
            ? html`
              <md-list-item type="button" @click=${() => app.navigate(route)}>
                <md-icon slot="start">${icon}</md-icon>
                <div slot="headline">${headline}</div>
                <div slot="supporting-text">${supportingText}</div>
              </md-list-item>
            `
            : html`
              <md-list-item>
                <md-icon slot="start">${icon}</md-icon>
                <div slot="headline">${headline}</div>
                <div slot="supporting-text">${supportingText}</div>
              </md-list-item>
            `)}
        </md-list>
      </md-elevated-card>
    </section>
  `;
}
