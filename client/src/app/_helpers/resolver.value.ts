import { Sheet } from "../_models/sheet";
import * as ts from "typescript";

export class ValueResolver {

  private sheet!: Sheet;
  constructor(sheet: Sheet) {
    this.sheet = sheet;
  }

  public resolve(code: string) {
    console.log(code);
        if (code.startsWith("${") && code.endsWith("}")) {
      let expr = code.substring(2, code.length - 1);
      console.log(expr);
      expr.match(/\$[a-zA-Z0-9\.]+/g)?.forEach(match => {
        const valueCode = match.substring(1);
        if (this.sheet.numericValues[valueCode] !== undefined) {
          expr = expr.replace(`${match}`, this.sheet.stringValues[valueCode].toString()); 
        } else if (this.sheet.stringValues[valueCode] !== undefined) {
          expr = expr.replace(`${match}`, this.sheet.stringValues[valueCode].toString()); 
        } else {
          expr = expr.replace(`${match}`, "''");
        }
      });
      console.log(expr);
      // expr = ts.transpile(expr);
      return eval(expr);
    } else if (code.startsWith("$")) {
      switch (code) {
        case "$sheet.name":
          return this.sheet.name;
        case "$sheet.player":
          return "Player name";
        default:
          const valueCode = code.substring(1);
          console.log(valueCode + " : " + this.sheet.numericValues[valueCode]?.toString() || this.sheet.stringValues[valueCode] || "");
          return this.sheet.numericValues[valueCode]?.toString() || this.sheet.stringValues[valueCode] || "";
      }
    } else {
      return code;
    }
  }
}