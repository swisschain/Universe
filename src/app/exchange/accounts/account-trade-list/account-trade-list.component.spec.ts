import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTradeListComponent } from './account-trade-list.component';

describe('AccountTradeListComponent', () => {
  let component: AccountTradeListComponent;
  let fixture: ComponentFixture<AccountTradeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountTradeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTradeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
