import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Api } from 'src/app/core/services/api';
import { arrowBackOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Feed } from 'src/app/core/services/feed';

addIcons({
  'arrow-back-outline': arrowBackOutline
});

@Component({
  selector: 'app-follow-request-page',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './follow-request-page.component.html',
  styleUrls: ['./follow-request-page.component.scss']
})
export class FollowRequestPageComponent implements OnInit {

  requests: any[] = [];

  constructor(
    private api: Api,
    private router: Router,private feedService: Feed
  ) { }

  ngOnInit() {
    this.getFollowRequests();
  }

  getFollowRequests() {

    this.api.get<any>('/users/follow-requests')
      .subscribe({

        next: (res) => {
          this.requests = res.data.requests || [];
        },

        error: console.error

      });

  }


 

  acceptRequest(request: any) {

    this.api.patch(
      `/users/follow-requests/${request.id}/accept`,
      {}
    )
      .subscribe(() => {

        this.requests =
          this.requests.filter(
            x => x.id !== request.id
          );
          this.feedService.refreshNotificationCount();
      });
     
      

  }


  rejectRequest(request: any) {
    this.api.patch(`/users/follow-requests/${request.id}/reject`, {})
      .subscribe({
        next: () => {
          this.requests = this.requests.filter(x => x.id !== request.id);
          this.feedService.refreshNotificationCount();
        }
      });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}