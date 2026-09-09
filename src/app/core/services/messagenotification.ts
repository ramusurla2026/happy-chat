// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class Messagenotification {

//   private readonly STORAGE_KEY = 'chat_unread_counts';

//   private unreadCounts: { [conversationId: string]: number } = {};

//   private unreadCountSubject =
//     new BehaviorSubject<number>(0);

//   unreadCount$ =
//     this.unreadCountSubject.asObservable();


//   constructor() {

//     this.loadCounts();

//   }


//   private loadCounts() {

//     try {

//       const saved =
//         localStorage.getItem(this.STORAGE_KEY);

//       if (saved) {

//         this.unreadCounts =
//           JSON.parse(saved) || {};

//       }

//     } catch {

//       this.unreadCounts = {};

//     }

//     this.emitTotal();

//   }


//   private saveCounts() {

//     localStorage.setItem(
//       this.STORAGE_KEY,
//       JSON.stringify(this.unreadCounts)
//     );

//   }


//   private emitTotal() {

//     let total = 0;

//     Object.keys(this.unreadCounts).forEach(id => {

//       total += this.unreadCounts[id] || 0;

//     });

//     this.unreadCountSubject.next(total);

//   }


//   increase(conversationId: string) {

//     if (!conversationId) {
//       return;
//     }

//     this.unreadCounts[conversationId] =
//       (this.unreadCounts[conversationId] || 0) + 1;

//     this.saveCounts();

//     this.emitTotal();

//   }


//   clearConversation(conversationId: string) {

//     if (!conversationId) {
//       return;
//     }

//     if (this.unreadCounts[conversationId]) {

//       delete this.unreadCounts[conversationId];

//       this.saveCounts();

//       this.emitTotal();

//     }

//   }


//   getCount(conversationId: string): number {

//     return this.unreadCounts[conversationId] || 0;

//   }


//   getTotal(): number {

//     let total = 0;

//     Object.keys(this.unreadCounts).forEach(id => {

//       total += this.unreadCounts[id] || 0;

//     });

//     return total;

//   }

// }



import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Messagenotification {

  /**
   * Unread count for each conversation
   *
   * Example:
   *
   * conversation1 -> 2
   * conversation2 -> 1
   *
   * Footer total = 3
   */
  private conversationUnread =
    new Map<string, number>();


  /**
   * Global unread count
   * used by FooterComponent
   */
  private unreadCountSubject =
    new BehaviorSubject<number>(0);


  /**
   * Footer subscribes to this
   */
  unreadCount$ =
    this.unreadCountSubject.asObservable();
  setActiveConversation: any;


  // =========================================================
  // INCREASE
  // =========================================================

  increase(conversationId: string) {

    if (!conversationId) {
      return;
    }


    const currentCount =
      this.conversationUnread.get(
        conversationId
      ) || 0;


    this.conversationUnread.set(
      conversationId,
      currentCount + 1
    );


    this.updateTotal();

  }


  // =========================================================
  // CLEAR ONE CONVERSATION
  // =========================================================

  clearConversation(
    conversationId: string
  ) {

    if (!conversationId) {
      return;
    }


    this.conversationUnread.delete(
      conversationId
    );


    /**
     * IMPORTANT
     *
     * Update footer immediately.
     */
    this.updateTotal();

  }


  // =========================================================
  // GET COUNT
  // =========================================================

  getCount(
    conversationId: string
  ): number {

    if (!conversationId) {
      return 0;
    }


    return (
      this.conversationUnread.get(
        conversationId
      ) || 0
    );

  }


  // =========================================================
  // GET TOTAL
  // =========================================================

  getTotalCount(): number {

    return this.unreadCountSubject.value;

  }


  // =========================================================
  // CLEAR EVERYTHING
  // =========================================================

  clearAll() {

    this.conversationUnread.clear();

    this.updateTotal();

  }


  // =========================================================
  // UPDATE TOTAL
  // =========================================================

  private updateTotal() {

    let total = 0;


    this.conversationUnread.forEach(
      count => {

        total += count;

      }
    );


    /**
     * This is what updates Footer badge.
     */
    this.unreadCountSubject.next(
      total
    );

  }

}