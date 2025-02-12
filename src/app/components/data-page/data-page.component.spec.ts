import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DataPageComponent } from './data-page.component';
import { loadTrainees, removeTrainee } from '../../actions/trainee.action';

describe('DataPageComponent', () => {
  let component: DataPageComponent;
  let fixture: ComponentFixture<DataPageComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataPageComponent],
      declarations: [DataPageComponent],
      providers: [provideMockStore({ initialState: { trainees: [] } })]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadTrainees on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(loadTrainees());
  });

  it('should dispatch removeTrainee when removing a trainee', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.removeTrainee(1);
    expect(dispatchSpy).toHaveBeenCalledWith(removeTrainee({ traineeId: 1 }));
  });
});
