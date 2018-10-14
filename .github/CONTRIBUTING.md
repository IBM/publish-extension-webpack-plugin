# publish-extension-webpack-plugin

Thanks for your interest in contributing! ❤

## Table of Contents

* [Dependencies](#dependencies)
* [Installing](#installing)
* [Building](#building)
* [Developing](#developing)
* [Testing](#testing)
* [Linting](#linting)

## Dependencies

* [git](https://git-scm.com)
* [node](https://nodejs.org)

## Installing

```console
$ git clone https://github.com/bcanseco/publish-extension-webpack-plugin
$ cd publish-extension-webpack-plugin
$ npm install
```

## Building

```console
$ npm start
```

This spits out the compiled plugin inside `dist/` using our [webpack config](/webpack.config.babel.js).

## Developing

You can use the [example](/example) folder to test the plugin during development.

This folder has a simple [manifest file](/example/manifest.json) and [content script](/example/index.js), along with a dedicated [webpack config](/example/webpack.config.babel.js) for building a dummy extension using the plugin.

First things first, be sure to create a `.env` file inside this folder and include your secret keys. Use [.env.example](/example/.env.example) as a guide:

```dosini
GOOGLE_EXTENSION_ID=your-extension-id-goes-here
GOOGLE_CLIENT_ID=your-client-id-goes-here
GOOGLE_CLIENT_SECRET=your-client-secret-goes-here
GOOGLE_REFRESH_TOKEN=your-refresh-token-goes-here
```

Now you can build the extension (and thus try the plugin) using the following command:

```console
$ npm run example
```

### Debugging with VS Code

If you use [Visual Studio Code](https://code.visualstudio.com/), you can debug the plugin by running our `Example` launch configuration from the debugging tab.

Set breakpoints anywhere as needed.

## Testing

```console
$ npm test
```

This runs our [unit tests](/src/index.spec.js) with `jest`. Let's keep it at 100% coverage. 😊

### Debugging with VS Code

If you use [Visual Studio Code](https://code.visualstudio.com/), you can debug the tests by running our `Test` launch configuration from the debugging tab.

Set breakpoints anywhere as needed.

## Linting

```console
$ npm run lint
```

This runs `eslint` using our [style configuration](/.eslintrc).
