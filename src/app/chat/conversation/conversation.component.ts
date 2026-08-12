import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  ViewWillEnter,
  ViewWillLeave,
  ActionSheetController,
  ToastController,
  AlertController
} from '@ionic/angular';

import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonFooter,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  paperPlaneOutline,
  imageOutline,
  callOutline,
  videocamOutline,
  informationCircleOutline,
  trashOutline,
  ellipsisHorizontal,
  close
} from 'ionicons/icons';

import { Api } from 'src/app/core/services/api';
import { Auth } from 'src/app/core/services/auth';
import { Socketservice } from 'src/app/core/services/socket';

import { Subject, takeUntil } from 'rxjs';


addIcons({
  'arrow-back-outline': arrowBackOutline,
  'paper-plane-outline': paperPlaneOutline,
  'image-outline': imageOutline,
  'call-outline': callOutline,
  'videocam-outline': videocamOutline,
  'information-circle-outline': informationCircleOutline,
  'trash-outline': trashOutline,
  'ellipsis-horizontal': ellipsisHorizontal,
  'close': close
});


@Component({

  selector: 'app-conversation',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonFooter,
    IonSpinner,
    IonIcon
  ],

  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']

})


export class ConversationComponent implements
  OnInit,
  ViewWillEnter,
  ViewWillLeave,
  OnDestroy {


  @ViewChild('content')
  content!: IonContent;


  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;


  private destroy$ = new Subject<void>();


  user: any;

  conversationId = '';

  messages: any[] = [];

  message = '';

  selectedMedia: any;

  previewUrl = '';

  myId = '';

  myProfileImage = '';

  chatInfoMessage = '';



  constructor(

    private api: Api,

    private auth: Auth,

    private router: Router,

    private socket: Socketservice,

    private actionSheetCtrl: ActionSheetController,

    private toastCtrl: ToastController,

    private alertCtrl: AlertController

  ) {


    const state = history.state;

    this.user = state.user;

    this.conversationId = state.conversationId;

  }



  ngOnInit() {

    this.myId = this.getUserIdFromToken();

  }



  ionViewWillEnter() {


    const state = history.state;


    this.user = state.user;

    this.conversationId = state.conversationId;


    this.messages = [];

    this.message = '';

    this.previewUrl = '';

    this.selectedMedia = null;


    this.getMyProfile();


    if (this.conversationId) {

      this.getMessages();

    }


    this.connectSocket();


  }




  ionViewWillLeave() {


    this.socket.disconnect();


    this.messages = [];

    this.message = '';

    this.previewUrl = '';

    this.selectedMedia = null;


  }




  getUserIdFromToken() {


    const token = this.auth.getAccessToken();


    if (!token) {

      return '';

    }


    const payload = token.split('.')[1];


    return JSON.parse(atob(payload)).id;


  }





  getMyProfile() {


    const id = localStorage.getItem('user');


    if (!id) {

      return;

    }


    this.api.get<any>(`/users/${id}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: (res) => {

          this.myProfileImage =
            res.data.profileImage;

        }

      });


  }






  getMessages() {


    this.api.get<any>(
      `/chat/conversations/${this.conversationId}/messages`
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: (res) => {

          this.messages = res.data || [];


          setTimeout(() => {

            this.scrollBottom();

          }, 100);


        },

        error: (err) => {

          console.log(err);

        }

      });


  }





connectSocket() {

  const token = this.auth.getAccessToken();

  if (!token) {
    return;
  }


  this.socket.connect(token);



  this.socket.onMessage((socketData:any)=>{


    const newMessage = socketData.message;


    if(!newMessage){
      return;
    }



    // Already added check
    const exists = this.messages.some(
      m => m.id === newMessage.id
    );


    if(exists){
      return;
    }




    // Replace temporary message
    const tempIndex = this.messages.findIndex(
      m =>
      m.sending &&
      m.sender?.id === this.myId &&
      (

        // text
        m.content === newMessage.content

        ||

        // image/video
        (
          m.media?.length > 0 &&
          newMessage.media?.length > 0 &&
          m.media[0]?.mediaType === newMessage.media[0]?.mediaType
        )

      )
    );




    if(tempIndex !== -1){


      this.messages[tempIndex] = {

        ...newMessage,

        sending:false,

        failed:false

      };


      return;

    }





    this.messages.push(newMessage);


    this.scrollBottom();



  });


}





  trackByMessage(
    index: number,
    item: any
  ) {

    return item.id;

  }



sendMessage() {

  if (!this.message.trim() && !this.selectedMedia) {
    return;
  }


  const tempId = 'temp-' + Date.now();


  const text = this.message.trim();

  const media = this.selectedMedia;

  const preview = this.previewUrl;



  const tempMessage:any = {

    id: tempId,

    clientTempId: tempId,

    content: text,


    createdAt: new Date().toISOString(),


    sender: {
      id: this.myId
    },


    media: media
      ? [
          {
            mediaType: media.type.startsWith('image')
              ? 'image'
              : 'video',

            mediaUrl: preview
          }
        ]
      : [],


    sending: true,

    failed: false

  };



  // show instantly in UI
  this.messages.push(tempMessage);


  this.scrollBottom();




  // clear input
  this.message = '';

  this.selectedMedia = null;

  this.previewUrl = '';



  if (this.fileInput) {

    this.fileInput.nativeElement.value = '';

  }





  const formData = new FormData();


  formData.append(
    'recipientId',
    this.user.id
  );



  if(text){

    formData.append(
      'content',
      text
    );

  }



  if(media){

    formData.append(
      'file',
      media
    );

  }



  // send temp id to backend (optional but recommended)
  formData.append(
    'clientTempId',
    tempId
  );





  this.api.postWithoutLoader<any>(
    '/chat/send',
    formData
  )
  .pipe(
    takeUntil(this.destroy$)
  )
  .subscribe({



    next:(res)=>{


      if(!this.conversationId){

        this.conversationId =
        res.data.conversationId;

      }



      // Replace temp with server message
      if(res.data.message){


        Object.assign(
          tempMessage,
          res.data.message
        );


      }
      else{


        tempMessage.id =
        res.data.id;



        if(res.data.mediaUrl){


          tempMessage.media = [

            {
              mediaType: media?.type.startsWith('image')
                ? 'image'
                : 'video',

              mediaUrl: res.data.mediaUrl

            }

          ];


        }


      }




      tempMessage.sending = false;

      tempMessage.failed = false;



    },




    error: async(err)=>{


      tempMessage.sending = false;

      tempMessage.failed = true;



      const alert =
      await this.alertCtrl.create({

        header:'Message not sent',

        message:
        err?.error?.message ||
        'Unable to send your message.',

        buttons:['OK']

      });



      await alert.present();


    }



  });


}







  onKeyDown(event: KeyboardEvent) {


    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {


      event.preventDefault();


      this.sendMessage();


    }


  }








  selectMedia(event: any) {


    const file =
      event.target.files[0];



    if (!file) {

      return;

    }



    this.selectedMedia = file;


    this.previewUrl =
      URL.createObjectURL(file);



  }







  removeSelectedMedia() {



    if (this.previewUrl) {

      URL.revokeObjectURL(
        this.previewUrl
      );

    }



    this.previewUrl = '';


    this.selectedMedia = null;



    if (this.fileInput) {

      this.fileInput.nativeElement.value = '';

    }



  }







  async scrollBottom() {



    setTimeout(async () => {


      if (this.content) {


        await this.content.scrollToBottom(
          300
        );


      }


    }, 100);



  }








  isNewDate(
    current: any,
    previous: any
  ) {


    if (!previous) {

      return true;

    }


    return (

      new Date(current.createdAt)
        .toDateString()

      !==

      new Date(previous.createdAt)
        .toDateString()

    );


  }








  getChatDate(date: string) {



    const msgDate =
      new Date(date);



    const today =
      new Date();



    const yesterday =
      new Date();


    yesterday.setDate(
      today.getDate() - 1
    );



    if (
      msgDate.toDateString()
      ===
      today.toDateString()
    ) {

      return 'Today';

    }




    if (
      msgDate.toDateString()
      ===
      yesterday.toDateString()
    ) {

      return 'Yesterday';

    }




    return msgDate.toLocaleDateString(
      'en-US',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );



  }







  async openMessageOptions(msg: any) {



    if (
      msg.sender?.id !== this.myId
    ) {

      return;

    }




    const sheet =
      await this.actionSheetCtrl.create({


        buttons: [


          {

            text: 'Delete Message',

            role: 'destructive',

            icon: 'trash-outline',

            handler: () => {

              this.confirmDelete(msg);

            }

          },


          {

            text: 'Cancel',

            role: 'cancel'

          }


        ]

      });



    await sheet.present();


  }









  async confirmDelete(msg: any) {



    const alert =
      await this.alertCtrl.create({



        header: 'Delete message?',


        message:
          'This message will be removed from conversation.',



        buttons: [


          {

            text: 'Cancel',

            role: 'cancel'

          },


          {

            text: 'Delete',

            role: 'destructive',

            handler: () => {

              this.deleteMessage(msg);

            }

          }


        ]



      });



    await alert.present();


  }









  deleteMessage(msg: any) {



    this.api.delete<any>(
      `/chat/messages/${msg.id}`
    )
      .subscribe({



        next: async () => {



          this.messages =
            this.messages.filter(
              x => x.id !== msg.id
            );



          const toast =
            await this.toastCtrl.create({


              message: 'Message deleted',

              duration: 1500,

              color: 'success',

              position: 'bottom'


            });



          await toast.present();



        },



        error: async (err) => {



          const toast =
            await this.toastCtrl.create({


              message:
                err?.error?.message ||
                'Unable to delete message',


              duration: 2000,


              color: 'danger',


              position: 'bottom'


            });



          await toast.present();



        }



      });



  }







  goBack() {


    this.router.navigate([
      '/chat'
    ]);


  }






  ngOnDestroy() {


    this.destroy$.next();


    this.destroy$.complete();



    this.socket.disconnect();


  }



}