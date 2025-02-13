import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ITrainee } from '../models/trainee.model';
import { MOCK_TRAINEES } from '../mocks/trainees.mock';

@Injectable({
  providedIn: 'root'
})
export class TraineeService {
  // private apiUrl = 'http://localhost:5000/api/trainees';  //We can adjust the API URL to match the BE
  constructor(private http: HttpClient) {}

  getAllTrainees(): Observable<ITrainee[]> {
    // return this.http.get<ITrainee[]>(this.apiUrl);
    return of(MOCK_TRAINEES)
  }

  getTraineeById(id: number): Observable<ITrainee> {
    // return this.http.get<ITrainee>(`${this.apiUrl}/${id}`);
    return of(MOCK_TRAINEES.find(trainee => trainee.id === id));
  }

  addTrainee(trainee: ITrainee): Observable<ITrainee> {
    // return this.http.post<ITrainee>(this.apiUrl, trainee);
    const isExist = MOCK_TRAINEES.find(trainee => trainee === trainee);
    if (isExist) {
      return of();
    } else {
      MOCK_TRAINEES.push(trainee);
      return of(trainee);
    }
  }

  updateTrainee(id: number, trainee: ITrainee): Observable<ITrainee> {
    // return this.http.put<ITrainee>(`${this.apiUrl}/${id}`, trainee);
    const index = MOCK_TRAINEES.findIndex(trainee => trainee.id === id);
    MOCK_TRAINEES[index] = trainee;
    return of(trainee);

  }

  deleteTrainee(id: number): Observable<ITrainee[]> {
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    const index = MOCK_TRAINEES.findIndex(trainee => trainee.id === id);
    const deletedTrainee: ITrainee[] = MOCK_TRAINEES.splice(index, 1);
    return of(deletedTrainee);
  }
}