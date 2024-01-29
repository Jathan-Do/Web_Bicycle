import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Order, Product, User } from '../data-type';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderData: Order[] | undefined
  products: Product[] = [];
  currentUser: User | undefined;
  editingProfile = false;
  editedUser: User = {
    name: '', phone: '', email: '', password: '', id: 0, points: 0
  };
  constructor(private product: ProductService, private order: OrderService, private userService: UserService, private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit(): void {
    this.getOrderList();
    this.product.productList().subscribe((result) => {
      this.products = result;
    });
    this.getUser();
  }
  getUser() {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      const userId = currentUser.id; // Lấy ID của người dùng từ thông tin hiện tại
      this.userService.getUser(userId).subscribe((userDetails) => {
        this.currentUser = userDetails;
      });
    }
  }
  cancelOrder(orderId: number | undefined) {
    const userConfirmed = confirm('Bạn có chắc chắn hủy đơn hàng này?\nBạn sẽ mất số điểm tích lũy của đơn!');
    if (userConfirmed) {
      orderId && this.order.cancelOrder(orderId).subscribe((result) => {
        if (result) {
          alert("Hủy đơn thành công!");
          window.location.reload();
        }
      })
    }
  }
  getOrderList() {
    this.order.orderListUser().subscribe((result) => {
      this.orderData = result;
    })
  }
  getProductById(productId: number): Product | undefined {
    return this.products.find(product => product.id === productId);
  }
  onFileInputChange(event: any): void {
    const selectedImage = this.el.nativeElement.querySelector('.imageLoad');
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.renderer.setAttribute(selectedImage, 'src', e.target?.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  // Mở form chỉnh sửa
  editProfile(): void {
    this.editingProfile = true;
    // Lưu thông tin người dùng hiện tại vào biến editedUser
    this.editedUser = {
      name: this.currentUser?.name || '',
      phone: this.currentUser?.phone || '',
      email: this.currentUser?.email || '',
      password: this.currentUser?.password || '',
      id: this.currentUser?.id || 0,
      points: this.currentUser?.points || 0
    };
  }
  // Cập nhật thông tin tài khoản
  updateProfile(): void {
    this.userService.updateUserProfile(this.editedUser).subscribe(
      (updatedUser: User) => {
        this.currentUser = updatedUser;
        this.editingProfile = false;
        alert("Chỉnh sửa thành công!")
      },
      (error) => {
        console.error('Error updating user profile:', error);
      }
    );
  }
  getRank(points: number): string {
    if (points < 5000) {
      return 'Đồng';
    } else if (points >= 5000 && points < 10000) {
      return 'Bạc';
    } else {
      return 'Vàng';
    }
  }
}


