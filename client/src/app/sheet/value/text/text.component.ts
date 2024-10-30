import { Component, Input, OnInit } from '@angular/core';
import { GameMetadataValue } from '../../../_models/gamemetadata';
import { ViewMode } from '../../../_models/viewmode';
import { Sheet } from '../../../_models/sheet';
import { CommonModule } from '@angular/common';

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

  edit!: boolean;

  get text(): string {
    return this.sheet.stringValues[this.value.value as string];
  }

  set text(s: string) {
    this.sheet.stringValues[this.value.value as string] = s;
  }

  ngOnInit(): void {
    this.edit = !this.value.readonly && this.viewMode === ViewMode.Edit;
  }

  updateText(s: string) {
    this.text = s;
  }
}
