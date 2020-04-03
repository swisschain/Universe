import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDetailsDialogComponent } from './asset-details.dialog.component';

describe('AssetDetailsDialogComponent', () => {
  let component: AssetDetailsDialogComponent;
  let fixture: ComponentFixture<AssetDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
