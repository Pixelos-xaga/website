import { LitElement, css, html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';

const DOWNLOADS = [
  {
    name: 'Download PixelOS Xaga ROM',
    note: 'SourceForge project files',
    href: 'https://sourceforge.net/projects/xagaproject/files/Pixelos-xaga/'
  }
];

const HOME_SCREENSHOTS = [
  {
    src: '/screenshots/screenshot-1.png',
    alt: 'PixelOS home screen screenshot 1'
  },
  {
    src: '/screenshots/screenshot-2.png',
    alt: 'PixelOS home screen screenshot 2'
  },
  {
    src: '/screenshots/screenshot-3.png',
    alt: 'PixelOS system UI screenshot 1'
  },
  {
    src: '/screenshots/screenshot-4.png',
    alt: 'PixelOS system UI screenshot 2'
  }
];

const SIDE_SHAPES = [
  { shape: 'shape-none', tilt: '-4deg' },
  { shape: 'shape-small', tilt: '3deg' },
  { shape: 'shape-medium', tilt: '-2deg' },
  { shape: 'shape-large', tilt: '4deg' },
  { shape: 'shape-xlarge', tilt: '-4deg' },
  { shape: 'shape-full', tilt: '2deg' }
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
    title: 'Reboot device',
    command: 'fastboot reboot'
  },
  {
    title: 'Boot into recovery manually',
    guidance: {
      avoid: 'adb reboot recovery',
      action: 'While the phone is turning on, keep pressing only the Volume Up button to enter recovery.'
    }
  },
  {
    title: 'Sideload ROM from recovery',
    command: 'adb sideload <rom-filename>.zip',
    copyable: false,
    note: 'In recovery, choose Apply update from ADB, then type this manually with your exact ROM zip filename.'
  }
];

