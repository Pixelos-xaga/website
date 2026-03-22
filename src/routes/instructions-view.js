import { html } from 'lit';
import { motionStyle, renderCommandField, renderInfoCard } from '../lib/view-helpers.js';
import '@material/web/button/outlined-button.js';
import '@material/web/divider/divider.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/labs/card/filled-card.js';
import '@material/web/labs/card/outlined-card.js';

const BOOT_MODES = [
  {
    title: 'Recovery',
    description: 'With the device powered off, hold Volume Up + Power. Keep holding both buttons until the MI logo appears on the screen, then release.'
  },
  {
    title: 'Fastboot',
    description: 'With the device powered off, hold Volume Down + Power. Keep holding both buttons until the word FASTBOOT appears on the screen, then release.'
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
    title: 'Flash optional images',
    note: 'Flash these optional images if you ran into some issues.',
    optionalImages: [
      {
        name: 'vbmeta.img',
        description: 'Verified boot metadata image',
        command: 'fastboot flash vbmeta vbmeta.img'
      },
      {
        name: 'dtbo.img',
        description: 'Device tree overlay image',
        command: 'fastboot flash dtbo dtbo.img'
      }
    ]
  },
  {
    title: 'Reboot device',
    command: 'fastboot reboot'
  },
  {
    title: 'Boot into recovery manually',
    guidance: {
      avoid: 'adb reboot recovery',
      action: 'While the phone is turning on, keep pressing only the Volume Up button to enter recovery.'
    },
    note: 'In recovery, click Apply update, then Apply from ADB.',
    noteHighlighted: true
  },
  {
    title: 'Factory Reset (Recommended for clean flash)',
    isInfo: true,
    note: 'In recovery, go to "Wipe data/factory reset" -> "Format data" -> confirm. This ensures a clean installation and prevents potential issues.'
  },
  {
    title: 'Sideload ROM from recovery',
    command: 'adb sideload <rom-filename>.zip',
    copyable: false,
    note: 'In recovery, choose Apply update from ADB, then type this manually with your exact ROM zip filename.'
  }
];

const INSTALL_TIPS = [
  {
    label: 'Recovery prompt',
    title: 'Select the correct reboot option',
    paragraphs: [
      html`<p>After the package is installed, recovery may ask whether it should reboot back into recovery to install add-ons.</p>`
    ],
    callout: html`<p class="tip-callout">Choose <strong>Yes</strong> only if you want to install add-ons right away. Otherwise, select <strong>No</strong>.</p>`
  },
  {
    label: 'ADB sideload',
    title: '47% can still be a successful install',
    paragraphs: [
      html`<p>ADB usually finishes with <code>Total xfer: 1.00x</code>. On some systems, the sideload output stops at 47% even when the installation succeeds.</p>`
    ],
    statuses: [
      'adb: failed to read command: Success',
      'adb: failed to read command: No error',
      'adb: failed to read command: Undefined error: 0'
    ],
    callout: html`<p class="tip-callout">If recovery completes the installation successfully, these messages are normal.</p>`
  }
];

function renderGuidance({ avoid, action }) {
  return html`
    <div class="step-guidance">
      <div class="guidance-row warning">
        <span class="guidance-label">Avoid</span>
        <p class="guidance-text"><strong>Do not use ${avoid}.</strong></p>
      </div>
      <div class="guidance-row">
        <span class="guidance-label">Do this</span>
        <p class="guidance-text">${action}</p>
      </div>
    </div>
  `;
}

function renderOptionalImages(app, images) {
  return html`
    <details class="optional-images-dropdown">
      <summary class="dropdown-summary">
        <md-icon>expand_more</md-icon>
        <span>Click to expand optional images</span>
      </summary>
      <div class="dropdown-content">
        ${images.map((image) => html`
          <div class="optional-image-item">
            <div class="optional-image-info">
              <strong>${image.name}</strong>
              <p>${image.description}</p>
            </div>
            ${renderCommandField(app, image.command)}
          </div>
        `)}
      </div>
    </details>
  `;
}

function renderFlashStep(app, step) {
  if (step.isInfo) {
    return html`
      <li>
        ${renderInfoCard({
          icon: 'info',
          title: step.title,
          body: html`${step.note ? html`<p>${step.note}</p>` : ''}`
        })}
      </li>
    `;
  }

  return html`
    <li>
      <md-outlined-card class="command-item">
        <h3>${step.title}</h3>
        ${step.guidance ? renderGuidance(step.guidance) : ''}
        ${step.note ? html`<p class=${step.noteHighlighted ? 'step-note-highlighted' : ''}>${step.note}</p>` : ''}
        ${step.optionalImages ? renderOptionalImages(app, step.optionalImages) : ''}
        ${step.command ? renderCommandField(app, step.command, {
          label: step.copyable === false ? 'Type manually' : 'Command',
          copyable: step.copyable !== false
        }) : ''}
      </md-outlined-card>
    </li>
  `;
}

function renderTipEntry(tip, index) {
  return html`
    ${index > 0 ? html`<md-divider class="tip-divider"></md-divider>` : ''}
    <div class="tip-entry">
      <div class="tip-entry-header">
        <span class="tip-label">${tip.label}</span>
        <strong>${tip.title}</strong>
      </div>
      ${tip.paragraphs}
      ${tip.statuses ? html`
        <ul class="tip-status-list">
          ${tip.statuses.map((status) => html`<li><code>${status}</code></li>`)}
        </ul>
      ` : ''}
      ${tip.callout}
    </div>
  `;
}

export default function renderInstructionsView(app) {
  return html`
    <section class="view" aria-label="Instructions view">
      <md-filled-card class="warning-card motion-item" style=${motionStyle(10)}>
        <div class="warning-content">
          <md-icon>warning</md-icon>
          <p><strong>Never run</strong> <code class="warning-command">fastboot reboot recovery</code> on xaga.</p>
        </div>
      </md-filled-card>

      <div class="tools motion-item" style=${motionStyle(30)}>
        <md-outlined-button @click=${() => app.openDialog('safetyDialog')}>
          <md-icon slot="icon">gpp_bad</md-icon>
          Open Safety Dialog
        </md-outlined-button>
      </div>

      <section class="view-grid">
        <md-outlined-card class="panel motion-item" style=${motionStyle(40)}>
          <h2>Special Boot Modes</h2>
          <ul class="boot-modes-list" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
            ${BOOT_MODES.map((mode) => html`
              <li>
                <strong>${mode.title}</strong>
                <p>${mode.description}</p>
              </li>
            `)}
          </ul>
        </md-outlined-card>

        <md-outlined-card id="flash-steps-card" class="panel motion-item" style=${motionStyle(50)}>
          <h2 class="section-title">
            <md-icon aria-hidden="true">terminal</md-icon>
            Flash Steps (Type these commands in admin Terminal)
          </h2>
          <ol class="commands">${FLASH_STEPS.map((step) => renderFlashStep(app, step))}</ol>
          <md-divider class="panel-divider"></md-divider>

          ${renderInfoCard({
            icon: 'tips_and_updates',
            title: 'Installation Tips',
            className: 'tip-card motion-item',
            style: motionStyle(100),
            body: html`${INSTALL_TIPS.map((tip, index) => renderTipEntry(tip, index))}`
          })}
        </md-outlined-card>
      </section>
    </section>
  `;
}
