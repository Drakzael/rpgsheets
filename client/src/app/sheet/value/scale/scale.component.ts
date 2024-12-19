import { Component, Input, OnInit } from '@angular/core';
import { GameMetadata, GameMetadataEditor, GameMetadataValue } from '../../../_models/gamemetadata';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faCircle as faCircleFull } from "@fortawesome/free-solid-svg-icons";
import { faCircle as faCircleEmpty } from "@fortawesome/free-regular-svg-icons";
import { Sheet } from '../../../_models/sheet';
import { CommonModule } from '@angular/common';
import { ViewMode } from '../../../_models/viewmode';
import { Icon } from '../../../_models/icon';
import { IconComponent } from '../../../common/icon/icon.component';

@Component({
  selector: 'app-scale',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    IconComponent
  ],
  templateUrl: './scale.component.html',
  styleUrl: './scale.component.scss'
})
export class ScaleComponent implements OnInit {
  @Input() value!: GameMetadataValue;
  @Input() editorCode!: string;
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() viewMode!: ViewMode;
  mode = ViewMode;

  iconDotFill = faCircleFull;
  iconDotEmpty = faCircleEmpty;

  iconFull?: Icon;
  iconEmpty?: Icon;
  iconPlus?: Icon;
  iconMinus?: Icon;

  editor!: GameMetadataEditor;
  max!: number;
  name!: string;

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
    this.iconEmpty = this.editor.icons?.empty && this.metadata.icons![this.editor.icons?.empty] || undefined;
    this.iconFull = this.editor.icons?.full && this.metadata.icons![this.editor.icons.full] || undefined;
    this.iconPlus = this.editor.icons?.plus && this.metadata.icons![this.editor.icons.plus] || undefined;
    this.iconMinus = this.editor.icons?.minus && this.metadata.icons![this.editor.icons.minus] || undefined;

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
  }

  get isEdit(): boolean {
    return this.viewMode === ViewMode.Edit;
  }

  get score(): number {
    const defaultValue = this.editor.defaultValue as number || this.editor.min || 0;
    if (this.viewMode === ViewMode.Play) {
      return this.sheet.getNumber(this.value.value, defaultValue, true);
    } else {
      return this.sheet.getNumber(this.value.value, defaultValue);
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
      this.viewMode === ViewMode.Play && this.editor.freeEdit) {
      if (i === this.score) {
        i = this.score - 1;
      }
      this.score = i;
    }
  }
}
