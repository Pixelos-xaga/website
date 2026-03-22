import { html } from 'lit';
import { renderMarkdownLinks } from '../lib/changelog-utils.js';
import { motionStyle } from '../lib/view-helpers.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import '@material/web/switch/switch.js';
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

  const visibleLogs = app.changelogsLatestFirst === false
    ? [...app.changelogs].reverse()
    : app.changelogs;

  return html`
    <section class="view" aria-label="Changelogs view">
      <md-outlined-card class="panel motion-item changelog-toolbar-panel" style=${motionStyle(10)}>
        <div class="changelog-toolbar">
          <div class="changelog-toolbar-controls">
            <md-outlined-select
              class="changelog-select"
              label="Release"
              .value=${app.selectedChangelogDate || visibleLogs[0]?.date || ''}
              @change=${(event) => app.openChangelogDate(event.target.value)}>
              ${visibleLogs.map((log) => html`
                <md-select-option
                  value=${log.date}
                  display-text=${`${log.version} · ${log.date}`}>
                  <span slot="headline">${log.version}</span>
                  <span slot="supporting-text">${log.date}</span>
                </md-select-option>
              `)}
            </md-outlined-select>
            <div class="changelog-order-toggle">
              <div class="changelog-order-copy">
                <strong>Latest first</strong>
                <span>Flip the changelog order without changing the selected build.</span>
              </div>
              <md-switch
                icons
                .selected=${app.changelogsLatestFirst !== false}
                @change=${(event) => {
                  app.changelogsLatestFirst = event.target.selected;
                }}></md-switch>
            </div>
          </div>
        </div>
      </md-outlined-card>

      <section class="view-grid">
        ${visibleLogs.map((log, index) => html`
          <md-outlined-card
            id=${`changelog-${log.date}`}
            class="panel changelog-card motion-item ${app.selectedChangelogDate === log.date ? 'active' : ''}"
            style=${motionStyle(25 + (index * 20))}>
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
