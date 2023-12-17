import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoutePage } from './route.page';

describe('RoutePage', () => {
  let component: RoutePage;
  let fixture: ComponentFixture<RoutePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RoutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
