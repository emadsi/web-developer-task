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
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-data-page',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss']
})
export class DataPageComponent implements OnInit {
  trainees$: Observable<ITrainee[]> = new Observable<ITrainee[]>();
  dataSource = new MatTableDataSource<ITrainee>([]); // Initialize with empty array
  displayedColumns: string[] = ['id', 'name', 'actions'];
  selectedFilters = { name: '', id: '' };

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
        this.applyFilters(); // Apply stored filters when data loads
      }
    });
  }

  saveFilters(): void {
    localStorage.setItem('filters', JSON.stringify(this.selectedFilters));
    this.applyFilters();
  }

  loadFilters(): void {
    const saved = localStorage.getItem('filters');
    if (saved) {
      this.selectedFilters = JSON.parse(saved);
    }
  }

  applyFilters(): void {
    this.dataSource.filterPredicate = (data: ITrainee, filter: string) => {
      const filterObj = JSON.parse(filter);
      return (
        (filterObj.name ? data.name.toLowerCase().includes(filterObj.name.toLowerCase()) : true) &&
        (filterObj.id ? data.id.toString().includes(filterObj.id) : true)
      );
    };

    this.dataSource.filter = JSON.stringify(this.selectedFilters);
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