import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { CartItem, Price } from '../data-type';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartData: CartItem[] | undefined;
  priceSummary: Price = {
    price: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }
  constructor(private product: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadDetails()

  }

  removeToCart(cartId: number | undefined) {
    cartId && this.cartData && this.product.removeToCart(cartId)
      .subscribe((result) => {
        this.loadDetails();
      })
  }

  loadDetails() {
    this.product.currentCart().subscribe((result) => {
      this.cartData = result;
      console.warn(this.cartData);
      let price = 0;
      result.forEach((item) => {
        if (item.quantity) {
          price = price + (+item.price * +item.quantity);
        }
      })
      this.priceSummary.price = price;
      this.priceSummary.tax = price *0.1;
      this.priceSummary.delivery = 100000;
      this.priceSummary.total = price + this.priceSummary.tax + this.priceSummary.delivery;

      if (!this.cartData.length) {
        this.router.navigate(['/']);
      }
    })
  }
  decreaseQuantity(cart: any) {
    if (cart.quantity > 1) {
      cart.quantity--;
      this.updateCartItem(cart);
    }
  }

  increaseQuantity(cart: any) {
    cart.quantity++;
    this.updateCartItem(cart);
  }
  clearCart() {
    if (this.cartData) {
      this.cartData.forEach((cart) => {
        this.removeToCart(cart.id);
      });
      this.router.navigate(['/']);
      alert("Xóa giỏ hàng thành công!");
    }
  }
  updateCartItem(cart: CartItem) {
    this.product.updateCartItem(cart).subscribe(() => {
      this.loadDetails();
    });
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }

}
