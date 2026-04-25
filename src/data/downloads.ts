export const DOWNLOADS = {
  rom: {
    name: "PixelOS ROM",
    version: "16.2 (Android 16)",
    date: "2026-04-25",
    filename: "PixelOS_xaga-16.2-20260425-2055.zip",
    link: "https://pixelos-xaga-worker.angxddeep.workers.dev/PixelOS_xaga-16.2-20260425-2055.zip",
    sha512: "A157FC0ACEB8CB38215E18D946C47ABC4C7D4003C52B7E460F436B35453F76A2F167E84113932E868A697D6697EE509AE067A6EEAF3A31E64A77E70F32940807"
  },
  recovery_images: [
    {
      name: "boot.img",
      link: "https://pixelos-xaga-worker.angxddeep.workers.dev/boot.img",
      sha512: "4a7e478c900c04c1fa66a4047ebab26e3aa1955be2339897c53a86176739dfb1129aa8f4b22284d6d2cb6e20c7fcff78f896a1028b4e0acefaa651f371d45002"
    },
    {
      name: "vendor_boot.img",
      link: "https://pixelos-xaga-worker.angxddeep.workers.dev/vendor_boot.img",
      sha512: "8c68adc83fcbb2c042a79c899fcb7598fcec170f220658e2c157a8adec9462d088459f8c3c469a6dc2cfe5f0f199e497591d1a3d81354757a34868397eb55d83"
    }
  ],
  preloader: [
    {
      name: "preloader_xaga.bin",
      link: "https://pixelos-xaga-worker.angxddeep.workers.dev/preloader_xaga.bin",
      sha512: "8a61d8039de656893119f01e71f97ca26994dc7ba55861837c85af84680d3d96ab8e75957fb91df761ba5e93411d49129e2ab28417fcf3483e5e694670b7190e"
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
  fastboot_package: {
    name: "Fastboot Package",
    version: "2026-04-25",
    date: "2026-04-25",
    filename: "PixelOS_20260425-2055_FASTBOOT.zip",
    link: "https://pixelos-xaga-worker.angxddeep.workers.dev/PixelOS_20260425-2055_FASTBOOT.zip",
    sha512: "476C99B9EA71B228FB64C71A9287B430D75DC8425E9FC5FEA94FFD9BFFBC25029D10C95C45B2762B7F9DEBFF1603BFC88F51951D7B31DF214873EDDC310C84ED"
  },
  drivers: {
    filename: "android-bootloader-interface-304243.zip",
    link: "https://pixelos-xaga-worker.angxddeep.workers.dev/android-bootloader-interface-304243.zip",
    sha512: "F5404D9259F72AE428A5E451698201722378E526D58BA097A6B2592EE9CB47673941E20EEBBDA08C2AA684D191D59802EE1D52C61C06F1678BE645BDA17BDCED",
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
