import { ITrainee } from '../models/trainee.model';

export const MOCK_TRAINEES: ITrainee[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    address: '123 Main St',
    city: 'New York',
    country: 'USA',
    zip: 10001,
    tests: [
      { id: 101, subject: 'Math', grade: 85, date: '2024-03-01' },
      { id: 102, subject: 'Science', grade: 78, date: '2024-02-15' }
    ],
    average: 81.5
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@example.com',
    address: '456 Maple St',
    city: 'Los Angeles',
    country: 'USA',
    zip: 90001,
    tests: [
      { id: 103, subject: 'Math', grade: 90, date: '2024-03-10' },
      { id: 104, subject: 'Science', grade: 80, date: '2024-02-25' }
    ],
    average: 85
  }
];
