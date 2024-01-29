import { Component, OnInit } from '@angular/core';
import { ProductService } from './../services/product.service';
import { Order, Product } from '../data-type';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-seller-order',
  templateUrl: './seller-order.component.html',
  styleUrls: ['./seller-order.component.css']
})
export class SellerOrderComponent implements OnInit {
  orderData: Order[] | undefined
  products: Product[] = [];
  searchText = '';
  totalRecords: any | String;
  page: number = 1;
  itemsPerPage: number = 5;
  selectedItemsPerPage: number[] = [5, 10, 15, 20];
  currentSortColumn: string = '';
  isSortAscending: boolean = true;
  constructor(private order: OrderService, private product: ProductService) { }
  ngOnInit(): void {
    this.getOrderList();
    this.product.productList().subscribe((result) => {
      this.products = result;
    });
  }
  getOrderList() {
    this.order.orderList().subscribe((result) => {
      if (result) {
        this.orderData = result.filter(order => {
          return (
            order.id.toString().includes(this.searchText.trim().toLowerCase()) ||
            order.status.toLowerCase().includes(this.searchText) ||
            order.address.toLowerCase().includes(this.searchText) ||
            order.contact.toLowerCase().includes(this.searchText) ||
            order.payment.toLowerCase().includes(this.searchText)
          );
        });
        this.totalRecords = this.orderData.length;

      }
    })
  }
  onSearchChange() {
    this.getOrderList();
  }
  getProductById(productId: number): Product | undefined {
    return this.products.find(product => product.id === productId);
  }
  shipOrder(orderId: number | undefined) {
    orderId && this.order.shipOrder(orderId).subscribe((result) => {
      if (result) {
        this.getOrderList();
      }
    })
  }
  finishOrder(orderId: number | undefined) {
    orderId && this.order.finishOrder(orderId).subscribe((result) => {
      if (result) {
        this.getOrderList();
      }
    })
  }
  sort(column: string) {
    if (column === this.currentSortColumn) {
      // đảo ngược thứ tự xếp nếu bấm cùng cột
      this.isSortAscending = !this.isSortAscending;
    } else {
      // Set the new column for sorting
      this.currentSortColumn = column;
      this.isSortAscending = true;
    }

    this.orderData = this.orderData?.sort((a, b) => {
      const valueA = (a as any)[column];
      const valueB = (b as any)[column];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.isSortAscending
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return this.isSortAscending ? valueA - valueB : valueB - valueA;
      }
    });
  }
  getStartIndex(): number {
    if (!this.orderData || this.orderData.length === 0) {
      return 0;
    }
    return (this.page - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    if (!this.orderData || this.orderData.length === 0) {
      return 0;
    }
    const endIndex = this.page * this.itemsPerPage;
    return endIndex > this.totalRecords ? this.totalRecords : endIndex;
  }
}
