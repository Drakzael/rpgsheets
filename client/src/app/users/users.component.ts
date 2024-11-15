import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  users!: User[]

  constructor(
    private userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.userService.listUsers()
    .subscribe(users => {
      this.users = users;
    })
  }
}
