import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/apiService';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  standalone: false,
  styleUrls: ['./otp-verification.page.scss'],
})
export class OtpVerificationPage implements OnInit {
  otp: string = '';
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private apiService: ApiService
  ) { }

  ngOnInit() {
  
  }

  async verifyOtp() {


    const requestData = { otp: this.otp };

    this.apiService.post('auth/verifyotp', requestData).subscribe(
      (response: any) => {
        if (response.status) {
          this.showToast('OTP verified successfully!', 'success');
          this.router.navigate(['/citizen-tabs/dashboard']);
        } else {
          this.showToast('Invalid OTP. Please try again.', 'danger');
        }
      }
      ,
      (error) => {
        console.error('API Error:', error);
        this.showToast('Please try after sometime', 'danger');
      });

    
     
  }

  async resendOtp() {
    // try {
    //   const result = await this.authService.resendOtp(this.email);
    //   this.showToast('OTP resent to your email.', 'success');
    // } catch (error) {
    //   this.showToast('Failed to resend OTP. Try again.', 'danger');
    // }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    toast.present();
  }
}
