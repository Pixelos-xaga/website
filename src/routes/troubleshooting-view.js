import { html } from 'lit';
import { motionStyle, renderCommandField, renderInfoCard } from '../lib/view-helpers.js';
import '@material/web/button/elevated-button.js';
import '@material/web/labs/card/filled-card.js';
import '@material/web/labs/card/outlined-card.js';

const SUPPORT_GUIDELINES = [
  html`Unexpected issues can happen while using PixelOS. The fastest way to get help is to share a clear description of the problem and the right logs.`,
  html`Support is only available for stock PixelOS setups. If you flashed a custom kernel or made other ROM modifications, your issue needs to be reproduced on an unmodified build first.`,
  html`For crashes or when support asks for it, attach a <code>logcat</code>. Minor visual glitches usually do not need one.`
];

const LOGCAT_STEPS = [
  {
    title: 'Enable Developer options',
    description: html`Open <code>Settings</code> -> <code>About phone</code> and tap <code>Build number</code> seven times.`
  },
  {
    title: 'Turn on USB debugging',
    description: html`Open <code>Settings</code> -> <code>System</code> -> <code>Developer options</code>, then enable <code>USB debugging</code>.`
  },
  {
    title: 'Start logging from your PC',
    description: html`Open the latest <code>ADB & Fastboot tools</code> on your computer and run this command:`,
    command: 'adb logcat -b all > logcat.log'
  }
];

function renderLogcatStep(app, step) {
  return html`
    <li>
      <md-outlined-card class="command-item">
        <h3>${step.title}</h3>
        <p>${step.description}</p>
        ${step.command ? renderCommandField(app, step.command) : ''}
      </md-outlined-card>
    </li>
  `;
}

export default function renderTroubleshootingView(app) {
  return html`
    <section class="view" aria-label="Troubleshooting view">
      <md-filled-card class="warning-card motion-item" style=${motionStyle(10)}>
        <div class="warning-content">
          <md-icon>build_circle</md-icon>
          <p><strong>Ask for help on stock PixelOS.</strong> Custom kernels and other ROM modifications are outside support scope.</p>
        </div>
      </md-filled-card>

      <section class="view-grid">
        <md-outlined-card class="panel motion-item" style=${motionStyle(30)}>
          <h2 class="section-title">
            <md-icon aria-hidden="true">forum</md-icon>
            Report an Issue
          </h2>
          ${SUPPORT_GUIDELINES.map((item) => html`<p>${item}</p>`)}
          <div class="hero-actions">
            <md-elevated-button href="https://t.me/XAGASupport" target="_blank" rel="noopener noreferrer">
              <md-icon slot="icon">send</md-icon>
              Open Telegram Support
            </md-elevated-button>
          </div>
        </md-outlined-card>

        <md-outlined-card class="panel motion-item" style=${motionStyle(50)}>
          <h2 class="section-title">
            <md-icon aria-hidden="true">terminal</md-icon>
            Collect a Logcat
          </h2>
          <ol class="commands">${LOGCAT_STEPS.map((step) => renderLogcatStep(app, step))}</ol>

          ${renderInfoCard({
            icon: 'tips_and_updates',
            title: 'After logging',
            className: 'tip-card motion-item',
            style: motionStyle(75),
            body: html`
              <p>Reproduce the issue while <code>adb logcat</code> is running, then press <code>CTRL + C</code> to stop logging.</p>
              <p>Share the generated <code>logcat.log</code> file together with your issue report so support can inspect the failure properly.</p>
            `
          })}
        </md-outlined-card>
      </section>
    </section>
  `;
}
