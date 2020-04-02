import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPairDetailsDialogComponent } from './asset-pair-details.dialog.component';

describe('AssetPairDetailsComponent', () => {
  let component: AssetPairDetailsDialogComponent;
  let fixture: ComponentFixture<AssetPairDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetPairDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPairDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
