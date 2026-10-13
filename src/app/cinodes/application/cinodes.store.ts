import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { forkJoin, Observable, tap, map, catchError, throwError } from 'rxjs';
import { CINode } from '../domain/model/ci-node.entity';
import { RepositoryManifest } from '../domain/model/repository-manifest.entity';
import { CINodesApiService } from '../infrastructure/services/ci-nodes-api.service';
import { RepositoryManifestsApiService } from '../infrastructure/services/repository-manifests-api.service';
import { CINodeAssembler } from '../infrastructure/assemblers/ci-node.assembler';
import { RepositoryManifestAssembler } from '../infrastructure/assemblers/repository-manifest.assembler';
import { CreateManifestRequest } from '../infrastructure/resources/create-manifest.request';

/**
 * Reactive state management store for CI Nodes and Repository Manifests using Angular Signals.
 *
 * @summary Signals Store for CI Nodes application state.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
@Injectable({
  providedIn: 'root'
})
export class CINodesStore {
  private readonly ciNodesApi = inject(CINodesApiService);
  private readonly manifestsApi = inject(RepositoryManifestsApiService);

  // State Signals
  public readonly nodes = signal<CINode[]>([]);
  public readonly manifests = signal<RepositoryManifest[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);

  // Computed Signals
  public readonly totalNodes = computed(() => this.nodes().length);
  public readonly totalManifests = computed(() => this.manifests().length);

  constructor() {
    // Diagnostic state effect
    effect(() => {
      const nodesCount = this.nodes().length;
      const manifestsCount = this.manifests().length;
      console.log(`[CINodesStore] State updated: ${nodesCount} nodes, ${manifestsCount} manifests.`);
    });
  }

  /**
   * Loads all CI nodes and manifests from backend endpoints concurrently.
   *
   * @returns Observable completing when both datasets have been assembled and stored.
   */
  public loadAll(): Observable<{ nodes: CINode[]; manifests: RepositoryManifest[] }> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    return forkJoin({
      nodesRes: this.ciNodesApi.getAll(),
      manifestsRes: this.manifestsApi.getAll()
    }).pipe(
      map(({ nodesRes, manifestsRes }) => {
        const nodes = CINodeAssembler.toEntitiesFromResources(nodesRes);
        const manifests = RepositoryManifestAssembler.toEntitiesFromResources(manifestsRes);
        this.nodes.set(nodes);
        this.manifests.set(manifests);
        this.isLoading.set(false);
        return { nodes, manifests };
      }),
      catchError((error) => {
        this.isLoading.set(false);
        const message = error?.message || 'Failed to fetch CI nodes and manifests data.';
        this.errorMessage.set(message);
        return throwError(() => error);
      })
    );
  }

  /**
   * Retrieves all repository manifests assigned to a specific CI node.
   *
   * @param nodeId - The identifier of the CI node.
   * @returns Array of RepositoryManifest domain entities.
   */
  public getManifestsForNode(nodeId: string | number): RepositoryManifest[] {
    const stringNodeId = String(nodeId);
    return this.manifests().filter((manifest) => String(manifest.nodeId) === stringNodeId);
  }

  /**
   * Calculates the total storage capacity allocated on a specific CI node.
   *
   * @param nodeId - The identifier of the CI node.
   * @returns Sum of allocated storage in Gigabytes.
   */
  public getTotalAllocatedStorageForNode(nodeId: string | number): number {
    const assigned = this.getManifestsForNode(nodeId);
    return assigned.reduce((sum, item) => sum + (Number(item.allocatedSizeGb) || 0), 0);
  }

  /**
   * Calculates the remaining available storage capacity on a CI node.
   *
   * @param nodeId - The identifier of the CI node.
   * @returns Available storage capacity in Gigabytes.
   */
  public getAvailableCapacityForNode(nodeId: string | number): number {
    const stringNodeId = String(nodeId);
    const node = this.nodes().find((n) => String(n.id) === stringNodeId);
    if (!node) {
      return 0;
    }
    const totalAllocated = this.getTotalAllocatedStorageForNode(nodeId);
    const available = node.maxStorageCapacityGb - totalAllocated;
    return available >= 0 ? available : 0;
  }

  /**
   * Calculates the storage utilization percentage for a CI node.
   *
   * @param nodeId - The identifier of the CI node.
   * @returns Storage utilization percentage (0 - 100+).
   */
  public getUtilizationPercentageForNode(nodeId: string | number): number {
    const stringNodeId = String(nodeId);
    const node = this.nodes().find((n) => String(n.id) === stringNodeId);
    if (!node || node.maxStorageCapacityGb <= 0) {
      return 0;
    }
    const totalAllocated = this.getTotalAllocatedStorageForNode(nodeId);
    return (totalAllocated / node.maxStorageCapacityGb) * 100;
  }

  /**
   * Determines the utilization status category according to business rules:
   * - < 75%: "Normal"
   * - 75% - 99%: "Warning"
   * - 100%+: "Critical"
   *
   * @param nodeId - The identifier of the CI node.
   * @returns Status label: 'Normal' | 'Warning' | 'Critical'.
   */
  public getUtilizationStatusForNode(nodeId: string | number): 'Normal' | 'Warning' | 'Critical' {
    const percentage = this.getUtilizationPercentageForNode(nodeId);
    if (percentage < 75) {
      return 'Normal';
    }
    if (percentage < 100) {
      return 'Warning';
    }
    return 'Critical';
  }

  /**
   * Creates a new repository manifest, saves it to the backend and updates the signal state.
   *
   * @param request - Manifest creation request payload.
   * @returns Observable emitting the newly created RepositoryManifest domain entity.
   */
  public createManifest(request: CreateManifestRequest): Observable<RepositoryManifest> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    return this.manifestsApi.create(request).pipe(
      map((resource) => RepositoryManifestAssembler.toEntityFromResource(resource)),
      tap((newEntity) => {
        this.manifests.update((existing) => [...existing, newEntity]);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.isLoading.set(false);
        const message = error?.message || 'Failed to create repository manifest.';
        this.errorMessage.set(message);
        return throwError(() => error);
      })
    );
  }
}
