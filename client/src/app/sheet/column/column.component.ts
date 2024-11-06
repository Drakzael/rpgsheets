import { Component, Input, OnInit } from '@angular/core';
import { GameMetadata, GameMetadataColumn, ValueType } from '../../_models/gamemetadata';
import { RowComponent } from '../row/row.component';
import { CommonModule } from '@angular/common';
import { ValueComponent } from '../value/value.component';
import { ViewMode } from '../../_models/viewmode';
import { Sheet } from '../../_models/sheet';
import { FreeValueComponent } from '../value/free-value.component';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    ValueComponent,
    FreeValueComponent
  ],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss'
})
export class ColumnComponent implements OnInit {
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() column!: GameMetadataColumn;
  @Input() defaultType?: ValueType;
  @Input() viewMode!: ViewMode;

  ngOnInit(): void {
  }
}
