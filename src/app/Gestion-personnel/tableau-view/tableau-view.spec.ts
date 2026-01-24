import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauView } from './tableau-view';

describe('TableauView', () => {
  let component: TableauView;
  let fixture: ComponentFixture<TableauView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableauView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableauView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
