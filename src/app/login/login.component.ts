import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { CartItem, LoginCredentials, Product, User } from '../data-type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showLogin: boolean = true
  authError: string = "";
  constructor(private user: UserService, private product: ProductService) { }

  ngOnInit(): void {
    this.user.userAuthReload();
  }

  signUp(data: User) {
    this.user.userSignUp(data);
  }
  login(data: LoginCredentials) {
    this.user.userLogin(data)
    this.user.invalidUserAuth.subscribe((result) => {
      if (result) {
        this.authError = "Tài khoản hoặc mật khẩu sai!"
        alert("Hãy thử lại!")
      }
      else {
        this.localCartToRemoteCart();
        alert("Đăng nhập thành công!")
      }

    })
  }
  localCartToRemoteCart() {
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if (data) {
      let cartDataList: Product[] = JSON.parse(data);

      cartDataList.forEach((product: Product, index) => {
        let cartData: CartItem = {
          ...product,
          productId: product.id,
          userId
        }
        setTimeout(() => {
          this.product.addToCart(cartData).subscribe((result) => {
            if (result) {
              console.warn("data is stored in DB");
            }
          })
        }, 500);
        if (cartDataList.length === index + 1) {
          localStorage.removeItem('localCart')
        }
      })
    }

    setTimeout(() => {
      this.product.getCartList(userId)
    }, 2000);

  }
}
