export const DOWNLOADS = {
  rom: {
    name: "PixelOS ROM",
    version: "16.2 (Android 16)",
    date: "2026-04-12",
    filename: "PixelOS_xaga-16.2-20260412-0521.zip",
    link: "https://pixelos-xaga-worker.angxddeep.workers.dev/PixelOS_xaga-16.2-20260412-0521.zip",
    sha256: "C20E0BEC442686B12DE3373906E275EF221366B17498B922EBA7C23C808115EE"
  },
  recovery_images: [
    {
      name: "boot.img",
      link: "https://pixelos-xaga-worker.angxddeep.workers.dev/boot.img",
      sha256: "476114e2d41b57d32e90d9181b42c1772f2b1344b8b485eb61b171a22893e16d"
    },
    {
      name: "vendor_boot.img",
      link: "https://pixelos-xaga-worker.angxddeep.workers.dev/vendor_boot.img",
      sha256: "47a4105408691e84d214e44431658fda5d4261e586c9fcee7d7f7d6191105454"
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
