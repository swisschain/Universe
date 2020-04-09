import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBalanceHistoryListComponent } from './account-balance-history-list.component';

describe('AccountBalanceHistoryListComponent', () => {
  let component: AccountBalanceHistoryListComponent;
  let fixture: ComponentFixture<AccountBalanceHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountBalanceHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBalanceHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
