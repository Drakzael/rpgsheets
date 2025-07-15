import { Component, Input, OnInit } from '@angular/core';
import { GameMetadata, GameMetadataEditor, GameMetadataValue } from '../../../_models/gamemetadata';
import { ViewMode } from '../../../_models/viewmode';
import { Sheet } from '../../../_models/sheet';
import { CommonModule } from '@angular/common';
import { format } from '../../../_models/text';

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
  @Input() value!: GameMetadataValue;
  @Input() sheet!: Sheet;
  @Input() viewMode!: ViewMode;
  @Input() editorCode!: string;
  @Input() metadata!: GameMetadata;
  editor!: GameMetadataEditor;
  
  inputId?: string;
  mode = ViewMode;
  rowCount?: number;
  multiline = false; 
  formattedText?: string;
  isCharacterName!: boolean;

  get isEdit(): boolean {
    return !this.value.readonly && this.viewMode === ViewMode.Edit;
  }

  get text(): string {
    return this.sheet.getString(this.value.value);
  }

  get hints(): string[] | undefined {
    return this.value.hint;
  }

  set text(s: string) {
    this.sheet.setString(this.value.value, s);
    if (this.multiline) {
      this.formattedText = format(s);
    }
  }

  ngOnInit(): void {
    this.editor = this.metadata.editors![this.editorCode];
    if (this.value.hint) {
      this.inputId = `text-input-${uniqueId++}`;
    }
    this.multiline = Boolean(this.value.defaultCount) || Boolean(this.editor?.max) || false;
    this.rowCount = this.value.defaultCount || this.editor?.max;
    if (this.multiline) {
      this.formattedText = format(this.text);
    }
    this.isCharacterName = this.sheet.isCharacterName(this.value.value);
  }

  updateText(s: string) {
    this.text = s;
  }
}
