import { Component, OnInit } from '@angular/core';
import { GameMetadata, GameMetadataOverview, GameMetadataRow } from '../_models/gamemetadata';
import { Sheet } from '../_models/sheet';
import { RowComponent } from './row/row.component';
import { CommonModule } from '@angular/common';
import { ViewMode } from '../_models/viewmode';
import { SheetService } from '../_services/sheet.service';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faSave, faCancel, faTrash, faMasksTheater, faDice, faGear, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ConfigurationComponent } from './configuration/configuration.component';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    FontAwesomeModule,
    ConfigurationComponent
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

  isConfig = false;

  iconSave = faSave;
  iconEdit = faPen;
  iconCancel = faCancel;
  iconDelete = faTrash;
  iconPlay = faMasksTheater;
  iconDice = faDice;
  iconConfig = faGear;
  iconAdd = faPlus;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService
  ) {
  }

  pages!: { rows: GameMetadataRow[], pageNum: number }[];
  
  private getPages() {
    this.pages = [];
    if (this.metadata) {
      let page: GameMetadataRow[] = [];
      let i = 0;
      this.pages.push({ rows: page, pageNum: i });
      for (let row of this.metadata.gridRows) {
        if (row.pageBreak) {
          page = [];
          this.pages.push({ rows: page, pageNum: ++i });
        }
        page.push(row);
      }
    }
    return this.pages;
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

  get isCreation() {
    return this.sheetId === null;
  }

  getSheet() {
    if (this.sheetId) {
      this.viewMode = ViewMode.View;
      this.isConfig = false;
      this.sheetService.getSheet(this.sheetId!).subscribe(sheet => {
        this.sheet = sheet;
        if (!this.metadata || this.metadata.code !== sheet.game) {
          this.metadata = undefined;
          this.sheetService.getMetadata(sheet.game).subscribe(game => {
            this.metadata = game;
            this.getPages();
          });
        }
      });
    }
  }

  prepareNewSheet() {
    this.metadata = undefined;
    this.sheet = undefined;
    this.isConfig = false;
    this.sheetService.listMetadata().subscribe(games => {
      this.games = games;
      this.isNewSheet = true;
      this.getPages();
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
    if (this.sheet?.writable) {
      this.viewMode = ViewMode.Edit;
    }
  }

  save() {
    if (this.sheet?.writable) {
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
    if (this.sheet?.deletable) {
      if (this.viewMode === ViewMode.Delete) {
        this.sheetService.deleteSheet(this.sheetId!).subscribe(() => {
          this.sheetService.navigateToNewSheet();
        });
        this.viewMode = ViewMode.View;
      } else {
        this.viewMode = ViewMode.Delete;
      }
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

  config() {
    this.isConfig = !this.isConfig;
  }
}
