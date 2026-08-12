import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class Loader {


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