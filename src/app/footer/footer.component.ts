import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IonicModule } from "@ionic/angular";
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
  videocamOutline
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
  videocamOutline

});
import { Auth } from '../core/services/auth';
import { Api } from '../core/services/api';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @Input() profileImage = '';
  myProfileImage = '';
  currentUrl = '';

  constructor(private router: Router, private api: Api) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {

        this.currentUrl = event.url;

      });
  }

  isActive(url: string) {

    return this.currentUrl.startsWith(url);

  }

  ngOnInit() {
    this.getMyProfile();
  }

  getMyProfile() {

    const userId = localStorage.getItem('user');

    if (!userId) {
      return;
    }


    this.api.get<any>(`/users/${userId}`)
      .subscribe({

        next: (res) => {

          this.myProfileImage =
            res.data.profileImage;

        },


        error: (err) => {

          console.log(err);

        }

      });

  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToCreate() {
    this.router.navigate(['/create-options']);
  }

  goToSearch() {
    this.router.navigate(['/search']);
  }

  goToAlerts() {
    this.router.navigate(['/alerts']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToChat() {
    this.router.navigate(['/chat']);
  }

  goToReels() {
    this.router.navigate(['/reels']);
  }

}
