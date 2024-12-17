import { BehaviorSubject, map, Observable } from "rxjs";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User, UserToken } from "../_models/user";

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject: BehaviorSubject<UserToken | null>;
  public user: Observable<UserToken | null>;
  private meSubject: BehaviorSubject<User | null>;
  public me: Observable<User | null>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem("user")!));
    this.user = this.userSubject.asObservable();
    this.meSubject = new BehaviorSubject<User | null>(null);
    this.me = this.meSubject.asObservable();
    // if (this.userValue) {
    //   this.getUserMe();
    // }
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<UserToken>("/api/auth", { username, password })
      .pipe(map(user => {
        localStorage.setItem("user", JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }))
      .pipe(map(user => {
        this.refreshMe();
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.meSubject.next(null);
    this.router.navigate(["/login"]);
  }

  refreshMe(): void {
    this.http.get<User>("/api/auth").subscribe(me => this.meSubject.next(me));
  }
}