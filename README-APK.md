# LUMEN Writing Studio → APK

> ## ⬇️ Download APK
> **https://github.com/SPFT-section/lumen/releases/latest/download/lumen-studio.apk**
>
> Install on Android (allow unknown apps for this sideloaded build).

`lumen.html` is the single-file web app. `android/` is a zero-dependency
native WebView wrapper (`com.lumen.studio`) that loads it from assets.

## Build APK (cloud, recommended)

1. Push to GitHub (`master` or `main`).
2. Actions → **Build APK** → download artifact `lumen-studio-apk` (`lumen-studio.apk`).
3. Install on device (allow unknown apps for this sideloaded build).

The workflow copies `lumen.html` → `android/app/src/main/assets/www/index.html`
on every run, so just edit `lumen.html` and push.

## Build locally (x86_64 Linux / macOS / Windows)

Needs JDK 17 + Android SDK (API 34, build-tools 34.0.0) + Gradle 8.7:

```bash
mkdir -p android/app/src/main/assets/www
cp lumen.html android/app/src/main/assets/www/index.html
cd android
gradle assembleRelease
# output: app/build/outputs/apk/release/app-release.apk
```

Note: this container is ARM64 Linux — `aapt2` from build-tools is x86_64-only,
so local build fails here. Use GitHub Actions (x86_64) instead.

## App details

- package: `com.lumen.studio`, version `1.5 (6)`
- release signing: fixed keystore `android/app/lumen-release.p12` (so CI updates install cleanly)
- minSdk 24 (Android 7.0+), targetSdk 34
- WebView: JavaScript + DOM/localStorage enabled, loads `file:///android_asset/www/index.html`
- `INTERNET` permission is for Google Fonts only; app works offline with fallback fonts.

## Updating from v1.3 / v1.4

Those builds were signed with an ephemeral CI key. Android will reject v1.5 as an
update, so **back up first, then uninstall the old app, then install v1.5**:

1. Open the old app → Settings → **สร้างและคัดลอกข้อมูลสำรอง**.
2. Long-press the backup textarea → Select all → Copy, and save the JSON somewhere.
3. Uninstall the old app, install v1.5.
4. Settings → paste the JSON into the backup box → **กู้คืนจากข้อมูลในช่อง**.

From v1.5 onward the signing key is fixed, so future APKs install over it without
uninstalling. (If you have no important data in the old app, just uninstall it.)
