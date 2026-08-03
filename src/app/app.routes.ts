import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },

  {
    path: 'welcome',
    loadComponent: () =>
      import('./pages/welcome/welcome.page')
        .then(m => m.WelcomePage)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page')
        .then(m => m.LoginPage)
  },

  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.page')
        .then(m => m.SignUpPage)
  },

  {
    path: 'verification-otp',
    loadComponent: () =>
      import('./pages/verification-otp/verification-otp.page')
        .then(m => m.VerificationOtpPage)
  },

  {
    path: 'profile-setup',
    loadComponent: () =>
      import('./pages/profile-setup/profile-setup.page')
        .then(m => m.ProfileSetupPage)
  },

  {
    path: 'yourfrom',
    loadComponent: () =>
      import('./pages/yourfrom/yourfrom.page')
        .then(m => m.YourfromPage)
  },

  {
    path: 'suggestfriends',
    loadComponent: () =>
      import('./pages/suggestfriends/suggestfriends.page')
        .then(m => m.SuggestfriendsPage)
  },

  // ================= Protected =================

  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./home/home.page')
        .then(m => m.HomePage)
  },

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./profile/profile.page')
        .then(m => m.ProfilePage)
  },

  {
    path: 'search',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./search/search.component')
        .then(m => m.SearchComponent)
  },

  {
    path: 'chat',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./chat/indox/indox.component')
        .then(m => m.IndoxComponent)
  },

  {
    path: 'conversation',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./chat/conversation/conversation.component')
        .then(m => m.ConversationComponent)
  },

  {
    path: 'create-options',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./create-options/create-options.page')
        .then(m => m.CreateOptionsPage)
  },

  {
    path: 'posts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./posts/posts.component')
        .then(m => m.PostsComponent)
  },

  {
    path: 'reels',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./reels/reels.page')
        .then(m => m.ReelsPage)
  },

  {
    path: 'reels/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./reels/reels.page')
        .then(m => m.ReelsPage)
  },

  {
    path: 'story-viewer',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./story-viewer/story-viewer.page')
        .then(m => m.StoryViewerPage)
  },

  {
    path: 'user-profile/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./user-profile/user-profile.component')
        .then(m => m.UserProfileComponent)
  },

  {
    path: 'follow-requests',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./Notifications/follow-request-page/follow-request-page.component')
        .then(m => m.FollowRequestPageComponent)
  },
  {
    path: 'followers',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./followers/followers.component')
        .then(m => m.FollowersComponent)
  },
  {
    path: 'following',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./following/following.component')
        .then(m => m.FollowingComponent)
  },
   {
    path: 'edit-profile/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./edit-profile/edit-profile.component')
        .then(m => m.EditProfileComponent)
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },

  // 👇 Invalid URL -> Login
  // {
  //   path: '**',
  //   redirectTo: 'login'
  // }

];