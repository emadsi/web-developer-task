// import { Component, OnInit } from '@angular/core';
// import { AsyncPipe } from '@angular/common';
// import { Store } from '@ngrx/store';
// import { ITraineeState } from '../../reducers/trainee.reducer';
// import { loadITrainees, removeITrainee } from '../../actions/trainee.action';
// import { Observable } from 'rxjs';
// import { ITrainee } from '../../models/trainee.model';
// import { MatTableModule, MatTableDataSource } from '@angular/material/table';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
// import { FormsModule } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatPaginatorModule } from '@angular/material/paginator';



// @Component({
//   selector: 'app-data-page',
//   imports: [
//     MatTableModule,
//     MatButtonModule,
//     MatCardModule,
//     MatInputModule,
//     MatDialogModule,
//     FormsModule,
//     MatFormFieldModule,
//     MatSnackBarModule,
//     MatPaginatorModule
//   ],
//   templateUrl: './data-page.component.html',
//   styleUrls: ['./data-page.component.scss']
// })
// export class DataPageComponent implements OnInit {
//   trainees$: Observable<ITrainee[]> = new Observable<ITrainee[]>();
//   dataSource = new MatTableDataSource<ITrainee>([]); // Initialize with empty array
//   displayedColumns: string[] = ['id', 'name', 'actions'];
//   filterValues = { name: [], id: [] };
//   expandedElement: ITrainee | null;
//   totalITrainees = 0;

//   constructor(
//     private store: Store<ITraineeState>, 
//     private dialog: MatDialog,
//     private snackBar: MatSnackBar) {}

//   ngOnInit(): void {
//       this.fetchITrainees();
//       this.totalITrainees = this.dataSource.data.length;
//       this.dataSource.filterPredicate = this.createFilter();
//       this.loadFilters();
//   }

//   private fetchITrainees(): void {
//     this.trainees$ = this.store.select(state => state.trainees);
//     this.trainees$.subscribe(trainees => {
//       if (trainees) {
//         this.dataSource.data = trainees;
//         this.applyFilters(); // Apply stored filters when data loads
//       }
//     });
//   }

//   createFilter(): (data: ITrainee, filter: string) => boolean {
//     let filterFunction = function (data: ITrainee, filter: string): boolean {
//       let searchTerms = JSON.parse(filter);
//       return (
//         data.name.toLowerCase().includes(searchTerms.name.toLowerCase()) &&
//         data.id.toString().includes(searchTerms.id)
//       );
//     };
//     return filterFunction;
//   }

//   saveFilters(): void {
//     localStorage.setItem('filters', JSON.stringify(this.filterValues));
//     this.applyFilters();
//   }

//   loadFilters(): void {
//     const saved = localStorage.getItem('filters');
//     if (saved) {
//       this.filterValues = JSON.parse(saved);
//     }
//   }

//   applyFilters(): void {
//     this.dataSource.filterPredicate = (data: ITrainee, filter: string) => {
//       const filterObj = JSON.parse(filter);
//       return (
//         (filterObj.name ? data.name.toLowerCase().includes(filterObj.name.toLowerCase()) : true) &&
//         (filterObj.id ? data.id.toString().includes(filterObj.id) : true)
//       );
//     };

//     this.dataSource.filter = JSON.stringify(this.filterValues);
//   }

//   removeITrainee(id: number): void {
//     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
//       width: '350px',
//       data: { message: 'Are you sure you want to remove this trainee?' }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.store.dispatch(removeITrainee({ traineeId: id }));
//         this.snackBar.open('ITrainee removed successfully!', 'Close', { duration: 3000 });
//       }
//     });
//   }
// }

import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ITrainee } from '../../models/trainee.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { TraineeState } from '../../reducers/trainee.reducer';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { TraineeService } from '../../services/trainee.service';

@Component({
  selector: 'app-data-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    MatPaginator,
    MatExpansionModule
  ],
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss']
})
export class DataPageComponent implements OnInit {
  trainees$: Observable<ITrainee[]> = new Observable<ITrainee[]>();
  displayedColumns: string[] = ['id', 'name', 'testDate', 'grade', 'subject', 'actions'];
  dataSource = new MatTableDataSource<ITrainee>([]);
  expandedElement: ITrainee | null = null;
  filterValue = signal('');
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog, 
    private snackBar: MatSnackBar, 
    private store: Store<TraineeState>, 
    private traineeService: TraineeService
  ) {}

  ngOnInit(): void {
    this.loadTraineesData();
  }

  loadTraineesData(): void {
    this.trainees$ = this.store.select(state => state.trainees);
    this.trainees$.subscribe(trainees => {
      if (trainees) {
        this.dataSource = new MatTableDataSource<ITrainee>(trainees);
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.createFilter();
        this.applyFilter(); // Apply stored filters when data loads
      }
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.filterValue();
  }

  createFilter(): (data: ITrainee, filter: string) => boolean {
    return (data: ITrainee, filter: string): boolean => {
      const filters = filter.toLowerCase().split(' ');
      return filters.every(term =>
        data.name.toLowerCase().includes(term) ||
        data.tests.some(test => test.subject.toLowerCase().includes(term)) ||
        data.id.toString().includes(term) ||
        (term.includes('>') && data.tests.some(test => test.grade > parseInt(term.replace('>', ''), 10))) ||
        (term.includes('>') && data.tests.some(test => test.grade < parseInt(term.replace('<', ''), 10)))
      );
    };
  }

  toggleDetailPanel(row: ITrainee): void {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  addTrainee(): void {
    this.snackBar.open('Added new trainee!', 'Close', { duration: 3000 });
  }

  deleteTrainee(id: number): void {
    this.traineeService.deleteTrainee(id).subscribe(() => {
      this.loadTraineesData(); // Refresh data after deletion
    });
    this.snackBar.open(`Trainee ${id} removed`, 'Close', { duration: 3000 });
  }
}