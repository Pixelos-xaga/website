export const DOWNLOADS = {
  rom: {
    name: "PixelOS ROM",
    version: "16.2 (Android 16)",
    date: "2026-04-23",
    filename: "PixelOS_xaga-16.2-20260423-1335.zip",
    link: "https://pixelos-xaga-worker.angxddeep.workers.dev/PixelOS_xaga-16.2-20260423-1335.zip",
    sha256: "CD9C53AAC6B6EFED3BAC05E1A7D68574A7AE108D29C7BB236D5592107881B246"
  },
  recovery_images: [
    {
      name: "boot.img",
      link: "https://pixelos-xaga-worker.angxddeep.workers.dev/boot.img",
      sha256: "cf1906d499bee2d0d27f68dd30763db570533aa672fa6b63f6e73e209773fd3c"
    },
    {
      name: "vendor_boot.img",
      link: "https://pixelos-xaga-worker.angxddeep.workers.dev/vendor_boot.img",
      sha256: "9ddf923f8ff89c495b1dfa3d42af301bbde47facadcad2e0a5db98d9c2ebb747"
    }
  ],
  preloader: [
    {
      name: "preloader_aristotle.bin",
      link: "https://pixelos-xaga-worker.angxddeep.workers.dev/preloader_aristotle.bin",
      sha256: "4de6447117f81ba306f8d80ecaed838ab3739a8389e513e4cb9f0e79c18b9745"
    }
  ],
  platform_tools: {
    link: "https://developer.android.com/tools/releases/platform-tools",
    installs: [
      {
        os: "Windows",
        command: "winget install -e --id Google.PlatformTools"
      },
      {
        os: "macOS",
        command: "brew install android-platform-tools"
      },
      {
        os: "Linux",
        command: "sudo apt install android-sdk-platform-tools"
      }
    ]
  },
  drivers: {
    filename: "android-bootloader-interface-304243.zip",
    link: "https://pixelos-xaga-worker.angxddeep.workers.dev/android-bootloader-interface-304243.zip",
    sha256: "6A27295B66979F8B29E727BC806D4FD1C013D05D2D387C0769403AEC4809A308",
    instructions: [
      "Locate the android_winusb.inf file.",
      "Right click on it.",
      "Click on Install."
    ]
  },
  links: {
    xda: "https://xdaforums.com/t/development-rom-android-16-unofficial-pixelos-16.2-recovery-build-xaga-march-build.4781663/",
    telegram_support: "https://t.me/XAGASupport",
    telegram_channel: "https://t.me/PixelOS_xaga",
    sourceforge: "https://sourceforge.net/projects/xagaproject/files/Pixelos-xaga"
  }
};
