export const DOWNLOADS = {
  rom: {
    name: "PixelOS ROM",
    version: "16.2 (Android 16)",
    date: "2026-03-23",
    filename: "PixelOS_xaga-16.2-20260323-0026.zip",
    link: "https://pixelos-xaga-worker.angxddeep.workers.dev/PixelOS_xaga-16.2-20260323-0026.zip",
    sha256: "663F5EA2FB9344F18E07A423EA2370A8C160E2028974B3F088A33ECACAD881DF"
  },
  recovery_images: [
    {
      name: "boot.img",
      link: "https://pixelos-xaga-worker.angxddeep.workers.dev/boot.img",
      sha256: "9eeaca043e57958841f01b9330adba8eb70650404cadc7a66141486d59f843f3"
    },
    {
      name: "vendor_boot.img",
      link: "https://pixelos-xaga-worker.angxddeep.workers.dev/vendor_boot.img",
      sha256: "b733f7054160068faece91e6741e1748c742cb1e5a60770c6e678860ab8a2091"
    },
    {
      name: "dtbo.img",
      link: "https://pixelos-xaga-worker.angxddeep.workers.dev/dtbo.img",
      sha256: "eaddec1613b9086fb0a5d1326cb51b4a0d98a218df0e2cc1487a2be92c0a777c"
    },
    {
      name: "vbmeta.img",
      link: "https://pixelos-xaga-worker.angxddeep.workers.dev/vbmeta.img",
      sha256: "da82450fe9f55fb2e3a1e8340841c78a5e8d5e4d98533f3ea8009eda6a3f0dfb"
    }
  ],
  essential: [
    {
      name: "preloader_aristotle.bin",
      link: "https://pixelos-xaga-worker.angxddeep.workers.dev/preloader_aristotle.bin",
      description: "Engineering preloader to prevent bricks."
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
  links: {
    xda: "https://xdaforums.com/t/development-rom-android-16-unofficial-pixelos-16.2-recovery-build-xaga-march-build.4781663/",
    telegram_support: "https://t.me/XAGASupport",
    telegram_channel: "https://t.me/PixelOS_xaga",
    sourceforge: "https://sourceforge.net/projects/xagaproject/files/Pixelos-xaga"
  }
};
