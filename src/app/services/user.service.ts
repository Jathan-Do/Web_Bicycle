import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginCredentials, User } from '../data-type';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  invalidUserAuth = new EventEmitter<boolean>(false)
  constructor(private http: HttpClient, private router: Router) { }
  userSignUp(user: User) {
    this.http.post('http://localhost:3000/users', user, { observe: 'response' })
      .subscribe((result) => {
        if (result) {
          localStorage.setItem('user', JSON.stringify(result.body));
          this.router.navigate(['/']);
        }

      })

  }
  userLogin(data: LoginCredentials) {
    this.http.get<User[]>(`http://localhost:3000/users?email=${data.email}&password=${data.password}`,
      { observe: 'response' }
    ).subscribe((result) => {
      if (result && result.body?.length) {
        localStorage.setItem('user', JSON.stringify(result.body[0]));
        this.router.navigate(['/']);
        this.invalidUserAuth.emit(false)
      } else {
        this.invalidUserAuth.emit(true)
      }
    })
  }

  userAuthReload() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/']);
    }
  }
  getCurrentUser() {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  }

  getUser(userId: number) {
    return this.http.get<User>(`http://localhost:3000/users/${userId}`);
  }
  getCustomerList() {
    return this.http.get<User[]>('http://localhost:3000/users');
  }
  updateUserPoints(userId: number, addPoints: number, minusPoint: number) {
    return this.getUser(userId).pipe(
      switchMap((user: User) => {
        user.points += addPoints;
        user.points -= minusPoint;
        return this.http.put(`http://localhost:3000/users/${userId}`, user);
      })
    );
  }
  updateUserProfile(user: User): Observable<User> {
    const userId = user.id;
    const { id, ...userData } = user;
    return this.http.put<User>('http://localhost:3000/users/' + userId, userData);
  }
}
