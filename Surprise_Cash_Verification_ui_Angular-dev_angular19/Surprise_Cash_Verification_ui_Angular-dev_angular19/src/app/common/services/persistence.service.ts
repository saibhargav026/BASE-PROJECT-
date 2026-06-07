import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PersistenceService {

    constructor() { }

    setLocalStorage(key: string, data: any): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    removeLocalStorage(key: string) {
        localStorage.removeItem(key);
    }

    getLocalStorage(key: string) {
        //return JSON.parse(localStorage.getItem(key));
    }

    setSessionStorage(key: string, data: any): void {
        sessionStorage.setItem(key, JSON.stringify(data));
    }

    removeSessionStorage(key: string) {
        sessionStorage.removeItem(key);
    }

    getSessionStorage(key: string) {

        return JSON.parse(sessionStorage.getItem(key) || '{}');
    }
}
