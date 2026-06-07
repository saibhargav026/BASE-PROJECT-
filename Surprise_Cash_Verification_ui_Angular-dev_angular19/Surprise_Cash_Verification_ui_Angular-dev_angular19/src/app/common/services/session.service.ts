import { Injectable } from '@angular/core';
import { min } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private router: Router) { }

  private sessionIdkey = 'session_id';

  generateSessionId(length: number): string {
    //return 'xxxx-xxxx-xxxx-xxxx'
    let sessionId = '';
    for (let i = 0; i < length; i++) {
      sessionId += (this.getRandomNumber(1, 100) * 10).toString();
    }
    //const randomHex = Math.floor(Math.random() * 16).toString(16);
    return sessionId;

  }

  setSessionId(length: number = 10): void {
    const sessionId = this.generateSessionId(length);
    sessionStorage.setItem(this.sessionIdkey, sessionId)
  }

  getSessionId(): string | null {
    return sessionStorage.getItem(this.sessionIdkey);
  }

  clearSession(): void {
    sessionStorage.removeItem(this.sessionIdkey);
    this.router.navigate(['/']);
  }

  getRandomNumber(min: number, max: number): number {
    const timestamp = new Date().getTime();
    const randomValue = (timestamp % (max - min + 1)) + min;
    return randomValue;
  }
}
