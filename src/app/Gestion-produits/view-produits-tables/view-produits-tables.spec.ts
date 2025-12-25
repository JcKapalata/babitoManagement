import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProduitsTables } from './view-produits-tables';

describe('ViewProduitsTables', () => {
  let component: ViewProduitsTables;
  let fixture: ComponentFixture<ViewProduitsTables>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProduitsTables]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProduitsTables);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
