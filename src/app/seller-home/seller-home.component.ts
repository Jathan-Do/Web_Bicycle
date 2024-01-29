import { Component, OnInit } from '@angular/core';
import { Category, Product } from '../data-type';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { CategoryService } from './../services/category.service';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit {
  productList:  Product[] | undefined;
  productMessage: undefined | string;

  searchText = '';
  totalRecords: any | String;
  page: number = 1;
  itemsPerPage: number = 5;
  selectedItemsPerPage: number[] = [5, 10, 15, 20];
  currentSortColumn: string = '';
  isSortAscending: boolean = true;
  pro: Product | undefined;
  categories?: Category[];
  constructor(private product: ProductService, private order: OrderService, private categoryService: CategoryService) { }
  ngOnInit(): void {
    this.list();
    this.categoryService.getCategory().subscribe((data)=> this.categories = data);
  }
  
  deleteProduct(id: number) {
    // Hiển thị hộp thoại xác nhận
    const userConfirmed = confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');
    if (userConfirmed) {
      this.order.orderList().subscribe((orders) => {
        const productInOrder = orders.some(order => order.orderDetails.some(detail => detail.productId === id));
        if (productInOrder) {
          this.productMessage = 'Sản phẩm không thể xóa vì đã được đặt hàng';
          alert("Sản phẩm không thể xóa vì đã được đặt hàng")
        } else {
          // Lấy sản phẩm cần xóa
          this.product.getProduct(id.toString()).subscribe((data) => {
            this.pro = data;

            if (this.pro && this.pro.cateId) {
              // Lấy danh mục chứa sản phẩm
              this.categoryService.getCategoryById(this.pro.cateId).subscribe((category) => {
                if (category) {
                  const updatedProducts = category.products.filter(p => p.id !== id);
                  category.products = updatedProducts;

                  // Cập nhật danh mục
                  this.categoryService.updateCategory(category).subscribe((result) => {
                    if (result) {
                      // Xóa sản phẩm
                      this.product.deleteProduct(id).subscribe((deleteResult) => {
                        if (deleteResult) {
                          this.productMessage = 'Sản phẩm đã được xóa';
                          alert('Xóa thành công!');
                          this.list();
                        }
                      });
                    }
                  });
                }
              });
            } else {
              alert('Không thể xóa sản phẩm do dữ liệu không hợp lệ');
            }
          });
        }
      });
    }
  }
  onChangeItemsPerPage(event: any) {
    this.itemsPerPage = parseInt(event.target.value);
    this.page = 1;
    this.list();
  }
  getCategoryById(categoryId: number): Category | undefined {
    return this.categories?.find(category => category.id === categoryId);
  }
  list() {
    this.product.productList().subscribe((result) => {
      if (result) {
        this.productList = result;
        this.totalRecords = result.length;
      }
    });
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

    this.productList = this.productList?.sort((a, b) => {
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
    if (!this.productList || this.productList.length === 0) {
      return 0;
    }
    return (this.page - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    if (!this.productList || this.productList.length === 0) {
      return 0;
    }
    const endIndex = this.page * this.itemsPerPage;
    return endIndex > this.totalRecords ? this.totalRecords : endIndex;
  }
}
