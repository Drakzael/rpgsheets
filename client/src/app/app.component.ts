import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rpgsheets';
  user?: User | null;

  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe(user => this.user = user);
  }

  logout() {
    this.accountService.logout();
  }
}
