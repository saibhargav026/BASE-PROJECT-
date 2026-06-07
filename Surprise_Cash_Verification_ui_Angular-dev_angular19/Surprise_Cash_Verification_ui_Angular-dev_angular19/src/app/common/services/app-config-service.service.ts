
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AppConfigServiceService {

  private config: any;

  constructor(private http: HttpClient) { }

  loadConfig(): Observable<any> {
    return this.http.get('assets/config.json');
  }

  setConfig(config: any) {
    this.config = config;
  }

  getConfig(key: string): any {
    const sam = this.config ? this.config[key] : null;
    return sam;
  }
}