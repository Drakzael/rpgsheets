import { Component, Input, OnInit } from '@angular/core';
import { GameMetadata, GameMetadataValue, RowType, ValueType } from '../../_models/gamemetadata';
import { TextComponent } from './text/text.component';
import { DotsComponent } from './dots/dots.component';
import { CommonModule } from '@angular/common';
import { DotsSquaresComponent } from './dots-squares/dots-squares.component';
import { ViewMode } from '../../_models/viewmode';
import { Sheet } from '../../_models/sheet';
import { HealthComponent } from './health/health.component';
import { SquaresComponent } from './squares/squares.component';
import { FreeValueComponent } from '../free-value/free-value.component';
import { NumberComponent } from './number/number.component';

@Component({
  selector: 'app-value',
  standalone: true,
  imports: [
    CommonModule,
    TextComponent,
    NumberComponent,
    DotsComponent,
    SquaresComponent,
    DotsSquaresComponent,
    HealthComponent,
    FreeValueComponent
  ],
  templateUrl: './value.component.html',
  styleUrl: './value.component.scss'
})
export class ValueComponent implements OnInit {
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() value!: GameMetadataValue;
  @Input() defaultType?: ValueType;
  @Input() viewMode!: ViewMode;

  name!: string;
  type?: RowType;
  editorType!: ValueType;
  editorCode!: string;

  ngOnInit(): void {
    this.type = this.value.type || "value";
    this.editorCode = this.value.editor || this.defaultType || "text";
    
    if (["text", "number"].includes(this.editorCode)) {
      this.editorType = this.editorCode;
    } else {
      if (this.metadata.editors![this.editorCode]) {
        this.editorType = this.metadata.editors![this.editorCode].type;
      } else {
        console.warn(`Couldn't find editor ${this.editorCode}`);
      }
    }

    const onChange = (() => {
      if (this.value.nameExpr) {
        this.name = this.sheet.resolve(this.value.nameExpr);
      } else {
        this.name = this.value.name!;
      }
    }).bind(this);
    this.sheet.listenChange(onChange);
    onChange();
  }
}
