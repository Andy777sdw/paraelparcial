/**
 * Represents a repository manifest entity registered to a specific CI/CD node.
 *
 * @summary Domain entity for repository manifests allocated to regional CI/CD nodes.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export class RepositoryManifest {
  /**
   * Initializes a new instance of the RepositoryManifest domain entity.
   *
   * @param id - Unique identifier of the manifest.
   * @param repositoryId - GitHub repository unique identifier.
   * @param repositoryName - Short name of the repository.
   * @param fullName - Full GitHub repository name (owner/repo).
   * @param nodeId - Identifier of the CI node to which this repository is assigned.
   * @param allocatedSizeGb - Allocated storage capacity in Gigabytes.
   * @param registeredAt - Registration timestamp in ISO format.
   */
  constructor(
    public readonly id: string | number,
    public readonly repositoryId: string | number,
    public readonly repositoryName: string,
    public readonly fullName: string,
    public readonly nodeId: string | number,
    public readonly allocatedSizeGb: number,
    public readonly registeredAt: string
  ) {}
}
