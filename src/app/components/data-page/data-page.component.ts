import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ITrainee } from '../../models/trainee.model';
import { TraineeService } from '../../services/trainee/trainee.service';
import { MatCardModule } from '@angular/material/card';
import { ITestResult } from '../../models/testResult.model';
import { TraineeDetailsComponent } from "../trainee-details/trainee-details.component";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-data-page',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    TraineeDetailsComponent
],
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss']
})
export class DataPageComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'subject', 'grade', 'date', 'actions'];
  dataSource = new MatTableDataSource<{ trainee: ITrainee; test: ITestResult }>([]);
  filterForm!: FormGroup;
  traineeForm!: FormGroup;
  selectedTrainee: boolean = false;
  isNewTrainee = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private traineeService: TraineeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadTrainees();
    this.loadFilters();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private initializeForms(): void {
    this.filterForm = this.fb.group({
      id: [null],
      gradeMin: [null],
      gradeMax: [null],
      dateFrom: [''],
      dateTo: ['']
    });

    this.traineeForm = this.fb.group({
      id: [{ value: null, disabled: true }],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      city: [''],
      country: [''],
      zip: [null],
      grade: [null],
      date: [null],
      subject: ['']
    });
  }

  private loadTrainees(): void {
    this.traineeService.getAllTrainees().subscribe(trainees => {
      this.dataSource.data = this.flattenData(trainees);
      this.dataSource.paginator = this.paginator;
    });
  }

  private flattenData(trainees: ITrainee[]): { trainee: ITrainee; test: ITestResult }[] {
    return trainees.flatMap(trainee =>
      trainee.tests.map(test => ({
        trainee,
        test
      }))
    );
  }

  applyFilter(): void {
    const { id, gradeMin, gradeMax, dateFrom, dateTo } = this.filterForm.value;
    this.dataSource.filterPredicate = (data, filter) => {
      const matchesId = id ? data.trainee.id.toString() === id.toString() : true;
      const matchesGradeMin = gradeMin ? data.test.grade >= gradeMin : true;
      const matchesGradeMax = gradeMax ? data.test.grade <= gradeMax : true;
      const matchesDateFrom = dateFrom ? new Date(data.test.date) >= new Date(dateFrom) : true;
      const matchesDateTo = dateTo ? new Date(data.test.date) <= new Date(dateTo) : true;
      return matchesId && matchesGradeMin && matchesGradeMax && matchesDateFrom && matchesDateTo;
    };
    this.dataSource.filter = '' + Math.random();
    this.saveFilters();
  }

  private saveFilters(): void {
    localStorage.setItem('dataPageFilters', JSON.stringify(this.filterForm.value));
  }

  private loadFilters(): void {
    const savedFilters = localStorage.getItem('dataPageFilters');
    if (savedFilters) {
      this.filterForm.setValue(JSON.parse(savedFilters));
      this.applyFilter();
    }
  }

  openDetails(trainee: ITrainee | null, test: ITestResult |null, isNew: boolean = false): void {
    this.isNewTrainee = isNew;
    this.selectedTrainee = true;
    if (trainee) {
      this.fillTraineeForm(trainee, test);
    } else {
      this.traineeForm.reset();
      this.traineeForm.get('id').enable();
    }
  }

  private fillTraineeForm(trainee: ITrainee, test: ITestResult) {
    this.traineeForm = this.fb.group({
      id: [{ value: trainee.id, disabled: true }],
      name: [ trainee.name, Validators.required],
      email: [trainee.email, [Validators.required, Validators.email]],
      address: [trainee.address],
      city: [trainee.city],
      country: [trainee.country],
      zip: [trainee.zip],
      grade: [test.grade],
      date: [test.date],
      subject: [test.subject]
    })
  }

  closeDetails(): void {
    this.traineeForm.reset();
    this.isNewTrainee = false;
    this.selectedTrainee = false;
  }

  saveTrainee(): void {
    if (this.traineeForm.valid) {
      const traineeData = this.traineeForm.getRawValue();
      if (this.isNewTrainee) {
        this.traineeService.addTrainee(traineeData).subscribe(() => {
          this.loadTrainees();
          this.closeDetails();
        });
      } else {
        this.traineeService.updateTrainee(traineeData.id, traineeData).subscribe(() => {
          this.loadTrainees();
          this.closeDetails();
        });
      }
    }
  }

  deleteTrainee(trainee: ITrainee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: `Are you sure you want to delete ${trainee.name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.traineeService.deleteTrainee(trainee.id).subscribe(() => {
          this.loadTrainees();
        });
      }
    }); 
  }
}

