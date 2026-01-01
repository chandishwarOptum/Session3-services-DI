import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDependencyExample } from './service-dependency-example';

describe('ServiceDependencyExample', () => {
  let component: ServiceDependencyExample;
  let fixture: ComponentFixture<ServiceDependencyExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceDependencyExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceDependencyExample);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
