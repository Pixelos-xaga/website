import { html } from 'lit';
import '@material/web/button/outlined-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/labs/card/filled-card.js';
import '@material/web/labs/card/outlined-card.js';

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
    isDropdown: true,
    note: 'Flash these optional images if you ran into some issues.',
    optionalImages: [
      {
        name: 'vbmeta.img',
        command: 'fastboot flash vbmeta vbmeta.img',
        description: 'Verified boot metadata image'
      },
      {
        name: 'dtbo.img',
        command: 'fastboot flash dtbo dtbo.img',
        description: 'Device tree overlay image'
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

export default function renderInstructionsView(app) {
  return html`
    <section class="view" aria-label="Instructions view">
      <md-filled-card class="warning-card motion-item" style="--delay: 10ms">
        <div class="warning-content">
          <md-icon>warning</md-icon>
          <p><strong>Never run</strong> <code class="warning-command">fastboot reboot recovery</code> on xaga.</p>
        </div>
      </md-filled-card>

      <div class="tools motion-item" style="--delay: 30ms">
        <md-outlined-button @click=${() => app.openDialog('safetyDialog')}>
          <md-icon slot="icon">gpp_bad</md-icon>
          Open Safety Dialog
        </md-outlined-button>
      </div>

      <div class="content-grid">
        <section class="view-grid">
          <md-outlined-card class="panel motion-item" style="--delay: 40ms">
            <h2>Special Boot Modes</h2>
            <ul class="boot-modes-list" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
              <li>
                <strong>Recovery</strong>
                <p>With the device powered off, hold Volume Up + Power. Keep holding both buttons until the MI logo appears on the screen, then release.</p>
              </li>
              <li>
                <strong>Fastboot</strong>
                <p>With the device powered off, hold Volume Down + Power. Keep holding both buttons until the word FASTBOOT appears on the screen, then release.</p>
              </li>
            </ul>
          </md-outlined-card>

          <md-outlined-card id="flash-steps-card" class="panel motion-item" style="--delay: 50ms">
            <h2 class="section-title">
              <md-icon aria-hidden="true">terminal</md-icon>
              Flash Steps (Type these commands in admin Terminal)
            </h2>
            <ol class="commands">
              ${FLASH_STEPS.map((step) => html`
                <li>
                  ${step.isInfo ? html`
                    <md-filled-card class="info-card">
                      <div class="info-card-content">
                        <md-icon>info</md-icon>
                        <div class="info-card-text">
                          <h3>${step.title}</h3>
                          ${step.note ? html`<p>${step.note}</p>` : ''}
                        </div>
                      </div>
                    </md-filled-card>
                  ` : html`
                  <md-outlined-card class="command-item">
                    <h3>${step.title}</h3>
                    ${step.warning ? html`<p class="step-warning"><strong>${step.warning}</strong></p>` : ''}
                    ${step.guidance ? html`
                      <div class="step-guidance">
                        <div class="guidance-row warning">
                          <span class="guidance-label">Avoid</span>
                          <p class="guidance-text"><strong>Do not use ${step.guidance.avoid}.</strong></p>
                        </div>
                        <div class="guidance-row">
                          <span class="guidance-label">Do this</span>
                          <p class="guidance-text">${step.guidance.action}</p>
                        </div>
                      </div>
                    ` : ''}
                    ${step.note ? html`<p class=${step.noteHighlighted ? 'step-note-highlighted' : ''}>${step.note}</p>` : ''}
                    ${step.isDropdown && step.optionalImages ? html`
                      <details class="optional-images-dropdown">
                        <summary class="dropdown-summary">
                          <md-icon>expand_more</md-icon>
                          <span>Click to expand optional images</span>
                        </summary>
                        <div class="dropdown-content">
                          ${step.optionalImages.map((image) => html`
                            <div class="optional-image-item">
                              <div class="optional-image-info">
                                <strong>${image.name}</strong>
                                <p>${image.description}</p>
                              </div>
                              <div class="command-row">
                                <md-outlined-text-field
                                  class="command-field"
                                  label="Command"
                                  readonly
                                  .value=${image.command}></md-outlined-text-field>
                                <md-icon-button
                                  aria-label="Copy command"
                                  @click=${() => app.copyCommand(image.command)}>
                                  <md-icon>${app.copiedCommand === image.command ? 'check' : 'content_copy'}</md-icon>
                                </md-icon-button>
                              </div>
                            </div>
                          `)}
                        </div>
                      </details>
                    ` : ''}
                    ${step.command && !step.isDropdown ? html`
                      <div class="command-row">
                        <md-outlined-text-field
                          class="command-field"
                          label=${step.copyable === false ? 'Type manually' : 'Command'}
                          readonly
                          .value=${step.command}></md-outlined-text-field>
                        ${step.copyable === false ? '' : html`
                          <md-icon-button
                            aria-label="Copy command"
                            @click=${() => app.copyCommand(step.command)}>
                            <md-icon>${app.copiedCommand === step.command ? 'check' : 'content_copy'}</md-icon>
                          </md-icon-button>
                        `}
                      </div>
                    ` : ''}
                  </md-outlined-card>
                  `}
                </li>
              `)}
            </ol>

            <md-filled-card class="info-card tip-card motion-item" style="--delay: 100ms">
              <div class="info-card-content">
                <md-icon>tips_and_updates</md-icon>
                <div class="info-card-text tip-card-text">
                  <h3>Installation Tips</h3>
                  <div class="tip-entry">
                    <div class="tip-entry-header">
                      <span class="tip-label">Recovery prompt</span>
                      <strong>Select the correct reboot option</strong>
                    </div>
                    <p>After the package is installed, recovery may ask whether it should reboot back into recovery to install add-ons.</p>
                    <p class="tip-callout">Choose <strong>Yes</strong> only if you want to install add-ons right away. Otherwise, select <strong>No</strong>.</p>
                  </div>
                  <div class="tip-divider"></div>
                  <div class="tip-entry">
                    <div class="tip-entry-header">
                      <span class="tip-label">ADB sideload</span>
                      <strong>47% can still be a successful install</strong>
                    </div>
                    <p>ADB usually finishes with <code>Total xfer: 1.00x</code>. On some systems, the sideload output stops at 47% even when the installation succeeds.</p>
                    <ul class="tip-status-list">
                      <li><code>adb: failed to read command: Success</code></li>
                      <li><code>adb: failed to read command: No error</code></li>
                      <li><code>adb: failed to read command: Undefined error: 0</code></li>
                    </ul>
                    <p class="tip-callout">If recovery completes the installation successfully, these messages are normal.</p>
                  </div>
                </div>
              </div>
            </md-filled-card>
          </md-outlined-card>
        </section>

        <aside>
          <md-outlined-card class="panel motion-item" style="--delay: 120ms; margin-top: 1rem;">
            <h2>Spoofing Guide</h2>
            <p>Keep this section short and update-safe. Replace with your latest tested method.</p>
            <ul class="spoof-list">
              <li>
                <md-outlined-card class="spoof-card">
                  <md-icon class="spoof-icon">check_circle</md-icon>
                  <div>
                    <strong>Finish first boot first</strong>
                    <p>Complete setup and sign in before spoofing work.</p>
                  </div>
                </md-outlined-card>
              </li>
              <li>
                <md-outlined-card class="spoof-card">
                  <md-icon class="spoof-icon">extension</md-icon>
                  <div>
                    <strong>Add keybox or pif.json</strong>
                    <p>After finish boot setup, add keybox or pif.json through Developer options.</p>
                  </div>
                </md-outlined-card>
              </li>
              <li>
                <md-outlined-card class="spoof-card">
                  <md-icon class="spoof-icon">delete_sweep</md-icon>
                  <div>
                    <strong>Clear Google app data</strong>
                    <p>Clear Play Store and Play Services after fingerprint changes.</p>
                  </div>
                </md-outlined-card>
              </li>
              <li>
                <md-outlined-card class="spoof-card">
                  <md-icon class="spoof-icon">verified</md-icon>
                  <div>
                    <strong>Reboot and verify</strong>
                    <p>Reboot once and verify certification and login status.</p>
                  </div>
                </md-outlined-card>
              </li>
            </ul>
          </md-outlined-card>
        </aside>
      </div>
    </section>
  `;
}
