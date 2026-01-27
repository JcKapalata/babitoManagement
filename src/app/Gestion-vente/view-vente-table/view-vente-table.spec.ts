import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVenteTable } from './view-vente-table';

describe('ViewVenteTable', () => {
  let component: ViewVenteTable;
  let fixture: ComponentFixture<ViewVenteTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewVenteTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVenteTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
