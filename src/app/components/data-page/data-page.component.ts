import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ITrainee } from '../../models/trainee.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { TraineeService } from '../../services/trainee.service';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ITestResult } from '../../models/testResult.model';
import { MOCK_TRAINEES } from '../../mocks/trainees.mock';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-data-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    NgIf,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatExpansionModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatSidenavModule
  ],
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss'],
  providers: [TraineeService]
})
export class DataPageComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'date', 'grade', 'subject', 'actions'];
  dataSource = new MatTableDataSource<{ trainee: ITrainee; test: ITestResult }>([]);
  filterForm: FormGroup;
  selectedTrainee: ITrainee | null = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog, 
    private snackBar: MatSnackBar, 
    private traineeService: TraineeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeFilters();
    this.loadTraineesData();
    this.loadFilters();
  }

  initializeFilters(): void {
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
        this.dataSource.data = this.flattenData(trainees);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });
      }
    });
  }

  flattenData(trainees: ITrainee[]): { trainee: ITrainee; test: ITestResult }[] {
    return trainees.flatMap(trainee =>
      trainee.tests.map(test => ({
        trainee,
        test
      }))
    );
  }

  applyFilter(): void {
    const { id, gradeMin, gradeMax, dateFrom, dateTo } = this.filterForm.value;
    this.dataSource.filterPredicate = (data: { trainee: ITrainee; test: ITestResult }, filter: string) => {
      return (
        (!id || data.trainee.id.toString().includes(id)) &&
        (!gradeMin || data.trainee.average >= gradeMin) &&
        (!gradeMax || data.trainee.average <= gradeMax) &&
        (!dateFrom || new Date(data.test.date) >= new Date(dateFrom)) &&
        (!dateTo || new Date(data.test.date) <= new Date(dateTo))
      );
    };
    this.dataSource.filter = JSON.stringify(this.filterForm.value);
    this.saveFilters();
  }

  saveFilters(): void {
    localStorage.setItem('dataPageFilters', JSON.stringify(this.filterForm.value));
  }

  loadFilters(): void {
    if (!this.filterForm) return;

    const savedFilters = localStorage.getItem('dataPageFilters');
    if (savedFilters) {
      this.filterForm.setValue(JSON.parse(savedFilters));
      this.applyFilter();
    }
  }

  openDetails(trainee: ITrainee): void {
    this.selectedTrainee = trainee;
  }

  closeDetails(): void {
    this.selectedTrainee = null;
  }

  addTrainee(trainee: ITrainee): void {
    MOCK_TRAINEES.push(trainee);
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