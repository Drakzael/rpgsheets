import { Component, Input, OnInit } from '@angular/core';
import { format } from '../../_models/text';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent implements OnInit {
  @Input() text! : string;
  formattedText!: any;
  markClose = false;
  display = false;
  private closeDelay = 500;
  
  constructor(
    private sanitized: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.formattedText = this.sanitized.bypassSecurityTrustHtml(format(this.text));
  }

  @Input() open() {
    this.display = true;
    this.markClose = false;
  }

  @Input() close() {
    this.markClose = true;
    setTimeout(this.doClose.bind(this), this.closeDelay);
  }

  private doClose() {
    if (this.markClose) {
      this.display = false;
    }
  }
}
