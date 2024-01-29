
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SellerAuthComponent } from './seller-auth/seller-auth.component';
import { SellerHomeComponent } from './seller-home/seller-home.component';
import { ProductComponent } from './product/product.component';
import { LoginComponent } from './login/login.component';

import { RegisterComponent } from './register/register.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductItemComponent } from './product/product-list/product-item/product-item.component';
import { CartComponent } from './cart/cart.component';
import { SearchComponent } from './search/search.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderComponent } from './order/order.component';
import { FilterPipe } from './filter.pipe';
import{NgxPaginationModule} from 'ngx-pagination';
import { SellerOrderComponent } from './seller-order/seller-order.component';
import { SellerCustomerComponent } from './seller-customer/seller-customer.component';
import { SellerUpdateProductComponent } from './seller-home/seller-update-product/seller-update-product.component';
import { SellerAddProductComponent } from './seller-home/seller-add-product/seller-add-product.component';
import { SellerCategoryComponent } from './seller-category/seller-category.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SellerAuthComponent,
    SellerHomeComponent,
    ProductComponent,
    LoginComponent,
    RegisterComponent,
    ProductListComponent,
    ProductItemComponent,
    CartComponent,
    SellerUpdateProductComponent,
    SellerAddProductComponent,
    SearchComponent,
    CheckoutComponent,
    OrderComponent,
    FilterPipe,
    SellerOrderComponent,
    SellerCustomerComponent,
    SellerCategoryComponent,
    SellerDashboardComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    CanvasJSAngularChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
