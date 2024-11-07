import { Component, Input, OnInit } from '@angular/core';
import { GameMetadata, GameMetadataEditor, GameMetadataValue } from '../../../_models/gamemetadata';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faCircle as faCircleFull } from "@fortawesome/free-solid-svg-icons";
import { faCircle as faCircleEmpty } from "@fortawesome/free-regular-svg-icons";
import { Sheet } from '../../../_models/sheet';
import { CommonModule } from '@angular/common';
import { ViewMode } from '../../../_models/viewmode';

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
  @Input() value!: GameMetadataValue;
  @Input() editorCode!: string;
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() viewMode!: ViewMode;
  mode = ViewMode;

  iconDotFill = faCircleFull;
  iconDotEmpty = faCircleEmpty;

  editor!: GameMetadataEditor;

  private valueCode!: string;

  get values(): number[] {
    return Array(this.max).fill(0).map((_, i) => i + 1);
  }

  ngOnInit(): void {
    this.editor = this.metadata.editors![this.editorCode];
    this.valueCode = this.value.value as string;

    const onChange = (() => {
      if (this.editor.maxExpr) {
        this.max = this.sheet.resolve(this.editor.maxExpr);
      } else {
        this.max = this.editor.max!;
      }

    }).bind(this);
    this.sheet.listenChange(onChange);
    onChange();
  }

  get isEdit(): boolean {
    return this.viewMode === ViewMode.Edit;
  }

  get score(): number {
    return this.sheet.getNumber(this.valueCode) || this.editor.min || 0;
  }

  set score(i: number) {
    this.sheet.setNumber(this.valueCode, Math.max(this.editor.min || 0, i));
  }

  max!: number;

  clickDot(i: number) {
    if (this.viewMode === ViewMode.Edit ||
      this.viewMode === ViewMode.Play && this.editor.freeEdit) {
      if (i === this.score) {
        i = this.score - 1;
      }
      this.score = i;
    }
  }
}
