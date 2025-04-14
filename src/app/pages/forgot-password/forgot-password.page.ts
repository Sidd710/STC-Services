import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/apiService';

@Component({
  selector: 'app-forgot-password',
  standalone:false,
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  forgotForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private router: Router,private apiservice:ApiService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    this.submitted = true;

    if (this.forgotForm.invalid) {
      this.showToast('Please enter a valid email address.', 'danger');
      return;
    }

    const payload = {
      email_id: this.forgotForm.value.email
    };

    try {
      const res: any = await this.apiservice.post('auth/forgotpassword', payload).toPromise();
      if (res.status) {
        this.showToast(res.msg || 'Password reset email sent.', 'success');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      } else {
        this.showToast(res.msg || 'Failed to process request.', 'danger');
      }
    } catch (err) {
      this.showToast('Something went wrong.', 'danger');
    }
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
  }
}
