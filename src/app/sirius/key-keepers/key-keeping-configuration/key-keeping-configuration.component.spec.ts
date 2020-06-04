import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyKeepingConfigurationComponent } from './key-keeping-configuration.component';

describe('KeyKeepingConfigurationComponent', () => {
  let component: KeyKeepingConfigurationComponent;
  let fixture: ComponentFixture<KeyKeepingConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyKeepingConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyKeepingConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
