import { Component, Input, OnInit } from '@angular/core';
import { GameMetadataValue } from '../../../_models/gamemetadata';
import { ViewMode } from '../../../_models/viewmode';
import { Sheet } from '../../../_models/sheet';
import { CommonModule } from '@angular/common';
import * as ts from "typescript";
import { ValueResolver } from '../../../_helpers/resolver.value';

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
  @Input() value!: GameMetadataValue;
  @Input() sheet!: Sheet;
  @Input() viewMode!: ViewMode;

  get isEdit(): boolean {
    return !this.value.readonly && this.viewMode === ViewMode.Edit;
  }

  get text(): string {
    const value = this.value.value as string;
    if (value.startsWith("$")) {
      return new ValueResolver(this.sheet).resolve(value);
    } else {
      return this.sheet.stringValues[value];
    }
  }

  get hints(): string[] | undefined {
    return this.value.hint;
  }

  set text(s: string) {
    if (this.value.value === "$sheet.name") {
      this.sheet.name = s;
    } else {
      this.sheet.stringValues[this.value.value as string] = s;
    }
  }

  ngOnInit(): void {
  }

  updateText(s: string) {
    this.text = s;
  }
}
