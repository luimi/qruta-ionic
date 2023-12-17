import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenancePage } from './maintenance.page';

describe('MaintenancePage', () => {
  let component: MaintenancePage;
  let fixture: ComponentFixture<MaintenancePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MaintenancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
