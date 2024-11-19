import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GameMetadata, GameMetadataOverview } from "../_models/gamemetadata";
import { Sheet, SheetData, SheetOverview } from "../_models/sheet";
import { Router } from "@angular/router";
import { BehaviorSubject, map, Observable, of } from "rxjs";
import { AccountService } from "./account.service";

@Injectable({ providedIn: 'root' })
export class SheetService {

  private sheetsSubject: BehaviorSubject<SheetOverview[]>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private accountService: AccountService
  ) {
    this.sheetsSubject = new BehaviorSubject<SheetOverview[]>([]);
    this.accountService.user.subscribe(user => {
      if (user) {
        this.refreshSheets();
      } else {
        this.sheetsSubject.next([]);
      }
    })
  }

  public get sheets() {
    return this.sheetsSubject.value;
  }

  getMetadata(game: string) {
    return this.http.get<GameMetadata>(`/api/metadata/${game}`);
  }

  listMetadata() {
    return this.http.get<GameMetadataOverview[]>("/api/metadata");
  }

  private refreshSheets() {
    this.http.get<SheetOverview[]>("/api/sheet")
      .subscribe(sheets => {
        sheets.sort((s1, s2) => s1.name.toLowerCase() < s2.name.toLowerCase() ? -1 : 1);
        this.sheetsSubject.next(sheets);
      });
  }

  getSheet(id: string): Observable<Sheet> {
    return this.http.get<SheetData>(`/api/sheet/${id}`)
      .pipe(map(sheet => new Sheet(sheet)));
  }

  createSheet(sheet: Sheet): Observable<string> {
    return this.http.post("/api/sheet", sheet.getData(), { responseType: 'text' })
      .pipe(map(sheetId => {
        this.refreshSheets();
        return sheetId;
      }));
  }

  saveSheet(id: string, sheet: Sheet): Observable<void> {
    return this.http.put<void>(`/api/sheet/${id}`, sheet.getData())
      .pipe(map(() => {
        this.refreshSheets();
        return ;
      }));
  }

  deleteSheet(id: string): Observable<void> {
    return this.http.delete<void>(`/api/sheet/${id}`)
      .pipe(map(() => {
        this.refreshSheets();
        return ;
      }));
  }

  navigateToSheet(id: string) {
    this.router.navigate(["/sheet", id]);
  }

  navigateToNewSheet() {
    this.router.navigate(["/sheet/new"]);
  }
}
