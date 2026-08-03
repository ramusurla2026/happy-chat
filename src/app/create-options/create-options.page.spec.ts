import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOptionsPage } from './create-options.page';

describe('CreateOptionsPage', () => {
  let component: CreateOptionsPage;
  let fixture: ComponentFixture<CreateOptionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
