import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificationOtpPage } from './verification-otp.page';

describe('VerificationOtpPage', () => {
  let component: VerificationOtpPage;
  let fixture: ComponentFixture<VerificationOtpPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationOtpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
