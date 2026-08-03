import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, IonContent, IonButton],
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {
  constructor(private router: Router) {}

  onSignUp(): void {
    this.router.navigateByUrl('/signup');
  }

  onLogIn(): void {
    this.router.navigateByUrl('/login');
  }

  onGoogleContinue(): void {
    // Hook up your Google auth flow here
    console.log('Continue with Google');
  }

  onAppleContinue(): void {
    // Hook up your Apple auth flow here
    console.log('Continue with Apple');
  }

  onOpenTerms(): void {
    this.router.navigateByUrl('/terms-of-service');
  }

  onOpenPrivacy(): void {
    this.router.navigateByUrl('/privacy-policy');
  }
}