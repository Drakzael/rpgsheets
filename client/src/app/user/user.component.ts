import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Role, User, UserToken } from '../_models/user';
import { UserService } from '../_services/user.service';
import { CommonModule } from '@angular/common';
import { faCancel, faPen, faSave, faTrash, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccountService } from '../_services/account.service';

enum ViewMode {
  View,
  Password,
  Edit,
  Delete
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLink
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  username!: string | null;
  user!: User;
  me!: User;
  viewMode: ViewMode = ViewMode.View;
  roles = [Role.Admin];
  mode = ViewMode;

  iconSave = faSave;
  iconEdit = faPen;
  iconCancel = faCancel;
  iconDelete = faTrash;
  iconUsers = faUsers;
  password = {
    oldPassword: "",
    newPassword1: "",
    newPassword2: ""
  };

  noErrors = {
    username: "",
    password: ""
  }
  errors!: { username: string, password: string };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private accountService: AccountService
  ) {
  }

  ngOnInit(): void {
    this.clearErrors();
    this.accountService.me.subscribe(me => this.me = me!);
    this.route.paramMap.subscribe(() => {
      this.username = this.route.snapshot.paramMap.get("username");
      this.getUser();
    });
    if (this.isCreation) {
      this.viewMode = ViewMode.Edit;
    }
  }

  clearErrors() {
    this.errors = Object.assign({}, this.noErrors);
  }

  get isAdmin(): boolean {
    return this.me?.roles?.includes(Role.Admin) || false;
  }

  get isMe(): boolean {
    return !!this.username && (this.user?.username === this.me?.username);
  }

  updateRole(role: Role, value: boolean) {
    if (value) {
      this.user.roles.push(role);
    } else {
      this.user.roles = this.user.roles.filter(r => r !== role);
    }
  }

  get isCreation(): boolean {
    return !this.username;
  }

  getUser() {
    if (this.username === null) {
      this.user = new User();
    } else {
      this.userService.getUser(this.username)
        .subscribe(user => {
          this.user = user;
        })
    }
  }

  changePassword(passwordType: string, password: string) {
    switch (passwordType) {
      case "old":
        this.password.oldPassword = password;
        break;
      case "new1":
        this.password.newPassword1 = password;
        break;
      case "new2":
        this.password.newPassword2 = password;
        break;
    }
  }

  edit() {
    this.viewMode = ViewMode.Edit;
  }

  save() {
    if (this.isCreation) {
      if (this.password.newPassword1 && this.password.newPassword1 === this.password.newPassword2) {
        if (!this.user.username) {
          this.errors.username = "Le champ ne doit pas etre vide.";
          return;
        }
        if (this.user.username.length < 4) {
          this.errors.username = "La longueur du champs doit etre au moins de 4";
          return;
        }
        this.userService.addUser(this.user!).subscribe(username => {
          this.userService.updatePassword(username, null, this.password.newPassword1).subscribe(() => {
            this.username = username;
            this.getUser();
            this.viewMode = ViewMode.View;
          })
        });
      }
    } else {
      this.userService.updateUser(this.user!).subscribe(() => {
        this.getUser();
        this.viewMode = ViewMode.View;
      })
    }
  }

  cancel() {
    if (this.isCreation) {
      this.userService.navigateToUserList();
    } else {
      this.getUser();
      this.viewMode = ViewMode.View;
    }
  }

  delete() {
    if (this.viewMode === ViewMode.Delete) {
      this.viewMode = ViewMode.View;
      this.userService.deleteUser(this.username!).subscribe(() => {
        this.userService.navigateToUserList();
      })
    } else {
      this.viewMode = ViewMode.Delete;
    }
  }

  updatePassword() {
    if (this.password.newPassword1 && this.password.newPassword1 === this.password.newPassword2) {
      this.userService.updatePassword(this.username!, this.isMe ? this.password.oldPassword : null, this.password.newPassword1)
        .subscribe();
    }
  }
}
