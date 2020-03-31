import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerAccountEditDialogComponent } from './broker-account-edit.dialog.component';

describe('BrokerAccountEditDialogComponent', () => {
  let component: BrokerAccountEditDialogComponent;
  let fixture: ComponentFixture<BrokerAccountEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerAccountEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerAccountEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
