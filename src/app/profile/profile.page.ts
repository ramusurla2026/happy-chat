import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonAvatar, IonRefresher,
  IonRefresherContent,
  IonActionSheet
} from '@ionic/angular/standalone';

// import { ActionSheetController } from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  settingsOutline,
  logOutOutline,
  gridOutline,
  videocamOutline,
  personOutline,
  imagesOutline
} from 'ionicons/icons';
import { Api } from '../core/services/api';

addIcons({
  'arrow-back-outline': arrowBackOutline,
  'settings-outline': settingsOutline,
  'log-out-outline': logOutOutline,
  'grid-outline': gridOutline,
  'videocam-outline': videocamOutline,
  'person-outline': personOutline,
  'images-outline': imagesOutline
});

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonRefresher,
    IonRefresherContent,


    IonIcon,
    IonContent,
    IonActionSheet

  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {

  profile: any;
  selectedTab: 'posts' | 'reels' = 'posts';
  userId!: string;

  constructor(
    private router: Router,
    private api: Api,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {

    this.api.get<any>('/users/me')
      .subscribe({
        next: (response) => {
          this.profile = response.data;
          this.userId = this.profile.id;
        },
        error: (error) => {
          console.error(error);
        }
      });

  }

  refresh(event: any) {

    this.getProfile();

    setTimeout(() => {

      event.target.complete();

    }, 700);

  }

  editProfile(id: string) {
    this.router.navigate(['/edit-profile', id]);
  }

  openPost(postId: any, imageIndex: number) {
    this.router.navigate(
      ['/posts'],
      {
        queryParams: {
          userId: this.userId,
          postId: postId.id,
          imageIndex: imageIndex
        }
      }
    );

  }

  goBack() {

    this.router.navigate(['/home']);

  }

  openFollowers(user: any) {
    this.router.navigate(['/followers'], {
      state: {
        userId: user.id
      }
    });
  }

  openFollowing(user: any) {
    this.router.navigate(['/following'],
      {
        state: {
          userId: user.id
        }
      }
    );
  }

  // async showSettings() {

  //   const actionSheet = await this.actionSheetCtrl.create({

  //     header: 'Settings',

  //     buttons: [

  //       {

  //         text: 'Logout',

  //         icon: 'log-out-outline',

  //         role: 'destructive',

  //         handler: () => {

  //           this.logout();

  //         }

  //       },

  //       {

  //         text: 'Cancel',

  //         role: 'cancel'

  //       }

  //     ]

  //   });

  //   await actionSheet.present();

  // }

  isSettingsOpen = false;

  showSettings(): void {
    this.isSettingsOpen = true;
  }

  handleSettingsAction(event: any): void {
    const role = event.detail.role;

    if (role === 'destructive') {
      this.logout();
    }

    this.isSettingsOpen = false;
  }

  openReel(reel: any) {

    this.router.navigate(
      ['/reels'],
      {
        queryParams: {
          userId: reel.author.id,
          reelId: reel.id
        }
      }
    );

  }

  logout() {

    localStorage.removeItem('accessToken');

    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.reload();
    this.router.navigate(['/']);

  }

}