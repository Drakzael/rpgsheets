import { Component, Input, OnInit } from '@angular/core';
import { GameMetadata, GameMetadataEditor, GameMetadataFreeValue } from '../../../_models/gamemetadata';
import { Sheet } from '../../../_models/sheet';
import { ViewMode } from '../../../_models/viewmode';
import { CommonModule } from '@angular/common';
import { Icon } from '../../../_models/icon';
import { IconComponent } from '../../../common/icon/icon.component';
import { IconDotEmpty, IconDotFull, IconDotMinus, IconDotPlus } from '../../../_icons/dot';
import { IconTagEmpty, IconTagFull } from '../../../_icons/tag';

let uniqueId = 0;

@Component({
  selector: 'app-scale',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent
  ],
  templateUrl: './scale.component.html',
  styleUrl: './scale.component.scss'
})
export class ScaleComponent implements OnInit {
  @Input() value!: GameMetadataFreeValue;
  @Input() editorCode!: string;
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() viewMode!: ViewMode;
  mode = ViewMode;

  iconFull!: Icon;
  iconEmpty!: Icon;
  iconPlus!: Icon;
  iconMinus!: Icon;
  iconNote = IconTagFull;
  iconNoNote = IconTagEmpty;

  editor!: GameMetadataEditor;
  rows!: { name: string, index: number, value: number, scores: number[], note: string, isEditNote: boolean }[];
  max!: number;
  inputId = `free-dot-input-${uniqueId++}`;
  hints?: string[];

  originalScores!: { [key: string]: number };

  ngOnInit(): void {
    this.editor = this.metadata.editors![this.editorCode];
    this.rows = this.sheet.getNumbersStartingWith(this.prefix)
      .filter(({ key }) => key.substring(this.prefix.length))
      .map((value, index) => ({
        name: value.key.substring(this.prefix.length),
        index,
        value: value.value,
        scores: [value.value, value.value, value.value],
        note: this.sheet.getString(`__notes.${value.key}`),
        isEditNote: false
      }));
    this.cleanRows();

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

    }).bind(this);
    this.sheet.listenChange(onChange);
    onChange();
    this.updateHint();

    this.originalScores = {};
    this.rows
      .filter(row => row.name)
      .filter(row => row.value)
      .forEach(row => this.originalScores[row.name] = row.value);
  }

  getOriginalScore(name: string) {
    if (this.originalScores[name] === undefined) {
      return 0;
    }
    return this.originalScores[name];
  }

  get prefix() {
    return `${this.value.prefix}.`;
  }

  get values(): number[] {
    return Array(this.max).fill(0).map((_, i) => i + 1);
  }

  updateRow(index: number, text: string) {
    if (this.rows[index].name) {
      this.sheet.setNumber(`${this.prefix}${this.rows[index].name}`, null);
    }
    if (this.sheet.hasNumber(`${this.prefix}${text}`)) { // Avoid colision
      text = "";
    }
    if (text) {
      this.sheet.setNumber(`${this.prefix}${text}`, this.rows[index].value);
    } else {
      this.rows[index].value = 0;
    }
    this.rows[index].name = text;

    this.cleanRows();
    this.updateHint();
  }

  private cleanRows() {
    this.rows = this.rows.filter(({ name }) => name);
    const defaultCount = this.value.defaultCount || (this.viewMode === ViewMode.Edit ? 1 : 0);
    if (this.rows.length >= defaultCount) {
      this.rows.push({ name: "", index: this.rows.length, value: 0, scores: [0, 0, 0], note: "", isEditNote: false });
    } else {
      for (let i = this.rows.length; i < defaultCount; ++i) {
        this.rows.push({ name: "", index: this.rows.length, value: 0, scores: [0, 0, 0], note: "", isEditNote: false });
      }
    }
  }

  updateHint() {
    if (this.value.hint) {
      this.hints = this.value.hint.filter(hint => !this.rows.find(row => row.name === hint));
    }
  }

  clickValue(index: number, value: number) {
    if (this.viewMode === ViewMode.Edit ||
      this.viewMode === ViewMode.Play && this.editor.freeEdit) {
      if (!this.rows[index].name) {
        return;
      }
      if (value <= this.rows[index].value) {
        --value;
      }
      this.rows[index].value = value;
      const originalScore = this.getOriginalScore(this.rows[index].name);
      this.rows[index].scores = [value < originalScore ? value : originalScore, originalScore, value > originalScore ? value : originalScore];
      this.sheet.setNumber(`${this.prefix}${this.rows[index].name}`, value);
    }
  }

  clickDice(i: number) {
    this.sheet.diceStat(i);
  }

  editNote(i: number, input: HTMLTextAreaElement) {
    this.rows[i].isEditNote = true;
    setTimeout(() => input.focus(), 100);
  }

  confirmNote(i: number, value: string) {
    if (value && value.trim()) {
      this.sheet.setString(`__notes.${this.prefix}${this.rows[i].name}`, value);
    } else {
      this.sheet.setString(`__notes.${this.prefix}${this.rows[i].name}`, null);
    }
    this.rows[i].note = value;
    this.rows[i].isEditNote = false;
  }
}
