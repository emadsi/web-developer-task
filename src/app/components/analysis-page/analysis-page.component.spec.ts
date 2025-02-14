import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalysisPageComponent } from './analysis-page.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { of } from 'rxjs';
import { TraineeService } from '../../services/trainee/trainee.service';
import { ChartComponent } from '../chart/chart.component';

describe('AnalysisPageComponent', () => {
  let component: AnalysisPageComponent;
  let fixture: ComponentFixture<AnalysisPageComponent>;
  let traineeServiceMock: any;

  beforeEach(async () => {
    traineeServiceMock = {
      getAllTrainees: jest.fn().mockReturnValue(of([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ])),
      getSubjects: jest.fn().mockReturnValue(of(['Math', 'Science']))
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        MatButtonModule,
        DragDropModule,
        MatCardModule,
        ChartComponent
      ],
      providers: [
        FormBuilder,
        { provide: TraineeService, useValue: traineeServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /** Test Component Creation */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /** Test Form Initialization */
  it('should initialize the form with empty values', () => {
    expect(component.filterForm.value).toEqual({
      traineeIds: [],
      subjects: []
    });
  });

  /** Test LocalStorage Loading */
  it('should load filters from localStorage if available', () => {
    const mockFilters = JSON.stringify({ traineeIds: [1], subjects: ['Math'] });
    localStorage.setItem('analysisPageFilters', mockFilters);

    component.loadFilters();
    
    expect(component.filterForm.value).toEqual({
      traineeIds: [1],
      subjects: ['Math']
    });
  });

  /** Test LocalStorage Saving */
  it('should save filters to localStorage', () => {
    component.filterForm.setValue({ traineeIds: [1, 2], subjects: ['Science'] });
    component.saveFilters();

    expect(localStorage.getItem('analysisPageFilters')).toBe(
      JSON.stringify({ traineeIds: [1, 2], subjects: ['Science'] })
    );
  });

  /** Test Fetching Trainees */
  it('should fetch trainees from the service', () => {
    expect(traineeServiceMock.getAllTrainees).toHaveBeenCalled();
    expect(component.trainees.length).toBe(2);
    expect(component.trainees).toEqual([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ]);
  });

  /** Test Fetching Subjects */
  it('should fetch subjects from the service', () => {
    expect(traineeServiceMock.getSubjects).toHaveBeenCalled();
    expect(component.subjects).toEqual(['Math', 'Science']);
  });

  /** Test Drag & Drop */
  it('should reorder displayed charts when drop event occurs', () => {
    const previousIndex = 0;
    const currentIndex = 1;
    const event = {
      previousIndex,
      currentIndex,
      item: {},
      container: {},
      previousContainer: {},
      isPointerOverContainer: true,
      distance: { x: 0, y: 0 }
    } as CdkDragDrop<string[]>;

    component.drop(event);

    expect(component.displayedCharts).toEqual(['Chart 3', 'Chart 1']);
  });

  /** Test Hidden Chart Replacement */
  it('should replace left displayed chart with hidden chart when clicked', () => {
    component.replaceWithHiddenChart();

    expect(component.displayedCharts[0]).toBe('Chart 2');
    expect(component.hiddenChart).toBe('Chart 1');
  });
});
