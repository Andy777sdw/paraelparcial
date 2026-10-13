import { GitHubRepo } from '../../domain/model/github-repo.entity';
import { GitHubRepoResource } from '../resources/github-repo.resource';

/**
 * Pure mapping assembler between GitHub API resources and domain entities.
 *
 * @summary Prevents domain coupling with GitHub snake_case REST API fields.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export class GitHubRepoAssembler {
  /**
   * Maps a GitHubRepoResource DTO to a domain GitHubRepo entity.
   *
   * @param resource - Raw GitHub resource DTO with snake_case keys.
   * @returns Domain entity with clean camelCase properties.
   */
  public static toEntityFromResource(resource: GitHubRepoResource): GitHubRepo {
    return new GitHubRepo(
      resource.id,
      resource.name,
      resource.full_name,
      resource.stargazers_count,
      resource.description,
      resource.html_url
    );
  }

  /**
   * Maps a GitHubRepo domain entity back to a GitHubRepoResource DTO.
   *
   * @param entity - Domain entity.
   * @returns Resource DTO with snake_case keys.
   */
  public static toResourceFromEntity(entity: GitHubRepo): GitHubRepoResource {
    return {
      id: entity.id,
      name: entity.name,
      full_name: entity.fullName,
      stargazers_count: entity.stargazersCount,
      description: entity.description,
      html_url: entity.htmlUrl
    };
  }

  /**
   * Maps an array of GitHubRepoResource DTOs to domain GitHubRepo entities.
   *
   * @param resources - Array of GitHub resource DTOs.
   * @returns Array of domain entities.
   */
  public static toEntitiesFromResources(resources: GitHubRepoResource[]): GitHubRepo[] {
    return resources.map((res) => this.toEntityFromResource(res));
  }
}
