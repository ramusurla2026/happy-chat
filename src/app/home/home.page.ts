import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ModalController,
  IonContent, IonFab,
  IonFabButton,
  IonIcon
} from '@ionic/angular/standalone';

// import { IonicModule, ModalController } from '@ionic/angular';



import { FooterComponent } from '../footer/footer.component';
import { Api } from '../core/services/api';

// import { IonContent } from '@ionic/angular';
import { Feed } from '../core/services/feed';
import { ViewChild, ElementRef } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { register } from 'swiper/element/bundle';
register();



import { addIcons } from 'ionicons';

import {
  notificationsOutline,
  addCircle,
  ellipsisHorizontal,
  heart,
  heartOutline,
  chatbubbleOutline,
  paperPlaneOutline,
  bookmark,
  bookmarkOutline,
  add
} from 'ionicons/icons';


addIcons({

  'notifications-outline': notificationsOutline,

  'add-circle': addCircle,

  'ellipsis-horizontal': ellipsisHorizontal,

  'heart': heart,

  'heart-outline': heartOutline,

  'chatbubble-outline': chatbubbleOutline,

  'paper-plane-outline': paperPlaneOutline,

  'bookmark': bookmark,

  'bookmark-outline': bookmarkOutline,

  'add': add

});

@Component({

  selector: 'app-home',

  standalone: true,

  imports: [

    CommonModule,
    FormsModule,
    FooterComponent,
    IonContent, IonFab,
    IonFabButton,
    IonIcon

  ],

  templateUrl: './home.page.html',

  styleUrls: ['./home.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})

export class HomePage implements OnInit {
  @ViewChild('content') content!: IonContent;
  // content!: IonContent;

  @ViewChild('storyInput')
  storyInput!: ElementRef<HTMLInputElement>;

  //   @ViewChild('content')
  // content!: IonContent;

  @ViewChildren('videoPlayer')
  videoPlayers!: QueryList<ElementRef<HTMLVideoElement>>;

  myProfileImage = '';

  feed: any[] = [];

  page = 1;

  limit = 20;

  hasMore = true;

  isLoading = false;

  storyPopup = false;
  notificationCount = 0;
  stories: any[] = [];



  ngAfterViewInit() {

    this.videoPlayers.changes.subscribe(() => {

      this.playVisibleVideos();

    });

    this.playVisibleVideos();

  }

  playVisibleVideos() {

    const observer = new IntersectionObserver((entries) => {

      entries.forEach(entry => {

        const video = entry.target as HTMLVideoElement;

        if (entry.isIntersecting) {

          video.play().catch(() => { });

        } else {

          video.pause();

        }

      });

    }, {
      threshold: 0.7
    });

    this.videoPlayers.forEach(v => {

      observer.observe(v.nativeElement);

    });

  }


  constructor(

    private api: Api,

    private router: Router,
    private modalCtrl: ModalController, private feedService: Feed

  ) { }

  // ngOnInit() {
  //   this.getMyProfile();
  //   this.getStories();
  //   this.getFeed();

  //   this.feedService.notificationCount$
  //     .subscribe(() => {
  //       this.getFollowRequestsCount();
  //     });
  //   // this.getFollowRequestsCount();

  //   this.feedService.commentUpdated$
  //     .subscribe((data: any) => {
  //       const post = this.feed.find(x => x.id === data.id);
  //       if (post) {
  //         post.commentCount++;
  //       }

  //     });

  // }

  ngOnInit() {

  this.getMyProfile();
  this.getFeed();

  this.feedService.notificationCount$
    .subscribe(() => {
      this.getFollowRequestsCount();
    });

  this.feedService.commentUpdated$
    .subscribe((data: any) => {
      const post = this.feed.find(x => x.id === data.id);

      if (post) {
        post.commentCount++;
      }
    });

}

  openReel(post: any) {

    this.router.navigate(
      ['/reels'],
      {
        queryParams: {
          reelId: post.id
        }
      }
    );

  }

  slideChanged(event: any, post: any) {
    post.initialSlide = event.target.swiper.activeIndex;
  }

  handleRefresh(event: any) {

    this.page = 1;
    this.feed = [];
    this.hasMore = true;

    this.getStories();
    this.getFollowRequestsCount();

    this.getFeed();

    setTimeout(() => {
      event.target.complete();
    }, 800);

  }

  close() {

    this.modalCtrl.dismiss();

  }

  // getMyProfile() {

  //   const userId = localStorage.getItem('user');

  //   if (!userId) {
  //     return;
  //   }


  //   this.api.get<any>(`/users/${userId}`)
  //     .subscribe({

  //       next: (res) => {

  //         this.myProfileImage =
  //           res.data.profileImage;

  //       },


  //       error: (err) => {

  //         console.log(err);

  //       }

  //     });

  // }
  myUserId = '';
myUsername = '';
getMyProfile() {

  const userId = localStorage.getItem('user');

  if (!userId) {
    return;
  }

  this.myUserId = String(userId);

  this.api.get<any>(`/users/${userId}`)
    .subscribe({

      next: (res) => {

        console.log('MY PROFILE:', res);

        this.myProfileImage =
          res.data?.profileImage || '';

        this.myUsername =
          res.data?.username || '';

        // If backend returns id
        if (res.data?.id) {
          this.myUserId = String(res.data.id);
        }

        this.getStories();

      },

      error: (err) => {
        console.error('MY PROFILE ERROR:', err);
      }

    });

}


  openStoryPicker() {
    this.storyInput.nativeElement.click();
  }

  uploadStory(event: any) {

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const formData = new FormData();

    // Backend field names
    formData.append('file', file);


    this.api.post('/stories', formData)
      .subscribe({

        next: (res: any) => {

          console.log('Story Uploaded', res);

          // Refresh stories
          this.getStories();

          // Clear selected file
          event.target.value = '';

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  // getStories() {

  //   this.api.get<any>('/stories/feed')
  //     .subscribe({

  //       next: (res) => {
  //         console.log(res, 'stories feed')

  //         this.stories = res.data || [];


  //       },

  //       error: (err) => {

  //         console.log(err);

  //       }

  //     });

  // }


myStories: any[] = [];
myHasUnseenStory = false;

getStories() {

  this.api.get<any>('/stories/feed')
    .subscribe({

      next: (res) => {

        console.log('========== STORIES DEBUG ==========');
        console.log('FULL RESPONSE:', res);

        const allStories = res.data || [];

        console.log('ALL STORIES:', allStories);

        console.log('MY USER ID:', this.myUserId);
        console.log('MY USERNAME:', this.myUsername);

        allStories.forEach((item: any, index: number) => {

          console.log(`STORY GROUP ${index}`);

          console.log(
            'STORY USER ID:',
            item?.user?.id
          );

          console.log(
            'STORY USERNAME:',
            item?.user?.username
          );

          console.log(
            'STORY COUNT:',
            item?.stories?.length
          );

        });

        // Find my story using username
        const myStoryGroup = allStories.find(
          (item: any) => {

            const storyUsername =
              String(item?.user?.username || '')
                .trim()
                .toLowerCase();

            const myUsername =
              String(this.myUsername || '')
                .trim()
                .toLowerCase();

            console.log(
              'COMPARE:',
              storyUsername,
              '===',
              myUsername,
              storyUsername === myUsername
            );

            return storyUsername === myUsername;
          }
        );

        console.log(
          'MY STORY GROUP:',
          myStoryGroup
        );

        // IMPORTANT
        this.myStories =
          myStoryGroup?.stories || [];

        this.myHasUnseenStory =
          myStoryGroup?.hasUnseen || false;

        console.log(
          'FINAL MY STORIES:',
          this.myStories
        );

        console.log(
          'MY STORIES LENGTH:',
          this.myStories.length
        );

        // Other users
        this.stories = allStories.filter(
          (item: any) => {

            const storyUsername =
              String(item?.user?.username || '')
                .trim()
                .toLowerCase();

            const myUsername =
              String(this.myUsername || '')
                .trim()
                .toLowerCase();

            return storyUsername !== myUsername;
          }
        );

      },

      error: (err) => {

        console.error(
          'GET STORIES ERROR:',
          err
        );

      }

    });

}
// onMyStoryClick() {

//   if (!this.myStories || this.myStories.length === 0) {
//     this.openStoryPicker();
//     return;
//   }


//   this.router.navigate(
//     ['/story-viewer'],
//     {
//       state: {
//         stories: this.myStories,
//         user: {
//           id: localStorage.getItem('user'),
//           username: 'You',
//           profileImage: this.myProfileImage
//         }
//       }
//     }
//   );

// }
onMyStoryClick() {

  console.log(
    'MY STORY CLICKED:',
    this.myStories
  );

  // Story exists
  if (this.myStories.length > 0) {

    this.router.navigate(
      ['/story-viewer'],
      {
        state: {
          stories: this.myStories,
          user: {
            id: this.myUserId,
            username: this.myUsername,
            profileImage: this.myProfileImage
          }
        }
      }
    );

    return;
  }

  // No story
  this.openStoryPicker();

}

  ionViewWillEnter() {

    const state = history.state;

    if (state.refresh) {

      this.page = 1;

      this.feed = [];

      this.hasMore = true;

      this.getFeed();

      setTimeout(() => {

        this.content.scrollToTop(300);

      }, 200);

    }

  }

  getFollowRequestsCount() {
    this.api.get<any>(`/users/follow-requests`)
      .subscribe({
        next: (res) => {
          this.notificationCount = res.data?.requests.length || 0;
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  openNotifications() {
    this.router.navigate(['/follow-requests']);
  }

  getFeed(event?: any) {

    if (this.isLoading || !this.hasMore) {

      if (event) {
        event.target.complete();
      }

      return;

    }


    this.isLoading = true;


    this.api
      .get<any>(`/feed/home?page=${this.page}&limit=${this.limit}`)
      .subscribe({

        next: (res) => {

          const newFeed = res.data.feed || [];

          if (this.page === 1) {

            this.feed = newFeed;

          } else {

            this.feed = [
              ...this.feed,
              ...newFeed
            ];

          }

          this.page++;

          this.hasMore = res.data.hasMore;

          this.isLoading = false;

          if (event) {
            event.target.complete();
          }


        },


        error: (err) => {


          console.log(err);


          this.isLoading = false;


          if (event) {

            event.target.complete();

          }


        }


      });

  }

  loadMore(event: any) {

    this.getFeed();

    event.target.complete();

    if (!this.hasMore) {

      event.target.disabled = true;

    }

  }



  likePost(post: any) {

    const oldStatus = post.hasLiked;


    // UI immediate update
    post.hasLiked = !post.hasLiked;


    if (post.hasLiked) {

      post.likeCount++;

    } else {

      post.likeCount--;

    }



    this.api.post<any>(
      `/posts/${post.id}/like`,
      {}
    )
      .subscribe({

        next: (res) => {

          console.log('like success', res);

        },


        error: (err) => {

          console.log(err);


          // error vaste rollback

          post.hasLiked = oldStatus;


          if (oldStatus) {

            post.likeCount++;

          } else {

            post.likeCount--;

          }

        }

      });


  }

  likeContent(item: any) {


    const oldStatus = item.hasLiked;


    // UI update
    item.hasLiked = !item.hasLiked;


    if (item.hasLiked) {
      item.likeCount++;
    } else {
      item.likeCount--;
    }



    let url = '';

    if (item.type === 'reel') {

      url = `/reels/${item.id}/like`;

    } else {

      url = `/posts/${item.id}/like`;

    }



    this.api.post<any>(
      url,
      {}
    )
      .subscribe({

        next: (res) => {

          console.log('like success', res);

        },


        error: (err) => {

          console.log(err);


          // rollback

          item.hasLiked = oldStatus;


          if (oldStatus) {
            item.likeCount++;
          } else {
            item.likeCount--;
          }

        }

      });


  }



  savePost(post: any) {

    const oldStatus = post.hasSaved;

    // UI update
    post.hasSaved = !post.hasSaved;

    if (post.hasSaved) {
      post.saveCount = (post.saveCount || 0) + 1;
    } else {
      post.saveCount = Math.max((post.saveCount || 1) - 1, 0);
    }

    const url =
      post.type === 'post'
        ? `/posts/${post.id}/save`
        : `/reels/${post.id}/save`;

    this.api.post<any>(url, {}).subscribe({

      next: (res) => {

        console.log(res);

        // Backend nundi latest value vaste use cheyyi
        if (res.data) {
          post.hasSaved = res.data.saved;

          if (res.data.saveCount !== undefined) {
            post.saveCount = res.data.saveCount;
          }
        }

      },

      error: (err) => {

        console.log(err);

        // Rollback
        post.hasSaved = oldStatus;

        if (oldStatus) {
          post.saveCount++;
        } else {
          post.saveCount = Math.max(post.saveCount - 1, 0);
        }

      }

    });

  }

  sharePost(post: any) {

    console.log(post);

    // Share API

  }

  // async openComments(post: any) {

  //   const modal = await this.modalCtrl.create({
  //     component: CommentsComponent,
  //     componentProps: {
  //       postId: post.id,
  //       type: post.type,
  //       profileImage: this.myProfileImage
  //     },




  //   });

  //   await modal.present();

  // }
  openComments(post: any) {
    console.log('1. openComments called', post);

    this.modalCtrl.create({
      component: CommentsComponent,
      componentProps: {
        postId: post.id,
        type: post.type,
        profileImage: this.myProfileImage
      }
    }).then((modal) => {
      console.log('2. Modal created');
      return modal.present();
    }).then(() => {
      console.log('3. Modal presented');
    }).catch((err) => {
      console.error('MODAL ERROR:', err);
    });
  }




  openProfile(user: any) {
    const myId = localStorage.getItem('user')
    if (user.id === myId) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/user-profile', user.id]);
    }

  }

  goTo() {
    this.router.navigate(
      ['/create-options']
    );
  }

  goToCreate() {

    this.router.navigate(

      ['/create-options']

    );

  }


  onStoryClick(story: any) {
console.log(story,'story')
    this.router.navigate(
      ['/story-viewer'],
      {
        state: {
          stories: story.stories,
          user: story.user
        }
      }
    );

  }

  goToSearchPage() {
    this.router.navigate(
      ['/search']
    );
  }

  closeStoryPopup() {

    this.storyPopup = false;

  }

  refreshHome() {

    // const scrollElement = await this.content.getScrollElement();

    // if (scrollElement.scrollTop > 100) {

    //   await this.content.scrollToTop(300);

    // }

    this.page = 1;
    this.feed = [];
    this.hasMore = true;

    this.getFeed();
    this.getStories();
    this.getFollowRequestsCount();

  }

  goTocreatePostPage() {
    this.router.navigate(
      ['/create-options']
    );
  }

  pickGallery() {

    this.storyPopup = false;

    console.log('Gallery');

  }

  takePhoto() {

    this.storyPopup = false;

    console.log('Camera');

  }

}