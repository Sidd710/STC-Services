import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-profile',
  
  templateUrl: './view-profile.page.html',
  standalone:false,
  styleUrls: ['./view-profile.page.scss'],
})
export class ViewProfilePage implements OnInit {
  user: any;
constructor(private location: Location){}
  ngOnInit() {
    const stored = localStorage.getItem('userData');
    this.user = stored ? JSON.parse(stored) : null;
  }
  goBack() {
    this.location.back();
  }
}
