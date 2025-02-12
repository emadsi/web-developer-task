import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TraineeState } from '../../reducers/trainee.reducer';
import { ITrainee } from '../../models/trainee.model';

// Angular Material & Charts
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AsyncPipe, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analysis-page',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    NgxChartsModule
  ],
  templateUrl: './analysis-page.component.html',
  styleUrls: ['./analysis-page.component.scss']
})
export class AnalysisPageComponent implements OnInit {
  trainees$: Observable<ITrainee[]>;

  selectedTraineeIds: number[] = [];
  selectedSubjects: string[] = [];

  constructor(private store: Store<TraineeState>) { }

  ngOnInit(): void {
      this.fetchTrainees();
  }
  
  private fetchTrainees() {
    this.trainees$ = this.store.select(state => state.trainees);
  }

  getFilteredData(trainees: ITrainee[]) {
    return trainees
      ? trainees
        .filter(t => this.selectedTraineeIds.includes(t.id))
        .flatMap(t => t.tests)
        .filter(test => this.selectedSubjects.includes(test.subject))
        .map(test => ({
          name: test.subject,
          value: test.grade
        }))
      : [];
  }
}