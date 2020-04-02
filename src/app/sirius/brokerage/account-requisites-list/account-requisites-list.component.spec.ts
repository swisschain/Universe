import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRequisitesListComponent } from './account-requisites-list.component';

describe('AccountRequisitesListComponent', () => {
  let component: AccountRequisitesListComponent;
  let fixture: ComponentFixture<AccountRequisitesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountRequisitesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRequisitesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
