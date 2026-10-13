import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ToolbarComponent } from '../toolbar/toolbar.component';

/**
 * Main application layout container component integrating Toolbar, Sidenav, and Router Outlet.
 *
 * @summary Responsive navigation layout adhering to WCAG accessibility guidelines.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    TranslatePipe,
    ToolbarComponent
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  @ViewChild('sidenav') public sidenav!: MatSidenav;

  /**
   * Signal controlling whether the sidenav is opened.
   */
  public readonly isOpened = signal<boolean>(true);

  /**
   * Toggles the open/close state of the side drawer.
   */
  public toggle(): void {
    this.isOpened.update((open) => !open);
  }
}
