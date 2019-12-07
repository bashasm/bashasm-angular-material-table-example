import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatPaginatorModule,
  MatSortModule,
  MatFormFieldModule,
  MatTableModule,
  MatCheckboxModule,
  MatCardModule,
  MatInputModule,
  MatTabsModule,
  MatSelectModule
} from "@angular/material";
import { AppComponent } from "./app.component";
import { FieldToDisplayPipe } from "../field-to-display.pipe";
import { TransactionsComponent } from "./transactions/transactions.component";
import { DatatableComponent } from "./datatable/datatable.component";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatTableModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatSelectModule
  ],
  declarations: [
    AppComponent,
    DatatableComponent,
    FieldToDisplayPipe,
    TransactionsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
