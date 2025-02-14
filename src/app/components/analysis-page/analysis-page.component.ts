import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { TraineeService } from '../../services/trainee/trainee.service';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-analysis-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    DragDropModule,
    MatCardModule,
    ChartComponent
  ],
  templateUrl: './analysis-page.component.html',
  styleUrls: ['./analysis-page.component.scss']
})
export class AnalysisPageComponent implements OnInit {
  filterForm!: FormGroup;
  displayedCharts: string[] = ['Chart 1', 'Chart 3'];
  hiddenChart: string = 'Chart 2';
  trainees: { id: number; name: string }[] = [];
  subjects: string[] = [];

  constructor(
    private fb: FormBuilder, 
    private  traineeService: TraineeService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadFilters();
    this.loadTraineesAndSubjects();
  }

  initializeForm(): void {
    this.filterForm = this.fb.group({
      traineeIds: [[]],
      subjects: [[]]
    });
  }

  applyFilters(): void {
    this.saveFilters();
    this.displayedCharts = [...this.displayedCharts]; // Forces Angular to refresh charts
  }

  loadFilters(): void {
    const savedFilters = localStorage.getItem('analysisPageFilters');
    if (savedFilters) {
      this.filterForm.setValue(JSON.parse(savedFilters));
    }
  }

  saveFilters(): void {
    localStorage.setItem('analysisPageFilters', JSON.stringify(this.filterForm.value));
  }

  loadTraineesAndSubjects(): void {
    this.traineeService.getAllTrainees().subscribe(trainees => {
      this.trainees = trainees.map(trainee => ({id: trainee.id, name: trainee.name}));
    });

    this.traineeService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
    });
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.displayedCharts, event.previousIndex, event.currentIndex);

  }

  replaceWithHiddenChart(): void {
    const temp = this.displayedCharts[0];
    this.displayedCharts[0] = this.hiddenChart;
    this.hiddenChart = temp;
  }
}