class PixelosApp extends LitElement {
  static properties = {
    route: { state: true },
    motionKey: { state: true },
    copiedCommand: { state: true },
    copyMessage: { state: true },
    routeLoading: { state: true },
    pendingScreenshots: { state: true }
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

      /* Material 3 typography scale */
      --md-sys-typescale-display-large-font: var(--font-brand);
      --md-sys-typescale-display-large-size: 3.5625rem;
      --md-sys-typescale-display-large-line-height: 4rem;
      --md-sys-typescale-display-large-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-display-large-tracking: -0.015625rem;
      --md-sys-typescale-display-medium-font: var(--font-brand);
      --md-sys-typescale-display-medium-size: 2.8125rem;
      --md-sys-typescale-display-medium-line-height: 3.25rem;
      --md-sys-typescale-display-medium-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-display-medium-tracking: 0rem;
      --md-sys-typescale-display-small-font: var(--font-brand);
      --md-sys-typescale-display-small-size: 2.25rem;
      --md-sys-typescale-display-small-line-height: 2.75rem;
      --md-sys-typescale-display-small-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-display-small-tracking: 0rem;

      --md-sys-typescale-headline-large-font: var(--font-brand);
      --md-sys-typescale-headline-large-size: 2rem;
      --md-sys-typescale-headline-large-line-height: 2.5rem;
      --md-sys-typescale-headline-large-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-headline-large-tracking: 0rem;
      --md-sys-typescale-headline-medium-font: var(--font-brand);
      --md-sys-typescale-headline-medium-size: 1.75rem;
      --md-sys-typescale-headline-medium-line-height: 2.25rem;
      --md-sys-typescale-headline-medium-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-headline-medium-tracking: 0rem;
      --md-sys-typescale-headline-small-font: var(--font-brand);
      --md-sys-typescale-headline-small-size: 1.5rem;
      --md-sys-typescale-headline-small-line-height: 2rem;
      --md-sys-typescale-headline-small-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-headline-small-tracking: 0rem;

      --md-sys-typescale-title-large-font: var(--font-brand);
      --md-sys-typescale-title-large-size: 1.375rem;
      --md-sys-typescale-title-large-line-height: 1.75rem;
      --md-sys-typescale-title-large-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-title-large-tracking: 0rem;
      --md-sys-typescale-title-medium-font: var(--font-brand);
      --md-sys-typescale-title-medium-size: 1rem;
      --md-sys-typescale-title-medium-line-height: 1.5rem;
      --md-sys-typescale-title-medium-weight: var(--md-ref-typeface-weight-medium);
      --md-sys-typescale-title-medium-tracking: 0.009375rem;
      --md-sys-typescale-title-small-font: var(--font-brand);
      --md-sys-typescale-title-small-size: 0.875rem;
      --md-sys-typescale-title-small-line-height: 1.25rem;
      --md-sys-typescale-title-small-weight: var(--md-ref-typeface-weight-medium);
      --md-sys-typescale-title-small-tracking: 0.00625rem;

      --md-sys-typescale-body-large-font: var(--font-plain);
      --md-sys-typescale-body-large-size: 1rem;
      --md-sys-typescale-body-large-line-height: 1.5rem;
      --md-sys-typescale-body-large-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-body-large-tracking: 0.03125rem;
      --md-sys-typescale-body-medium-font: var(--font-plain);
      --md-sys-typescale-body-medium-size: 0.875rem;
      --md-sys-typescale-body-medium-line-height: 1.25rem;
      --md-sys-typescale-body-medium-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-body-medium-tracking: 0.015625rem;
      --md-sys-typescale-body-small-font: var(--font-plain);
      --md-sys-typescale-body-small-size: 0.75rem;
      --md-sys-typescale-body-small-line-height: 1rem;
      --md-sys-typescale-body-small-weight: var(--md-ref-typeface-weight-regular);
      --md-sys-typescale-body-small-tracking: 0.025rem;

      --md-sys-typescale-label-large-font: var(--font-plain);
      --md-sys-typescale-label-large-size: 0.875rem;
      --md-sys-typescale-label-large-line-height: 1.25rem;
      --md-sys-typescale-label-large-weight: var(--md-ref-typeface-weight-medium);
      --md-sys-typescale-label-large-tracking: 0.00625rem;
      --md-sys-typescale-label-medium-font: var(--font-plain);
      --md-sys-typescale-label-medium-size: 0.75rem;
      --md-sys-typescale-label-medium-line-height: 1rem;
      --md-sys-typescale-label-medium-weight: var(--md-ref-typeface-weight-medium);
      --md-sys-typescale-label-medium-tracking: 0.03125rem;
      --md-sys-typescale-label-small-font: var(--font-plain);
      --md-sys-typescale-label-small-size: 0.6875rem;
      --md-sys-typescale-label-small-line-height: 1rem;
      --md-sys-typescale-label-small-weight: var(--md-ref-typeface-weight-medium);
      --md-sys-typescale-label-small-tracking: 0.03125rem;

      --md-sys-color-primary: #9bc1ff;
      --md-sys-color-on-primary: #002b61;
      --md-sys-color-primary-container: #1a4a86;
      --md-sys-color-on-primary-container: #d8e6ff;
      --md-sys-color-primary-fixed: #d8e6ff;
      --md-sys-color-primary-fixed-dim: #adc6ff;
      --md-sys-color-on-primary-fixed: #001a41;
      --md-sys-color-on-primary-fixed-variant: #1a4a86;

      --md-sys-color-secondary: #bec9dc;
      --md-sys-color-on-secondary: #283141;
      --md-sys-color-secondary-container: #40495b;
      --md-sys-color-on-secondary-container: #dbe6fa;
      --md-sys-color-secondary-fixed: #dbe6fa;
      --md-sys-color-secondary-fixed-dim: #bec9dc;
      --md-sys-color-on-secondary-fixed: #131c2b;
      --md-sys-color-on-secondary-fixed-variant: #40495b;

      --md-sys-color-tertiary: #e7c469;
      --md-sys-color-on-tertiary: #3c2f00;
      --md-sys-color-tertiary-container: #5a4500;
      --md-sys-color-on-tertiary-container: #ffe8ad;
      --md-sys-color-tertiary-fixed: #ffe8ad;
      --md-sys-color-tertiary-fixed-dim: #e7c469;
      --md-sys-color-on-tertiary-fixed: #231b00;
      --md-sys-color-on-tertiary-fixed-variant: #5a4500;

      --md-sys-color-error: #ffb4ab;
      --md-sys-color-on-error: #690005;
      --md-sys-color-error-container: #93000a;
      --md-sys-color-on-error-container: #ffdad6;

      --md-sys-color-background: #10131b;
      --md-sys-color-on-background: #e3e7f1;
      --md-sys-color-surface: #121722;
      --md-sys-color-on-surface: #e3e7f1;
      --md-sys-color-surface-dim: #0f141f;
      --md-sys-color-surface-bright: #343d50;
      --md-sys-color-surface-container-lowest: #0c111b;
      --md-sys-color-surface-container-low: #191f2c;
      --md-sys-color-surface-container: #1f2634;
      --md-sys-color-surface-container-high: #273042;
      --md-sys-color-surface-container-highest: #323d52;
      --md-sys-color-surface-variant: #3f485b;
      --md-sys-color-on-surface-variant: #c2c9d9;
      --md-sys-color-outline: #8f97aa;
      --md-sys-color-outline-variant: #6e7587;
      --md-sys-color-surface-tint: var(--md-sys-color-primary);
      --md-sys-color-inverse-surface: #e3e7f1;
      --md-sys-color-inverse-on-surface: #2b3140;
      --md-sys-color-inverse-primary: #2f5f9c;
      --md-sys-color-scrim: #000;
      --md-sys-color-shadow: #000;
      --md-sys-shape-corner-extra-large: 28px;
      --md-sys-shape-corner-large: 20px;
      --md-sys-shape-corner-medium: 16px;
      --md-sys-shape-corner-small: 12px;
      --md-sys-shape-corner-extra-small: 8px;

      --md-sys-elevation-level1: 0px 1px 2px 0px rgb(0 0 0 / 30%), 0px 1px 3px 1px rgb(0 0 0 / 15%);

      --motion-standard: cubic-bezier(0.2, 0, 0, 1);
      --motion-emphasized: cubic-bezier(0.2, 0, 0, 1);
      --side-left-shift: -62px;
      --side-right-shift: -26px;

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
      padding: 3px;
      --md-outlined-card-container-color: color-mix(in srgb, var(--md-sys-color-surface-container-high) 74%, transparent);
      --md-outlined-card-outline-color: color-mix(in srgb, var(--md-sys-color-primary) 28%, transparent);
      --md-outlined-card-outline-width: 1px;
      transform: rotate(var(--tile-tilt, 0deg));
      box-shadow: 0 12px 28px rgb(0 0 0 / 24%);
    }

