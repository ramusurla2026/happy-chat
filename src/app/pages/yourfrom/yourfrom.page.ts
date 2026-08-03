import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonButton,

} from '@ionic/angular/standalone';   // ✅ IonicModule బదులు ఇది

const MIN_INTERESTS = 5;

@Component({
  selector: 'app-yourfrom',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
   
  ],   // ✅ template లో వాడని వాటిని తీసేయండి, వాడని కొత్తవి unte add cheయండి
  templateUrl: './yourfrom.page.html',
  styleUrls: ['./yourfrom.page.scss'],
})
export class YourfromPage {
  minInterests = MIN_INTERESTS;

  interests: string[] = [
    'Fitness', 'Photography', 'Travel',
    'Coding', 'Movies', 'Fashion',
    'Technology', 'Music', 'Gaming',
    'Food', 'Art', 'Sports',
    'Science', 'Books',
  ];

  selectedInterests = new Set<string>();

  constructor(private router: Router) {}

  get selectedCount(): number {
    return this.selectedInterests.size;
  }

  get isValid(): boolean {
    return this.selectedCount >= this.minInterests;
  }

  isSelected(interest: string): boolean {
    return this.selectedInterests.has(interest);
  }

  toggleInterest(interest: string): void {
    if (this.selectedInterests.has(interest)) {
      this.selectedInterests.delete(interest);
    } else {
      this.selectedInterests.add(interest);
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/profile-setup');
  }

  onExplore(): void {
    if (!this.isValid) {
      return;
    }
    console.log('Selected interests', Array.from(this.selectedInterests));
    this.router.navigateByUrl('/suggestfriends');
  }
}