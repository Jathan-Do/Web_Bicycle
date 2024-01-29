import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../data-type';
import { ProductService } from '../../services/product.service';
import { Category } from 'src/app/data-type';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css'],
})
export class SellerUpdateProductComponent implements OnInit {
  productData: Product | undefined;
  productMessage: string | undefined;
  categories: Category[] | undefined;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private category: CategoryService
  ) { }

  ngOnInit(): void {
    this.fetchProductData();
    this.category.getCategory().subscribe(
      (data: Category[]) => {
        this.categories = data;
      });
  }

  fetchProductData(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProduct(productId).subscribe(
        (data: Product) => {
          this.productData = data;
          this.productData.cateId = data.cateId;
        },
        (error: any) => {
          console.error('Error fetching product data:', error);
          this.productData = undefined;
        }
      );
    }
  }

  submit(data: Product): void {
    if (this.productData && this.productData.cateId !== undefined) {
      data.id = +this.productData.id;
      const categoryId: number = +this.productData.cateId;
      data.cateId = +data.cateId;
      this.productService.updateProduct(data).subscribe((result) => {
        if (result) {
          if (data.cateId !== categoryId) {
            this.category.getCategoryById(categoryId).subscribe((oldCategory) => {
              if (oldCategory) {
                const index = oldCategory.products.findIndex((p) => p.id === data.id);
                if (index !== -1) {
                  const removedProduct = oldCategory.products.splice(index, 1)[0]; // Remove and get removed product
                  this.category.updateCategory(oldCategory).subscribe((updateResult) => {
                    if (updateResult) {
                      this.category.getCategoryById(data.cateId).subscribe((newCategory) => {
                        if (newCategory) {
                          newCategory.products.push(removedProduct); // Push removed product to new category
                          this.category.updateCategory(newCategory).subscribe((updateCategoryResult) => {
                            if (updateCategoryResult) {
                              alert("Cập nhật sản phẩm và danh mục thành công!");
                              this.router.navigate(['/seller-home']);
                            } else {
                              alert("Có lỗi khi cập nhật danh mục mới!");
                            }
                          });
                        } else {
                          alert("Không tìm thấy danh mục mới!");
                        }
                      });
                    } else {
                      alert("Có lỗi khi cập nhật danh mục cũ!");
                    }
                  });
                } else {
                  // Product not found in the old category, proceed to add to the new category
                  this.category.getCategoryById(data.cateId).subscribe((newCategory) => {
                    if (newCategory) {
                      newCategory.products.push(data); // Add product directly to the new category
                      this.category.updateCategory(newCategory).subscribe((updateCategoryResult) => {
                        if (updateCategoryResult) {
                          alert("Thêm sản phẩm vào danh mục mới thành công!");
                          this.router.navigate(['/seller-home']);
                        } else {
                          alert("Có lỗi khi thêm sản phẩm vào danh mục mới!");
                        }
                      });
                    } else {
                      alert("Không tìm thấy danh mục mới!");
                    }
                  });
                }
              } else {
                alert("Không tìm thấy danh mục cũ!");
              }
            });
          } else {
            alert("Cập nhật sản phẩm thành công!");
            this.router.navigate(['/seller-home']);
          }
        } else {
          alert("Có lỗi khi cập nhật sản phẩm!");
        }
      });
    }
  }
  updateImage(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const imageUrl = inputElement.value;

    // Assuming you have a productData instance
    if (this.productData) {
      this.productData.image = imageUrl;
    }
  }

}
