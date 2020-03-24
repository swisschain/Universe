import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPairsListComponent } from './asset-pairs-list.component';

describe('AssetPairsListComponent', () => {
  let component: AssetPairsListComponent;
  let fixture: ComponentFixture<AssetPairsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetPairsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPairsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
