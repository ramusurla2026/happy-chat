import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class Loader {

  // private loader: HTMLIonLoadingElement | null = null;

  // private requestCount = 0;

  // private isCreating = false;

  // constructor(
  //   private loadingCtrl: LoadingController
  // ) {}

  // async show() {

  //   this.requestCount++;

  //   if (this.loader || this.isCreating) {
  //     return;
  //   }

  //   this.isCreating = true;

  //   this.loader = await this.loadingCtrl.create({
  //     message: 'Please wait...',
  //     spinner: 'crescent'
  //   });

  //   await this.loader.present();

  //   this.isCreating = false;

  // }

  // async hide() {

  //   if (this.requestCount > 0) {
  //     this.requestCount--;
  //   }

  //   if (this.requestCount > 0) {
  //     return;
  //   }

  //   if (!this.loader) {
  //     return;
  //   }

  //   try {

  //     await this.loader.dismiss();

  //   } catch (e) {

  //     console.log(e);

  //   }

  //   this.loader = null;

  // }

  isLoading = false;

  private requestCount = 0;

  show() {

    this.requestCount++;

    this.isLoading = true;

  }

  hide() {

    if (this.requestCount > 0) {

      this.requestCount--;

    }

    if (this.requestCount === 0) {

      this.isLoading = false;

    }

  }

}