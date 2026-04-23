# 📜 Changelogs

- 🎯 The priority of the ROM is overall stability over peak gaming performance for a smoother daily experience.

## 🗓️ [2026-04-23] - 16.2 Stable

-  Clean flash necessary if coming from last rom
-  Now default thermal mode is performace-normal instead of normal
-  Dropped per app thermals, I didn't like those anyway 👀
-  Restrict mi_thermald from CPU hotplugging
-  Fixed SurfaceFlinger lag while scrolling through App list in Pixel Launcher
-  Added some AI model blobs from Stock ROM
-  Reserved 1GB Storage for zRAM writeback
-  Reduced blur radius for Pixel Launcher
-  Fixed a crash in MIUI Camera when switching from night mode.
-  Removed the earlier EIS patch since EIS only works on 1080p/30 or 720p/30 and the patch had no effect in the HAL layer.
-  Eliminated log spam to improve I/O performance.
-  Removed Dolby Atmos because of underlying reliability issues with AOSP on MediaTek.
-  Reintroduced MTK Engineering Mode.
-  Added CameraX extensions support.
-  Increased 2.4GHz hotspot bandwidth from 20MHz to 40MHz.
-  Updated kernel sources to 5.10.252.

## 🗓️ [2026-04-09] - 16.2 Stable

- 🔦 Added torch brightness control.
- 🎧 Added Dolby Atmos.
- 📳 Improved haptics and enabled them in more places.
- 📷 Added Aperture Camera alongside MIUI Camera.
- 🔗 Upstream PixelOS [Changelog](https://blog.pixelos.net/blog/2026-04-08-April-Update).
- 🎙️ Fixed “Ok Google.”
- 🎥 Fixed Instagram video lag.
- 🪪 Switched devices to a common Global POCO X4 GT fingerprint after the Indian fingerprint caused automatic bloatware installs.

## 🗓️ [2026-03-22] - 16.2 Stable

- 🪪 Assigned each device a regional fingerprint based on GLOBAL / INDIAN / CHINA instead of a single POCO fingerprint.
- 📡 PhonePe is now working.

## 🗓️ [2026-03-18] - 16.2 Stable

- 🛠️ Added MediaTek Engineering Mode for advanced users.
- 📶 Enabled `WIFI_FEATURE_SUPPLICANT_11AX` support.
- 📡 Fixed the 5GHz hotspot issue from the previous build.
- 🎧 Fixed Bluetooth A2DP audio issues from the previous build.
- 🔄 Merged upstream bug fixes from PixelOS source.

## 🗓️ [2026-03-10] - 16.2 Stable

- 🔗 Upstream PixelOS [CHANGELOG](https://blog.pixelos.net/blog/2026-03-09-March-Update).
- 🔒 Updated to the March security patch.
- 🌡️ Improved thermal management with adjusted throttling thresholds.
- 📸 Improved MIUI Camera lighting and photo quality.
- 📞 Added Google Dialer call recording.
- 📍 Improved GPS accuracy and positioning with full LPP support.
- 🎧 Resolved Bluetooth audio configuration issues.
- 📶 Enabled Wi-Fi Calling (VoWiFi) by default.
- 🧠 Optimized memory management for 6GB RAM models.
- 🐞 Miscellaneous bug fixes and improvements.
