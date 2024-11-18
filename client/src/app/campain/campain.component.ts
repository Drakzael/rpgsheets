import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CampainService } from '../_services/campain.service';
import { Campain } from '../_models/campain';
import { ViewMode } from '../_models/viewmode';
import { faCancel, faPen, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-campain',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLink
  ],
  templateUrl: './campain.component.html',
  styleUrl: './campain.component.scss'
})
export class CampainComponent implements OnInit {
  campainId!: string | null;
  campain?: Campain;
  viewMode: ViewMode = ViewMode.View;
  mode = ViewMode;

  iconSave = faSave;
  iconEdit = faPen;
  iconCancel = faCancel;
  iconDelete = faTrash;

  constructor(
    private route: ActivatedRoute,
    private campainService: CampainService
  ) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.campainId = this.route.snapshot.paramMap.get("campainId");
      if (this.campainId === null) {
        this.prepareNewCampain();
      } else {
        this.getCampain();
      }
    })
  }

  getCampain() {
    if (this.campainId) {
      this.campainService.getCampain(this.campainId!).subscribe(campain => {
        this.campain = campain;
      })
    }
  }

  prepareNewCampain() {
    this.campain = new Campain();
    this.campain.sheets = [];
    this.viewMode = ViewMode.Edit;
  }

  updateName(name: string) {
    this.campain!.name = name;
  }

  updateDescription(description: string) {
    this.campain!.description = description;
  }

  edit() {
    this.viewMode = ViewMode.Edit;
  }

  save() {
    if (this.campainId === null) {
      this.campainService.createCampain(this.campain!).subscribe(id => {
        this.campainService.navigateToCampain(id);
        // this.campainId = id;
        // this.getCampain();
      });
    } else {
      this.campainService.saveCampain(this.campainId, this.campain!).subscribe(() => {
        this.getCampain();
      })
    }
    this.viewMode = ViewMode.View;
  }

  cancel() {
    if (this.campainId !== null) {
      this.getCampain();
    }
    this.viewMode = ViewMode.View;
  }

  delete() {
    if (this.viewMode === ViewMode.Delete) {
      this.viewMode = ViewMode.View;
      this.campainService.deleteCampain(this.campainId!).subscribe(() => {
        this.campainService.navigateToNewCampain();
      })
    } else {
      this.viewMode = ViewMode.Delete;
    }
  }
}
