import { Component, OnInit } from '@angular/core';
import { Category } from '../data-type';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-seller-category',
  templateUrl: './seller-category.component.html',
  styleUrls: ['./seller-category.component.css']
})
export class SellerCategoryComponent implements OnInit {
  categories: Category[] | undefined;
  selectedCategory: Category = { id: 0, name: '', products: [] };
  isEditing = false;
  searchText= '';
  totalRecords: any | String;
  page: number = 1;
  itemsPerPage: number = 5;
  selectedItemsPerPage: number[] = [5, 10, 20, 50, 100]; 
  currentSortColumn: string = '';
  isSortAscending: boolean = true;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }
  onChangeItemsPerPage(event: any) {
    this.itemsPerPage = parseInt(event.target.value);
    this.page = 1;
    this.loadCategories();
  }
  loadCategories(): void {
    this.categoryService.getCategory().subscribe((categories) => {
      if (categories) {
        this.categories = categories;
        this.totalRecords = categories.length;
      }
    });
  }

  selectCategory(category: Category): void {
    this.selectedCategory = { ...category };
    this.isEditing = true;
  }

  addCategory(category: Category): void {
    this.categoryService.addCategory(category).subscribe(() => {
      this.loadCategories();
      alert("Thêm danh mục thành công!");
    });
  }

  updateCategory(): void {
    this.categoryService.updateCategory(this.selectedCategory).subscribe(() => {
      this.isEditing = false;
      this.selectedCategory = { id: 0, name: '', products: [] };
      this.loadCategories();
      alert("Cập nhật danh mục thành công!");
    });
  }

  deleteCategory(id: number): void {
    const userConfirmed = confirm('Bạn có chắc chắn muốn xóa danh mục này?');

    if (userConfirmed) {
      this.categoryService.getCategoryById(id).subscribe((data) => {
        if (data.products.length === 0) {
          this.categoryService.deleteCategory(id).subscribe(() => {
            this.loadCategories();
            alert("Xóa danh mục thành công!");
          });
        }
        else {
          alert("Không thể xóa vì có sản phẩm thuộc danh mục!");
        }
      })
    }
    else {
    }

  }

  cancelEditing(): void {
    this.isEditing = false;
    this.selectedCategory = { id: 0, name: '', products: [] };
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

    this.categories = this.categories?.sort((a, b) => {
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
    if (!this.categories || this.categories.length === 0) {
      return 0;
    }
    return (this.page - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    if (!this.categories || this.categories.length === 0) {
      return 0;
    }
    const endIndex = this.page * this.itemsPerPage;
    return endIndex > this.totalRecords ? this.totalRecords : endIndex;
  }
}
