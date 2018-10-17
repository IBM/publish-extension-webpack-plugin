<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![travis][travis]][travis-url]
[![cover][cover]][cover-url]

# Publish Extension Webpack Plugin

> A webpack plugin that publishes extension builds to the Chrome Web Store.

## Getting Started

To begin, you'll need to install `publish-extension-webpack-plugin`:

```console
$ npm install publish-extension-webpack-plugin --save-dev
```

Then add the plugin to your `webpack` config. For example:

**webpack.config.babel.js**

```js
import PublishExtensionPlugin from 'publish-extension-webpack-plugin';

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

## Contributing

PRs are welcome! Please see the [contributing guide](.github/CONTRIBUTING.md).

[npm]: https://img.shields.io/npm/v/publish-extension-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/publish-extension-webpack-plugin
[travis]: https://travis-ci.com/IBM/publish-extension-webpack-plugin.svg?branch=master
[travis-url]: https://travis-ci.com/IBM/publish-extension-webpack-plugin
[cover]: https://img.shields.io/codecov/c/github/IBM/publish-extension-webpack-plugin.svg
[cover-url]: https://codecov.io/gh/IBM/publish-extension-webpack-plugin
