import {
  Component,
  Input,
  ViewChild,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output
} from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { EventEmitter } from "@angular/core";

@Component({
  selector: "datatable",
  template: `
    <mat-card>
      <mat-form-field>
        <input (keyup)="filterBy($event)" matInput placeholder="Filter" />
      </mat-form-field>

      <mat-table
        [dataSource]="rows"
        matSort
        matSortActive="symbol"
        matSortDirection="asc"
      >
        <ng-container *ngIf="!isLoading">
          <ng-container
            matColumnDef="{{ column }}"
            *ngFor="let column of columns; let i = index"
          >
            <span>
              <mat-header-cell mat-sort-header *matHeaderCellDef>
                {{ column | fieldToDisplay }}
              </mat-header-cell>
              <mat-cell *matCellDef="let element">
                <ng-container [ngSwitch]="columnDefs[column].type">
                  <ng-container *ngSwitchCase="'dropdown'">
                    <mat-select
                      [(ngModel)]="element.active"
                      (click)="$event.stopPropagation()"
                    >
                      <mat-option
                        [value]="element[column]"
                        *ngFor="let option of columnDefs[column].data"
                      >
                        {{ option }}
                      </mat-option>
                    </mat-select>
                  </ng-container>
                  <ng-container *ngSwitchCase="'number'">
                    <input
                      matInput
                      type="number"
                      [step]="
                        columnDefs[column].step ? columnDefs[column].step : 1
                      "
                      (keypress)="onNumberKeyPress($event, element, column)"
                      (change)="onNumberChange(element, column)"
                      (click)="$event.stopPropagation()"
                      [(ngModel)]="element[column]"
                      [min]="columnDefs[column].min"
                      [max]="columnDefs[column].max"
                    />
                  </ng-container>
                  <ng-container *ngSwitchCase="'checkbox'">
                    <mat-checkbox
                      (click)="$event.stopPropagation()"
                      [(ngModel)]="element[column]"
                    ></mat-checkbox>
                  </ng-container>
                  <ng-container *ngSwitchCase="'none'"></ng-container>
                  <ng-container *ngSwitchDefault>
                    {{
                      columnDefs[column].uppercase
                        ? (element[column] | uppercase)
                        : ""
                    }}
                  </ng-container>
                </ng-container>
              </mat-cell>
            </span>
          </ng-container>
        </ng-container>
        <mat-header-row
          *matHeaderRowDef="columns; sticky: true"
        ></mat-header-row>
        <mat-row
          *matRowDef="let row; columns: columns"
          [style.background]="selection.isSelected(row) ? selectedRowClass : ''"
          (click)="onRowClick(row)"
        ></mat-row>
      </mat-table>
      <mat-spinner *ngIf="isLoading"></mat-spinner>
    </mat-card>
  `,
  styles: [``]
})
export class DatatableComponent implements OnInit, OnChanges {
  @Input()
  public isLoading = false;
  @Input()
  public selectable = true;
  @Input()
  public data: any;
  @Input()
  public columnDefs: any;
  @Input()
  public displayedColumns: any[] = [];
  @Output()
  public selectionChange = new EventEmitter();

  public selectedRowClass = "lightblue";

  public rows = new MatTableDataSource<any>();
  public columns = [];
  public selection = new SelectionModel<any>(true, []);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public ngOnInit(): void {
    console.log("[ngOnInit]", this.data);
  }

  public onNumberKeyPress(event: KeyboardEvent, element: any, column: any) {
    let value = Number((event.target as any).value + event.key) || 0;
    let isValid =
      event.charCode == 8 || event.charCode == 0
        ? null
        : event.charCode >= 48 && event.charCode <= 57;
    if (isValid && this.columnDefs[column].max !== undefined) {
      isValid = value <= this.columnDefs[column].max;
    }
    if (isValid && this.columnDefs[column].decimal) {
      let regex = /^\d+(\.\d{0,2})?$/g;
      isValid = regex.test((event.target as any).value + event.key);
    }
    return isValid;
  }

  public onNumberChange(element: any, column: any) {
    if (Number.isInteger(this.columnDefs[column].min)) {
      let minValue = this.columnDefs[column].min;
      if (!element[column] || element[column] < minValue) {
        element[column] = minValue;
      }
    } else if (this.columnDefs[column].min !== null) {
      let minValue = element[this.columnDefs[column].min];
      if (element[column] < minValue) {
        element[column] = minValue;
      }
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    console.log("[ngOnChanges]", changes);
    this.updateTable();
    this.selection.clear();
  }

  public onRowClick(row: any): void {
    if (this.selectable) {
      this.selection.toggle(row);
      this.selectionChange.emit(this.selection.selected);
    }
  }

  public filterBy(event: any): void {
    const filterBy: string = event.target.value;
    this.rows.filter = filterBy;
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.rows.data.length;
    return numSelected === numRows;
  }

  private updateRows(): void {
    this.rows = new MatTableDataSource<any>(this.data);
    this.rows.sort = this.sort;
    this.rows.paginator = this.paginator;
  }

  private updateColumns(): void {
    this.columns = [];
    this.displayedColumns.forEach(column => {
      if (this.columnDefs[column].visible) {
        this.columns.push(column);
      }
    });
  }

  private updateTable(): void {
    if (this.data) {
      this.updateRows();
      this.updateColumns();
    }
  }
}
