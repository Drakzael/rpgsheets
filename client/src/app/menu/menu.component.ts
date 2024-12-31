import { Component, OnInit } from '@angular/core';
import { SheetService } from '../_services/sheet.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../_services/account.service';
import { faUser, faSignOut, faUsers, faImage, faImagePortrait, faPlus, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CampainService } from '../_services/campain.service';
import { Role, User } from '../_models/user';
import { GameMetadataOverview } from '../_models/gamemetadata';
import { IconComponent } from '../common/icon/icon.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FontAwesomeModule,
    IconComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  me?: User | null;
  metadata!: {[key: string]: GameMetadataOverview };
  iconUser = faUser;
  iconUsers = faUsers;
  iconLogout = faSignOut;
  iconCampain = faImage;
  iconCharacter = faImagePortrait;
  iconAdd = faPlus;
  iconDeprecated = faWarning;
  Role = Role;

  get sheets() {
    return this.sheetService.sheets;
  }

  get campains() {
    return this.campainService.campains;
  }

  get gmCampains() {
    return this.campains.filter(campain => campain.mine);
  }

  get playerCampains() {
    return this.campains.filter(campain => !campain.mine);
  }

  constructor(
    private accountService: AccountService,
    private sheetService: SheetService,
    private campainService: CampainService
  ) {
    this.accountService.me.subscribe(me => this.me = me);
    this.sheetService.listMetadata().subscribe(metadata => {
      this.metadata = {};
      metadata.forEach(game => this.metadata[game.code] = game);
    });
  }

  ngOnInit(): void {
    this.accountService.refreshMe();
  }

  logout() {
    this.accountService.logout();
  }
}
