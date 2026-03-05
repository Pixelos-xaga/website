export const DOWNLOADS = [
  {
    name: 'Rom zip',
    note: 'Main PixelOS ROM zip file',
    href: 'https://pixelos-xaga-worker.angxddeep.workers.dev/PixelOS_xaga-16.2-20260228-1452.zip'
  },
  {
    name: 'boot.img',
    note: 'Boot image',
    href: 'https://pixelos-xaga-worker.angxddeep.workers.dev/boot.img'
  },
  {
    name: 'vendor_boot.img',
    note: 'Vendor boot image',
    href: 'https://pixelos-xaga-worker.angxddeep.workers.dev/vendor_boot.img'
  },
  {
    name: 'vbmeta.img',
    note: 'Verified boot metadata',
    href: 'https://pixelos-xaga-worker.angxddeep.workers.dev/vbmeta.img'

  },
  {
    name: 'dtbo.img',
    note: 'Device tree blob overlay',
    href: 'https://pixelos-xaga-worker.angxddeep.workers.dev/dtbo.img'
  }
];

// Note: When updating changelogs, please also update CHANGELOGS.md for documentation consistency.
export const CHANGELOGS = [
  {
    version: '16.2 Stable',
    date: '2026-03-05',
    tag: 'Latest',
    entries: [
      {
        type: 'Added',
        items: [
          'Initial build for Xaga.',
          'Updated security patch to March 2026.',
          'Added Material You dynamic color support.',
          'Integrated latest PixelOS features.'
        ]
      },
      {
        type: 'Fixed',
        items: [
          'Fixed random reboots during initial setup.',
          'Resolved camera crash issue.',
          'Improved battery life and thermal management.'
        ]
      },
      {
        type: 'Changed',
        items: [
          'Improved overall system stability.',
          'Updated kernel to version 5.10.x.'
        ]
      }
    ]
  },
  {
    version: '16.1 Beta',
    date: '2026-02-15',
    entries: [
      {
        type: 'Added',
        items: [
          'Preliminary support for Poco X4 GT.',
          'Basic spoofing implementation.'
        ]
      },
      {
        type: 'Fixed',
        items: [
          'Fixed Wi-Fi connectivity issues.',
          'Corrected display refresh rate issues.'
        ]
      }
    ]
  }
];

export const RESOURCE_LINKS = [
  {
    name: 'Android Bootloader Interface Driver (Windows)',
    note: 'Bootloader driver',
    href: 'https://t.me/XAGASupport/446550'
  },
  {
    name: 'Android Platform-Tools (Official)',
    note: 'Platform sdk tools',
    href: 'https://developer.android.com/tools/releases/platform-tools'
  }
];
