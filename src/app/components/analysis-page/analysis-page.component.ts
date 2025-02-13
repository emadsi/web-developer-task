// import { Component, OnInit } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { Observable } from 'rxjs';
// import { TraineeState } from '../../reducers/trainee.reducer';
// import { ITrainee } from '../../models/trainee.model';

// // Angular Material & Charts
// import { MatSelectModule } from '@angular/material/select';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatCardModule } from '@angular/material/card';
// import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { AsyncPipe, NgForOf } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-analysis-page',
//   standalone: true,
//   imports: [
//     AsyncPipe,
//     NgForOf,
//     FormsModule,
//     MatSelectModule,
//     MatFormFieldModule,
//     MatCardModule,
//     NgxChartsModule
//   ],
//   templateUrl: './analysis-page.component.html',
//   styleUrls: ['./analysis-page.component.scss']
// })
// export class AnalysisPageComponent implements OnInit {
//   trainees$: Observable<ITrainee[]>;

//   selectedTraineeIds: number[] = [];
//   selectedSubjects: string[] = [];

//   constructor(private store: Store<TraineeState>) { }

//   ngOnInit(): void {
//       this.fetchTrainees();
//   }
  
//   private fetchTrainees() {
//     this.trainees$ = this.store.select(state => state.trainees);
//   }

//   getFilteredData(trainees: ITrainee[]) {
//     return trainees
//       ? trainees.filter(t => this.selectedTraineeIds.includes(t.id))
//         .flatMap(t => t.tests).filter(test => this.selectedSubjects.includes(test.subject))
//         .map(test => ({
//           name: test.subject,
//           value: test.grade
//         }))
//       : [];
//   }
// }

import { Component, OnInit, signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AsyncPipe, NgForOf } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

interface ChartData {
  name: string;
  series: { name: string; value: number }[];
}

@Component({
  selector: 'app-analysis-page',
  standalone: true,
  imports: [
    NgForOf,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    NgxChartsModule,
    DragDropModule
  ],
  templateUrl: './analysis-page.component.html',
  styleUrls: ['./analysis-page.component.scss']
})
export class AnalysisPageComponent implements OnInit {
  trainees = signal([
    { id: 1, name: 'John Doe', subject: 'Math', grade: 85 },
    { id: 2, name: 'Jane Doe', subject: 'Science', grade: 78 },
    { id: 3, name: 'Alice Smith', subject: 'English', grade: 92 }
  ]);

  selectedTraineeIds = signal<number[]>([]);
  selectedSubjects = signal<string[]>([]);
  chartData: ChartData[] = [];
  bottomChart: ChartData | null = null;

  ngOnInit(): void {
    this.loadCharts();
  }

  loadCharts(): void {
    this.chartData = this.trainees()
      .filter(t => this.selectedTraineeIds().includes(t.id))
      .map(t => ({
        name: t.name,
        series: [{ name: t.subject, value: t.grade }]
      }));
  }

  updateSubjects(): void {
    this.chartData = this.trainees()
      .filter(t => this.selectedSubjects().includes(t.subject))
      .map(t => ({
        name: t.subject,
        series: [{ name: t.name, value: t.grade }]
      }));
  }

  swapCharts(index: number): void {
    if (this.bottomChart) {
      const temp = this.chartData[index];
      this.chartData[index] = this.bottomChart;
      this.bottomChart = temp;
    }
  }
}
