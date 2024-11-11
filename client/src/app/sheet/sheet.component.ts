import { Component, OnInit } from '@angular/core';
import { GameMetadata, GameMetadataOverview, GameMetadataRow } from '../_models/gamemetadata';
import { Sheet } from '../_models/sheet';
import { RowComponent } from './row/row.component';
import { CommonModule } from '@angular/common';
import { ViewMode } from '../_models/viewmode';
import { SheetService } from '../_services/sheet.service';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faSave, faCancel, faTrash, faMasksTheater, faDice } from '@fortawesome/free-solid-svg-icons';

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
  viewMode: ViewMode = ViewMode.View;
  mode = ViewMode;

  isNewSheet = false;
  games!: GameMetadataOverview[];

  iconSave = faSave;
  iconEdit = faPen;
  iconCancel = faCancel;
  iconDelete = faTrash;
  iconPlay = faMasksTheater;
  iconDice = faDice;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService
  ) {
  }

  get pages() {
    const pages = [];
    if (this.metadata) {
      let page: GameMetadataRow[] = [];
      pages.push(page);
      for (let row of this.metadata.gridRows) {
        if (row.pageBreak) {
          page = [];
          pages.push(page);
        }
        page.push(row);
      }
    }
    return pages;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.sheetId = this.route.snapshot.paramMap.get("sheetId");
      if (this.sheetId === null) {
        this.prepareNewSheet();
      } else {
        this.getSheet();
      }
    })
  }

  getSheet() {
    if (this.sheetId) {
      this.viewMode = ViewMode.View;
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
        this.sheetId = id;
        this.getSheet();
      });
    } else {
      this.sheetService.saveSheet(this.sheetId, this.sheet!).subscribe(() => {
        this.getSheet();
      });
    }
    this.viewMode = ViewMode.View;
  }

  cancel() {
    if (this.sheetId === null) {
      this.sheetService.navigateToNewSheet();
    } else {
      this.getSheet();
    }
    this.viewMode = ViewMode.View;
  }

  delete() {
    if (this.viewMode === ViewMode.Delete) {
      this.sheetService.deleteSheet(this.sheetId!).subscribe(() => {
        this.sheetService.navigateToNewSheet();
      });
      this.viewMode = ViewMode.View;
    } else {
      this.viewMode = ViewMode.Delete;
    }
  }

  dice() {
    this.viewMode = ViewMode.Dice;
  }

  play() {
    this.viewMode = ViewMode.Play;
  }

  stop() {
    this.viewMode = ViewMode.View;
  }
}
