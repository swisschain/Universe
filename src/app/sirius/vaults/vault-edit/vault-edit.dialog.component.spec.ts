import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultEditDialogComponent } from './vault-edit.dialog.component';

describe('VaultEditDialogComponent', () => {
  let component: VaultEditDialogComponent;
  let fixture: ComponentFixture<VaultEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaultEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
