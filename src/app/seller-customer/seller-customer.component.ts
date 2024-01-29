import { Component, OnInit } from '@angular/core';
import { User } from './../data-type';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-seller-customer',
  templateUrl: './seller-customer.component.html',
  styleUrls: ['./seller-customer.component.css']
})
export class SellerCustomerComponent implements OnInit {
  UserList: User[] | undefined;
  searchText = '';
  totalRecords: any | String;
  page: number = 1;
  itemsPerPage: number = 5;
  selectedItemsPerPage: number[] = [5, 10, 15, 20];
  currentSortColumn: string = '';
  isSortAscending: boolean = true;


  constructor(private userService: UserService) { }
  ngOnInit(): void {
    this.getCustomerList();
  }
  onChangeItemsPerPage(event: any) {
    this.itemsPerPage = parseInt(event.target.value);
    this.page = 1;
    this.getCustomerList();
  }
  getCustomerList() {
    this.userService.getCustomerList().subscribe((data) => {
      if (data) {
        this.UserList = data;
        this.totalRecords = data.length;

      }
    })
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
  sort(column: string) {
    if (column === this.currentSortColumn) {
      // đảo ngược thứ tự xếp nếu bấm cùng cột
      this.isSortAscending = !this.isSortAscending;
    } else {
      // Set the new column for sorting
      this.currentSortColumn = column;
      this.isSortAscending = true;
    }

    this.UserList = this.UserList?.sort((a, b) => {
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
    if (!this.UserList || this.UserList.length === 0) {
      return 0;
    }
    return (this.page - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    if (!this.UserList || this.UserList.length === 0) {
      return 0;
    }
    const endIndex = this.page * this.itemsPerPage;
    return endIndex > this.totalRecords ? this.totalRecords : endIndex;
  }
}
