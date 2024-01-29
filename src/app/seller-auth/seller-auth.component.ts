import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { User } from '../data-type';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent implements OnInit {

  showLogin = false;
  authError: String = '';
  constructor(private seller: SellerService) { }

  ngOnInit(): void {
    this.seller.reloadSeller()
  }
  login(data: User): void {
    this.seller.userLogin(data);
    this.seller.isLoginError.subscribe((isError) => {
      if (isError) {
        this.authError = "Email or password is not correct";
      }
    })
  }
  openLogin() {
    this.showLogin = true
  }
  openSignUp() {
    this.showLogin = false
  }
}
