import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../data-type';
import { Observable, switchMap, tap } from 'rxjs';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private user: UserService) { }
  cancelOrder(orderId: number) {
    return this.getOrder(orderId).pipe(
      switchMap((order: any) => {
        order.status = "Hủy đơn hàng";
        this.user.updateUserPoints(order.userId,0, order.totalPrice/1000).subscribe();
        return this.http.put('http://localhost:3000/orders/' + orderId, order);
        
      })
    );
  }
  shipOrder(orderId: number) {
    return this.getOrder(orderId).pipe(
      switchMap((order: any) => {
        order.status = "Đang giao hàng";
        return this.http.put('http://localhost:3000/orders/' + orderId, order);
      })
    );
  }
  finishOrder(orderId: number) {
    return this.getOrder(orderId).pipe(
      switchMap((order: any) => {
        order.status = "Đã giao hàng";
        return this.http.put('http://localhost:3000/orders/' + orderId, order);
      })
    );
  }
  getOrder(orderId: number) {
    return this.http.get('http://localhost:3000/orders/' + orderId);
  }
  createOrder(order: Order) {
    return this.http.post<Order>('http://localhost:3000/orders', order);
  }
  orderListUser() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<Order[]>('http://localhost:3000/orders?userId=' + userData.id);
  }
  orderList() {
    return this.http.get<Order[]>('http://localhost:3000/orders');
  }
}
