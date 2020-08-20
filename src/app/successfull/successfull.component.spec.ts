import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfullComponent } from './successfull.component';

describe('SuccessfullComponent', () => {
  let component: SuccessfullComponent;
  let fixture: ComponentFixture<SuccessfullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessfullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessfullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