    .side-art img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
      object-position: center;
      background: color-mix(in srgb, var(--md-sys-color-surface-container-low) 90%, transparent);
      opacity: 0.94;
      filter: saturate(1.08) contrast(1.03);
    }

    .side-art.shape-none {
      --md-outlined-card-container-shape: 0px;
    }

    .side-art.shape-small {
      --md-outlined-card-container-shape: var(--md-sys-shape-corner-extra-small);
    }

    .side-art.shape-medium {
      --md-outlined-card-container-shape: var(--md-sys-shape-corner-small);
    }

    .side-art.shape-large {
      --md-outlined-card-container-shape: var(--md-sys-shape-corner-medium);
    }

    .side-art.shape-xlarge {
      --md-outlined-card-container-shape: var(--md-sys-shape-corner-extra-large);
    }

    .side-art.shape-full {
      --md-outlined-card-container-shape: 999px;
    }

    .top-bar {
      --md-elevated-card-container-color: var(--md-sys-color-surface-container-high);
      --md-elevated-card-container-shape: var(--md-sys-shape-corner-extra-large);
      --md-elevated-card-container-elevation: 1;
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 0.9rem;
      padding: 0.72rem 1rem;
      margin-bottom: 1rem;
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
      animation: shared-axis-in 320ms var(--motion-emphasized);
    }

    .home-view {
      display: grid;
      gap: 1.05rem;
    }

    .panel {
      display: block;
      padding: 1.15rem;
    }

    md-filled-card.panel {
      --md-filled-card-container-color: color-mix(in srgb, var(--md-sys-color-primary-container) 40%, var(--md-sys-color-surface-container-high) 60%);
      --md-filled-card-container-shape: var(--md-sys-shape-corner-extra-large);
    }

    md-elevated-card.panel {
      --md-elevated-card-container-color: var(--md-sys-color-surface-container-low);
      --md-elevated-card-container-shape: var(--md-sys-shape-corner-large);
      --md-elevated-card-container-elevation: 1;
    }

    md-outlined-card.panel {
      --md-outlined-card-container-color: var(--md-sys-color-surface-container-low);
      --md-outlined-card-container-shape: var(--md-sys-shape-corner-large);
      --md-outlined-card-outline-color: color-mix(in srgb, var(--md-sys-color-outline) 42%, transparent);
    }

    .hero {
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
      font-family: var(--md-sys-typescale-headline-medium-font);
      color: var(--md-sys-color-on-surface);
    }

    h1 {
      margin-top: 0.85rem;
      font-family: var(--md-sys-typescale-display-small-font);
      font-size: clamp(2.1rem, 4.6vw, var(--md-sys-typescale-display-small-size));
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
      max-width: 70ch;
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
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 22%, transparent);
      aspect-ratio: 9 / 20;
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

    .route-overlay {
      position: fixed;
      inset: 0;
      z-index: 25;
      display: grid;
      place-items: center;
      pointer-events: none;
      opacity: 0;
      background: color-mix(in srgb, var(--md-sys-color-scrim) 24%, transparent);
      transition: opacity 180ms var(--motion-standard);
    }

    .route-overlay.active {
      opacity: 1;
    }

    .route-loader-card {
      width: min(90vw, 280px);
      padding: 0.9rem 1rem;
      display: grid;
      gap: 0.7rem;
      justify-items: center;
      --md-elevated-card-container-color: var(--md-sys-color-surface-container-high);
      --md-elevated-card-container-shape: var(--md-sys-shape-corner-large);
      --md-elevated-card-container-elevation: 2;
    }

    .route-loader-text {
      color: var(--md-sys-color-on-surface-variant);
      font-family: var(--md-sys-typescale-label-large-font);
      font-size: var(--md-sys-typescale-label-large-size);
      line-height: var(--md-sys-typescale-label-large-line-height);
      letter-spacing: var(--md-sys-typescale-label-large-tracking);
      font-weight: var(--md-sys-typescale-label-large-weight);
    }

    .route-loader-track {
      display: inline-flex;
      align-items: center;
      gap: 0.34rem;
      padding: 0.16rem 0.08rem;
    }

    .route-loader-segment {
      width: 18px;
      height: 8px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--md-sys-color-primary) 86%, white 14%);
      opacity: 0.42;
      transform-origin: center;
      animation: expressive-loader 1080ms var(--motion-emphasized) infinite;
      animation-delay: calc(var(--loader-index, 0) * 90ms);
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 22%, transparent);
    }

    .route-loader-segment.dot {
      width: 8px;
      border-radius: 999px;
    }

    @keyframes expressive-loader {
      0%, 100% {
        opacity: 0.35;
        transform: translateY(0) scaleX(0.7);
      }

      35% {
        opacity: 1;
        transform: translateY(-1px) scaleX(1.18);
      }

      70% {
        opacity: 0.55;
        transform: translateY(1px) scaleX(0.82);
      }
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

    .warning-content {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.78rem 0.96rem;
      color: var(--md-sys-color-on-tertiary-container);
    }

    .warning-card {
      --md-filled-card-container-color: color-mix(in srgb, var(--md-sys-color-tertiary-container) 52%, var(--md-sys-color-surface-container-low) 48%);
      --md-filled-card-container-shape: var(--md-sys-shape-corner-large);
    }

    .warning-content p {
      margin: 0;
      color: var(--md-sys-color-on-tertiary-container);
    }

    .warning-content md-icon {
      --m3-icon-fill: 1;
      --m3-icon-weight: 600;
      color: var(--md-sys-color-tertiary);
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
      --md-outlined-card-container-color: var(--md-sys-color-surface-container-high);
      --md-outlined-card-container-shape: var(--md-sys-shape-corner-medium);
      --md-outlined-card-outline-color: color-mix(in srgb, var(--md-sys-color-outline) 30%, transparent);
      --md-outlined-card-outline-width: 1px;
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
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .command-item {
      display: block;
      padding: 0.75rem;
      --md-outlined-card-container-color: var(--md-sys-color-surface-container-high);
      --md-outlined-card-container-shape: var(--md-sys-shape-corner-medium);
      --md-outlined-card-outline-color: color-mix(in srgb, var(--md-sys-color-outline) 28%, transparent);
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
      background: color-mix(in srgb, var(--md-sys-color-surface-container-highest) 86%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 20%, transparent);
    }

    .guidance-row.warning {
      color: var(--md-sys-color-on-tertiary-container);
      background: color-mix(in srgb, var(--md-sys-color-tertiary-container) 52%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-tertiary) 48%, transparent);
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
      color: var(--md-sys-color-on-surface);
      background: color-mix(in srgb, var(--md-sys-color-primary) 20%, transparent);
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
    }

    .command-field {
      flex: 1;
      --md-outlined-text-field-container-shape: 14px;
      --md-outlined-text-field-input-text-font: 500 13px/1.4 var(--font-mono);
      --md-outlined-text-field-input-text-color: var(--md-sys-color-on-surface);
      --md-outlined-text-field-label-text-color: var(--md-sys-color-on-surface-variant);
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
      color: var(--md-sys-color-primary);
      text-decoration: none;
      background: var(--md-sys-color-surface-container-high);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 14%, transparent);
      transition: transform 160ms var(--motion-standard), box-shadow 160ms var(--motion-standard), color 160ms var(--motion-standard);
    }

    .social-link:hover {
      transform: translateY(-1px);
      color: var(--md-sys-color-on-primary-container);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-primary) 35%, transparent);
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
      .screenshots-grid {
        grid-template-columns: 1fr;
      }

      .top-bar {
        grid-template-columns: 1fr;
        --md-elevated-card-container-shape: var(--md-sys-shape-corner-large);
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
    this.routeLoading = true;
    this.pendingScreenshots = HOME_SCREENSHOTS.length;
    this.pendingInstructionsTarget = '';
    this.scrollRaf = 0;
    this.routeLoadingTimer = 0;
    this.routeLoadingHardStopTimer = 0;
    this.routeLoadingStart = 0;
    this.handleHashChange = this.handleHashChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.startRouteLoading();
    window.addEventListener('hashchange', this.handleHashChange);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    this.handleHashChange();
    this.handleScroll();
  }

  firstUpdated() {
    this.scheduleRouteLoadingEnd();
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this.handleHashChange);
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    if (this.scrollRaf) {
      cancelAnimationFrame(this.scrollRaf);
      this.scrollRaf = 0;
    }
    this.clearRouteLoadingTimers();
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (
      this.route === 'instructions'
      && this.pendingInstructionsTarget
      && (changedProperties.has('route') || changedProperties.has('motionKey'))
    ) {
      const target = this.pendingInstructionsTarget;
      this.pendingInstructionsTarget = '';
      this.scheduleInstructionsScroll(target);
    }

    if (
      this.routeLoading
      && (changedProperties.has('route') || changedProperties.has('motionKey'))
    ) {
      this.scheduleRouteLoadingEnd();
    }
  }

  handleHashChange() {
    const raw = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const nextRoute = raw.startsWith('instructions') ? 'instructions' : 'home';

    if (this.route !== nextRoute) {
      this.startRouteLoading();
      this.route = nextRoute;
      this.motionKey += 1;
    }
  }

  handleScroll() {
    if (this.scrollRaf) {
      return;
    }

    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = 0;
      const offset = window.scrollY || 0;
      const leftShift = ((offset * 0.14) % 190) - 72;
      const rightShift = -(((offset * 0.12) % 190) - 48);
      this.style.setProperty('--side-left-shift', `${leftShift}px`);
      this.style.setProperty('--side-right-shift', `${rightShift}px`);
    });
  }

  handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      this.finishRouteLoading();
      return;
    }

    if (this.routeLoading) {
      this.scheduleRouteLoadingEnd();
    }
  }

  clearRouteLoadingTimers() {
    if (this.routeLoadingTimer) {
      clearTimeout(this.routeLoadingTimer);
      this.routeLoadingTimer = 0;
    }

    if (this.routeLoadingHardStopTimer) {
      clearTimeout(this.routeLoadingHardStopTimer);
      this.routeLoadingHardStopTimer = 0;
    }
  }

  finishRouteLoading() {
    this.clearRouteLoadingTimers();
    this.routeLoading = false;
  }

  startRouteLoading() {
    this.routeLoadingStart = performance.now();
    this.routeLoading = true;
    this.clearRouteLoadingTimers();

    if (document.visibilityState !== 'visible') {
      this.finishRouteLoading();
      return;
    }

    this.routeLoadingHardStopTimer = setTimeout(() => {
      this.finishRouteLoading();
    }, 2000);
  }

  scheduleRouteLoadingEnd() {
    if (!this.routeLoading) {
      this.clearRouteLoadingTimers();
      return;
    }

    if (document.visibilityState !== 'visible') {
      this.finishRouteLoading();
      return;
    }

    if (this.routeLoadingTimer) {
      clearTimeout(this.routeLoadingTimer);
      this.routeLoadingTimer = 0;
    }

    const elapsed = this.routeLoadingStart ? performance.now() - this.routeLoadingStart : 0;
    const delay = Math.max(180, 520 - elapsed);

    this.routeLoadingTimer = setTimeout(() => {
      this.finishRouteLoading();
    }, delay);
  }

  navigate(route) {
    this.startRouteLoading();
    const hash = route === 'instructions' ? '#/instructions' : '#/';
    if (window.location.hash !== hash) {
      window.location.hash = hash;
      return;
    }

    this.route = route;
    this.motionKey += 1;
  }

  navigateToInstructions(target = 'downloads') {
    this.pendingInstructionsTarget = target;
    this.navigate('instructions');
  }

  scheduleInstructionsScroll(target) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.scrollInstructionsTarget(target));
    });
  }

  scrollInstructionsTarget(target) {
    const targetSelector = target === 'steps' ? '#flash-steps-card' : '#downloads-card';
    const targetElement = this.renderRoot?.querySelector(targetSelector);
    if (!targetElement) {
      return;
    }

    const targetRect = targetElement.getBoundingClientRect();
    const targetTop = window.scrollY + targetRect.top;
    let scrollTop = targetTop - 88;

    if (target === 'steps') {
      scrollTop = targetTop - (window.innerHeight * 0.42);
      const downloadsElement = this.renderRoot?.querySelector('#downloads-card');
      if (downloadsElement) {
        const downloadsRect = downloadsElement.getBoundingClientRect();
        const downloadsTop = window.scrollY + downloadsRect.top;
        const maxScrollWithDownloadsVisible = downloadsTop + downloadsRect.height - 84;
        scrollTop = Math.min(scrollTop, maxScrollWithDownloadsVisible);
      }
    }

    window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
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

  renderSideGallery(side = 'left') {
    const sideTileCount = 8;
    return html`
      <aside class="side-gallery ${side}" aria-hidden="true">
        <div class="side-track">
          ${Array.from({ length: sideTileCount }).map((_, index) => {
            const shapeStyle = SIDE_SHAPES[index % SIDE_SHAPES.length];
            return html`
            <md-outlined-card
              class="side-art ${shapeStyle.shape}"
              style=${`--tile-tilt: ${shapeStyle.tilt};`}>
              <img src="/side-photo.png" alt="" loading="lazy" decoding="async" />
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
        </md-tabs>
      </md-elevated-card>
    `;
  }

  renderHomeView() {
    return html`
      <section class="view home-view" aria-label="Home view">
        <md-filled-card class="panel hero motion-item" style="--delay: 10ms">
          <md-assist-chip label="Official Device Hub"></md-assist-chip>
          <h1>PixelOS for Xaga</h1>
          <p class="lead">Material Web powered install portal with ROM downloads, flash commands, and spoofing notes.</p>
          <div class="hero-actions">
            <md-filled-button @click=${() => this.navigateToInstructions('steps')}>
              <md-icon slot="icon">rocket_launch</md-icon>
              Open Instructions
            </md-filled-button>
            <md-filled-tonal-button @click=${() => this.navigateToInstructions('downloads')}>
              <md-icon slot="icon">download</md-icon>
              Go to Downloads
            </md-filled-tonal-button>
          </div>
        </md-filled-card>

        <md-elevated-card class="panel screenshots-panel motion-item" style="--delay: 45ms">
          <h2>Screenshots</h2>
          <div class="screenshots-grid">
            ${HOME_SCREENSHOTS.map((shot) => html`
              <figure class="screenshot-item">
                <img
                  src=${shot.src}
                  alt=${shot.alt}
                  loading="lazy"
                  decoding="async"
                  @load=${() => this.handleScreenshotSettled()}
                  @error=${() => this.handleScreenshotSettled()} />
              </figure>
            `)}
          </div>
          ${this.pendingScreenshots > 0 ? html`
            <div class="screenshots-loader" role="status" aria-live="polite">
              <md-circular-progress indeterminate></md-circular-progress>
              <span>Loading screenshots...</span>
            </div>
          ` : ''}
        </md-elevated-card>

        <md-elevated-card class="panel motion-item" style="--delay: 80ms">
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
        </md-elevated-card>
      </section>
    `;
  }

  renderInstructionsView() {
    return html`
      <section class="view" aria-label="Instructions view">
        <md-filled-card class="warning-card motion-item" style="--delay: 10ms">
          <div class="warning-content">
            <md-icon>warning</md-icon>
            <p><strong>Never run</strong> <code>fastboot reboot recovery</code> on xaga.</p>
          </div>
        </md-filled-card>

        <div class="tools motion-item" style="--delay: 30ms">
          <md-outlined-button @click=${() => this.openDialog('safetyDialog')}>
            <md-icon slot="icon">gpp_bad</md-icon>
            Open Safety Dialog
          </md-outlined-button>
        </div>

        <div class="content-grid">
          <section class="view-grid">
            <md-outlined-card id="downloads-card" class="panel motion-item" style="--delay: 50ms">
              <h2 id="downloads">Downloads</h2>
              <div class="download-grid">
                ${DOWNLOADS.map((item) => html`
                  <md-outlined-card class="download-item">
                    <md-elevated-button href=${item.href} target="_blank" rel="noopener noreferrer">
                      <md-icon slot="icon">download</md-icon>
                      ${item.name}
                    </md-elevated-button>
                    <small>${item.note}</small>
                  </md-outlined-card>
                `)}
              </div>
            </md-outlined-card>

            <md-outlined-card id="flash-steps-card" class="panel motion-item" style="--delay: 90ms">
              <h2>Flash Steps</h2>
              <ol class="commands">
                ${FLASH_STEPS.map((step) => html`
                  <li>
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
                      ${step.note ? html`<p>${step.note}</p>` : ''}
                      ${step.command ? html`
                        <div class="command-row">
                          <md-outlined-text-field
                            class="command-field"
                            label=${step.copyable === false ? 'Type manually' : 'Command'}
                            readonly
                            .value=${step.command}></md-outlined-text-field>
                          ${step.copyable === false ? '' : html`
                            <md-icon-button
                              aria-label="Copy command"
                              @click=${() => this.copyCommand(step.command)}>
                              <md-icon>${this.copiedCommand === step.command ? 'check' : 'content_copy'}</md-icon>
                            </md-icon-button>
                          `}
                        </div>
                      ` : ''}
                    </md-outlined-card>
                  </li>
                `)}
              </ol>
            </md-outlined-card>
          </section>

          <aside>
            <md-outlined-card class="panel motion-item" style="--delay: 120ms">
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

  render() {
    return html`
      ${this.renderSideGallery('left')}
      <div class="route-overlay ${this.routeLoading ? 'active' : ''}" role="status" aria-live="polite" aria-label="Loading">
        <md-elevated-card class="route-loader-card">
          <div class="route-loader-track" aria-hidden="true">
            <span class="route-loader-segment dot" style="--loader-index: 0"></span>
            <span class="route-loader-segment" style="--loader-index: 1"></span>
            <span class="route-loader-segment" style="--loader-index: 2"></span>
            <span class="route-loader-segment" style="--loader-index: 3"></span>
            <span class="route-loader-segment dot" style="--loader-index: 4"></span>
          </div>
          <span class="route-loader-text">Loading content...</span>
        </md-elevated-card>
      </div>
        <div class="shell">
        ${this.renderTopBar()}
        ${keyed(this.motionKey, this.route === 'instructions' ? this.renderInstructionsView() : this.renderHomeView())}

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
