import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountService } from './_services/account.service';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { UserToken } from './_models/user';

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
  user?: UserToken | null;

  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe(user => this.user = user);
  }

  logout() {
    this.accountService.logout();
  }
}
