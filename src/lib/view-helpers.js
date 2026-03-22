import { html } from 'lit';

export const motionStyle = (delay) => `--delay: ${delay}ms`;

export function renderCopyButton(app, command, label = 'Copy command') {
  return html`
    <md-icon-button
      aria-label=${label}
      @click=${() => app.copyCommand(command)}>
      <md-icon>${app.copiedCommand === command ? 'check' : 'content_copy'}</md-icon>
    </md-icon-button>
  `;
}

export function renderCommandField(app, command, options = {}) {
  const { label = 'Command', copyable = true } = options;

  return html`
    <div class="command-row">
      <md-outlined-text-field
        class="command-field"
        label=${label}
        readonly
        .value=${command}></md-outlined-text-field>
      ${copyable ? renderCopyButton(app, command) : ''}
    </div>
  `;
}

export function renderCommandSnippet(app, command) {
  return html`
    <div class="command-row">
      <pre class="command-snippet">${command}</pre>
      ${renderCopyButton(app, command)}
    </div>
  `;
}

export function renderInfoCard({ icon, title, body, className = '', style = '' }) {
  const classes = ['info-card', className].filter(Boolean).join(' ');

  return html`
    <md-filled-card class=${classes} style=${style}>
      <div class="info-card-content">
        <md-icon>${icon}</md-icon>
        <div class="info-card-text">
          <h3>${title}</h3>
          ${body}
        </div>
      </div>
    </md-filled-card>
  `;
}

export function renderLinkCards(items, defaultIcon = 'download') {
  return items.map((item) => html`
    <md-outlined-card class="download-item">
      <md-elevated-button href=${item.href} target="_blank" rel="noopener noreferrer">
        <md-icon slot="icon">${item.icon || defaultIcon}</md-icon>
        ${item.name}
      </md-elevated-button>
      <small>${item.note || ''}</small>
    </md-outlined-card>
  `);
}

export function renderLinkSection(section) {
  const {
    title,
    items,
    delay,
    description = '',
    listItems = [],
    defaultIcon = 'download',
    headingIcon = ''
  } = section;

  return html`
    <md-outlined-card class="panel motion-item" style=${motionStyle(delay)}>
      ${headingIcon ? html`
        <h2 class="section-title">
          <md-icon>${headingIcon}</md-icon>
          ${title}
        </h2>
      ` : html`<h2>${title}</h2>`}
      ${description ? html`<p>${description}</p>` : ''}
      ${listItems.length ? html`
        <ul class="firmware-list">
          ${listItems.map((item) => html`<li>${item}</li>`)}
        </ul>
      ` : ''}
      <div class="download-grid">${renderLinkCards(items, defaultIcon)}</div>
    </md-outlined-card>
  `;
}
