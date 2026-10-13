import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SidenavComponent } from './shared/presentation/components/sidenav/sidenav.component';

/**
 * Root component of the GitHub CI/CD Node & Repository Management Platform.
 *
 * @summary Root standalone application shell component.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidenavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly translate = inject(TranslateService);

  constructor() {
    this.translate.setFallbackLang('en');
    this.translate.use('en');
  }
}
