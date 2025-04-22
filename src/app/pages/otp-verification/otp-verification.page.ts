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
  otp: string[] = ['', '', '', ''];
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    const userType = this.authService.getUserType(); // Get stored user type
    if (userType === '1') {
      this.router.navigate(['/admin-tabs/viewcomplain']); // Redirect to Sales Dashboard
    } else if (userType === '2') {
      const stored = localStorage.getItem('userData');
      let data = stored ? JSON.parse(stored) : null;
      if (data.is_otp_verified === "0") {
     
      } else {
        // this.isLoading = false;
        this.router.navigate(['/citizen-tabs/dashboard']);
      }
    }

  }
  moveNext(event: any, index: number) {
    const input = event.target;
    const value = input.value;
    if (value.length === 1 && index < 5) {
      const nextInput = input.nextElementSibling;
      if (nextInput) nextInput.focus();
    }
  }

  async verifyOtp() {

    const code = this.otp.join('');
    if (code.length !== 6) {
      this.showToast('Please enter all 4 digits.', 'danger');
      return;
    }
    const requestData = { otp: code };

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
