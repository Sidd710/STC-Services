import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-profile',
  
  templateUrl: './view-profile.page.html',
  standalone:false,
  styleUrls: ['./view-profile.page.scss'],
})
export class ViewProfilePage implements OnInit {
  user: any;

  ngOnInit() {
    const stored = localStorage.getItem('userData');
    this.user = stored ? JSON.parse(stored) : null;
  }
}
