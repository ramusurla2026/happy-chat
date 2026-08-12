import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonAvatar, IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  gridOutline,
  videocamOutline,
  personOutline
} from 'ionicons/icons';

import { Api } from '../core/services/api';
import { ActivatedRoute } from '@angular/router';

addIcons({
  'arrow-back-outline': arrowBackOutline,
  'grid-outline': gridOutline,
  'videocam-outline': videocamOutline,
  'person-outline': personOutline
});

@Component({
  selector: 'app-user-profile',
  standalone: true,

  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonRefresher,
    IonRefresherContent,

    IonIcon,
    IonContent,

  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  userId!: string;

  user: any;

  posts: any[] = [];

  reels: any[] = [];

  selectedTab: 'posts' | 'reels' = 'posts';

  canView = true;





  followButtonText = 'Follow';

  constructor(
    private api: Api,
    private router: Router,
    private route: ActivatedRoute, private location: Location
  ) {

  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id')!;

    this.getProfile();

    this.getPosts();

  }


  getProfile() {

    this.api.get(`/users/${this.userId}`)
      .subscribe({

        next: (res: any) => {

          this.user = res.data;
          switch (this.user.followStatus) {


            case 'following':
              this.followButtonText = 'Following';
              break;

            case 'pending':
            case 'requested':
              this.followButtonText = 'Requested';
              break;

            default:
              this.followButtonText = 'Follow';
              break;

          }


        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  getPosts() {

    this.selectedTab = 'posts';

    this.api.get(`/users/${this.userId}/posts`)
      .subscribe({

        next: (res: any) => {

          this.canView = res.data.canView;

          this.posts = res.data.posts;

        },

        error: (err) => {

          console.log(err);

        }

      });

  }


  openFollowers(user: any) {
    this.router.navigate(['/followers'], {
      state: {
        userId: user.id
      }
    });
  }

  openFollowing(user:any) {
    this.router.navigate(['/following'],
      {
      state: {
        userId: user.id
      }
    }
    );
  }

  getReels() {

    this.selectedTab = 'reels';

    this.api.get(`/users/${this.userId}/reels`)
      .subscribe({

        next: (res: any) => {

          this.canView = res.data.canView;

          this.reels = res.data.reels;

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  getUserProfile(userId: string) {

    this.api.get(`/users/${userId}`)
      .subscribe({

        next: (res: any) => {

          console.log(res);

          this.user = res.data;

          switch (this.user.followStatus) {


            case 'following':
              this.followButtonText = 'Following';
              break;

            case 'pending':
            case 'requested':
              this.followButtonText = 'Requested';
              break;

            default:
              this.followButtonText = 'Follow';
              break;

          }

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  // toggleFollow() {

  //   if (this.followButtonText === 'Follow') {

  //     this.api.post(`/users/${this.user.id}/follow`, {})
  //       .subscribe({

  //         next: () => {

  //           this.followButtonText =
  //             this.user.isPrivate ? 'Requested' : 'Following';

  //           if (!this.user.isPrivate) {
  //             this.user.followerCount++;
  //           }

  //         }

  //       });

  //   }

  //   else {

  //     this.api.delete(`/users/${this.user.id}/follow`)
  //       .subscribe({

  //         next: () => {

  //           this.followButtonText = 'Follow';

  //           if (this.user.followerCount > 0) {
  //             this.user.followerCount--;
  //           }

  //         }

  //       });

  //   }

  // }


  toggleFollow() {

    if (this.followButtonText === 'Follow') {

      this.api.post(`/users/${this.user.id}/follow`, {})
        .subscribe({

          next: () => {

            // Latest follow status refresh
            this.getProfile();

          },

          error: (err) => {

            if (err.error?.message === 'Follow request already sent') {

              this.getProfile();

            }

          }

        });

    } else {

      this.api.delete(`/users/${this.user.id}/follow`)
        .subscribe({

          next: () => {

            // Latest follow status refresh
            this.getProfile();

          }

        });

    }

  }

  openChat(user: any) {

    this.api.get<any>('/chat/conversations')
      .subscribe({

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

  goBack() {
    this.location.back();
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

  handleRefresh(event: any) {

    this.getProfile();

    if (this.selectedTab === 'posts') {
      this.getPosts();
    } else {
      this.getReels();
    }

    setTimeout(() => {
      event.target.complete();
    }, 700);

  }
}
