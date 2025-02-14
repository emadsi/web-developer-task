import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { TraineeService } from '../../services/trainee/trainee.service';

@Component({
  selector: 'app-monitor-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatCardModule
  ],
  templateUrl: './monitor-page.component.html',
  styleUrls: ['./monitor-page.component.scss']
})
export class MonitorPageComponent implements OnInit {
  filterForm!: FormGroup;
  trainees = signal<{ id: number; name: string; average: number; exams: number }[]>([]);
  filteredTrainees = signal<{ id: number; name: string; average: number; exams: number }[]>([]);

  constructor(
    private fb: FormBuilder,
    private traineeService: TraineeService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadTrainees();
  }

  initializeForm(): void {
    this.filterForm = this.fb.group({
      traineeIds: [[]], // Multi-select
      name: [''], // Free text field
      showPassed: [true], // Checkbox for Passed
      showFailed: [true] // Checkbox for Failed
    });

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadTrainees(): void {
    this.traineeService.getAllTrainees().subscribe((trainees) => {
      const traineeList = trainees.map((t) => ({
        id: t.id,
        name: t.name,
        average: t.average,
        exams: t.tests.length // Count the number of exams
      }));
      this.trainees.set(traineeList);
      this.filteredTrainees.set(traineeList); // Initially show all
    });
  }

  applyFilters(): void {
    const { traineeIds, name, showPassed, showFailed } = this.filterForm.value;

    const filtered = this.trainees().filter((trainee) => {
      // Filter by ID
      if (traineeIds.length > 0 && !traineeIds.includes(trainee.id)) {
        return false;
      }

      // Filter by Name
      if (name && !trainee.name.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }

      // Filter by Passed/Failed
      const isPassed = trainee.average >= 65;
      if ((isPassed && !showPassed) || (!isPassed && !showFailed)) {
        return false;
      }

      return true;
    });

    this.filteredTrainees.set(filtered);
  }
}