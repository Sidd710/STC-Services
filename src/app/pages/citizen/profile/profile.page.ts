import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/services/apiService';

@Component({
  selector: 'app-profile',
  standalone:false,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  constructor(
    private router: Router,
    private location:Location,private apiservice:ApiService
   
  ) {}

  goTo(path: string) {
    this.router.navigate([`/citizen-tabs/${path}`]);
  }

  async logout() {
    const payload = {
      type: localStorage.getItem("userType")
    };
    const res: any = await this.apiservice.post('auth/logout', payload).toPromise();
    if (res.status) {
      localStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
    } else {
      localStorage.clear();
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  
    localStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
  goBack() {
    this.location.back();
  }
}
