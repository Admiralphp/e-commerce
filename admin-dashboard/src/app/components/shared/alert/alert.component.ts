import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService, Alert } from '../../../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  subscription!: Subscription;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.subscription = this.alertService.alerts$
      .subscribe(alerts => {
        this.alerts = alerts;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeAlert(alert: Alert): void {
    this.alertService.removeAlert(alert);
  }

  cssClass(alert: Alert): string {
    const classes = ['alert'];
    
    const alertTypeClass = {
      success: 'alert-success',
      error: 'alert-danger',
      info: 'alert-info',
      warning: 'alert-warning'
    };
    
    classes.push(alertTypeClass[alert.type]);
    
    return classes.join(' ');
  }
}