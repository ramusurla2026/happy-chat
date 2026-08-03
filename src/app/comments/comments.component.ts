import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

import { Api } from '../core/services/api';
import { Feed } from '../core/services/feed';

import {
  send,
  close,
  heart,
  heartOutline,
  chatbubbleOutline,
  paperPlaneOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({
  'heart-outline': heartOutline,
  'send': send,

  'close': close,
  paperPlaneOutline

});

@Component({
  selector: 'app-comments',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],

  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {


  @Input() postId!: string;
  @Input() type: string = 'post';
  @Input() profileImage: string = '';


  comments:any[] = [];

  text='';

  contentId='';
  contentType='post';

  myProfileImage='';


  constructor(
    private api:Api,
    private modalCtrl:ModalController,private feedService: Feed
  ){}



  ngOnInit(){


   


    this.contentId=this.postId;
    this.contentType=this.type;
    this.myProfileImage=this.profileImage;


    this.getComments();

  }





  close(){

    this.modalCtrl.dismiss();

  }





  getComments(){


    let url =
    this.contentType==='reel'
    ?
    `/reels/${this.contentId}/comments`
    :
    `/posts/${this.contentId}/comments`;



    this.api.get<any>(url)
    .subscribe({

      next:(res)=>{


        this.comments =
        res.data.comments || [];


      },

      error:(err)=>{

        console.log(err);

      }


    });


  }






  addComment(){


    if(!this.text.trim())
    return;



    let url =
    this.contentType==='reel'
    ?
    `/reels/${this.contentId}/comments`
    :
    `/posts/${this.contentId}/comments`;




    this.api.post<any>(
      url,
      {
        text:this.text
      }
    )
    .subscribe({

      next:(res)=>{


        this.comments.unshift(
          res.data
        );


        this.text='';

        this.feedService.updateCommentCount(
    this.contentId,
    this.comments.length
  );


      },

      error:(err)=>{

        console.log(err);

      }

    })


  }






  // likeComment(comment:any){
  //   console.log(comment,'commet')


  //   this.api.post(
  //     `/comments/${comment.id}/like`,
  //     {}
  //   )
  //   .subscribe(()=>{


  //     comment.hasLiked =
  //     !comment.hasLiked;


  //     comment.likeCount =
  //     comment.hasLiked
  //     ?
  //     comment.likeCount+1
  //     :
  //     comment.likeCount-1;


  //   })


  // }

  likeComment(comment: any) {

  const url =
    this.contentType === 'reel'
      ? `/reels/${this.contentId}/comments/${comment.id}/like`
      : `/posts/${this.contentId}/comments/${comment.id}/like`;

  this.api.post<any>(url, {})
    .subscribe({

      next: (res) => {

        comment.hasLiked = res.data.liked;

        comment.likeCount = res.data.likeCount;

      },

      error: (err) => {

        console.log(err);

      }

    });

}






  replyTo(comment:any){

    console.log(
      "reply",
      comment
    );

  }





}
