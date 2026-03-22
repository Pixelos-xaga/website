const SCREENSHOT_FILE_NAMES = [
  '1.png',
  '2.png',
  '3.png',
  '4.png',
  '5.png',
  '6.png',
  '7.png',
  '8.png',
  '9.png',
  '10.png',
  '12.png'
];

export const HOME_SCREENSHOTS = SCREENSHOT_FILE_NAMES.map((fileName, index) => ({
  src: `/screenshots/${fileName}`,
  alt: `PixelOS screenshot ${index + 1}`,
  width: 720,
  height: 1640
}));

export const HOME_SCREENSHOT_COUNT = HOME_SCREENSHOTS.length;
