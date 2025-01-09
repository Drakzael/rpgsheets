import { Component, Input, OnInit } from '@angular/core';
import { Sheet } from '../../_models/sheet';
import { GameMetadata, GameMetadataDiceThrow } from '../../_models/gamemetadata';
import { CommonModule } from '@angular/common';
import { d10 } from '../../_icons/dice';
import { IconComponent } from '../../common/icon/icon.component';
import { faCancel, faDice, faDiceD6, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-dice',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    FontAwesomeModule
  ],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.scss'
})
export class DiceComponent implements OnInit {

  @Input() sheet!: Sheet;
  @Input() metadata!: GameMetadata;

  activeThrow!: GameMetadataDiceThrow;

  dicePool: number[] = [];
  diceThrown = false;

  numberResult?: number;
  booleanResult?: boolean;

  inputs: { [key: string]: number | boolean | string } = {};

  iconD10 = d10;

  iconPlus = faPlus;
  iconMinus = faMinus;
  iconReset = faCancel;
  iconThrow = faDice;

  resolve!: (dices: number[], input: { [key: string]: number | boolean | string }) => number | boolean;

  ngOnInit(): void {
    this.sheet.registerDiceStat((i) => this.diceStat.call(this, i));
    this.selectThrow(this.metadata.dice!.throws[0]);
  }

  selectThrow(activeThrow: GameMetadataDiceThrow) {
    this.activeThrow = activeThrow;
    this.inputs = {};
    if (this.activeThrow.input) {
      for (let inputKey of Object.keys(this.activeThrow.input!)) {
        const input = this.activeThrow.input![inputKey];
        this.inputs[inputKey] = input.defaultValue;
        if (input.type === "select" && !input.values) {
          input.values = Array(input.max! - input.min! + 1).fill(0)
            .map((_, i) => i + input.min!)
            .map(i => ({ name: i.toString(), value: i }));
        }
      }
    }
    this.resolve = this.sheet.resolve(this.activeThrow.resultFunction) as (dices: number[], input: { [key: string]: number | boolean | string }) => number | boolean;
  }

  updateInput(code: string, value: string) {
    switch (this.activeThrow.input![code].valueType) {
      case "number":
        this.inputs[code] = Number(value);
        break;
      case "boolean":
        this.inputs[code] = Boolean(value);
        break;
      case "string":
        this.inputs[code] = value;
        break;
    }
    this.result();
  }

  throwDice(newRoll = true) {
    if (newRoll && (this.diceThrown || this.dicePool.length === 0)) {
      this.dicePool = [0];
    }
    this.dicePool = this.dicePool.map(_ => Math.floor(Math.random() * this.activeThrow.dice) + 1);
    this.diceThrown = true;
    this.result();
  }

  result() {
    const res = this.resolve(this.dicePool, this.inputs);
    switch (this.activeThrow.resultType) {
      case "number":
        this.numberResult = res as number;
        break;
      case "boolean":
        this.booleanResult = res as boolean;
        break;
    }
  }

  addDice(count: number) {
    if (this.diceThrown) {
      this.resetPool();
    }
    for (let i = 0; i < count; ++i) {
      this.dicePool.push(0);
    }
  }

  removeDice(count: number) {
    if (count >= this.dicePool.length) {
      this.dicePool = [];
    } else {
      this.dicePool = this.dicePool.splice(0, count);
    }
  }

  resetPool() {
    this.numberResult = undefined;
    this.booleanResult = undefined;
    this.diceThrown = false;
    this.dicePool = [];
  }

  diceStat(i: number): void {
    if (this.activeThrow.statClick === "pool") {
      this.addDice(i);
    } else if (this.activeThrow.statClick === "dice") {
      this.addDice(1);
      this.throwDice();
    }
  }
}
