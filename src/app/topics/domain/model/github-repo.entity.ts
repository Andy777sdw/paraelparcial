/**
 * Represents a GitHub repository domain entity fetched from GitHub public API.
 *
 * @summary Domain entity representing open-source GitHub repositories.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export class GitHubRepo {
  /**
   * Initializes a new instance of the GitHubRepo domain entity.
   *
   * @param id - Unique repository ID in GitHub.
   * @param name - Repository short name.
   * @param fullName - Full repository path (e.g., owner/repo).
   * @param stargazersCount - Number of stars on GitHub.
   * @param description - Optional repository description.
   * @param htmlUrl - Optional repository URL.
   */
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly fullName: string,
    public readonly stargazersCount: number,
    public readonly description?: string,
    public readonly htmlUrl?: string
  ) {}
}
