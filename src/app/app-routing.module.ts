import { Component, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { SellerAuthComponent } from "./seller-auth/seller-auth.component";
import { SellerHomeComponent } from "./seller-home/seller-home.component";
import { AuthGuard } from "./auth.guard";

import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

import { ProductComponent } from "./product/product.component";
import { CartComponent } from "./cart/cart.component";
import { SearchComponent } from "./search/search.component";
import { ProductItemComponent } from "./product/product-list/product-item/product-item.component";
import { OrderComponent } from "./order/order.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { SellerOrderComponent } from "./seller-order/seller-order.component";
import { SellerCustomerComponent } from "./seller-customer/seller-customer.component";
import { SellerAddProductComponent } from "./seller-home/seller-add-product/seller-add-product.component";
import { SellerUpdateProductComponent } from "./seller-home/seller-update-product/seller-update-product.component";
import { SellerCategoryComponent } from "./seller-category/seller-category.component";
import { SellerDashboardComponent } from "./seller-dashboard/seller-dashboard.component";



const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'seller-auth',
        component: SellerAuthComponent
    },
    {
        path: 'seller-home',
        component: SellerHomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'seller-order',
        component: SellerOrderComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'seller-dashboard',
        component: SellerDashboardComponent
    },

    {
        path: 'product',
        component: ProductComponent

    },
    {
        path: 'details/:productId',
        component: ProductItemComponent
    },
    {
        path: 'cart-page',
        component: CartComponent
    },
    {
        component: SellerAddProductComponent,
        path: 'seller-add-product',
        canActivate: [AuthGuard]
    },
    {
        component: SellerCustomerComponent,
        path: 'seller-customer',
        canActivate: [AuthGuard]
    },
    {
        component: SellerCategoryComponent,
        path: 'seller-category',
        canActivate: [AuthGuard]
    },
    {
        component: SellerUpdateProductComponent,
        path: 'seller-update-product/:id',
        canActivate: [AuthGuard]
    },
    {
        component: SearchComponent,
        path: 'search/:query'
    },
    {
        component: OrderComponent,
        path: 'my-orders'
    }, {
        component: CheckoutComponent,
        path: 'checkout'
    }
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
