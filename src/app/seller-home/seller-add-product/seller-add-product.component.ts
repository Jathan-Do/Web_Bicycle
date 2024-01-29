import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { Category, Product } from '../../data-type';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css'],
})
export class SellerAddProductComponent implements OnInit {
  addProductMessage: string | undefined;
  color: string | undefined;
  categories: any;
  constructor(private productService: ProductService, private router: Router, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategory().subscribe((data) => this.categories = data);
  }

  submit(data: Product): void {
    data.cateId = +data.cateId; // Convert to number

    this.productService.addProduct(data).subscribe((result: any) => {
      if (result) {
        const productId = result.id; // Get the ID of the newly added product

        this.categoryService.getCategoryById(+data.cateId).subscribe((category: any) => {
          if (category) {
            // Create a new product object with an ID
            const productToAdd: Product = { ...data, id: productId };

            category.products.push(productToAdd); // Add the product to the category's list of products
            this.categoryService.updateCategory(category).subscribe((updateResult: any) => {
              if (updateResult) {
                this.addProductMessage = 'Thêm thành công';
                alert('Thêm sản phẩm thành công!');
                this.router.navigate(['/seller-home']);
              } else {
                // Handle error when updating category
                alert('Có lỗi xảy ra khi cập nhật danh mục!');
              }
            });
          } else {
            // Handle error when retrieving category
            alert('Không tìm thấy danh mục sản phẩm!');
          }
        });

      } else {
        // Handle error when adding product
        alert('Có lỗi xảy ra khi thêm sản phẩm!');
      }
    });
  }

  updateDropdownName(selectElement: HTMLSelectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex].text;
    selectElement.setAttribute("name", selectedOption);
  }
}
