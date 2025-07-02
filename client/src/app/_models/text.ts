import { Injectable } from "@angular/core";
import { CampainService } from "../_services/campain.service";
import { SheetService } from "../_services/sheet.service";

class HrStyle {
  borderTop?: string;
    borderBottom?: string;
    border?: string;
}

class AStyle {
  color?: string;
  underline?: boolean;
}

export class FormatStyle {
  hr?: HrStyle;
  a?: AStyle;
};

function getHr(hrStyle?: HrStyle): string {
  if (hrStyle) {
    let style = "";
    if (hrStyle.border) {
      style += `border: ${hrStyle.border};`;
    } else {
      if (hrStyle.borderBottom) {
        style += `border-bottom: ${hrStyle.borderBottom};`;
      }
      if (hrStyle.borderTop) {
        style += `border-top: ${hrStyle.borderTop};`;
      }
    }
    return `<hr style="${style}"/>`;
  }
  return "<hr/>";
}

export function format(text: string = "", styles?: FormatStyle) {
  return text
    .replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll(/^--$/gm, getHr(styles?.hr))
    .replaceAll(/--(.+?)--/g, "<strike>$1</strike>")
    .replaceAll(/\/\/(.+?)\/\//g, "<i>$1</i>")
    .replaceAll(/__(.+?)__/g, "<u>$1</u>")
    .replaceAll(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replaceAll(/\r\n/g, "<br/>")
    .replaceAll(/\r/g, "<br/>")
    .replaceAll(/\n/g, "<br/>");
};

@Injectable({ providedIn: "root" })
export class TextFormatter {
  constructor(
    private sheetService: SheetService,
    private campainService: CampainService
  ) { }

  formatWithLinks(text: string, styles?: FormatStyle) {
    text = format(text, styles);
    for (const match of text.matchAll(/\[character:?(.*?):(\d+?)\]/g)) {
      const id = match[2];
      const name = match[1] || this.sheetService.getSheetName(id) || this.campainService.getSheetName(id) || "Personnage sans nom";;
      text = text.replaceAll(match[0], `<a href=\"/sheet/${id}\">${name}</a>`);
    }
    for (const match of text.matchAll(/\$\{character:(\d+?)\}/g)) {
      const id = match[1];
      const name = this.sheetService.getSheetName(id) || this.campainService.getSheetName(id) || "Personnage sans nom";;
      text = text.replaceAll(match[0], name);
    }
    return text;
  }
}
