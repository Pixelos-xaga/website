import { html } from 'lit';
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
          <p>Get your own <code>pif.json</code> and add it from Developer options on your device. No PIF files are provided here.</p>
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
            Setup Notes
          </h2>
          <ol class="commands" style="margin-top: 0.9rem;">
            <li>
              <md-outlined-card class="command-item">
                <h3>Step 1: Add your spoofing setup</h3>
                <p>Add your own <code>pif.json</code> or keybox from Developer options after first boot setup is complete.</p>
              </md-outlined-card>
            </li>
            <li>
              <md-outlined-card class="command-item">
                <h3>Step 2: Clear Google app data</h3>
                <p>Clear Play Store and Play Services data after fingerprint or spoofing changes.</p>
              </md-outlined-card>
            </li>
            <li>
              <md-outlined-card class="command-item">
                <h3>Step 3: Reboot and verify</h3>
                <p>Reboot once, then verify certification status and Wallet or Google Pay sign-in.</p>
              </md-outlined-card>
            </li>
          </ol>
          <md-filled-card class="info-card" style="margin-top: 0.35rem;">
            <div class="info-card-content">
              <md-icon>info</md-icon>
              <div class="info-card-text">
                <h3>Sourcing Notice</h3>
                <p>PIF and keybox files are not provided here; you must source them yourself.</p>
              </div>
            </div>
          </md-filled-card>
        </md-outlined-card>
      </section>
    </section>
  `;
}
