import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRequisitesDialogComponent } from './asset-requisites.dialog.component';

describe('AssetRequisitesDialogComponent', () => {
  let component: AssetRequisitesDialogComponent;
  let fixture: ComponentFixture<AssetRequisitesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetRequisitesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetRequisitesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
