import { Component, OnInit } from '@angular/core';
import { GameMetadata } from '../_models/gamemetadata';
import { Sheet } from '../_models/sheet';
import { werewolfApocalypse } from '../_mock/werewolf.apocalypse';
import { RowComponent } from './row/row.component';
import { CommonModule } from '@angular/common';
import { ViewMode } from '../_models/viewmode';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent
  ],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss'
})
export class SheetComponent implements OnInit {
  metadata!: GameMetadata;
  sheet!: Sheet;
  viewMode!: ViewMode;

  ngOnInit(): void {
    // mockup;
    this.metadata = werewolfApocalypse;
    this.sheet = new Sheet();
    this.sheet.game = this.metadata.code;
    this.viewMode = ViewMode.Edit;
  }
}
