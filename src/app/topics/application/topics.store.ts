import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { GitHubRepo } from '../domain/model/github-repo.entity';
import { GitHubApiService } from '../infrastructure/services/github-api.service';
import { GitHubRepoAssembler } from '../infrastructure/assemblers/github-repo.assembler';

/**
 * Reactive state management store for GitHub topics and repository query results.
 *
 * @summary Signals Store for GitHub Topics application state.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
@Injectable({
  providedIn: 'root'
})
export class TopicsStore {
  private readonly githubApi = inject(GitHubApiService);

  // Signals
  public readonly repositories = signal<GitHubRepo[]>([]);
  public readonly selectedTopic = signal<string>('');
  public readonly isLoading = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);

  // Computed
  public readonly repoCount = computed(() => this.repositories().length);

  /**
   * Queries GitHub repositories by topic in real-time and updates signals.
   *
   * @param topic - The topic query name.
   * @returns Observable emitting domain GitHubRepo entities.
   */
  public searchRepositories(topic: string): Observable<GitHubRepo[]> {
    if (!topic || !topic.trim()) {
      this.repositories.set([]);
      this.selectedTopic.set('');
      return of([]);
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.selectedTopic.set(topic);

    return this.githubApi.searchRepositoriesByTopic(topic).pipe(
      map((resources) => GitHubRepoAssembler.toEntitiesFromResources(resources)),
      tap((entities) => {
        this.repositories.set(entities);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.isLoading.set(false);
        this.repositories.set([]);
        const message = error?.message || 'Failed to search GitHub repositories.';
        this.errorMessage.set(message);
        return of([]);
      })
    );
  }

  /**
   * Resets the store repository state.
   */
  public clear(): void {
    this.repositories.set([]);
    this.selectedTopic.set('');
    this.isLoading.set(false);
    this.errorMessage.set(null);
  }
}
