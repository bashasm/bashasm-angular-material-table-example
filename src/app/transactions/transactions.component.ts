import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";

@Component({
  selector: "app-transactions",
  template: `
    <datatable
      [selectable]="false"
      (selectionChange)="onSelectionChange($event)"
      [displayedColumns]="displayedColumns"
      [columnDefs]="columnDefs"
      [data]="transactions"
    ></datatable>
  `,
  styles: [``]
})
export class TransactionsComponent implements OnInit {
  public displayedColumns = [
    "name",
    "id",
    "cost",
    "quantity",
    "productId",
    "active"
  ];

  public columnDefs = {
    name: {
      visible: true,
      type: "text"
    },
    id: {
      visible: false,
      type: "text"
    },
    cost: {
      visible: true,
      type: "checkbox"
    },
    quantity: {
      visible: true,
      type: "number",
      min: 1,
      max: Number.MAX_VALUE
    },
    productId: {
      visible: true,
      type: "none"
    },
    active: {
      visible: true,
      type: "dropdown",
      data: ["Yes", "No"]
    }
  };

  public transactions: any = [];
  constructor(private dataService: DataService) {}

  public ngOnInit() {
    this.dataService.getTransactions().subscribe(transactions => {
      console.log("[got transactions]", transactions);
      this.transactions = transactions;
    });
  }

  public onSelectionChange(e: any) {
    console.log(e);
  }
}
