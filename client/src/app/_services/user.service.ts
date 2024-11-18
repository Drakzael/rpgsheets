import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../_models/user";
import { Observable } from "rxjs";

@Injectable({providedIn: "root"})
export class UserService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

  }

  listUsers(): Observable<User[]> {
    return this.http.get<User[]>("/api/users");
  }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(`/api/users/${username}`);
  }

  updateUser(user: User): Observable<void> {
    return this.http.put<void>(`/api/users/${user.username}`, user);
  }

  addUser(user: User): Observable<string> {
    return this.http.post<string>("/api/users", user);
  }

  updatePassword(username: string, oldPassword: string | null, newPassword: string): Observable<void> {
    return this.http.put<void>(`/api/users/${username}/password`, {oldPassword: oldPassword || "", newPassword});
  }

  deleteUser(username: string): Observable<void> {
    return this.http.delete<void>(`/api/users/${username}`);
  }

  navigateToUserList() {
    this.router.navigate(["/users"]);
  }
}