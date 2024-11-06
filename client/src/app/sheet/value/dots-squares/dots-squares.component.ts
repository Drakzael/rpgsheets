import { Component, Input, OnInit } from '@angular/core';
import { faCircle as faCircleFull } from "@fortawesome/free-solid-svg-icons";
import { faCircle as faCircleEmpty, faSquare as faSquareEmpty, faSquareCheck as faSquareFull } from "@fortawesome/free-regular-svg-icons";
import { GameMetadata, GameMetadataEditor, GameMetadataValue } from '../../../_models/gamemetadata';
import { Sheet } from '../../../_models/sheet';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ViewMode } from '../../../_models/viewmode';

@Component({
  selector: 'app-dots-squares',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './dots-squares.component.html',
  styleUrl: './dots-squares.component.scss'
})
export class DotsSquaresComponent implements OnInit {
  @Input() value!: GameMetadataValue;
  @Input() editorCode!: string;
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() viewMode!: ViewMode;

  editor!: GameMetadataEditor;
  values!: number[];

  iconDotFill = faCircleFull;
  iconDotEmpty = faCircleEmpty;
  iconSquareFill = faSquareFull;
  iconSquareEmpty = faSquareEmpty;

  ngOnInit(): void {
    this.editor = this.metadata.editors![this.editorCode];
    this.values = Array(this.editor.max).fill(0).map((_, i) => i + 1);
  }

  get scoreDots(): number {
    return this.sheet.getNumber(this.dotValueName()) ||
      this.editor.min ||
      0;
  }

  set scoreDots(i: number) {
    this.sheet.setNumber(this.dotValueName(), Math.max(this.editor.min || 0, i));
  }

  get scoreSquares(): number {
    return this.sheet.getNumber(this.squareValueName()) ||
      this.editor.min!;
  }

  set scoreSquares(i: number) {
    this.sheet.setNumber(this.squareValueName(), Math.max(this.editor.min || 0, i));
  }

  get max(): number {
    return this.editor.max!;
  }

  dotValueName() {
    return (this.value.value as string[])[0];
  }

  squareValueName() {
    return (this.value.value as string[])[1]
  }

  clickDot(i: number) {
    if (this.viewMode === ViewMode.Edit ||
      this.viewMode === ViewMode.Play && this.editor.freeEditDots) {
      if (i === this.scoreDots) {
        i = this.scoreDots - 1;
      }
      this.scoreDots = i;
      if (!this.editor.overlap && this.scoreDots < this.scoreSquares) {
        this.scoreSquares = this.scoreDots;
      }
    }
  }

  clickSquare(i: number) {
    if (this.viewMode === ViewMode.Edit ||
      this.viewMode === ViewMode.Play && this.editor.freeEditSquares) {
      if (i === this.scoreSquares) {
        i = this.scoreSquares - 1;
      }
      if (!this.editor.overlap && i > this.scoreDots) {
        i = this.scoreDots;
      }
      this.scoreSquares = i;
    }
  }
}
