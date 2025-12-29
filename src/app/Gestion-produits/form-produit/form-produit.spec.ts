import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProduit } from './form-produit';

describe('FormProduit', () => {
  let component: FormProduit;
  let fixture: ComponentFixture<FormProduit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProduit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProduit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
