import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartItem, Product } from '../data-type';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  popularProducts: undefined | Product[];
  trendyProducts: undefined | Product[];
  productData: undefined | Product;
  productQuantity: number = 1;
  removeCart = false;
  cartData: Product | undefined;
  constructor(private product: ProductService) { }

  ngOnInit(): void {
    this.product.trendyProducts().subscribe((data) => {
      this.trendyProducts = data;
    })
  }
  addToCart() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;
      if (!localStorage.getItem('user')) {
        this.product.localAddToCart(this.productData);
        this.removeCart = true
      } else {
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        let cartData: CartItem = {
          ...this.productData,
          productId: this.productData.id,
          userId
        }
        this.product.addToCart(cartData).subscribe((result) => {
          if (result) {
            this.product.getCartList(userId);
            this.removeCart = true
          }
        })
      }

    }
  }
  removeToCart(productId: number) {
    if (!localStorage.getItem('user')) {
      this.product.removeItemFromCart(productId)
    } else {
      console.warn("cartData", this.cartData);

      this.cartData && this.product.removeToCart(this.cartData.id)
        .subscribe((result) => {
          let user = localStorage.getItem('user');
          let userId = user && JSON.parse(user).id;
          this.product.getCartList(userId)
        })
    }
    this.removeCart = false
  }

}
