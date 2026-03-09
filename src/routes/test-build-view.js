import { html } from 'lit';
import { TEST_DOWNLOADS } from '../config.js';
import '@material/web/button/elevated-button.js';
import '@material/web/labs/card/outlined-card.js';

export default function renderTestBuildView() {
  return html`
    <section class="view" aria-label="Test builds view">
      <section class="view-grid">
        <md-outlined-card class="panel motion-item" style="--delay: 20ms">
          <h2>Test Builds</h2>
          <div class="download-grid">
            ${TEST_DOWNLOADS.map((item) => html`
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
      </section>
    </section>
  `;
}
