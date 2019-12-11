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
                    (keydown)="onNumberKeydown($event)"
                    (change)="onNumberChange(element, column)"
                    (click)="$event.stopPropagation()"
                    [(ngModel)]="element[column]"
                    [min]="1"
                    [max]="10000"
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
                  {{ element[column] }}
                </ng-container>
              </ng-container>
            </mat-cell>
          </span>
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
    </mat-card>
  `,
  styles: [``]
})
export class DatatableComponent implements OnInit, OnChanges {
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

  public onNumberKeydown(event: any) {
    return event.charCode == 8 || event.charCode == 0
      ? null
      : event.charCode >= 48 && event.charCode <= 57;
  }

  public onNumberChange(element: any, column: any) {
    if (!element[column] && this.columnDefs[column].min !== null) {
      element[column] = this.columnDefs[column].min;
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
