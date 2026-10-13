import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { CINodesStore } from '../../../application/cinodes.store';
import { CINodeSummaryCardComponent } from '../../components/ci-node-summary-card/ci-node-summary-card.component';
import { RepositoryManifest } from '../../../domain/model/repository-manifest.entity';

/**
 * Home view component displaying the CI/CD regional nodes dashboard with a 2-column card grid.
 *
 * @summary Primary landing view displaying all regional CI Nodes and their allocated repositories.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
    CINodeSummaryCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public readonly cinodesStore = inject(CINodesStore);

  /**
   * Initializes component and triggers concurrent loading of CI nodes and manifests.
   */
  public ngOnInit(): void {
    this.cinodesStore.loadAll().subscribe({
      error: (err) => console.error('[HomeComponent] Error loading CI nodes data:', err)
    });
  }

  /**
   * Helper method to retrieve manifests for a specific node.
   *
   * @param nodeId - Target CI Node identifier.
   * @returns Array of repository manifests assigned to that node.
   */
  public getManifestsForNode(nodeId: string | number): RepositoryManifest[] {
    return this.cinodesStore.getManifestsForNode(nodeId);
  }

  /**
   * Retries fetching data in case of failure.
   */
  public onRetry(): void {
    this.cinodesStore.loadAll().subscribe();
  }
}
