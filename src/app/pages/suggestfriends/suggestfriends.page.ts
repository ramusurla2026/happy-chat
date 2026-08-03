import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

interface SuggestedUser {
  id: number;
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  isFollowing: boolean;
}

@Component({
  selector: 'app-suggestfriends',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './suggestfriends.page.html',
  styleUrls: ['./suggestfriends.page.scss'],
})
export class SuggestfriendsPage {

  suggestedUsers: SuggestedUser[] = [
    {
      id: 1,
      name: 'Alex Jordan',
      handle: '@alex_jordan',
      bio: 'Product Designer & Travel Enthusiast',
      avatar: 'https://i.pravatar.cc/150?img=12',
      isFollowing: false,
    },
    {
      id: 2,
      name: 'Marcus Chen',
      handle: '@mchen_dev',
      bio: 'Software Architect & Coffee Geek',
      avatar: 'https://i.pravatar.cc/150?img=13',
      isFollowing: false,
    },
    {
      id: 3,
      name: 'Sarah Jenkins',
      handle: '@sarah_creates',
      bio: 'Digital Strategist & Yoga Teacher',
      avatar: 'https://i.pravatar.cc/150?img=14',
      isFollowing: false,
    },
    {
      id: 4,
      name: 'Julian Ross',
      handle: '@julian.r',
      bio: 'Startup Advisor & Writer',
      avatar: 'https://i.pravatar.cc/150?img=15',
      isFollowing: false,
    },
    {
      id: 5,
      name: 'Elena Vance',
      handle: '@elenav',
      bio: 'Photography & Visual Arts',
      avatar: 'https://i.pravatar.cc/150?img=16',
      isFollowing: false,
    },
  ];

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/yourfrom']);
  }

  skip() {
    this.router.navigate(['/home']);
  }

  toggleFollow(user: SuggestedUser) {
    user.isFollowing = !user.isFollowing;
  }

  continueToFeed() {
    this.router.navigate(['/home']);
  }
}