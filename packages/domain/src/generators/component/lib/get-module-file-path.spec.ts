import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { getModuleFilePath } from './get-module-file-path';
import { getParsedDomain } from '../../shared/utils/domain';

describe('getModuleFilePath', () => {
  let appTree: Tree;
  const application = 'application';
  const domain = 'domain';
  const libraryType = DomainLibraryName.Feature;
  const moduleFolderPath = `libs/${application}/${domain}/${libraryType}/src/lib`;
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });
  it('should return path for default module if it exists', () => {
    const defaultModuleFileName = `${application}-${getParsedDomain(
      domain
    )}-${libraryType}.module.ts`;
    const defaultModuleFilePath = `${moduleFolderPath}/${defaultModuleFileName}`;
    appTree.write(defaultModuleFilePath, '');
    expect(getModuleFilePath(appTree, application, domain, libraryType)).toBe(
      defaultModuleFilePath
    );
  });
  it('should return path for first non routing module if the default module does not exist', () => {
    const expectedModuleFilePath = `${moduleFolderPath}/expected.module.ts`;
    appTree.write(`${moduleFolderPath}/routing-test.module.ts`, '');
    appTree.write(expectedModuleFilePath, '');
    expect(getModuleFilePath(appTree, application, domain, libraryType)).toBe(
      expectedModuleFilePath
    );
  });
});
