import { Component, Input, OnInit } from '@angular/core';
import { GameMetadata, GameMetadataEditor, GameMetadataValue } from '../../../_models/gamemetadata';
import { Sheet } from '../../../_models/sheet';
import { CommonModule } from '@angular/common';
import { ViewMode } from '../../../_models/viewmode';
import { Icon } from '../../../_models/icon';
import { IconComponent } from '../../../common/icon/icon.component';
import { IconDotEmpty, IconDotFull, IconDotMinus, IconDotPlus } from '../../../_icons/dot';

@Component({
  selector: 'app-scale',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent
  ],
  templateUrl: './scale.component.html',
  styleUrls: ['./scale.component.scss', './scale.component.print.scss']
})
export class ScaleComponent implements OnInit {
  @Input() value!: GameMetadataValue;
  @Input() editorCode!: string;
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() viewMode!: ViewMode;
  mode = ViewMode;

  iconFull!: Icon;
  iconEmpty!: Icon;
  iconPlus!: Icon;
  iconMinus!: Icon;

  editor!: GameMetadataEditor;
  max!: number;
  name!: string;

  originalScore!: number;

  get values(): number[] {
    return Array(this.max).fill(0).map((_, i) => i + 1);
  }

  ngOnInit(): void {
    this.editor = this.metadata.editors![this.editorCode];
    if (this.value.nameValue) {
      this.name = this.sheet.getString(this.value.nameValue) || this.value.name;
    } else {
      this.name = this.value.name;
    }
    this.iconEmpty = this.editor.icons?.empty && this.metadata.icons![this.editor.icons?.empty]
      || IconDotEmpty;
    this.iconFull = this.editor.icons?.full && this.metadata.icons![this.editor.icons.full]
      || IconDotFull;
    this.iconPlus = this.editor.icons?.plus && this.metadata.icons![this.editor.icons.plus]
      || this.editor.icons?.full && this.metadata.icons![this.editor.icons.full]
      || IconDotPlus;
    this.iconMinus = this.editor.icons?.minus && this.metadata.icons![this.editor.icons.minus]
      || this.editor.icons?.empty && this.metadata.icons![this.editor.icons?.empty]
      || IconDotMinus;

    const onChange = (() => {
      if (this.editor.maxExpr) {
        this.max = this.sheet.resolve(this.editor.maxExpr);
      } else {
        this.max = this.editor.max!;
      }
      if (this.score > this.max) {
        this.max = this.score;
      }

    }).bind(this);
    this.sheet.listenChange(onChange);
    onChange();

    this.originalScore = this.sheet.getNumber(this.value.value, this.editor.defaultValue as number || this.editor.min || 0);
  }

  get isEdit(): boolean {
    return this.viewMode === ViewMode.Edit;
  }

  get freeEdit(): boolean {
    return this.editor.freeEdit || false;
  }

  get score(): number {
    const defaultValue = this.editor.defaultValue as number || this.editor.min || 0;
    if (this.viewMode === ViewMode.Play) {
      return this.sheet.getNumber(this.value.value, defaultValue, true);
    } else {
      return this.sheet.getNumber(this.value.value, defaultValue);
    }
  }

  get scores(): number[] {
    let valueDefault = undefined;
    if (this.value.defaultValue) {
      valueDefault = (this.sheet.resolve(this.value.defaultValue) as number);
    }
    const defaultValue = valueDefault || this.editor.defaultValue as number || this.editor.min || 0;
    if (this.viewMode === ViewMode.Play) {
      const current = this.sheet.getNumber(this.value.value, defaultValue, true);
      const normal = this.sheet.getNumber(this.value.value, defaultValue);
      return [current < normal ? current : normal, normal, current > normal ? current : normal];
    } else if (this.viewMode === ViewMode.Edit) {
      const current = this.sheet.getNumber(this.value.value, defaultValue);
      return [current < this.originalScore ? current : this.originalScore, this.originalScore, current > this.originalScore ? current : this.originalScore];
    } else {
      const normal = this.sheet.getNumber(this.value.value, defaultValue);
      return [normal, normal, normal];
    }
  }

  set score(i: number) {
    this.sheet.setNumber(this.value.value, Math.max(this.editor.min || 0, i));
  }

  updateName(name: string) {
    if (this.value.nameValue) {
      this.name = name || this.value.name;
      this.sheet.setString(this.value.nameValue, name || null);
    }
  }

  clickValue(i: number) {
    if (this.viewMode === ViewMode.Edit ||
      this.viewMode === ViewMode.Play && this.freeEdit) {
      if (i <= this.score) {
        --i;
      }
      this.score = i;
    }
  }

  clickDice() {
    this.sheet.diceStat(this.score);
  }
}
