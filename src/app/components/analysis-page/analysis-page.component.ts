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
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ITrainee } from '../../models/trainee.model';
import { TraineeService } from '../../services/trainee.service';
import { MatButtonModule } from '@angular/material/button';

interface ChartData {
  name: string;
  series: { name: string; value: number }[];
}

@Component({
  selector: 'app-analysis-page',
  standalone: true,
  imports: [
    NgForOf,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    DragDropModule,
    MatCardModule
  ],
  templateUrl: './analysis-page.component.html',
  styleUrls: ['./analysis-page.component.scss']
})
export class AnalysisPageComponent implements OnInit {
  trainees = signal<ITrainee[]>([]);
  subjects = signal<string[]>([]);
  filterForm: FormGroup;
  displayedCharts = signal<string[]>(['Chart 1', 'Chart 3']);
  hiddenChart = signal<string>('Chart 2');

  constructor(private traineeService: TraineeService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadTrainees();
    this.filterForm = this.fb.group({
      traineeIds: [[]],
      subjects: [[]]
    });
  }

  loadTrainees(): void {
    this.traineeService.getAllTrainees().subscribe(data => {
      this.trainees.set(data);
      const uniqueSubjects = new Set<string>();
      data.forEach(trainee => trainee.tests.forEach(test => uniqueSubjects.add(test.subject)));
      this.subjects.set(Array.from(uniqueSubjects));
    });
  }

  swapCharts(event: CdkDragDrop<string[]>): void {
    const updatedCharts = [...this.displayedCharts()];
    moveItemInArray(updatedCharts, event.previousIndex, event.currentIndex);
    this.displayedCharts.set(updatedCharts);
  }

  replaceChart(): void {
    const updatedCharts = [...this.displayedCharts()];
    const tempChart = updatedCharts[1];
    updatedCharts[1] = this.hiddenChart();
    this.hiddenChart.set(tempChart);
    this.displayedCharts.set(updatedCharts);
  }

  // loadCharts(): void {
  //   this.chartData = this.trainees()
  //     .filter(t => this.selectedTraineeIds().includes(t.id))
  //     .map(t => ({
  //       name: t.name,
  //       series: [{ name: t.subject, value: t.grade }]
  //     }));
  // }

  // updateSubjects(): void {
  //   this.chartData = this.trainees()
  //     .filter(t => this.selectedSubjects().includes(t.subject))
  //     .map(t => ({
  //       name: t.subject,
  //       series: [{ name: t.name, value: t.grade }]
  //     }));
  // }

  // swapCharts(index: number): void {
  //   if (this.bottomChart) {
  //     const temp = this.chartData[index];
  //     this.chartData[index] = this.bottomChart;
  //     this.bottomChart = temp;
  //   }
  // }
}
