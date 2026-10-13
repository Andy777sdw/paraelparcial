import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { CINodesStore } from '../../../application/cinodes.store';
import { TopicsStore } from '../../../../topics/application/topics.store';
import { GitHubRepo } from '../../../../topics/domain/model/github-repo.entity';
import { CreateManifestRequest } from '../../../infrastructure/resources/create-manifest.request';

/**
 * Cross-field reactive validator verifying allocated storage does not exceed the selected CI node's available capacity.
 *
 * @param store - CINodesStore instance holding nodes capacity and allocation logic.
 * @returns ValidatorFn returning validation errors if allocation capacity is violated.
 */
function capacityCrossValidator(store: CINodesStore): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const nodeId = group.get('nodeId')?.value;
    const allocatedSizeGb = group.get('allocatedSizeGb')?.value;

    if (!nodeId || allocatedSizeGb === null || allocatedSizeGb === undefined || allocatedSizeGb === '') {
      return null;
    }

    const available = store.getAvailableCapacityForNode(nodeId);
    const requested = Number(allocatedSizeGb);

    if (requested > available) {
      return { exceedsCapacity: true, availableCapacity: available, requestedSize: requested };
    }

    return null;
  };
}

/**
 * View component for registering a new GitHub open-source repository manifest to a regional CI/CD node.
 *
 * @summary New Repository Manifest form view with real-time GitHub integration and reactive cross-field capacity validation.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
@Component({
  selector: 'app-manifest-new',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    TranslatePipe
  ],
  templateUrl: './manifest-new.component.html',
  styleUrl: './manifest-new.component.css'
})
export class ManifestNewComponent implements OnInit {
  public readonly cinodesStore = inject(CINodesStore);
  public readonly topicsStore = inject(TopicsStore);
  private readonly router = inject(Router);

  /**
   * Available GitHub search topics requested by specification.
   */
  public readonly availableTopics: string[] = ['angular', 'typescript', 'node', 'react'];

  /**
   * Currently selected GitHub repository entity.
   */
  public readonly selectedRepo = signal<GitHubRepo | null>(null);

  /**
   * Currently selected CI Node identifier.
   */
  public readonly selectedNodeId = signal<string | number | null>(null);

  /**
   * Reactive Form definition.
   */
  public readonly manifestForm = new FormGroup(
    {
      topic: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      repositoryId: new FormControl<number | null>(null, {
        validators: [Validators.required]
      }),
      nodeId: new FormControl<string | number | null>(null, {
        validators: [Validators.required]
      }),
      allocatedSizeGb: new FormControl<number | null>(null, {
        validators: [Validators.required, Validators.min(1)]
      })
    },
    { validators: [capacityCrossValidator(this.cinodesStore)] }
  );

  /**
   * Dynamically computed available capacity for currently selected CI node.
   */
  public readonly dynamicAvailableCapacity = computed<number | null>(() => {
    const nodeId = this.selectedNodeId();
    if (!nodeId) {
      return null;
    }
    return this.cinodesStore.getAvailableCapacityForNode(nodeId);
  });

  /**
   * Determines if the form has a capacity overflow violation.
   */
  public get hasCapacityError(): boolean {
    const control = this.manifestForm.get('allocatedSizeGb');
    const isTouchedOrDirty = !!(control?.touched || control?.dirty);
    return isTouchedOrDirty && !!this.manifestForm.errors?.['exceedsCapacity'];
  }

  public ngOnInit(): void {
    // Ensure nodes are loaded if arriving directly to route
    if (this.cinodesStore.nodes().length === 0) {
      this.cinodesStore.loadAll().subscribe();
    }

    // React to topic selection -> search GitHub API in real time
    this.manifestForm.get('topic')?.valueChanges.subscribe((topic) => {
      this.manifestForm.get('repositoryId')?.reset();
      this.selectedRepo.set(null);
      if (topic) {
        this.topicsStore.searchRepositories(topic).subscribe();
      } else {
        this.topicsStore.clear();
      }
    });

    // React to repository selection -> capture entity
    this.manifestForm.get('repositoryId')?.valueChanges.subscribe((repoId) => {
      if (repoId) {
        const repo = this.topicsStore.repositories().find((r) => r.id === repoId) || null;
        this.selectedRepo.set(repo);
      } else {
        this.selectedRepo.set(null);
      }
    });

    // React to node selection -> update capacity calculation
    this.manifestForm.get('nodeId')?.valueChanges.subscribe((nodeId) => {
      this.selectedNodeId.set(nodeId);
      this.manifestForm.updateValueAndValidity();
    });

    // React to allocated size input
    this.manifestForm.get('allocatedSizeGb')?.valueChanges.subscribe(() => {
      this.manifestForm.updateValueAndValidity();
    });
  }

  /**
   * Handles form submission to persist new manifest and navigate home.
   */
  public onSubmit(): void {
    if (this.manifestForm.invalid || !this.selectedRepo()) {
      this.manifestForm.markAllAsTouched();
      return;
    }

    const formVal = this.manifestForm.getRawValue();
    const repo = this.selectedRepo()!;

    const payload: CreateManifestRequest = {
      repositoryId: formVal.repositoryId!,
      repositoryName: repo.name,
      fullName: repo.fullName,
      nodeId: formVal.nodeId!,
      allocatedSizeGb: Number(formVal.allocatedSizeGb),
      registeredAt: new Date().toISOString()
    };

    this.cinodesStore.createManifest(payload).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('[ManifestNewComponent] Failed to persist manifest:', err);
      }
    });
  }

  /**
   * Cancels manifest creation and returns to home view.
   */
  public onCancel(): void {
    this.router.navigate(['/home']);
  }
}
