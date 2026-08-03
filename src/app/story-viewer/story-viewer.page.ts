import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  close,
  heartOutline,
  happyOutline,
  flameOutline,
  shareSocialOutline
} from 'ionicons/icons';


addIcons({

  close,

  'heart-outline':heartOutline,

  'happy-outline':happyOutline,

  'flame-outline':flameOutline,

  'share-social-outline':shareSocialOutline

});


@Component({

 selector:'app-story-viewer',

 standalone:true,

 imports:[
  CommonModule,
  IonContent,
  IonIcon
 ],

 templateUrl:'./story-viewer.page.html',

 styleUrls:['./story-viewer.page.scss']

})


export class StoryViewerPage {


 stories:any[]=[];

 user:any;

 currentIndex=0;


 constructor(
  private router:Router,
  private location:Location
 ){


 const navigation=this.router.getCurrentNavigation();


 if(navigation?.extras?.state){


   this.stories =
   navigation.extras.state['stories'] || [];


   this.user =
   navigation.extras.state['user'];


 }





 }



 get currentStory(){

   return this.stories[this.currentIndex];

 }



 nextStory(){

   if(this.currentIndex < this.stories.length-1){

     this.currentIndex++;

   }
   else{

     this.goBack();

   }

 }



 previousStory(){

   if(this.currentIndex>0){

    this.currentIndex--;

   }

 }



 goBack(){

   this.location.back();

 }


}
