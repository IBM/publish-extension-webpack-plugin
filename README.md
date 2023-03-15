<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![Build Status](https://jenkins-external.mixmax.com/buildStatus/icon?job=mixmaxhq%2Fpublish-extension-webpack-plugin%2Fmaster)](https://jenkins.mixmax.com/job/mixmaxhq/job/publish-extension-webpack-plugin/job/master/)

# Publish Extension Webpack Plugin

> A webpack plugin that publishes extension builds to the Chrome Web Store.

## Getting Started

To begin, you'll need to install `@mixmaxhq/publish-extension-webpack-plugin`:

```console
$ npm install @mixmaxhq/publish-extension-webpack-plugin --save-dev
```

Then add the plugin to your `webpack` config. For example:

**webpack.config.babel.js**

```js
import PublishExtensionPlugin from '@mixmaxhq/publish-extension-webpack-plugin';

export default {
  // ...
  plugins: [
    new PublishExtensionPlugin({
      // options go here
    }),
  ],
};
```

And run `webpack` via your preferred method.

## Options

### `extensionId`

Type: `String`
Default: `process.env.GOOGLE_EXTENSION_ID`

If not provided via options, this must be present in your environment as `GOOGLE_EXTENSION_ID`. You can get this from your extension's control panel on the [Developer Dashboard](https://chrome.google.com/webstore/devconsole).

```console
$ GOOGLE_EXTENSION_ID=extensionidgoeshere123 webpack
```

### `clientId`

Type: `String`
Default: `process.env.GOOGLE_CLIENT_ID`

If not provided via options, this must be present in your environment as `GOOGLE_CLIENT_ID`. You can get this and your other secret keys by following [this guide](https://developer.chrome.com/webstore/using_webstore_api).

```console
$ GOOGLE_CLIENT_ID=clientidgoeshere123 webpack
```

### `clientSecret`

Type: `String`
Default: `process.env.GOOGLE_CLIENT_SECRET`

If not provided via options, this must be present in your environment as `GOOGLE_CLIENT_SECRET`. You can get this and your other secret keys by following [this guide](https://developer.chrome.com/webstore/using_webstore_api).

```console
$ GOOGLE_CLIENT_SECRET=clientsecretgoeshere123 webpack
```

### `refreshToken`

Type: `String`
Default: `process.env.GOOGLE_REFRESH_TOKEN`

If not provided via options, this must be present in your environment as `GOOGLE_REFRESH_TOKEN`. You can get this and your other secret keys by following [this guide](https://developer.chrome.com/webstore/using_webstore_api).

```console
$ GOOGLE_REFRESH_TOKEN=refreshtokengoeshere123 webpack
```

### `target`

Type: `String`
Default: `default`

The publish [target](https://developer.chrome.com/docs/webstore/webstore_api/items/publish/) for the extension:
- `default` - the extension will be available to everyone (published as public extension).
- `trustedTesters` - the extension will be available only to trusted testers (published as private extension).
- `draft` - the extension will be uploaded to the store, but not published.

```js
// in your webpack.config.js
new PublishExtensionPlugin({
  target: 'trustedTesters',
})
```

### `path`

Type: `String`
Default: [`webpack.output.path`](https://webpack.js.org/configuration/output/#output-path)

The path containing the build of your extension. This should include a [manifest file](https://developer.chrome.com/apps/manifest).

```js
// in your webpack.config.js
new PublishExtensionPlugin({
  path: './dist/my-chrome-extension/',
})
```

### `keepBundleOnSuccess`

Type: `Boolean`
Default: `false`

By default, the generated ZIP file used for publishing the extension is deleted if the upload is successful. Set this to `true` to keep the ZIP file.

```js
// in your webpack.config.js
new PublishExtensionPlugin({
  keepBundleOnSuccess: true,
})
```

### `silent`

Type: `Boolean`
Default: `false`

Set this to `true` to suppress logging.

```js
// in your webpack.config.js
new PublishExtensionPlugin({
  silent: true,
})
```

### `disabled`

Type: `Boolean`
Default: `false`

Set this to `true` to disable the plugin (this is the same as not including it to begin with).

```js
// in your webpack.config.js
new PublishExtensionPlugin({
  disabled: true,
})
```

## Contributing

PRs are welcome! Please see the [contributing guide](.github/CONTRIBUTING.md).

## Publishing a new version

```
GH_TOKEN=xxx npx semantic-release --no-ci
```
