import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Api } from '../core/services/api';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { register } from 'swiper/element/bundle';
import { ModalController } from '@ionic/angular';
register();

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  heartOutline,
  heart,
  chatbubbleOutline,
  paperPlaneOutline,
  bookmarkOutline,
  bookmark
} from 'ionicons/icons';
import { Feed } from '../core/services/feed';

addIcons({
  'arrow-back-outline': arrowBackOutline,
  'heart-outline': heartOutline,
  'heart': heart,
  'chatbubble-outline': chatbubbleOutline,
  'paper-plane-outline': paperPlaneOutline,
  'bookmark-outline': bookmarkOutline,
  'bookmark': bookmark
});

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PostsComponent implements OnInit {

  userId = '';
  postId = '';
  imageIndex = 0;
  myProfileImage = '';
  displayPosts: any[] = [];

  constructor(
    private api: Api,
    private route: ActivatedRoute,
    private location: Location, private modalCtrl: ModalController,private feedService: Feed
  ) { }

  ngOnInit(): void {

    this.userId =
      this.route.snapshot.queryParamMap.get('userId') || '';

    this.postId =
      this.route.snapshot.queryParamMap.get('postId') || '';

    this.imageIndex = Number(
      this.route.snapshot.queryParamMap.get('imageIndex') || 0
    );

    this.feedService.commentUpdated$
    .subscribe((data: any) => {

      const post = this.displayPosts.find(
        (x: any) => x.id === data.id
      );

      if (post) {
        post.commentCount = data.commentCount;
      }

    });

    this.getPosts();
  }

  getPosts() {

    this.api.get<any>(`/users/${this.userId}/posts`)
      .subscribe({
        next: (res) => {
          const posts = res.data.posts || [];
          if (posts.length > 0) {
            this.myProfileImage = posts[0].author.profileImage;
          }
          const selectedIndex = posts.findIndex(
            (x: any) => x.id === this.postId
          );

          if (selectedIndex === -1) {
            this.displayPosts = posts;
            return;
          }

          this.displayPosts = [];

          // Selected post -> Last post
          for (let i = selectedIndex; i < posts.length; i++) {

            this.displayPosts.push({
              ...posts[i],
              initialSlide:
                posts[i].id === this.postId
                  ? this.imageIndex
                  : 0
            });

          }

          // Top posts
          for (let i = 0; i < selectedIndex; i++) {

            this.displayPosts.push({
              ...posts[i],
              initialSlide: 0
            });

          }

          console.log(this.displayPosts);

        },

        error: err => {
          console.log(err);
        }

      });

  }


  handleRefresh(event: any) {

  this.getPosts();

  setTimeout(() => {
    event.target.complete();
  }, 800);

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

  sharePost(post: any) {

    console.log(post);

    // Share API

  }

  slideChanged(event: any, post: any) {

    post.initialSlide = event.target.swiper.activeIndex;

  }

  trackByPost(index: number, item: any) {

    return item.id;

  }

  goBack() {

    this.location.back();

  }

}