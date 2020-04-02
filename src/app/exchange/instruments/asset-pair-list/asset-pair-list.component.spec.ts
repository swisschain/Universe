import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPairListComponent } from './asset-pair-list.component';

describe('AssetPairListComponent', () => {
  let component: AssetPairListComponent;
  let fixture: ComponentFixture<AssetPairListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetPairListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPairListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
