import {
  chain,
  Rule,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';
import { AddCypressProjectSchematicSchema } from './schema';
import { addE2EProjectRules } from './rule/add-e2e-project-rules';
import { getProjects } from '../../utils/domain';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';

export default function (options: AddCypressProjectSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext): Rule =>
    chain([
      ...addE2EProjectRules(
        options.application,
        options.domain,
        getExistingProjectsLibraryTypes(
          options.application,
          options.domain,
          tree
        ),
        options.linter,
        tree
      ),
    ]);
}

const getExistingProjectsLibraryTypes = (
  application: string,
  domain: string,
  tree: Tree
): DomainLibraryName[] =>
  getProjects(application, domain, tree).map((project) => project.type);