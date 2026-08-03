import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LoaderComponent } from './shared/loader/loader.component';
import { Loader } from './core/services/loader';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet,LoaderComponent,CommonModule],
})
export class AppComponent {
  constructor(public loader: Loader) {}
}
