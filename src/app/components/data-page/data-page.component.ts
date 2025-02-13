import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ITrainee } from '../../models/trainee.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { TraineeState } from '../../reducers/trainee.reducer';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { TraineeService } from '../../services/trainee.service';
import { AsyncPipe, NgForOf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-data-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatExpansionModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss'],
  providers: [TraineeService]
})
export class DataPageComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'date', 'grade', 'subject', 'actions'];
  dataSource = new MatTableDataSource<ITrainee>([]);
  expandedElement: ITrainee | null = null;
  trainees = signal<ITrainee[]>([]);
  filterForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog, 
    private snackBar: MatSnackBar, 
    private store: Store<TraineeState>, 
    private traineeService: TraineeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadTraineesData();
    this.loadFilters();
    this.filterForm = this.fb.group({
      id: [''],
      gradeMin: [null],
      gradeMax: [null],
      dateFrom: [''],
      dateTo: ['']
    });
  }

  loadTraineesData(): void {
    this.traineeService.getAllTrainees().subscribe(trainees => {
      if (trainees) {
        this.trainees.set(trainees);
        this.dataSource = new MatTableDataSource<ITrainee>(trainees);
        this.dataSource.paginator = this.paginator;
        // this.dataSource.filterPredicate = this.createFilter();
        // this.applyFilter(); // Apply stored filters when data loads
      }
    });
  }

  applyFilter(): void {
    const { id, gradeMin, gradeMax, dateFrom, dateTo } = this.filterForm.value;
    this.dataSource.filterPredicate = (data: ITrainee, filter: string) => {
      return (
        (!id || data.id.toString().includes(id)) &&
        (!gradeMin || data.average >= gradeMin) &&
        (!gradeMax || data.average <= gradeMax) &&
        (!dateFrom || new Date(data.tests[0].date) >= new Date(dateFrom)) &&
        (!dateTo || new Date(data.tests[0].date) <= new Date(dateTo))
      );
    };
    this.dataSource.filter = JSON.stringify(this.filterForm.value);
    this.saveFilters();
  }

  saveFilters(): void {
    localStorage.setItem('dataPageFilters', JSON.stringify(this.filterForm.value));
  }

  loadFilters(): void {
    const savedFilters = localStorage.getItem('dataPageFilters');
    if (savedFilters) {
      this.filterForm.setValue(JSON.parse(savedFilters));
      this.applyFilter();
    }
  }

  // createFilter(): (data: ITrainee, filter: string) => boolean {
  //   return (data: ITrainee, filter: string): boolean => {
  //     const filters = filter.toLowerCase().split(' ');
  //     return filters.every(term =>
  //       data.name.toLowerCase().includes(term) ||
  //       data.tests.some(test => test.subject.toLowerCase().includes(term)) ||
  //       data.id.toString().includes(term) ||
  //       (term.includes('>') && data.tests.some(test => test.grade > parseInt(term.replace('>', ''), 10))) ||
  //       (term.includes('>') && data.tests.some(test => test.grade < parseInt(term.replace('<', ''), 10)))
  //     );
  //   };
  // }

  toggleDetailPanel(row: ITrainee): void {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  addTrainee(): void {
    this.snackBar.open('Added new trainee!', 'Close', { duration: 3000 });
  }

  deleteTrainee(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this trainee?' }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.traineeService.deleteTrainee(id).subscribe(() => {
          this.loadTraineesData();
          this.snackBar.open(`Trainee ${id} removed`, 'Close', { duration: 3000 });
        });
      }
    });
  }
}