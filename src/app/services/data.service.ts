import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

const transactions: any = [
  {
    name: "costumer 1",
    id: 1,
    cost: 11,
    quantity: 10,
    productId: 1
  },
  {
    name: "costumer 2",
    id: 2,
    cost: 12,
    quantity: 100,
    productId: 2
  },
  {
    name: "customer 3",
    id: 3,
    cost: 15,
    quantity: 101,
    productId: 3
  }
];

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor() {}

  public getTransactions() {
    return of(transactions).pipe(delay(2000));
  }
}
