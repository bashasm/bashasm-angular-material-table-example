import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "number",
  template: `
    <input
      matInput
      type="number"
      [step]="options.step ? options.step : 1"
      (keypress)="onNumberKeyPress($event, element, column)"
      (change)="onNumberChange(element, column)"
      (click)="$event.stopPropagation()"
      [(ngModel)]="element[column]"
      [min]="options.min"
      [max]="options.max"
    />
  `,
  styles: [``]
})
export class NumberInputComponent implements OnInit {
  @Input()
  public options: any;
  @Input()
  public element: any;
  @Input()
  public column: string;

  constructor() {}

  ngOnInit(): void {}

  public onNumberKeyPress(event: KeyboardEvent, element: any, column: any) {
    let value = Number((event.target as any).value + event.key) || 0;
    let isValid =
      event.charCode == 8 || event.charCode == 0
        ? null
        : event.charCode >= 48 && event.charCode <= 57;
    if (isValid && this.options.max !== undefined) {
      isValid = value <= this.options.max;
    }
    if (isValid && this.options.decimal) {
      let regex = /^\d+(\.\d{0,2})?$/g;
      isValid = regex.test((event.target as any).value + event.key);
    }
    return isValid;
  }

  public onNumberChange(element: any, column: any) {
    if (Number.isInteger(this.options.min)) {
      let minValue = this.options.min;
      if (!element[column] || element[column] < minValue) {
        element[column] = minValue;
      }
    } else if (this.options.min !== null) {
      let minValue = element[this.options.min];
      if (element[column] < minValue) {
        element[column] = minValue;
      }
    }
  }
}
