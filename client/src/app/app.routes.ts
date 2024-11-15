import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers/auth.guard';
import { HomeComponent } from './home/home.component';
import { SheetComponent } from './sheet/sheet.component';
import { CampainComponent } from './campain/campain.component';
import { UserComponent } from './user/user.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "",
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "sheet/new", component: SheetComponent },
      { path: "sheet/:sheetId", component: SheetComponent },
      { path: "campain/new", component: CampainComponent },
      { path: "campain/:campainId", component: CampainComponent },
      // { path: "user/me", component: UserComponent, data: { username: } },
      { path: "users", component: UsersComponent },
      { path: "user/new", component: UserComponent },
      { path: "user/:username", component: UserComponent }
    ]
  }
];
