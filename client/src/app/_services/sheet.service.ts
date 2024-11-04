import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GameMetadata, GameMetadataOverview } from "../_models/gamemetadata";
import { Sheet, SheetOverview } from "../_models/sheet";
import { Router } from "@angular/router";
import { BehaviorSubject, map, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SheetService {

  private sheetsSubject: BehaviorSubject<SheetOverview[]>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.sheetsSubject = new BehaviorSubject<SheetOverview[]>([]);
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

  refreshSheets() {
    return this.http.get<SheetOverview[]>("/api/sheet")
      .subscribe(sheets => {
        this.sheetsSubject.next(sheets);
        return sheets;
      });
  }

  getSheet(id: string) {
    return this.http.get<Sheet>(`/api/sheet/${id}`);
  }

  createSheet(sheet: Sheet) {
    return this.http.post<string>("/api/sheet", sheet)
      .pipe(map(sheetId => {
        this.refreshSheets();
        return sheetId;
      }));
  }

  saveSheet(id: string, sheet: Sheet) {
    return this.http.put<void>(`/api/sheet/${id}`, sheet)
      .pipe(map(() => {
        this.refreshSheets();
        return of();
      }));
  }

  deleteSheet(id: string) {
    return this.http.delete<void>(`/api/sheet/${id}`)
      .pipe(map(() => {
        this.refreshSheets();
        return of();
      }));
  }

  navigateToSheet(id: string) {
    this.router.navigate(["/sheet", id]);
  }

  navigateToNewSheet() {
    this.router.navigate(["/sheet"]);
  }
}