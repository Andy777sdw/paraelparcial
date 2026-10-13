import { RepositoryManifest } from '../../domain/model/repository-manifest.entity';
import { RepositoryManifestResource } from '../resources/repository-manifest.resource';
import { CreateManifestRequest } from '../resources/create-manifest.request';

/**
 * Assembler class responsible for mapping between RepositoryManifest resources, requests, and domain entities.
 *
 * @summary Pure mapping assembler for RepositoryManifest domain entity and resource DTOs.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export class RepositoryManifestAssembler {
  /**
   * Transforms a RepositoryManifestResource DTO into a domain RepositoryManifest entity.
   *
   * @param resource - The resource DTO from the backend API.
   * @returns A new instance of RepositoryManifest domain entity.
   */
  public static toEntityFromResource(resource: RepositoryManifestResource): RepositoryManifest {
    return new RepositoryManifest(
      resource.id,
      resource.repositoryId,
      resource.repositoryName,
      resource.fullName,
      resource.nodeId,
      Number(resource.allocatedSizeGb),
      resource.registeredAt
    );
  }

  /**
   * Transforms a RepositoryManifest domain entity into a RepositoryManifestResource DTO.
   *
   * @param entity - The domain entity.
   * @returns A RepositoryManifestResource DTO.
   */
  public static toResourceFromEntity(entity: RepositoryManifest): RepositoryManifestResource {
    return {
      id: entity.id,
      repositoryId: entity.repositoryId,
      repositoryName: entity.repositoryName,
      fullName: entity.fullName,
      nodeId: entity.nodeId,
      allocatedSizeGb: entity.allocatedSizeGb,
      registeredAt: entity.registeredAt
    };
  }

  /**
   * Transforms an array of RepositoryManifestResource DTOs into an array of domain entities.
   *
   * @param resources - An array of resource DTOs.
   * @returns An array of RepositoryManifest domain entities.
   */
  public static toEntitiesFromResources(resources: RepositoryManifestResource[]): RepositoryManifest[] {
    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Transforms a domain entity into a CreateManifestRequest DTO.
   *
   * @param entity - The domain entity.
   * @returns A CreateManifestRequest DTO.
   */
  public static toRequestFromEntity(entity: RepositoryManifest): CreateManifestRequest {
    return {
      repositoryId: entity.repositoryId,
      repositoryName: entity.repositoryName,
      fullName: entity.fullName,
      nodeId: entity.nodeId,
      allocatedSizeGb: entity.allocatedSizeGb,
      registeredAt: entity.registeredAt
    };
  }
}
