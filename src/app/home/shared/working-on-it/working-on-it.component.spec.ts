import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingOnItComponent } from './working-on-it.component';

describe('WorkingOnItComponent', () => {
  let component: WorkingOnItComponent;
  let fixture: ComponentFixture<WorkingOnItComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingOnItComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingOnItComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
