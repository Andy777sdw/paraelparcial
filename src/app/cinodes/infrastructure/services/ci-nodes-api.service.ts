import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CINodeResource } from '../resources/ci-node.resource';

/**
 * Service responsible for communication with the CI Nodes backend API endpoint.
 *
 * @summary Infrastructure API service for CI Nodes operations.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
@Injectable({
  providedIn: 'root'
})
export class CINodesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.ciNodesApiUrl;

  /**
   * Fetches all CI Nodes from the backend endpoint.
   *
   * @returns Observable emitting an array of CINodeResource DTOs.
   */
  public getAll(): Observable<CINodeResource[]> {
    return this.http.get<CINodeResource[]>(this.apiUrl);
  }

  /**
   * Fetches a single CI Node by its unique identifier.
   *
   * @param id - The unique identifier of the CI Node.
   * @returns Observable emitting the matching CINodeResource DTO.
   */
  public getById(id: string | number): Observable<CINodeResource> {
    return this.http.get<CINodeResource>(`${this.apiUrl}/${id}`);
  }
}
