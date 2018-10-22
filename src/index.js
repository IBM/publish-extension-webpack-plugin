/** @typedef {import 'webpack'.Compiler} Compiler */

import {resolve} from 'path';
import {unlinkSync, createReadStream} from 'fs';
import Logger from 'webpack-log';
import zip from 'bestzip';
import ChromeWebStoreClient from 'chrome-webstore-upload';
import validateOptions from 'schema-utils';
import schema from './options';

/**
 * A webpack plugin that publishes extension builds to the Chrome Web Store.
 */
export default class PublishExtensionPlugin {
  /**
   * @param {Object} [options]
   * @param {String} [options.path] Path to a directory containing a manifest.json file.
   * If omitted, webpack's output.path directory will be used.
   * @param {Boolean} [options.throwOnFailure=false] Set true to throw an error if publishing is unsuccessful.
   * @param {Boolean} [options.keepBundleOnSuccess=false] Set true to keep the ZIP if publishing is successful.
   * @param {Boolean} [options.silent=false] Set true to suppress logging
   * @param {Boolean} [options.disabled=false] Set true to disable the plugin (same as not having it).
   * @param {String} [options.extensionId] Your extension's Chrome Web Store ID
   * @param {String} [options.clientId] Google OAuth 2.0 client ID
   * @param {String} [options.clientSecret] Google OAuth 2.0 client secret
   * @param {String} [options.refreshToken] Google OAuth 2.0 refresh token
   */
  constructor(options = {}) {
    validateOptions(schema, this.options = options, this.constructor.name);

    this.log = new Logger({
      name: this.constructor.name,
      level: this.options.silent ? 'silent' : 'info',
    });
  }

  /**
   * Called by webpack with an instance of the compiler.
   * @param {Compiler} compiler
   */
  apply = (compiler) => {
    if (!this.options.disabled) {
      compiler.hooks.afterEmit.tapPromise(this.constructor.name, this.afterEmit);
    }
  }

  /**
   * Runs after files have been emitted to the output directory by webpack.
   * @param {Compilation} compilation
   */
  afterEmit = async (compilation) => {
    const {path = compilation.outputOptions.path} = this.options;
    const bundle = await this.makeBundle(path);
    const isPublishSuccess = await this.publish(bundle);

    if (isPublishSuccess && !this.options.keepBundleOnSuccess) {
      unlinkSync(bundle);
    }
  }

  /**
   * Creates a ZIP file from the provided directory.
   * @param {String} directory A folder path.
   * @return {Promise<string>} Path to the created ZIP file.
   */
  makeBundle = async (directory) => {
    const options = {
      source: '*',
      destination: resolve(directory, '.bundle.zip'),
      cwd: directory,
    };
    await zip(options);
    return options.destination;
  }

  /**
   * Publishes a new zipped extension to the Chrome Web Store.
   * @param {String} bundle path to a ZIP file containing the extension.
   * @return {Promise<Boolean>} True if the publish succeeded, false otherwise.
   */
  publish = async (bundle) => {
    const {
      extensionId = process.env.GOOGLE_EXTENSION_ID,
      clientId = process.env.GOOGLE_CLIENT_ID,
      clientSecret = process.env.GOOGLE_CLIENT_SECRET,
      refreshToken = process.env.GOOGLE_REFRESH_TOKEN,
    } = this.options;

    const webstore = new ChromeWebStoreClient({extensionId, clientId, clientSecret, refreshToken});
    const zipFile = createReadStream(bundle);
    const {uploadState, itemError} = await webstore.uploadExisting(zipFile);

    if (['SUCCESS', 'IN_PROGRESS'].includes(uploadState)) {
      this.log.info(`Published new extension version (${uploadState}).`);
      return true;
    } else {
      itemError.forEach((err) => this.log.error(`${err.error_code}: ${err.error_detail}`));
      if (this.options.throwOnFailure) {
        throw new Error('Failed to publish extension.');
      }
      return false;
    }
  }
}
