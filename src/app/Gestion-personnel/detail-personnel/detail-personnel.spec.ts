import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPersonnel } from './detail-personnel';

describe('DetailPersonnel', () => {
  let component: DetailPersonnel;
  let fixture: ComponentFixture<DetailPersonnel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPersonnel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPersonnel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
