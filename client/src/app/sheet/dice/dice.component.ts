import { Component, Input, OnInit } from '@angular/core';
import { Sheet } from '../../_models/sheet';
import { GameMetadata, GameMetadataDiceThrow } from '../../_models/gamemetadata';
import { CommonModule } from '@angular/common';
import { d10 } from '../../_icons/dice';
import { IconComponent } from '../../common/icon/icon.component';
import { faCancel, faDice, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
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
  resolveColor!: (dice: number, input: { [key: string]: number | boolean | string }) => { primary?: string, secondary?: string, glow?: string };

  ngOnInit(): void {
    this.sheet.registerDiceStat((i) => this.diceStat.call(this, i));
    this.selectThrow(this.defaultThrow);
  }

  get defaultThrow(): GameMetadataDiceThrow {
    const throwCode = localStorage.getItem(`diceThrow-${this.sheet.game}`);
    return this.metadata.dice!.throws.find(diceThrow => diceThrow.code === throwCode) || this.metadata.dice!.throws[0];
  }

  set defaultThrow(diceThrow) {
    localStorage.setItem(`diceThrow-${this.sheet.game}`, diceThrow.code);
  }

  private getInputValue(inputCode: string): string | boolean | number {
    const input = this.activeThrow.input![inputCode];
    let value: string | boolean | number | null = localStorage.getItem(`diceThrow-${this.sheet.game}-${this.activeThrow.code}-input-${inputCode}`);
    if (value === null) {
      return input.defaultValue;
    }
    switch (input.valueType) {
      case 'boolean':
        value = Boolean(value);
        break;
      case 'number':
        value = Number(value);
        break;
    }
    if (input.type === "select" && !input.values!.filter(v => v.value === value).length) {
      return input.defaultValue;
    }
    return value!;
  }

  private setDefaultInput(inputCode: string, value: string | number | boolean) {
    localStorage.setItem(`diceThrow-${this.sheet.game}-${this.activeThrow.code}-input-${inputCode}`, value.toString());
  }

  selectThrow(activeThrow: GameMetadataDiceThrow) {
    this.activeThrow = activeThrow;
    this.defaultThrow = activeThrow;
    this.inputs = {};
    if (this.activeThrow.input) {
      for (let inputKey of Object.keys(this.activeThrow.input!)) {
        const input = this.activeThrow.input![inputKey];
        if (input.type === "select" && !input.values) {
          input.values = Array(input.max! - input.min! + 1).fill(0)
            .map((_, i) => i + input.min!)
            .map(i => ({ name: i.toString(), value: i }));
        }
        this.inputs[inputKey] = this.getInputValue(inputKey);
      }
    }
    this.resolve = this.sheet.resolve(this.activeThrow.resultFunction) as (dices: number[], input: { [key: string]: number | boolean | string }) => number | boolean;
    if (this.activeThrow.resultColor) {
      this.resolveColor = this.sheet.resolve(this.activeThrow.resultColor) as (dice: number, input: { [key: string]: number | boolean | string }) => { pouet?: any, primary?: string, secondary?: string, glow?: string };
    } else {
      this.resolveColor = () => ({});
    }
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
    this.setDefaultInput(code, value);
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

  getColorStyle(color?: string) {
    if (color) {
      return `color: ${color};`;
    }
    return '';
  }

  getGlowStyle(color?: string) {
    if (color) {
      return `filter: drop-shadow( 0 0 0.2em ${color});`
    }
    return '';
  }
}
