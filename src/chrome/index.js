import {createReadStream} from 'fs';
import ChromeWebStoreClient from 'chrome-webstore-upload';
import BasePlugin from '../plugin';

/**
 * A webpack plugin that publishes extension builds to the Chrome Web Store.
 */
export default class PublishChromeExtensionPlugin extends BasePlugin {
  /**
   * Publishes a new zipped extension to the Chrome Web Store.
   * @param {String} bundle path to a ZIP file containing the extension.
   */
  publish = async (bundle) => {
    const {
      extensionId = process.env.GOOGLE_EXTENSION_ID,
      clientId = process.env.GOOGLE_CLIENT_ID,
      clientSecret = process.env.GOOGLE_CLIENT_SECRET,
      refreshToken = process.env.GOOGLE_REFRESH_TOKEN,
    } = this.options;

    const webstore = new ChromeWebStoreClient({extensionId, clientId, clientSecret, refreshToken});
    const token = await webstore.fetchToken();
    const zipFile = createReadStream(bundle);

    await this.uploadZip(webstore, token, zipFile);
    await this.publishDraft(webstore, token);
  }

  /**
   * Uploads a new zipped extension as a draft version that still needs to be published.
   * @param {ChromeWebStoreClient} webstore Chrome Web Store client used for uploading.
   * @param {String} token OAuth 2.0 token to authenticate with.
   * @param {ReadStream} zipFile The zip file to use for the upload.
   * @throws when the upload fails
   */
  uploadZip = async (webstore, token, zipFile) => {
    const {uploadState, itemError} = await webstore.uploadExisting(zipFile, token);

    if (['SUCCESS', 'IN_PROGRESS'].includes(uploadState)) {
      this.log.info(`Uploaded zipped extension (${uploadState}).`);
    } else {
      itemError.forEach((err) => this.log.error(`${err.error_code}: ${err.error_detail}`));
      throw new Error('Failed to upload zipped extension.');
    }
  }

  /**
   * Publishes the current draft as a new extension version.
   * @param {ChromeWebStoreClient} webstore Chrome Web Store client used for uploading.
   * @param {String} token OAuth 2.0 token to authenticate with.
   * @throws when the publish fails
   */
  publishDraft = async (webstore, token) => {
    const {status: statuses, statusDetail: details} = await webstore.publish('default', token);

    if (statuses.includes('OK')) {
      this.log.info('Published new extension version.');
    } else {
      statuses.forEach((status, i) => this.log.error(`${status}: ${details[i]}`));
      throw new Error('Failed to publish extension.');
    }
  }
}
