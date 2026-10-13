import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RepositoryManifestResource } from '../resources/repository-manifest.resource';
import { CreateManifestRequest } from '../resources/create-manifest.request';

/**
 * Service responsible for communication with the Repository Manifests backend API endpoint.
 *
 * @summary Infrastructure API service for Repository Manifests operations.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
@Injectable({
  providedIn: 'root'
})
export class RepositoryManifestsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.manifestsApiUrl;

  /**
   * Fetches all Repository Manifests from the backend endpoint.
   *
   * @returns Observable emitting an array of RepositoryManifestResource DTOs.
   */
  public getAll(): Observable<RepositoryManifestResource[]> {
    return this.http.get<RepositoryManifestResource[]>(this.apiUrl);
  }

  /**
   * Persists a new Repository Manifest in the backend database.
   *
   * @param request - The payload DTO containing manifest creation details.
   * @returns Observable emitting the created RepositoryManifestResource DTO.
   */
  public create(request: CreateManifestRequest): Observable<RepositoryManifestResource> {
    return this.http.post<RepositoryManifestResource>(this.apiUrl, request);
  }

  /**
   * Fetches repository manifests assigned to a specific CI Node.
   *
   * @param nodeId - The identifier of the CI node.
   * @returns Observable emitting an array of RepositoryManifestResource DTOs.
   */
  public getByNodeId(nodeId: string | number): Observable<RepositoryManifestResource[]> {
    return this.http.get<RepositoryManifestResource[]>(`${this.apiUrl}?nodeId=${nodeId}`);
  }
}
