import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonitorPageComponent } from './monitor-page.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { of } from 'rxjs';
import { TraineeService } from '../../services/trainee/trainee.service';

describe('MonitorPageComponent', () => {
  let component: MonitorPageComponent;
  let fixture: ComponentFixture<MonitorPageComponent>;
  let traineeServiceMock: any;

  beforeEach(async () => {
    traineeServiceMock = {
      getAllTrainees: jest.fn().mockReturnValue(of([
        { id: 1, name: 'John Doe', average: 70, tests: [{}, {}] }, // Passed, 2 exams
        { id: 2, name: 'Jane Doe', average: 60, tests: [{}] }, // Failed, 1 exam
        { id: 3, name: 'Mark Smith', average: 80, tests: [{}, {}, {}] } // Passed, 3 exams
      ]))
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatTableModule,
        MatCardModule
      ],
      providers: [
        FormBuilder,
        { provide: TraineeService, useValue: traineeServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MonitorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /** ✅ Test Component Creation */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /** ✅ Test Form Initialization */
  it('should initialize the form with default values', () => {
    expect(component.filterForm.value).toEqual({
      traineeIds: [],
      name: '',
      showPassed: true,
      showFailed: true
    });
  });

  /** ✅ Test Fetching Trainees */
  it('should fetch trainees from the service', () => {
    expect(traineeServiceMock.getAllTrainees).toHaveBeenCalled();
    expect(component.trainees().length).toBe(3);
    expect(component.trainees()).toEqual([
      { id: 1, name: 'John Doe', average: 70, exams: 2 },
      { id: 2, name: 'Jane Doe', average: 60, exams: 1 },
      { id: 3, name: 'Mark Smith', average: 80, exams: 3 }
    ]);
  });

  /** ✅ Test Filtering by ID */
  it('should filter trainees by selected ID', () => {
    component.filterForm.patchValue({ traineeIds: [1] });
    component.applyFilters();

    expect(component.filteredTrainees()).toEqual([
      { id: 1, name: 'John Doe', average: 70, exams: 2 }
    ]);
  });

  /** ✅ Test Filtering by Name */
  it('should filter trainees by name', () => {
    component.filterForm.patchValue({ name: 'Jane' });
    component.applyFilters();

    expect(component.filteredTrainees()).toEqual([
      { id: 2, name: 'Jane Doe', average: 60, exams: 1 }
    ]);
  });

  /** ✅ Test Filtering by Passed/Failed */
  it('should show only passed trainees when "Show Failed" is unchecked', () => {
    component.filterForm.patchValue({ showFailed: false });
    component.applyFilters();

    expect(component.filteredTrainees()).toEqual([
      { id: 1, name: 'John Doe', average: 70, exams: 2 },
      { id: 3, name: 'Mark Smith', average: 80, exams: 3 }
    ]);
  });

  it('should show only failed trainees when "Show Passed" is unchecked', () => {
    component.filterForm.patchValue({ showPassed: false });
    component.applyFilters();

    expect(component.filteredTrainees()).toEqual([
      { id: 2, name: 'Jane Doe', average: 60, exams: 1 }
    ]);
  });
});
