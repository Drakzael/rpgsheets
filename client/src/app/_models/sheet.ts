import * as ts from "typescript";

export class SheetData {
  name: string = "";
  game!: string;
  numericValues: { [key: string]: number } = {};
  stringValues: { [key: string]: string } = {};
}

export class Sheet {
  constructor(private data?: SheetData) {
    if (!this.data) {
      this.data = new SheetData();
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
  public get game(): string {
    return this.data!.game;
  }
  public set game(game: string) {
    this.data!.game = game;
  }
  private get numericValues() {
    return this.data!.numericValues;
  }
  private get stringValues() {
    return this.data!.stringValues;
  }
  private impactValues: string[] = [];

  public resolve(code: string) {
    if (code.startsWith("${") && code.endsWith("}")) {
      let expr = code.substring(2, code.length - 1);
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
      expr = ts.transpile(expr);
      console.log(this.impactValues);
      return window.eval(expr);
    } else if (code.startsWith("$")) {
      switch (code) {
        case "$sheet.name":
          return this.name;
        case "$sheet.player":
          return "Player name";
        default:
          const valueCode = code.substring(1);
          return this.numericValues[valueCode]?.toString() || this.stringValues[valueCode] || "";
      }
    } else {
      return code;
    }
    }

  getNumber(code: string): number {
    if (code.startsWith("$")) {
      return this.resolve(code) as number;
    } else {
      return this.numericValues[code];
    }
  }

  setNumber(code: string, value: number): void {
    this.numericValues[code] = value;
  }

  public getString(code: string): string {
    if (code.startsWith("$")) {
      return this.resolve(code) as string;
    } else {
      return this.stringValues[code];
    }
  }

  setString(code: string, value: string): void {
    if (code === "$sheet.name") {
      this.name = value;
    } else {
      this.stringValues[code] = value;
    }
  }

  getNumbersStartingWith(prefix: string): { key: string, value: number }[] {
    return Object.keys(this.numericValues)
      .filter(key => key.startsWith(prefix))
      .map(key => ({ key, value: this.getNumber(key) }));
  }

  getStringKeysStartingWith(prefix: string): { key: string, value: string }[] {
    return Object.keys(this.stringValues)
      .filter(key => key.startsWith(prefix))
      .map(key => ({ key, value: this.getString(key) }));
  }
}

export class SheetOverview {
  id!: string;
  name!: string;
}
