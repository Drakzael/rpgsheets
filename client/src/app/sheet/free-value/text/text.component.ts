import { Component, Input, OnInit } from '@angular/core';
import { Sheet } from '../../../_models/sheet';
import { GameMetadataFreeValue } from '../../../_models/gamemetadata';
import { ViewMode } from '../../../_models/viewmode';
import { CommonModule } from '@angular/common';

let uniqueId = 0;

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './text.component.html',
  styleUrl: './text.component.scss'
})
export class TextComponent implements OnInit {
  @Input() value!: GameMetadataFreeValue;
  @Input() sheet!: Sheet;
  @Input() viewMode!: ViewMode;

  mode = ViewMode;
  rows!: { name: string, index: number }[];
  inputId = `free-text-input-${uniqueId++}`;

  ngOnInit(): void {
    this.rows = this.computeRows();
  }

  get prefix() {
    return `${this.value.prefix}.`;
  }

  computeRows() {
    const rows = this.sheet.getStringsStartingWith(this.prefix)
      .map((value, index) => ({ name: value.key.substring(this.prefix.length), index }));
    if (rows.length < this.value.defaultCount - 1) {
      for (let i = rows.length; i < this.value.defaultCount; ++i) {
        rows.push({ name: "", index: rows.length });
      }
    } else {
      rows.push({ name: "", index: rows.length });
    }
    return rows;
  }

  updateRow(index: number, text: string) {
    if (this.rows[index].name) {
      this.sheet.setString(`${this.prefix}${this.rows[index].name}`, null);
    }
    if (this.sheet.getString(`${this.prefix}${text}`) !== undefined) { // Avoid colision
      text = "";
    }
    if (text) {
      this.sheet.setString(`${this.prefix}${text}`, "");
    }
    this.rows[index].name = text;

    if (text && index === this.rows.length - 1) { // if non empty text on last row, add new row
      this.rows.push({ name: "", index: this.rows.length });
    }
    // remove additionnal rows
    for (let i = this.rows.length - 1; i >= this.value.defaultCount && !this.rows[i].name && !this.rows[i - 1].name; --i) {
      this.rows.pop();
    }
  }
}
