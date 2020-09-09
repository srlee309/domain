import {
  runNxCommandAsync,
  checkFilesExist,
  readFile,
} from '@nrwl/nx-plugin/testing';

describe('domain', () => {
  describe('addLibraries', () => {
    it('should add new library to domain', async (done) => {
      const application = 'test-application';
      const domain = 'leaf-domain';
      await runNxCommandAsync(
        `generate @srlee/domain:addLibraries --application ${application} --domain ${domain} --prefix srlee --includedLibraryTypes ui`
      );

      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/ui/src/index.ts`)
      ).not.toThrow();
      done();
    }, 45000);
    it('should add multiple libraries to domain', async (done) => {
      const application = 'test-application';
      const domain = 'multiple-library-domain';
      await runNxCommandAsync(
        `generate @srlee/domain:addLibraries --application ${application} --domain ${domain} --prefix srlee --includedLibraryTypes shell,ui,util`
      );

      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/shell/src/index.ts`)
      ).not.toThrow();
      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/ui/src/index.ts`)
      ).not.toThrow();
      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/util/src/index.ts`)
      ).not.toThrow();
      done();
    }, 45000);
    it('should create mock file and resolution path when adding util library', async (done) => {
      const application = 'test-application';
      const domain = 'leaf-domain';
      await runNxCommandAsync(
        `generate @srlee/domain:addLibraries --application ${application} --domain ${domain} --prefix srlee --includedLibraryTypes util`
      );

      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/util/src/testing.ts`)
      ).not.toThrow();
      done();
    }, 45000);
    it('should add jest junit reporter when it is true', async (done) => {
      const application = 'test-application';
      const domain = 'extra-options-test-domain/shared';
      await runNxCommandAsync(
        `generate @srlee/domain:addLibraries --application ${application} --domain ${domain} --prefix srlee --includedLibraryTypes util --addJestJunitReporter true`
      );
      const jestConfig = readFile(
        `libs/${application}/${domain}/util/jest.config.js`
      );
      expect(jestConfig.includes('reporters')).toBe(true);
      expect(jestConfig.includes('jest-junit')).toBe(true);
      done();
    }, 45000);
  });
});