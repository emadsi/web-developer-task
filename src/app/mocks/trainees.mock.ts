import { ITrainee } from '../models/trainee.model';

export const MOCK_TRAINEES: ITrainee[] = [
  {
    id: 1,
    name: 'Avi Peter',
    email: 'Avi@example.com',
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
    name: 'Zohar Argov',
    email: 'zohar@example.com',
    address: '456 Maple St',
    city: 'Los Angeles',
    country: 'USA',
    zip: 90001,
    tests: [
      { id: 103, subject: 'Math', grade: 90, date: '2024-03-10' },
      { id: 104, subject: 'Science', grade: 80, date: '2024-02-25' }
    ],
    average: 85
  },
  {
    id: 3,
    name: "David Lee",
    email: "david.lee@example.com",
    address: "45 Pine Street",
    city: "San Francisco",
    country: "USA",
    zip: 94103,
    tests: [
      { id: 6, subject: "Physics", grade: 58, date: "2024-01-20" },
      { id: 7, subject: "Chemistry", grade: 62, date: "2024-02-25" },
      { id: 8, subject: "Biology", grade: 54, date: "2024-03-12" }
    ],
    average: 58 // Below 65
  },
  {
    id: 4,
    name: 'Peter Pan',
    email: 'peter@example.com',
    address: '709 Maple St',
    city: 'Los Angeles',
    country: 'USA',
    zip: 90001,
    tests: [
      { id: 103, subject: 'Math', grade: 92, date: '2024-03-10' },
      { id: 104, subject: 'Science', grade: 80, date: '2024-02-25' }
    ],
    average: 85
  },
  {
    id: 5,
    name: "Robert Anderson",
    email: "robert.anderson@example.com",
    address: "78 Cedar Road",
    city: "New York",
    country: "USA",
    zip: 10001,
    tests: [
      { id: 12, subject: "English", grade: 63, date: "2024-01-10" },
      { id: 13, subject: "Science", grade: 61, date: "2024-02-15" },
      { id: 14, subject: "Math", grade: 60, date: "2024-03-08" }
    ],
    average: 61 // Below 65
  },
  {
    id: 6,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    address: '456 Oak St',
    city: 'Los Angeles',
    country: 'USA',
    zip: 90001,
    tests: [
      { id: 103, subject: 'Math', grade: 92, date: '2024-02-05' },
      { id: 104, subject: 'English', grade: 88, date: '2024-02-12' }
    ],
    average: 90
  },
  {
    id: 7,
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    address: '789 Pine St',
    city: 'Chicago',
    country: 'USA',
    zip: 60601,
    tests: [
      { id: 105, subject: 'History', grade: 74, date: '2024-02-07' },
      { id: 106, subject: 'Physics', grade: 81, date: '2024-02-15' }
    ],
    average: 77.5
  },
  {
    id: 8,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    address: '101 Maple St',
    city: 'Houston',
    country: 'USA',
    zip: 77001,
    tests: [
      { id: 107, subject: 'Biology', grade: 95, date: '2024-02-20' },
      { id: 108, subject: 'Chemistry', grade: 89, date: '2024-02-25' }
    ],
    average: 92
  },
  {
    id: 9,
    name: 'Chris Brown',
    email: 'chris.brown@example.com',
    address: '202 Elm St',
    city: 'Phoenix',
    country: 'USA',
    zip: 85001,
    tests: [
      { id: 109, subject: 'Math', grade: 63, date: '2024-02-08' },
      { id: 110, subject: 'English', grade: 77, date: '2024-02-18' }
    ],
    average: 70
  },
  {
    id: 10,
    name: 'Sophia Wilson',
    email: 'sophia.wilson@example.com',
    address: '303 Cedar St',
    city: 'San Diego',
    country: 'USA',
    zip: 92101,
    tests: [
      { id: 111, subject: 'History', grade: 80, date: '2024-02-09' },
      { id: 112, subject: 'Science', grade: 86, date: '2024-02-21' }
    ],
    average: 83
  },
  {
    id: 11,
    name: 'Liam Anderson',
    email: 'liam.anderson@example.com',
    address: '404 Birch St',
    city: 'Dallas',
    country: 'USA',
    zip: 75201,
    tests: [
      { id: 113, subject: 'Physics', grade: 70, date: '2024-02-11' },
      { id: 114, subject: 'Math', grade: 68, date: '2024-02-23' }
    ],
    average: 69
  },
  {
    id: 12,
    name: 'Olivia Martinez',
    email: 'olivia.martinez@example.com',
    address: '505 Walnut St',
    city: 'San Antonio',
    country: 'USA',
    zip: 78201,
    tests: [
      { id: 115, subject: 'Biology', grade: 90, date: '2024-02-14' },
      { id: 116, subject: 'Chemistry', grade: 92, date: '2024-02-22' }
    ],
    average: 91
  },
  {
    id: 13,
    name: 'Mason Taylor',
    email: 'mason.taylor@example.com',
    address: '606 Spruce St',
    city: 'Philadelphia',
    country: 'USA',
    zip: 19101,
    tests: [
      { id: 117, subject: 'History', grade: 88, date: '2024-02-06' },
      { id: 118, subject: 'Math', grade: 76, date: '2024-02-19' }
    ],
    average: 82
  },
  {
    id: 101,
    name: "Michael Carter",
    email: "michael.carter@example.com",
    address: "12 Oak Street",
    city: "Los Angeles",
    country: "USA",
    zip: 90001,
    tests: [
      { id: 1, subject: "Math", grade: 50, date: "2024-01-15" },
      { id: 2, subject: "Science", grade: 60, date: "2024-02-10" },
      { id: 3, subject: "History", grade: 55, date: "2024-03-05" }
    ],
    average: 55 // Below 65
  },
  {
    id: 102,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    address: "89 Maple Avenue",
    city: "Chicago",
    country: "USA",
    zip: 60601,
    tests: [
      { id: 4, subject: "Math", grade: 60, date: "2024-01-12" },
      { id: 5, subject: "English", grade: 50, date: "2024-02-18" }
    ],
    average: 55 // Below 65
  },
  {
    id: 103,
    name: 'Omer Adam',
    email: 'omer@example.com',
    address: '789 Main St',
    city: 'Washington DC',
    country: 'USA',
    zip: 10001,
    tests: [
      { id: 101, subject: 'Math', grade: 100, date: '2024-03-01' },
      { id: 102, subject: 'Science', grade: 70, date: '2024-02-15' }
    ],
    average: 81.5
  },
  {
    id: 104,
    name: "Emily Roberts",
    email: "emily.roberts@example.com",
    address: "102 Birch Lane",
    city: "Houston",
    country: "USA",
    zip: 77002,
    tests: [
      { id: 9, subject: "Math", grade: 62, date: "2024-01-22" },
      { id: 10, subject: "History", grade: 59, date: "2024-02-14" },
      { id: 11, subject: "Geography", grade: 57, date: "2024-03-20" }
    ],
    average: 59 // Below 65
  },
  {
    id: 105,
    name: 'John Doe',
    email: 'john.doe@example.com',
    address: '123 Main St',
    city: 'New York',
    country: 'USA',
    zip: 10001,
    tests: [
      { id: 101, subject: 'Math', grade: 85, date: '2024-02-01' },
      { id: 102, subject: 'Science', grade: 78, date: '2024-02-10' }
    ],
    average: 81.5
  }
];
