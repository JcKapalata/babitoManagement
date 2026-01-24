import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAgents } from './liste-agents';

describe('ListeAgents', () => {
  let component: ListeAgents;
  let fixture: ComponentFixture<ListeAgents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeAgents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeAgents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
