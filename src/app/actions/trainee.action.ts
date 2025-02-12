import { createAction, props } from '@ngrx/store';
import { ITrainee } from '../models/trainee.model';


export const loadTrainees = createAction('[Trainee] Load Trainees');
export const loadTraineesSuccess = createAction('[Trainee] Load Trainees Success', props<{ trainees: ITrainee[] }>());
export const addTrainee = createAction('[Trainee] Add Trainee', props<{ trainee: ITrainee }>());
export const removeTrainee = createAction('[Trainee] Remove Trainee', props<{ traineeId: number }>());
export const updateTrainee = createAction('[Trainee] Update Trainee', props<{ trainee: ITrainee }>());
