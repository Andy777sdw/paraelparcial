import { Component, input, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TranslatePipe } from '@ngx-translate/core';
import { CINode } from '../../../domain/model/ci-node.entity';
import { RepositoryManifest } from '../../../domain/model/repository-manifest.entity';

/**
 * Reusable summary card component displaying CI/CD node details, assigned repository manifests, and storage metrics.
 *
 * @summary Visual card representation for a CI Node and its storage capacity utilization.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
@Component({
  selector: 'app-ci-node-summary-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    TranslatePipe
  ],
  templateUrl: './ci-node-summary-card.component.html',
  styleUrl: './ci-node-summary-card.component.css'
})
export class CINodeSummaryCardComponent {
  /**
   * The CI Node domain entity to display.
   */
  public readonly node = input.required<CINode>();

  /**
   * List of repository manifests currently assigned to this node.
   */
  public readonly manifests = input<RepositoryManifest[]>([]);

  /**
   * Total allocated storage sum computed from all assigned manifests (in GB).
   */
  public readonly totalAllocatedStorage = computed<number>(() => {
    return this.manifests().reduce((sum, item) => sum + (Number(item.allocatedSizeGb) || 0), 0);
  });

  /**
   * Remaining available storage capacity on this node (in GB).
   */
  public readonly availableCapacity = computed<number>(() => {
    const remaining = this.node().maxStorageCapacityGb - this.totalAllocatedStorage();
    return remaining >= 0 ? remaining : 0;
  });

  /**
   * Percentage of storage capacity currently consumed (0 to 100+).
   */
  public readonly utilizationPercentage = computed<number>(() => {
    const maxCapacity = this.node().maxStorageCapacityGb;
    if (maxCapacity <= 0) {
      return 0;
    }
    return (this.totalAllocatedStorage() / maxCapacity) * 100;
  });

  /**
   * Dynamic utilization status based on business thresholds:
   * - < 75%: "Normal"
   * - 75% - 99%: "Warning"
   * - 100%+: "Critical"
   */
  public readonly utilizationStatus = computed<'Normal' | 'Warning' | 'Critical'>(() => {
    const percent = this.utilizationPercentage();
    if (percent < 75) {
      return 'Normal';
    }
    if (percent < 100) {
      return 'Warning';
    }
    return 'Critical';
  });

  /**
   * CSS class modifier corresponding to the current utilization status.
   */
  public readonly statusClass = computed<string>(() => {
    const status = this.utilizationStatus();
    switch (status) {
      case 'Normal':
        return 'status-normal';
      case 'Warning':
        return 'status-warning';
      case 'Critical':
        return 'status-critical';
    }
  });

  /**
   * Icon name for the status badge.
   */
  public readonly statusIcon = computed<string>(() => {
    const status = this.utilizationStatus();
    switch (status) {
      case 'Normal':
        return 'check_circle';
      case 'Warning':
        return 'warning';
      case 'Critical':
        return 'error';
    }
  });
}
