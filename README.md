# Flux Launcher

The home screen of Flux Mobile. It lists the apps on the phone, with the Facile apps first, in the
muse design.

It is an ordinary Android app: SvelteKit and muse for the screen, Capacitor for the shell, and one
small native plugin (`AppsPlugin`) that lists and opens installed apps. The Flux Mobile ROM ships
it as a prebuilt APK, and it also installs on any Android phone.

## What it does

- Shows the time and date, then your apps in a grid, with the Facile apps (`studio.facile.*`) in
  their own group at the top.
- A search field filters apps by name, ignoring case and accents.
- Tap opens an app. Long-press opens the system App info screen, to uninstall it or change its
  permissions.
- Back and Home always land on the grid with the search cleared. The list refreshes each time
  you come back, and the last list shows at once on start.

## Install

On any Android 7 or newer phone, download
https://github.com/FacileStudio/flux-launcher/releases/latest/download/flux-launcher.apk and open
it (allow installs from your browser or file manager when asked). Then press Home and choose
Flux, or set it in Settings > Apps > Default apps > Home app.

The release APK is signed with the Flux Launcher key, SHA-256 certificate fingerprint
`F4:7F:EF:33:ED:46:8A:DB:1A:51:E8:36:77:F2:A9:12:79:7D:BB:CB:94:64:86:AB:79:DE:5D:F1:4E:77:F1:08`.

## Develop

You need bun, Node 22 for the Capacitor CLI, JDK 21 and the Android SDK.

```sh
bun install
mise run check
mise run apk
```

`mise run dev` opens the screen in a browser. Outside Android it shows the empty state, because
only the native plugin can list apps.

To try it on a phone, install the debug APK, press Home, and pick Flux.

## Release

Push a `v*` tag. `.github/workflows/release.yml` builds a signed APK and publishes
`flux-launcher.apk` with its `.sha256` on the GitHub release. The asset names carry no version,
so `releases/latest/download/flux-launcher.apk` stays stable.

The workflow reads four repository secrets: `ANDROID_KEYSTORE_BASE64`,
`ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` and `ANDROID_KEY_PASSWORD`. Their source of truth
is tiroir, under `FLUX_LAUNCHER_ANDROID_KEYSTORE_BASE64`, `_KEYSTORE_PASSWORD`, `_KEY_PASSWORD`
and `_KEY_ALIAS`. The key can never change once phones have the app: back up tiroir.

## License

GPL-3.0, like Flux.
