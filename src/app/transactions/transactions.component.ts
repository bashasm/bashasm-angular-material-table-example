import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";

@Component({
  selector: "app-transactions",
  template: `
    <datatable
      (selectionChange)="onSelectionChange($event)"
      [displayedColumns]="displayedColumns"
      [columnDefs]="columnDefs"
      [data]="transactions"
    ></datatable>
  `,
  styles: [``]
})
export class TransactionsComponent implements OnInit {
  public displayedColumns = ["name", "id", "cost", "quantity", "productId"];

  public columnDefs = {
    name: {
      visible: true,
      type: "dropdown"
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
      type: "number"
    },
    productId: {
      visible: true,
      type: "none"
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
