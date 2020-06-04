import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyKeeperEditDialogComponent } from './key-keeper-edit.dialog.component';

describe('KeyKeeperEditDialogComponent', () => {
  let component: KeyKeeperEditDialogComponent;
  let fixture: ComponentFixture<KeyKeeperEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyKeeperEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyKeeperEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
