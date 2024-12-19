import { Component, OnInit } from '@angular/core';
import { GameMetadata, GameMetadataOverview, GameMetadataRow } from '../_models/gamemetadata';
import { Sheet } from '../_models/sheet';
import { RowComponent } from './row/row.component';
import { CommonModule } from '@angular/common';
import { ViewMode } from '../_models/viewmode';
import { SheetService } from '../_services/sheet.service';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faSave, faCancel, faTrash, faMasksTheater, faDice, faPlus, faImage } from '@fortawesome/free-solid-svg-icons';
import { CampainComponent } from './campain/campain.component';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    FontAwesomeModule,
    CampainComponent
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

  isCampain = false;

  iconSave = faSave;
  iconEdit = faPen;
  iconCancel = faCancel;
  iconDelete = faTrash;
  iconPlay = faMasksTheater;
  iconDice = faDice;
  iconCampain = faImage;
  iconAdd = faPlus;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private accountService: AccountService
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
    this.sheetService.listMetadata().subscribe(games => {
      this.games = games;
    });
  }

  get isCreation() {
    return this.sheetId === null;
  }

  getSheet() {
    this.sheet = undefined;
    if (this.sheetId) {
      this.viewMode = ViewMode.View;
      this.isCampain = false;
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
    this.isCampain = false;
    this.isNewSheet = true;
    this.getPages();
  }

  newSheet(game: string) {
    this.sheetService.getMetadata(game).subscribe(metadata => {
      this.metadata = metadata;
      this.sheet = new Sheet();
      this.sheet.game = game;
      this.sheet.playerName = this.accountService.userValue?.alias || this.accountService.userValue?.username || "";
      this.isNewSheet = false;
      this.getPages();
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
          this.sheetService.navigateToSheet(id);
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

  campain() {
    this.isCampain = !this.isCampain;
  }

  changeTemplate(game: string) {
    this.sheet!.game = game;
    this.sheetService.getMetadata(game).subscribe(metadata => {
      this.metadata = metadata;
      if (!this.metadata.modes || !this.metadata.modes.length) {
        this.sheet!.mode = "";
      } else if (!this.metadata.modes.map(mode => mode.code).includes(this.sheet!.mode!)) {
        this.sheet!.mode = this.metadata.modes[0].code;
      }
      this.getPages();
    })
  }

  changeMode(mode: string) {
    this.sheet!.mode = mode;
    this.getPages();
  }
}
