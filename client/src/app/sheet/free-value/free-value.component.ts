import { Component, Input } from '@angular/core';
import { GameMetadata, GameMetadataFreeValue, ValueType } from '../../_models/gamemetadata';
import { Sheet } from '../../_models/sheet';
import { ViewMode } from '../../_models/viewmode';
import { CommonModule } from '@angular/common';
import { TextComponent } from './text/text.component';
import { DotsComponent } from './dots/dots.component';

@Component({
  selector: 'app-free-value',
  standalone: true,
  imports: [
    CommonModule,
    TextComponent,
    DotsComponent
  ],
  templateUrl: './free-value.component.html',
  styleUrl: './free-value.component.scss'
})
export class FreeValueComponent {
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() value!: GameMetadataFreeValue;
  @Input() viewMode!: ViewMode;
  @Input() defaultType?: ValueType;

  get editorType() {
    let valueType: string = this.value.type || this.defaultType || "text";
    if (valueType === "text") {
      return "text";
    } else if (valueType === "number") {
      return "number";
    } else {
      return this.metadata.editors![valueType].type;
    }
  }

  get editor() {
    return this.value.type || this.defaultType || "";
  }
}
