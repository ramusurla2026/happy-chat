import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from 'src/app/footer/footer.component';
import { IonicModule, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { Api } from 'src/app/core/services/api';
import { FormsModule } from '@angular/forms';

import { Subject, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  takeUntil
} from 'rxjs/operators';

import { addIcons } from 'ionicons';
import {
  menuOutline,
  searchOutline,
  notificationsOutline,
  addCircle,
  ellipsisHorizontal,
  heart,
  heartOutline,
  chatbubbleOutline,
  paperPlaneOutline,
  bookmark,
  bookmarkOutline,
  add,
  home,
  search,
  close,
  cameraOutline,
  imagesOutline,
  createOutline,
  arrowBackOutline,
} from 'ionicons/icons';

addIcons({
  menuOutline,
  searchOutline,
  notificationsOutline,
  addCircle,
  ellipsisHorizontal,
  heart,
  heartOutline,
  chatbubbleOutline,
  paperPlaneOutline,
  bookmark,
  bookmarkOutline,
  add,
  home,
  search,
  close,
  cameraOutline,
  imagesOutline,
  createOutline,
  arrowBackOutline,
});

@Component({
  selector: 'app-indox',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FooterComponent,
    FormsModule
  ],
  templateUrl: './indox.component.html',
  styleUrls: ['./indox.component.scss'],
})
export class IndoxComponent
  implements OnInit, ViewWillEnter, ViewWillLeave, OnDestroy {

  searchText = '';

  chats: any[] = [];

  allChats: any[] = [];

  userName!: string;

  private searchSubject = new Subject<string>();

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private api: Api
  ) { }

  ngOnInit() {

    this.searchSubject.pipe(

      debounceTime(500),

      distinctUntilChanged(),

      switchMap((value: string) => {

        if (!value.trim()) {

          return of({
            data: {
              conversations: [],
              friends: []
            }
          });

        }

        return this.api.get<any>(
          `/chat/search?q=${encodeURIComponent(value)}`
        ).pipe(

          catchError(() => {

            return of({
              data: {
                conversations: [],
                friends: []
              }
            });

          })

        );

      }),

      takeUntil(this.destroy$)

    ).subscribe({

      next: (res) => {

        const conversations = res.data.conversations || [];

        const friends = (res.data.friends || []).map((user: any) => ({

          conversationId: user.conversationId,

          otherUser: user,

          lastMessage: null,

          lastReadAt: null

        }));

        const merged = [

          ...conversations,

          ...friends

        ];

        // Remove duplicates
        this.chats = merged.filter(
          (item, index, self) =>
            index === self.findIndex(
              x => x.conversationId === item.conversationId
            )
        );

      },

      error: (err) => {

        console.log(err);

        this.chats = [];

      }

    });

  }

  refresh(event: any) {

  this.searchText = '';

  this.getMyProfile();

  this.api.get<any>('/chat/conversations')
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({

      next: (res) => {

        this.chats = res.data || [];

        this.allChats = [...this.chats];

        event.target.complete();

      },

      error: (err) => {

        console.log(err);

        event.target.complete();

      }

    });

}

  ionViewWillEnter() {

    this.getMyProfile();

    this.getConversations();

  }

  ionViewWillLeave() {

    this.searchText = '';

    this.chats = [];

    this.allChats = [];

    this.userName = '';

  }

  getMyProfile() {

    const userId = localStorage.getItem('user');

    if (!userId) {
      return;
    }

    this.api.get<any>(`/users/${userId}`)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (res) => {

          this.userName = res?.data?.username;

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  getConversations() {

    this.api.get<any>('/chat/conversations')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (res) => {

          this.chats = res.data || [];

          this.allChats = [...this.chats];

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  searchUsers() {
    if (!this.searchText.trim()) {

      this.getConversations();

      return;

    }

    this.searchSubject.next(this.searchText);

  }

  goSearch() {

    this.router.navigate(['/chat-search']);

  }

  openChat(chat: any) {

    this.router.navigate(
      ['/conversation'],
      {
        state: {
          conversationId: chat.conversationId,
          user: chat.otherUser
        }
      }
    );

  }

  goBack() {

    this.router.navigate(['/home']);

  }

  ngOnDestroy() {

    this.destroy$.next();

    this.destroy$.complete();

    this.searchSubject.complete();

  }

}