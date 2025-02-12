import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import { traineeReducer } from './app/reducers/trainee.reducer';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore({ trainees: traineeReducer }),
    provideRouter([
      { path: '', redirectTo: 'data', pathMatch: 'full' },
      { path: 'data', loadComponent: () => import('./app/components/data-page/data-page.component').then(m => m.DataPageComponent) },
      { path: 'analysis', loadComponent: () => import('./app/components/analysis-page/analysis-page.component').then(m => m.AnalysisPageComponent) },
      { path: 'monitor', loadComponent: () => import('./app/components/monitor-page/monitor-page.component').then(m => m.MonitorPageComponent) }
    ]),
    provideAnimations(), provideAnimationsAsync()
  ]
}).catch(err => console.error(err));
