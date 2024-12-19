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
import { StateComponent } from '../state/state.component';

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
    FreeValueComponent,
    StateComponent
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
  @Input() rows?: GameMetadataValue[];

  name!: string;
  type?: RowType;
  editorType!: ValueType;
  editorCode!: string;
  mode: boolean = true;

  ngOnInit(): void {
    this.type = this.value.type || "value";
    this.editorCode = this.value.editor || this.defaultType || "text";

    if (["text", "longText", "number"].includes(this.editorCode)) {
      this.editorType = this.editorCode;
    } else {
      if (this.metadata.editors![this.editorCode]) {
        this.editorType = this.metadata.editors![this.editorCode].type;
      } else {
        console.warn(`Couldn't find editor ${this.editorCode}`);
      }
    }
    if (this.type === "value") {
      if (!this.sheet.mode || !this.value.mode || this.value.mode.includes(this.sheet.mode)) {
        this.mode = true;
      } else {
        if (["number", "dots", "squares"].includes(this.editorType)) {
          this.mode = this.sheet.getNumber(this.value.value) != undefined;
        } else if (["dots_squares"].includes(this.editorType)) {
          this.mode = this.value.values.map(value => this.sheet.getNumber(value)).filter(value => value !== undefined).length > 0;
        } else if (["text"].includes(this.editorType)) {
          this.mode = this.sheet.getString(this.value.value) != undefined;
        }
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
