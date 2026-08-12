import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ModalController,
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
  close,
  heart,
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


  @ViewChild('commentContent', { read: ElementRef })
commentContent!: ElementRef;


  comments: any[] = [];

  text = '';

  contentId = '';

  contentType = 'post';

  myProfileImage = '';


  constructor(
    private api: Api,
    private modalCtrl: ModalController,
    private feedService: Feed
  ) { }


  ngOnInit(): void {

    console.log('CommentsComponent initialized');

    console.log('postId:', this.postId);

    console.log('type:', this.type);


    this.contentId = this.postId;

    this.contentType = this.type;

    this.myProfileImage = this.profileImage;


    this.getComments();

  }


  // Close modal
  close(): void {

    this.modalCtrl.dismiss();

  }


  // Get comments
  getComments(): void {

    const url =
      this.contentType === 'reel'
        ? `/reels/${this.contentId}/comments`
        : `/posts/${this.contentId}/comments`;


    console.log('Getting comments:', url);


    this.api.get<any>(url).subscribe({

      next: (res) => {

        console.log('Comments response:', res);


        this.comments =
          res.data?.comments || [];


         this.scrollToBottom();

      },


      error: (err) => {

        console.error(
          'Get comments error:',
          err
        );

      }

    });

  }


 scrollToBottom(): void {

  setTimeout(() => {

    const ionContent =
      this.commentContent?.nativeElement;

    if (!ionContent) {
      return;
    }

    const scrollElement =
      ionContent.shadowRoot?.querySelector('.inner-scroll');

    if (scrollElement) {

      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: 'smooth'
      });

    }

  }, 200);
}


  // Add comment
  addComment(): void {

    const commentText =
      this.text.trim();


    if (!commentText) {

      return;

    }


    const url =
      this.contentType === 'reel'
        ? `/reels/${this.contentId}/comments`
        : `/posts/${this.contentId}/comments`;


    this.api.post<any>(
      url,
      {
        text: commentText
      }
    ).subscribe({

      next: (res) => {

        console.log(
          'Comment added:',
          res
        );


        this.comments.push(
          res.data
        );


        this.text = '';


        this.feedService.updateCommentCount(
          this.contentId,
          this.comments.length
        );


        // Scroll to new comment
         this.scrollToBottom();

      },


      error: (err) => {

        console.error(
          'Add comment error:',
          err
        );

      }

    });

  }


  // Like comment
  likeComment(comment: any): void {

    const url =
      this.contentType === 'reel'
        ? `/reels/${this.contentId}/comments/${comment.id}/like`
        : `/posts/${this.contentId}/comments/${comment.id}/like`;


    this.api.post<any>(
      url,
      {}
    ).subscribe({

      next: (res) => {

        comment.hasLiked =
          res.data.liked;

        comment.likeCount =
          res.data.likeCount;

      },


      error: (err) => {

        console.error(
          'Like comment error:',
          err
        );

      }

    });

  }


  // Reply
  replyTo(comment: any): void {

    console.log(
      'Reply to comment:',
      comment
    );

  }

}