import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Alert {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  id?: number;
  autoClose?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new BehaviorSubject<Alert[]>([]);
  private defaultId = 1;

  alerts$: Observable<Alert[]> = this.subject.asObservable();

  success(message: string, autoClose = true): void {
    this.alert({ type: 'success', message, autoClose });
  }

  info(message: string, autoClose = true): void {
    this.alert({ type: 'info', message, autoClose });
  }

  warning(message: string, autoClose = true): void {
    this.alert({ type: 'warning', message, autoClose });
  }

  error(message: string, autoClose = true): void {
    this.alert({ type: 'error', message, autoClose });
  }

  alert(alert: Alert): void {
    alert.id = alert.id || this.defaultId++;
    
    if (alert.autoClose !== false) {
      setTimeout(() => this.removeAlert(alert), 5000);
    }
    
    this.subject.next([...this.subject.value, alert]);
  }

  removeAlert(alert: Alert): void {
    const alerts = this.subject.value.filter(x => x.id !== alert.id);
    this.subject.next(alerts);
  }

  clearAlerts(): void {
    this.subject.next([]);
  }
}