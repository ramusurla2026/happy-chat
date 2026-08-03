import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { ViewWillLeave } from '@ionic/angular';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonIcon
} from '@ionic/angular/standalone';

import { Api } from '../core/services/api';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  searchOutline,
  peopleOutline
} from 'ionicons/icons';

addIcons({
  'arrow-back-outline': arrowBackOutline,
  'search-outline': searchOutline,
  'people-outline': peopleOutline
});

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonIcon
  ],
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss'],
})
export class FollowingComponent implements OnInit, OnDestroy, ViewWillLeave {
  private destroy$ = new Subject<void>();
  following: any[] = [];
  filteredFollowing: any[] = [];
  searchText = '';
  userId = '';
  constructor(
    private api: Api,
    private router: Router
  ) { }

  ngOnInit() {
    const state = history.state;
    this.userId = state.userId;
    this.getFollowing();

  }

  getFollowing() {

    this.api.get<any>(`/users/${this.userId}/following`)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (res) => {

          this.following = res.data.following.map((user: any) => ({
            ...user,
            followStatus: 'following'
          }));

          this.filteredFollowing = [...this.following];


        },

        error: (err) => {
          console.log(err);
        }

      });

  }

  onSearch(event: any) {

    this.searchText = event.target.value.toLowerCase();

    if (!this.searchText) {

      this.filteredFollowing = [...this.following];

      return;

    }

    this.filteredFollowing = this.following.filter(user =>

      user.username.toLowerCase().includes(this.searchText) ||

      user.fullName.toLowerCase().includes(this.searchText)

    );

  }

  unfollow(user: any) {

    this.api.post(`/users/${user.id}/follow`, {}).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {

        this.following =
          this.following.filter(x => x.id !== user.id);

        this.filteredFollowing =
          this.filteredFollowing.filter(x => x.id !== user.id);

      }

    });

  }

  follow(user: any) {

    this.api.post(`/users/${user.id}/follow`, {}).pipe(
      takeUntil(this.destroy$)
    ).subscribe({

      next: () => {

        user.followStatus = 'following';

      }

    });

  }

  openProfile(user: any) {

    this.router.navigate(['/user-profile', user.id]);

  }


  openChat(user: any) {

    this.api.get<any>('/chat/conversations')
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe({

        next: (res) => {

          const conversation = res.data.find((c: any) =>
            c.otherUser.id === user.id
          );

          if (conversation) {

            this.router.navigate(
              ['/conversation'],
              {
                state: {
                  conversationId: conversation.conversationId,
                  user: conversation.otherUser
                }
              }
            );

          } else {

            this.router.navigate(
              ['/conversation'],
              {
                state: {
                  conversationId: '',
                  user: user
                }
              }
            );

          }

        }

      });

  }

  ionViewWillLeave() {

  this.searchText = '';

  this.following = [];

  this.filteredFollowing = [];

}

ngOnDestroy() {

  this.destroy$.next();

  this.destroy$.complete();

}

  goBack() {

    history.back();

  }

}
