import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletEditDialogComponent } from './wallet-edit.dialog.component';

describe('WalletEditDialogComponent', () => {
  let component: WalletEditDialogComponent;
  let fixture: ComponentFixture<WalletEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
