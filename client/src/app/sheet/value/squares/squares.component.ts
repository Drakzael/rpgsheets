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
  mode = ViewMode;

  iconSquareFill = faSquareFull;
  iconSquareEmpty = faSquareEmpty;

  editor!: GameMetadataEditor;
  max!: number;
  name!: string;


  get values(): number[] {
    return Array(this.max).fill(0).map((_, i) => i + 1);
  }

  ngOnInit(): void {
    this.editor = this.metadata.editors![this.editorCode];

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
    return this.sheet.getNumber(this.value.value) || this.editor.min || 0;
  }

  set score(i: number) {
    this.sheet.setNumber(this.value.value, Math.max(this.editor.min || 0, i));
  }

  clickBox(i: number) {
    if (this.viewMode === ViewMode.Edit ||
      this.viewMode === ViewMode.Play && this.editor.freeEdit) {
      if (i <= this.score) {
        i = this.score - 1;
      }
      this.score = i;
    }
  }
}
