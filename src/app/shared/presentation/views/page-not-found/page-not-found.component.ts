import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * View component displayed when a route is not matched (HTTP 404 semantic view).
 *
 * @summary Fallback page-not-found view displaying the attempted URL and navigation back to /home.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {
  private readonly router = inject(Router);

  /**
   * The unmatched URL path the user attempted to access.
   */
  public readonly attemptedUrl = this.router.url;

  /**
   * Navigates back to the home page.
   */
  public navigateHome(): void {
    this.router.navigate(['/home']);
  }
}
