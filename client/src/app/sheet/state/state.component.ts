import { Component, Input, OnInit } from '@angular/core';
import { GameMetadata, GameMetadataValue, ValueType } from '../../_models/gamemetadata';
import { CommonModule } from '@angular/common';
import { ValueComponent } from '../value/value.component';
import { ViewMode } from '../../_models/viewmode';
import { Sheet } from '../../_models/sheet';

@Component({
  selector: 'app-state',
  standalone: true,
  imports: [
    CommonModule,
    ValueComponent
  ],
  templateUrl: './state.component.html',
  styleUrl: './state.component.scss'
})
export class StateComponent implements OnInit {
  @Input() metadata!: GameMetadata;
  @Input() sheet!: Sheet;
  @Input() state!: GameMetadataValue;
  @Input() defaultType?: ValueType;
  @Input() viewMode!: ViewMode;

  group!: string;
  action?: string;

  ngOnInit(): void {
    this.action = this.state.action;
  }

  selectState() {
    this.sheet.selectState(this.state.group!, this.state.value, this.state.action);
  }

  get selected() {
    return this.sheet.isSelectedState(this.state.group!, this.state.value, this.state.default);
  }
}
