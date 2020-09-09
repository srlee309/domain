import {
  runNxCommandAsync,
  checkFilesExist,
  readJson,
} from '@nrwl/nx-plugin/testing';

describe('domain', () => {
  describe('removeLibraries', () => {
    it('should remove library', async (done) => {
      const application = 'test-application';
      const domain = 'leaf-domain';
      await runNxCommandAsync(
        `generate @srlee/domain:removeLibraries --application ${application} --domain ${domain} --includedLibraryTypes ui`
      );

      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/ui/src/index.ts`)
      ).toThrow();
      done();
    }, 45000);
    it('should remove mock file and resolution path when removing util library', async (done) => {
      const application = 'test-application';
      const domain = 'leaf-domain';
      await runNxCommandAsync(
        `generate @srlee/domain:removeLibraries --application ${application} --domain ${domain} --includedLibraryTypes util`
      );

      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/util/src/testing.ts`)
      ).toThrow();
      done();
    }, 45000);
    it('should remove domain and e2e project when removing last library in domain', async (done) => {
      const application = 'test-application';
      const domain = 'single-library-domain';
      await runNxCommandAsync(
        `generate @srlee/domain:removeLibraries --application ${application} --domain ${domain} --includedLibraryTypes data-access`
      );

      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/data-access/src/index.ts`
        )
      ).toThrow();
      const nxJson = readJson('nx.json');
      const workspaceJson = readJson('workspace.json');
      const projectName = `e2e-${application}-${domain}`;
      expect(nxJson.projects[projectName]).toBeUndefined();
      expect(workspaceJson.projects[projectName]).toBeUndefined();
      done();
    }, 45000);
    it('should remove multiple libraries in domain', async (done) => {
      const application = 'test-application';
      const domain = 'multiple-library-domain';
      await runNxCommandAsync(
        `generate @srlee/domain:removeLibraries --application ${application} --domain ${domain} --includedLibraryTypes data-access,feature,shell,ui,util`
      );

      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/data-access/src/testing.ts`
        )
      ).toThrow();
      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/feature/src/testing.ts`)
      ).toThrow();
      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/shell/src/testing.ts`)
      ).toThrow();
      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/ui/src/testing.ts`)
      ).toThrow();
      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/util/src/testing.ts`)
      ).toThrow();
      done();
    });
  });
});