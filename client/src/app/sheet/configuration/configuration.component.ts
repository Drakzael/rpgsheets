import { Component, Input, OnInit } from '@angular/core';
import { CampainService } from '../../_services/campain.service';
import { Sheet } from '../../_models/sheet';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent implements OnInit {

  @Input() sheetId!: string;
  @Input() sheet!: Sheet;
  campains!: {id: string, name: string}[];

  iconDelete = faTrash;
  iconAdd = faPlus;

  constructor(
    private campainService: CampainService
  ) {
  }

  ngOnInit(): void {
    this.campainService.allCampains().subscribe(campains => this.campains = campains);
  }

  get otherCampains() {
    return this.campains.filter(campain => !this.sheet.campains.map(c => c.id).includes(campain.id));
  }

  addToCampain(id: string) {
    this.campainService.addSheetToCampain(id, this.sheetId!).subscribe(() => {
      this.sheet.campains.push(this.campains!.filter(cp => cp.id === id)[0]);
    });
  }

  removeFromCampain(id: string) {
    this.campainService.removeSheetFromCampain(id, this.sheetId!).subscribe(() => {
      this.sheet.campains.splice(this.sheet.campains.findIndex(cp => cp.id === id), 1);
    });
  }
}
