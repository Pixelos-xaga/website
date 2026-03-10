import { html } from 'lit';
import '@material/web/button/elevated-button.js';
import '@material/web/labs/card/filled-card.js';
import '@material/web/labs/card/outlined-card.js';

export default function renderSpoofingView() {
  return html`
    <section class="view" aria-label="Spoofing view">
      <section class="view-grid spoofing-guide">
        <md-outlined-card class="panel motion-item" style="--delay: 20ms">
          <h2 class="section-title">
            <md-icon aria-hidden="true">wallet</md-icon>
            Activate GPay (PIF Method)
          </h2>
          <p>Download the provided <code>pif.json</code>, then add it from Developer options on your device.</p>
          <div class="hero-actions">
            <md-elevated-button href="/spoofing/pif.json" download>
              <md-icon slot="icon">download</md-icon>
              Download pif.json
            </md-elevated-button>
          </div>
        </md-outlined-card>

        <md-outlined-card class="panel motion-item" style="--delay: 40ms">
          <h2 class="section-title">
            <md-icon aria-hidden="true">settings</md-icon>
            Where to Add It
          </h2>
          <p>Use this screenshot as reference to find the Developer options screen where you can add the PIF file.</p>
          <figure class="spoofing-preview">
            <img
              src="/spoofing/dev-options-add-pif.png"
              alt="Developer options screen showing where to add pif.json"
              loading="lazy"
              decoding="async"
              width="1080"
              height="2460" />
          </figure>
        </md-outlined-card>

        <md-outlined-card class="panel motion-item" style="--delay: 60ms">
          <h2 class="section-title">
            <md-icon aria-hidden="true">gpp_maybe</md-icon>
            Important Compatibility Note
          </h2>
          <md-filled-card class="warning-card" style="margin-top: 0.55rem;">
            <div class="warning-content">
              <md-icon>warning</md-icon>
              <p><strong>PIF and keybox should not be used together</strong> at the same time.</p>
            </div>
          </md-filled-card>
          <ol class="commands" style="margin-top: 0.9rem;">
            <li>
              <md-outlined-card class="command-item">
                <h3>Step 1: Activate with PIF</h3>
                <p>Use <code>pif.json</code> first and complete Google Pay sign-in/activation once.</p>
              </md-outlined-card>
            </li>
            <li>
              <md-outlined-card class="command-item">
                <h3>Step 2: Move to keybox</h3>
                <p>After Google Pay is working, remove PIF and switch to a keybox setup.</p>
              </md-outlined-card>
            </li>
            <li>
              <md-outlined-card class="command-item">
                <h3>Step 3: Keep setup stable</h3>
                <p>Google Pay should generally not ask for this setup step again after initial activation.</p>
              </md-outlined-card>
            </li>
          </ol>
          <md-filled-card class="info-card" style="margin-top: 0.35rem;">
            <div class="info-card-content">
              <md-icon>info</md-icon>
              <div class="info-card-text">
                <h3>Keybox Notice</h3>
                <p>Keybox files are not provided here; you must source your own keybox.</p>
              </div>
            </div>
          </md-filled-card>
        </md-outlined-card>
      </section>
    </section>
  `;
}
