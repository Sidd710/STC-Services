import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminViewComplainPage } from './admin-view-complain.page';

describe('AdminViewComplainPage', () => {
  let component: AdminViewComplainPage;
  let fixture: ComponentFixture<AdminViewComplainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewComplainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
