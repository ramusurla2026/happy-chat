import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';
import { Toast } from 'src/app/core/services/toast';
import { Auth } from 'src/app/core/services/auth';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonInput,
    IonButton,
  ],
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignUpPage {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private api: Auth, private toastservice: Toast) {
    this.form = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ]
    });
  }

  goBack(): void {
    this.router.navigateByUrl('/welcome');
  }

  onOpenTerms(): void {
    this.router.navigateByUrl('/terms-of-service');
  }

  onOpenPrivacy(): void {
    this.router.navigateByUrl('/privacy-policy');
  }

  onContinue(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.api.signup(this.form.value).subscribe({
      next: async (res) => {
        if (res.success) {
          await this.toastservice.show(res.message, 'success');
          this.router.navigate(['/verification-otp'], {
            state: {
              type: 'register',
              email: res.data.email
            }
          });
        }
        this.api.saveTokens(
          res.accessToken,
          res.refreshToken
        );
      },
      error: async (err) => {
       

      }
    });
  }

  onLogIn(): void {
    this.router.navigateByUrl('/login');
  }
}