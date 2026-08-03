import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ViewWillLeave } from '@ionic/angular';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle
} from '@ionic/angular/standalone';

import { Api } from '../core/services/api';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  searchOutline,
  closeOutline,
  peopleOutline
} from 'ionicons/icons';

addIcons({
  'arrow-back-outline': arrowBackOutline,
  'search-outline': searchOutline,
  'close-outline': closeOutline,
  'people-outline': peopleOutline
});

@Component({
  selector: 'app-followers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,



    IonIcon
  ],
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss']
})
export class FollowersComponent implements OnInit, OnInit, OnDestroy, ViewWillLeave {
  private destroy$ = new Subject<void>();
  followers: any[] = [];
  filteredFollowers: any[] = [];
  searchText = '';
  userId = '';

  constructor(
    private api: Api,
    private router: Router
  ) { }

  ngOnInit(): void {
    const state = history.state;
    this.userId = state.userId;

    this.getFollowers();

  }

  getFollowers() {

    this.api.get<any>(`/users/${this.userId}/followers`).pipe(
      takeUntil(this.destroy$)
    ).subscribe({

      next: (res) => {

        this.followers = res.data.followers.map((user: any) => ({

          ...user,

          followStatus: 'follow_back'

        }));

        // Search list initial value
        this.filteredFollowers = [...this.followers];

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  onSearch(event: any) {

    this.searchText = event.target.value?.toLowerCase() || '';

    if (!this.searchText) {

      this.filteredFollowers = [...this.followers];

      return;

    }

    this.filteredFollowers = this.followers.filter(user =>

      user.username.toLowerCase().includes(this.searchText) ||

      user.fullName.toLowerCase().includes(this.searchText)

    );

  }

  follow(user: any) {

    this.api.post(`/users/${user.id}/follow`, {}).pipe(
      takeUntil(this.destroy$)
    ).subscribe({

      next: () => {

        user.followStatus = 'following';

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  openProfile(user: any) {

    this.router.navigate(['/user-profile', user.id]);

  }

  openChat(user: any) {

    this.api.get<any>('/chat/conversations').pipe(
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

  removeFollower(user: any) {

    // Remove follower API
    // this.api.delete(`/users/followers/${user.id}`)
    //   .subscribe({

    //     next: () => {

    //       this.followers = this.followers.filter(
    //         x => x.id !== user.id
    //       );

    //       this.filteredFollowers = this.filteredFollowers.filter(
    //         x => x.id !== user.id
    //       );

    //     },

    //     error: (err) => {

    //       console.log(err);

    //     }

    //   });
    this.router.navigate(['/home'])

  }


  ionViewWillLeave() {

    this.searchText = '';

    this.followers = [];

    this.filteredFollowers = [];

    this.userId = '';

  }

  ngOnDestroy() {

    this.destroy$.next();

    this.destroy$.complete();

  }

  goBack() {

    history.back();

  }

}