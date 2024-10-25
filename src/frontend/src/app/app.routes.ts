import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers/auth.guard';
import { HomeComponent } from './home/home.component';
import { SheetComponent } from './sheet/sheet.component';

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "sheet", component: SheetComponent },
  { path: "login", component: LoginComponent }
  // { path: "**", redirectTo: "" }
];
