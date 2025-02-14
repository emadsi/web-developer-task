import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITrainee } from '../../models/trainee.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-trainee-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './trainee-details.component.html',
  styleUrls: ['./trainee-details.component.scss']
})
export class TraineeDetailsComponent {
  @Input() traineeForm: FormGroup | null = null;
  @Input() isNewTrainee = false;
  @Output() closeDetails = new EventEmitter<void>();
  @Output() saveTrainee = new EventEmitter<ITrainee>();


  constructor(private fb: FormBuilder) {}

  // ngOnChanges(): void {  
  //   if (this.trainee) {
  //     this.fillTraineeForm(this.trainee);
  //     this.traineeForm = this.fb.group({
  //       id: [{ value: this.trainee.id, disabled: true }],
  //       name: [this.trainee.name],
  //       email: [this.trainee.email],
  //       address: [this.trainee.address],
  //       city: [this.trainee.city],
  //       country: [this.trainee.country],
  //       zip: [this.trainee.zip]
  //     });
  //   }
  // }

  // private fillTraineeForm(trainee: IFullTraineeDetails) {
  //   this.traineeForm = this.fb.group({
  //     id: [{ value: trainee.id, disabled: true }],
  //     name: [ trainee.name, Validators.required],
  //     email: [trainee.email, [Validators.required, Validators.email]],
  //     address: [trainee.address],
  //     city: [trainee.city],
  //     country: [trainee.country],
  //     zip: [trainee.zip],
  //     grade: [trainee.grade],
  //     date: [trainee.date],
  //     subject: [trainee.subject]
  //   })
  // }

  save(): void {
    if (this.traineeForm.valid) {
      const updatedTrainee = { ...this.traineeForm.value, ...this.traineeForm.getRawValue() };
      this.saveTrainee.emit(updatedTrainee);
    }
  }
}
