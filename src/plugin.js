/** @typedef {import 'webpack'.Compiler} Compiler */

import {resolve} from 'path';
import {unlinkSync} from 'fs';
import Logger from 'webpack-log';
import zip from 'bestzip';
import validateOptions from 'schema-utils';
import schema from '../options';
import {name as packageName} from '../package';

/**
 * @abstract
 */
export default class BasePlugin {
  /**
   * @param {Object} [options]
   * @param {String} [options.extensionId] Your extension's Chrome Web Store ID
   * @param {String} [options.clientId] Google OAuth 2.0 client ID
   * @param {String} [options.clientSecret] Google OAuth 2.0 client secret
   * @param {String} [options.refreshToken] Google OAuth 2.0 refresh token
   * @param {String} [options.path] Path to a directory containing a manifest.json file.
   * If omitted, webpack's output.path directory will be used.
   * @param {Boolean} [options.keepBundleOnSuccess=false] Set true to keep the ZIP if publishing is successful.
   * @param {Boolean} [options.silent=false] Set true to suppress logging
   * @param {Boolean} [options.disabled=false] Set true to disable the plugin (same as not having it).
   */
  constructor(options = {}) {
    validateOptions(schema, this.options = options, packageName);

    this.log = new Logger({
      name: packageName,
      level: this.options.silent ? 'silent' : 'info',
    });
  }

  /**
   * Called by webpack with an instance of the compiler.
   * @param {Compiler} compiler
   */
  apply = (compiler) => {
    if (!this.options.disabled) {
      compiler.hooks.afterEmit.tapPromise(packageName, this.afterEmit);
    }
  }

  /**
   * Runs after files have been emitted to the output directory by webpack.
   * @param {Compilation} compilation
   */
  afterEmit = async (compilation) => {
    const {path = compilation.outputOptions.path} = this.options;
    const bundle = await this.makeBundle(path);
    await this.publish(bundle);

    if (!this.options.keepBundleOnSuccess) {
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
   * Publishes a new zipped extension.
   * @param {String} bundle path to a ZIP file containing the extension.
   * @virtual
   */
  publish = async (bundle) => {
    throw new Error('publish() should be overriden by a subclass implementation.');
  }
}
