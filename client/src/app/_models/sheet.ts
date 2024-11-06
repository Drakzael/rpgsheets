export class Sheet {
  private name: string = "";
  public game!: string;
  private numericValues: { [key: string]: number } = {};
  private stringValues: { [key: string]: string } = {};

  constructor(sheet?: Sheet) {
    if (sheet) {
      this.name = sheet.name;
      this.game = sheet.game;
      this.numericValues = sheet?.numericValues;
      this.stringValues = sheet.stringValues;
    }
  }

  public resolve(code: string) {
    if (code.startsWith("${") && code.endsWith("}")) {
      let expr = code.substring(2, code.length - 1);
      expr.match(/\$[a-zA-Z0-9\.]+/g)?.forEach(match => {
        const valueCode = match.substring(1);
        if (this.numericValues[valueCode] !== undefined) {
          expr = expr.replace(`${match}`, this.stringValues[valueCode].toString());
        } else if (this.stringValues[valueCode] !== undefined) {
          expr = expr.replace(`${match}`, `"${this.stringValues[valueCode]}"`);
        } else {
          expr = expr.replace(`${match}`, "''");
        }
      });
      // expr = ts.transpile(expr);
      return eval(expr);
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
