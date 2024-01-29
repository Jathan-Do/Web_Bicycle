import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../data-type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) { }

  getCategory() {
    return this.http.get<Category[]>('http://localhost:3000/category');
  }

  getCategoryById(id: number) {
    return this.http.get<Category>('http://localhost:3000/category/' + id);
  }

  addCategory(data: Category) {
    return this.http.post('http://localhost:3000/category', data);
  }

  updateCategory(category: Category) {
    return this.http.put<Category>('http://localhost:3000/category/' + category.id, category);
  }

  deleteCategory(id: number) {
    return this.http.delete('http://localhost:3000/category/' + id);
  }

}
