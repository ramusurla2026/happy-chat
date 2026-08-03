import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Loader } from 'src/app/core/services/loader';

@Component({
  selector: 'app-loader',
   standalone: true,
  imports: [
    CommonModule,
    
  ], 
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent  implements OnInit {

    constructor(public loader: Loader) {}

  ngOnInit() {}

}
