import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { RemoveLibrariesSchematicSchema } from './schema';
import { checkLibrariesExist } from './validation/check-libraries-exist';
import { removeLibrariesRules } from './rule/remove-libraries';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { removeMockFileResolutionPath } from '../shared/rule/remove-mock-file-resolution-path';
import {
  isHavingImplicitDependenciesAfterRemoval,
  isHavingE2ECypressProject,
} from '../../utils/e2e-project';
import { removeE2EProject } from '../shared/rule/remove-e2e-project';
import { removeE2EImplicitDependencies } from '../shared/rule/remove-e2e-implicit-dependencies';
import { isDomainEmptyAfterLibraryRemoval } from '../../utils/domain';
import { deleteDomainFolder } from '../shared/rule/delete-domain-folder';

export default function (options: RemoveLibrariesSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext): Rule => {
    const { application, domain, includedLibraryTypes } = options;
    checkLibrariesExist(application, domain, includedLibraryTypes, tree);
    let rules: Rule[] = [];
    if (isHavingE2ECypressProject(application, domain, tree)) {
      rules.push(
        removeE2EImplicitDependencies(application, domain, includedLibraryTypes)
      );
      if (
        !isHavingImplicitDependenciesAfterRemoval(
          application,
          domain,
          includedLibraryTypes,
          tree
        )
      ) {
        rules = rules.concat(removeE2EProject(application, domain));
      }
    }

    rules = rules.concat(
      removeLibrariesRules(application, domain, includedLibraryTypes)
    );
    if (includedLibraryTypes.includes(DomainLibraryName.Util)) {
      rules.push(removeMockFileResolutionPath(application, domain));
    }
    if (
      isDomainEmptyAfterLibraryRemoval(
        application,
        domain,
        includedLibraryTypes,
        tree
      )
    ) {
      rules.push(deleteDomainFolder(application, domain));
    }

    return chain(rules);
  };
}