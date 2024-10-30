import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GameMetadata, GameMetadataOverview } from "../_models/gamemetadata";
import { Sheet, SheetOverview } from "../_models/sheet";

@Injectable({ providedIn: 'root' })
export class SheetService {
  constructor(
    private http: HttpClient
  ) {

  }

  getMetadata(game: string) {
    return this.http.get<GameMetadata>(`/api/metadata/${game}`);
  }

  listMetadata() {
    return this.http.get<GameMetadataOverview[]>("/api/metadata");
  }

  listSheets() {
    return this.http.get<SheetOverview[]>("/api/sheet");
  }

  getSheet(id: string) {
    return this.http.get<Sheet>(`/api/sheet/${id}`); 
  }

  createSheet(sheet: Sheet) {
    return this.http.put<string>("/api/sheet", sheet);
  }

  saveSheet(id: string, sheet: Sheet) {
    return this.http.post<void>(`/api/sheet/${id}`, sheet);
  }

  deleteSheet(id: string) {
    return this.http.delete<void>(`/api/sheet/${id}`);
  }
}