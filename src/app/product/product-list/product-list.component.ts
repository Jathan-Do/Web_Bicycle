import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/data-type';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  searchKey: string = "";
  filterCategory: any;
  trendyProducts: any | Product[];
  totalRecords: any | String;
  page: any | Number = 1;

  categoryData: any;
  constructor(private product: ProductService, private category: CategoryService) { }

  ngOnInit(): void {
    this.product.trendyProducts().subscribe((data) => {
      this.trendyProducts = data;
      this.filterCategory = data;
    });
    this.category.getCategory().subscribe((data) => {
      this.categoryData = data;
    })
  }
  filter(categoryId: number) {
    if (categoryId === 0) {
      this.filterCategory = this.trendyProducts;
    } else {
      this.filterCategory = this.trendyProducts.filter((product: Product) => {
        return product.cateId === categoryId;
      });
    }
  }
}
