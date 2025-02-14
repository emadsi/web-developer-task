import { Injectable } from '@angular/core';
import { MOCK_TRAINEES } from '../../mocks/trainees.mock';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  constructor() { }

  getChartData(chartType: string, filters: { traineeIds: number[]; subjects: string[] }): Observable<any> {
    switch (chartType) {
      case 'Chart 1':
        return this.getGradesOverTime(filters.traineeIds);
      case 'Chart 2':
        return this.getStudentAverages(filters.traineeIds);
      case 'Chart 3':
        return this.getGradesPerSubject(filters.subjects);
      default:
        return of(null);
    }
  }

  /** Chart 1: Get grades over time for selected trainees */
  private getGradesOverTime(traineeIds: number[]): Observable<any> {
    const filteredTrainees = traineeIds.length
      ? MOCK_TRAINEES.filter(t => traineeIds.includes(t.id))
      : MOCK_TRAINEES;

    const labels = new Set<string>();
    const datasets: any[] = [];

    filteredTrainees.forEach(trainee => {
      const data: { x: string; y: number }[] = [];
      trainee.tests.forEach(test => {
        labels.add(test.date);
        data.push({ x: test.date, y: test.grade });
      });

      datasets.push({
        label: trainee.name,
        data,
        borderColor: this.getRandomColor(),
        fill: false
      });
    });

    return of({
      labels: Array.from(labels).sort(),
      datasets
    });
  }

  /** Chart 2: Get average grade per student */
  private getStudentAverages(traineeIds: number[]): Observable<any> {
    const filteredTrainees = traineeIds.length
      ? MOCK_TRAINEES.filter(t => traineeIds.includes(t.id))
      : MOCK_TRAINEES;

    return of({
      labels: filteredTrainees.map(t => t.name),
      datasets: [{
        label: 'Average Grade',
        data: filteredTrainees.map(t => t.average),
        backgroundColor: filteredTrainees.map(() => this.getRandomColor())
      }]
    });
  }

  /** Chart 3: Get average grade per subject */
  private getGradesPerSubject(subjects: string[]): Observable<any> {
    const subjectGrades: { [key: string]: number[] } = {};

    MOCK_TRAINEES.forEach(trainee => {
      trainee.tests.forEach(test => {
        if (!subjects.length || subjects.includes(test.subject)) {
          if (!subjectGrades[test.subject]) {
            subjectGrades[test.subject] = [];
          }
          subjectGrades[test.subject].push(test.grade);
        }
      });
    });

    const labels = Object.keys(subjectGrades);
    const averages = labels.map(subj => {
      const grades = subjectGrades[subj];
      return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    });

    return of({
      labels,
      datasets: [{
        label: 'Average Grade per Subject',
        data: averages,
        backgroundColor: labels.map(() => this.getRandomColor())
      }]
    });
  }

  /** Returns a random color for charts */
  private getRandomColor(): string {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
  }
}
