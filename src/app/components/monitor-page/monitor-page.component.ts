import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TraineeState } from '../../reducers/trainee.reducer';
import { ITrainee } from '../../models/trainee.model';

// Angular Material
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-monitor-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule
  ],
  templateUrl: './monitor-page.component.html',
  styleUrls: ['./monitor-page.component.scss']
})
export class MonitorPageComponent {
  trainees$: Observable<ITrainee[]>;
  dataSource = new MatTableDataSource<ITrainee>([]); // Initialize with empty array
  displayedColumns: string[] = ['id', 'name', 'status'];

  constructor(private store: Store<TraineeState>) {
    this.trainees$ = this.store.select(state => state.trainees);

    this.trainees$.subscribe(trainees => {
      if (trainees) {
        this.dataSource.data = trainees;
      }
    });
  }

  getStatus(trainee: ITrainee): string {
    const avg = trainee.tests.reduce((sum, t) => sum + t.grade, 0) / trainee.tests.length;
    return avg >= 65 ? 'Passed' : 'Failed';
  }

  getStatusColor(status: string): string {
    return status === 'Passed' ? 'green' : 'red';
  }
}