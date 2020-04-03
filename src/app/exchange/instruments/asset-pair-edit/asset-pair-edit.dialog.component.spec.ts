import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPairEditDialogComponent } from './asset-pair-edit.dialog.component';

describe('AssetPairEditDialogComponent', () => {
  let component: AssetPairEditDialogComponent;
  let fixture: ComponentFixture<AssetPairEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetPairEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPairEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
