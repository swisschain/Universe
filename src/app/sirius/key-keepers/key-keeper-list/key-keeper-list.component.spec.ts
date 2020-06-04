import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyKeeperListComponent } from './key-keeper-list.component';

describe('KeyKeeperListComponent', () => {
  let component: KeyKeeperListComponent;
  let fixture: ComponentFixture<KeyKeeperListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyKeeperListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyKeeperListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
