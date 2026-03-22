import { html } from 'lit';
import { renderMarkdownLinks } from '../lib/changelog-utils.js';
import { motionStyle } from '../lib/view-helpers.js';
import '@material/web/labs/card/outlined-card.js';

export default function renderChangelogsView(app) {
  if (!app.changelogs || app.changelogs.length === 0) {
    return html`
      <section class="view" aria-label="Changelogs view">
        <md-outlined-card class="panel motion-item">
          <p>No changelog entries yet.</p>
        </md-outlined-card>
      </section>
    `;
  }

  return html`
    <section class="view" aria-label="Changelogs view">
      <section class="view-grid">
        ${app.changelogs.map((log, index) => html`
          <md-outlined-card
            id=${`changelog-${log.date}`}
            class="panel changelog-card motion-item"
            style=${motionStyle(index * 20)}>
            <div class="changelog-header">
              <div class="changelog-title">
                <h2>${log.version}</h2>
                ${log.tag ? html`<span class="changelog-tag">${log.tag}</span>` : ''}
              </div>
              <button
                class="changelog-date changelog-date-link"
                type="button"
                title="Open link to this changelog"
                @click=${() => app.openChangelogDate(log.date)}>
                ${log.date}
              </button>
            </div>

            ${log.entries.map((entry) => html`
              <div class="changelog-entry">
                <h4>${entry.type}</h4>
                <ul class="changelog-list">
                  ${entry.items.map((item) => html`<li>${renderMarkdownLinks(item)}</li>`)}
                </ul>
              </div>
            `)}
          </md-outlined-card>
        `)}
      </section>
    </section>
  `;
}
