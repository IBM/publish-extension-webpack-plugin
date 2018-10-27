import fs from 'fs';
import Plugin from '.';
import ChromeWebstoreUpload from 'chrome-webstore-upload';

const mockToken = jest.fn();
const mockUpload = jest.fn();
const mockPublish = jest.fn();

jest.mock('chrome-webstore-upload', () => jest.fn(() => ({
  fetchToken: mockToken,
  uploadExisting: mockUpload,
  publish: mockPublish,
})));

describe('publish', () => {
  beforeAll(() => fs.createReadStream = jest.fn().mockImplementation());
  afterAll(() => process.env = {});

  it('should work with process.env vars', async () => {
    const plugin = new Plugin({silent: true});
    plugin.uploadZip = jest.fn();
    plugin.publishDraft = jest.fn();

    process.env = {
      GOOGLE_EXTENSION_ID: 'hey',
      GOOGLE_CLIENT_ID: 'thats',
      GOOGLE_CLIENT_SECRET: 'pretty',
      GOOGLE_REFRESH_TOKEN: 'good',
    };

    await plugin.publish('C:\\fakepathtobundle.zip');

    expect(ChromeWebstoreUpload).toHaveBeenCalledWith({
      extensionId: 'hey',
      clientId: 'thats',
      clientSecret: 'pretty',
      refreshToken: 'good',
    });
  });
});

describe('uploadZip', () => {
  it('should log info if successful', async () => {
    const plugin = new Plugin({silent: true});
    plugin.log.info = jest.fn();
    mockUpload.mockImplementation(() => ({uploadState: 'SUCCESS'}));

    await plugin.uploadZip(new ChromeWebstoreUpload(), 'token', 'C:\\fakepathtobundle.zip');

    expect(plugin.log.info).toHaveBeenCalled();
  });

  it('should log and throw error if unsuccessful', async () => {
    const plugin = new Plugin({silent: true});
    plugin.log.error = jest.fn();
    mockUpload.mockImplementation(() => ({
      uploadState: 'FAILURE',
      itemError: [{error_code: '404', error_detail: 'extension not found'}],
    }));

    try {
      await plugin.uploadZip(new ChromeWebstoreUpload(), 'token', 'C:\\fakepathtobundle.zip');
    } catch (err) {
      expect(plugin.log.error).toHaveBeenCalled();
    }
  });
});

describe('publishDraft', () => {
  it('should log info if successful', async () => {
    const plugin = new Plugin({silent: true});
    plugin.log.info = jest.fn();
    mockPublish.mockImplementation(() => ({status: ['OK'], statusDetail: ['OK.']}));

    await plugin.publishDraft(new ChromeWebstoreUpload(), 'token');

    expect(plugin.log.info).toHaveBeenCalled();
  });

  it('should log and throw error if unsuccessful', async () => {
    const plugin = new Plugin({silent: true});
    plugin.log.error = jest.fn();
    mockPublish.mockImplementation(() => ({
      status: ['ITEM_PENDING_REVIEW'],
      statusDetail: ['foobar'],
    }));

    try {
      await plugin.publishDraft(new ChromeWebstoreUpload(), 'token');
    } catch (err) {
      expect(plugin.log.error).toHaveBeenCalled();
    }
  });
});
