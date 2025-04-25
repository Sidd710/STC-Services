import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 
  error = '';
  isLoading = false;
  loginForm!: FormGroup;
  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController, private toastCtrl: ToastController,
    private fb: FormBuilder,
  ) { }
  loading: HTMLIonLoadingElement | null = null;
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Logging in...',
      spinner: 'circles'
    });
    await this.loading.present();
  }
  
  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
  ionViewWillEnter() {
    this.isLoading = false;
  }
  ngOnInit(): void {
    this.loading?.dismiss();
    debugger;
    const fcmToken = localStorage.getItem('FCMToken');

    this.loginForm = this.fb.group({
      email_id: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      fcm_token:fcmToken
    });

    const isLoggedIn = !!localStorage.getItem('token');
    if (isLoggedIn) {
      const userType = this.authService.getUserType(); // Get stored user type
      if (userType === '1') {
        this.router.navigate(['/admin-tabs/viewcomplain'], { replaceUrl: true }); // Redirect to Sales Dashboard
       
      } else if (userType === '2') {
        
        this.router.navigate(['/otp-verification'], { replaceUrl: true }); // Redirect to Merchant Dashboard
      }
    }
  }

async onLogin() {
   const fcmToken = localStorage.getItem('FCMToken');
   this.loginForm.value.fcm_token=fcmToken==null?"1":fcmToken;
  //   const payload = {
  //     email_id: this.loginForm.value.email_id,
  //     password: this.loginForm.value.password,
  //     fcm_token: fcmToken,
  //   }
    await this.presentLoading();
    //credentials = { email: '', password: '',fcm_token:'' };
    this.authService.login(this.loginForm.value).subscribe(
      (response: any) => {
        
        if (response.status) {
          // ✅ Success: Navigate to dashboard
          localStorage.setItem('userRole', response.usertype);
          localStorage.setItem('token', response.userdata.token);
          this.showToast('Login successful!', 'success');

          if (response.usertype === 2) {
            this.isLoading = false;
            // this.router.navigate(['/docList']);
            if (response.userdata.is_otp_verified === "0") {
              this.router.navigate(['/otp-verification']);
            } else {
              this.isLoading = false;
              this.router.navigate(['/citizen-tabs/dashboard']);
            }
          } else if (response.usertype === 1) {
            this.router.navigate(['/admin-tabs']); // Redirect to Sales Dashboard
          }
        } else {

          this.showToast(response.msg || 'Login failed!', 'danger');
        }
         this.dismissLoading();

      },
      err => {
        console.error(err);
          this.dismissLoading();

        this.showToast('Something went wrong.', 'danger');
      },
      
    );


  }
  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2500,
      color,
      position: 'top',
    });
    toast.present();
  }
}


