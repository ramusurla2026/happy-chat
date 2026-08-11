import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';

import { Auth } from 'src/app/core/services/auth';
import { Toast } from 'src/app/core/services/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonInput,
    IonButton
  ]
})
export class LoginPage {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: Auth,
    private toast: Toast
  ) {

    this.form = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]

    });

  }

  goBack() {
    this.router.navigateByUrl('/welcome');
  }

  onSignUp() {
    this.router.navigateByUrl('/signup');
  }

  onContinue() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.api.login(this.form.value).subscribe({

      next: (res: any) => {

        if (res.success) {

          // this.toast.show(res.message, 'success');

          this.router.navigate(['/verification-otp'], {
            state: {
              type: 'login',
              email: this.form.value.email
            }
          });

        }

      },

      error:(err) => {

        // this.toast.show(
        //   err.error?.message || 'Something went wrong',
        //   'danger'
        // );

      }

    });

  }

}