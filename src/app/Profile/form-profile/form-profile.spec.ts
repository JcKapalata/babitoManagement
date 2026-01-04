import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProfile } from './form-profile';

describe('FormProfile', () => {
  let component: FormProfile;
  let fixture: ComponentFixture<FormProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
