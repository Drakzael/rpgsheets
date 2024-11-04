import { Component, OnInit } from '@angular/core';
import { SheetService } from '../_services/sheet.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  get sheets() {
    return this.sheetService.sheets;
  }

  constructor(
    private sheetService: SheetService
  ) {
    this.sheetService.refreshSheets();
  }

  ngOnInit(): void {
  }
}
