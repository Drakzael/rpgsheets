import { Component, Input } from '@angular/core';
import { GameMetadata, GameMetadataFreeValue } from '../../_models/gamemetadata';
import { Sheet } from '../../_models/sheet';
import { ViewMode } from '../../_models/viewmode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-free-value',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './free-value.component.html',
  styleUrl: './free-value.component.scss'
})
export class FreeValueComponent {
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() value!: GameMetadataFreeValue;
  @Input() viewMode!: ViewMode;

  get prefix() {
    return `${this.value.prefix}.`;
  }

  get rows() {
    const rows = this.sheet.getNumbersStartingWith(this.prefix)
      .map(value => ({ name: value.key.substring(this.prefix.length), value: value.value }));
    if (rows.length < this.value.defaultCount - 1) {
      for (let i = rows.length; i < this.value.defaultCount; ++i) {
        rows.push({ name: "", value: 0 });
      }
    } else {
      rows.push({ name: "", value: 0 });
    }
    return rows;
  }
}
