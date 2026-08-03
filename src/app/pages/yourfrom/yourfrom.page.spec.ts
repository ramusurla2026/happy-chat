import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YourfromPage } from './yourfrom.page';

describe('YourfromPage', () => {
  let component: YourfromPage;
  let fixture: ComponentFixture<YourfromPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(YourfromPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
