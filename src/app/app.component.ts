import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <mat-tab-group>
      <mat-tab label="Transactions">
        <app-transactions></app-transactions>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [
    `
      p {
        font-family: Lato;
      }
    `
  ]
})
export class AppComponent implements OnInit {
  constructor() {}

  public ngOnInit(): void {}
}
