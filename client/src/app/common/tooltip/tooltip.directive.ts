import { ComponentRef, Directive, ElementRef, HostListener, inject, Input, OnInit, Renderer2, ViewContainerRef } from "@angular/core";
import { TooltipComponent } from "./tooltip.component";

@Directive({
  selector: '[tooltip]',
  standalone: true
})
export class TooltipDirective implements OnInit {
  @Input('tooltip') text?: string;
  private tooltipComponent?: ComponentRef<TooltipComponent>;

  constructor(
    private viewContainerRef: ViewContainerRef,
  ) {
  }

  ngOnInit(): void {
    if (this.text) {
      this.tooltipComponent = this.viewContainerRef.createComponent(TooltipComponent);
      this.tooltipComponent.instance.text = this.text;
    }
  }

  @HostListener('mouseover')
  private _show(): void {
    if (this.tooltipComponent) {
      this.tooltipComponent.instance.open();
    }
  }

  @HostListener('mouseout')
  private _hide(): void {
    if (this.tooltipComponent) {
      this.tooltipComponent.instance.close();
    }
  }
}
