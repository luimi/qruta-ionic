import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NearRoutesPage } from './near-routes.page';

describe('NearRoutesPage', () => {
  let component: NearRoutesPage;
  let fixture: ComponentFixture<NearRoutesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NearRoutesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
