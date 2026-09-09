// import { Component, Input, OnInit } from '@angular/core';
// import { Router, NavigationEnd } from '@angular/router';
// import { IonicModule } from "@ionic/angular";
// import { addIcons } from 'ionicons';
// import {
//   menuOutline,
//   searchOutline,
//   notificationsOutline,
//   addCircle,
//   ellipsisHorizontal,
//   heart,
//   heartOutline,
//   chatbubbleOutline,
//   paperPlaneOutline,
//   bookmark,
//   bookmarkOutline,
//   add,
//   home,
//   search,
//   close,
//   cameraOutline,
//   imagesOutline,
//   videocamOutline
// } from 'ionicons/icons';

// addIcons({
//   menuOutline,
//   searchOutline,
//   notificationsOutline,
//   addCircle,
//   ellipsisHorizontal,
//   heart,
//   heartOutline,
//   chatbubbleOutline,
//   paperPlaneOutline,
//   bookmark,
//   bookmarkOutline,
//   add,
//   home,
//   search,
//   close,
//   cameraOutline,
//   imagesOutline,
//   videocamOutline

// });
// import { Auth } from '../core/services/auth';
// import { Api } from '../core/services/api';
// import { filter } from 'rxjs/operators';
// import { Messagenotification } from '../core/services/messagenotification';
// import { CommonModule } from '@angular/common';
// import { Socketservice } from '../core/services/socket';

// @Component({
//   selector: 'app-footer',
//   standalone: true,
//   imports: [IonicModule, CommonModule],
//   templateUrl: './footer.component.html',
//   styleUrls: ['./footer.component.scss'],
// })
// export class FooterComponent implements OnInit {
//   @Input() profileImage = '';
//   myProfileImage = '';
//   currentUrl = '';
//   unreadCount = 0;

//   constructor(private router: Router, private api: Api, private notificationService: Messagenotification, private auth: Auth, private socketservice: Socketservice) {
//     this.router.events
//       .pipe(
//         filter(event => event instanceof NavigationEnd)
//       )
//       .subscribe((event: any) => {

//         this.currentUrl = event.url;

//       });
//   }

//   isActive(url: string) {

//     return this.currentUrl.startsWith(url);

//   }

//   ngOnInit() {
//     this.notificationService.unreadCount$
//       .subscribe(count => {

//         this.unreadCount = count;

//       });
//     this.getMyProfile();

//     // Global socket connection
//     const token = this.auth.getAccessToken();

//     if (token) {

//       this.socketservice.connect(token);

//     }
//   }

//   getMyProfile() {

//     const userId = localStorage.getItem('user');

//     if (!userId) {
//       return;
//     }


//     this.api.get<any>(`/users/${userId}`)
//       .subscribe({

//         next: (res) => {

//           this.myProfileImage =
//             res.data.profileImage;

//         },


//         error: (err) => {

//           console.log(err);

//         }

//       });

//   }

//   goToHome() {
//     this.router.navigate(['/home']);
//   }

//   goToCreate() {
//     this.router.navigate(['/create-options']);
//   }

//   goToSearch() {
//     this.router.navigate(['/search']);
//   }

//   goToAlerts() {
//     this.router.navigate(['/alerts']);
//   }

//   goToProfile() {
//     this.router.navigate(['/profile']);
//   }

//   goToChat() {
//     this.router.navigate(['/chat']);
//   }

//   goToReels() {
//     this.router.navigate(['/reels']);
//   }

// }


import {
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  Router,
  NavigationEnd
} from '@angular/router';

import {
  IonicModule
} from '@ionic/angular';

import {
  CommonModule
} from '@angular/common';

import {
  Subject
} from 'rxjs';

import {
  filter,
  takeUntil
} from 'rxjs/operators';

import {
  addIcons
} from 'ionicons';

import {
  home,
  search,
  paperPlaneOutline,
  videocamOutline
} from 'ionicons/icons';

import {
  Auth
} from '../core/services/auth';

import {
  Api
} from '../core/services/api';

import {
  Messagenotification
} from '../core/services/messagenotification';

import {
  Socketservice
} from '../core/services/socket';


addIcons({

  home,

  search,

  paperPlaneOutline,

  videocamOutline

});


@Component({

  selector:
    'app-footer',

  standalone:
    true,

  imports: [

    IonicModule,

    CommonModule

  ],

  templateUrl:
    './footer.component.html',

  styleUrls:
    ['./footer.component.scss']

})


export class FooterComponent
  implements
    OnInit,
    OnDestroy {


  @Input()
  profileImage = '';


  myProfileImage = '';


  currentUrl = '';


  unreadCount = 0;


  private destroy$ =
    new Subject<void>();


  constructor(

    private router: Router,

    private api: Api,

    private notificationService:
      Messagenotification,

    private auth: Auth,

    private socketservice:
      Socketservice

  ) {


    this.router.events

      .pipe(

        filter(
          event =>
            event instanceof NavigationEnd
        ),

        takeUntil(
          this.destroy$
        )

      )

      .subscribe(
        (event: any) => {

          this.currentUrl =
            event.url;

        }
      );

  }


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit() {


    /**
     * Global unread count.
     *
     * clearConversation()
     * -> updateTotal()
     * -> unreadCount$
     * -> this.unreadCount
     * -> badge disappears
     */
    this.notificationService

      .unreadCount$

      .pipe(
        takeUntil(
          this.destroy$
        )
      )

      .subscribe(
        count => {

          this.unreadCount =
            count;

        }
      );


    this.getMyProfile();


    const token =
      this.auth.getAccessToken();


    if (token) {

      this.socketservice.connect(
        token
      );

    }

  }


  // =========================================================
  // ACTIVE TAB
  // =========================================================

  // isActive(
  //   url: string
  // ): boolean {

  //   return this.currentUrl
  //     .startsWith(url);

  // }
  isActive(url: string) {

  return this.currentUrl.startsWith(url);

}





  // =========================================================
  // PROFILE
  // =========================================================

  getMyProfile() {

    const userId =
      localStorage.getItem('user');


    if (!userId) {

      return;

    }


    this.api

      .get<any>(
        `/users/${userId}`
      )

      .pipe(
        takeUntil(
          this.destroy$
        )
      )

      .subscribe({

        next: (res) => {

          this.myProfileImage =
            res?.data?.profileImage ||
            '';

        },


        error: (err) => {

          console.log(
            'Profile error:',
            err
          );

        }

      });

  }


  // =========================================================
  // NAVIGATION
  // =========================================================

  goToHome() {

    this.router.navigate([
      '/home'
    ]);

  }


  goToCreate() {

    this.router.navigate([
      '/create-options'
    ]);

  }


  goToSearch() {

    this.router.navigate([
      '/search'
    ]);

  }


  goToAlerts() {

    this.router.navigate([
      '/alerts'
    ]);

  }


  goToProfile() {

    this.router.navigate([
      '/profile'
    ]);

  }


  goToChat() {

    this.router.navigate([
      '/chat'
    ]);

  }


  goToReels() {

    this.router.navigate([
      '/reels'
    ]);

  }


  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy() {

    this.destroy$.next();

    this.destroy$.complete();

  }
isConversationPage(): boolean {

  return this.currentUrl.startsWith(
    '/conversation'
  );

}
}