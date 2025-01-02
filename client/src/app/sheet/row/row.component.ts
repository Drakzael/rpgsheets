import { Component, Input } from '@angular/core';
import { GameMetadata, GameMetadataRow, ValueType } from '../../_models/gamemetadata';
import { ColumnComponent } from '../column/column.component';
import { CommonModule } from '@angular/common';
import { ViewMode } from '../../_models/viewmode';
import { Sheet } from '../../_models/sheet';

@Component({
  selector: 'app-row',
  standalone: true,
  imports: [
    CommonModule,
    ColumnComponent
  ],
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss', './row.component.print.scss']
})
export class RowComponent {
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() row!: GameMetadataRow;
  @Input() defaultType?: ValueType;
  @Input() viewMode!: ViewMode;
}
