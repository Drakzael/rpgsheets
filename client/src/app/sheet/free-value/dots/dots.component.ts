import { Component, Input, OnInit } from '@angular/core';
import { GameMetadata, GameMetadataEditor, GameMetadataFreeValue } from '../../../_models/gamemetadata';
import { Sheet } from '../../../_models/sheet';
import { ViewMode } from '../../../_models/viewmode';
import { CommonModule } from '@angular/common';
import { faCircle as faCircleFull } from '@fortawesome/free-solid-svg-icons';
import { faCircle as faCircleEmpty } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

let uniqueId = 0;

@Component({
  selector: 'app-dots',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './dots.component.html',
  styleUrl: './dots.component.scss'
})
export class DotsComponent implements OnInit {
  @Input() value!: GameMetadataFreeValue;
  @Input() editorCode!: string;
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() viewMode!: ViewMode;
  mode = ViewMode;

  iconDotFill = faCircleFull;
  iconDotEmpty = faCircleEmpty;

  editor!: GameMetadataEditor;
  rows!: { name: string, index: number, value: number }[];
  max!: number;
  inputId = `free-dot-input-${uniqueId++}`;
  hints?: string[];

  ngOnInit(): void {
    this.editor = this.metadata.editors![this.editorCode];
    this.rows = this.computeRows();

    const onChange = (() => {
      if (this.editor.maxExpr) {
        this.max = this.sheet.resolve(this.editor.maxExpr);
      } else {
        this.max = this.editor.max!;
      }

    }).bind(this);
    this.sheet.listenChange(onChange);
    onChange();
    this.updateHint();
  }

  get prefix() {
    return `${this.value.prefix}.`;
  }

  get values(): number[] {
    return Array(this.max).fill(0).map((_, i) => i + 1);
  }

  computeRows() {
    const rows = this.sheet.getNumbersStartingWith(this.prefix)
      .map((value, index) => ({ name: value.key.substring(this.prefix.length), index, value: value.value }));
    if (rows.length < this.value.defaultCount - 1) {
      for (let i = rows.length; i < this.value.defaultCount; ++i) {
        rows.push({ name: "", index: rows.length, value: 0 });
      }
    } else {
      rows.push({ name: "", index: rows.length, value: 0 });
    }
    return rows;
  }

  updateRow(index: number, text: string) {
    if (this.rows[index].name) {
      this.sheet.setNumber(`${this.prefix}${this.rows[index].name}`, null);
    }
    if (this.sheet.getNumber(`${this.prefix}${text}`) !== undefined) { // Avoid colision
      text = "";
    }
    if (text) {
      this.sheet.setNumber(`${this.prefix}${text}`, this.rows[index].value);
    } else {
      this.rows[index].value = 0;
    }
    this.rows[index].name = text;

    if (text && index === this.rows.length - 1) { // if non empty text on last row, add new row
      this.rows.push({ name: "", index: this.rows.length, value: 0 });
    }
    // remove additionnal rows
    for (let i = this.rows.length - 1; i >= this.value.defaultCount && !this.rows[i].name && !this.rows[i - 1].name; --i) {
      this.rows.pop();
    }
    this.updateHint();
  }

  updateHint() {
    if (this.value.hint) {
      this.hints = this.value.hint.filter(hint => !this.rows.find(row => row.name === hint));
    }
  }

  clickDot(index: number, value: number) {
    if (this.viewMode === ViewMode.Edit ||
      this.viewMode === ViewMode.Play && this.editor.freeEdit) {
      if (value === this.rows[index].value) {
        value = this.rows[index].value - 1;
      }
      this.rows[index].value = value;
      this.sheet.setNumber(`${this.prefix}${this.rows[index].name}`, value);
    }
  }
}
