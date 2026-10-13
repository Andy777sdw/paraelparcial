/**
 * DTO representing the request payload to create a new Repository Manifest.
 *
 * @summary Request DTO for creating a repository manifest.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export interface CreateManifestRequest {
  repositoryId: string | number;
  repositoryName: string;
  fullName: string;
  nodeId: string | number;
  allocatedSizeGb: number;
  registeredAt: string;
}
