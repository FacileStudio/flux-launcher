# Flux Launcher

The home screen of Flux Mobile. It lists the apps on the phone, with the Facile apps first, in the
muse design.

It is an ordinary Android app: SvelteKit and muse for the screen, Capacitor for the shell, and one
small native plugin (`AppsPlugin`) that lists and opens installed apps. The Flux Mobile ROM ships
it as a prebuilt APK, and it also installs on any Android phone.

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

The workflow needs four repository secrets: `ANDROID_KEYSTORE_BASE64`,
`ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` and `ANDROID_KEY_PASSWORD`. The signing key can
never change once phones have the app, so keep it in tiroir and back it up.

## License

GPL-3.0, like Flux.
