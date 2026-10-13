/**
 * DTO representing a CI/CD Node received from or sent to the backend API.
 *
 * @summary Resource response DTO for CI Node infrastructure communication.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export interface CINodeResource {
  id: string | number;
  name: string;
  location: string;
  maxStorageCapacityGb: number;
}
