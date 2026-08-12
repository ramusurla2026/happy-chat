import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';


import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonAvatar,
  IonToggle,
  ToastController
} from '@ionic/angular/standalone';



import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  settingsOutline,
  logOutOutline,
  gridOutline,
  videocamOutline,
  personOutline,
  imagesOutline
} from 'ionicons/icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../core/services/api';
import { IonicModule } from '@ionic/angular';


addIcons({
  'arrow-back-outline': arrowBackOutline,
  'settings-outline': settingsOutline,
  'log-out-outline': logOutOutline,
  'grid-outline': gridOutline,
  'videocam-outline': videocamOutline,
  'person-outline': personOutline,
  'images-outline': imagesOutline
});

@Component({
  selector: 'app-edit-profile',
  standalone:true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonIcon,
    IonToggle
  ],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent  implements OnInit {

 profileForm!: FormGroup;

  isLoading = false;

  profileImage = '';
  id!: string;

  selectedImage: string | ArrayBuffer | null = null;

  selectedFile!: File;
  oldProfile:any;

  constructor(
    private fb: FormBuilder,
    private userService: Api,
    private toastController: ToastController, private route: ActivatedRoute,private location: Location
  ) {}

  ngOnInit() {
    this.createForm();
     this.id = this.route.snapshot.paramMap.get('id')!;
     this.getProfile()

  }

  createForm() {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      bio: [''],
      profession: [''],
      email: [{ value: '', disabled: true }],
      phone: [{ value: '', disabled: true }],
      isPrivate: [false]
    });
  }

  getProfile() {

  this.userService.get<any[]>(`/users/me`).subscribe({
    next: (res: any) => {

      const user = res.data;
       this.oldProfile = user;

      this.profileImage = user.profileImage;

      this.profileForm.patchValue({
        fullName: user.fullName,
        username: user.username,
        bio: user.bio,
        profession: user.profession,
        isPrivate: user.isPrivate
      });

    },
    error: (err) => {
      console.log(err);
    }
  });

}

goBack(){
this.location.back();
}

  onImageSelected(event: any) {

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImage = reader.result;
    };

    reader.readAsDataURL(file);
  }

 async saveProfile() {

  if (this.profileForm.invalid) {
    this.profileForm.markAllAsTouched();
    return;
  }


  const formData = new FormData();


  const value = this.profileForm.value;


  if (value.fullName !== this.oldProfile.fullName) {
    formData.append('fullName', value.fullName);
  }


  if (value.username !== this.oldProfile.username) {
    formData.append('username', value.username);
  }


  if (value.bio !== this.oldProfile.bio) {
    formData.append('bio', value.bio || '');
  }


  if (value.profession !== this.oldProfile.profession) {
    formData.append('profession', value.profession || '');
  }


  if (value.isPrivate !== this.oldProfile.isPrivate) {
    formData.append(
      'isPrivate',
      value.isPrivate ? 'true' : 'false'
    );
  }


  if (this.selectedFile) {
    formData.append(
      'profileImage',
      this.selectedFile
    );
  }




  this.userService
    .patch('/users/profile', formData)
    .subscribe({

      next: async (res:any)=>{

        this.isLoading = false;


        const toast =
        await this.toastController.create({

          message:'Profile updated successfully',

          duration:2000,

          color:'success'

        });


        toast.present();


      },


      error: async(err)=>{


        this.isLoading = false;


        console.log(err);


        const toast =
        await this.toastController.create({

          message:'Profile update failed',

          duration:2000,

          color:'danger'

        });


        toast.present();


      }

    });

}


}
