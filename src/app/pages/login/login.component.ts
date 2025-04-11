import { Component, OnInit } from '@angular/core';
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
  username = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController, private toastCtrl: ToastController,

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
  ngOnInit(): void {

    const isLoggedIn = !!localStorage.getItem('token');
    if (isLoggedIn) {
      const userType = this.authService.getUserType(); // Get stored user type
      if (userType === '1') {
        //this.router.navigate(['/merchant-dashboard']); // Redirect to Sales Dashboard
      } else if (userType === '2') {
        this.router.navigate(['/otp-verification']); // Redirect to Merchant Dashboard
      }
    }
  }

async onLogin() {
    const payload = {
      email_id: this.username,
      password: this.password,
      fcm_token: "1",
    }
    await this.presentLoading();
    //credentials = { email: '', password: '',fcm_token:'' };
    this.authService.login(payload).subscribe(
      (response: any) => {
        
        debugger;
      //  this.isLoading = false;
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
            // this.router.navigate(['/merchant-dashboard']);
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


