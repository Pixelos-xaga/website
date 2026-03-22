const SOURCEFORGE_BASE = 'https://sourceforge.net/projects/xagaproject/files/Pixelos-xaga';
const MARCH_BUILD_BASE = `${SOURCEFORGE_BASE}/Mar-2026-22`;
const GOOGLE_DRIVE_BASE = 'https://drive.google.com/file/d';

const linkItem = (name, note, href, icon = '') => ({ name, note, href, icon });
const sourceForgeDownload = (fileName) => `${MARCH_BUILD_BASE}/${fileName}/download`;
const googleDriveFile = (id, access = 'drive_link') => `${GOOGLE_DRIVE_BASE}/${id}/view?usp=${access}`;

export const DOWNLOADS = [
  linkItem('Rom zip', 'Main PixelOS ROM zip file', sourceForgeDownload('PixelOS_xaga-16.2-20260322-0652.zip')),
  linkItem('boot.img', 'Boot image', sourceForgeDownload('boot.img')),
  linkItem('vendor_boot.img', 'Vendor boot image', sourceForgeDownload('vendor_boot.img')),
  linkItem('vbmeta.img', 'Verified boot metadata', sourceForgeDownload('vbmeta.img')),
  linkItem('dtbo.img', 'Device tree blob overlay', sourceForgeDownload('dtbo.img'))
];

export const RESOURCE_LINKS = [
  linkItem('Android Bootloader Interface Driver (Windows)', 'Bootloader driver', 'https://t.me/XAGASupport/446550'),
  linkItem('Android Platform-Tools (Official)', 'Platform sdk tools', 'https://developer.android.com/tools/releases/platform-tools')
];

export const DOWNLOAD_SECTIONS = [
  { title: 'ROM Downloads', delay: 20, items: DOWNLOADS },
  {
    title: 'ROM Build Archive',
    delay: 28,
    items: [linkItem('All PixelOS xaga Builds', 'SourceForge archive for current and older ROM releases', SOURCEFORGE_BASE)]
  },
  {
    title: 'Latest XDA Post',
    delay: 33,
    defaultIcon: 'forum',
    items: [linkItem('Latest PixelOS XDA Thread', '', 'https://xdaforums.com/t/development-rom-android-16-unofficial-pixelos-16-2-recovery-build-xaga-march-build.4781663/')]
  },
  {
    title: 'Preloader Resources',
    delay: 38,
    headingIcon: 'system_update',
    description: 'This section provides the preloader package and its documentation. Always use the preloader package for safety before proceeding.',
    listItems: [
      'Download the preloader package from the link below',
      'Read the wiki before flashing engineering preloader'
    ],
    items: [
      linkItem('Download Preloader Package', 'Preloader package for xaga', `${SOURCEFORGE_BASE}/Preloader_xaga.zip/download`),
      linkItem('Preloader Wiki', 'Documentation for flashing and usage', 'https://wiki.itsvixano.me/device_specific/preloader_xaga/', 'menu_book')
    ]
  },
  { title: 'Downloads & Resources', delay: 55, defaultIcon: 'link', items: RESOURCE_LINKS }
];

export const PLATFORM_TOOLS_CLI_COMMANDS = [
  {
    title: 'Ubuntu',
    command: 'sudo apt update\nsudo apt install android-sdk-platform-tools'
  },
  {
    title: 'Windows',
    command: 'winget install -e --id Google.PlatformTools'
  }
];

export const PLATFORM_TOOLS_ZIP_OPTIONS = [
  linkItem('Windows ZIP', 'Official Google ZIP package', 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip'),
  linkItem('Linux ZIP (Ubuntu)', 'Official Google ZIP package', 'https://dl.google.com/android/repository/platform-tools-latest-linux.zip')
];
