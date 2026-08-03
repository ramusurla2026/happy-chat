import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { Api } from 'src/app/core/services/api';

import {
  Subject,
  of,
  Subscription
} from 'rxjs';

import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError
} from 'rxjs/operators';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  searchOutline
} from 'ionicons/icons';

addIcons({
  'arrow-back-outline': arrowBackOutline,
  'search-outline': searchOutline
});

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  searchText = '';
users: any[] = [];

private searchSubject!: Subject<string>;
private searchSubscription!: Subscription;

  constructor(
    private router: Router,
    private api: Api
  ) { }

  ngOnInit() {
     this.initializeSearch();
  }

 initializeSearch() {

  this.searchSubject = new Subject<string>();

  this.searchSubscription = this.searchSubject.pipe(

    debounceTime(500),

    distinctUntilChanged(),

    switchMap((text: string) => {

      if (!text.trim()) {

        return of({
          data: {
            users: []
          }
        });

      }

      return this.api.get<any>(
        `/users/search?q=${encodeURIComponent(text)}&page=1&limit=20`
      ).pipe(

        catchError(() => {

          return of({
            data: {
              users: []
            }
          });

        })

      );

    })

  ).subscribe({

    next: (res) => {

      this.users = res.data.users || [];

    }

  });

}

searchUsers(event: Event) {

  const value = (event.target as HTMLInputElement).value;

  this.searchSubject.next(value);

}

  openProfile(user: any) {

    this.router.navigate(
      ['/user-profile', user.id],
      {
        state: {
          user
        }
      }
    );

  }

  goBack() {

    this.router.navigate(['/home']);

  }

 ionViewWillEnter() {

  this.searchText = '';
  this.users = [];

  if (this.searchSubscription) {
    this.searchSubscription.unsubscribe();
  }

  this.initializeSearch();

}

ionViewWillLeave() {

  this.searchText = '';
  this.users = [];

}

ngOnDestroy() {

  if (this.searchSubscription) {
    this.searchSubscription.unsubscribe();
  }

}

}