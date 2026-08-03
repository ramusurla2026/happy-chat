import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Feed {
  
  private commentSource = new Subject<any>();

commentUpdated$ = this.commentSource.asObservable();

updateCommentCount(id: string, commentCount: number) {

  console.log('Emit =>', id, commentCount);

  this.commentSource.next({
    id,
    commentCount
  });

}

  private notificationCount = new BehaviorSubject<void>(undefined);

  notificationCount$ = this.notificationCount.asObservable();

  refreshNotificationCount() {
    this.notificationCount.next();
  }
}
