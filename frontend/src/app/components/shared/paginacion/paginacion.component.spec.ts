import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginacionComponent } from './paginacion.component';

describe('PaginacionComponent', () => {
  let component: PaginacionComponent;
  let fixture: ComponentFixture<PaginacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
