import { ITestResult } from "./testResult.model";

export interface ITrainee {
    id: number;
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    zip: number;
    tests: ITestResult[];
    average: number;
}
  