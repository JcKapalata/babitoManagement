import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutProduit } from './ajout-produit';

describe('AjoutProduit', () => {
  let component: AjoutProduit;
  let fixture: ComponentFixture<AjoutProduit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutProduit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutProduit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
