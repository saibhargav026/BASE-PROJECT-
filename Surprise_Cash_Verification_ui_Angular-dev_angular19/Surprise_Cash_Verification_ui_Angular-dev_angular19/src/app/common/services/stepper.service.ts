import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StepperService {
  private stepChangeSubject = new BehaviorSubject<number>(0);
  stepChange$ = this.stepChangeSubject.asObservable();

  changeStep(index: number) {
    debugger;
    this.stepChangeSubject.next(index);
  }
  constructor() { }
}
