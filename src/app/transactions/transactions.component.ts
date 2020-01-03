import { Component, OnInit, ViewChild } from "@angular/core";
import { DataService } from "../services/data.service";
import { DatatableComponent } from "../datatable/datatable.component";

@Component({
  selector: "app-transactions",
  template: `
    <button mat-raised-button (click)="onRefresh()">Refresh</button>
    <button mat-raised-button (click)="onAdd()">Add</button>
    <datatable
      #datatable
      [isLoading]="isLoading"
      [selectable]="true"
      (selectionChange)="onSelectionChange($event)"
      [displayedColumns]="displayedColumns"
      [columnDefs]="columnDefs"
      [data]="transactions"
    ></datatable>
  `,
  styles: [``]
})
export class TransactionsComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: true })
  public datatable: DatatableComponent;

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
      type: "text",
      uppercase: true
    },
    id: {
      visible: false,
      type: "text"
    },
    cost: {
      visible: true,
      type: "number"
    },
    quantity: {
      visible: true,
      type: "number",
      decimal: true,
      step: 0.01,
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
  public isLoading: boolean;

  constructor(private dataService: DataService) {}

  public ngOnInit() {
    this.loadData();
  }

  public onRefresh() {
    this.loadData();
  }

  public loadData() {
    this.isLoading = true;
    this.transactions = [];
    this.dataService.getTransactions().subscribe(transactions => {
      console.log("[got transactions]", transactions);
      this.isLoading = false;
      this.transactions = transactions;
      this.datatable.sortBy("cost", "desc");
    });
  }

  public onAdd() {
    this.transactions = [
      ...this.transactions,
      {
        name: "",
        id: 1,
        cost: 0,
        quantity: 10,
        productId: 1,
        active: "Yes"
      }
    ];
  }

  public onSelectionChange(e: any) {
    console.log(e);
  }
}
