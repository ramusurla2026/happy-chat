import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonFooter
} from '@ionic/angular/standalone';

import { Api } from '../core/services/api';
import { Feed } from '../core/services/feed';

import {
  close,
  heart,
  heartOutline,
  chatbubbleOutline,
  paperPlaneOutline
} from 'ionicons/icons';

import { addIcons } from 'ionicons';

addIcons({
  'close': close,
  'heart': heart,
  'heart-outline': heartOutline,
  'chatbubble-outline': chatbubbleOutline,
  'paper-plane-outline': paperPlaneOutline
});

@Component({
  selector: 'app-comments',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,

    IonContent,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonFooter
  ],

  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() postId!: string;
  @Input() type: string = 'post';
  @Input() profileImage: string = '';

  comments: any[] = [];

  text = '';

  contentId = '';
  contentType = 'post';

  myProfileImage = '';

  constructor(
    private api: Api,
    private modalCtrl: ModalController,
    private feedService: Feed
  ) {}

  ngOnInit(): void {
    this.contentId = this.postId;
    this.contentType = this.type;
    this.myProfileImage = this.profileImage;

    this.getComments();
  }

  close(): void {
    this.modalCtrl.dismiss();
  }

  getComments(): void {

    const url =
      this.contentType === 'reel'
        ? `/reels/${this.contentId}/comments`
        : `/posts/${this.contentId}/comments`;

    this.api.get<any>(url).subscribe({

      next: (res) => {
        this.comments = res.data?.comments || [];
      },

      error: (err) => {
        console.log('Get comments error:', err);
      }

    });
  }

  addComment(): void {

    if (!this.text.trim()) {
      return;
    }

    const url =
      this.contentType === 'reel'
        ? `/reels/${this.contentId}/comments`
        : `/posts/${this.contentId}/comments`;

    this.api.post<any>(
      url,
      {
        text: this.text
      }
    ).subscribe({

      next: (res) => {

        this.comments.push(res.data);

        this.text = '';

        this.feedService.updateCommentCount(
          this.contentId,
          this.comments.length
        );

      },

      error: (err) => {
        console.log('Add comment error:', err);
      }

    });
  }

  likeComment(comment: any): void {

    const url =
      this.contentType === 'reel'
        ? `/reels/${this.contentId}/comments/${comment.id}/like`
        : `/posts/${this.contentId}/comments/${comment.id}/like`;

    this.api.post<any>(url, {}).subscribe({

      next: (res) => {

        comment.hasLiked = res.data.liked;
        comment.likeCount = res.data.likeCount;

      },

      error: (err) => {
        console.log('Like comment error:', err);
      }

    });
  }

  replyTo(comment: any): void {
    console.log('reply', comment);
  }

}