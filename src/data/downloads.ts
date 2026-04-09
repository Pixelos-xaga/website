export const DOWNLOADS = {
  rom: {
    name: "PixelOS ROM",
    version: "16.2 (Android 16)",
    date: "2026-04-09",
    filename: "PixelOS_xaga-16.2-20260409-0304.zip",
    link: "https://pixelos-xaga-worker.angxddeep.workers.dev/PixelOS_xaga-16.2-20260409-0304.zip",
    sha256: "F0F6A4EFED8B65360BA4D0DA94765C85A1DF5FB9BFBDD1FDF544EB6FCD2CF1C7"
  },
  recovery_images: [
    {
      name: "boot.img",
      link: "https://pixelos-xaga-worker.angxddeep.workers.dev/boot.img",
      sha256: "118191763f0a9d4da8bb6d6bcc7a25efa30e07f3e4557b07850bda86264b8734"
    },
    {
      name: "vendor_boot.img",
      link: "https://pixelos-xaga-worker.angxddeep.workers.dev/vendor_boot.img",
      sha256: "90f12dd6cf6493bd7f2d10517b7f079a37b00f7b938e58efaec69c6aa0339e42"
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
