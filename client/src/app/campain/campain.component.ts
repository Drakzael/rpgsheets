import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CampainService } from '../_services/campain.service';
import { Campain } from '../_models/campain';
import { ViewMode } from '../_models/viewmode';
import { faCancel, faPen, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { TextFormatter } from '../_models/text';

@Component({
  selector: 'app-campain',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLink,
    RouterModule
  ],
  templateUrl: './campain.component.html',
  styleUrl: './campain.component.scss'
})
export class CampainComponent implements OnInit {
  campainId!: string | null;
  campain?: Campain;
  viewMode: ViewMode = ViewMode.View;
  mode = ViewMode;
  private _description!: string;
  private _gmDescription!: string;

  iconSave = faSave;
  iconEdit = faPen;
  iconCancel = faCancel;
  iconDelete = faTrash;

  constructor(
    private route: ActivatedRoute,
    private campainService: CampainService,
    private router: Router,
    private ref: ElementRef,
    private formatter: TextFormatter
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

  private querySelector<keyof, HTMLElementTagMapName>(root: Element, selectors: string): Element[] {
    const results = Array.from(root.querySelectorAll(selectors));

    root.querySelectorAll("*").forEach((element: Element) => {
      this.querySelector(element, selectors).forEach((childElement: Element) => {
        if (!results.includes(childElement as HTMLElement)) {
          results.push(childElement as HTMLElement);
        }
      });
    });
    return results;
  }

  @HostListener("click", ["$event"])
  onClick(e: any) {
    e.preventDefault();
    const href = e.target.getAttribute("href");
    href && this.router.navigate([href]);
  }

  getCampain() {
    if (this.campainId) {
      this.campainService.getCampain(this.campainId!).subscribe(campain => {
        this.campain = campain;
        this.description = campain.description;
        this.gmDescription = campain.gmDescription || "";
      });
    };
    setTimeout(() => {
      this.querySelector(this.ref.nativeElement, "div.description").forEach((description) =>
        this.querySelector(description, "a").forEach(a => {
          const href = a.getAttribute("href");
          href && a.classList.add("link");
        })
      );
    }, 500);
  }

  prepareNewCampain() {
    this.campain = new Campain();
    this.campain.writable = true;
    this.campain.deletable = false;
    this.campain.sheets = [];
    this.campain.gmDescription = "";
    this.campain.description = "";
    this.description = "";
    this.gmDescription = "";
    this.viewMode = ViewMode.Edit;
  }

  get description() {
    return this._description;
  }

  set description(text: string) {
    this._description = this.formatter.formatWithLinks(text);
    this.campain!.description = text;
  }

  get gmDescription() {
    return this._gmDescription;
  }

  set gmDescription(text: string) {
    this._gmDescription = this.formatter.formatWithLinks(text);
    this.campain!.gmDescription = text;
  }

  updateName(name: string) {
    this.campain!.name = name;
  }

  updateDescription(description: string) {
    this.campain!.description = description;
  }

  updateGmDescription(description: string) {
    this.campain!.gmDescription = description;
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
