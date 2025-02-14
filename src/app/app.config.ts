import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', redirectTo: 'data', pathMatch: 'full' },
      { path: 'data', loadComponent: () => import('./components/data-page/data-page.component').then(m => m.DataPageComponent) },
      { path: 'analysis', loadComponent: () => import('./components/analysis-page/analysis-page.component').then(m => m.AnalysisPageComponent) },
      { path: 'monitor', loadComponent: () => import('./components/monitor-page/monitor-page.component').then(m => m.MonitorPageComponent) }
    ]),
    provideAnimations(), provideAnimationsAsync(), provideHttpClient()
  ]
};
