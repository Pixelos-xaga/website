import { LitElement, css, html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';

const DOWNLOADS = [
  {
    name: 'ROM Zip',
    note: 'PixelOS_xaga.zip',
    href: 'https://pixelos.net/download/xaga'
  },
  {
    name: 'boot.img',
    note: 'Kernel boot image',
    href: 'https://github.com/Pixelos-xaga'
  },
  {
    name: 'vendor_boot.img',
    note: 'Vendor boot image',
    href: 'https://github.com/Pixelos-xaga'
  }
];

const FLASH_STEPS = [
  {
    title: 'Reboot to bootloader',
    command: 'adb reboot bootloader'
  },
  {
    title: 'Flash boot image',
    command: 'fastboot flash boot boot.img'
  },
  {
    title: 'Flash vendor boot image',
    command: 'fastboot flash vendor_boot vendor_boot.img'
  },
  {
    title: 'Sideload ROM from recovery',
    command: 'adb sideload PixelOS_xaga.zip',
    note: 'Use hardware keys to enter recovery. Never run fastboot reboot recovery on xaga.'
  },
  {
    title: 'Boot system',
    command: 'adb reboot'
  }
];

class PixelosApp extends LitElement {
  static properties = {
    route: { state: true },
    motionKey: { state: true },
    copiedCommand: { state: true },
    copyMessage: { state: true }
  };

  static styles = css`
    :host {
      --font-brand: "Google Sans", "Roboto", "Noto Sans", "Segoe UI", sans-serif;
      --font-plain: "Google Sans Text", "Roboto", "Noto Sans", "Segoe UI", sans-serif;
      --font-mono: "Google Sans Mono", "Roboto Mono", "Consolas", monospace;

      --md-ref-typeface-brand: var(--font-brand);
      --md-ref-typeface-plain: var(--font-plain);

      --md-sys-color-primary: #aec6ff;
      --md-sys-color-on-primary: #0e2f63;
      --md-sys-color-primary-container: #284777;
      --md-sys-color-on-primary-container: #d9e2ff;
      --md-sys-color-secondary: #c0c6dc;
      --md-sys-color-on-secondary: #2a3040;
      --md-sys-color-secondary-container: #414757;
      --md-sys-color-on-secondary-container: #dce2f8;
      --md-sys-color-tertiary: #dfbce5;
      --md-sys-color-on-tertiary: #402746;
      --md-sys-color-background: #10131a;
      --md-sys-color-on-background: #e3e2ea;
      --md-sys-color-surface: #121722;
      --md-sys-color-on-surface: #e3e2ea;
      --md-sys-color-surface-container-low: #171c26;
      --md-sys-color-surface-container: #1b202b;
      --md-sys-color-surface-container-high: #242a38;
      --md-sys-color-surface-container-highest: #2c3242;
      --md-sys-color-outline: #8f93a2;
      --md-sys-color-on-surface-variant: #c4c8d7;
      --md-sys-color-error: #ffb4ab;
      --md-sys-color-error-container: #93000a;
      --md-sys-color-shadow: #000;

      --md-sys-elevation-level1: 0px 1px 2px 0px rgb(0 0 0 / 30%), 0px 1px 3px 1px rgb(0 0 0 / 15%);

      --motion-standard: cubic-bezier(0.2, 0, 0, 1);
      --motion-emphasized: cubic-bezier(0.2, 0, 0, 1);

      color-scheme: dark;
      display: block;
      min-height: 100dvh;
      background: var(--md-sys-color-background);
      color: var(--md-sys-color-on-background);
      font-family: var(--font-plain);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .shell {
      width: min(100% - 2rem, 1100px);
      margin: 0 auto;
      padding: 1rem 0 1.8rem;
    }

    .top-bar {
      border-radius: 28px;
      background: var(--md-sys-color-surface-container-high);
      box-shadow: var(--md-sys-elevation-level1), inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 14%, transparent);
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 0.9rem;
      padding: 0.72rem 1rem;
      margin-bottom: 1rem;
    }

    .brand {
      font-family: var(--font-brand);
      font-weight: 700;
      font-size: 1.06rem;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--md-sys-color-on-surface);
      text-decoration: none;
    }

    .brand .material-symbols-outlined {
      font-size: 20px;
      color: var(--md-sys-color-primary);
    }

    md-tabs {
      justify-self: end;
      padding: 0.2rem;
      border-radius: 999px;
      background: var(--md-sys-color-surface-container);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 14%, transparent);
      --md-primary-tab-active-indicator-color: var(--md-sys-color-primary);
      --md-primary-tab-active-label-text-color: var(--md-sys-color-primary);
      --md-primary-tab-inactive-label-text-color: var(--md-sys-color-on-surface-variant);
      --md-primary-tab-active-indicator-height: 0px;
      --md-primary-tab-active-indicator-shape: 999px;
      --md-primary-tab-container-height: 44px;
      --md-primary-tab-container-shape: 999px;
    }

    md-tabs::part(divider) {
      display: none;
    }

    md-primary-tab {
      border-radius: 999px;
      margin-inline: 2px;
    }

    md-primary-tab[active] {
      background: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
    }

    .view {
      animation: shared-axis-in 320ms var(--motion-emphasized);
    }

    .panel {
      border-radius: 20px;
      padding: 1.15rem;
      background: var(--md-sys-color-surface-container-low);
      box-shadow: var(--md-sys-elevation-level1), inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 14%, transparent);
    }

    .hero {
      border-radius: 28px;
      padding: clamp(1.2rem, 3vw, 2rem);
    }

    .motion-item {
      opacity: 0;
      transform: translateY(14px);
      animation: rise-in 350ms var(--motion-standard) forwards;
      animation-delay: var(--delay, 0ms);
    }

    h1,
    h2,
    h3 {
      margin: 0 0 0.56rem;
      line-height: 1.25;
      font-family: var(--font-brand);
      font-weight: 500;
      color: var(--md-sys-color-on-surface);
    }

    h1 {
      margin-top: 0.85rem;
      font-size: clamp(2rem, 4.6vw, 3.25rem);
    }

    h2 {
      font-size: clamp(1.2rem, 2.6vw, 1.8rem);
    }

    h3 {
      font-size: 1.02rem;
    }

    p,
    li,
    small {
      color: var(--md-sys-color-on-surface-variant);
    }

    .lead {
      margin: 0;
      max-width: 70ch;
    }

    .hero-actions {
      margin-top: 1.15rem;
      display: flex;
      gap: 0.7rem;
      flex-wrap: wrap;
      align-items: center;
    }

    md-filled-button,
    md-filled-tonal-button,
    md-outlined-button,
    md-text-button,
    md-assist-chip,
    md-outlined-text-field,
    md-icon-button,
    md-list-item,
    md-dialog {
      --md-ref-typeface-brand: var(--font-brand);
      --md-ref-typeface-plain: var(--font-plain);
    }

    md-filled-button {
      --md-filled-button-container-height: 40px;
      --md-filled-button-container-shape: 999px;
    }

    md-filled-tonal-button {
      --md-filled-tonal-button-container-height: 40px;
      --md-filled-tonal-button-container-shape: 999px;
    }

    md-outlined-button {
      --md-outlined-button-container-height: 40px;
      --md-outlined-button-container-shape: 999px;
      --md-outlined-button-outline-color: color-mix(in srgb, var(--md-sys-color-outline) 55%, transparent);
    }

    md-list {
      border-radius: 16px;
      overflow: hidden;
      margin-top: 0.65rem;
      --md-list-container-color: transparent;
    }

    md-list-item {
      --md-list-item-leading-icon-color: var(--md-sys-color-primary);
      --md-list-item-label-text-color: var(--md-sys-color-on-surface);
      --md-list-item-supporting-text-color: var(--md-sys-color-on-surface-variant);
      border-radius: 14px;
      margin-bottom: 0.45rem;
      background: var(--md-sys-color-surface-container-high);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 12%, transparent);
    }

    .view-grid {
      margin-top: 1rem;
      display: grid;
      gap: 1rem;
    }

    .warning {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      border-radius: 16px;
      padding: 0.78rem 0.96rem;
      color: var(--md-sys-color-error);
      background: color-mix(in srgb, var(--md-sys-color-error-container) 36%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-error) 55%, transparent);
    }

    .warning p {
      margin: 0;
      color: var(--md-sys-color-error);
    }

    .tools {
      display: flex;
      justify-content: flex-end;
      margin-top: 0.8rem;
    }

    .content-grid {
      margin-top: 0.8rem;
      display: grid;
      gap: 1rem;
      grid-template-columns: 1.45fr 0.9fr;
    }

    .download-grid {
      margin-top: 0.65rem;
      display: grid;
      gap: 0.7rem;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }

    .download-item {
      border-radius: 14px;
      padding: 0.72rem;
      background: var(--md-sys-color-surface-container-high);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 12%, transparent);
      display: grid;
      gap: 0.35rem;
    }

    .commands {
      margin: 0.8rem 0 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.85rem;
    }

    .commands li {
      border-radius: 14px;
      padding: 0.75rem;
      background: var(--md-sys-color-surface-container-high);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 11%, transparent);
    }

    .commands p {
      margin: 0.2rem 0 0;
    }

    .command-row {
      margin-top: 0.45rem;
      display: flex;
      gap: 0.45rem;
      align-items: center;
    }

    .command-field {
      flex: 1;
      --md-outlined-text-field-container-shape: 14px;
      --md-outlined-text-field-input-text-font: 500 13px/1.4 var(--font-mono);
      --md-outlined-text-field-input-text-color: var(--md-sys-color-on-surface);
      --md-outlined-text-field-label-text-color: var(--md-sys-color-on-surface-variant);
    }

    .copy {
      --md-icon-button-icon-color: var(--md-sys-color-primary);
      --md-icon-button-state-layer-color: var(--md-sys-color-primary);
    }

    .spoof-list {
      margin: 0.75rem 0 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.55rem;
    }

    .spoof-list li {
      border-radius: 14px;
      padding: 0.66rem;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem;
      background: var(--md-sys-color-surface-container-high);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 11%, transparent);
    }

    .spoof-list .material-symbols-outlined {
      color: var(--md-sys-color-primary);
      font-size: 20px;
      margin-top: 1px;
    }

    .spoof-list strong {
      color: var(--md-sys-color-on-surface);
      display: block;
      font-family: var(--font-brand);
      font-weight: 500;
    }

    .spoof-list p {
      margin: 0.12rem 0 0;
    }

    .dialog-content p {
      margin: 0 0 0.65rem;
      color: var(--md-sys-color-on-surface-variant);
    }

    .dialog-content ul {
      margin: 0;
      padding-left: 1.1rem;
      color: var(--md-sys-color-on-surface-variant);
    }

    .footer {
      margin-top: 1rem;
      border-radius: 18px;
      padding: 0.8rem 1rem;
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
      background: var(--md-sys-color-surface-container-low);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 11%, transparent);
      color: var(--md-sys-color-on-surface-variant);
      font-size: 0.95rem;
    }

    .footer a {
      color: var(--md-sys-color-primary);
      text-decoration: none;
      font-weight: 500;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }

    md-dialog {
      --md-dialog-container-color: var(--md-sys-color-surface-container-high);
      --md-dialog-headline-color: var(--md-sys-color-on-surface);
      --md-dialog-supporting-text-color: var(--md-sys-color-on-surface-variant);
      --md-dialog-container-shape: 20px;
    }

    .material-symbols-outlined {
      font-family: "Material Symbols Outlined";
      font-weight: normal;
      font-style: normal;
      line-height: 1;
    }

    @keyframes shared-axis-in {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.992);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes rise-in {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .view,
      .motion-item {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }

    @media (max-width: 940px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 760px) {
      .top-bar {
        grid-template-columns: 1fr;
        border-radius: 20px;
      }

      md-tabs {
        justify-self: start;
      }

      .command-row {
        align-items: stretch;
      }
    }
  `;

  constructor() {
    super();
    this.route = 'home';
    this.motionKey = 0;
    this.copiedCommand = '';
    this.copyMessage = '';
    this.handleHashChange = this.handleHashChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', this.handleHashChange);
    this.handleHashChange();
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this.handleHashChange);
    super.disconnectedCallback();
  }

  handleHashChange() {
    const raw = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const nextRoute = raw.startsWith('instructions') ? 'instructions' : 'home';

    if (this.route !== nextRoute) {
      this.route = nextRoute;
      this.motionKey += 1;
    }
  }

  navigate(route) {
    const hash = route === 'instructions' ? '#/instructions' : '#/';
    if (window.location.hash !== hash) {
      window.location.hash = hash;
      return;
    }

    this.route = route;
    this.motionKey += 1;
  }

  openDialog(id) {
    const dialog = this.renderRoot?.querySelector(`#${id}`);
    if (dialog && typeof dialog.show === 'function') {
      dialog.show();
    }
  }

  closeDialog(id) {
    const dialog = this.renderRoot?.querySelector(`#${id}`);
    if (dialog && typeof dialog.close === 'function') {
      dialog.close();
    }
  }

  async copyCommand(command) {
    try {
      await navigator.clipboard.writeText(command);
      this.copiedCommand = command;
      this.copyMessage = `Copied: ${command}`;
      setTimeout(() => {
        if (this.copiedCommand === command) {
          this.copiedCommand = '';
        }
      }, 1200);
    } catch {
      this.copyMessage = 'Copy failed';
    }
  }

  renderTopBar() {
    return html`
      <header class="top-bar">
        <a class="brand" href="#/" @click=${(event) => {
          event.preventDefault();
          this.navigate('home');
        }}>
          <span class="material-symbols-outlined">android</span>
          <span>PixelOS Xaga</span>
        </a>

        <md-tabs>
          <md-primary-tab
            ?active=${this.route === 'home'}
            @click=${() => this.navigate('home')}>
            <md-icon slot="icon">home</md-icon>
            Home
          </md-primary-tab>
          <md-primary-tab
            ?active=${this.route === 'instructions'}
            @click=${() => this.navigate('instructions')}>
            <md-icon slot="icon">terminal</md-icon>
            Instructions
          </md-primary-tab>
        </md-tabs>
      </header>
    `;
  }

  renderHomeView() {
    return html`
      <section class="view" aria-label="Home view">
        <article class="panel hero motion-item" style="--delay: 10ms">
          <md-assist-chip label="Official Device Hub"></md-assist-chip>
          <h1>PixelOS for Xaga</h1>
          <p class="lead">Material Web powered install portal with ROM downloads, flash commands, and spoofing notes.</p>
          <div class="hero-actions">
            <md-filled-button @click=${() => this.navigate('instructions')}>
              <md-icon slot="icon">rocket_launch</md-icon>
              Open Instructions
            </md-filled-button>
            <md-filled-tonal-button @click=${() => this.navigate('instructions')}>
              <md-icon slot="icon">download</md-icon>
              Go to Downloads
            </md-filled-tonal-button>
            <md-outlined-button @click=${() => this.openDialog('aboutDialog')}>
              <md-icon slot="icon">info</md-icon>
              Framework Details
            </md-outlined-button>
          </div>
        </article>

        <article class="panel motion-item" style="--delay: 70ms">
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
          </md-list>
        </article>
      </section>
    `;
  }

  renderInstructionsView() {
    return html`
      <section class="view" aria-label="Instructions view">
        <section class="warning motion-item" style="--delay: 10ms">
          <md-icon>warning</md-icon>
          <p><strong>Never run</strong> <code>fastboot reboot recovery</code> on xaga.</p>
        </section>

        <div class="tools motion-item" style="--delay: 30ms">
          <md-outlined-button @click=${() => this.openDialog('safetyDialog')}>
            <md-icon slot="icon">gpp_bad</md-icon>
            Open Safety Dialog
          </md-outlined-button>
        </div>

        <div class="content-grid">
          <section class="view-grid">
            <article class="panel motion-item" style="--delay: 50ms">
              <h2 id="downloads">Downloads</h2>
              <div class="download-grid">
                ${DOWNLOADS.map((item) => html`
                  <div class="download-item">
                    <md-filled-button href=${item.href} target="_blank">
                      <md-icon slot="icon">download</md-icon>
                      ${item.name}
                    </md-filled-button>
                    <small>${item.note}</small>
                  </div>
                `)}
              </div>
            </article>

            <article class="panel motion-item" style="--delay: 90ms">
              <h2>Flash Steps</h2>
              <ol class="commands">
                ${FLASH_STEPS.map((step) => html`
                  <li>
                    <h3>${step.title}</h3>
                    ${step.note ? html`<p>${step.note}</p>` : ''}
                    <div class="command-row">
                      <md-outlined-text-field
                        class="command-field"
                        label="Command"
                        readonly
                        .value=${step.command}></md-outlined-text-field>
                      <md-icon-button
                        class="copy"
                        aria-label="Copy command"
                        @click=${() => this.copyCommand(step.command)}>
                        <md-icon>${this.copiedCommand === step.command ? 'check' : 'content_copy'}</md-icon>
                      </md-icon-button>
                    </div>
                  </li>
                `)}
              </ol>
            </article>
          </section>

          <aside>
            <article class="panel motion-item" style="--delay: 120ms">
              <h2>Spoofing Guide</h2>
              <p>Keep this section short and update-safe. Replace with your latest tested method.</p>
              <ul class="spoof-list">
                <li>
                  <span class="material-symbols-outlined">check_circle</span>
                  <div>
                    <strong>Finish first boot first</strong>
                    <p>Complete setup and sign in before spoofing work.</p>
                  </div>
                </li>
                <li>
                  <span class="material-symbols-outlined">extension</span>
                  <div>
                    <strong>Install module stack</strong>
                    <p>Install only modules required for your method.</p>
                  </div>
                </li>
                <li>
                  <span class="material-symbols-outlined">delete_sweep</span>
                  <div>
                    <strong>Clear Google app data</strong>
                    <p>Clear Play Store and Play Services after fingerprint changes.</p>
                  </div>
                </li>
                <li>
                  <span class="material-symbols-outlined">verified</span>
                  <div>
                    <strong>Reboot and verify</strong>
                    <p>Reboot once and verify certification and login status.</p>
                  </div>
                </li>
              </ul>
            </article>
          </aside>
        </div>
      </section>
    `;
  }

  render() {
    return html`
      <div class="shell">
        ${this.renderTopBar()}
        ${keyed(this.motionKey, this.route === 'instructions' ? this.renderInstructionsView() : this.renderHomeView())}

        <footer class="footer">
          <span>PixelOS Xaga community website</span>
          <a href="https://github.com/Pixelos-xaga/website" target="_blank" rel="noopener noreferrer">GitHub</a>
        </footer>

        <md-dialog id="aboutDialog">
          <div slot="headline">Framework Stack</div>
          <div slot="content" class="dialog-content">
            <p>This site now uses Material Web with Lit and Vite, following the Material web development approach.</p>
            <p>Material components are used directly with M3 color roles, typography tokens, and built-in motion + state layer behavior.</p>
          </div>
          <div slot="actions">
            <md-text-button @click=${() => this.closeDialog('aboutDialog')}>Close</md-text-button>
          </div>
        </md-dialog>

        <md-dialog id="safetyDialog">
          <div slot="headline">Xaga Flash Safety</div>
          <div slot="content" class="dialog-content">
            <p>Always verify these before flashing:</p>
            <ul>
              <li>Use matching <code>boot.img</code> and <code>vendor_boot.img</code> from the same release.</li>
              <li>Do not run <code>fastboot reboot recovery</code> on xaga.</li>
              <li>Keep stock firmware available for recovery.</li>
            </ul>
          </div>
          <div slot="actions">
            <md-text-button @click=${() => this.closeDialog('safetyDialog')}>Close</md-text-button>
          </div>
        </md-dialog>

        <div class="sr-only" aria-live="polite">${this.copyMessage}</div>
      </div>
    `;
  }
}

customElements.define('pixelos-app', PixelosApp);
