/**
 * Application environment configuration.
 *
 * @summary Environment configuration for development and mock endpoints.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export const environment = {
  production: false,
  ciNodesApiUrl: 'http://localhost:3000/ci-nodes',
  manifestsApiUrl: 'http://localhost:3000/repository-manifests',
  githubSearchApiUrl: 'https://api.github.com/search/repositories?q=topic:'
};
