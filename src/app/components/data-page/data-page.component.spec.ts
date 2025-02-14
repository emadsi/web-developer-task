import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataPageComponent } from './data-page.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TraineeService } from '../../services/trainee/trainee.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ITrainee } from '../../models/trainee.model';

describe('DataPageComponent', () => {
  let component: DataPageComponent;
  let fixture: ComponentFixture<DataPageComponent>;
  let traineeServiceMock: any;
  let dialogMock: any;

  beforeEach(async () => {
    traineeServiceMock = {
      getAllTrainees: jest.fn().mockReturnValue(of([
        { id: 1, name: 'John Doe', email: 'john@example.com', tests: [{ id: 1, subject: 'Math', grade: 80, date: '2024-02-15' }] },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', tests: [{ id: 2, subject: 'Science', grade: 75, date: '2024-03-01' }] }
      ])),
      addTrainee: jest.fn().mockReturnValue(of({})),
      updateTrainee: jest.fn().mockReturnValue(of({})),
      deleteTrainee: jest.fn().mockReturnValue(of({}))
    };

    dialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: () => of(true)
      })
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSidenavModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule
      ],
      providers: [
        FormBuilder,
        { provide: TraineeService, useValue: traineeServiceMock },
        { provide: MatDialog, useValue: dialogMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /** Test Component Creation */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /** Test Form Initialization */
  it('should initialize filter and trainee forms', () => {
    expect(component.filterForm.value).toEqual({
      id: null,
      gradeMin: null,
      gradeMax: null,
      dateFrom: '',
      dateTo: ''
    });

    expect(component.traineeForm.value).toEqual({
      id: null,
      name: '',
      email: '',
      address: '',
      city: '',
      country: '',
      zip: null,
      grade: null,
      date: null,
      subject: ''
    });
  });

  /** Test Fetching Trainees */
  it('should fetch trainees from the service', () => {
    expect(traineeServiceMock.getAllTrainees).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
  });

  /** Test Applying Filters */
  it('should filter trainees based on form values', () => {
    component.filterForm.patchValue({ gradeMin: 78 });
    component.applyFilter();

    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].trainee.name).toBe('John Doe');
  });

  /** Test Saving Filters */
  it('should save filters to localStorage', () => {
    component.filterForm.setValue({ id: 1, gradeMin: 70, gradeMax: null, dateFrom: '', dateTo: '' });
   ( component as any).saveFilters();

    expect(localStorage.getItem('dataPageFilters')).toBe(
      JSON.stringify({ id: 1, gradeMin: 70, gradeMax: null, dateFrom: '', dateTo: '' })
    );
  });

  /** Test Opening Details Panel */
  it('should open the details panel for a trainee', () => {
    const mockTrainee: ITrainee = {
      id: 1, name: 'John Doe', email: 'john@example.com', address: '', city: '', country: '', zip: 12345,
      tests: [{ id: 1, subject: 'Math', grade: 80, date: '2024-02-15' }], average: 80
    };

    component.openDetails(mockTrainee, mockTrainee.tests[0]);

    expect(component.selectedTrainee).toBe(true);
    expect(component.traineeForm.value.name).toBe('John Doe');
  });

  /** Test Closing Details Panel */
  it('should close the details panel', () => {
    component.closeDetails();
    expect(component.selectedTrainee).toBe(false);
    expect(component.isNewTrainee).toBe(false);
  });

  /** Test Adding a New Trainee */
  it('should add a new trainee when the form is valid', () => {
    component.isNewTrainee = true;
    component.traineeForm.setValue({
      id: null, name: 'New Trainee', email: 'new@example.com', address: '', city: '', country: '', zip: 10001,
      grade: 85, date: '2024-03-15', subject: 'Physics'
    });

    component.saveTrainee();

    expect(traineeServiceMock.addTrainee).toHaveBeenCalled();
  });

  /** Test Updating an Existing Trainee */
  it('should update an existing trainee when the form is valid', () => {
    component.isNewTrainee = false;
    component.traineeForm.setValue({
      id: 1, name: 'Updated Name', email: 'updated@example.com', address: '', city: '', country: '', zip: 10001,
      grade: 90, date: '2024-03-15', subject: 'Biology'
    });

    component.saveTrainee();

    expect(traineeServiceMock.updateTrainee).toHaveBeenCalledWith(1, {
      name: 'Updated Name',
      email: 'updated@example.com'
    });
  });

  /** Test Deleting a Trainee */
  it('should delete a trainee after confirmation', () => {
    const mockTrainee: ITrainee = {
      id: 1, name: 'John Doe', email: 'john@example.com', address: '', city: '', country: '', zip: 12345,
      tests: [], average: 80
    };

    component.deleteTrainee(mockTrainee);

    expect(dialogMock.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      width: '400px',
      data: { message: `Are you sure you want to delete John Doe?` }
    });
    expect(traineeServiceMock.deleteTrainee).toHaveBeenCalledWith(1);
  });
});
