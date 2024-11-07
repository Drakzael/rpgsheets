import { Component, Input } from '@angular/core';
import { GameMetadata, GameMetadataValue, ValueType } from '../../_models/gamemetadata';
import { TextComponent } from './text/text.component';
import { DotsComponent } from './dots/dots.component';
import { CommonModule } from '@angular/common';
import { DotsSquaresComponent } from './dots-squares/dots-squares.component';
import { ViewMode } from '../../_models/viewmode';
import { Sheet } from '../../_models/sheet';
import { HealthComponent } from './health/health.component';
import { SquaresComponent } from './squares/squares.component';

@Component({
  selector: 'app-value',
  standalone: true,
  imports: [
    CommonModule,
    TextComponent,
    DotsComponent,
    SquaresComponent,
    DotsSquaresComponent,
    HealthComponent
  ],
  templateUrl: './value.component.html',
  styleUrl: './value.component.scss'
})
export class ValueComponent {
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() value!: GameMetadataValue;
  @Input() defaultType?: ValueType;
  @Input() viewMode!: ViewMode;

  get editorType() {
    let valueType: string = this.value.type || this.defaultType || "text";
    if (["text", "number", "title"].includes(valueType)) {
      return valueType;
    } else {
      return this.metadata.editors![valueType].type;
    }
  }

  get editor() {
    return this.value.type || this.defaultType || "";
  }
}
