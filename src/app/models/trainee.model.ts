import { ITestResult } from "./testResult.model";

export interface ITrainee {
    id: number;
    name: string;
    tests: ITestResult[];
}
  