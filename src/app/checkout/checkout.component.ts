import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartItem, Order, OrderDetail } from '../data-type';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number | undefined;
  cartData: CartItem[] | undefined;
  orderMsg: string | undefined;
  orderDetails: OrderDetail[] = [];
  selectedPayment: string = '';
  constructor(private product: ProductService, private order: OrderService, private router: Router, private user: UserService) { }

  ngOnInit(): void {
    this.product.currentCart().subscribe((result) => {
      let price = 0;
      this.cartData = result;
      result.forEach((item) => {
        if (item.quantity) {
          price += +item.price * +item.quantity;

          // Push order details to array
          this.orderDetails.push({
            id: undefined,
            orderId: undefined,
            productId: item.productId,
            quantity: item.quantity
          });
        }
      });

      this.totalPrice = price + (price * 0.1) + 100000;
    });
  }

  orderNow(data: { email: string, address: string, contact: string }) {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;

    if (this.totalPrice) {
      let orderData: Order = {
        email: data.email,
        address: data.address,
        contact: data.contact,
        date: new Date(),
        status: "Đang xử lý",
        payment: this.selectedPayment,
        totalPrice: this.totalPrice,
        userId: userId,
        id: undefined ?? 0,
        orderDetails: this.orderDetails
      };
      this.user.updateUserPoints(userId, this.totalPrice / 1000, 0).subscribe();
      this.order.createOrder(orderData).subscribe((result) => {
        if (result) {
          alert("Đặt hàng thành công!");
          // Delete cart items
          this.cartData?.forEach((item) => {
            this.product.deleteCartItems(item.id);
            this.router.navigate(['/my-orders']);
          });
        } else {
          alert("Đặt hàng thất bại! \nĐã có lỗi xảy ra!!");
        }
      });
    }
  }

}
