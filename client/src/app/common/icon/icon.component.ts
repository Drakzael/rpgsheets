import { Component, Input, OnInit } from '@angular/core';
import { Icon } from '../../_models/icon';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from '../tooltip/tooltip.directive';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [
    CommonModule,
    TooltipDirective
  ],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  @Input() icon!: Icon;
  @Input() tooltip?: string;
}
