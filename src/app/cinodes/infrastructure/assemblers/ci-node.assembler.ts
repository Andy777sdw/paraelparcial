import { CINode } from '../../domain/model/ci-node.entity';
import { CINodeResource } from '../resources/ci-node.resource';

/**
 * Assembler class responsible for mapping between CINode resources and domain entities.
 *
 * @summary Pure mapping assembler for CINode domain entity and resource DTOs.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export class CINodeAssembler {
  /**
   * Transforms a CINodeResource DTO into a domain CINode entity.
   *
   * @param resource - The resource DTO from the backend API.
   * @returns A new instance of CINode domain entity.
   */
  public static toEntityFromResource(resource: CINodeResource): CINode {
    return new CINode(
      resource.id,
      resource.name,
      resource.location,
      resource.maxStorageCapacityGb
    );
  }

  /**
   * Transforms a CINode domain entity into a CINodeResource DTO.
   *
   * @param entity - The domain entity.
   * @returns A CINodeResource DTO suitable for API transport.
   */
  public static toResourceFromEntity(entity: CINode): CINodeResource {
    return {
      id: entity.id,
      name: entity.name,
      location: entity.location,
      maxStorageCapacityGb: entity.maxStorageCapacityGb
    };
  }

  /**
   * Transforms an array of CINodeResource DTOs into an array of CINode domain entities.
   *
   * @param resources - An array of resource DTOs.
   * @returns An array of CINode domain entities.
   */
  public static toEntitiesFromResources(resources: CINodeResource[]): CINode[] {
    return resources.map((resource) => this.toEntityFromResource(resource));
  }
}
