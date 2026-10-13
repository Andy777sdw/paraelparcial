/**
 * Represents a CI/CD Node entity in the infrastructure domain.
 *
 * @summary Domain entity representing a regional CI/CD node and its compute/storage capabilities.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export class CINode {
  /**
   * Initializes a new instance of the CINode domain entity.
   *
   * @param id - Unique identifier of the CI node.
   * @param name - Display name of the CI node.
   * @param location - Geographic location / datacenter region of the node.
   * @param maxStorageCapacityGb - Maximum storage capacity in Gigabytes.
   */
  constructor(
    public readonly id: string | number,
    public readonly name: string,
    public readonly location: string,
    public readonly maxStorageCapacityGb: number
  ) {}
}
