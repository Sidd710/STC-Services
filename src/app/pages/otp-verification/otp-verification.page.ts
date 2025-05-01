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
  otp: string[] = ['', '', '', '', '', ''];
  email: string = '';
  resendTimer: number = 60;
  isResendDisabled: boolean = true;
  intervalId: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.startResendCountdown();
    const userType = this.authService.getUserType();
    const stored = localStorage.getItem('userData');
    const userData = stored ? JSON.parse(stored) : null;

    if (userType === '1') {
      this.router.navigate(['/admin-tabs/viewcomplain']);
    } else if (userType === '2') {
      if (userData?.is_otp_verified === '1') {
        this.router.navigate(['/citizen-tabs/dashboard']);
      }
    }
  }
  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
  startResendCountdown() {
    this.resendTimer = 60;
    this.isResendDisabled = true;

    this.intervalId = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer === 0) {
        this.isResendDisabled = false;
        clearInterval(this.intervalId);
      }
    }, 1000);
  }


  moveNext(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    if (value.length === 1 && index < 5) {
      const nextInput = input.nextElementSibling;
      if (nextInput) nextInput.focus();
    } else if (!value && event.inputType === 'deleteContentBackward' && index > 0) {
      const prevInput = input.previousElementSibling;
      if (prevInput) prevInput.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text') || '';
    if (pasteData.length === 6 && /^\d{6}$/.test(pasteData)) {
      this.otp = pasteData.split('');
      setTimeout(() => {
        const lastInput = document.querySelectorAll('.otp-inputs input')[5] as HTMLElement;
        if (lastInput) lastInput.focus();
      }, 10);
    }
    event.preventDefault();
  }

  async verifyOtp() {
    const code = this.otp.join('');
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      this.showToast('Invalid OTP', 'danger');
      return;
    }

    const requestData = { otp: code };

    this.apiService.post('auth/verifyotp', requestData).subscribe(
      (response: any) => {
        if (response.status) {
          localStorage.setItem('userData', JSON.stringify(response.user_data));
          this.showToast('OTP verified successfully!', 'success');
          this.router.navigate(['/citizen-tabs/dashboard']);
        } else {
          this.showToast('Invalid OTP. Please try again.', 'danger');
        }
      },
      (error) => {
        console.error('API Error:', error);
        this.showToast('Please try after sometime', 'danger');
      }
    );
  }

  async resendOtp() {
    // Enable when service is ready
    // try {
    this.apiService.post('auth/sendotp', {}).subscribe(
      (response: any) => {
        debugger;
        if (response.status) {
          this.showToast('OTP resent to your number.', 'success');
          this.startResendCountdown();

        }
      });

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
