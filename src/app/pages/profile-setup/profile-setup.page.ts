import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonInput,
  IonTextarea,
  IonButton,
  IonAvatar,
} from '@ionic/angular/standalone';
import { Toast } from 'src/app/core/services/toast';
import { Api } from 'src/app/core/services/api';
import { IonIcon } from '@ionic/angular/standalone';
const BIO_MAX_LENGTH = 160;

@Component({
  selector: 'app-profile-setup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonInput,
    IonTextarea,
    IonButton,
  ],
  templateUrl: './profile-setup.page.html',
  styleUrls: ['./profile-setup.page.scss'],
})
export class ProfileSetupPage {
  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;

  form: FormGroup;
  bioMaxLength = BIO_MAX_LENGTH;
  avatarPreviewUrl: string | null = null;
  selectedImage: File | null = null;

  constructor(private fb: FormBuilder, private router: Router, private api: Api, private toast: Toast) {
    this.form = this.fb.group({

      fullName: [
        '',
        [
          Validators.required

        ]
      ],

      username: [
        '',
        [
          Validators.required,

        ]
      ],

      profession: [
        '',
        [
          Validators.required,
        ]
      ],

      bio: [
        '',
        [
          Validators.required,
        ]
      ]

    });
  }

  ngOnInit() {
    const user = history.state.user;

    if (user) {

      this.form.patchValue({

        fullName: user.fullName,
        username: user.username

      });

    }
  }

  get bioLength(): number {
    return (this.form.get('bio')?.value ?? '').length;
  }

  goBack(): void {
    this.router.navigateByUrl('/verification-otp');
  }

  onOpenTerms(): void {
    this.router.navigateByUrl('/terms-of-service');
  }

  triggerAvatarPicker(): void {
    this.avatarInput?.nativeElement.click();
  }

  onAvatarSelected(event: Event): void {

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.selectedImage = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.avatarPreviewUrl = reader.result as string;
    };

    reader.readAsDataURL(file);

  }


  onContinue(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append(
      'fullName',
      this.form.value.fullName
    );

    formData.append(
      'username',
      this.form.value.username
    );

    formData.append(
      'profession',
      this.form.value.profession || ''
    );

    formData.append(
      'bio',
      this.form.value.bio || ''
    );

    formData.append(
      'isPrivate',
      'false'
    );

    if (this.selectedImage) {
      formData.append(
        'profileImage',
        this.selectedImage
      );

    }

    this.api.patch('/users/profile', formData).subscribe({
      next: async (res: any) => {
        await this.toast.show(
          res.message,
          'success'
        );
        this.router.navigate(['/home']);
      },

      error: async (err) => {
        await this.toast.show(
          err.error?.message || 'Something went wrong',
          'danger'
        );
      }

    });

  }
}