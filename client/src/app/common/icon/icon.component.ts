import { Component, Input, OnInit } from '@angular/core';
import { Icon } from '../../_models/icon';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  @Input() icon!: Icon;
}
