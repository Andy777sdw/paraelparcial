import { Routes } from '@angular/router';
import { HomeComponent } from './cinodes/presentation/views/home/home.component';
import { ManifestNewComponent } from './cinodes/presentation/views/manifest-new/manifest-new.component';
import { PageNotFoundComponent } from './shared/presentation/views/page-not-found/page-not-found.component';

/**
 * Main application routing configuration.
 *
 * @summary Semantic routing table defining application navigation structure.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'GitHub CI/CD Platform - Home'
  },
  {
    path: 'repositories/manifests/new',
    component: ManifestNewComponent,
    title: 'GitHub CI/CD Platform - New Repository Manifest'
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'GitHub CI/CD Platform - Page Not Found'
  }
];
