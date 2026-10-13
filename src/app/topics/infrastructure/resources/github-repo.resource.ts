/**
 * Resource DTO representing GitHub repository item directly from GitHub Search API.
 *
 * @summary GitHub repository resource DTO matching GitHub REST API response structure.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export interface GitHubRepoResource {
  id: number;
  name: string;
  full_name: string;
  stargazers_count: number;
  description?: string;
  html_url?: string;
}
