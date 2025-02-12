import { createReducer, on } from '@ngrx/store';
import * as TraineeActions from '../actions/trainee.action';
import { ITrainee } from '../models/trainee.model';

export interface TraineeState {
  trainees: ITrainee[];
}

export const initialState: TraineeState = {
  trainees: []
};

export const traineeReducer = createReducer(
  initialState,
  on(TraineeActions.loadTraineesSuccess, (state, { trainees }) => ({ ...state, trainees })),
  on(TraineeActions.addTrainee, (state, { trainee }) => ({ ...state, trainees: [...state.trainees, trainee] })),
  on(TraineeActions.removeTrainee, (state, { traineeId }) => ({
    ...state,
    trainees: state.trainees.filter(t => t.id !== traineeId)
  })),
  on(TraineeActions.updateTrainee, (state, { trainee }) => ({
    ...state,
    trainees: state.trainees.map(t => (t.id === trainee.id ? trainee : t))
  }))
);
