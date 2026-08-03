import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  imageOutline,
  videocamOutline,
  addCircleOutline,
  arrowBackOutline,
  chevronForwardOutline
} from 'ionicons/icons';
import { Api } from '../core/services/api';

addIcons({
  'image-outline': imageOutline,
  'videocam-outline': videocamOutline,
  'add-circle-outline': addCircleOutline,
  'arrow-back-outline': arrowBackOutline,
  'chevron-forward-outline': chevronForwardOutline
});

@Component({
  selector: 'app-create-options',
  standalone: true,
  imports: [
    CommonModule,

    IonHeader,
    IonToolbar,
    
    

    IonContent,
    IonIcon
  ],
  templateUrl: './create-options.page.html',
  styleUrls: ['./create-options.page.scss']
})
export class CreateOptionsPage {
  selectedFiles: File[] = [];

  constructor(
    private router: Router, private apiservice: Api
  ) { }



  uploadFiles(event: any) {

    const files: FileList = event.target.files;

    this.selectedFiles = [];

    for (let i = 0; i < files.length; i++) {

      const file = files[i];

      if (
        file.type.startsWith('image/') ||
        file.type.startsWith('video/')
      ) {
        this.selectedFiles.push(file);
      }

    }

    console.log(this.selectedFiles);

    this.uploadPost();

  }

  // uploadPost() {

  //   if (this.selectedFiles.length === 0) {
  //     return;
  //   }

  //   const formData = new FormData();

  //   this.selectedFiles.forEach(file => {

  //     if (file.type.startsWith('image/')) {

  //       formData.append('images', file);

  //     } else if (file.type.startsWith('video/')) {

  //       formData.append('video', file);

  //     }

  //   });

  //   formData.append('caption', 'My Instagram Post');
  //   formData.append('isPrivate', 'false');

  //   this.apiservice.post('/content', formData)
  //     .subscribe({

  //       next: (res) => {
  //         this.router.navigate(['/home'], {
  //           replaceUrl: true,
  //           state: {
  //             refresh: true
  //           }
  //         });

  //       },

  //       error: (err) => {

  //         console.error(err);

  //       }

  //     });

  // }

  uploadPost() {

    if (this.selectedFiles.length === 0) {
      return;
    }


    const formData = new FormData();


    const firstFile = this.selectedFiles[0];


    // IMAGE POST

    if (firstFile.type.startsWith('image/')) {


      this.selectedFiles.forEach(file => {

        formData.append(
          'images',
          file
        );

      });


    }


    // VIDEO REEL

    else if (firstFile.type.startsWith('video/')) {


      formData.append(
        'video',
        firstFile
      );


    }



    formData.append(
      'caption',
      'My Instagram Post'
    );


    formData.append(
      'isPrivate',
      'false'
    );



    console.log('FORM DATA');

    formData.forEach((value, key) => {

      console.log(key, value);

    });



    this.apiservice.post(
      '/content',
      formData
    )
      .subscribe({

        next: (res) => {


          console.log(res);


          this.router.navigate(
            ['/home'],
            {
              replaceUrl: true,
              state: {
                refresh: true
              }
            }
          );


        },


        error: (err) => {

          console.log(err);

        }


      });


  }


  goBack() {
    this.router.navigate(['/home']);
  }

  createPost() {
    this.router.navigate(['/create-post']);
  }

  createReel() {
    this.router.navigate(['/create-reel']);
  }

  createStory() {
    this.router.navigate(['/create-story']);
  }



}