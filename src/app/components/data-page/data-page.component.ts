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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-data-page',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss']
})
export class DataPageComponent implements OnInit {
  trainees$: Observable<ITrainee[]> = new Observable<ITrainee[]>();
  dataSource = new MatTableDataSource<ITrainee>([]); // Initialize with empty array
  displayedColumns: string[] = ['id', 'name', 'actions'];
  selectedFilters = [];

  constructor(
    private store: Store<TraineeState>, 
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
      this.fetchTrainees();
      this.loadFilters();
  }

  private fetchTrainees() {
    this.trainees$ = this.store.select(state => state.trainees);
    this.trainees$.subscribe(trainees => {
      if (trainees) {
        this.dataSource.data = trainees;
      }
    });
  }

  saveFilters() {
    localStorage.setItem('filters', JSON.stringify(this.selectedFilters));
  }

  loadFilters() {
    const saved = localStorage.getItem('filters');
    if (saved) this.selectedFilters = JSON.parse(saved);
  }

  removeTrainee(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to remove this trainee?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(removeTrainee({ traineeId: id }));
        this.snackBar.open('Trainee removed successfully!', 'Close', { duration: 3000 });
      }
    });
  }
}