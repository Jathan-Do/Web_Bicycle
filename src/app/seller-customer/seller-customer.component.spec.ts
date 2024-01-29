import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerCustomerComponent } from './seller-customer.component';

describe('SellerCustomerComponent', () => {
  let component: SellerCustomerComponent;
  let fixture: ComponentFixture<SellerCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerCustomerComponent]
    });
    fixture = TestBed.createComponent(SellerCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
