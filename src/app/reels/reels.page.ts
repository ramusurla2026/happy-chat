import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommentsComponent } from '../comments/comments.component';

import {
  IonContent,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonFooter,
  IonInput,
  IonInfiniteScroll,
  IonInfiniteScrollContent, IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';

import { Api } from '../core/services/api';

import { addIcons } from 'ionicons';
import {
  heart,
  heartOutline,
  chatbubbleOutline,
  paperPlaneOutline,
  bookmark,
  bookmarkOutline,
  arrowBackOutline
} from 'ionicons/icons';
import { Feed } from '../core/services/feed';

addIcons({
  'heart': heart,
  'heart-outline': heartOutline,
  'chatbubble-outline': chatbubbleOutline,
  'paper-plane-outline': paperPlaneOutline,
  'bookmark': bookmark,
  'bookmark-outline': bookmarkOutline,
  'arrow-back-outline': arrowBackOutline
});

@Component({
  selector: 'app-reels',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    FooterComponent, IonRefresher,
    IonRefresherContent,
  ],
  templateUrl: './reels.page.html',
  styleUrls: ['./reels.page.scss']
})
export class ReelsPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('videoPlayer')
  videos!: QueryList<ElementRef<HTMLVideoElement>>;

  observer!: IntersectionObserver;

  reels: any[] = [];

  page = 1;
  limit = 20;
  hasMore = true;
  loading = false;

  isCommentOpen = false;
  selectedReel: any;

  comments: any[] = [];
  newComment = '';

  myProfileImage = '';
  userId!: string;
  reelId!: string;

  constructor(
    private api: Api,
    private router: Router,
    private route: ActivatedRoute, private modalCtrl: ModalController, private feedService: Feed
  ) { }

  ngAfterViewInit() {

    this.videos.changes.subscribe(() => {

      setTimeout(() => {
        this.observeVideos();
      }, 100);

    });

  }

  refresh(event: any) {

    this.page = 1;
    this.hasMore = true;
    this.loading = false;
    this.reels = [];

    if (this.userId) {

      this.getUserReels();

      setTimeout(() => {
        event.target.complete();
      }, 700);

    } else {

      this.getReels();

      setTimeout(() => {
        event.target.complete();
      }, 700);

    }

  }


  // observeVideos() {

  //   if (!this.videos || this.videos.length === 0) return;

  //   if (this.observer) {
  //     this.observer.disconnect();
  //   }

  //   this.observer = new IntersectionObserver(
  //     (entries) => {

  //       entries.forEach((entry) => {

  //         const video = entry.target as HTMLVideoElement;

  //         if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {

  //           this.pauseAll();

  //           video.play().catch(() => { });

  //         } else {

  //           video.pause();

  //         }

  //       });

  //     },
  //     {
  //       threshold: 0.8
  //     }
  //   );

  //   this.videos.forEach((video) => {
  //     this.observer.observe(video.nativeElement);
  //   });

  // }

  observeVideos() {

  if (this.observer) {
    this.observer.disconnect();
  }

  this.observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      const video = entry.target as HTMLVideoElement;

      if (entry.isIntersecting) {

        this.pauseAll();

        video.currentTime = video.currentTime;

        video.play().catch(() => {});

      } else {

        video.pause();

      }

    });

  }, {

    threshold: 0.6

  });

  this.videos.forEach(v => {

    this.observer.observe(v.nativeElement);

  });

}

  pauseAll() {

    this.videos.forEach((video) => {
      video.nativeElement.pause();
    });

  }

  selectedIndex = 0;
  ngOnInit() {

    this.route.queryParams.subscribe(params => {

      this.userId = params['userId'];
      this.reelId = params['reelId'];

      // if (this.userId) {
      //   this.getUserReels();
      // } else {
      //   this.getReels();
      // }

      if (this.userId) {
        this.getUserReels();

      } else if (this.reelId) {
        this.getSingleReel(this.reelId);

      } else {
        this.getReels();

      }

    });

    this.feedService.commentUpdated$
      .subscribe((data: any) => {
        const reel = this.reels.find(x => x.id === data.id);
        if (reel) {
          reel.commentCount = data.commentCount;
        }

      });
  }


  getUserReels() {

    this.api
      .get<any>(`/users/${this.userId}/reels`)
      .subscribe({

        next: (res) => {

          this.reels = res.data.reels;

          this.selectedIndex =
            this.reels.findIndex(
              (x: any) => x.id === this.reelId
            );

          setTimeout(() => {

            const items =
              document.querySelectorAll('.reel-item');

            items[this.selectedIndex]
              ?.scrollIntoView({
                block: 'start'
              });

          }, 300);

        }

      });

  }

  // getSingleReel(id: string) {

  //   this.api.get<any>(`/reels/${id}`)
  //     .subscribe({

  //       next: (res) => {

  //         this.reels = [res.data];
  //         this.loadRemainingReels(id);

  //       }

  //     });

  // }

  getSingleReel(id: string) {

    this.api.get<any>(`/reels/${id}`).subscribe({

      next: (res) => {

        this.reels = [res.data];

        this.page = 1;

        this.hasMore = true;

        this.loading = false;

        // migatha reels load cheyyi
        this.getReels();

        setTimeout(() => {

          this.observeVideos();

        }, 200);

      }

    });

  }

  loadRemainingReels(id: string) {

    this.api.get<any>('/feed?page=1&limit=20').subscribe({

      next: (res) => {

        const others = (res.data.feed || []).filter(
          (item: any) =>
            item.type === 'reel' &&
            item.id !== id
        );

        this.reels = [
          this.reels[0],
          ...others
        ];

      }

    });

  }


  getReel() {

    this.api.get<any>(`/reels/${this.reelId}`)
      .subscribe({

        next: (res) => {
          const feed = res.data.feed;

          if (feed.length > 0) {
            this.myProfileImage = feed[0].author.profileImage;
          }

          this.reels = [res.data];

          setTimeout(() => {
            this.observeVideos();
          }, 100);

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  getReels(event?: any) {

    if (this.loading || !this.hasMore) {

      if (event) {
        event.target.complete();
      }

      return;
    }

    this.loading = true;

    this.api
      .get<any>(`/feed?page=${this.page}&limit=${this.limit}`)
      .subscribe({

        next: (res) => {
          const feed = res.data.feed;

          if (feed.length > 0) {
            this.myProfileImage = feed[0].author.profileImage;
          }

          const videos = (res.data.feed || []).filter(
            (item: any) => item.type === 'reel'
          );

          const filtered = videos.filter(
            (x: any) => !this.reels.some(r => r.id === x.id)
          );

          // this.reels = [
          //   ...this.reels,
          //   ...videos
          // ];

          this.reels = [
            ...this.reels,
            ...filtered
          ];

          setTimeout(() => {
            this.observeVideos();
          }, 100);

          this.page++;

          this.hasMore = res.data.hasMore;

          this.loading = false;

          if (event) {
            event.target.complete();
          }

          if (!this.hasMore && event) {
            event.target.disabled = true;
          }

        },

        error: (err) => {

          console.log(err);

          this.loading = false;

          if (event) {
            event.target.complete();
          }

        }

      });

  }

  loadMore(event: any) {
    this.getReels(event);
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

  async openComments(post: any) {
    const modal = await this.modalCtrl.create({
      component: CommentsComponent,
      componentProps: {
        postId: post.id,
        type: post.type,
        profileImage: this.myProfileImage
      },
    });
    await modal.present();
  }

  closeComments() {

    this.isCommentOpen = false;

  }

  postComment() {

    if (!this.newComment.trim()) return;

    this.comments.push({
      user: 'You',
      text: this.newComment
    });

    this.newComment = '';

  }

  goBack() {
    this.router.navigate(['/home']);
  }

  openUserProfile(author: any) {

    if (!author?.id) {
      return;
    }

    this.router.navigate(
      ['/user-profile', author.id]
    );

  }

  pausedVideo: HTMLVideoElement | null = null;

  togglePlay(video: HTMLVideoElement) {

    if (video.paused) {

      video.play();
      this.pausedVideo = null;

    } else {

      video.pause();
      this.pausedVideo = video;

    }

  }

  ngOnDestroy() {

    if (this.observer) {
      this.observer.disconnect();
    }
    this.pauseAll();

  }

  ionViewWillLeave() {

    this.pauseAll();

    if (this.observer) {
      this.observer.disconnect();
    }

    this.reels = [];

    this.page = 1;

    this.hasMore = true;

    this.loading = false;

    this.selectedReel = null;

    this.comments = [];

    this.newComment = '';

    this.pausedVideo = null;

  }

}