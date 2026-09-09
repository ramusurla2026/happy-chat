import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  close,
  heartOutline,
  happyOutline,
  flameOutline,
  shareSocialOutline
} from 'ionicons/icons';

addIcons({
  close,
  'heart-outline': heartOutline,
  'happy-outline': happyOutline,
  'flame-outline': flameOutline,
  'share-social-outline': shareSocialOutline
});

@Component({
  selector: 'app-story-viewer',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon
  ],
  templateUrl: './story-viewer.page.html',
  styleUrls: ['./story-viewer.page.scss']
})
export class StoryViewerPage implements OnInit, OnDestroy {

  stories: any[] = [];
  user: any;

  currentIndex = 0;

  readonly STORY_DURATION = 5000;

  private storyTimer: any;

  constructor(
    private router: Router,
    private location: Location
  ) {

    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras?.state) {

      this.stories =
        navigation.extras.state['stories'] || [];

      this.user =
        navigation.extras.state['user'];
        console.log(this.user,'IMAGDE')
    }
  }

  ngOnInit(): void {

    if (this.stories.length > 0) {
      this.startStoryTimer();
    }
  }

  ngOnDestroy(): void {
    this.clearStoryTimer();
  }

  get currentStory() {
    return this.stories[this.currentIndex];
  }

  /**
   * Start timer for current story
   */
  startStoryTimer(): void {

    this.clearStoryTimer();

    this.storyTimer = setTimeout(() => {
      this.nextStory();
    }, this.STORY_DURATION);
  }

  /**
   * Clear existing timer
   */
  clearStoryTimer(): void {

    if (this.storyTimer) {
      clearTimeout(this.storyTimer);
      this.storyTimer = null;
    }
  }

  /**
   * Next story
   */
  nextStory(): void {

    this.clearStoryTimer();

    if (this.currentIndex < this.stories.length - 1) {

      this.currentIndex++;

      this.startStoryTimer();

    } else {

      this.goBack();
    }
  }

  /**
   * Previous story
   */
  previousStory(): void {

    this.clearStoryTimer();

    if (this.currentIndex > 0) {

      this.currentIndex--;

      this.startStoryTimer();

    } else {

      // Restart first story
      this.startStoryTimer();
    }
  }

  /**
   * Handle screen tap
   * Left side = previous
   * Right side = next
   */
  handleStoryTap(event: MouseEvent): void {

    const target = event.target as HTMLElement;

    // Don't trigger when clicking buttons/input
    if (
      target.closest('.bottom-bar') ||
      target.closest('.header')
    ) {
      return;
    }

    const screenWidth = window.innerWidth;
    const clickX = event.clientX;

    if (clickX < screenWidth / 2) {

      this.previousStory();

    } else {

      this.nextStory();
    }
  }

  goBack(): void {

    this.clearStoryTimer();

    this.location.back();
  }
}