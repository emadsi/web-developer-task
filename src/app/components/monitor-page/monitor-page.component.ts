import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgClass } from '@angular/common';
import { ITrainee } from '../../models/trainee.model';
import { Store } from '@ngrx/store';
import { TraineeState } from '../../reducers/trainee.reducer';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { TraineeService } from '../../services/trainee.service';

@Component({
  selector: 'app-monitor-page',
  standalone: true,
  imports: [
    NgClass,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  templateUrl: './monitor-page.component.html',
  styleUrls: ['./monitor-page.component.scss']
})
export class MonitorPageComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'average', 'exams'];
  dataSource = new MatTableDataSource<ITrainee>([]);
  trainees = signal<ITrainee[]>([]);
  filterForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private store: Store<TraineeState>, 
    private fb: FormBuilder, 
    private traineeService: TraineeService
  ) {}

  ngOnInit(): void {
    this.loadTraineeData();
    this.loadFilters();
    this.filterForm = this.fb.group({
      ids: [[]],
      name: [''],
      showPassed: [true],
      showFailed: [true]
    });
  }

  private loadTraineeData(): void {
    // this.trainees$ = this.store.select(state => state.trainees);
    this.traineeService.getAllTrainees().subscribe(trainees => {
      if (trainees) {
        trainees.forEach(trainee => {
          const gradesCount = trainee.tests.reduce((sum, test) => sum + test.grade, 0);
          trainee.average = trainee.tests.length > 0 ? gradesCount / trainee.tests.length : 0;
        });
        this.trainees.set(trainees);
        this.dataSource = new MatTableDataSource<ITrainee>(trainees);
        this.dataSource.paginator = this.paginator;
        // this.dataSource.filterPredicate = this.createFilter();
        // this.applyFilter(); // Apply stored filters when data loads
      }
    });
  }

  applyFilter(): void {
    const { ids, name, showPassed, showFailed } = this.filterForm.value;
    this.dataSource.filterPredicate = (data: ITrainee, filter: string) => {
      return (
        (!ids.length || ids.includes(data.id)) &&
        (!name || data.name.toLowerCase().includes(name.toLowerCase())) &&
        ((showPassed && data.average >= 65) || (showFailed && data.average < 65))
      );
    };
    this.dataSource.filter = JSON.stringify(this.filterForm.value);
    this.saveFilters();
  }

  saveFilters(): void {
    localStorage.setItem('monitorPageFilters', JSON.stringify(this.filterForm.value));
  }

  loadFilters(): void {
    const savedFilters = localStorage.getItem('monitorPageFilters');
    if (savedFilters) {
      this.filterForm.setValue(JSON.parse(savedFilters));
      this.applyFilter();
    }
  }

  // createFilter(): (data: ITrainee, filter: string) => boolean {
  //   return (data: ITrainee, filter: string): boolean => {
  //     const filters = JSON.parse(filter);
  //     return (
  //       (filters.id.length === 0 || filters.id.includes(data.id)) &&
  //       (filters.name === '' || data.name.toLowerCase().includes(filters.name.toLowerCase())) &&
  //       ((filters.showPassed && data.average >= 65) || (filters.showFailed && data.average < 65))
  //     );
  //   };
  // }
}