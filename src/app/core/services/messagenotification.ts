import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Messagenotification {

  private readonly STORAGE_KEY = 'chat_unread_counts';

  private unreadCounts: { [conversationId: string]: number } = {};

  private unreadCountSubject =
    new BehaviorSubject<number>(0);

  unreadCount$ =
    this.unreadCountSubject.asObservable();


  constructor() {

    this.loadCounts();

  }


  private loadCounts() {

    try {

      const saved =
        localStorage.getItem(this.STORAGE_KEY);

      if (saved) {

        this.unreadCounts =
          JSON.parse(saved) || {};

      }

    } catch {

      this.unreadCounts = {};

    }

    this.emitTotal();

  }


  private saveCounts() {

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.unreadCounts)
    );

  }


  private emitTotal() {

    let total = 0;

    Object.keys(this.unreadCounts).forEach(id => {

      total += this.unreadCounts[id] || 0;

    });

    this.unreadCountSubject.next(total);

  }


  increase(conversationId: string) {

    if (!conversationId) {
      return;
    }

    this.unreadCounts[conversationId] =
      (this.unreadCounts[conversationId] || 0) + 1;

    this.saveCounts();

    this.emitTotal();

  }


  clearConversation(conversationId: string) {

    if (!conversationId) {
      return;
    }

    if (this.unreadCounts[conversationId]) {

      delete this.unreadCounts[conversationId];

      this.saveCounts();

      this.emitTotal();

    }

  }


  getCount(conversationId: string): number {

    return this.unreadCounts[conversationId] || 0;

  }


  getTotal(): number {

    let total = 0;

    Object.keys(this.unreadCounts).forEach(id => {

      total += this.unreadCounts[id] || 0;

    });

    return total;

  }

}
