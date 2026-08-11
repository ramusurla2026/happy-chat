import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';
import { Api } from 'src/app/core/services/api';
import { Toast } from 'src/app/core/services/toast';
import { Auth } from 'src/app/core/services/auth';
import { Location } from '@angular/common';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 58;

@Component({
  selector: 'app-verification-otp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
  ],   // ✅ template లో వాడిన అన్ని ion-tags ఇక్కడ ఉండాలి
  templateUrl: './verification-otp.page.html',
  styleUrls: ['./verification-otp.page.scss'],
})
export class VerificationOtpPage implements OnInit, OnDestroy {
  @ViewChild('hiddenInput') hiddenInput!: ElementRef<HTMLInputElement>;

  code = '';
  email = '';
  type = '';
  codeLength = CODE_LENGTH;
  focused = false;
  secondsLeft = RESEND_SECONDS;
  private timerHandle: ReturnType<typeof setInterval> | null = null;
  isOtpInvalid = false;

  constructor(private router: Router, private apiservice: Api, private toast: Toast, private auth: Auth, private location: Location) { }

  ngOnInit(): void {
    console.log('OTP PAGE');
    this.startTimer();
    const state = history.state;

    if (state?.email) {
      this.email = state.email;
    }
    if (state?.type) {
      this.type = state.type;
    }

    this.type = state.type;
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  get digits(): string[] {
    return new Array(CODE_LENGTH).fill('').map((_, i) => this.code[i] ?? '');
  }

  get formattedTime(): string {
    const m = Math.floor(this.secondsLeft / 60);
    const s = this.secondsLeft % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  get isComplete(): boolean {
    return this.code.length === CODE_LENGTH;
  }


  goBack(): void {
    this.location.back();
  }

  focusHiddenInput(): void {
    this.hiddenInput?.nativeElement.focus();
  }

  onCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH);
    this.code = digitsOnly;
    input.value = digitsOnly;
  }

  onFocus(): void {
    this.focused = true;
  }

  onBlur(): void {
    this.focused = false;
  }

  onVerify(): void {

    if (!this.isComplete) {
      return;
    }

    const payload = {
      email: this.email,
      code: this.code
    };

    if (this.type === 'register') {
      this.apiservice.post('/auth/verify-otp', payload).subscribe({
        next: (res: any) => {
          this.isOtpInvalid = false;
          this.toast.show(res.message, 'success');
          this.auth.saveLogin(res.data);
          this.router.navigate(['/profile-setup'], {
            state: {
              user: res.data.user
            }
          });

        },

        error: (err) => {

          this.isOtpInvalid = true;

          this.code = '';

          this.hiddenInput.nativeElement.value = '';

          this.focusHiddenInput();

          this.toast.show(
            err.error?.message || 'Invalid OTP',
            'danger'
          );

        }

      });
    } else {
      this.apiservice.post('/auth/login/verify', payload).subscribe({
        next: (res: any) => {
          this.isOtpInvalid = false;
          this.toast.show(res.message, 'success');
          this.auth.saveLogin(res.data);
          this.router.navigate(['/home']);

        },

        error: (err) => {

          this.isOtpInvalid = true;

          this.code = '';

          this.hiddenInput.nativeElement.value = '';

          this.focusHiddenInput();

          this.toast.show(
            err.error?.message || 'Invalid OTP',
            'danger'
          );

        }

      });
    }



  }



  onResend(): void {

    if (this.secondsLeft > 0) {
      return;
    }

    const payload = {
      email: this.email
    };

    this.apiservice.post('/auth/resend-otp', payload).subscribe({
      next: (res: any) => {
        this.toast.show(
          res.message,
          'success'
        );
        this.code = '';
        this.hiddenInput.nativeElement.value = '';
        this.focusHiddenInput();
        this.secondsLeft = RESEND_SECONDS;
        this.startTimer();
      },

      error: (err) => {
        this.toast.show(
          err.error?.message || 'Unable to resend OTP',
          'danger'
        );
      }

    });

  }

  private startTimer(): void {
    this.stopTimer();
    this.timerHandle = setInterval(() => {
      if (this.secondsLeft <= 0) {
        this.stopTimer();
        return;
      }
      this.secondsLeft -= 1;
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  }
}