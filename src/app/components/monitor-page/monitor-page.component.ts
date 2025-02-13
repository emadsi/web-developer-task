// import { Component } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { Observable } from 'rxjs';
// import { TraineeState } from '../../reducers/trainee.reducer';
// import { ITrainee } from '../../models/trainee.model';

// // Angular Material
// import { MatTableModule, MatTableDataSource } from '@angular/material/table';
// import { MatCardModule } from '@angular/material/card';

// @Component({
//   selector: 'app-monitor-page',
//   standalone: true,
//   imports: [
//     MatTableModule,
//     MatCardModule
//   ],
//   templateUrl: './monitor-page.component.html',
//   styleUrls: ['./monitor-page.component.scss']
// })
// export class MonitorPageComponent {
//   trainees$: Observable<ITrainee[]>;
//   dataSource = new MatTableDataSource<ITrainee>([]); // Initialize with empty array
//   displayedColumns: string[] = ['id', 'name', 'status'];

//   constructor(private store: Store<TraineeState>) {
//     this.trainees$ = this.store.select(state => state.trainees);

//     this.trainees$.subscribe(trainees => {
//       if (trainees) {
//         this.dataSource.data = trainees;
//       }
//     });
//   }

//   getStatus(trainee: ITrainee): string {
//     const avg = trainee.tests.reduce((sum, t) => sum + t.grade, 0) / trainee.tests.length;
//     return avg >= 65 ? 'Passed' : 'Failed';
//   }

//   getStatusColor(status: string): string {
//     return status === 'Passed' ? 'green' : 'red';
//   }
// }

import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AsyncPipe, NgClass, NgForOf } from '@angular/common';
import { ITrainee } from '../../models/trainee.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { TraineeState } from '../../reducers/trainee.reducer';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-monitor-page',
  standalone: true,
  imports: [
    NgForOf,
    MatPaginator,
    MatCardModule,
    NgClass,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './monitor-page.component.html',
  styleUrls: ['./monitor-page.component.scss']
})
export class MonitorPageComponent implements OnInit {
  trainees$: Observable<ITrainee[]> = new Observable<ITrainee[]>();
  displayedColumns: string[] = ['id', 'name', 'average', 'exams'];
  dataSource = new MatTableDataSource<ITrainee>([]);
  traineeList = signal<ITrainee[]>([]);
  filterValues = signal<{ id: number[]; name: string; showPassed: boolean; showFailed: boolean }>({
    id: [],
    name: '',
    showPassed: true,
    showFailed: true
  });

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private store: Store<TraineeState>) {}

  ngOnInit(): void {
    this.loadTraineeData();
  }

  private loadTraineeData(): void {
    this.trainees$ = this.store.select(state => state.trainees);
    this.trainees$.subscribe(trainees => {
      if (trainees) {
        trainees.forEach(trainee => {
          const gradesCount = trainee.tests.reduce((sum, test) => sum + test.grade, 0);
          trainee.average = trainee.tests.length > 0 ? gradesCount / trainee.tests.length : 0;
        });
        this.traineeList.set(trainees);
        this.dataSource.data = trainees;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.createFilter();
        this.applyFilter(); // Apply stored filters when data loads
      }
    });
  }

  applyFilter(): void {
    this.dataSource.filter = JSON.stringify(this.filterValues());
  }

  createFilter(): (data: ITrainee, filter: string) => boolean {
    return (data: ITrainee, filter: string): boolean => {
      const filters = JSON.parse(filter);
      return (
        (filters.id.length === 0 || filters.id.includes(data.id)) &&
        (filters.name === '' || data.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        ((filters.showPassed && data.average >= 65) || (filters.showFailed && data.average < 65))
      );
    };
  }
}