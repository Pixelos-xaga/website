import { LitElement, css, html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import '@material/web/progress/linear-progress.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/fab/fab.js';
import '@material/web/switch/switch.js';
import '@material/web/labs/navigationbar/navigation-bar.js';
import '@material/web/labs/navigationtab/navigation-tab.js';
import { HOME_SCREENSHOT_COUNT } from './home-screenshots.js';
import { getChangelogDateFromHash, parseChangelogs } from './lib/changelog-utils.js';
import { NAV_ROUTES, ROUTE_VIEW_LOADERS, getLegacyHashRoute, getRouteFromPathname, getRoutePath } from './lib/app-routes.js';
import changelogMarkdown from './content/changelog.md?raw';

const MATERIAL_SIDE_SHAPES = [
  { shape: 'shape-circle', tilt: '-4deg' },
  { shape: 'shape-square', tilt: '3deg' },
  { shape: 'shape-slanted', tilt: '-2deg' },
  { shape: 'shape-arch', tilt: '4deg' },
  { shape: 'shape-gem', tilt: '-4deg' },
  { shape: 'shape-sunny', tilt: '2deg' }
];

const CHANGELOGS = parseChangelogs(changelogMarkdown);

class PixelosApp extends LitElement {
  static properties = {
    route: { state: true },
    motionKey: { state: true },
    copiedCommand: { state: true },
    copyMessage: { state: true },
    copyMessageTone: { state: true },
    downloadsFilter: { state: true },
    pendingScreenshots: { state: true },
    activeScreenshot: { state: true },
    changelogs: { state: true },
    changelogsLatestFirst: { state: true },
    selectedChangelogDate: { state: true },
    routeView: { state: true },
    routeViewLoading: { state: true },
    routeViewError: { state: true },
    funMode: { state: true }
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
      --app-panel-edge-rest: color-mix(in srgb, var(--md-sys-color-outline-variant) 84%, var(--md-sys-color-primary) 16%);
      --app-panel-edge-hover: color-mix(in srgb, var(--md-sys-color-outline-variant) 72%, var(--md-sys-color-primary) 28%);
      --app-panel-shadow: inset 0 0 0 1px var(--app-panel-edge-rest), 0 8px 24px rgb(0 0 0 / 16%);
      --app-panel-shadow-hover: inset 0 0 0 1px var(--app-panel-edge-hover), 0 12px 30px rgb(0 0 0 / 20%);
      --app-tile-edge-rest: color-mix(in srgb, var(--md-sys-color-outline-variant) 82%, var(--md-sys-color-primary) 18%);
      --app-tile-edge-hover: color-mix(in srgb, var(--md-sys-color-outline-variant) 68%, var(--md-sys-color-primary) 32%);
      --app-tile-shadow-soft: inset 0 0 0 1px var(--app-tile-edge-rest), 0 4px 12px rgb(0 0 0 / 16%);
      --app-tile-shadow-soft-hover: inset 0 0 0 1px var(--app-tile-edge-hover), 0 8px 18px rgb(0 0 0 / 20%);
      --app-tile-shadow: inset 0 0 0 1px var(--app-tile-edge-rest), 0 8px 18px rgb(0 0 0 / 16%);
      --app-tile-shadow-hover: inset 0 0 0 1px var(--app-tile-edge-hover), 0 12px 26px rgb(0 0 0 / 20%);
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
      -webkit-tap-highlight-color: transparent;
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
      object-position: center 15%;
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
      border: 0;
      box-shadow: var(--app-panel-shadow);
      transition: box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard), background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
      position: sticky;
      top: 0.6rem;
      z-index: 5;
      backdrop-filter: blur(14px);
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 0.9rem;
      padding: 0.72rem 1rem;
      margin-bottom: 1rem;
    }

    .fun-toggle {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.4rem 0.85rem;
      border-radius: 999px;
      background: var(--md-sys-color-surface-container-high);
      box-shadow: inset 0 0 0 1px var(--app-tile-edge-rest);
      user-select: none;
      transition: background-color 200ms var(--motion-standard);
    }

    .fun-toggle:hover {
      background: color-mix(in srgb, var(--md-sys-color-primary) 12%, var(--md-sys-color-surface-container-high) 88%);
    }

    .fun-toggle strong {
      font-family: var(--md-sys-typescale-label-large-font);
      font-size: var(--md-sys-typescale-label-large-size);
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
    }

    .fun-toggle md-switch {
      --md-switch-selected-track-color: var(--md-sys-color-primary);
      --md-switch-selected-handle-color: var(--md-sys-color-on-primary);
      scale: 0.85;
    }

    :host(.is-scrolled) .top-bar {
      --md-elevated-card-container-color: color-mix(in srgb, var(--md-sys-color-surface-container-high) 85%, var(--md-sys-color-primary-container) 15%);
      box-shadow: var(--app-panel-shadow-hover);
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
      box-shadow: none;
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
      transition: box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard), background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
      box-shadow: var(--app-panel-shadow);
    }

    md-filled-card.panel:hover,
    md-elevated-card.panel:hover,
    md-outlined-card.panel:hover {
      box-shadow: var(--app-panel-shadow-hover);
    }

    md-filled-card.panel {
      --md-filled-card-container-color: color-mix(in srgb, var(--md-sys-color-primary-container) 70%, var(--md-sys-color-surface-container-high) 30%);
      --md-filled-card-container-shape: var(--md-sys-shape-corner-extra-large);
    }

    md-elevated-card.panel {
      --md-elevated-card-container-color: color-mix(in srgb, var(--md-sys-color-secondary-container) 18%, var(--md-sys-color-surface-container) 82%);
      --md-elevated-card-container-shape: var(--md-sys-shape-corner-large);
      --md-elevated-card-container-elevation: 1;
    }

    md-outlined-card.panel {
      --md-outlined-card-container-color: color-mix(in srgb, var(--md-sys-color-tertiary-container) 12%, var(--md-sys-color-surface-container) 88%);
      --md-outlined-card-container-shape: var(--md-sys-shape-corner-large);
      --md-outlined-card-outline-color: transparent;
      --md-outlined-card-outline-width: 0;
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

    .screenshots-strip {
      margin-top: 0.4rem;
      position: relative;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0.1rem 0.15rem 0.45rem;
      scroll-padding-inline: 0.15rem;
      scroll-snap-type: x proximity;
      overscroll-behavior-x: contain;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-x pan-y pinch-zoom;
      mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
    }

    .screenshots-strip:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--md-sys-color-primary) 72%, white);
      outline-offset: 4px;
    }

    .screenshots-strip::-webkit-scrollbar {
      height: 6px;
    }

    .screenshots-strip::-webkit-scrollbar-thumb {
      background: color-mix(in srgb, var(--md-sys-color-outline-variant) 70%, transparent);
      border-radius: 999px;
    }

    .screenshots-strip::-webkit-scrollbar-track {
      background: transparent;
    }

    .screenshots-track {
      display: flex;
      gap: 0.56rem;
      width: max-content;
    }

    .screenshot-item {
      display: block;
      flex: 0 0 clamp(148px, 18vw, 188px);
      margin: 0;
      overflow: hidden;
      border-radius: 16px;
      background: var(--md-sys-color-surface-container-high);
      box-shadow: var(--app-tile-shadow-soft);
      aspect-ratio: 9 / 20;
      scroll-snap-align: start;
      transition: transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard), box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
    }

    .screenshot-button {
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
      padding: 0;
      background: transparent;
      cursor: zoom-in;
    }

    .screenshot-item:hover,
    .screenshot-item:has(.screenshot-button:focus-visible) {
      transform: translateY(-2px);
      box-shadow: var(--app-tile-shadow-soft-hover);
    }

    .screenshot-button:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--md-sys-color-primary) 72%, white);
      outline-offset: -2px;
    }

    .screenshot-overlay {
      position: fixed;
      inset: 0;
      z-index: 1200;
      display: grid;
      place-items: center;
      padding: clamp(0.85rem, 2vw, 1.5rem);
      background: rgb(0 0 0 / 76%);
      backdrop-filter: blur(6px);
    }

    .screenshot-overlay-panel {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: min(100%, 1440px);
      height: min(100%, calc(100vh - 1.7rem));
      min-height: 0;
    }

    .screenshot-overlay-close {
      position: absolute;
      top: 0.35rem;
      right: 0.35rem;
      z-index: 1;
      width: 44px;
      height: 44px;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--md-sys-color-surface-container-high) 84%, rgb(8 10 18 / 88%) 16%);
      color: var(--md-sys-color-primary-fixed);
      cursor: pointer;
      font: inherit;
      display: grid;
      place-items: center;
      box-shadow: inset 0 0 0 1px var(--app-tile-edge-rest), 0 8px 18px rgb(0 0 0 / 24%);
      transition: background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard),
        color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard),
        box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard),
        transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
    }

    .screenshot-overlay-close:hover,
    .screenshot-overlay-close:focus-visible {
      background: color-mix(in srgb, var(--md-sys-color-primary-container) 36%, rgb(8 10 18 / 80%) 64%);
      color: var(--md-sys-color-primary-fixed);
      box-shadow: inset 0 0 0 1px var(--app-tile-edge-hover), 0 12px 24px rgb(0 0 0 / 28%);
      outline: 2px solid color-mix(in srgb, var(--md-sys-color-primary-fixed) 88%, white 12%);
      outline-offset: 2px;
      transform: translateY(-1px);
    }

    .screenshot-overlay-close md-icon {
      --m3-icon-size: 22px;
      --m3-icon-fill: 1;
    }

    .screenshot-overlay-image {
      width: auto;
      height: min(88vh, calc(100vh - 3rem));
      max-width: min(92vw, 680px);
      min-width: 0;
      min-height: 0;
      display: block;
      object-fit: contain;
      border-radius: 20px;
      box-shadow: 0 24px 72px rgb(0 0 0 / 42%);
      background: black;
    }

    .screenshot-item img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .screenshots-loader,
    .route-loader {
      margin-top: 0.72rem;
      display: grid;
      gap: 0.48rem;
      width: min(100%, 24rem);
      color: var(--md-sys-color-on-surface-variant);
    }

    .screenshots-loader span,
    .route-loader span {
      font-size: 0.9rem;
      line-height: 1.35;
    }

    .route-loader {
      padding: 1rem;
    }

    .route-loader strong {
      color: var(--md-sys-color-on-surface);
      font-family: var(--md-sys-typescale-title-medium-font);
      font-size: var(--md-sys-typescale-title-medium-size);
      line-height: var(--md-sys-typescale-title-medium-line-height);
      letter-spacing: var(--md-sys-typescale-title-medium-tracking);
      font-weight: 600;
    }

    .screenshots-loader md-linear-progress,
    .route-loader md-linear-progress {
      --md-linear-progress-active-indicator-color: var(--md-sys-color-primary);
      --md-linear-progress-track-color: color-mix(in srgb, var(--md-sys-color-primary) 14%, var(--md-sys-color-surface-container-high) 86%);
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

    md-primary-tab md-icon,
    md-navigation-tab md-icon {
      --m3-icon-fill: 0;
      --m3-icon-weight: 400;
      --m3-icon-size: 24px;
    }

    md-primary-tab[active] md-icon,
    md-navigation-tab[active] md-icon {
      --m3-icon-fill: 1;
      --m3-icon-weight: 500;
    }

    .feature-list {
      margin-top: 0.65rem;
      display: grid;
      gap: 0.75rem;
    }

    .feature-tile {
      display: grid;
      grid-template-columns: 46px minmax(0, 1fr) auto;
      gap: 0.9rem;
      align-items: center;
      width: 100%;
      min-width: 0;
      padding: 1rem 1.1rem;
      border: 0;
      border-radius: 20px;
      background: color-mix(in srgb, var(--md-sys-color-primary-container) 12%, var(--md-sys-color-surface-container-high) 88%);
      box-shadow: var(--app-tile-shadow-soft);
      color: var(--md-sys-color-on-surface);
    }

    .feature-tile-button {
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition: transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard),
        box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
    }

    .feature-tile-button:hover,
    .feature-tile-button:focus-visible {
      transform: translateY(-2px);
      box-shadow: var(--app-tile-shadow-soft-hover);
    }

    .feature-tile-button:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--md-sys-color-primary-fixed) 88%, white 12%);
      outline-offset: -2px;
    }

    .feature-tile-icon {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      color: var(--md-sys-color-primary);
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--md-sys-color-primary) 18%, transparent),
        color-mix(in srgb, var(--md-sys-color-primary-container) 45%, transparent)
      );
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 24%, transparent);
    }

    .feature-tile-icon md-icon {
      --m3-icon-size: 22px;
      --m3-icon-fill: 1;
    }

    .feature-tile-copy {
      min-width: 0;
      display: grid;
      gap: 0.18rem;
    }

    .feature-tile-copy strong {
      color: var(--md-sys-color-on-surface);
      font-family: var(--md-sys-typescale-title-medium-font);
      font-size: var(--md-sys-typescale-title-medium-size);
      line-height: var(--md-sys-typescale-title-medium-line-height);
      letter-spacing: var(--md-sys-typescale-title-medium-tracking);
      font-weight: 600;
    }

    .feature-tile-copy span {
      color: var(--md-sys-color-on-surface-variant);
      font-family: var(--md-sys-typescale-body-medium-font);
      font-size: var(--md-sys-typescale-body-medium-size);
      line-height: var(--md-sys-typescale-body-medium-line-height);
      letter-spacing: var(--md-sys-typescale-body-medium-tracking);
      font-weight: var(--md-sys-typescale-body-medium-weight);
    }

    .feature-tile-trailing {
      width: 34px;
      height: 34px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      color: var(--md-sys-color-primary);
      background: color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent);
      transition: transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard),
        background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
    }

    .feature-tile-button:hover .feature-tile-trailing,
    .feature-tile-button:focus-visible .feature-tile-trailing {
      transform: translateX(2px);
      background: color-mix(in srgb, var(--md-sys-color-primary) 16%, transparent);
    }

    .feature-tile-trailing md-icon {
      --m3-icon-size: 18px;
      --m3-icon-fill: 1;
    }

    .downloads-filter-set {
      margin-top: 0.1rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.55rem;
      align-items: center;
      overflow-x: auto;
      padding: 0 0.05rem 0.1rem;
      scrollbar-width: none;
    }

    .downloads-filter-set::-webkit-scrollbar {
      display: none;
    }

    .downloads-filter-chip {
      flex: 0 0 auto;
      --md-filter-chip-container-shape: 999px;
      --md-filter-chip-outline-color: var(--app-tile-edge-rest);
      --md-filter-chip-label-text-color: var(--md-sys-color-on-surface-variant);
      --md-filter-chip-leading-icon-color: var(--md-sys-color-primary);
      --md-filter-chip-selected-container-color: color-mix(in srgb, var(--md-sys-color-secondary-container) 82%, var(--md-sys-color-surface-container-high) 18%);
      --md-filter-chip-selected-label-text-color: var(--md-sys-color-on-secondary-container);
      --md-filter-chip-selected-leading-icon-color: var(--md-sys-color-on-secondary-container);
      --md-filter-chip-focus-outline-color: var(--app-tile-edge-hover);
    }

    .view-grid {
      margin-top: 1rem;
      display: grid;
      gap: 1rem;
    }

    .path-note {
      margin-top: 0.75rem;
      color: var(--md-sys-color-on-surface-variant);
      font-family: var(--md-sys-typescale-label-medium-font);
      font-size: var(--md-sys-typescale-label-medium-size);
    }

    .changelog-card {
      --md-outlined-card-container-color: var(--md-sys-color-surface-container-high);
      margin-bottom: 1rem;
    }

    .changelog-card.active {
      --md-outlined-card-container-color: color-mix(in srgb, var(--md-sys-color-primary-container) 20%, var(--md-sys-color-surface-container-high) 80%);
      box-shadow: var(--app-panel-shadow-hover);
    }

    .changelog-toolbar-panel {
      margin-bottom: 0.9rem;
      --md-outlined-card-container-color: color-mix(in srgb, var(--md-sys-color-primary-container) 10%, var(--md-sys-color-surface-container-high) 90%);
    }

    .changelog-toolbar {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      align-items: stretch;
    }

    .changelog-toolbar-controls {
      display: grid;
      gap: 0.85rem;
      padding: 1rem;
      border-radius: 22px;
      background:
        radial-gradient(circle at top right, color-mix(in srgb, var(--md-sys-color-primary) 16%, transparent), transparent 52%),
        linear-gradient(180deg, color-mix(in srgb, var(--md-sys-color-primary-container) 18%, transparent), transparent 72%),
        color-mix(in srgb, var(--md-sys-color-surface-container) 76%, var(--md-sys-color-surface-container-high) 24%);
      box-shadow: var(--app-tile-shadow-soft);
      align-content: center;
    }

    .changelog-toolbar-copy {
      display: grid;
      gap: 0.45rem;
      align-content: center;
      max-width: 28rem;
    }

    .changelog-toolbar-kicker {
      display: inline-flex;
      width: fit-content;
      align-items: center;
      justify-content: center;
      padding: 0.28rem 0.72rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--md-sys-color-primary) 14%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 24%, transparent);
      color: var(--md-sys-color-primary-fixed);
      font-family: var(--md-sys-typescale-label-medium-font);
      font-size: 0.72rem;
      line-height: 1;
      letter-spacing: 0.08em;
      font-weight: 700;
      text-transform: uppercase;
    }

    .changelog-toolbar-copy h2 {
      margin: 0;
    }

    .changelog-toolbar-copy p {
      margin: 0;
      color: var(--md-sys-color-on-surface-variant);
      max-width: 31rem;
    }

    .changelog-select {
      width: 100%;
      --md-outlined-select-text-field-container-shape: 18px;
      --md-outlined-select-text-field-container-color: color-mix(in srgb, var(--md-sys-color-surface-container-highest) 68%, var(--md-sys-color-surface-container-high) 32%);
      --md-outlined-select-text-field-focus-outline-color: var(--md-sys-color-primary);
      --md-outlined-select-text-field-outline-color: var(--app-tile-edge-rest);
      --md-outlined-select-text-field-hover-outline-color: var(--app-tile-edge-hover);
    }

    .changelog-order-toggle {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 18px;
      background: color-mix(in srgb, var(--md-sys-color-secondary-container) 14%, var(--md-sys-color-surface-container-high) 86%);
      box-shadow: inset 0 0 0 1px var(--app-tile-edge-rest);
    }

    .changelog-order-copy {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .changelog-order-copy strong {
      color: var(--md-sys-color-on-surface);
      font-family: var(--md-sys-typescale-label-large-font);
      font-size: var(--md-sys-typescale-label-large-size);
      font-weight: 600;
    }

    .changelog-order-copy span {
      color: var(--md-sys-color-on-surface-variant);
      font-family: var(--md-sys-typescale-body-small-font);
      font-size: var(--md-sys-typescale-body-small-size);
      opacity: 0.8;
    }

    .changelog-order-toggle md-switch {
      --md-switch-selected-track-color: var(--md-sys-color-primary);
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

    .changelog-list a {
      color: var(--md-sys-color-primary);
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 0.2em;
    }

    .changelog-list a:hover,
    .changelog-list a:focus-visible {
      color: var(--md-sys-color-primary-fixed-dim);
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

    .download-grid {
      margin-top: 0.65rem;
      display: grid;
      gap: 0.85rem;
      grid-template-columns: 1fr;
      justify-content: start;
    }

    @media (min-width: 720px) {
      .download-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .download-item {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-radius: 20px;
      --md-outlined-card-container-color: color-mix(in srgb, var(--md-sys-color-surface-container-high) 85%, var(--md-sys-color-primary-container) 15%);
      --md-outlined-card-outline-color: color-mix(in srgb, var(--md-sys-color-outline) 15%, transparent);
      --md-outlined-card-outline-width: 1px;
      min-width: 0;
      max-width: 100%;
      transition: transform 200ms var(--motion-standard), box-shadow 200ms var(--motion-standard);
      box-shadow: var(--app-tile-shadow-soft);
    }

    .download-item:hover {
      transform: translateY(-4px);
      box-shadow: var(--app-tile-shadow-soft-hover);
      --md-outlined-card-outline-color: color-mix(in srgb, var(--md-sys-color-primary) 35%, transparent);
    }

    .download-link {
      display: block;
      padding: 1rem;
      color: var(--md-sys-color-on-surface);
      text-decoration: none;
      background: linear-gradient(135deg, color-mix(in srgb, var(--md-sys-color-primary-container) 15%, transparent), transparent);
    }

    .download-link-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .download-link-kicker {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.65rem;
      border-radius: 8px;
      background: color-mix(in srgb, var(--md-sys-color-primary) 15%, transparent);
      color: var(--md-sys-color-primary);
      font-family: var(--md-sys-typescale-label-small-font);
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .optional-tag {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
      background: color-mix(in srgb, var(--md-sys-color-tertiary-container) 40%, transparent);
      color: var(--md-sys-color-tertiary-fixed-dim);
      font-family: var(--md-sys-typescale-label-small-font);
      font-size: 0.64rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-tertiary) 25%, transparent);
    }

    .download-link-main {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .download-link-icon {
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      background: color-mix(in srgb, var(--md-sys-color-primary) 12%, transparent);
      color: var(--md-sys-color-primary);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 20%, transparent);
    }

    .download-link-icon md-icon {
      --m3-icon-size: 22px;
      --m3-icon-fill: 1;
    }

    .download-link-copy {
      flex: 1;
      min-width: 0;
    }

    .download-link-copy strong {
      display: block;
      font-family: var(--md-sys-typescale-title-medium-font);
      font-size: 1rem;
      margin-bottom: 0.1rem;
      color: var(--md-sys-color-on-surface);
    }

    .download-link-copy span {
      display: block;
      font-family: var(--md-sys-typescale-body-small-font);
      font-size: 0.78rem;
      color: var(--md-sys-color-on-surface-variant);
    }

    .download-link-trailing {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      color: var(--md-sys-color-primary);
      background: color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent);
      transition: transform 200ms var(--motion-standard), opacity 200ms var(--motion-standard);
    }

    .download-link-trailing md-icon {
      --m3-icon-size: 18px;
      --m3-icon-fill: 1;
    }

    .download-item:hover .download-link-trailing {
      transform: translate(2px, -2px);
      background: color-mix(in srgb, var(--md-sys-color-primary) 18%, transparent);
    }

    .download-checksum-container {
      margin-top: auto;
      padding: 0.75rem 1rem 1rem;
      background: color-mix(in srgb, var(--md-sys-color-surface-container-highest) 35%, transparent);
      border-top: 1px solid color-mix(in srgb, var(--md-sys-color-outline) 10%, transparent);
    }

    .download-link-checksum {
      display: grid;
      gap: 0.5rem;
    }

    .checksum-label {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-family: var(--md-sys-typescale-label-small-font);
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--md-sys-color-primary);
    }

    .checksum-label md-icon {
      --m3-icon-size: 14px;
      --m3-icon-fill: 1;
    }

    .checksum-value-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: color-mix(in srgb, var(--md-sys-color-surface-container-lowest) 50%, transparent);
      padding: 0.4rem 0.6rem;
      border-radius: 10px;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 15%, transparent);
    }

    .checksum-value {
      flex: 1;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--md-sys-color-on-surface-variant);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .checksum-copy-button {
      --md-icon-button-icon-size: 18px;
      --md-icon-button-container-width: 28px;
      --md-icon-button-container-height: 28px;
      margin: -4px;
      color: var(--md-sys-color-primary);
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
      --md-outlined-card-outline-color: transparent;
      --md-outlined-card-outline-width: 0;
      box-shadow: var(--app-tile-shadow-soft);
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

    .tip-card {
      --md-filled-card-container-color: color-mix(in srgb, var(--md-sys-color-secondary-container) 58%, var(--md-sys-color-surface-container-high) 42%);
    }

    .tip-card-text {
      width: 100%;
    }

    .tip-entry {
      position: relative;
      display: grid;
      gap: 0.45rem;
      padding-left: 1rem;
    }

    .tip-entry::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.1rem;
      bottom: 0.1rem;
      width: 3px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--md-sys-color-primary) 70%, var(--md-sys-color-secondary) 30%);
      opacity: 0.9;
    }

    .tip-entry-header {
      display: grid;
      gap: 0.22rem;
    }

    .tip-entry-header strong {
      font-family: var(--md-sys-typescale-title-medium-font);
      font-size: var(--md-sys-typescale-title-medium-size);
      line-height: var(--md-sys-typescale-title-medium-line-height);
      letter-spacing: var(--md-sys-typescale-title-medium-tracking);
      font-weight: 600;
      color: var(--md-sys-color-on-secondary-container);
    }

    .tip-label {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      padding: 0.16rem 0.5rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--md-sys-color-primary) 20%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent);
      color: var(--md-sys-color-primary-fixed);
      font-family: var(--md-sys-typescale-label-medium-font);
      font-size: var(--md-sys-typescale-label-medium-size);
      line-height: var(--md-sys-typescale-label-medium-line-height);
      letter-spacing: var(--md-sys-typescale-label-medium-tracking);
      font-weight: var(--md-sys-typescale-label-medium-weight);
      text-transform: uppercase;
    }

    .tip-callout {
      padding-top: 0.15rem;
      color: var(--md-sys-color-on-secondary-container);
    }

    md-divider.panel-divider,
    md-divider.tip-divider {
      display: block;
      height: 1px;
      --md-divider-color: color-mix(in srgb, var(--md-sys-color-primary) 28%, var(--md-sys-color-outline-variant) 72%);
    }

    md-divider.panel-divider {
      margin: 1rem 0;
    }

    md-divider.tip-divider {
      margin: 0.9rem 0;
      --md-divider-color: color-mix(in srgb, var(--md-sys-color-primary) 42%, var(--md-sys-color-outline-variant) 58%);
    }

    .tip-status-list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.42rem;
    }

    .tip-status-list li {
      margin: 0;
      padding: 0.4rem 0.55rem;
      border-radius: 10px;
      background: color-mix(in srgb, var(--md-sys-color-surface-container-high) 88%, var(--md-sys-color-primary-container) 12%);
      box-shadow: inset 0 0 0 1px var(--app-tile-edge-rest);
      color: var(--md-sys-color-on-secondary-container);
    }

    .tip-card code {
      padding: 0.12rem 0.38rem;
      border-radius: 6px;
      background: color-mix(in srgb, var(--md-sys-color-surface-container-highest) 70%, transparent);
      color: var(--md-sys-color-primary-fixed);
      font: 600 0.84rem/1.45 var(--font-mono);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 28%, transparent);
      word-break: break-word;
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
      box-shadow: inset 0 0 0 1px var(--app-tile-edge-rest);
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
      box-shadow: inset 0 0 0 1px var(--app-tile-edge-rest);
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
      box-shadow: inset 0 0 0 1px var(--app-tile-edge-rest);
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

    .copy-snackbar {
      position: fixed;
      left: 50%;
      bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: min(30rem, calc(100vw - 1.5rem));
      padding: 0.8rem 0.95rem;
      border-radius: 1.15rem;
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--md-sys-color-primary-container) 36%, var(--md-sys-color-secondary-container) 64%),
        color-mix(in srgb, var(--md-sys-color-secondary-container) 88%, var(--md-sys-color-surface-container-high) 12%)
      );
      color: var(--md-sys-color-on-secondary-container);
      box-shadow:
        0 18px 38px rgb(0 0 0 / 32%),
        inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 26%, var(--md-sys-color-outline-variant) 74%);
      pointer-events: none;
      z-index: 1100;
      animation: copy-snackbar-enter 180ms cubic-bezier(0.2, 0, 0, 1);
    }

    .copy-snackbar.error {
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--md-sys-color-error-container) 92%, var(--md-sys-color-surface-container-high) 8%),
        color-mix(in srgb, var(--md-sys-color-error-container) 82%, var(--md-sys-color-surface-container) 18%)
      );
      color: var(--md-sys-color-on-error-container);
      box-shadow:
        0 18px 38px rgb(0 0 0 / 32%),
        inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-error) 28%, transparent);
    }

    .copy-snackbar-icon {
      flex: 0 0 auto;
      display: inline-grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--md-sys-color-primary) 18%, transparent);
    }

    .copy-snackbar.error .copy-snackbar-icon {
      background: color-mix(in srgb, var(--md-sys-color-error) 16%, transparent);
    }

    .copy-snackbar-icon md-icon {
      font-size: 1.15rem;
    }

    .copy-snackbar-label {
      min-width: 0;
      font-family: var(--md-sys-typescale-body-medium-font);
      font-size: var(--md-sys-typescale-body-medium-size);
      line-height: var(--md-sys-typescale-body-medium-line-height);
      letter-spacing: var(--md-sys-typescale-body-medium-tracking);
      font-weight: var(--md-sys-typescale-body-medium-weight);
    }

    md-dialog {
      --md-dialog-container-color: var(--md-sys-color-surface-container-high);
      --md-dialog-headline-color: var(--md-sys-color-on-surface);
      --md-dialog-supporting-text-color: var(--md-sys-color-on-surface-variant);
      --md-dialog-container-shape: var(--md-sys-shape-corner-extra-large);
    }

    .app-fab {
      position: fixed;
      right: clamp(1rem, 4vw, 2.5rem);
      bottom: clamp(1rem, 4vw, 2.5rem);
      z-index: 100;
      animation: fab-reveal var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-emphasized-decelerate) both;
    }

    @keyframes fab-reveal {
      from {
        opacity: 0;
        transform: scale(0.5) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
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

      .feature-tile {
        grid-template-columns: 42px minmax(0, 1fr);
        padding: 0.9rem;
        gap: 0.75rem;
      }

      .feature-tile-icon {
        width: 42px;
        height: 42px;
      }

      .feature-tile-trailing {
        display: none;
      }

      .downloads-filter-set {
        flex-wrap: nowrap;
        padding-bottom: 0.2rem;
      }

      .copy-snackbar {
        width: min(100vw - 1rem, 24rem);
        bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px));
        padding: 0.75rem 0.85rem;
      }
    }

    @keyframes copy-snackbar-enter {
      from {
        opacity: 0;
        transform: translate(-50%, 10px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0) scale(1);
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

      .screenshots-strip {
        mask-image: none;
        -webkit-mask-image: none;
      }
    }

    @media (max-width: 940px) {
      .screenshot-item {
        flex-basis: clamp(144px, 34vw, 184px);
      }

    }

    @media (max-width: 1320px) {
      .side-gallery {
        display: none;
      }
    }

    .app-navigation-bar {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      --md-navigation-bar-container-color: var(--md-sys-color-surface-container);
      --md-navigation-bar-container-elevation: 2;
    }

    md-navigation-tab {
      --md-navigation-tab-hover-state-layer-color: transparent;
      --md-navigation-tab-pressed-state-layer-color: transparent;
      --md-navigation-tab-focus-state-layer-color: transparent;
      --md-navigation-tab-active-hover-state-layer-color: transparent;
      --md-navigation-tab-active-pressed-state-layer-color: transparent;
      --md-navigation-tab-active-focus-state-layer-color: transparent;
      --md-focus-ring-color: transparent;
    }

    @media (max-width: 760px) {
      .top-bar md-tabs {
        display: none;
      }

      .app-navigation-bar {
        display: flex;
      }

      .shell {
        padding-bottom: 100px; /* Space for nav bar */
      }

      .app-fab {
        bottom: 96px; /* Avoid nav bar overlap */
      }
    }

    @media (max-width: 600px) {
      .screenshot-item {
        flex-basis: min(50vw, 172px);
      }

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

      .fun-toggle {
        display: none;
      }

      md-tabs {
        width: 100%;
        max-width: calc(100vw - 3.6rem);
        overflow-x: auto;
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

      .tip-entry {
        padding-left: 0.85rem;
      }

      md-divider.tip-divider {
        margin: 0.75rem 0;
      }

      .tip-status-list li {
        padding: 0.46rem 0.5rem;
      }

      .download-grid {
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
      }

      .download-link {
        padding: 0.9rem;
        gap: 0.8rem;
      }

      .download-link-main {
        grid-template-columns: 42px minmax(0, 1fr) 26px;
        gap: 0.7rem;
      }

      .download-link-icon {
        width: 42px;
        height: 42px;
      }

      .download-link-copy strong {
        font-size: 0.95rem;
      }

      .changelog-toolbar {
        grid-template-columns: 1fr;
        align-items: stretch;
      }

      .changelog-toolbar-controls {
        padding: 0.9rem;
      }

      .changelog-order-toggle {
        border-radius: 16px;
        padding: 0.8rem 0.85rem;
      }

      .changelog-order-copy {
        flex-wrap: wrap;
        align-items: baseline;
      }

      .changelog-order-copy span {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
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

  `;

  constructor() {
    super();
    this.route = 'home';
    this.motionKey = 0;
    this.copiedCommand = '';
    this.copyMessage = '';
    this.copyMessageTone = 'success';
    this.downloadsFilter = 'all';
    this.pendingScreenshots = HOME_SCREENSHOT_COUNT;
    this.activeScreenshot = null;
    this.changelogsLatestFirst = true;
    this.selectedChangelogDate = '';
    this.pendingInstructionsTarget = '';
    this.scrollRaf = 0;
    this.copyMessageTimeout = 0;
    this.lastParallaxOffset = -1;
    this.hasScrolledPastTop = false;
    this.routeView = null;
    this.routeViewLoading = true;
    this.routeViewError = '';
    this.routeViewCache = new Map();
    this.routeViewPromises = new Map();
    this.routeLoadToken = 0;
    this.funMode = localStorage.getItem('pixelos-fun-mode') === 'true';
    this.reduceMotionQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    this.prefersReducedMotion = this.reduceMotionQuery?.matches ?? false;
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleHashChange = this.handleHashChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleGlobalKeydown = this.handleGlobalKeydown.bind(this);
    this.openScreenshotViewer = this.openScreenshotViewer.bind(this);
    this.closeScreenshotViewer = this.closeScreenshotViewer.bind(this);
    this.handleMotionPreferenceChange = this.handleMotionPreferenceChange.bind(this);
    this.changelogs = CHANGELOGS;
    this.pendingChangelogDate = getChangelogDateFromHash(window.location.hash);
    this.selectedChangelogDate = this.pendingChangelogDate || this.changelogs[0]?.date || '';
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', this.handleLocationChange);
    window.addEventListener('hashchange', this.handleHashChange);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('keydown', this.handleGlobalKeydown);
    this.reduceMotionQuery?.addEventListener('change', this.handleMotionPreferenceChange);
    this.handleLocationChange();
    this.handleScroll();
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.handleLocationChange);
    window.removeEventListener('hashchange', this.handleHashChange);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('keydown', this.handleGlobalKeydown);
    this.reduceMotionQuery?.removeEventListener('change', this.handleMotionPreferenceChange);
    if (this.scrollRaf) {
      cancelAnimationFrame(this.scrollRaf);
      this.scrollRaf = 0;
    }
    if (this.copyMessageTimeout) {
      clearTimeout(this.copyMessageTimeout);
      this.copyMessageTimeout = 0;
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

  handleHashChange() {
    this.handleLocationChange();
  }

  handleLocationChange() {
    let nextRoute = getRouteFromPathname(window.location.pathname);
    const legacyHashRoute = nextRoute === 'home' ? getLegacyHashRoute(window.location.hash) : '';

    if (legacyHashRoute) {
      nextRoute = legacyHashRoute;
      const legacyPath = getRoutePath(legacyHashRoute);
      if (window.location.pathname !== legacyPath) {
        window.history.replaceState({}, '', legacyPath);
      }
    }

    const hashDate = getChangelogDateFromHash(window.location.hash);
    if (nextRoute === 'changelogs' && hashDate) {
      this.pendingChangelogDate = hashDate;
      this.selectedChangelogDate = hashDate;
    } else if (!hashDate) {
      this.pendingChangelogDate = '';
      if (nextRoute === 'changelogs' && !this.selectedChangelogDate) {
        this.selectedChangelogDate = this.changelogs[0]?.date || '';
      }
    }

    if (this.route !== nextRoute) {
      window.scrollTo(0, 0);
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

  handleGlobalKeydown(event) {
    if (event.key === 'Escape' && this.activeScreenshot) {
      this.closeScreenshotViewer();
    }
  }

  openScreenshotViewer(screenshot) {
    if (!screenshot?.src) {
      return;
    }

    this.activeScreenshot = screenshot;
    document.body.style.overflow = 'hidden';
  }

  closeScreenshotViewer() {
    this.activeScreenshot = null;
    document.body.style.overflow = '';
  }

  navigate(route) {
    window.scrollTo(0, 0);
    const path = getRoutePath(route);
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
    this.selectedChangelogDate = normalizedDate;
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

  showCopyMessage(message, tone = 'success') {
    this.copyMessage = message;
    this.copyMessageTone = tone;
    if (this.copyMessageTimeout) {
      clearTimeout(this.copyMessageTimeout);
    }
    this.copyMessageTimeout = setTimeout(() => {
      this.copyMessage = '';
      this.copyMessageTone = 'success';
      this.copyMessageTimeout = 0;
    }, tone === 'error' ? 2800 : 2200);
  }

  async copyTextToClipboard(value, successMessage) {
    try {
      await navigator.clipboard.writeText(value);
      this.showCopyMessage(successMessage);
      return true;
    } catch {
      this.showCopyMessage('Copy failed', 'error');
      return false;
    }
  }

  async copyCommand(command) {
    const copied = await this.copyTextToClipboard(command, 'Command copied to clipboard');
    if (copied) {
      this.copiedCommand = command;
      setTimeout(() => {
        if (this.copiedCommand === command) {
          this.copiedCommand = '';
        }
      }, 1200);
    }
  }

  async copyChecksum(checksum) {
    const copied = await this.copyTextToClipboard(checksum, 'Checksum copied to clipboard');
    if (copied) {
      this.copiedCommand = checksum;
      setTimeout(() => {
        if (this.copiedCommand === checksum) {
          this.copiedCommand = '';
        }
      }, 1200);
    }
  }

  handleScreenshotSettled() {
    if (this.pendingScreenshots > 0) {
      this.pendingScreenshots -= 1;
    }
  }

  async ensureRouteView(route) {
    if (this.routeViewCache.has(route)) {
      return this.routeViewCache.get(route);
    }

    let pending = this.routeViewPromises.get(route);
    if (!pending) {
      pending = (ROUTE_VIEW_LOADERS[route] || ROUTE_VIEW_LOADERS.home)()
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
          <div class="route-loader" role="status" aria-live="polite">
            <strong>Loading section...</strong>
            <md-linear-progress indeterminate></md-linear-progress>
            <span>Fetching the current page content.</span>
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
    if (!this.funMode) {
      return '';
    }

    const sideTileCount = 24;
    const SIDE_IMAGES = [
      '/side/side-1.png',
      '/side/side-2.png',
      '/side/side-3.png',
      '/side/side-4.jpg',
      '/side/side-5.png',
      '/side/side-6.png',
      '/side/side-7.png',
      '/side/side-8.png'
    ];

    return html`
      <aside class="side-gallery ${side}" aria-hidden="true">
        <div class="side-track">
          ${Array.from({ length: sideTileCount }).map((_, index) => {
            const offset = side === 'right' ? 4 : 0;
            const shapeStyle = MATERIAL_SIDE_SHAPES[(index + offset) % MATERIAL_SIDE_SHAPES.length];
            const imageSrc = SIDE_IMAGES[(index + offset) % SIDE_IMAGES.length];
            return html`
            <md-outlined-card
              class="side-art ${shapeStyle.shape}"
              style=${`--tile-tilt: ${shapeStyle.tilt};`}>
              <img src=${imageSrc} alt="" loading="lazy" decoding="async" width="320" height="320" />
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
          ${NAV_ROUTES.map((route) => html`
            <md-primary-tab
              ?active=${this.route === route.id}
              @click=${() => this.navigate(route.id)}>
              <md-icon slot="icon">${route.icon}</md-icon>
              ${route.label}
            </md-primary-tab>
          `)}
        </md-tabs>

        <div class="fun-toggle" title="Toggle Fun Mode">
          <strong>Fun</strong>
          <md-switch
            ?selected=${this.funMode}
            @change=${(e) => {
              this.funMode = e.target.selected;
              localStorage.setItem('pixelos-fun-mode', this.funMode);
            }}>
          </md-switch>
        </div>
      </md-elevated-card>
    `;
  }

  render() {
    return html`
      ${this.renderSideGallery('left')}
      ${this.renderSideGallery('right')}
      ${this.activeScreenshot ? html`
        <div class="screenshot-overlay" @click=${() => this.closeScreenshotViewer()}>
          <div class="screenshot-overlay-panel" @click=${(event) => event.stopPropagation()}>
            <button
              class="screenshot-overlay-close"
              type="button"
              aria-label="Close image"
              @click=${() => this.closeScreenshotViewer()}>
              <md-icon>close</md-icon>
            </button>
            <img
              class="screenshot-overlay-image"
              src=${this.activeScreenshot.src}
              alt=${this.activeScreenshot.alt}
              loading="eager"
              decoding="async"
              width=${this.activeScreenshot.width}
              height=${this.activeScreenshot.height} />
          </div>
        </div>
      ` : ''}
      <div class="shell">
        ${this.renderTopBar()}
        ${keyed(this.motionKey, this.renderActiveRoute())}

        <md-navigation-bar class="app-navigation-bar">
          ${NAV_ROUTES.map((route) => html`
            <md-navigation-tab
              label=${route.label}
              ?active=${this.route === route.id}
              @click=${() => this.navigate(route.id)}>
              <md-icon slot="active-icon">${route.icon}</md-icon>
              <md-icon slot="inactive-icon">${route.icon}</md-icon>
            </md-navigation-tab>
          `)}
        </md-navigation-bar>

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

        ${this.copyMessage ? html`
          <div
            class="copy-snackbar ${this.copyMessageTone === 'error' ? 'error' : ''}"
            aria-hidden="true">
            <span class="copy-snackbar-icon">
              <md-icon>${this.copyMessageTone === 'error' ? 'error' : 'check_circle'}</md-icon>
            </span>
            <span class="copy-snackbar-label">${this.copyMessage}</span>
          </div>
        ` : ''}
        <div class="sr-only" aria-live="polite">${this.copyMessage}</div>

        ${this.route === 'downloads' ? html`
          <md-fab
            class="app-fab"
            variant="primary"
            label="Direct Download"
            @click=${() => window.open('https://pixelos-xaga-worker.angxddeep.workers.dev/PixelOS_xaga-16.2-20260322-0652.zip', '_blank')}>
            <md-icon slot="icon">download</md-icon>
          </md-fab>
        ` : ''}

        ${this.route === 'changelogs' ? html`
          <md-fab
            class="app-fab"
            variant="secondary"
            label="Top"
            @click=${() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <md-icon slot="icon">arrow_upward</md-icon>
          </md-fab>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('pixelos-app', PixelosApp);
