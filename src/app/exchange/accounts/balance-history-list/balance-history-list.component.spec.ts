import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceHistoryListComponent } from './balance-history-list.component';

describe('BalanceHistoryListComponent', () => {
  let component: BalanceHistoryListComponent;
  let fixture: ComponentFixture<BalanceHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
