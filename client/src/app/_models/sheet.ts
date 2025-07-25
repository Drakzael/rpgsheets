// import { transpile } from "typescript";

export class SheetData {
  name: string = "";
  userAlias!: string;
  game!: string;
  dead?: boolean;
  mode?: string;
  numericValues: { [key: string]: number } = {};
  stringValues: { [key: string]: string } = {};
  writable!: boolean;
  deletable!: boolean;
  campains!: { id: string, name: string }[];
}

export class Sheet {

  private _changed = false;
  private _onChange: (() => void)[] = [];
  private _onDiceStat?: (i: number) => void = undefined;
  private _tmpValues: { [key: string]: { [key: string]: (x: number) => number } } = {};
  private _states: { [key: string]: { value: string, action: string } } = {};

  constructor(
    private data?: SheetData
  ) {
    if (!this.data) {
      this.data = new SheetData();
      this.data.writable = true;
      this.data.deletable = true;
    }
  }

  public getData() {
    return this.data;
  }

  private get name(): string {
    return this.data!.name;
  }

  private set name(name: string) {
    this.data!.name = name;
  }

  get playerName() {
    return this.data!.userAlias;
  }

  set playerName(name: string) {
    this.data!.userAlias = name;
  }

  get writable() {
    return this.data!.writable;
  }

  get deletable() {
    return this.data!.deletable;
  }

  public get game(): string {
    return this.data!.game;
  }

  public set game(game: string) {
    this.data!.game = game;
  }

  public get dead(): boolean {
    return this.data!.dead || false;
  }

  public set dead(dead: boolean) {
    if (dead) {
      this.data!.dead = true;
    } else {
      delete this.data!.dead;
    }
  }

  public get mode(): string | undefined {
    return this.data!.mode;
  }

  public set mode(mode: string) {
    this.data!.mode = mode;
  }

  private get numericValues() {
    return this.data!.numericValues;
  }

  private get stringValues() {
    return this.data!.stringValues;
  }

  get campains() {
    return this.data!.campains;
  }

  private impactValues: string[] = [];

  get changed() { return this._changed; }

  public listenChange(callback: () => void) {
    this._onChange.push(callback);
  }

  private onChange(code: string) {
    this._changed = true;
    if (this.impactValues.includes(code)) {
      this._onChange.forEach(callback => callback.call(this));
    }
  }

  public selectState(group: string, value: string, action = ""): void {
    this._states[group] = { value, action };
    delete this._tmpValues[group];

    if (action.startsWith("${") && action.endsWith("}")) {
      let expr = action.substring(2, action.length - 1);
      expr.match(/\$[a-zA-Z0-9\.]+/g)?.forEach(match => {
        const valueCode = match.substring(1);
        if (!this.impactValues.includes(valueCode)) {
          this.impactValues.push(valueCode);
        }
        if (this.numericValues[valueCode] !== undefined) {
          expr = expr.replace(`${match}`, this.stringValues[valueCode].toString());
        } else if (this.stringValues[valueCode] !== undefined) {
          expr = expr.replace(`${match}`, `"${this.stringValues[valueCode]}"`);
        } else {
          expr = expr.replace(`${match}`, "''");
        }
      });
      expr = expr.replaceAll(/@([a-zA-Z0-9\.]+)\s*=\s*(.+?);/g, "actions['$1'] = $2");
      expr = `let actions = {}; ${expr}; actions;`;
      let actions = window.eval(expr) as { [key: string]: (x: number) => number };
      this._tmpValues[group] = actions;
    }
    this._onChange.forEach(callback => callback.call(this));
  }

  public isSelectedState(group: string, value: string, defaultState = false): boolean {
    return this._states[group] === undefined ? defaultState : this._states[group].value === value;
  }

  public isCharacterName(code: string): boolean {
    return code === "$sheet.name";
  }

  public resolve(code: string | number): any {
    if (typeof(code) === "string") {
      if (code.startsWith("${{") && code.endsWith("}}")) {
        let expr = code.substring(3, code.length - 2);
        return this.resolve("${ (() => {" + expr + "})(); }");
      }
      if (code.startsWith("${") && code.endsWith("}")) {
        let expr = code.substring(2, code.length - 1);
        expr.match(/\$[a-zA-Z0-9\.]+/g)?.forEach(match => {
          const valueCode = match.substring(1);
          if (!this.impactValues.includes(valueCode)) {
            this.impactValues.push(valueCode);
          }
          if (this.numericValues[valueCode] !== undefined) {
            expr = expr.replace(`${match}`, this.numericValues[valueCode].toString());
          } else if (this.stringValues[valueCode] !== undefined) {
            expr = expr.replace(`${match}`, `"${this.stringValues[valueCode].replace('"', '\\"')}"`);
          } else {
            expr = expr.replace(`${match}`, "''");
          }
        });
        // expr = transpile(expr);
        return window.eval(expr);
      } else if (code.startsWith("$")) {
        switch (code) {
          case "$sheet.name":
            return this.name;
          case "$sheet.player":
            return this.playerName;
          default:
            const valueCode = code.substring(1);
            return this.numericValues[valueCode]?.toString() || this.stringValues[valueCode] || "";
        }
      }
    }
    return code;
  }

  hasNumber(code: string): boolean {
    return this.numericValues[code] !== undefined;
  }

  getNumber(code: string | number, defaultValue = 0, withTmp = false): number {
    if (typeof(code) === "number") {
      return code as number;
    }
    let value = code.startsWith("$")
      ? this.resolve(code) as number
      : this.numericValues[code];
    if (value === undefined) {
      value = defaultValue;
    }
    if (withTmp) {
      Object.values(this._tmpValues).forEach(tmp => {
        if (tmp[code]) {
          value = tmp[code](value);
        }
      })
    }
    return value;
  }

  setNumber(code: string, value: number | null): void {
    if (value === null) {
      delete this.numericValues[code];
    } else {
      this.numericValues[code] = value;
    }
    this.onChange(code);
  }

  public getString(code: string): string {
    if (code.startsWith("$")) {
      return this.resolve(code) as string;
    } else {
      return this.stringValues[code];
    }
  }

  hasText(code: string): boolean {
    return this.stringValues[code] !== undefined;
  }

  setString(code: string, value: string | null): void {
    if (code === "$sheet.name") {
      this.name = value as string;
    } else {
      if (value === null) {
        delete this.stringValues[code];
      } else {
        this.stringValues[code] = value;
      }
    }
    this.onChange(code);
  }

  getNumbersStartingWith(prefix: string): { key: string, value: number }[] {
    return Object.keys(this.numericValues)
      .filter(key => key.startsWith(prefix))
      .map(key => ({ key, value: this.getNumber(key) }));
  }

  getStringsStartingWith(prefix: string): { key: string, value: string }[] {
    return Object.keys(this.stringValues)
      .filter(key => key.startsWith(prefix))
      .map(key => ({ key, value: this.getString(key) }));
  }

  registerDiceStat(cb: (i: number) => void) {
    this._onDiceStat = cb;
  }

  diceStat(i: number) {
    if (this._onDiceStat) {
      this._onDiceStat(i);
    }
  }
}

export class SheetOverview {
  id!: string;
  name!: string;
  mine?: boolean;
  game?: string;
  deprecated?: boolean;
  dead?: boolean;
}
