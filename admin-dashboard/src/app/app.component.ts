import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertComponent } from './components/shared/alert/alert.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterModule, AlertComponent]
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}