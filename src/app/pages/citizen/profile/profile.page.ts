import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone:false,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  constructor(
    private router: Router,
    private location:Location
   
  ) {}

  goTo(path: string) {
    this.router.navigate([`/citizen-tabs/${path}`]);
  }

  async logout() {
    
    localStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
  goBack() {
    this.location.back();
  }
}
