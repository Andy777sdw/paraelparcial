import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GitHubSearchResponseResource } from '../resources/github-search-response.resource';
import { GitHubRepoResource } from '../resources/github-repo.resource';

/**
 * Service responsible for interacting with GitHub Search REST API.
 *
 * @summary Infrastructure API service for querying public GitHub repositories by topic.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
@Injectable({
  providedIn: 'root'
})
export class GitHubApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.githubSearchApiUrl;

  /**
   * Searches public GitHub repositories matching the provided topic query.
   *
   * @param topic - The topic keyword to search (e.g., 'angular', 'react').
   * @returns Observable emitting an array of GitHubRepoResource DTOs.
   */
  public searchRepositoriesByTopic(topic: string): Observable<GitHubRepoResource[]> {
    const url = `${this.baseUrl}${encodeURIComponent(topic.trim())}`;
    return this.http
      .get<GitHubSearchResponseResource>(url)
      .pipe(map((response) => response.items || []));
  }
}
