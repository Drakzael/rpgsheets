import { Component, Input, OnInit } from '@angular/core';
import { faCircle as faCircleFull } from "@fortawesome/free-solid-svg-icons";
import { faCircle as faCircleEmpty, faSquare as faSquareEmpty, faSquareCheck as faSquareFull } from "@fortawesome/free-regular-svg-icons";
import { GameMetadata, GameMetadataEditor, GameMetadataValue } from '../../../_models/gamemetadata';
import { Sheet } from '../../../_models/sheet';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ViewMode } from '../../../_models/viewmode';
import { Icon } from '../../../_models/icon';
import { IconComponent } from '../../../common/icon/icon.component';
import { IconDotEmpty, IconDotFull, IconDotMinus, IconDotPlus } from '../../../_icons/dot';
import { IconSquareCrossed, IconSquareEmpty } from '../../../_icons/square';

@Component({
  selector: 'app-double-scale',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    IconComponent
  ],
  templateUrl: './double-scale.component.html',
  styleUrls: ['./double-scale.component.scss', './double-scale.component.print.scss']
})
export class DoubleScaleComponent implements OnInit {
  @Input() value!: GameMetadataValue;
  @Input() editorCode!: string;
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() viewMode!: ViewMode;
  mode = ViewMode;

  editor!: GameMetadataEditor;
  values!: number[];

  iconDotFill = faCircleFull;
  iconDotEmpty = faCircleEmpty;
  iconSquareFill = faSquareFull;
  iconSquareEmpty = faSquareEmpty;

  iconFirstFull!: Icon;
  iconFirstEmpty!: Icon;
  iconFirstPlus!: Icon;
  iconFirstMinus!: Icon;
  iconSecondFull!: Icon;
  iconSecondEmpty!: Icon;
  iconSecondPlus!: Icon;
  iconSecondMinus!: Icon;

  originalScoreFirst!: number;
  originalScoreSecond!: number;

  ngOnInit(): void {
    this.editor = this.metadata.editors![this.editorCode];
    this.values = Array(this.editor.max).fill(0).map((_, i) => i + 1);

    this.iconFirstEmpty = this.editor.icons?.firstEmpty && this.metadata.icons![this.editor.icons?.firstEmpty]
      || IconDotEmpty;
    this.iconFirstFull = this.editor.icons?.firstFull && this.metadata.icons![this.editor.icons?.firstFull]
      || IconDotFull;
    this.iconFirstPlus = this.editor.icons?.firstPlus && this.metadata.icons![this.editor.icons.firstPlus]
      || this.editor.icons?.firstFull && this.metadata.icons![this.editor.icons?.firstFull]
      || IconDotPlus;
    this.iconFirstMinus = this.editor.icons?.firstMinus && this.metadata.icons![this.editor.icons.firstMinus]
      || this.editor.icons?.firstEmpty && this.metadata.icons![this.editor.icons?.firstEmpty]
      || IconDotMinus;
    this.iconSecondEmpty = this.editor.icons?.secondEmpty && this.metadata.icons![this.editor.icons?.secondEmpty]
      || IconSquareEmpty;
    this.iconSecondFull = this.editor.icons?.secondFull && this.metadata.icons![this.editor.icons?.secondFull]
      || IconSquareCrossed;
    this.iconSecondPlus = this.editor.icons?.secondPlus && this.metadata.icons![this.editor.icons.secondPlus]
      || this.iconSecondFull;
    this.iconSecondMinus = this.editor.icons?.secondMinus && this.metadata.icons![this.editor.icons.secondMinus]
      || this.iconSecondEmpty;

    this.originalScoreFirst = this.scoreFirst;
    this.originalScoreSecond = this.scoreSecond;
  }

  getScores(index: 0 | 1) {
    const value = index === 0 ? this.firstValueName() : this.secondValueName();
    const scores = (current: number, original = current) => [
      current < original ? current : original,
      original,
      current > original ? current : original
    ];
    let valueDefault = undefined;
    if (this.value.defaultValue) {
      valueDefault = (this.sheet.resolve(this.value.defaultValue) as number[])[index];
    }
    const defaultValue = valueDefault || this.editor.defaultValue as number || this.editor.min || 0;
    const baseValue = this.sheet.getNumber(value, defaultValue);
    const modifiedValue = this.sheet.getNumber(value, defaultValue, true);
    if (this.viewMode === ViewMode.Play) {
      return scores(modifiedValue, baseValue);
    } else if (this.viewMode === ViewMode.Edit) {
      return scores(baseValue, this.originalScoreFirst);
    } else {
      return scores(baseValue);
    }
  }

  get scoreFirst(): number {
    return this.sheet.getNumber(this.firstValueName()) ||
      this.editor.min ||
      0;
  }

  get scoresFirst(): number[] {
    return this.getScores(0);
  }

  set scoreFirst(i: number) {
    this.sheet.setNumber(this.firstValueName(), Math.max(this.editor.min || 0, i));
  }

  get scoresSecond(): number[] {
    return this.getScores(1);
  }

  get scoreSecond(): number {
    return this.sheet.getNumber(this.secondValueName()) ||
      this.editor.min!;
  }

  set scoreSecond(i: number) {
    this.sheet.setNumber(this.secondValueName(), Math.max(this.editor.min || 0, i));
  }

  get max(): number {
    return this.editor.max!;
  }

  get freeEditFirst() {
    if (this.editor.freeEditFirst !== undefined) {
      return this.editor.freeEditFirst;
    }
    if (this.editor.freeEditDots !== undefined) {
      return this.editor.freeEditDots;
    }
    if (this.editor.freeEdit !== undefined) {
      return this.editor.freeEdit;
    }
    return false;
  }

  get freeEditSecond() {
    if (this.editor.freeEditSecond !== undefined) {
      return this.editor.freeEditSecond;
    }
    if (this.editor.freeEditSquares !== undefined) {
      return this.editor.freeEditSquares;
    }
    if (this.editor.freeEdit !== undefined) {
      return this.editor.freeEdit;
    }
    return false;
  }

  firstValueName() {
    return this.value.values[0];
  }

  secondValueName() {
    return this.value.values[1];
  }

  clickFirst(i: number) {
    if (this.viewMode === ViewMode.Edit ||
      this.viewMode === ViewMode.Play && this.freeEditFirst) {
      if (i <= this.scoreFirst) {
        --i;
      }
      this.scoreFirst = i;
      if (!this.editor.overlap && this.scoreFirst < this.scoreSecond) {
        this.scoreSecond = this.scoreFirst;
      }
    }
  }

  clickSecond(i: number) {
    if (this.viewMode === ViewMode.Edit ||
      this.viewMode === ViewMode.Play && this.freeEditSecond) {
      if (i <= this.scoreSecond) {
        --i;
      }
      if (!this.editor.overlap && i > this.scoreFirst) {
        i = this.scoreFirst;
      }
      this.scoreSecond = i;
    }
  }

  clickDice(i: number) {
    this.sheet.diceStat(i);
  }
}
