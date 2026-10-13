import { Component, inject, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

/**
 * Global application toolbar component displaying the GitHub logo, brand title, and language switcher.
 *
 * @summary Top navigation banner component adhering to accessibility standards.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  private readonly translate = inject(TranslateService);

  /**
   * Event emitted when user clicks on the menu button to toggle the sidenav.
   */
  public readonly toggleSidenav = output<void>();

  /**
   * Current active language computed signal.
   */
  public readonly currentLang = computed<string>(() => this.translate.currentLang() || 'en');

  /**
   * Changes the active language of the application in real-time.
   *
   * @param lang - Target language code ('en' | 'es').
   */
  public switchLanguage(lang: 'en' | 'es'): void {
    this.translate.use(lang);
  }

  /**
   * Triggers the sidenav toggle output event.
   */
  public onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }
}
