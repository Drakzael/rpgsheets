import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, map, Observable, of } from "rxjs";
import { Campain } from "../_models/campain";
import { AccountService } from "./account.service";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class CampainService {

  private campainsSubject: BehaviorSubject<Campain[]>;

  constructor(
    private http: HttpClient,
    private accountService: AccountService,
    private router: Router
  ) {
    this.campainsSubject = new BehaviorSubject<Campain[]>([]);
    this.accountService.user.subscribe(user => {
      if (user) {
        this.refreshCampains();
      } else {
        this.campainsSubject.next([]);
      }
    })
  }

  public get campains() {
    return this.campainsSubject.value;
  }

  private refreshCampains() {
    this.http.get<Campain[]>("/api/campain")
      .subscribe(campains => {
        campains.sort((c1, c2) => c1.name.toLowerCase() < c2.name.toLowerCase() ? -1 : 1);
        this.campainsSubject.next(campains);
      })
  }

  getCampain(id: string): Observable<Campain> {
    return this.http.get<Campain>(`/api/campain/${id}`);
  }

  createCampain(campain: Campain): Observable<string> {
    return this.http.post<string>("/api/campain", campain)
      .pipe(map(campainId => {
        this.refreshCampains();
        return campainId;
      }));
  }

  saveCampain(id: string, campain: Campain): Observable<any> {
    return this.http.put<void>(`/api/campain/${id}`, campain)
      .pipe(map(() => {
        this.refreshCampains();
        return of();
      }));
  }

  deleteCampain(id: string): Observable<any> {
    return this.http.delete<void>(`/api/campain/${id}`)
      .pipe(map(() => {
        this.refreshCampains();
        return of();
      }));
  }

  addSheetToCampain(campainId: string, sheetId: string): Observable<any> {
    return this.http.post<void>(`/api/campain/${campainId}/${sheetId}`, {})
      .pipe(map(() => {
        this.refreshCampains();
        return of();
      }));
  }

  removeSheetFromCampain(campainId: string, sheetId: string): Observable<any> {
    return this.http.delete<void>(`/api/campain/${campainId}/${sheetId}`)
      .pipe(map(() => {
        this.refreshCampains();
        return of();
      }));
  }

  navigateToCampain(id: string) {
    this.router.navigate(["/campain", id]);
  }

  navigateToNewCampain() {
    this.router.navigate(["campain/new"]);
  }
}