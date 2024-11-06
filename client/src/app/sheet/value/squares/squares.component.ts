import { Component, Input } from '@angular/core';
import { GameMetadata, GameMetadataEditor, GameMetadataValue } from '../../../_models/gamemetadata';
import { Sheet } from '../../../_models/sheet';
import { ViewMode } from '../../../_models/viewmode';
import { faSquare as faSquareEmpty, faSquareCheck as faSquareFull } from "@fortawesome/free-regular-svg-icons";
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-squares',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './squares.component.html',
  styleUrl: './squares.component.scss'
})
export class SquaresComponent {
  @Input() value!: GameMetadataValue;
  @Input() editorCode!: string;
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() viewMode!: ViewMode;

  iconSquareFill = faSquareFull;
  iconSquareEmpty = faSquareEmpty;

  editor!: GameMetadataEditor;

  private valueCode!: string;

  get values(): number[] {
    return Array(this.max).fill(0).map((_, i) => i + 1);
  }

  ngOnInit(): void {
    this.editor = this.metadata.editors![this.editorCode];
    this.valueCode = this.value.value as string;
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

  get max(): number {
    if (this.editor.maxExpr) {
      return this.sheet.resolve(this.editor.maxExpr);
    } else {
      return this.editor.max!;
    }
  }

  clickBox(i: number) {
    if (this.viewMode === ViewMode.Edit ||
      this.viewMode === ViewMode.Play && this.editor.freeEdit) {
      if (i === this.score) {
        i = this.score - 1;
      }
      this.score = i;
    }
  }
}
