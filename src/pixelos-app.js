import { LitElement, css, html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';

const ROUTE_VIEW_LOADERS = {
  home: () => import('./routes/home-view.js'),
  instructions: () => import('./routes/instructions-view.js'),
  downloads: () => import('./routes/downloads-view.js'),
  changelogs: () => import('./routes/changelogs-view.js'),
  'test-build': () => import('./routes/test-build-view.js')
};

const HOME_SCREENSHOT_COUNT = 4;

const MATERIAL_SIDE_SHAPES = [
  { shape: 'shape-circle', tilt: '-4deg' },
  { shape: 'shape-square', tilt: '3deg' },
  { shape: 'shape-slanted', tilt: '-2deg' },
  { shape: 'shape-arch', tilt: '4deg' },
  { shape: 'shape-gem', tilt: '-4deg' },
  { shape: 'shape-sunny', tilt: '2deg' }
];

class PixelosApp extends LitElement {
  static properties = {
    route: { state: true },
    motionKey: { state: true },
    copiedCommand: { state: true },
    copyMessage: { state: true },
    pendingScreenshots: { state: true },
    changelogs: { state: true },
    routeView: { state: true },
    routeViewLoading: { state: true },
    routeViewError: { state: true }
  };

  static styles = css`
    :host {
      --font-brand: "Google Sans", "Roboto", "Noto Sans", "Segoe UI", sans-serif;
      --font-plain: "Google Sans Text", "Roboto", "Noto Sans", "Segoe UI", sans-serif;
      --font-mono: "Google Sans Mono", "Roboto Mono", "Consolas", monospace;

      --md-ref-typeface-brand: var(--font-brand);
      --md-ref-typeface-plain: var(--font-plain);
      --md-ref-typeface-weight-regular: 400;
      --md-ref-typeface-weight-medium: 500;
      --md-ref-typeface-weight-bold: 700;

      /* Material 3 typography scale with proper tracking values */
      --md-sys-typescale-display-large-font: var(--font-brand);
      --md-sys-typescale-display-large-size: 3.5625rem;
      --md-sys-typescale-display-large-line-height: 4rem;
      --md-sys-typescale-display-large-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-display-large-tracking: -0.028125em;

      --md-sys-typescale-display-medium-font: var(--font-brand);
      --md-sys-typescale-display-medium-size: 2.8125rem;
      --md-sys-typescale-display-medium-line-height: 3.25rem;
      --md-sys-typescale-display-medium-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-display-medium-tracking: 0em;

      --md-sys-typescale-display-small-font: var(--font-brand);
      --md-sys-typescale-display-small-size: 2.25rem;
      --md-sys-typescale-display-small-line-height: 2.75rem;
      --md-sys-typescale-display-small-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-display-small-tracking: 0em;

      --md-sys-typescale-headline-large-font: var(--font-brand);
      --md-sys-typescale-headline-large-size: 2rem;
      --md-sys-typescale-headline-large-line-height: 2.5rem;
      --md-sys-typescale-headline-large-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-headline-large-tracking: 0em;

      --md-sys-typescale-headline-medium-font: var(--font-brand);
      --md-sys-typescale-headline-medium-size: 1.75rem;
      --md-sys-typescale-headline-medium-line-height: 2.25rem;
      --md-sys-typescale-headline-medium-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-headline-medium-tracking: 0em;

      --md-sys-typescale-headline-small-font: var(--font-brand);
      --md-sys-typescale-headline-small-size: 1.5rem;
      --md-sys-typescale-headline-small-line-height: 2rem;
      --md-sys-typescale-headline-small-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-headline-small-tracking: 0em;

      --md-sys-typescale-title-large-font: var(--font-brand);
      --md-sys-typescale-title-large-size: 1.375rem;
      --md-sys-typescale-title-large-line-height: 1.75rem;
      --md-sys-typescale-title-large-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-title-large-tracking: 0em;

      --md-sys-typescale-title-medium-font: var(--font-brand);
      --md-sys-typescale-title-medium-size: 1rem;
      --md-sys-typescale-title-medium-line-height: 1.5rem;
      --md-sys-typescale-title-medium-weight: var(--md-ref-typeface-weight-medium);
      --md-sys-typescale-title-medium-tracking: 0.005em;

      --md-sys-typescale-title-small-font: var(--font-brand);
      --md-sys-typescale-title-small-size: 0.875rem;
      --md-sys-typescale-title-small-line-height: 1.25rem;
      --md-sys-typescale-title-small-weight: var(--md-ref-typeface-weight-medium);
      --md-sys-typescale-title-small-tracking: 0.007142857em;

      --md-sys-typescale-body-large-font: var(--font-plain);
      --md-sys-typescale-body-large-size: 1rem;
      --md-sys-typescale-body-large-line-height: 1.5rem;
      --md-sys-typescale-body-large-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-body-large-tracking: 0.03125em;

      --md-sys-typescale-body-medium-font: var(--font-plain);
      --md-sys-typescale-body-medium-size: 0.875rem;
      --md-sys-typescale-body-medium-line-height: 1.25rem;
      --md-sys-typescale-body-medium-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-body-medium-tracking: 0.017857143em;

      --md-sys-typescale-body-small-font: var(--font-plain);
      --md-sys-typescale-body-small-size: 0.75rem;
      --md-sys-typescale-body-small-line-height: 1rem;
      --md-sys-typescale-body-small-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-body-small-tracking: 0.033333333em;

      --md-sys-typescale-label-large-font: var(--font-plain);
      --md-sys-typescale-label-large-size: 0.875rem;
      --md-sys-typescale-label-large-line-height: 1.25rem;
      --md-sys-typescale-label-large-weight: var(--md-ref-typeface-weight-medium);
      --md-sys-typescale-label-large-tracking: 0.007142857em;

      --md-sys-typescale-label-medium-font: var(--font-plain);
      --md-sys-typescale-label-medium-size: 0.75rem;
      --md-sys-typescale-label-medium-line-height: 1rem;
      --md-sys-typescale-label-medium-weight: var(--md-ref-typeface-weight-medium);
      --md-sys-typescale-label-medium-tracking: 0.041666667em;

      --md-sys-typescale-label-small-font: var(--font-plain);
      --md-sys-typescale-label-small-size: 0.6875rem;
      --md-sys-typescale-label-small-line-height: 1rem;
      --md-sys-typescale-label-small-weight: var(--md-ref-typeface-weight-medium);
      --md-sys-typescale-label-small-tracking: 0.045454545em;

      --md-sys-color-primary: #a7c7ff;
      --md-sys-color-on-primary: #002f6c;
      --md-sys-color-primary-container: #00459e;
      --md-sys-color-on-primary-container: #d8e3ff;
      --md-sys-color-primary-fixed: #d8e3ff;
      --md-sys-color-primary-fixed-dim: #a7c7ff;
      --md-sys-color-on-primary-fixed: #001638;
      --md-sys-color-on-primary-fixed-variant: #00459e;

      --md-sys-color-secondary: #bcc7db;
      --md-sys-color-on-secondary: #263140;
      --md-sys-color-secondary-container: #3d4858;
      --md-sys-color-on-secondary-container: #d8e3f8;
      --md-sys-color-secondary-fixed: #d8e3f8;
      --md-sys-color-secondary-fixed-dim: #bcc7db;
      --md-sys-color-on-secondary-fixed: #121d2b;
      --md-sys-color-on-secondary-fixed-variant: #3d4858;

      --md-sys-color-tertiary: #dfba60;
      --md-sys-color-on-tertiary: #3d2a00;
      --md-sys-color-tertiary-container: #584000;
      --md-sys-color-on-tertiary-container: #ffdfa6;
      --md-sys-color-tertiary-fixed: #ffdfa6;
      --md-sys-color-tertiary-fixed-dim: #dfba60;
      --md-sys-color-on-tertiary-fixed: #221500;
      --md-sys-color-on-tertiary-fixed-variant: #584000;

      --md-sys-color-error: #ffb4a9;
      --md-sys-color-on-error: #680003;
      --md-sys-color-error-container: #930006;
      --md-sys-color-on-error-container: #ffdad4;

      --md-sys-color-background: #0f1424;
      --md-sys-color-on-background: #e3e3eb;

      --md-sys-color-surface: #0f1424;
      --md-sys-color-on-surface: #e3e3eb;
      --md-sys-color-surface-dim: #0f1424;
      --md-sys-color-surface-bright: #353d52;
      --md-sys-color-surface-container-lowest: #0a0e1a;
      --md-sys-color-surface-container-low: #141a2e;
      --md-sys-color-surface-container: #1a2138;
      --md-sys-color-surface-container-high: #242d47;
      --md-sys-color-surface-container-highest: #303a57;
      --md-sys-color-surface-variant: #3f4863;
      --md-sys-color-on-surface-variant: #c4c6cf;
      --md-sys-color-outline: #7a8299;
      --md-sys-color-outline-variant: #3f4863;
      --md-sys-color-surface-tint: var(--md-sys-color-primary);
      --md-sys-color-inverse-surface: #e3e3eb;
      --md-sys-color-inverse-on-surface: #2f323a;
      --md-sys-color-inverse-primary: #0058c2;
      --md-sys-color-scrim: #000;
      --md-sys-color-shadow: #000;

      /* MD3 State Layer Overlays */
      --md-sys-state-hover-state-layer: 0.08;
      --md-sys-state-focus-state-layer: 0.12;
      --md-sys-state-pressed-state-layer: 0.12;
      --md-sys-state-dragged-state-layer: 0.16;
      --md-sys-shape-corner-extra-large: 28px;
      --md-sys-shape-corner-large: 20px;
      --md-sys-shape-corner-medium: 16px;
      --md-sys-shape-corner-small: 12px;
      --md-sys-shape-corner-extra-small: 8px;
      --md-sys-shape-corner-full: 9999px;
      --m3-shape-none: 0px;
      --m3-shape-extra-small: 4px;
      --m3-shape-small: 8px;
      --m3-shape-medium: 12px;
      --m3-shape-large: 16px;
      --m3-shape-extra-large: 28px;
      --m3-shape-full: 999px;

      /* MD3 Elevation Tokens */
      --md-sys-elevation-level0: 0px 0px 0px 0px rgb(0 0 0 / 0%), 0px 0px 0px 0px rgb(0 0 0 / 0%);
      --md-sys-elevation-level1: 0px 1px 2px 0px rgb(0 0 0 / 30%), 0px 1px 3px 1px rgb(0 0 0 / 15%);
      --md-sys-elevation-level2: 0px 1px 2px 0px rgb(0 0 0 / 30%), 0px 2px 6px 2px rgb(0 0 0 / 15%);
      --md-sys-elevation-level3: 0px 1px 3px 0px rgb(0 0 0 / 30%), 0px 4px 8px 3px rgb(0 0 0 / 15%);
      --md-sys-elevation-level4: 0px 2px 3px 0px rgb(0 0 0 / 30%), 0px 6px 10px 4px rgb(0 0 0 / 15%);
      --md-sys-elevation-level5: 0px 4px 4px 0px rgb(0 0 0 / 30%), 0px 8px 12px 6px rgb(0 0 0 / 15%);

      /* MD3 Motion Duration Tokens */
      --md-sys-motion-duration-extra-short1: 50ms;
      --md-sys-motion-duration-extra-short2: 100ms;
      --md-sys-motion-duration-extra-short3: 150ms;
      --md-sys-motion-duration-short1: 200ms;
      --md-sys-motion-duration-short2: 250ms;
      --md-sys-motion-duration-short3: 300ms;
      --md-sys-motion-duration-medium1: 350ms;
      --md-sys-motion-duration-medium2: 400ms;
      --md-sys-motion-duration-medium3: 500ms;
      --md-sys-motion-duration-long1: 600ms;
      --md-sys-motion-duration-long2: 700ms;
      --md-sys-motion-duration-long3: 800ms;
      --md-sys-motion-duration-extra-long1: 900ms;

      /* MD3 Motion Easing Tokens */
      --md-sys-motion-easing-linear: linear;
      --md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
      --md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
      --md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
      --md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);

      /* Legacy aliases for backward compatibility */
      --motion-standard: var(--md-sys-motion-easing-standard);
      --motion-emphasized: var(--md-sys-motion-easing-emphasized);
      --side-left-shift: -62px;
      --side-right-shift: -26px;

      color-scheme: dark;
      display: block;
      min-height: 100dvh;
      position: relative;
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
      position: relative;
      z-index: 1;
    }

    .side-gallery {
      position: fixed;
      top: 0;
      bottom: 0;
      width: clamp(100px, 11vw, 140px);
      pointer-events: none;
      z-index: 0;
      opacity: 0.9;
      overflow: hidden;
    }

    .side-gallery.left {
      left: max(-44px, calc((100vw - 1100px) / 2 - 188px));
    }

    .side-gallery.right {
      right: max(-44px, calc((100vw - 1100px) / 2 - 188px));
    }

    .side-track {
      position: absolute;
      left: 50%;
      top: -160px;
      display: grid;
      gap: 1.15rem;
      transform: translateX(-50%);
      will-change: transform;
    }

    .side-gallery.left .side-track {
      transform: translate(-50%, var(--side-left-shift));
    }

    .side-gallery.right .side-track {
      transform: translate(-50%, var(--side-right-shift));
    }

    .side-art {
      width: clamp(88px, 9.2vw, 120px);
      aspect-ratio: 1 / 1;
      overflow: hidden;
      --tile-shape: var(--m3-shape-large);
      --tile-clip: inset(0 round var(--tile-shape));
      --md-outlined-card-container-shape: var(--tile-shape);
      padding: 0;
      --md-outlined-card-container-color: color-mix(in srgb, var(--md-sys-color-primary-container) 45%, var(--md-sys-color-surface-container-high) 55%);
      --md-outlined-card-outline-color: color-mix(in srgb, var(--md-sys-color-primary-fixed-dim) 55%, transparent);
      --md-outlined-card-outline-width: 1px;
      transform: rotate(var(--tile-tilt, 0deg));
      box-shadow: 0 12px 28px rgb(0 0 0 / 30%), 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 20%, transparent);
      border-radius: var(--tile-shape);
      clip-path: var(--tile-clip);
    }

    .side-art img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      object-position: center;
      background: color-mix(in srgb, var(--md-sys-color-surface-container-low) 90%, transparent);
      opacity: 0.94;
      filter: saturate(1.08) contrast(1.03);
      border-radius: inherit;
      clip-path: var(--tile-clip);
    }

    .side-art.shape-circle {
      --tile-shape: var(--m3-shape-full);
      --tile-clip: circle(50% at 50% 50%);
    }

    .side-art.shape-square {
      --tile-shape: var(--m3-shape-none);
      --tile-clip: inset(0 round var(--tile-shape));
    }

    .side-art.shape-slanted {
      --tile-shape: var(--m3-shape-none);
      --tile-clip: polygon(93% 97%, 0% 97%, 7% 3%, 100% 3%);
    }

    .side-art.shape-arch {
      --tile-shape: var(--m3-shape-none);
      --tile-clip: inset(0 round 46% 46% 12% 12%);
    }

    .side-art.shape-gem {
      --tile-shape: var(--m3-shape-none);
      --tile-clip: polygon(50% 100%, 0% 79%, 7% 26%, 43% 0%, 57% 0%, 93% 26%, 100% 79%);
    }

    .side-art.shape-sunny {
      --tile-shape: var(--m3-shape-none);
      --tile-clip: polygon(
        50% 0%,
        61% 13%,
        79% 8%,
        87% 24%,
        100% 37%,
        92% 50%,
        100% 63%,
        87% 76%,
        79% 92%,
        61% 87%,
        50% 100%,
        39% 87%,
        21% 92%,
        13% 76%,
        0% 63%,
        8% 50%,
        0% 37%,
        13% 24%,
        21% 8%,
        39% 13%
      );
    }

    .top-bar {
      --md-elevated-card-container-color: var(--md-sys-color-surface-container-high);
      --md-elevated-card-container-shape: var(--md-sys-shape-corner-extra-large);
      --md-elevated-card-container-elevation: 1;
      border: 1px solid color-mix(in srgb, var(--md-sys-color-primary) 30%, var(--md-sys-color-outline-variant) 70%);
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 12%, transparent), 0 8px 18px rgb(0 0 0 / 16%);
      transition: border-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard), box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard), background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
      position: sticky;
      top: 0.6rem;
      z-index: 5;
      backdrop-filter: blur(14px);
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 0.9rem;
      padding: 0.72rem 1rem;
      margin-bottom: 1rem;
    }

    :host(.is-scrolled) .top-bar {
      --md-elevated-card-container-color: color-mix(in srgb, var(--md-sys-color-surface-container-high) 85%, var(--md-sys-color-primary-container) 15%);
      border-color: color-mix(in srgb, var(--md-sys-color-primary) 55%, var(--md-sys-color-outline-variant) 45%);
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 30%, transparent), 0 12px 26px rgb(0 0 0 / 28%);
    }

    .brand {
      font-family: var(--md-sys-typescale-title-large-font);
      font-size: var(--md-sys-typescale-title-large-size);
      line-height: var(--md-sys-typescale-title-large-line-height);
      letter-spacing: var(--md-sys-typescale-title-large-tracking);
      font-weight: var(--md-sys-typescale-title-large-weight);
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--md-sys-color-on-surface);
    }

    .brand-pixelos {
      color: var(--md-sys-color-on-surface);
      text-decoration: none;
    }

    .brand-pixelos:hover {
      color: var(--md-sys-color-primary);
      text-decoration: underline;
      text-underline-offset: 0.18em;
    }

    .brand-logo {
      width: 20px;
      height: 20px;
      display: block;
    }

    .brand-xaga {
      color: var(--md-sys-color-on-surface-variant);
      font-weight: var(--md-sys-typescale-title-medium-weight);
      font-size: var(--md-sys-typescale-title-medium-size);
      line-height: var(--md-sys-typescale-title-medium-line-height);
      letter-spacing: var(--md-sys-typescale-title-medium-tracking);
    }

    md-tabs {
      justify-self: end;
      padding: 0.2rem;
      border-radius: 999px;
      background: var(--md-sys-color-surface-container);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 14%, transparent);
      --md-primary-tab-container-color: transparent;
      --md-primary-tab-active-indicator-color: var(--md-sys-color-primary);
      --md-primary-tab-active-label-text-color: var(--md-sys-color-primary);
      --md-primary-tab-inactive-label-text-color: var(--md-sys-color-on-surface-variant);
      --md-primary-tab-active-indicator-height: 0px;
      --md-primary-tab-active-indicator-shape: 999px;
      --md-primary-tab-container-height: 44px;
      --md-primary-tab-container-shape: 999px;
      max-width: 100%;
    }

    md-tabs::part(divider) {
      display: none;
    }

    md-primary-tab {
      border-radius: 999px;
      margin-inline: 2px;
      background: transparent;
    }

    md-primary-tab[active] {
      background: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
    }

    .view {
      animation: shared-axis-in var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-emphasized);
    }

    .home-view {
      display: grid;
      gap: 1.05rem;
    }

    .panel {
      display: block;
      padding: 1.15rem;
      overflow-x: auto;
    }

    md-filled-card.panel,
    md-elevated-card.panel,
    md-outlined-card.panel {
      transition: transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard), box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
    }

    md-filled-card.panel:hover,
    md-elevated-card.panel:hover,
    md-outlined-card.panel:hover {
      transform: translateY(-2px);
    }

    md-filled-card.panel:focus-within,
    md-elevated-card.panel:focus-within,
    md-outlined-card.panel:focus-within {
      transform: translateY(-1px);
    }

    md-filled-card.panel {
      --md-filled-card-container-color: color-mix(in srgb, var(--md-sys-color-primary-container) 70%, var(--md-sys-color-surface-container-high) 30%);
      --md-filled-card-container-shape: var(--md-sys-shape-corner-extra-large);
      box-shadow: 0 4px 16px rgb(0 0 0 / 20%), inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 30%, transparent);
    }

    md-elevated-card.panel {
      --md-elevated-card-container-color: color-mix(in srgb, var(--md-sys-color-secondary-container) 18%, var(--md-sys-color-surface-container) 82%);
      --md-elevated-card-container-shape: var(--md-sys-shape-corner-large);
      --md-elevated-card-container-elevation: 1;
      box-shadow: 0 2px 8px rgb(0 0 0 / 15%), inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-secondary) 20%, transparent);
    }

    md-outlined-card.panel {
      --md-outlined-card-container-color: color-mix(in srgb, var(--md-sys-color-tertiary-container) 12%, var(--md-sys-color-surface-container) 88%);
      --md-outlined-card-container-shape: var(--md-sys-shape-corner-large);
      --md-outlined-card-outline-color: color-mix(in srgb, var(--md-sys-color-primary) 35%, transparent);
    }

    .hero {
      padding: clamp(1.2rem, 3vw, 2rem);
    }

    .motion-item {
      opacity: 0;
      transform: translateY(12px);
      animation: rise-in var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-emphasized-decelerate) forwards;
      animation-delay: var(--delay, 0ms);
    }

    h1,
    h2,
    h3 {
      margin: 0 0 0.56rem;
      font-family: var(--md-sys-typescale-headline-medium-font);
      color: var(--md-sys-color-on-surface);
    }

    h1 {
      margin-top: 0.85rem;
      font-family: var(--md-sys-typescale-display-small-font);
      font-size: clamp(1.75rem, 6vw, var(--md-sys-typescale-display-small-size));
      line-height: var(--md-sys-typescale-display-small-line-height);
      letter-spacing: var(--md-sys-typescale-display-small-tracking);
      font-weight: var(--md-sys-typescale-display-small-weight);
    }

    h2 {
      font-family: var(--md-sys-typescale-headline-small-font);
      font-size: var(--md-sys-typescale-headline-small-size);
      line-height: var(--md-sys-typescale-headline-small-line-height);
      letter-spacing: var(--md-sys-typescale-headline-small-tracking);
      font-weight: var(--md-sys-typescale-headline-small-weight);
    }

    h3 {
      font-family: var(--md-sys-typescale-title-medium-font);
      font-size: var(--md-sys-typescale-title-medium-size);
      line-height: var(--md-sys-typescale-title-medium-line-height);
      letter-spacing: var(--md-sys-typescale-title-medium-tracking);
      font-weight: var(--md-sys-typescale-title-medium-weight);
    }

    p,
    li {
      color: var(--md-sys-color-on-surface-variant);
      font-family: var(--md-sys-typescale-body-medium-font);
      font-size: var(--md-sys-typescale-body-medium-size);
      line-height: var(--md-sys-typescale-body-medium-line-height);
      letter-spacing: var(--md-sys-typescale-body-medium-tracking);
      font-weight: var(--md-sys-typescale-body-medium-weight);
    }

    small {
      color: var(--md-sys-color-on-surface-variant);
      font-family: var(--md-sys-typescale-label-medium-font);
      font-size: var(--md-sys-typescale-label-medium-size);
      line-height: var(--md-sys-typescale-label-medium-line-height);
      letter-spacing: var(--md-sys-typescale-label-medium-tracking);
      font-weight: var(--md-sys-typescale-label-medium-weight);
    }

    .lead {
      margin: 0;
      max-width: 100%;
      width: 70ch;
      font-family: var(--md-sys-typescale-body-large-font);
      font-size: var(--md-sys-typescale-body-large-size);
      line-height: var(--md-sys-typescale-body-large-line-height);
      letter-spacing: var(--md-sys-typescale-body-large-tracking);
      font-weight: var(--md-sys-typescale-body-large-weight);
    }

    .hero-actions {
      margin-top: 1.15rem;
      display: flex;
      gap: 0.7rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .hero-actions md-filled-button,
    .hero-actions md-filled-tonal-button {
      align-self: flex-start;
    }

    .screenshots-panel {
      --md-elevated-card-container-color: var(--md-sys-color-surface-container-low);
      position: relative;
    }

    .screenshots-grid {
      margin-top: 0.55rem;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.72rem;
    }

    .screenshot-item {
      display: block;
      margin: 0;
      overflow: hidden;
      border-radius: 16px;
      background: var(--md-sys-color-surface-container-high);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 35%, transparent), 0 4px 12px rgb(0 0 0 / 20%);
      aspect-ratio: 9 / 20;
      transition: transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard), box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
    }

    .screenshot-item:hover {
      transform: translateY(-2px);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 45%, transparent), 0 8px 18px rgb(0 0 0 / 24%);
    }

    .screenshot-item img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .screenshots-loader {
      margin-top: 0.72rem;
      display: inline-flex;
      align-items: center;
      gap: 0.48rem;
      color: var(--md-sys-color-on-surface-variant);
      font-size: 0.9rem;
    }

    .screenshots-loader md-circular-progress {
      --md-circular-progress-active-indicator-color: var(--md-sys-color-primary);
      width: 22px;
      height: 22px;
    }

    md-filled-button,
    md-filled-tonal-button,
    md-elevated-button,
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

    md-icon {
      font-family: "Material Symbols Outlined";
      font-variation-settings:
        "FILL" var(--m3-icon-fill, 0),
        "wght" var(--m3-icon-weight, 500),
        "GRAD" var(--m3-icon-grad, 0),
        "opsz" var(--m3-icon-opsz, 24);
      font-size: var(--m3-icon-size, 24px);
      line-height: 1;
    }

    md-primary-tab md-icon {
      --m3-icon-fill: 0;
      --m3-icon-weight: 500;
      --m3-icon-size: 22px;
    }

    md-primary-tab[active] md-icon {
      --m3-icon-fill: 1;
      --m3-icon-weight: 600;
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

    .changelog-card {
      --md-outlined-card-container-color: var(--md-sys-color-surface-container-high);
      margin-bottom: 1rem;
    }

    .changelog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.8rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .changelog-title {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin: 0;
    }

    .changelog-tag {
      padding: 0.2rem 0.6rem;
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .changelog-date {
      color: var(--md-sys-color-on-surface-variant);
      font-family: var(--font-mono);
      font-size: 0.85rem;
    }

    .changelog-date-link {
      border: 0;
      padding: 0;
      background: transparent;
      cursor: pointer;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 0.2em;
      transition: color 160ms var(--motion-standard);
    }

    .changelog-date-link:hover,
    .changelog-date-link:focus-visible {
      color: var(--md-sys-color-primary);
    }

    .changelog-entry {
      margin-top: 0.8rem;
    }

    .changelog-entry h4 {
      margin: 0.6rem 0 0.4rem;
      font-family: var(--font-brand);
      font-size: 1rem;
      color: var(--md-sys-color-primary);
    }

    .changelog-list {
      margin: 0;
      padding-left: 1.25rem;
      list-style-type: circle;
    }

    .changelog-list li {
      margin-bottom: 0.35rem;
      color: var(--md-sys-color-on-surface);
    }

    .section-title {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .section-title md-icon {
      --m3-icon-fill: 1;
      --m3-icon-size: 20px;
      color: var(--md-sys-color-primary);
    }

    .firmware-list {
      margin: 0.5rem 0;
      padding-left: 1.25rem;
      color: var(--md-sys-color-on-surface-variant);
    }

    .firmware-list li {
      margin-bottom: 0.25rem;
      line-height: 1.5;
    }

    .warning-content {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      padding: 0.8rem 1rem;
      color: var(--md-sys-color-on-tertiary-container);
    }

    .warning-card {
      --md-filled-card-container-color: color-mix(in srgb, var(--md-sys-color-tertiary-container) 65%, var(--md-sys-color-surface-container) 35%);
      --md-filled-card-container-shape: var(--md-sys-shape-corner-large);
      overflow-x: auto;
    }

    .warning-content p {
      margin: 0;
      line-height: 1.4;
      color: var(--md-sys-color-on-tertiary-container);
    }

    .warning-content md-icon {
      margin-top: 0.1rem;
      --m3-icon-fill: 1;
      --m3-icon-weight: 600;
      color: var(--md-sys-color-tertiary-fixed-dim);
    }

    .warning-content .warning-command {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 6px;
      background: color-mix(in srgb, var(--md-sys-color-tertiary) 35%, transparent);
      color: var(--md-sys-color-on-tertiary-container);
      font: 600 0.85rem/1.5 var(--font-mono);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-tertiary-fixed-dim) 50%, transparent);
      word-break: break-all;
      max-width: 100%;
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
      display: block;
      padding: 0.72rem;
      --md-outlined-card-container-color: color-mix(in srgb, var(--md-sys-color-primary-container) 15%, var(--md-sys-color-surface-container-high) 85%);
      --md-outlined-card-container-shape: var(--md-sys-shape-corner-medium);
      --md-outlined-card-outline-color: color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent);
      --md-outlined-card-outline-width: 1px;
      display: grid;
      gap: 0.35rem;
      min-width: 0;
      max-width: 100%;
    }

    .download-item md-elevated-button {
      width: 100%;
      justify-content: flex-start;
      --md-filled-button-label-text-font: var(--font-plain);
      --md-filled-button-label-text-size: 0.9rem;
      --md-filled-button-label-text-line-height: 1.3;
      --md-filled-button-label-text-weight: 500;
      --md-filled-button-container-shape: 12px;
      overflow: hidden;
    }

    .download-item md-elevated-button::part(label) {
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
      text-align: left;
    }

    .download-item md-elevated-button::part(container) {
      width: 100%;
      justify-content: flex-start;
    }

    .download-item md-elevated-button [slot="icon"] {
      flex-shrink: 0;
    }

    .commands {
      margin: 0.8rem 0 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.85rem;
    }

    .commands li {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .command-item {
      display: block;
      padding: 0.75rem;
      --md-outlined-card-container-color: color-mix(in srgb, var(--md-sys-color-primary-container) 12%, var(--md-sys-color-surface-container-high) 88%);
      --md-outlined-card-container-shape: var(--md-sys-shape-corner-medium);
      --md-outlined-card-outline-color: color-mix(in srgb, var(--md-sys-color-primary) 35%, transparent);
    }

    .info-card {
      --md-filled-card-container-color: color-mix(in srgb, var(--md-sys-color-secondary-container) 65%, var(--md-sys-color-surface-container-high) 35%);
      --md-filled-card-container-shape: var(--md-sys-shape-corner-medium);
      padding: 0.85rem 1rem;
    }

    .info-card-content {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
    }

    .info-card-content md-icon {
      flex-shrink: 0;
      margin-top: 0.1rem;
      --m3-icon-fill: 1;
      color: var(--md-sys-color-secondary);
    }

    .info-card-text h3 {
      margin: 0 0 0.25rem;
      font-family: var(--md-sys-typescale-title-medium-font);
      font-size: var(--md-sys-typescale-title-medium-size);
      font-weight: var(--md-sys-typescale-title-medium-weight);
      line-height: var(--md-sys-typescale-title-medium-line-height);
      letter-spacing: var(--md-sys-typescale-title-medium-tracking);
      color: var(--md-sys-color-on-secondary-container);
    }

    .info-card-text p {
      margin: 0;
      font-family: var(--md-sys-typescale-body-medium-font);
      font-size: var(--md-sys-typescale-body-medium-size);
      font-weight: var(--md-sys-typescale-body-medium-weight);
      line-height: var(--md-sys-typescale-body-medium-line-height);
      letter-spacing: var(--md-sys-typescale-body-medium-tracking);
      color: var(--md-sys-color-on-secondary-container);
      opacity: 0.9;
    }

    .commands p {
      margin: 0.2rem 0 0;
    }

    .step-warning {
      margin: 0.25rem 0 0;
      padding: 0.32rem 0.5rem;
      border-radius: 10px;
      color: var(--md-sys-color-on-tertiary-container);
      background: color-mix(in srgb, var(--md-sys-color-tertiary-container) 52%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-tertiary) 48%, transparent);
      font-family: var(--font-brand);
    }

    .step-note-highlighted {
      margin: 0.25rem 0 0;
      padding: 0.5rem 0.65rem;
      border-radius: 10px;
      color: var(--md-sys-color-on-primary-container);
      background: color-mix(in srgb, var(--md-sys-color-primary-container) 60%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 50%, transparent);
      font-family: var(--font-brand);
      font-weight: 600;
    }

    .step-guidance {
      margin-top: 0.42rem;
      display: grid;
      gap: 0.46rem;
    }

    .guidance-row {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.34rem;
      border-radius: 10px;
      padding: 0.46rem 0.58rem;
      background: color-mix(in srgb, var(--md-sys-color-primary-container) 20%, var(--md-sys-color-surface-container-high) 80%);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 30%, transparent);
    }

    .guidance-row.warning {
      color: var(--md-sys-color-on-tertiary-container);
      background: color-mix(in srgb, var(--md-sys-color-tertiary-container) 65%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-tertiary-fixed-dim) 60%, transparent);
    }

    .guidance-label {
      display: inline-flex;
      align-items: center;
      padding: 0.12rem 0.48rem;
      border-radius: 999px;
      font-family: var(--md-sys-typescale-label-medium-font);
      font-size: var(--md-sys-typescale-label-medium-size);
      line-height: var(--md-sys-typescale-label-medium-line-height);
      letter-spacing: var(--md-sys-typescale-label-medium-tracking);
      font-weight: var(--md-sys-typescale-label-medium-weight);
      text-transform: uppercase;
      color: var(--md-sys-color-on-primary);
      background: var(--md-sys-color-primary);
    }

    .guidance-row.warning .guidance-label {
      color: var(--md-sys-color-on-tertiary-container);
      background: color-mix(in srgb, var(--md-sys-color-tertiary) 24%, transparent);
    }

    .guidance-text {
      margin: 0;
      width: 100%;
      text-align: left;
      line-height: 1.35;
      color: var(--md-sys-color-on-surface-variant);
    }

    .guidance-row.warning .guidance-text {
      color: var(--md-sys-color-on-tertiary-container);
    }

    .command-row {
      margin-top: 0.45rem;
      display: flex;
      gap: 0.45rem;
      align-items: center;
      max-width: 100%;
    }

    .optional-images-dropdown {
      margin-top: 0.5rem;
      border-radius: 12px;
      background: color-mix(in srgb, var(--md-sys-color-primary-container) 25%, var(--md-sys-color-surface-container-high) 75%);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 30%, transparent);
      overflow: hidden;
    }

    .dropdown-summary {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.55rem 0.7rem;
      cursor: pointer;
      font-family: var(--md-sys-typescale-label-large-font);
      font-size: var(--md-sys-typescale-label-large-size);
      line-height: var(--md-sys-typescale-label-large-line-height);
      letter-spacing: var(--md-sys-typescale-label-large-tracking);
      font-weight: var(--md-sys-typescale-label-large-weight);
      color: var(--md-sys-color-primary);
      list-style: none;
      user-select: none;
      background: color-mix(in srgb, var(--md-sys-color-primary) 8%, transparent);
    }

    .dropdown-summary::-webkit-details-marker {
      display: none;
    }

    .dropdown-summary md-icon {
      --m3-icon-size: 20px;
      --m3-icon-fill: 1;
      transition: transform var(--md-sys-motion-duration-short1) var(--md-sys-motion-easing-standard);
    }

    details[open] .dropdown-summary md-icon {
      transform: rotate(180deg);
    }

    .dropdown-content {
      padding: 0 0.7rem 0.7rem;
      display: grid;
      gap: 0.65rem;
    }

    .optional-image-item {
      padding: 0.65rem;
      border-radius: 10px;
      background: color-mix(in srgb, var(--md-sys-color-primary-container) 18%, var(--md-sys-color-surface-container-high) 82%);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 25%, transparent);
      display: grid;
      gap: 0.4rem;
      min-width: 0;
      max-width: 100%;
    }

    .optional-image-info strong {
      color: var(--md-sys-color-on-surface);
      font-family: var(--md-sys-typescale-title-small-font);
      font-size: var(--md-sys-typescale-title-small-size);
      line-height: var(--md-sys-typescale-title-small-line-height);
      letter-spacing: var(--md-sys-typescale-title-small-tracking);
      font-weight: var(--md-sys-typescale-title-small-weight);
      display: block;
    }

    .optional-image-info p {
      margin: 0.1rem 0 0;
      color: var(--md-sys-color-on-surface-variant);
      font-family: var(--md-sys-typescale-label-medium-font);
      font-size: var(--md-sys-typescale-label-medium-size);
      line-height: var(--md-sys-typescale-label-medium-line-height);
      letter-spacing: var(--md-sys-typescale-label-medium-tracking);
      font-weight: var(--md-sys-typescale-label-medium-weight);
    }

    .command-field {
      flex: 1;
      min-width: 0;
      max-width: 100%;
      --md-outlined-text-field-container-shape: 14px;
      --md-outlined-text-field-input-text-font: 500 13px/1.4 var(--font-mono);
      --md-outlined-text-field-input-text-color: var(--md-sys-color-on-surface);
      --md-outlined-text-field-label-text-color: var(--md-sys-color-on-surface-variant);
    }

    .command-snippet {
      margin: 0;
      flex: 1;
      min-width: 0;
      padding: 0.62rem 0.75rem;
      border-radius: 14px;
      background: var(--md-sys-color-surface-container-high);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 24%, transparent);
      color: var(--md-sys-color-on-surface);
      font: 500 13px/1.4 var(--font-mono);
      white-space: pre;
      overflow-x: auto;
    }

    .spoof-list {
      margin: 0.75rem 0 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.55rem;
    }

    .spoof-list li {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .spoof-card {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem;
      padding: 0.66rem;
      --md-outlined-card-container-color: var(--md-sys-color-surface-container-high);
      --md-outlined-card-container-shape: var(--md-sys-shape-corner-medium);
      --md-outlined-card-outline-color: color-mix(in srgb, var(--md-sys-color-outline) 26%, transparent);
    }

    .spoof-icon {
      color: var(--md-sys-color-primary);
      --m3-icon-fill: 1;
      --m3-icon-weight: 500;
      --m3-icon-size: 20px;
      font-size: 20px;
      margin-top: 1px;
    }

    .spoof-list strong {
      color: var(--md-sys-color-on-surface);
      display: block;
      font-family: var(--md-sys-typescale-title-small-font);
      font-size: var(--md-sys-typescale-title-small-size);
      line-height: var(--md-sys-typescale-title-small-line-height);
      letter-spacing: var(--md-sys-typescale-title-small-tracking);
      font-weight: var(--md-sys-typescale-title-small-weight);
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
      --md-elevated-card-container-color: var(--md-sys-color-surface-container-low);
      --md-elevated-card-container-shape: var(--md-sys-shape-corner-large);
      --md-elevated-card-container-elevation: 1;
      margin-top: 1rem;
      padding: 0.8rem 1rem;
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
      color: var(--md-sys-color-on-surface-variant);
      font-size: 0.95rem;
    }

    .social-links {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    .social-link {
      width: 36px;
      height: 36px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--md-sys-color-on-primary);
      text-decoration: none;
      background: var(--md-sys-color-primary);
      box-shadow: 0 2px 8px rgb(0 0 0 / 20%), inset 0 0 0 1px color-mix(in srgb, white 15%, transparent);
      transition: transform var(--md-sys-motion-duration-short1) var(--md-sys-motion-easing-standard), box-shadow var(--md-sys-motion-duration-short1) var(--md-sys-motion-easing-standard), color var(--md-sys-motion-duration-short1) var(--md-sys-motion-easing-standard);
    }

    .social-link:hover {
      transform: translateY(-2px);
      color: var(--md-sys-color-on-primary-fixed);
      background: var(--md-sys-color-primary-fixed-dim);
      box-shadow: 0 4px 12px rgb(0 0 0 / 25%), inset 0 0 0 1px color-mix(in srgb, white 20%, transparent);
    }

    .social-link:focus-visible {
      outline: 2px solid var(--md-sys-color-primary-fixed);
      outline-offset: 2px;
      transform: translateY(-1px);
    }

    .social-link svg {
      width: 19px;
      height: 19px;
      stroke: currentColor;
    }

    .disclaimer {
      margin-top: 0.65rem;
      padding: 0 0.2rem;
      text-align: center;
      color: var(--md-sys-color-on-surface-variant);
      font-family: var(--md-sys-typescale-label-large-font);
      font-size: var(--md-sys-typescale-label-large-size);
      line-height: var(--md-sys-typescale-label-large-line-height);
      letter-spacing: var(--md-sys-typescale-label-large-tracking);
      font-weight: var(--md-sys-typescale-label-large-weight);
    }

    .disclaimer a {
      color: var(--md-sys-color-primary);
      text-decoration: none;
      font-family: var(--md-sys-typescale-label-large-font);
      font-size: var(--md-sys-typescale-label-large-size);
      line-height: var(--md-sys-typescale-label-large-line-height);
      letter-spacing: var(--md-sys-typescale-label-large-tracking);
      font-weight: var(--md-sys-typescale-label-large-weight);
    }

    .disclaimer a:hover {
      text-decoration: underline;
    }

    .credit {
      margin: 0.25rem 0 0;
      text-align: center;
      color: var(--md-sys-color-on-surface-variant);
      font-family: var(--md-sys-typescale-label-medium-font);
      font-size: var(--md-sys-typescale-label-medium-size);
      line-height: var(--md-sys-typescale-label-medium-line-height);
      letter-spacing: var(--md-sys-typescale-label-medium-tracking);
      font-weight: var(--md-sys-typescale-label-medium-weight);
    }

    .credit a {
      color: var(--md-sys-color-primary);
      text-decoration: none;
      font-family: var(--md-sys-typescale-label-large-font);
      font-size: var(--md-sys-typescale-label-large-size);
      line-height: var(--md-sys-typescale-label-large-line-height);
      letter-spacing: var(--md-sys-typescale-label-large-tracking);
      font-weight: var(--md-sys-typescale-label-large-weight);
    }

    .credit a:hover {
      text-decoration: underline;
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

    @media (max-width: 600px) {
      .shell {
        width: min(100% - 1.2rem, 1100px);
        padding: 0.6rem 0 1.2rem;
      }

      .panel {
        padding: 0.9rem;
      }

      .footer {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .social-links {
        justify-content: center;
      }

      .hero-actions {
        justify-content: center;
      }

      .hero {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }

    @keyframes shared-axis-in {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes rise-in {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .view,
      .motion-item,
      md-filled-card.panel,
      md-elevated-card.panel,
      md-outlined-card.panel,
      .screenshot-item,
      .social-link {
        animation: none;
        transition: none;
        opacity: 1;
        transform: none;
      }

      .side-gallery {
        display: none;
      }
    }

    @media (max-width: 940px) {
      .screenshots-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 1320px) {
      .side-gallery {
        display: none;
      }
    }

    @media (max-width: 760px) {
      .top-bar {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.8rem;
        padding: 0.8rem;
        --md-elevated-card-container-shape: var(--md-sys-shape-corner-large);
      }

      .brand {
        justify-content: center;
        width: 100%;
        margin-bottom: 0.2rem;
      }

      md-tabs {
        width: 100%;
        max-width: calc(100vw - 3.6rem);
        overflow-x: auto;
      }

      .command-row {
        flex-direction: column;
        align-items: stretch;
        gap: 0.6rem;
      }

      .command-snippet {
        min-width: 0;
        max-width: 100%;
      }

      .warning-content {
        gap: 0.5rem;
      }

      .warning-content p {
        font-size: 0.9rem;
      }

      .warning-content .warning-command {
        font-size: 0.8rem;
        word-break: break-word;
      }

      .download-grid {
        grid-template-columns: 1fr;
      }

      .download-item md-elevated-button {
        --md-filled-button-label-text-size: 0.85rem;
      }

      .download-item small {
        font-size: 0.8rem;
      }
    }

    .boot-modes-list {
      margin: 0.75rem 0 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.75rem;
    }

    .boot-modes-list li {
      margin: 0;
      padding: 0;
    }

    .boot-modes-list strong {
      color: var(--md-sys-color-primary);
      display: block;
      font-family: var(--md-sys-typescale-title-small-font);
      font-size: var(--md-sys-typescale-title-small-size);
      line-height: var(--md-sys-typescale-title-small-line-height);
      letter-spacing: var(--md-sys-typescale-title-small-tracking);
      font-weight: var(--md-sys-typescale-title-small-weight);
      margin-bottom: 0.2rem;
    }

    .boot-modes-list p {
      margin: 0;
      color: var(--md-sys-color-on-surface-variant);
      font-family: var(--md-sys-typescale-body-medium-font);
      font-size: var(--md-sys-typescale-body-medium-size);
      line-height: var(--md-sys-typescale-body-medium-line-height);
      letter-spacing: var(--md-sys-typescale-body-medium-tracking);
    }

    .tip-card {
      margin-top: 1.25rem;
      --md-filled-card-container-color: color-mix(in srgb, var(--md-sys-color-tertiary-container) 10%, var(--md-sys-color-surface-container-high) 90%);
      --md-filled-card-container-shape: 16px;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-tertiary) 15%, transparent);
      border: none;
    }

    .tip-card h3 {
      color: var(--md-sys-color-tertiary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .tip-card p {
      color: var(--md-sys-color-on-surface-variant);
      line-height: 1.5;
    }

    .tip-card strong {
      color: var(--md-sys-color-on-surface);
    }

    .tip-card code {
      background: color-mix(in srgb, var(--md-sys-color-tertiary) 15%, transparent);
      color: var(--md-sys-color-tertiary);
      padding: 0.1rem 0.3rem;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 0.9em;
    }

    .tip-divider {
      height: 1px;
      background: color-mix(in srgb, var(--md-sys-color-outline-variant) 50%, transparent);
      margin: 0.75rem 0;
    }
  `;

  constructor() {
    super();
    this.route = 'home';
    this.motionKey = 0;
    this.copiedCommand = '';
    this.copyMessage = '';
    this.pendingScreenshots = HOME_SCREENSHOT_COUNT;
    this.pendingInstructionsTarget = '';
    this.scrollRaf = 0;
    this.lastParallaxOffset = -1;
    this.hasScrolledPastTop = false;
    this.routeView = null;
    this.routeViewLoading = true;
    this.routeViewError = '';
    this.routeViewCache = new Map();
    this.routeViewPromises = new Map();
    this.routeLoadToken = 0;
    this.reduceMotionQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    this.prefersReducedMotion = this.reduceMotionQuery?.matches ?? false;
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleHashChange = this.handleHashChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleMotionPreferenceChange = this.handleMotionPreferenceChange.bind(this);
    this.changelogs = [];
    this.pendingChangelogDate = this.getChangelogDateFromHash();
    this.fetchChangelogs();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', this.handleLocationChange);
    window.addEventListener('hashchange', this.handleHashChange);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.reduceMotionQuery?.addEventListener('change', this.handleMotionPreferenceChange);
    this.handleLocationChange();
    this.handleScroll();
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.handleLocationChange);
    window.removeEventListener('hashchange', this.handleHashChange);
    window.removeEventListener('scroll', this.handleScroll);
    this.reduceMotionQuery?.removeEventListener('change', this.handleMotionPreferenceChange);
    if (this.scrollRaf) {
      cancelAnimationFrame(this.scrollRaf);
      this.scrollRaf = 0;
    }
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (
      this.route === 'instructions'
      && this.pendingInstructionsTarget
      && (changedProperties.has('route') || changedProperties.has('motionKey') || changedProperties.has('routeView'))
    ) {
      this.scheduleInstructionsScroll(this.pendingInstructionsTarget);
    }

    if (
      this.route === 'changelogs'
      && this.pendingChangelogDate
      && (changedProperties.has('route') || changedProperties.has('motionKey') || changedProperties.has('changelogs') || changedProperties.has('routeView'))
    ) {
      this.scheduleChangelogScroll(this.pendingChangelogDate);
    }
  }

  getRouteFromPathname(pathname) {
    const normalized = (pathname || '/').toLowerCase().replace(/\/+$/, '') || '/';
    if (/^\/instructions(?:\/|$)/.test(normalized)) {
      return 'instructions';
    }
    if (/^\/downloads(?:\/|$)/.test(normalized)) {
      return 'downloads';
    }
    if (/^\/changelogs(?:\/|$)/.test(normalized)) {
      return 'changelogs';
    }
    if (/^\/test-build(?:\/|$)/.test(normalized)) {
      return 'test-build';
    }
    return 'home';
  }

  getChangelogDateFromHash() {
    const rawHash = (window.location.hash || '').replace(/^#/, '').trim();
    if (!rawHash) {
      return '';
    }

    const decoded = decodeURIComponent(rawHash);
    return /^\d{4}-\d{2}-\d{2}$/.test(decoded) ? decoded : '';
  }

  handleHashChange() {
    this.handleLocationChange();
  }

  handleLocationChange() {
    let nextRoute = this.getRouteFromPathname(window.location.pathname);

    if (nextRoute === 'home') {
      const legacyHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (legacyHash.startsWith('instructions')) {
        nextRoute = 'instructions';
        if (window.location.pathname !== '/instructions') {
          window.history.replaceState({}, '', '/instructions');
        }
      } else if (legacyHash.startsWith('changelogs')) {
        nextRoute = 'changelogs';
        if (window.location.pathname !== '/changelogs') {
          window.history.replaceState({}, '', '/changelogs');
        }
      }
    }

    const hashDate = this.getChangelogDateFromHash();
    if (nextRoute === 'changelogs' && hashDate) {
      this.pendingChangelogDate = hashDate;
    } else if (!hashDate) {
      this.pendingChangelogDate = '';
    }

    if (this.route !== nextRoute) {
      this.route = nextRoute;
      this.motionKey += 1;
      this.loadRouteView(nextRoute);
      return;
    }

    this.loadRouteView(nextRoute);

    if (nextRoute === 'changelogs' && this.pendingChangelogDate) {
      this.scheduleChangelogScroll(this.pendingChangelogDate);
    }
  }

  handleMotionPreferenceChange(event) {
    this.prefersReducedMotion = event.matches;
    this.lastParallaxOffset = -1;
    this.style.setProperty('--side-left-shift', '-62px');
    this.style.setProperty('--side-right-shift', '-26px');

    if (!this.prefersReducedMotion) {
      this.handleScroll();
    }
  }

  handleScroll() {
    const offset = Math.round(window.scrollY || 0);
    const isScrolled = offset > 6;
    if (isScrolled !== this.hasScrolledPastTop) {
      this.hasScrolledPastTop = isScrolled;
      this.classList.toggle('is-scrolled', isScrolled);
    }

    if (this.scrollRaf || this.prefersReducedMotion || window.innerWidth < 1320) {
      return;
    }

    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = 0;
      const nextOffset = Math.round(window.scrollY || 0);
      if (Math.abs(nextOffset - this.lastParallaxOffset) < 6) {
        return;
      }

      this.lastParallaxOffset = nextOffset;
      const leftShift = ((nextOffset * 0.14) % 190) - 72;
      const rightShift = -(((nextOffset * 0.12) % 190) - 48);
      this.style.setProperty('--side-left-shift', `${leftShift}px`);
      this.style.setProperty('--side-right-shift', `${rightShift}px`);
    });
  }

  navigate(route) {
    const path = route === 'instructions' ? '/instructions' : route === 'downloads' ? '/downloads' : route === 'changelogs' ? '/changelogs' : route === 'test-build' ? '/test-build' : '/';
    const currentPath = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
    if (currentPath !== path) {
      window.history.pushState({}, '', path);
    }

    if (this.route !== route) {
      this.route = route;
    }
    this.motionKey += 1;
    this.loadRouteView(route);
  }

  navigateToInstructions(target = 'steps') {
    this.pendingInstructionsTarget = target;
    this.navigate('instructions');
  }

  openChangelogDate(date) {
    const normalizedDate = String(date || '').trim();
    if (!normalizedDate) {
      return;
    }

    this.pendingChangelogDate = normalizedDate;
    const targetPath = `/changelogs#${encodeURIComponent(normalizedDate)}`;
    const currentPath = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
    const currentFullPath = `${currentPath}${window.location.hash || ''}`;
    if (currentFullPath !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }

    if (this.route !== 'changelogs') {
      this.route = 'changelogs';
      this.motionKey += 1;
      this.loadRouteView('changelogs');
      return;
    }

    this.loadRouteView('changelogs');
    this.scheduleChangelogScroll(normalizedDate);
  }

  scheduleInstructionsScroll(target) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.scrollInstructionsTarget(target));
    });
  }

  scheduleChangelogScroll(date) {
    if (!date) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.scrollChangelogTarget(date));
    });
  }

  scrollChangelogTarget(date) {
    const targetId = `changelog-${date}`;
    const targetSelector = typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
      ? `#${CSS.escape(targetId)}`
      : `#${targetId}`;
    const targetElement = this.renderRoot?.querySelector(targetSelector);
    if (!targetElement) {
      return;
    }

    const targetRect = targetElement.getBoundingClientRect();
    const targetTop = window.scrollY + targetRect.top;
    const scrollTop = targetTop - 96;
    window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
    this.pendingChangelogDate = '';
  }

  scrollInstructionsTarget(target) {
    const targetSelector = '#flash-steps-card';
    const targetElement = this.renderRoot?.querySelector(targetSelector);
    if (!targetElement) {
      return;
    }

    const targetRect = targetElement.getBoundingClientRect();
    const targetTop = window.scrollY + targetRect.top;
    let scrollTop = targetTop - 88;

    if (target === 'steps') {
      scrollTop = targetTop - (window.innerHeight * 0.42);
    }

    window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
    this.pendingInstructionsTarget = '';
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

  handleScreenshotSettled() {
    if (this.pendingScreenshots > 0) {
      this.pendingScreenshots -= 1;
    }
  }

  getRouteLoader(route) {
    return ROUTE_VIEW_LOADERS[route] || ROUTE_VIEW_LOADERS.home;
  }

  async ensureRouteView(route) {
    if (this.routeViewCache.has(route)) {
      return this.routeViewCache.get(route);
    }

    let pending = this.routeViewPromises.get(route);
    if (!pending) {
      pending = this.getRouteLoader(route)()
        .then((module) => {
          if (!module || typeof module.default !== 'function') {
            throw new Error(`Invalid route view module: ${route}`);
          }

          this.routeViewCache.set(route, module.default);
          this.routeViewPromises.delete(route);
          return module.default;
        })
        .catch((error) => {
          this.routeViewPromises.delete(route);
          throw error;
        });
      this.routeViewPromises.set(route, pending);
    }

    return pending;
  }

  async loadRouteView(route) {
    const normalizedRoute = ROUTE_VIEW_LOADERS[route] ? route : 'home';
    const currentToken = ++this.routeLoadToken;
    const cachedView = this.routeViewCache.get(normalizedRoute);

    if (cachedView) {
      this.routeView = cachedView;
      this.routeViewError = '';
      this.routeViewLoading = false;
      return;
    }

    this.routeView = null;
    this.routeViewError = '';
    this.routeViewLoading = true;

    try {
      const viewRenderer = await this.ensureRouteView(normalizedRoute);
      if (currentToken !== this.routeLoadToken || this.route !== normalizedRoute) {
        return;
      }

      this.routeView = viewRenderer;
      this.routeViewLoading = false;
    } catch (error) {
      if (currentToken !== this.routeLoadToken) {
        return;
      }

      this.routeViewError = 'Could not load this section. Please refresh and try again.';
      this.routeViewLoading = false;
      console.error(`Failed to load route view: ${normalizedRoute}`, error);
    }
  }

  renderRouteSkeleton() {
    return html`
      <section class="view" aria-label="Loading view">
        <md-outlined-card class="panel motion-item">
          <div style="display: flex; align-items: center; gap: 0.85rem; padding: 1rem;">
            <md-circular-progress indeterminate></md-circular-progress>
            <span>Loading section...</span>
          </div>
        </md-outlined-card>
      </section>
    `;
  }

  renderRouteError() {
    return html`
      <section class="view" aria-label="Route load error">
        <md-outlined-card class="panel motion-item">
          <h2>Section unavailable</h2>
          <p>${this.routeViewError}</p>
          <div class="hero-actions">
            <md-text-button @click=${() => this.loadRouteView(this.route)}>
              <md-icon slot="icon">refresh</md-icon>
              Retry
            </md-text-button>
          </div>
        </md-outlined-card>
      </section>
    `;
  }

  renderActiveRoute() {
    if (this.routeViewError) {
      return this.renderRouteError();
    }

    if (this.routeViewLoading || !this.routeView) {
      return this.renderRouteSkeleton();
    }

    return this.routeView(this);
  }

  renderSideGallery(side = 'left') {
    const sideTileCount = 8;
    return html`
      <aside class="side-gallery ${side}" aria-hidden="true">
        <div class="side-track">
          ${Array.from({ length: sideTileCount }).map((_, index) => {
            const shapeStyle = MATERIAL_SIDE_SHAPES[index % MATERIAL_SIDE_SHAPES.length];
            return html`
            <md-outlined-card
              class="side-art ${shapeStyle.shape}"
              style=${`--tile-tilt: ${shapeStyle.tilt};`}>
              <img src="/side-photo.jpg" alt="" loading="lazy" decoding="async" width="320" height="320" />
            </md-outlined-card>
          `;
          })}
        </div>
      </aside>
    `;
  }

  renderTopBar() {
    return html`
      <md-elevated-card class="top-bar">
        <div class="brand">
          <a class="brand-pixelos" href="https://blog.pixelos.net/" target="_blank" rel="noopener noreferrer">PixelOS</a>
          <img class="brand-logo" src="/android-logo.svg" alt="" aria-hidden="true" />
          <span class="brand-xaga">Xaga</span>
        </div>

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
          <md-primary-tab
            ?active=${this.route === 'downloads'}
            @click=${() => this.navigate('downloads')}>
            <md-icon slot="icon">folder_zip</md-icon>
            Downloads & Resources
          </md-primary-tab>
          <md-primary-tab
            ?active=${this.route === 'changelogs'}
            @click=${() => this.navigate('changelogs')}>
            <md-icon slot="icon">history</md-icon>
            Changelogs
          </md-primary-tab>
        </md-tabs>
      </md-elevated-card>
    `;
  }

  async fetchChangelogs() {
    try {
      const response = await fetch('/CHANGELOGS.md');
      if (!response.ok) throw new Error('Failed to fetch changelogs');
      const text = await response.text();
      
      const logs = [];
      const lines = text.split('\n');
      let currentLog = null;
      let currentEntry = null;

      for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // Match version and date, allowing optional leading labels/emojis:
        // ## [2026-03-06] - 16.3 Stable
        // ## 🗓️ [2026-03-06] - 16.3 Stable
        const versionMatch = line.match(/^##\s+(?:[^\[]*?)?\[([\d-]+)\]\s+-\s+(.*)$/);
        if (versionMatch) {
          currentLog = {
            version: versionMatch[2],
            date: versionMatch[1],
            tag: logs.length === 0 ? 'Latest' : '', // Mark first one as latest
            entries: []
          };
          logs.push(currentLog);
          currentEntry = null;
          continue;
        }

        // Match entry type: ### Added
        const typeMatch = line.match(/^###\s+(.*)$/);
        if (typeMatch && currentLog) {
          currentEntry = {
            type: typeMatch[1],
            items: []
          };
          currentLog.entries.push(currentEntry);
          continue;
        }

        // Match items: - Enabled Bluetooth...
        const itemMatch = line.match(/^- (.*)$/);
        if (itemMatch && currentEntry) {
          currentEntry.items.push(itemMatch[1]);
        }
      }

      this.changelogs = logs;
    } catch (error) {
      console.error('Error fetching changelogs:', error);
      // Fallback if fetch fails
      this.changelogs = [{
        version: 'Error',
        date: '',
        entries: [{ type: 'Error', items: ['Could not load changelogs from Markdown.'] }]
      }];
    }
  }

  render() {
    return html`
      ${this.renderSideGallery('left')}
        <div class="shell">
        ${this.renderTopBar()}
        ${keyed(this.motionKey, this.renderActiveRoute())}

        <md-elevated-card class="footer">
          <span>PixelOS Xaga community website</span>
          <div class="social-links">
            <a class="social-link" href="https://github.com/Pixelos-xaga/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
              </svg>
            </a>
            <a class="social-link" href="https://t.me/XAGASupport" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
              </svg>
            </a>
          </div>
        </md-elevated-card>

        <p class="disclaimer">
          This website is not directly affiliated with
          <a href="https://pixelos.net/" target="_blank" rel="noopener noreferrer">official PixelOS</a>.
        </p>
        <p class="credit">
          By Angad -
          <a href="https://t.me/Angxddeep" target="_blank" rel="noopener noreferrer">@Angxddeep</a>
        </p>

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
