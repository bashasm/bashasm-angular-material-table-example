import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[tooltip]'
})
export class TooltipDirective {
    constructor(private el: ElementRef) {}

    @HostListener('mouseenter') onMouseEnter() {
        if (this.el.nativeElement.offsetWidth < this.el.nativeElement.scrollWidth) {
            this.el.nativeElement.title = this.el.nativeElement.textContent.trim();
        }
    }
}
