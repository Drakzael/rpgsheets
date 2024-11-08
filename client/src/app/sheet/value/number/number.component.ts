import { Component, Input, OnInit } from '@angular/core';
import { GameMetadataValue } from '../../../_models/gamemetadata';
import { Sheet } from '../../../_models/sheet';
import { ViewMode } from '../../../_models/viewmode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-number',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './number.component.html',
  styleUrl: './number.component.scss'
})
export class NumberComponent implements OnInit {
  @Input() value!: GameMetadataValue;
  @Input() sheet!: Sheet;
  @Input() viewMode!: ViewMode;
  mode = ViewMode;
  numValue!: number;

  ngOnInit(): void {
    this.numValue = this.sheet.getNumber(this.value.value);
  }

  updateValue(value: string) {
    this.numValue = Number(value);
    this.sheet.setNumber(this.value.value, Number(value));
  }
}
