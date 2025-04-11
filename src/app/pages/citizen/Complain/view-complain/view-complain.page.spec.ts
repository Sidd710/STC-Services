import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewComplainPage } from './view-complain.page';

describe('ViewComplainPage', () => {
  let component: ViewComplainPage;
  let fixture: ComponentFixture<ViewComplainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComplainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
