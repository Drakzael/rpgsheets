import { Component, OnInit } from '@angular/core';
import { SheetService } from '../_services/sheet.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { faUser, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FontAwesomeModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  user?: User | null;
  iconUser = faUser;
  iconLogout = faSignOut;

  get sheets() {
    return this.sheetService.sheets;
  }

  constructor(
    private accountService: AccountService,
    private sheetService: SheetService
  ) {
    this.accountService.user.subscribe(user => this.user = user);
  }

  ngOnInit(): void {
  }

  logout() {
    this.accountService.logout();
  }
}
