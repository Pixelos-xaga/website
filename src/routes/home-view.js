import { html } from 'lit';
import { HOME_SCREENSHOTS } from '../home-screenshots.js';
import { motionStyle } from '../lib/view-helpers.js';
import '@material/web/chips/assist-chip.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/labs/card/filled-card.js';
import '@material/web/labs/card/elevated-card.js';

const HOME_FEATURES = [
  ['terminal', 'Install Guide', 'Step-by-step flashing with copy actions.', 'instructions'],
  ['download', 'Download Hub', 'ROM, boot, and vendor_boot entries.', 'downloads'],
  ['history', 'Changelogs', 'Track latest ROM updates and fixes.', 'changelogs'],
  ['build_circle', 'Troubleshooting', 'Reporting issues, logcats, and support basics.', 'troubleshooting']
];

function renderHomeFeatureTile(app, [icon, headline, supportingText, route]) {
  return html`
    <md-list-item
      type=${route ? 'button' : 'item'}
      @click=${route ? () => app.navigate(route) : null}>
      <md-icon slot="start">${icon}</md-icon>
      <div slot="headline">${headline}</div>
      <div slot="supporting-text">${supportingText}</div>
      ${route ? html`<md-icon slot="end">arrow_forward</md-icon>` : ''}
    </md-list-item>
  `;
}

export default function renderHomeView(app) {
  return html`
    <section class="view home-view" aria-label="Home view">
      <md-filled-card class="panel hero motion-item" style=${motionStyle(10)}>
        <md-assist-chip label="Official Device Hub"></md-assist-chip>
        <h1>PixelOS for Xaga</h1>
        <p class="lead">PixelOS A16 for xaga(REDMI K50i,Poco X4 GT,Redmi Note 11t/Pro+).</p>
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
                    loading="eager"
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
            <span>
              Loading screenshots...
              ${app.pendingScreenshots > 0 ? html`${app.pendingScreenshots} remaining.` : ''}
            </span>
            <md-linear-progress indeterminate></md-linear-progress>
          </div>
        ` : ''}
      </md-elevated-card>

      <md-elevated-card class="panel motion-item" style=${motionStyle(80)}>
        <h2>What You Get</h2>
        <md-list style="background: transparent; padding: 0;">
          ${HOME_FEATURES.map((feature) => renderHomeFeatureTile(app, feature))}
        </md-list>
      </md-elevated-card>
    </section>
  `;
}
