import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { TraineeState } from '../../reducers/trainee.reducer';
import { loadTrainees, removeTrainee } from '../../actions/trainee.action';
import { Observable } from 'rxjs';
import { ITrainee } from '../../models/trainee.model';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-data-page',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss']
})
export class DataPageComponent implements OnInit {
  trainees$: Observable<ITrainee[]> = new Observable<ITrainee[]>();
  dataSource = new MatTableDataSource<ITrainee>([]); // Initialize with empty array
  displayedColumns: string[] = ['id', 'name', 'actions'];

  constructor(private store: Store<TraineeState>) {}

  ngOnInit(): void {
      this.fetchTrainees();
  }

  private fetchTrainees() {
    this.trainees$ = this.store.select(state => state.trainees);
    this.trainees$.subscribe(trainees => {
      if (trainees) {
        this.dataSource.data = trainees;
      }
    });
  }

  removeTrainee(id: number): void {
    this.store.dispatch(removeTrainee({ traineeId: id }));
  }
}