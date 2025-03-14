import { Injectable } from "@angular/core";
import { CampainService } from "../_services/campain.service";
import { SheetService } from "../_services/sheet.service";

export function format(text: string) {
  return text?.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll(/--(.+?)--/g, "<strike>$1</strike>")
    .replaceAll(/\/\/(.+?)\/\//g, "<i>$1</i>")
    .replaceAll(/__(.+?)__/g, "<u>$1</u>")
    .replaceAll(/\*\*(.+?)\*\*/g, "<b>$1</b>");
};

@Injectable({ providedIn: "root" })
export class TextFormatter {
  constructor(
    private sheetService: SheetService,
    private campainService: CampainService
  ) {
  }
  formatWithLinks(text: string) {
    text = format(text);
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
