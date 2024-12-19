import { Component, Input, OnInit } from '@angular/core';
import { GameMetadata, GameMetadataEditor, GameMetadataValue } from '../../../_models/gamemetadata';
import { Sheet } from '../../../_models/sheet';
import { ViewMode } from '../../../_models/viewmode';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../common/icon/icon.component';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icon } from '../../../_models/icon';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    FontAwesomeModule
  ],
  templateUrl: './health.component.html',
  styleUrl: './health.component.scss'
})
export class HealthComponent implements OnInit {
  @Input() value!: GameMetadataValue;
  @Input() editorCode!: string;
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() viewMode!: ViewMode;

  editor!: GameMetadataEditor;
  levels!: number[];
  values!: { name: string, tip: string, level: number }[];

  icons!: Icon[];

  iconPlus = faPlus;
  iconMinus = faMinus;

  get isEdit() {
    return this.viewMode === ViewMode.Edit || this.viewMode === ViewMode.Play;
  }

  private computeValues() {
    const health: number[] = [];
    for (let i = this.value.values.length; i > 0; --i) {
      for (let j = 0; j < this.sheet.getNumber(this.value.values[i - 1]); ++j) {
        health.push(i);
      }
    }
    const values = this.editor.values!.map((value, index) => ({
      name: value.name,
      tip: value.tip,
      level: health[index] || 0
    }));
    return values;
  }

  ngOnInit(): void {
    this.editor = this.metadata.editors![this.editorCode];
    this.levels = Array(this.editor.types?.values.length).fill(0).map((_, i) => i);
    this.values = this.computeValues();

    this.icons = [];
    this.icons.push(this.getIcon(this.editor.types!.defaultIcon));
    this.editor.types!.values.forEach(value => this.icons.push(this.getIcon(value.icon)));
  }

  private getIcon(icon: Icon | string): Icon {
    return icon instanceof Object ? icon : this.metadata.icons![icon]
  }

  minus(level: number) {
    const valueCode = this.value.values[level];
    if ((this.sheet.getNumber(valueCode) || 0) === 0) {
      level > 0 && this.minus(level - 1);
    } else {
      this.sheet.setNumber(valueCode, Math.max(0, (this.sheet.getNumber(valueCode) || 0) - 1));
    }
    this.values = this.computeValues();
  }

  plus(level: number) {
    const valueCode = this.value.values[level];
    this.sheet.setNumber(valueCode, (this.sheet.getNumber(valueCode) || 0) + 1);
    let maxValue = this.editor.values!.length;
    for (let i = this.editor.types?.values.length! - 1; i >= 0; --i) {
      this.sheet.setNumber(this.value.values[i], Math.min(maxValue, this.sheet.getNumber(this.value.values[i]) || 0));
      maxValue -= this.sheet.getNumber(this.value.values[i]) || 0;
    }
    this.values = this.computeValues();
  }
}
