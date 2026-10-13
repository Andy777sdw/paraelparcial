import { GitHubRepoResource } from './github-repo.resource';

/**
 * Resource DTO representing GitHub search API response.
 *
 * @summary GitHub Search API response container DTO.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export interface GitHubSearchResponseResource {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepoResource[];
}
