import fs, {existsSync, unlinkSync} from 'fs';
import Plugin from './plugin';

describe('constructor', () => {
  it('should reject unknown options', () => {
    expect(() => new Plugin({foo: 'bar'})).toThrow();
  });

  it('should reject invalid option type', () => {
    expect(() => new Plugin({silent: 'not a boolean'})).toThrow();
  });

  it('should set this.options', () => {
    const {options} = new Plugin({path: 'C:\\fakepath'});
    expect(options.path).toEqual('C:\\fakepath');
  });

  it('should create a logger', () => {
    const {log} = new Plugin();
    expect(log).toBeDefined();
    expect(log).toHaveProperty('info');
    expect(log).toHaveProperty('error');
  });
});

describe('apply', () => {
  it('should tap the afterEmit event hook', () => {
    const plugin = new Plugin();
    const mockCompiler = {hooks: {afterEmit: {tapPromise: jest.fn()}}};

    plugin.apply(mockCompiler);

    expect(mockCompiler.hooks.afterEmit.tapPromise)
      .toHaveBeenCalledWith(expect.any(String), plugin.afterEmit);
  });

  it('should do nothing if options.disabled is true', () => {
    const plugin = new Plugin({disabled: true});
    const mockCompiler = {hooks: {afterEmit: {tapPromise: jest.fn()}}};

    plugin.apply(mockCompiler);

    expect(mockCompiler.hooks.afterEmit.tapPromise).not.toHaveBeenCalled();
  });
});

describe('afterEmit', () => {
  fs.unlinkSync = jest.fn();

  beforeEach(fs.unlinkSync.mockReset);

  it('should use options.path if provided', async () => {
    const plugin = new Plugin({path: 'c:\\fakepath'});
    plugin.makeBundle = jest.fn();
    plugin.publish = jest.fn();

    await plugin.afterEmit();

    expect(plugin.makeBundle).toHaveBeenCalledWith('c:\\fakepath');
  });

  it('should use webpack output path if options.path is not provided', async () => {
    const plugin = new Plugin();
    plugin.makeBundle = jest.fn();
    plugin.publish = jest.fn();

    await plugin.afterEmit({outputOptions: {path: 'c:\\webpackpath'}});

    expect(plugin.makeBundle).toHaveBeenCalledWith('c:\\webpackpath');
  });

  it('should not delete zip if options.keepBundleOnSuccess is true', async () => {
    const plugin = new Plugin({keepBundleOnSuccess: true, path: 'c:\\fakepath'});
    plugin.makeBundle = jest.fn();
    plugin.publish = jest.fn();

    await plugin.afterEmit();

    expect(fs.unlinkSync).not.toHaveBeenCalled();
  });

  it('should delete zip if options.keepBundleOnSuccess is false', async () => {
    const plugin = new Plugin({keepBundleOnSuccess: false, path: 'c:\\fakepath'});
    fs.unlinkSync = jest.fn();
    plugin.makeBundle = jest.fn();
    plugin.publish = jest.fn(() => Promise.resolve(true));

    await plugin.afterEmit();

    expect(fs.unlinkSync).toHaveBeenCalled();
  });
});

describe('makeBundle', () => {
  it('should zip the contents of the provided directory', async () => {
    const path = __dirname;
    const {makeBundle} = new Plugin();

    const pathToZip = await makeBundle(path);

    expect(pathToZip).toContain(path);
    expect(existsSync(pathToZip)).toBeTruthy();

    unlinkSync(pathToZip);
  });
});

describe('publish', () => {
  it('should throw error if called without a subclass', async () => {
    const plugin = new Plugin();

    try {
      await plugin.publish();
    } catch (err) {
      expect(err.message).toMatch(/subclass/);
    }
  });
});
