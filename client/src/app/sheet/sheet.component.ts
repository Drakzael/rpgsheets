import { Component, OnInit } from '@angular/core';
import { GameMetadata, GameMetadataOverview } from '../_models/gamemetadata';
import { Sheet } from '../_models/sheet';
import { RowComponent } from './row/row.component';
import { CommonModule } from '@angular/common';
import { ViewMode } from '../_models/viewmode';
import { SheetService } from '../_services/sheet.service';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faSave, faCancel, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    FontAwesomeModule
  ],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss'
})
export class SheetComponent implements OnInit {
  sheetId!: string | null;

  metadata?: GameMetadata;
  sheet?: Sheet;
  viewMode!: ViewMode;

  isNewSheet = false;
  games!: GameMetadataOverview[];

  iconSave = faSave;
  iconEdit = faPen;
  iconCancel = faCancel;
  iconDelete = faTrash;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService
  ) {
  }

  get isEdit() {
    return this.viewMode === ViewMode.Edit;
  }

  get isDelete() {
    return this.viewMode === ViewMode.Delete;
  }

  ngOnInit(): void {
    this.sheetId = this.route.snapshot.paramMap.get("sheetId");
    this.route.paramMap.subscribe(() => {
      this.sheetId = this.route.snapshot.paramMap.get("sheetId");
      this.getSheet();
    })
    if (this.sheetId === null) {
      this.prepareNewSheet();
    } else {
      this.getSheet();
    }
  }

  getSheet() {
    if (this.sheetId) {
    this.sheetService.getSheet(this.sheetId!).subscribe(sheet => {
      this.sheet = sheet;
      if (!this.metadata || this.metadata.code !== sheet.game) {
        this.metadata = undefined;
        this.sheetService.getMetadata(sheet.game).subscribe(game => this.metadata = game);
      }
    });
  }
  }

  prepareNewSheet() {
    this.metadata = undefined;
    this.sheet = undefined;
    this.sheetService.listMetadata().subscribe(games => {
      this.games = games;
      this.isNewSheet = true;
    });
  }

  newSheet(game: string) {
    this.sheetService.getMetadata(game).subscribe(metadata => {
      this.metadata = metadata;
      this.sheet = new Sheet();
      this.sheet.game = game;
      this.isNewSheet = false;
      this.viewMode = ViewMode.Edit;
    })
  }

  edit() {
    this.viewMode = ViewMode.Edit;
  }

  save() {
    if (this.sheetId === null) {
      this.sheetService.createSheet(this.sheet!).subscribe(id => {
        this.sheetService.navigateToSheet(id);
      });
    } else {
      this.sheetService.saveSheet(this.sheetId, this.sheet!).subscribe(() => {
        this.sheetService.navigateToSheet(this.sheetId!);
      });
    }
    this.viewMode = ViewMode.View;
  }

  cancel() {
    if (this.sheetId === null) {
      this.sheetService.navigateToNewSheet();
    } else {
      this.sheetService.navigateToSheet(this.sheetId);
    }
    this.viewMode = ViewMode.View;
  }

  delete() {
    if (this.isDelete) {
      this.sheetService.deleteSheet(this.sheetId!).subscribe(() => {
        this.sheetService.navigateToNewSheet();
      });
      this.viewMode = ViewMode.View;
    } else {
      this.viewMode = ViewMode.Delete;
    }
  }
}
