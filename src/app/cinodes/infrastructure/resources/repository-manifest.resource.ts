/**
 * DTO representing a Repository Manifest received from or sent to the backend API.
 *
 * @summary Resource response DTO for Repository Manifest infrastructure communication.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export interface RepositoryManifestResource {
  id: string | number;
  repositoryId: string | number;
  repositoryName: string;
  fullName: string;
  nodeId: string | number;
  allocatedSizeGb: number;
  registeredAt: string;
}
