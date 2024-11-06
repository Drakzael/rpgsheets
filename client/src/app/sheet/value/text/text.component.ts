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

  get isEdit(): boolean {
    return !this.value.readonly && this.viewMode === ViewMode.Edit;
  }

  get text(): string {
    return this.sheet.getString(this.value.value as string);
  }

  get hints(): string[] | undefined {
    return this.value.hint;
  }

  set text(s: string) {
    this.sheet.setString(this.value.value as string, s);
  }

  ngOnInit(): void {
  }

  updateText(s: string) {
    this.text = s;
  }
}
